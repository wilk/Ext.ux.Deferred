/**
 * @class Ext.ux.Promise
 * @author Vincenzo Ferrari <wilk3ert@gmail.com>
 *
 * Promise for ExtJS and Sencha Touch
 *
 */
Ext.define('Ext.ux.Promise', {
    requires: ['Ext.Error'],

    config: {
        /**
         * @cfg {Ext.ux.Deferred} deferred (required) A reference to the defer that this promise belongs to
         */
        deferred: null
    },

    /**
     * Creates a new promise
     * @param {object} config The configuration options may be specified as follows:
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

        if (!(me.getDeferred() instanceof Ext.ux.Deferred)) {
            Ext.Error.raise('deferred config has to be an instance of Ext.ux.Deferred');
            return null;
        }

        return me;
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
        return this.success(onSuccess).failure(onFailure);
    },

    /**
     * @method success
     * Attaches the success callback to the deferred internal reference.
     * @param {Function} onSuccess Success callback, called by deferred.resolve
     * @return {Ext.ux.Promise} this
     */
    success: function (onSuccess) {
        var me = this,
            deferred = me.getDeferred();

        onSuccess = onSuccess || function () {};
        deferred.successQueue.push(onSuccess);

        return me;
    },

    /**
     * @method done
     * Alias for Ext.ux.Promise.success
     * @param {Function} onSuccess Success callback, called by deferred.resolve
     * @return {Ext.ux.Promise} this
     */
    done: function (onSuccess) {
        return this.success(onSuccess);
    },

    /**
     * @method failure
     * Attaches the failure callback to the deferred internal reference.
     * @param {Function} onFailure Failure callback, called by deferred.reject
     * @return {Ext.ux.Promise} this
     */
    failure: function (onFailure) {
        var me = this,
            deferred = me.getDeferred();

        onFailure = onFailure || function () {};
        deferred.failureQueue.push(onFailure);

        return me;
    },

    /**
     * @method fail
     * Alias for Ext.ux.Promise.failure
     * @param {Function} onFailure Failure callback, called by deferred.reject
     * @return {Ext.ux.Promise} this
     */
    fail: function (onFailure) {
        return this.failure(onFailure);
    }
});