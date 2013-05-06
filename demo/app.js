Ext.Loader.setConfig ({
	enabled: true ,
	paths: {
		'Ext.ux': '../ux'
	}
});

Ext.require (['Ext.ux.Deferred', 'Ext.ux.DeferredManager']);

function aSync () {
	var promise = Ext.create ('Ext.ux.Promise') ,
		params = {
			url: 'my.json' ,
			success: function (data) {
				promise.resolve (data);
			} ,
			failure: function (data) {
				promise.reject (data);
			}
		};
	
	Ext.Ajax.request (params);
	
	return promise;
}

var globalCounter = 0;

function aSync1 () {
	var deferred = Ext.create ('Ext.ux.Deferred') ,
		counter = 0 ,
		task = Ext.TaskManager.start ({
			run: function () {
				counter++;
			
				if (counter == 10) {
					deferred.resolve (counter);
					task.destroy ();
				}
			} ,
			interval: 100
		});
	
	return deferred.promise ();
}

function aSync2 () {
	var deferred = Ext.create ('Ext.ux.Deferred') ,
		counter = 0 ,
		task = Ext.TaskManager.start ({
			run: function () {
				counter++;
			
				if (counter == 20) {
					deferred.resolve (counter);
					task.destroy ();
				}
			} ,
			interval: 200
		});
	
	return deferred.promise ();
}

function aSync3 () {
	var deferred = Ext.create ('Ext.ux.Deferred') ,
		counter = 0 ,
		task = Ext.TaskManager.start ({
			run: function () {
				counter++;
			
				if (counter == 30) {
					deferred.resolve (counter);
					task.destroy ();
				}
			} ,
			interval: 300
		});
	
	return deferred.promise ();
}

Ext.onReady (function () {
	Ext.ux.DeferredManager
		.when (aSync1 (), aSync2 (), aSync3 ())
		.then (function (data) {
			console.log (data);
		});
});
