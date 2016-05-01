# Ext.ux.Deferred

# This library is no longer mainteined.

Ext.ux.Deferred provides promises for ExtJS and Sencha Touch.

It allows to manage async functions with ease.

**Ext.ux.Deferred follows the [PromisesA/+](https://github.com/promises-aplus/promises-spec#notes) standard**

## Problems
The first problem is with the [**Pyramid of Doom**](http://tritarget.org/blog/2012/11/28/the-pyramid-of-doom-a-javascript-style-trap/), namely nested asynchronous functions, like this:

```javascript
aSync1(10, function (val1) {
	aSync2(val1, function (val2) {
		aSync3(val2, function (val3) {
			alert('Top of the pyramid with: ', val3);
		});
	});
});
```

What we want here is to have a comfortable way to chain those asynchronous functions. With `Ext.ux.Deferred` it will be rewritten as follows:

```javascript
aSync1(10)
	.then(aSync2, onErr)
	.then(aSync3, onErr)
	.then(function (val3) {
		alert('End of the queue with: ', val3);
	}, onErr);
```

Each result is given as an argument to the next async function on the chain path.

The second problem is make a function start after the execution of a set of asynchronous functions.
Take the above functions as example: now, we want to start the last anonymous function at the end of their execution: `Ext.ux.Deferred` has a static method, called when, that allows you to do that! Get the following example:

```javascript
Ext.ux.Deferred
	.when(aSync1, aSync2, aSync3)
	.then(function (results) {
	    console.log('aSync1 result', results[0]);
	    console.log('aSync2 result', results[1]);
	    console.log('aSync3 result', results[2]);
	}, function (errors) {
	    console.log('aSync1 error', errors[0]);
	    console.log('aSync2 error', errors[1]);
	    console.log('aSync3 error', errors[2]);
	});
```

## Tutorial
`Ext.ux.Deferred` can be used to defer asynchronous processes.
The first thing to do is to make a new deferred:

```javascript
function aSync1 (val) {
	var dfd = Ext.create('Ext.ux.Deferred') ,
		task = setInterval(function () {
			// here your async task
			clearInterval(task);
		}, 1000);
		
	return dfd.promise();
}
```

Then, use the resolve/reject method to tell your promise what to do:

```javascript
function aSync1 (val) {
	var dfd = Ext.create('Ext.ux.Deferred') ,
		task = setInterval(function () {
			if (ipoteticalCounter > IPOTETICAL_VALUE) dfd.resolve(data);
			else dfd.reject(data);
			
			clearInterval(task);
		}, 1000);
	
	return dfd.promise();
}
```

Now, you are ready to use your deferred by handling the result!
The first method, *then*, accepts two args: the first one is the success callback, while the second one is the fail callback:

```javascript
var promise = aSync1(10);

promise.then(function (result) {
    alert('The promise has been solved with: ', result);
}, function (error) {
    alert('The promise has been rejected with: ', error);
});
```

Otherwise, it can be used the success-failure approach:

```javascript
var promise = aSync1(10);

promise
	.success(function (result) {
		alert('The promise has been solved with: ', result);
	})
	.failure(function (error) {
		alert('The promise has been rejected with: ', error);
	});
```

Or by the alias done-fail:

```javascript
var promise = aSync1(10);

promise
	.done(function (result) {
		alert('The promise has been solved with: ', result);
	})
	.fail(function (error) {
		alert('The promise has been rejected with: ', error);
	});
```

## Install via Bower
First of all, install [**Bower**](http://bower.io/).

Then install `Ext.ux.Deferred`:

```bash
$ bower install ext.ux.deferred
```

Now, you got the extension at the following path: *YOUR_PROJECT_PATH/bower_components/ext.ux.deferred/*

It contains the **src** folder that is the source folder, containing **Deferred.js** and **Promise.js** files.

Let's setup the **Ext.Loader** to require the right file:

```javascript
Ext.Loader.setConfig({
	enabled: true ,
	paths: {
		'Ext.ux.Deferred': 'bower_components/ext.ux.deferred/src/Deferred.js',
		'Ext.ux.Promise': 'bower_components/ext.ux.deffered/src/Promise.js'
	}
});

Ext.require(['Ext.ux.Deferred']);
```

## Usage
Load `Ext.ux.Deferred` via `Ext.require`:

```javascript
Ext.Loader.setConfig({
	enabled: true
});

Ext.require(['Ext.ux.Deferred']);
```

Now, you are ready to use it in your code as follows:

```javascript
var dfd = Ext.create('Ext.ux.Deferred') ,
	task = setInterval(function () {
		deferred.resolve(10);
		clearInterval(task);
	}, 1000);

Ext.ux.Deferred
	.when(dfd.promise())
	.then(function (value) {
		alert(value); // it will print 10
	});
```

## Documentation
You can build the documentation (like ExtJS Docs) with [**jsduck**](https://github.com/senchalabs/jsduck):

```bash
$ jsduck . --output /var/www/docs
```

It will make the documentation into docs dir and it will be visible at: http://localhost/docs

## License
The MIT License (MIT)

Copyright (c) 2014 Vincenzo Ferrari <wilk3ert@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
