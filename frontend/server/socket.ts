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

// Multi lobby
const lobbies = new Map<string, Lobby>()

const io = new Server({
  cors: { origin: '*' },
})

/**
 * Create or get a lobby
 */
const getOrCreateLobby = (id: string) : Lobby => {
  if (!lobbies.has(id)) {
    const lobby: Lobby = { id, messages: [] }

    // auto-delete after 1h + 2 mins
    lobby.timeout = setTimeout(() => {
      console.log(`⌛ Lobby ${id} expired`)
      lobbies.delete(id)
    }, 62 * 60 * 1000)

    lobbies.set(id, lobby)
    console.log(`🆕 Created lobby ${id}`)
  } else {
    console.log (`lobby ${id} joinned`)
  }

  return lobbies.get(id)!
}

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id)

  socket.on('send-message', ({  player, message, lobbyId }) => {
    console.log({'message well received': message})
    const lobby = getOrCreateLobby(lobbyId)
    lobby.messages.push({sender: player, message})

    io.emit('receive-message', { sender: player, message: message })
  })

  socket.on('disconnect', () => {
    console.log(`❌ ${socket.id} disconnected`)
  })

  socket.on('join-lobby', (lobbyId: string) => {
    console.log({'lobby creation ordered with id :': lobbyId})
    const lobby = getOrCreateLobby(lobbyId)

    // Join the Socket.IO room
    socket.join(lobbyId)
    console.log("trying to forward histo", lobby.messages[0])

    //histo emission
    socket.emit("chat-history", lobby.messages)

  })

})

io.listen(3001)
console.log('🚀 Socket.IO server running on port 3001')
