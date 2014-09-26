/**
 * @class Ext.ux.Promise
 * @author Vincenzo Ferrari <wilk3ert@gmail.com>
 *
 * Promise for ExtJS and Sencha Touch
 *
 */
Ext.define('Ext.ux.Promise', {
    inheritableStatics: {
        /**
         * Pending state
         * @type Number
         * @static
         */
        PENDING: 0,

        /**
         * Fulfilled state
         * @type Number
         * @static
         */
        FULFILLED: 1,

        /**
         * Rejected state
         * @type Number
         * @static
         */
        REJECTED: 2
    },

    config: {
        /**
         * The promise state
         * @property
         */
        state: 0
    },

    /**
     * The internal deferred
     * @private
     */
    deferred: null,

    /**
     * Internal success queue
     * @private
     */
    successQueue: [],

    /**
     * Internal failure queue
     * @private
     */
    failureQueue: [],

    /**
     * Creates a new promise
     * @param {object} cfg The configuration options may be specified as follows:
     *
     *     // with a configuration set
     *     var config = {
	 *       deferred: deferred // deferred is an instace of Ext.ux.Deferred
	 *     };
     *
     *     var promise = Ext.create('Ext.ux.Promise', config);
     *
     * @return {Ext.ux.Promise} An instance of Ext.ux.Promise or null if an error occurred.
     */
    constructor: function (cfg) {
        var me = this;

        me.initConfig(cfg);

        // Reset internal configurations
        me.successQueue = [];
        me.failureQueue = [];
        me.deferred = null;

        return me;
    },

    /**
     * @method
     * Resolve the promise, called directly from the parent deferred
     * @private
     */
    resolve: function () {
        var me = this,
            results = [],
            errors = [],
            args = Array.prototype.slice.call(arguments, 0);

        me.setState(Ext.ux.Promise.FULFILLED);

        // Resolve it only if it needed
        if (me.successQueue.length > 0) {
            while (me.successQueue.length > 0) {
                var onSuccess = me.successQueue.shift();

                if (typeof onSuccess === 'function') {
                    try {
                        var result = onSuccess.apply(null, arguments);
                        if (result) results.push(result);
                    }
                    catch (err) {
                        errors.push(err);
                    }
                }
            }

            // If there's an error, reject the associated deferred
            if (errors.length > 0) me.deferred.reject(errors);
            else {
                // Otherwise resolve it with every result
                results = args.concat(results);
                me.deferred.resolve(results);
            }
        }
    },

    /**
     * @method
     * Reject the promise, called directly from the parent deferred
     * @private
     */
    reject: function () {
        var me = this,
            results = [],
            errors = [],
            args = Array.prototype.slice.call(arguments, 0);

        me.setState(Ext.ux.Promise.REJECTED);

        if (me.failureQueue.length > 0) {
            while (me.failureQueue.length > 0) {
                var onFailure = me.failureQueue.shift();

                if (typeof onFailure === 'function') {
                    try {
                        var result = onFailure.apply(null, arguments);
                        if (result) results.push(result);
                    }
                    catch (err) {
                        errors.push(err);
                    }
                }
            }

            if (errors.length > 0) me.deferred.reject(errors);
            else {
                results = args.concat(results);
                me.deferred.reject(results);
            }
        }
    },

    /**
     * @method then
     * Attaches two callbacks to the deferred internal reference, one for success and one for failure.
     * They are called by deferred.resolve and deferred.reject
     * @param {Function} onSuccess Success callback, called by deferred.resolve
     * @param {Function} onFailure Failure callback, called by deferred.reject
     * @return {Ext.ux.Promise} this
     */
    then: function (onSuccess, onFailure) {
        var me = this;

        if (typeof onSuccess !== 'function' && typeof onFailure !== 'function') throw new Error('Ext.ux.Promise.then(): onSuccess or onFailure callback is needed');

        if (!(me.deferred instanceof Ext.ux.Deferred)) me.deferred = Ext.create('Ext.ux.Deferred');

        if (typeof onSuccess === 'function') me.successQueue.push(onSuccess);
        if (typeof onFailure === 'function') me.failureQueue.push(onFailure);

        return me.deferred.promise();
    },

    /**
     * @method success
     * Attaches the success callback to the promise
     * @param {Function} onSuccess Callback successful promise
     * @returns {Ext.ux.Promise} Return itself
     */
    success: function (onSuccess) {
        this.then(onSuccess);

        return this;
    },

    /**
     * @method done
     * Alias for success
     * @param {Function} onSuccess Callback exectued after the promise is resolved
     * @returns {Ext.ux.Promise} Return itself
     */
    done: function (onSuccess) {
        this.then(onSuccess);

        return this;
    },

    /**
     * @method failure
     * Attaches the failure callback to the promise
     * @param {Function} onFailure Callback executed after the promise is rejected
     * @returns {Ext.ux.Promise} Return itself
     */
    failure: function (onFailure) {
        this.then(undefined, onFailure);

        return this;
    },

    /**
     * @method fail
     * Alias for failure
     * @param {Function} onFailure Callback executed after the promise is rejected
     * @returns {Ext.ux.Promise} Return itself
     */
    fail: function (onFailure) {
        this.then(undefined, onFailure);

        return this;
    },

    /**
     * Check if the promise is resolved or not
     * @returns {boolean} true if the promise is resolved, false otherwise
     */
    resolved: function () {
        return this.getState() === Ext.ux.Promise.FULFILLED;
    },

    /**
     * Check if the promise is rejected or not
     * @returns {boolean} true if the promise is rejected, false otherwise
     */
    rejected: function () {
        return this.getState() === Ext.ux.Promise.REJECTED;
    },

    /**
     * Check if the promise is pending or not
     * @returns {boolean} true if the promise is pending, false otherwise
     */
    pending: function () {
        return this.getState() === Ext.ux.Promise.PENDING;
    }
});