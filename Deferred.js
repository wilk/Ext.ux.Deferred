/**
 * @class Ext.ux.Deferred
 * @author Vincenzo Ferrari <wilk3ert@gmail.com>
 *
 * Deferred for ExtJS and Sencha Touch
 *
 */
Ext.define('Ext.ux.Deferred', {
    requires: ['Ext.ux.Promise'],

    /**
     * @property {Array} successQueue Callbacks queue that have to be executed when the resolve method is called
     * @private
     */
    successQueue: [],

    /**
     * @property {Array} failureQueue Callbacks queue that have to be executed when the reject method is called
     * @private
     */
    failureQueue: [],

    /**
     * @property {Number} REJECT_FLAG Class constant used by REJECT method
     * @private
     */
    REJECT_FLAG: 0,

    /**
     * @property {Number} REJECT_FLAG Class constant used by RESOLVE method
     * @private
     */
    RESOLVE_FLAG: 1,

	inheritableStatics: {
		/**
		 * @method when
		 * It encapsulates the given promises in a new one that is returned.
		 * When the new promise is executed, the listeners attached will be notified.
		 * @param {Ext.ux.Promise/Ext.ux.Promise[]} args One or more Ext.ux.Promise.
		 * The returned promise will be solved or rejected after each given promise have finished
		 * @return {Ext.ux.Promise} The promise
		 * @static
		 */
		when: function () {
            var deferred = Ext.create('Ext.ux.Deferred'),
                promises = arguments,
                promisesLen = promises.length,
                results = [],
                errors = [];

            for (var i = 0; i < promises.length; i++) {
                (function (i) {
                    var promise = promises[i];

                    if (promise instanceof Ext.ux.Promise) {
                        promise.then(function () {
                            promisesLen--;
                            results[i] = arguments;

                            if (promisesLen === 0) {
                                deferred.resolve.apply(deferred, results);

                                if (errors.length > 0) deferred.reject.apply(deferred, errors);
                            }
                        }, function () {
                            promisesLen--;
                            errors[i] = arguments;

                            if (promisesLen === 0) {
                                deferred.reject.apply(deferred, errors);

                                if (results.length > 0) deferred.resolve.apply(deferred, results);
                            }
                        });
                    }
                })(i);
            }

            return deferred.promise();
		}
	},

    /**
     * @method resolve
     * Solve the promise and launch the callback attached with then (or success or done) method.
     * The given data is passed to the ballback
     * @param {Object} args Data to pass to the attached function
     * @return {Ext.ux.Deferred} this
     */
    resolve: function () {
        return this.handlePromise(this.RESOLVE_FLAG, arguments);
    },

    /**
     * @method reject
     * Reject the promise and launch the callback attached with then (or failure or fail) method.
     * The given data is passed to the ballback
     * @param {Object} args Data to pass to the attached function
     * @return {Ext.ux.Deferred} this
     */
    reject: function () {
        return this.handlePromise(this.REJECT_FLAG, arguments);
    },

    /**
     * @method handlePromise
     * Handle the state of the promise: it decides if the promise has to be solved or rejected and then checks out
     * if the result of the last executed callback is a promise or not. If it's a promise, it attaches every unsolved/unrejected callback.
     * @param {Number} flag Indicates what kind of action has to be performed
     * @param {Array} args An array of arguments
     * @return {Ext.ux.Deferred} this
     * @private
     */
    handlePromise: function (flag, args) {
        var me = this,
            onSuccess = me.successQueue.shift() || Ext.emptyFn,
            onFailure = me.failureQueue.shift() || Ext.emptyFn,
            result = null;

        if (flag === me.RESOLVE_FLAG) result = onSuccess.apply(me, args);
        else result = onFailure.apply(me, args);

        if (result instanceof Ext.ux.Promise) {
            var successLen = me.successQueue.length,
                failureLen = me.failureQueue.length;

            while (successLen > 0 && failureLen > 0) {
                onSuccess = me.successQueue.shift();
                onFailure = me.failureQueue.shift();

                // It chains every callbacks to the incoming promise
                result.then(onSuccess, onFailure);

                successLen--;
                failureLen--;
            }
        }

        return me;
    },

    /**
     * @method promise
     * Provides a new instance of Ext.ux.Promise
     * @return {Ext.ux.Promise} The promise
     */
    promise: function () {
        return Ext.create('Ext.ux.Promise', {deferred: this});
    }
});
