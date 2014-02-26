/* global describe, before, it, after, Backbone, _, sinon, $ */

(function () {
    "use strict";

    describe("backbone-promises", function () {
        before(function() {
            Backbone.Events.promises(true);
        });

        after(function() {
            Backbone.Events.promises(false);
        });

        it("should return a promise from Backbone.Events.trigger()", function() {
            var promise;
            Backbone.Events.promises(true);
            promise = Backbone.Events.trigger( "test" );
            should.exist(promise.then);
            promise.then.should.be.a("function");
            Backbone.Events.promises(false);
            promise = Backbone.Events.trigger( "test" );
            should.not.exist(promise.then);
        });

        it("should finish all Backbone events callbacks before calling the function passed to then()", function(done) {
            var events, callback, createEvent, i, spies = [];
            Backbone.Events.promises();
            events = _.extend({}, Backbone.Events);
            callback = sinon.spy();
            createEvent = function() {
                var spy = sinon.spy(), listener;
                listener = function() {
                    var deferred = $.Deferred(), callback;
                    callback = function() {
                        spy();
                        deferred.resolve();
                    };
                    window.setTimeout(callback, 1000);
                    // callback();
                    return deferred.promise();
                };
                events.on( "test", listener );
                return spy;
            };
            for (i = 0; i < 3; i++) {
                spies.push(createEvent());
            }
            events.trigger( "test" ).then(function() {
                callback();
                spies.push(callback);
                sinon.assert.callOrder.apply(sinon.assert, spies);
                done();
            });
        });
    });
})();
