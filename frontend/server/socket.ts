import { Server } from 'socket.io'

interface Message {
  sender: string
  message: string
}

interface Lobby {
  id: string
  messages: Message[]
  timeout?: NodeJS.Timeout
}

const lobbies = new Map<string, Lobby>()

const io = new Server({
  cors: { origin: '*' },
})

const getOrCreateLobby = (id: string): Lobby => {
  if (!lobbies.has(id)) {
    const lobby: Lobby = { id, messages: [] }
    lobby.timeout = setTimeout(() => {
      console.log(`⌛ Lobby ${id} expired`)
      lobbies.delete(id)
    }, 62 * 60 * 1000)
    lobbies.set(id, lobby)
    console.log(`🆕 Created lobby ${id}`)
  }
  return lobbies.get(id)!
}

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id)

  socket.on('join-lobby', (lobbyId: string) => {
    console.log({'lobby creation ordered with id :': lobbyId})
    const lobby = getOrCreateLobby(lobbyId)

    socket.join(lobbyId)
    console.log(`🧩 ${socket.id} joined lobby ${lobbyId}`)

    socket.emit("chat-history", lobby.messages)
  })

  socket.on('send-message', ({ player, message }) => {
    const [ , lobbyId ] = Array.from(socket.rooms)

    if (!lobbyId) {
      console.warn(`⚠️ Socket ${socket.id} not in a lobby`)
      return
    }

    const lobby = getOrCreateLobby(lobbyId)
    const msg = { sender: player, message }

    lobby.messages.push(msg)
    io.to(lobbyId).emit('receive-message', msg)
  })

  socket.on('disconnect', () => {
    console.log(`❌ ${socket.id} disconnected`)
  })
})

io.listen(3001)
console.log('🚀 Socket.IO server running on port 3001')
