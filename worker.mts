import {parentPort} from 'worker_threads'

const DATA_PROCESS_ITERATION = 1_000

const doSomeCalculation = (value: number): number => {
  let result = value
  for (let i = 0; i < DATA_PROCESS_ITERATION; i++) {
    value = Math.sqrt(value * Math.random())
  }
  return value
}

const processDataSync = (data: number[]): number[] =>
  data.map(value => doSomeCalculation(value))

parentPort?.on(
  'message',
  (event: {type: string; data: number[]; id: number}) => {
    const {type, data, id} = event

    if (type === 'processData') {
      const syncResult = processDataSync(data)
      parentPort?.postMessage({type: 'syncResult', data: syncResult, id})
    }
  }
)
