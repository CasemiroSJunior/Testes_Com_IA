import app from './app'
import prisma from './prisma'

const port = process.env.PORT ? Number(process.env.PORT) : 3000

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
  console.log(`Docs da api em http://localhost:${port}/docs`)
})

const gracefulShutdown = async () => {
  console.log('Shutting down...')
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

export { app, prisma }