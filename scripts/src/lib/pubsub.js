'use strict';

export default {
  events: {},

  // publish
  emit: function(eventName, data) {
    if (this.events[eventName]) {
      console.log(this.events[eventName]);
      this.events[eventName].forEach((fn) => {
        fn(data);
      });
    }
  },


  // subscribe
  subscribe: function(eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
    console.log(this.events);
  },

  // unsubscribe
  unsubscribe: function(eventName, fn) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((item) => {
          return item.name !== fn.name;
        });
    }
  },

};
