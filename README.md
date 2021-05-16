# SyncEvent

A promise-based synchronisation primitive

## SyncEvent

Creates a new event. This allows one user through at a time once it has been set.
This automatically unsets the event, so it should be manually reset as needed.

```
const hasData = new SyncEvent()

if (hasData.isSet) { ... } // test to see if already set

await hasData.wait() // wait for the event to be set and lets one user through

hasData.set() // manually reset it to allow others through
```
