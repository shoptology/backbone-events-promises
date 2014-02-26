(function(Backbone) {
    var init = function(trigger, triggerEvents) {

    // backbone-events-promises
    // ========================
    //
    // This plugin to [backbone.js](http://backbonejs.org/) can add
    // promise functionality to Backbone.Events (and any Backbone
    // object which extends Backbone.Events - which is pretty much
    // all of them).
    //
    // Why?
    // ----
    //
    // You fire an event and need to make sure all event listeners
    // have finished their async calls before you do something destructive
    // like change the browser location.
    //
    // Dependencies
    // ------------
    // It implements promises by using `$.Deferred` and `$.when` either. This can be
    // provided via [jQuery](http://jquery.org) or [Zepto](http://zeptojs.com/) (requires
    // including Zepto's deferred plugin). Potentially, other
    // sources such as when.js could be used if a shim was provided to
    // apply it's functions to `$.Deferred` and `$.when`.
    //
    // It also depends on `_.extend()`. Underscore is already a hard dependency of Backbone,
    // so no harm done there.
    //
    // Backwards Breaking Changes
    // --------------------------
    // The only thing that happens by default here is setting
    // `Backbone.Events.promises()`.
    //
    // Backbone.Events.promises(enable, [context], [options]);
    // --------------------------------------------
    // Enables the backbone-promises functionality for events.

        Backbone.Events.promises = function(enable, context, options) {

            // The biggest change that happens after enabling backbone-promises
            // is that `Backbone.Events.trigger()` will return a promise. This means if
            // you are chaining a method after calling `trigger()` in your code
            // (ex. `.trigger(event).somethingElse()`), it will cause a fatal error and break.
            // However, backbone-promises can be configured to use a different method name
            // than `.trigger()` if you can think of a better name that won't cause
            // conflicts in your application.

            var method;
            if (enable === undefined) {
                enable = true;
            }
            options = options || {};
            options = _.extend({
                method: "trigger"
            }, options);
            method = options.method;

            // You can pass a context in the second parameter which will
            // apply the backbone-promises functionality to that object.
            // By default, the context is `Backbone.Events`.

            if (!context) {
                context = Backbone.Events;
            }

            // Additionally, the original functionality can
            // be restored by using `Backbone.Events.promises(false, [context])`.
            // backbone-promises also reserves use of `context._promises` to store configuration data.
            // Currently, it is used to store the original version of the trigger function.

            if (!enable) {
                if (!context._promises) {
                    return;
                }
                if (!context._promises.original) {
                    return;
                }
                method = context._promises.method;
                context[method] = context._promises.original;
                delete context._promises;
                return context;
            }

            if (enable) {
                if (context._promises) {
                    return;
                }
                context._promises = _.extend(options, {
                    original: context[method]
                });
                context[method] = trigger;
            }
        };
    },

    // Usage
    // -----

    // To enable on all Backbone objects, use the following code before creating
    // any Backbone objects in your application.
    //     var objs = ['Model', 'Collection', 'Router', 'View', 'History'];
    //     Backbone.Events.promises(true);
    //     for (var i = 0, l = objs.length; i < l; i++) {
    //         Backbone.Events.promises(true, Backbone[objs[i]].prototype);
    //     }

    // // Backbone.Events.trigger now returns a promise
    // var promise = Backbone.Events.trigger( "event name", arg1, arg2 );

    // // Each callback assigned to the event *can* return a promise.
    // // If a promise is returned, it will be added to the list of promises to resolve.
    // http://api.jquery.com/jQuery.when/

    // Under The Hood
    // --------------

    // Here we are modifying the `Backbone.Event.trigger()` method and we also
    // have to copy several private functions and aliases from the Backbone source
    // code. See annotated source over here: http://backbonejs.org/docs/backbone.html.
    // It should be exactly the same as the original version except it returns
    // a promise.
    // The promise object is the result of a `$.when()` call. The arguments to
    // `$.when are callbacks returning the results of each event listener.
    // See [api.jquery.com/jQuery.when/](http://api.jquery.com/jQuery.when/).

    array = [],
    push = array.push,
    slice = array.slice,
    splice = array.splice,
    eventSplitter = /\s+/,
    eventsApi = function(obj, action, name, rest) {
        if (!name) {
            return true;
        }
        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
            return false;
        }
        if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, l = names.length; i < l; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
            return false;
        }
        return true;
    },
    trigger = function(name) {
        if (!this._events) {
            return $.when();
        }
        var args = slice.call(arguments, 1);
        if (!eventsApi(this, 'trigger', name, args)) {
            return $.when();
        }
        var events = this._events[name];
        var allEvents = this._events.all;
        if (events) {
            return triggerEvents(events, args);
        }
        if (allEvents) {
            return triggerEvents(allEvents, arguments);
        }
        return $.when();
    },

    // We attempted to follow Backbone's lead here with
    // optimizing the manner to call event listeners. The idea is that
    // javascript's `call()` method is faster
    // than `apply` and most events are called with only a few arguments.
    //
    // This is where we differ from Backbone and create an
    // array of callback which is sent to `$.when()`.

    triggerEvents = function(events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2], cbs = [];
        switch (args.length) {
        case 0:
            while (++i < l) {
                cbs.push((ev = events[i]).callback.call(ev.ctx));
            }
            break;
        case 1:
            while (++i < l) {
                cbs.push((ev = events[i]).callback.call(ev.ctx, a1));
            }
            break;
        case 2:
            while (++i < l) {
                cbs.push((ev = events[i]).callback.call(ev.ctx, a1, a2));
            }
            break;
        case 3:
            while (++i < l) {
                cbs.push((ev = events[i]).callback.call(ev.ctx, a1, a2, a3));
            }
            break;
        default:
            while (++i < l) {
                cbs.push((ev = events[i]).callback.apply(ev.ctx, args));
            }
            break;
        }
        return $.when.apply($, cbs);
    };

    init(trigger, triggerEvents);

})(Backbone);
