Ext.define ('Ext.ux.DeferredManager', {
	singleton: true ,
	
	requires: ['Ext.ux.Deferred'] ,
	
	when: function () {
		var promises = arguments ,
			deferred = Ext.create ('Ext.ux.Deferred') ,
			counter = promises.length ,
			results = [] ,
			errors = [];
		
		for (var i = 0; i < promises.length; i++) {
			promises[i]
				.done (function (data) {
					counter--;
					results.push (data);
					
					if (counter == 0) deferred.resolve (results);
				})
				.fail (function (data) {
					counter--;
					errors.push (data);
					
					if (counter == 0) deferred.reject (errors);
				});
		}
		
		return deferred.promise ();
	}
});
