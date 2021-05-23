# SyncEvent

A promise-based synchronisation primitive

## SyncEvent

Creates a new event. Like a barrier at a car park, this allows one user through
at a time once it has been set. And letting that user through automatically
unsets the event. So it needs to be manually reset to allow the next user
through.

### SyncEvent

No options. Just create one. It starts unset.

### .wait() => Promise

Wait for the event to be set and let you through. This will only let one
waiter through, and will reset the event.

### .set()

Sets the event.

### .isSet

Is the event set?

### .waiting

How many are waiting in the queue.

### .exec(fn) => Promise(<result>)

Shortcut for waiting on the event, running the function, and then resetting
the event. Used to permit one-at-a-time functions.
