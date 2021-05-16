export default function SyncEvent () {
  const queue = []
  let isSet = false
  return {
    async wait () {
      if (!isSet) return new Promise(resolve => queue.push(resolve))
      isSet = false
    },

    set () {
      if (!isSet && queue.length) return queue.shift()()
      isSet = true
    },

    get isSet () {
      return isSet
    }
  }
}
