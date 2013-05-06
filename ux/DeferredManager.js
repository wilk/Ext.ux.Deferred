/**
 * @class Ext.ux.DeferredManager
 * @author Vincenzo Ferrari <wilk3ert@gmail.com>
 * @singleton
 *
 * Deferred Manager for ExtJS and Sencha Touch
 *
 */
Ext.define ('Ext.ux.DeferredManager', {
	singleton: true ,
	
	requires: ['Ext.ux.Deferred'] ,
	
	/**
	 * @method when
	 * It encapsulates the passed promises in a new one and it returns.
	 * When the new promise is executed, the listeners attached will be notified.
	 * @param {Object/Object[]} args One or more Ext.ux.Deferred.promise(). Could be one or more Ext.ux.Deferred either.
	 * @return {Object} The promise
	 */
	when: function () {
		var promises = arguments ,
			deferred = Ext.create ('Ext.ux.Deferred') ,
			counter = promises.length ,
			results = [] ,
			errors = [];
		
		for (var i = 0; i < promises.length; i++) {
			(function (i) {
				var promise = promises[i];
			
				if (promise instanceof Ext.ux.Deferred) promise = promise.promise ();
			
				promise
					.done (function (data) {
						counter--;
						results[i] = data;
						//results.push (data);
					
						if (counter == 0) {
							deferred.resolve (results);
						
							if (errors.length > 0) deferred.reject (errors);
						}
					})
					.fail (function (data) {
						counter--;
						errors[i] = data;
						//errors.push (data);
					
						if (counter == 0) {
							deferred.reject (errors);
						
							if (results.length > 0) deferred.resolve (results);
						}
					});
			})(i);
		}
		
		return deferred.promise ();
	}
});
