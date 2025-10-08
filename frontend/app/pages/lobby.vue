<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">Lobby {{ lobbyId }}</h1>

    <div class="space-y-2 mb-4">

        <div
            v-for="(msg, i) in messages"
            :key="i"
            :class= "msg.sender == 'player 1' ? 'p-2 bg-base-200 rounded' : 'p-2 bg-base-200 rounded text-right'"
        >
            <strong>{{ msg.sender }}</strong>: {{ msg.message }}
        </div>
    </div>

    <input
      v-model="input"
      @keyup.enter="send()"
      placeholder="Type message..."
      class="input input-bordered w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSocket } from '~/composables/useSocket'

const { connect, sendMessage, onMessage } = useSocket()

const lobbyId = 'escape-room-42'
const input = ref('')
let playerRandom = 'player 1'
const messages = ref<{ sender: string; message: string }[]>([])

onMounted(() => {
  connect()
  onMessage((data) => messages.value.push(data))
})

const send = () => {
    if (!input.value.trim()) return
    sendMessage(playerRandom, input.value)
    input.value = ''
    playerRandom == 'player 1'? playerRandom = 'player 2' : playerRandom = 'player 1'
}


</script>
