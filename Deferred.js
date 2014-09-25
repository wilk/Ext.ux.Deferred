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
     * internal promise needed from resolve and reject methods
     * @private
     */
    internalPromise: null,

    inheritableStatics: {
        /**
         * @method when
         * It encapsulates the given promises in a new one that is returned.
         * When the new promise is executed, the listeners attached will be notified.
         * @param {Function/Ext.ux.Promise/Function[]/Ext.ux.Promise[]} args One or more Ext.ux.Promise or one or more Function that return an Ext.ux.Promise
         * The returned promise will be solved or rejected after each given promise have finished
         * @return {Ext.ux.Promise} The promise
         * @static
         */
        when: function () {
            var deferred = Ext.create('Ext.ux.Deferred'),
                promises = arguments,
                promisesLen = promises.length,
                rejectedCounter = 0,
                resolved = {},
                rejected = {};

            // Make a single promise for those passed
            for (var i = 0; i < promises.length; i++) {
                // Use a closure to work with the current one specified by index 'i'
                (function (i) {
                    var promise = promises[i];

                    // This let 'when' to accept functions that return a promise invoking them afterwards
                    if (typeof promise === 'function') promise = promise();

                    if (promise instanceof Ext.ux.Promise) {
                        promise.then(function () {
                            promisesLen--;
                            resolved[i] = arguments.length === 1 ? arguments[0] : arguments;

                            // Execute the promise only if there's no other pending promise
                            if (promisesLen === 0) {
                                // If an error occurred or one of the promises has been rejected
                                // reject the wrapping promise, even if it's the only rejected
                                if (rejectedCounter > 0) deferred.reject(rejected);
                                else deferred.resolve(resolved);
                            }
                        }, function () {
                            promisesLen--;
                            rejectedCounter++;
                            rejected[i] = arguments.length === 1 ? arguments[0] : arguments;

                            if (promisesLen === 0) {
                                deferred.reject(rejected);
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
        return this.internalPromise.resolve.apply(this.internalPromise, arguments);
    },

    /**
     * @method reject
     * Reject the promise and launch the callback attached with then (or failure or fail) method.
     * The given data is passed to the ballback
     * @param {Object} args Data to pass to the attached function
     * @return {Ext.ux.Deferred} this
     */
    reject: function () {
        return this.internalPromise.reject.apply(this.internalPromise, arguments);
    },

    /**
     * @method promise
     * Provides a new instance of Ext.ux.Promise
     * @return {Ext.ux.Promise} The promise
     */
    promise: function () {
        var me = this;

        if (me.internalPromise instanceof Ext.ux.Promise) return me.internalPromise;
        else return me.internalPromise = Ext.create('Ext.ux.Promise');
    }
});
