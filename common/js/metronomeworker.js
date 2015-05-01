var timerID = null;
var interval = 100;

self.onmessage = function(e) {
    if ( e.data == "start" ) {
        console.log("Starting");
        timerID = setInterval(function() {
            postMessage("tick");
        },interval);
    } else if ( e.data.interval ) {
        interval = e.data.interval;
        console.log("Setting interval to " + interval);
        if ( timerID ) {
            clearInterval(timerID);
            timerID = setInterval(function() {
                postMessage("tick");
            }, interval);
        }
    } else if ( e.data=="stop" ) {
        console.log("Stopping");
        clearInterval(timerID);
        timerID = null;
    }
};
