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
	 * It encapsulates the given promises in a new one and it returns.
	 * When the new promise is executed, the listeners attached will be notified.
	 * @param {Ext.ux.Deferred/Ext.ux.Deferred[]/Function/Function[]} args One or more Ext.ux.Deferred or Function. If Function is given, it has to return an Ext.ux.Deferred or an error would be raised.
	 * @return {Ext.ux.Deferred} The promise
	 */
	when: function () {
		var promises = arguments ,
			dfd = Ext.create ('Ext.ux.Deferred') ,
			counter = promises.length ,
			results = [] ,
			errors = [];
		
		for (var i = 0; i < promises.length; i++) {
			(function (i) {
				var promise = promises[i];
				
				if (typeof promise === 'function') promise = promise ();
				
				if (!(promise instanceof Ext.ux.Deferred)) Ext.Error.raise ('Ext.ux.Deferred expected: given ' + typeof promise);
			
				promise
					.done (function (data) {
						counter--;
						results[i] = data;
					
						if (counter == 0) {
							dfd.resolve.apply (dfd, results);
						
							if (errors.length > 0) dfd.reject.apply (dfd, errors);
						}
					})
					.fail (function (data) {
						counter--;
						errors[i] = data;
					
						if (counter == 0) {
							dfd.reject.apply (dfd, errors);
						
							if (results.length > 0) dfd.resolve.apply (dfd, results);
						}
					});
			})(i);
		}
		
		return dfd;
	}
});
