class CancelablePromise {
	#promise
	#parentPromise
	#isCanceled

	constructor(executor, promise, isCanceled = false, parentPromise = null) {
		if (typeof executor !== 'function') {
			throw new Error('Wrong constructor arguments')
		}
		this.cancel = this.cancel.bind(this)
		this.#promise =
			promise ||
			new Promise((resolve, reject) =>
				executor(
					(value) => {
						this.isCanceled() ? reject({ isCanceled: true }) : resolve(value)
					},
					(error) => {
						this.isCanceled() ? reject({ isCanceled: true }) : reject(error)
					}
				)
			)
		this.#isCanceled = isCanceled
		this.#parentPromise = parentPromise
	}

	then(onfullfilled, onrejected) {
		if (
			(onfullfilled && typeof onfullfilled !== 'function') ||
			(onrejected && typeof onrejected !== 'function')
		) {
			throw new Error('Invalid then argument')
		}
		return makeCancelable(
			this.#promise.then(onfullfilled, onrejected),
			this.#isCanceled,
			this.#parentPromise || this
		)
	}

	catch(onrejected) {
		return makeCancelable(
			this.#promise.catch(onrejected),
			this.#isCanceled,
			this.#parentPromise || this
		)
	}

	finally(onfinally) {
		return makeCancelable(
			this.#promise.finally(onfinally),
			this.#isCanceled,
			this.#parentPromise || this
		)
	}

	cancel() {
		this.#isCanceled = true
		if (this.#parentPromise) {
			this.#parentPromise.cancel()
		}
	}

	isCanceled() {
		if (this.#parentPromise) {
			return this.#parentPromise.isCanceled()
		}
		return this.#isCanceled === true
	}
}

function makeCancelable(promise, isCanceled = false, parentPromise = null) {
	return new CancelablePromise(() => {}, promise, isCanceled, parentPromise)
}

function isCancelablePromise(promise) {
	return promise instanceof CancelablePromise
}

module.exports = { CancelablePromise, makeCancelable, isCancelablePromise }
