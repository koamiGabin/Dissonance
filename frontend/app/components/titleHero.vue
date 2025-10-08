<template>
    <div
        class="hero min-h-screen"
        style="background-image: url(https://media.istockphoto.com/id/1499543271/vector/red-falling-arrow-pixels-digital-screen.jpg?s=612x612&w=0&k=20&c=rT-wd2q9dYlKDwQehQe57bnydda54ZE31ufx93DEtkQ=);"
        >
        <div class="hero-overlay"></div>
        <div class="hero-content text-neutral-content text-center flex-col">
            <h1 class="mb-5 text-6xl font-bold">Dissonance</h1>
            <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xl h-80 gap-4 border p-4 m-auto">
                <legend class="fieldset-legend">Login</legend>

                <label class="label">Lobby Room</label>
                <input v-model="lobby" class="input w-auto" placeholder="Room number please ..." />

                <label class="label">Nickname</label>
                <input v-model="nickname" class="input w-auto" placeholder="Slim Shady" />

                <button class="btn btn-neutral mt-4" @click="startPlaying">Start Playing</button>
            </fieldset>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

// Persistent storage
const nickname = useStorage('nickname', '')
const lobby = useStorage('lobby', '')

const router = useRouter()

const startPlaying = () => {
  if (!nickname.value.trim() || !lobby.value.trim()) {
    alert('Please enter both a nickname and lobby room!')
    return
  }

  // Save to session and navigate
  nickname.value = nickname.value.trim()
  lobby.value = lobby.value.trim()

  router.push('/jouer')
}
</script>