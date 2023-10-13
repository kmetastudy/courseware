// events - a super-basic Javascript (publish subscribe) pattern
// Modular Javascript #5 - PubSub Implementation
// https://www.youtube.com/watch?v=jDhDvnlbr4Q&list=PLoYCgNOIyGABs-wDaaxChu82q_xQgUb4f&index=5

// learncodeacademy/pubsub.js
// https://gist.github.com/learncodeacademy/777349747d8382bfb722

export var mtvEvents = {
    events: {},
    on: function (eventName, fn) {
        // console.log('eventName : ', eventName);
        // console.log('eventFn : ', fn);
        
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off: function(eventName, fn) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            };
        }
    },
    emit: function (eventName, data) {
        // console.log('emit : ', eventName);
        if (this.events[eventName]) {
            // console.log(this.events[eventName]);
            this.events[eventName].forEach(function(fn) {
                fn(data);
            });   
        }
    }
};

