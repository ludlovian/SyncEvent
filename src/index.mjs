export default function SyncEvent () {
  const queue = []
  let isSet = false
  const wait = async () => {
    if (!isSet) return new Promise(resolve => queue.push(resolve))
    isSet = false
  }
  const set = () => {
    if (!isSet && queue.length) return queue.shift()()
    isSet = true
  }
  const exec = async fn => {
    try {
      await wait()
      return await fn()
    } finally {
      set()
    }
  }
  return Object.defineProperties(
    {},
    {
      wait: { value: wait, configurable: true },
      set: { value: set, configurable: true },
      exec: { value: exec, configurable: true },
      isSet: { get: () => isSet, configurable: true },
      waiting: { get: () => queue.length, configurable: true }
    }
  )
}
