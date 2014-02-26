# backbone-events-promises

[![BuildStatus](https://travis-ci.org/shoptology/backbone-events-promises.png?branch=master)](https://travis-ci.org/shoptology/backbone-events-promises)


This plugin to [backbone.js](http://backbonejs.org/) adds promise functionality to `Backbone.Events`, as well as any object that extends `Backbone.Events` - which is pretty much all of them.

## Installation
`npm i -D backbone-events-promises`

#### Dependencies

Promises are implemented by using `$.Deferred` and `$.when`. This can be
provided via [jQuery](http://jquery.org) or [Zepto](http://zeptojs.com/)*. Potentially other sources such as when.js could be used if a shim was provided to apply it's functions to `$.Deferred` and `$.when`.


Additionally, it also depends on Underscore's `_.extend()`. Underscore is already a hard dependency of Backbone, so no harm done there.

> *requires including Zepto's deferred plugin.


#### Usage

API:

    Backbone.Events.promises(enable, [context], [options]);
Enables the backbone-promises functionality for events.


To enable on all Backbone objects, use the following code before creating
any Backbone objects in your application.

    var objs = ['Model', 'Collection', 'Router', 'View', 'History'];
    Backbone.Events.promises(true);
    for (var i = 0, l = objs.length; i < l; i++) {
        Backbone.Events.promises(true, Backbone[objs[i]].prototype);
    }

Backbone.Events.trigger now returns a promise.

    var promise = Backbone.Events.trigger( "event name" [, arg1] [, arg2] );

Each callback assigned to the event *can* return a promise.
If a promise is returned, it will be added to the list of promises to resolve.

[$.when API reference](http://api.jquery.com/jQuery.when/)
