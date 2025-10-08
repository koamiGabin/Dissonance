import { Server } from 'socket.io'

const io = new Server({
  cors: { origin: '*' },
})

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id)

  socket.on('join-lobby', (lobbyId: string) => {
    console.log(`🧩 ${socket.id} joined lobby ${lobbyId}`)
    socket.join(lobbyId)
  })

  socket.on('send-message', ({  player, message }) => {
    console.log({'message well received': message})
    io.emit('receive-message', { sender: player, message: message })
  })

  socket.on('disconnect', () => {
    console.log(`❌ ${socket.id} disconnected`)
  })
})

io.listen(3001)
console.log('🚀 Socket.IO server running on port 3001')
