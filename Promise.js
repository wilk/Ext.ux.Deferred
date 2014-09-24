/**
 * @class Ext.ux.Promise
 * @author Vincenzo Ferrari <wilk3ert@gmail.com>
 *
 * Promise for ExtJS and Sencha Touch
 *
 */
Ext.define('Ext.ux.Promise', {
    requires: ['Ext.Error'],

    inheritableStatics: {
        PENDING: 0,
        FULFILLED: 1,
        REJECTED: 2
    },

    config: {
        state: 0
    },

    deferred: null,
    successQueue: [],
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

        me.successQueue = [];
        me.failureQueue = [];
        me.deferred = null;

        return me;
    },

    resolve: function () {
        var me = this,
            results = [],
            errors = [],
            args = Array.prototype.slice.call(arguments, 0);

        me.setState(Ext.ux.Promise.FULFILLED);

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

            if (errors.length > 0) me.deferred.reject(errors);
            else {
                results = args.concat(results);
                me.deferred.resolve(results);
            }
        }
    },

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

    success: function (onSuccess) {
        this.then(onSuccess);

        return this;
    },

    done: function (onSuccess) {
        this.then(onSuccess);

        return this;
    },

    failure: function (onFailure) {
        this.then(undefined, onFailure);

        return this;
    },

    fail: function (onFailure) {
        this.then(undefined, onFailure);

        return this;
    },

    resolved: function () {
        return this.getState() === Ext.ux.Promise.FULFILLED;
    },

    rejected: function () {
        return this.getState() === Ext.ux.Promise.REJECTED;
    },

    pending: function () {
        return this.getState() === Ext.ux.Promise.PENDING;
    }

    /**
     * @method success
     * Attaches the success callback to the deferred internal reference.
     * @param {Function} onSuccess Success callback, called by deferred.resolve
     * @return {Ext.ux.Promise} this
     */
    /*success: function (onSuccess) {
     var me = this,
     deferred = me.getDeferred();

     onSuccess = onSuccess || function () {};
     deferred.successQueue.push(onSuccess);

     return me;
     },*/

    /**
     * @method done
     * Alias for Ext.ux.Promise.success
     * @param {Function} onSuccess Success callback, called by deferred.resolve
     * @return {Ext.ux.Promise} this
     */
    /*done: function (onSuccess) {
     return this.success(onSuccess);
     },*/

    /**
     * @method failure
     * Attaches the failure callback to the deferred internal reference.
     * @param {Function} onFailure Failure callback, called by deferred.reject
     * @return {Ext.ux.Promise} this
     */
    /*failure: function (onFailure) {
     var me = this,
     deferred = me.getDeferred();

     onFailure = onFailure || function () {};
     deferred.failureQueue.push(onFailure);

     return me;
     },*/

    /**
     * @method fail
     * Alias for Ext.ux.Promise.failure
     * @param {Function} onFailure Failure callback, called by deferred.reject
     * @return {Ext.ux.Promise} this
     */
    /*fail: function (onFailure) {
     return this.failure(onFailure);
     }*/
});