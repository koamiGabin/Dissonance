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

  const onMessage = (callback: (data: any) => void) => {
    console.log("we got something here")
    socket.value?.on('receive-message', callback)
  }


  return { connect, socket, sendMessage, onMessage }
}
