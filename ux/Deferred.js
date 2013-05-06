Ext.define ('Ext.ux.Deferred', {
	done: function () {} ,
	fail: function () {} ,
	
	constructor: function (cfg) {
		var me = this;
		
		me.initConfig (cfg);
		
		return me;
	} ,
	
	resolve: function (data) {
		var me = this;
		
		me.done (data);
		
		return me
	} ,
	
	reject: function (data) {
		var me = this;
		
		me.fail (data);
		
		return me
	} ,
	
	promise: function () {
		var me = this;
		
		return {
			then: function (onDone, onFail) {
				me.done = onDone;
				me.fail = onFail;
				
				return this;
			} ,
			done: function (onDone) {
				me.done = onDone;
				
				return this;
			} ,
			fail: function (onFail) {
				me.fail = onFail;
				
				return this;
			}
		}
	}
})
