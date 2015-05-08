'use strict';

/* jasmine specs for Reservation Controller Helpers */

describe('controller.reservation helpers test', function() {

    beforeEach(module('controller.reservation'));


    describe('helpers test', function() {
        var log, factoryHelpers, events;

        beforeEach(inject(function(helpers, _$log_) {
            log = _$log_;
            factoryHelpers = helpers
            
            events = [{
                "start": moment("2015-05-07 7:30", "YYYY-MM-DD HH:mm"),
                "end": moment("2015-05-07 9:00", "YYYY-MM-DD HH:mm"),
                "title": 'Event 1'
            }, {
                "start": moment("2015-05-07 9:00", "YYYY-MM-DD HH:mm"),
                "end": moment("2015-05-07 10:30", "YYYY-MM-DD HH:mm"),
                "title": 'Event 2'
            }, {
                "start": moment("2015-05-07 9:30", "YYYY-MM-DD HH:mm"),
                "end": moment("2015-05-07 10:30", "YYYY-MM-DD HH:mm"),
                "title": 'Event 3'
            }]

            
        }));

        it("should return Event 1 and Event 2.", function() {
            
            var eventStart = moment("2015-05-07 8:30", "YYYY-MM-DD HH:mm");
            var eventEnd = moment("2015-05-07 9:30", "YYYY-MM-DD HH:mm");
        
            var selectedEvents = factoryHelpers.eventsInTime(events, eventStart, eventEnd);
            
            expect(selectedEvents.length).toEqual(2);
            expect(selectedEvents[0].title).toBe('Event 1');
            expect(selectedEvents[1].title).toBe('Event 2');
            
        });
    
    });

});