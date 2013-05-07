Ext.Loader.setConfig ({
	enabled: true ,
	paths: {
		'Ext.ux': '../ux'
	}
});

Ext.require (['Ext.ux.Deferred', 'Ext.ux.DeferredManager']);

/*function aSync () {
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
}*/

var globalCounter = 0;

function aSync1 () {
	var deferred = Ext.create ('Ext.ux.Deferred') ,
		counter = 0 ,
		task = setInterval (function () {
			counter++;
			
			if (counter == 20) {
				console.log ('RESOLVING aSync1');
				deferred.resolve (10);
				clearInterval (task);
			}
		}, 200);
	
	return deferred.promise ();
}

function aSync2 () {
	var deferred = Ext.create ('Ext.ux.Deferred') ,
		counter = 0 ,
		task = setInterval (function () {
			counter++;
			
			if (counter == 10) {
				console.log ('RESOLVING aSync2');
				deferred.resolve (20);
				clearInterval (task);
			}
		}, 100);
	
	return deferred.promise ();
}

function aSync3 () {
	var deferred = Ext.create ('Ext.ux.Deferred') ,
		counter = 0 ,
		task = setInterval (function () {
			counter++;
			
			if (counter == 30) {
				console.log ('RESOLVING aSync3');
				deferred.resolve (30);
				clearInterval (task);
			}
		}, 300);
	
	return deferred.promise ();
}

Ext.onReady (function () {
	Ext.ux.DeferredManager
		.when (aSync1 (), aSync2 (), aSync3 ())
		.always (function (data1, data2, data3) {
			console.log ('ALWAYS : ' + data1 + ' - ' + data2 + ' - ' + data3);
		});
		/*.done (function (data) {
			console.log ('DONE : ' + data);
		})
		.fail (function (data) {
			console.log ('FAIL : ' + data);
		});*/
		/*.then (function (data) {
			console.log ('DONE : ' + data);
		}, function (data) {
			console.log ('FAIL : ' + data);
		});*/
});
