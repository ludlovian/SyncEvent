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
  assert.is(e.waiting, 0)
  assert.ok(await pWait.isResolved(), 'wait resolves when set')
  assert.is(e.isSet, false, 'successful wait resets')
})

test('wait for set', async () => {
  const e = new SyncEvent()
  assert.is(e.isSet, false, 'event is initially unset')

  const pWait = e.wait()
  assert.is(e.waiting, 1)
  assert.not.ok(await pWait.isResolved(), 'wait when unset waits')

  await e.set()
  assert.is(e.waiting, 0)
  assert.ok(await pWait.isResolved(), 'set resolves the waiter')
  assert.is(e.isSet, false, 'successful wait resets')
})

test('multi-waiters', async () => {
  const e = new SyncEvent()
  assert.is(e.isSet, false, 'event is initially unset')

  const pWait1 = e.wait()
  const pWait2 = e.wait()
  assert.is(e.waiting, 2)
  assert.not.ok(await pWait1.isResolved(), 'wait #1 when unset waits')
  assert.not.ok(await pWait2.isResolved(), 'wait #2 when unset waits')

  await e.set()
  assert.is(e.waiting, 1)
  assert.ok(await pWait1.isResolved(), 'wait #1 resolves')
  assert.not.ok(await pWait2.isResolved(), 'wait #2 still waits')

  await e.set()
  assert.is(e.waiting, 0)
  assert.ok(await pWait2.isResolved(), 'wait #2 resolves')
})

test('exec that works', async () => {
  const e = new SyncEvent()
  const fn = async () => 17
  const pResult = e.exec(fn)
  assert.is(await pResult.isResolved(), false, 'not run yet')

  e.set()
  assert.is(await pResult.isResolved(), true, 'set runs the func')
  assert.is(await pResult, 17, 'and the result is returned')
  assert.is(e.isSet, true, 'the event is set')
})

test('exec that throws', async () => {
  const e = new SyncEvent()
  const err = new Error('oops')
  const fn = async () => Promise.reject(err)
  const pResult = e.exec(fn)
  assert.is(await pResult.isResolved(), false, 'not run yet')

  e.set()
  await pResult
    .then(assert.unreachable)
    .catch(er => assert.is(er, err, 'error is thrown'))
  assert.is(e.isSet, true, 'the event is set')
})

test.run()
