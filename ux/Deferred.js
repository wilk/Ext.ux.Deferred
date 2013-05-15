/**
 * @class Ext.ux.Deferred
 * @author Vincenzo Ferrari <wilk3ert@gmail.com>
 *
 * Deferred (promises) for ExtJS and Sencha Touch
 *
 */
Ext.define ('Ext.ux.Deferred', {
	onDone: function () {} ,
	onFail: function () {} ,
	/**
	 * @method done
	 * Invoked when the promise is resolved
	 */
	done: function (onDone) {
		var me = this;
		
		me.onDone = typeof onDone === 'function' ? onDone : function () {};
		
		return me;
	} ,
	
	/**
	 * @method fail
	 * Invoked when the promise is rejected
	 */
	fail: function (onFail) {
		var me = this;
		
		me.onFail = typeof onFail === 'function' ? onFail : function () {};
		
		return me;
	} ,
	
	/**
	 * @method always
	 * Invoked in any case
	 */
	always: function () {} ,
	
	/**
	 * @method reject
	 * By invoking this method, it is asked to the Deferred to reject the promise: some data could be passed.
	 * @param {Object} data Data to display with fail and/or always callbacks
	 * @return {Ext.ux.Deferred} Itself
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
	 * By invoking this method, it is asked to the Deferred to resolve the promise: some data could be passed.
	 * @param {Object} data Data to display with done and/or always callbacks
	 * @return {Ext.ux.Deferred} Itself
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
	
	then: function (onDone, onFail) {
		var me = this ,
			dfd = Ext.create ('Ext.ux.Deferred');
		
		me.done (onDone)
		  .fail (onFail);
		
		me.lastDfd = dfd;
		
		return dfd;
	}
})
