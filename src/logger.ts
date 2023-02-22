export const logInfo = (message: string, data: unknown) =>
  console.log(JSON.stringify({ message, data }))
export const logError = (message: string, data: unknown) =>
  console.error(JSON.stringify({ message, data }))
