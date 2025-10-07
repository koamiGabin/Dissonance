import { io, type Socket } from 'socket.io-client'
import { ref, onUnmounted } from 'vue'

export const useSocket = () => {
  const socket = ref<Socket | null>(null)

  const connect = () => {
    socket.value = io('/socket.io', { transports: ['websocket'] })

    socket.value.on('connect', () => {
      console.log('Connected to Socket.IO', socket.value?.id)
    })
  }

  const joinLobby = (lobbyId: string) => {
    console.log("ON ESSAYE DE JOIN")
    socket.value?.emit('join-lobby', lobbyId)
  }

  const sendMessage = (lobbyId: string, message: string) => {
    console.log({
      msg: "Jenvoie un msg ta",
      lobbyId: lobbyId,
      message: message
    })
    socket.value?.emit('send-message', { lobbyId, message })
  }

  const onMessage = (callback: (data: any) => void) => {
    socket.value?.on('receive-message', callback)
  }

  onUnmounted(() => {
    socket.value?.disconnect()
  })

  return { socket, connect, joinLobby, sendMessage, onMessage }
}
