import { Server } from 'socket.io'
import { defineNitroPlugin } from '#imports'
import { eventHandler, H3Event } from 'h3'

export default defineNitroPlugin((nitroApp) => {
  // Create Socket.IO server
  const io = new Server({
    cors: { origin: '*' },
  })
  // Attach Socket.IO to H3 / Nitro via /socket.io route
  nitroApp.h3App.use(
    '/socket.io',
    eventHandler((event: H3Event) => {
      // Socket.IO expects raw Node request/response
      // H3 wraps them in event.node
      // @ts-ignore
      io.attach(event.node.req, event.node.res)
      return '' // required by H3
    })
  )

  io.on('connection', (socket) => {
    console.log('Client connected', socket.id)

    socket.on('join-lobby', (lobbyId: string) => {
      console.log("ARE WE EVEN HERE")
      socket.join(lobbyId)
      console.log(`${socket.id} joined ${lobbyId}`)
    })

    socket.on('send-message', ({ lobbyId, message }) => {
      console.log("je reçois un message")
      io.to(lobbyId).emit('receive-message', { sender: socket.id, message })
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`)
    })
  })

  // Cleanly close server on shutdown
  nitroApp.hooks.hook('close', () => {
    io.close()
  })

  console.log('Socket.IO server ready')
})
