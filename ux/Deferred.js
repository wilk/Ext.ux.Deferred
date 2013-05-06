/**
 * @class Ext.ux.Deferred
 * @author Vincenzo Ferrari <wilk3ert@gmail.com>
 *
 * Deferred (promises) for ExtJS and Sencha Touch
 *
 */
Ext.define ('Ext.ux.Deferred', {
	/**
	 * @method done
	 */
	done: function () {} ,
	
	/**
	 * @method fail
	 */
	fail: function () {} ,
	
	/**
	 * @method always
	 */
	always: function () {} ,
	
	/**
	 * @method resolve
	 * By invoking this method, it is asked to the Deferred to resolve the promise: some data could be passed.
	 * @param {Object} data Data to display with done and/or always callbacks
	 * @return {Ext.ux.Deferred} Itself
	 */
	resolve: function (data) {
		var me = this;
		
		me.done (data);
		me.always (data);
		
		return me;
	} ,
	
	/**
	 * @method reject
	 * By invoking this method, it is asked to the Deferred to reject the promise: some data could be passed.
	 * @param {Object} data Data to display with fail and/or always callbacks
	 * @return {Ext.ux.Deferred} Itself
	 */
	reject: function (data) {
		var me = this;
		
		me.fail (data);
		me.always (data);
		
		return me;
	} ,
	
	/**
	 * @method promise
	 * It provides the promise to deal with: it exposes a series of watching methods, useful to attach callbacks.
	 * Follows the structure:
	 *
	 *     - then: it accepts two params. The first one is the onDone callback, while the second one is the onFail callback. 
	 *             They will be called if there will be failure or successfull sitatuions
	 *     - done: it will be called when the promise succeeds
	 *     - fail: it will be called when the promise fails
	 *     - always: it will be called in any case
	 *
	 * @return {Object} The promise
	 */
	promise: function () {
		var me = this;
		
		return {
			then: function (onDone, onFail) {
				me.done = typeof onDone === 'function' ? onDone : function () {};
				me.fail = typeof onFail === 'function' ? onFail : function () {};
				
				return this;
			} ,
			done: function (onDone) {
				me.done = typeof onDone === 'function' ? onDone : function () {};
				
				return this;
			} ,
			fail: function (onFail) {
				me.fail = typeof onFail === 'function' ? onFail : function () {};
				
				return this;
			} ,
			always: function (onAlways) {
				me.always = typeof onAlways === 'function' ? onAlways : function () {};
				
				return this;
			}
		}
	}
})
