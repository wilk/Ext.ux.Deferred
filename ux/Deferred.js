/**
 * @class Ext.ux.Deferred
 * @author Vincenzo Ferrari <wilk3ert@gmail.com>
 *
 * Deferred (promises) for ExtJS and Sencha Touch
 *
 */
Ext.define ('Ext.ux.Deferred', {
	/**
	 * @property {Function} onDone Function called when the promise is done. Never use directly
	 * @private
	 */
	onDone: function () {} ,
	
	/**
	 * @property {Function} onFail Function called when the promise is failed. Never use directly
	 * @private
	 */
	onFail: function () {} ,
	
	/**
	 * @method done
	 * The given function will be executed when the promise is solved
	 * @param {Function} onDone Function that has to be called on 'resolve' situation
	 * @return {Ext.ux.Deferred} this
	 */
	done: function (onDone) {
		var me = this;
		
		me.onDone = typeof onDone === 'function' ? onDone : function () {};
		
		return me;
	} ,
	
	/**
	 * @method fail
	 * The given function will be executed when the promise is rejected
	 * @param {Function} onFail Function that has to be called on 'reject' situation
	 * @return {Ext.ux.Deferred} this
	 */
	fail: function (onFail) {
		var me = this;
		
		me.onFail = typeof onFail === 'function' ? onFail : function () {};
		
		return me;
	} ,
	
	/**
	 * @method always
	 * Invoked in any case
	 * @param {Function} onAlways Function that has to be called in any case
	 * @return {Ext.ux.Deferred} this
	 */
	always: function (onAlways) {
		var me = this;
		
		onAlways = typeof onAlways === 'function' ? onAlways : function () {};
		
		me.onDone = onAlways;
		me.onFail = onAlways;
		
		return me;
	} ,
	
	/**
	 * @method reject
	 * Reject the promise. The function attached with fail or always or then method is called. The given data is passed to the attached function
	 * @param {Object} args Data to pass to the attached function
	 * @return {Ext.ux.Deferred} this
	 */
	reject: function () {
		var me = this ,
			result = me.onFail.apply (me, arguments);
		
		if (result instanceof Ext.ux.Deferred) {
			result.then (me.lastDfd.onFail, me.lastDfd.onDone);
			result.lastDfd = me.lastDfd.lastDfd;
		}
		else {
			if (typeof me.lastDfd !== 'undefined') me.lastDfd.reject (result);
		}
		
		return me;
	} ,
	
	/**
	 * @method resolve
	 * Solve the promise. The function attached with done or always or then method is called. The given data is passed to the attached function
	 * @param {Object} args Data to pass to the attached function
	 * @return {Ext.ux.Deferred} this
	 */
	resolve: function () {
		var me = this ,
			result = me.onDone.apply (me, arguments);
		
		if (result instanceof Ext.ux.Deferred) {
			result.then (me.lastDfd.onDone, me.lastDfd.onFail);
			result.lastDfd = me.lastDfd.lastDfd;
		}
		else {
			if (typeof me.lastDfd !== 'undefined') me.lastDfd.resolve (result);
		}
		
		return me;
	} ,
	
	/**
	 * @method then
	 * Attach on done and/or on fail functions. The given functions will be called on 'resolve'/'reject' situation.
	 * A new promise is created to encapsulate the given functions and returned
	 * @param {Function} onDone Function that has to be called on 'resolve' situation
	 * @param {Function} onFail Function that has to be called on 'reject' situation
	 * @return {Ext.ux.Deferred} The new promise
	 */
	then: function (onDone, onFail) {
		var me = this ,
			dfd = Ext.create ('Ext.ux.Deferred');
		
		me.done (onDone)
		  .fail (onFail);
		
		me.lastDfd = dfd;
		
		return dfd;
	}
})
