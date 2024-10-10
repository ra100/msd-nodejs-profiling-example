import fastify from 'fastify'
import {Writable, Transform, Readable} from 'stream'
import {setTimeout, setImmediate} from 'timers/promises'
import {Worker} from 'worker_threads'
import os from 'os'

const DATA_LENGTH = 100_000
const DATA_PROCESS_ITERATION = 1_000
const CHUNK_SIZE = 1_000

const app = fastify({logger: true})

const doSomeCalculation = (value: number): number => {
  let result = value
  for (let i = 0; i < DATA_PROCESS_ITERATION; i++) {
    value = Math.sqrt(value * Math.random())
  }
  return value
}

const getInitialArray = (): number[] => Array(DATA_LENGTH).fill(1)

const processDataSync = (): number[] => {
  const array = getInitialArray()

  const result = array.map(value => doSomeCalculation(value))

  return result
}

const processDataAsync = async (): Promise<number[]> => {
  const array = getInitialArray()

  const result = await Promise.all(
    array.map(value => Promise.resolve(doSomeCalculation(value)))
  )

  return result
}

const processDataImmediate = async (): Promise<number[]> => {
  const array = getInitialArray()

  const result: number[] = []
  for (let index = 0; index < array.length; index++) {
    const value = array[index]
    result.push(doSomeCalculation(value))
    if (index % CHUNK_SIZE === 0) {
      await setImmediate()
    }
  }

  return result
}

const processDataStream = (): Promise<number[]> => {
  const array = getInitialArray()

  const calculationTransform = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk: number, _encoding, callback) {
      const result = doSomeCalculation(chunk)
      callback(null, result)
    },
  })

  const result: number[] = []

  const writableStream = new Writable({
    objectMode: true,
    write(chunk, _encoding, callback) {
      result.push(chunk)
      callback()
    },
  })

  Readable.from(array).pipe(calculationTransform).pipe(writableStream)

  return new Promise((resolve, reject) => {
    writableStream.on('finish', () => {
      resolve(result)
    })
    writableStream.on('error', reject)
  })
}

const processDataChunks = async (): Promise<number[]> => {
  const array = getInitialArray()

  const result: number[] = []
  let chunk = array.splice(0, CHUNK_SIZE)
  while (chunk.length > 0) {
    const chunkResult = await Promise.resolve(
      chunk.map(value => doSomeCalculation(value))
    )
    result.push(...chunkResult)
    chunk = array.splice(0, CHUNK_SIZE)
  }

  return result
}

const workers: Worker[] = []
let index = 0

// create workers on demand and/or return existing worker
const getWorker = (): Worker => {
  if (workers.length === 0) {
    const workerUrl = new URL('./worker.mts', import.meta.url)
    for (let i = 0; i < os.cpus().length; i++) {
      workers.push(new Worker(workerUrl))
    }
  }

  return workers[index++ % workers.length]
}

const processDataInWorker = async () => {
  return new Promise((resolve, reject) => {
    try {
      const worker = getWorker()
      const id = Date.now() + Math.random()

      worker.postMessage({type: 'processData', data: getInitialArray(), id})

      worker.on('message', event => {
        if (event.type === 'syncResult' && event.id === id) {
          resolve(event.data)
        }
      })
      worker.on('error', error => {
        reject(error)
      })
    } catch (error) {
      reject(error)
    }
  })
}

app.get('/process-data-sync', async () => {
  const result = processDataSync()
  return result
})

app.get('/process-data-async', async () => {
  const result = await processDataAsync()
  return result
})

app.get('/process-data-stream', async () => {
  const result = processDataStream()
  return result
})

app.get('/process-data-immediate', async () => {
  const result = await processDataImmediate()
  return result
})

app.get('/process-data-chunks', async () => {
  const result = await processDataChunks()
  return result
})

app.get('/process-data-worker', async () => {
  const result = await processDataInWorker()
  return result
})

const getPongResponse = async () => {
  await setTimeout(10)
  return {pong: 'pong', rand: Math.random()}
}

app.get('/ping', async () => {
  return getPongResponse()
})

// Start server
app.listen({port: 3000}, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`Server listening at ${address}`)
  process.on('exit', () => {
    if (workers.length > 0) {
      workers.forEach(worker => worker.terminate())
    }
  })
})
