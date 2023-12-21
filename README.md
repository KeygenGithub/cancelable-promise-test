# Cancelable Promise Test

## Goal

Develop a class CancelablePromise that behaves similarly to the native Promise class in JavaScript but with the capability to cancel the entire promise chain before execution.

# Dev comment:

The constructor class CancelablePromise expects a executor function or you can omit this parameter by specifying an empty function '() => {}'. In this case, it will be necessary to specify an already existing promise as the second parameter - a CancelablePromise will be created based on it. Also, I added helper functions to import: 'makeCancelable' - to create a CancelablePromise based on a regular promise and 'isCancelablePromise' - to check if a promise belongs to the CancelablePromise class.

In the jest test file, I changed the reference to the 'isCanceled' field to a function call because this field is private. This is necessary so that the cancellation of the promise is done only through the 'cancel' function and not by changing the 'isCanceled' field directly.
