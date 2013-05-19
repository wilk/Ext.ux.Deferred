Ext.Loader.setConfig ({
	enabled: true ,
	paths: {
		'Ext.ux': '../ux'
	}
});

Ext.require (['Ext.ux.Deferred']);

function aSync1 (data) {
	var deferred = Ext.create ('Ext.ux.Deferred') ,
		task = setInterval (function () {
			console.log ('RESOLVING aSync1 - ', data);
			deferred.resolve (10); //d1
			clearInterval (task);
		}, 2000);
	
	return deferred;
}

function aSync2 (data) {
	var deferred = Ext.create ('Ext.ux.Deferred') ,
		task = setInterval (function () {
			console.log ('RESOLVING aSync2 - ', data);
			deferred.resolve (20); //d1.lastDfd -> d2
			clearInterval (task);
		}, 1000);
	
	return deferred;
}

function aSync3 (data) {
	var deferred = Ext.create ('Ext.ux.Deferred') ,
		task = setInterval (function () {
			console.log ('RESOLVING aSync3 - ', data);
			deferred.resolve (30); //d2.lastDfd -> d3
			clearInterval (task);
		}, 3000);
	
	return deferred;
}

var d1,d2,d3,d4;

Ext.onReady (function () {
	/*d1 = aSync1(0);
	d2 = d1.then(function (data) {console.log('last d1.then: ', data); return 20;});
	d3 = d2.then(function (data) {console.log('last d2.then: ', data); return 30;});
	d4 = d3.then(function (data) {console.log('last d3.then: ', data); return 40;});*/
	
	Ext.ux.Deferred
		.when (aSync1 (0), aSync2, aSync3 (20))
		.then (function (data) {
			console.log ('done ', data);
		});
		/*.always (function (data1, data2, data3) {
			console.log ('ALWAYS : ' + data1 + ' - ' + data2 + ' - ' + data3);
		});*/
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
