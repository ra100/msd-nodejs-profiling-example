import fastify from 'fastify'

const largeObject = (() => {
  let largeObject = {}
  for (let i = 0; i < 5_000_000; i++) {
    largeObject[`key${i}`] = `value${i}`
  }
  return largeObject
})()

const app = fastify({logger: true})

// Simulate sending a large JSON object with unnecessary processing
app.get('/large-response', async () => {
  const jsonString = JSON.stringify(largeObject)

  return jsonString
})

app.get('/ping', async () => {
  return {ping: 'pong'}
})

// Start server
app.listen({port: 3001}, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`Server listening at ${address}`)
})
