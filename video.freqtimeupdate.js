
// Polyfill from MDN for the CustomEvent constructor in IE9+
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

(function(global) {
    'use strict';

    // Create the new `freqtimeupdate` event
    var freqtimeupdate = global.CustomEvent('freqtimeupdate'),

        // The event frequency in milliseconds
        frequency = 100,

        // Wrappers around setInterval and clearInterval to ensure one interval per video
        setInterval = function() {
            if (!this.hasOwnProperty('_interval')) {
                this._interval = global.setInterval(intervalFunc.bind(this), frequency);
            }
        },

        clearInterval = function() {
            global.clearInterval(this._interval);
            delete this._interval;
        },

        // The actual interval function that dispatches the event
        intervalFunc = function() {
            this.dispatchEvent(freqtimeupdate);
        },

        // Get all videos from the page to add the event to
        videos = global.document.getElementsByTagName('video');

    // Add listeners to the videos for adding and removing the interval
    for (var i = 0; i < videos.length; i++) {
        if (!videos[i].paused) {
            setInterval.call(videos[i]);
        }

        videos[i].addEventListener('play', setInterval);
        videos[i].addEventListener('playing', setInterval);
        videos[i].addEventListener('seeked', setInterval);

        videos[i].addEventListener('abort', clearInterval);
        videos[i].addEventListener('emptied', clearInterval);
        videos[i].addEventListener('ended', clearInterval);
        videos[i].addEventListener('pause', clearInterval);
    };
})(window);
