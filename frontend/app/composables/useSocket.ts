import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

const socket = ref<Socket | null>(null)

export function useSocket() {
  const connect = () => {
    socket.value = io('http://localhost:3001', { transports: ['websocket'] })

    socket.value.on('connect', () => {
      console.log('✅ Connected to Socket.IO as', socket.value?.id)
      onMessage((data) => console.log('📩 Received:', data))
    })

    socket.value.on('connect_error', (err) => {
      console.error('❌ Connection error:', err.message)
    })
  }

  const sendMessage = (player: string, message: string) => {
    socket.value?.emit('send-message', { player, message })
  }

  const joinLobby = (lobbyId: string) => {
    console.log("we emit a joinLobby : ", lobbyId)
    socket.value?.emit("join-lobby", lobbyId)
  }


  const onMessage = (callback: (data: any) => void) => {
    socket.value?.on('receive-message', callback)
  }

  const onHistory = (callback: (history: any[]) => void) => {
    console.log("we are getting the histo yo")
    socket.value?.on("chat-history", callback)
  }


  return { connect, socket, sendMessage, onMessage, joinLobby, onHistory }
}
