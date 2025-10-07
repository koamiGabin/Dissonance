<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">Lobby {{ lobbyId }}</h1>

    <div class="space-y-2 mb-4">
        <div class="p-2 bg-base-200 rounded">
            <strong>michel</strong>: hello
        </div>
        <div
            v-for="(msg, i) in messages"
            :key="i"
            class="p-2 bg-base-200 rounded"
        >
            <strong>{{ msg.sender }}</strong>: {{ msg.message }}
        </div>
    </div>

    <input
      v-model="input"
      @keyup.enter="send"
      placeholder="Type message..."
      class="input input-bordered w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSocket } from '~/composables/useSocket'

const { connect, joinLobby, sendMessage, onMessage } = useSocket()

const lobbyId = 'escape-room-42'
const input = ref('')
const messages = ref<{ sender: string; message: string }[]>([])

onMounted(async () => {
  await connect()
  console.log("yesyes")
  joinLobby(lobbyId)
  onMessage((data) => messages.value.push(data))
})

function send() {
  if (!input.value.trim()) return
  sendMessage(lobbyId, input.value)
  input.value = ''
}

</script>
