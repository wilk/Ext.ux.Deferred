Ext.define ('Ext.ux.Deferred', {
	done: function () {} ,
	fail: function () {} ,
	always: function () {} ,
	
	resolve: function (data) {
		var me = this;
		
		me.done (data);
		me.always (data);
		
		return me;
	} ,
	
	reject: function (data) {
		var me = this;
		
		me.fail (data);
		me.always (data);
		
		return me;
	} ,
	
	promise: function () {
		var me = this;
		
		return {
			then: function (onDone, onFail) {
				me.done = onDone || function () {};
				me.fail = onFail || function () {};
				
				return this;
			} ,
			done: function (onDone) {
				me.done = onDone || function () {};
				
				return this;
			} ,
			fail: function (onFail) {
				me.fail = onFail || function () {};
				
				return this;
			} ,
			always: function (onAlways) {
				me.always = onAlways || function () {};
				
				return this;
			}
		}
	}
})
