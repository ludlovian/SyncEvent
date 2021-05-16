import { test } from 'uvu'
import * as assert from 'uvu/assert'

import promiseGoodies from 'promise-goodies'

import SyncEvent from '../src/index.mjs'

promiseGoodies()

test('no wait operation', async () => {
  const e = new SyncEvent()
  assert.is(e.isSet, false, 'event is initially unset')

  await e.set()
  assert.is(e.isSet, true, 'set with no waiters sets the event')

  // wait when set resolves straight away and unsets
  const pWait = e.wait()
  assert.ok(await pWait.isResolved(), 'wait resolves when set')
  assert.is(e.isSet, false, 'successful wait resets')
})

test('wait for set', async () => {
  const e = new SyncEvent()
  assert.is(e.isSet, false, 'event is initially unset')

  const pWait = e.wait()
  assert.not.ok(await pWait.isResolved(), 'wait when unset waits')

  await e.set()
  assert.ok(await pWait.isResolved(), 'set resolves the waiter')
  assert.is(e.isSet, false, 'successful wait resets')
})

test('multi-waiters', async () => {
  const e = new SyncEvent()
  assert.is(e.isSet, false, 'event is initially unset')

  const pWait1 = e.wait()
  const pWait2 = e.wait()
  assert.not.ok(await pWait1.isResolved(), 'wait #1 when unset waits')
  assert.not.ok(await pWait2.isResolved(), 'wait #2 when unset waits')

  await e.set()
  assert.ok(await pWait1.isResolved(), 'wait #1 resolves')
  assert.not.ok(await pWait2.isResolved(), 'wait #2 still waits')

  await e.set()
  assert.ok(await pWait2.isResolved(), 'wait #2 resolves')
})

test.run()
