import fastify from 'fastify'
import yieldable from 'yieldable-json'

const {stringifyAsync} = yieldable

const largeObject = (() => {
  let largeObject = {}
  for (let i = 0; i < 5_000_000; i++) {
    largeObject[`key${i}`] = `value${i}`
  }
  return largeObject
})()

export const stringify = (value: object): Promise<string> =>
  new Promise((resolve, reject) => {
    stringifyAsync(value, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })

const app = fastify({logger: true})

// Simulate sending a large JSON object with unnecessary processing
app.get('/large-response', async () => {
  const jsonString = await stringify(largeObject)

  return jsonString
})

app.get('/ping', async () => {
  return {ping: 'pong'}
})

// Start server
app.listen({port: 3000}, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`Server listening at ${address}`)
})
