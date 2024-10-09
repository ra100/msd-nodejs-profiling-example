// Utility function to generate a large object
export const generateLargeObject = () => {
  let largeObject = {}
  for (let i = 0; i < 1e5; i++) {
    largeObject[`key${i}`] = `value${i}`
  }
  return largeObject
}
