/* Magic Mirror
 * Module: MMM-NEO
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getNEO: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).near_earth_objects;
			//	console.log(response.statusCode);
                this.sendSocketNotification('NEO_RESULT', result);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_NEO') {
            this.getNEO(payload);
        }
    }
});
