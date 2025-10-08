<script setup lang="ts">
import { useHint } from '../../composables/useHint'

type Room = { id: number; name: string }

const props = withDefaults(defineProps<{ lobbyId?: string }>(), { lobbyId: 'L-TEST' })

// data
const rooms = ref<Room[]>([])
const selectedRoomId = ref<number>(0)
const question = ref('')
const hint = ref('')
const msg = ref('')

// hint composable
const { askHint, loading, remaining, remainingLabel, loadCooldown } = useHint()

// labels
const currentRoomLabel = computed(
  () => rooms.value.find(r => r.id === selectedRoomId.value)?.name ?? 'Aucune salle'
)

const cacheKey = computed(
  () => `hintCache:${props.lobbyId}:${selectedRoomId.value || 'X'}`
)

function loadCache() {
  if (!process.client) return
  try {
    const raw = localStorage.getItem(cacheKey.value)
    if (!raw) return
    const data = JSON.parse(raw)
    if (typeof data?.q === 'string') question.value = data.q
    if (typeof data?.h === 'string') hint.value = data.h
  } catch { /* ignore */ }
}
function saveCache() {
  if (!process.client) return
  try {
    const data = { q: question.value, h: hint.value, ts: Date.now() }
    localStorage.setItem(cacheKey.value, JSON.stringify(data))
  } catch { /* ignore */ }
}
function clearCache() {
  if (!process.client) return
  localStorage.removeItem(cacheKey.value)
}

// Save on edits (lightweight; no debounce needed here)
watch([question, hint], () => saveCache())

// When room changes, load its cache
watch(selectedRoomId, () => {
  loadCache()
  // also save the selected room for convenience
  if (process.client) localStorage.setItem(`hintSelectedRoom:${props.lobbyId}`, String(selectedRoomId.value))
})

// Auto-clear when cooldown is finished
watch(remaining, (sec) => {
  if (sec === 0) {
    // keep the question if you prefer; here we clear both
    clearCache()
  }
})

const LS_ROOM = (lobbyId: string) => `hintSelectedRoom:${lobbyId}`

onMounted(async () => {
  loadCooldown(props.lobbyId!)
  const res = await $fetch<{ rooms: Room[] }>('/api/rooms')
  rooms.value = res.rooms || []

  if (process.client) {
    const saved = localStorage.getItem(LS_ROOM(props.lobbyId!))
    if (saved) selectedRoomId.value = Number(saved)
  }

  // load cached question/hint for initial room (if any)
  loadCache()
})

// ---------- ACTION: Choisis une salle dans le menu déroulant et pose la question ----------
async function demanderIndice() {
  msg.value = ''
  hint.value = ''
  saveCache()

  if (!selectedRoomId.value) {
    msg.value = 'Choisis ta salle avant de demander un indice.'
    return
  }

  const res = await askHint({
    lobbyId: props.lobbyId!,
    roomId: selectedRoomId.value,
    question: question.value
  })

  if (res.ok) {
    hint.value = res.hint
    saveCache() // persist the received hint
  } else {
    msg.value = res.message || 'Indice indisponible pour le moment.'
  }
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">Centre d'indices</h2>
      <span v-if="selectedRoomId" class="badge badge-neutral text-xs">{{ currentRoomLabel }}</span>
    </div>

    <div class="form-control">
      <label class="label"><span class="label-text text-sm">Sélectionne ta salle</span></label>
      <select v-model.number="selectedRoomId" class="select select-sm select-bordered w-full">
        <option disabled value="0">— Choisir une salle —</option>
        <option v-for="r in rooms" :key="r.id" :value="r.id">{{ r.name }}</option>
      </select>
      <small class="opacity-70 mt-1">Obligatoire pour recevoir un indice adapté.</small>
    </div>

    <div>
      <label class="block text-sm opacity-80 mb-2">Question au maître du jeu :</label>
      <textarea v-model="question" rows="4" class="w-full border rounded p-2 bg-white/5"
        placeholder="Décris précisément ce qui te bloque dans la salle." />
    </div>

    <div class="flex items-center gap-3">
      <button
        :disabled="loading || remaining > 0 || !selectedRoomId || !question.trim()"
        @click="demanderIndice"
        class="btn btn-primary btn-sm normal-case"
      >
        Demander un indice
      </button>

      <span v-if="remaining > 0" class="text-xs opacity-70">
        Prochain indice dans ~ {{ remainingLabel }}
      </span>
    </div>

    <p v-if="hint" class="p-3 rounded bg-green-900/30 border border-green-700/40 text-sm whitespace-pre-wrap">
      <strong>Indice :</strong> {{ hint }}
    </p>
    <p v-if="msg" class="p-3 rounded bg-yellow-900/30 border border-yellow-700/40 text-sm">
      {{ msg }}
    </p>
  </div>
</template>
