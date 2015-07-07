var inherit = require('inherit');
var request = require('request');
var vow = require('vow');

var Grabber = inherit({
    /**
     * Retrieves html from site
     *
     * @param {String} url
     * @returns {Promise}
     */
    grab: function (url) {
        'use strict';

        var defer = vow.defer();
        request(url, function (error, response, body) {
            if (error) {
                defer.reject(error);
            } else {
                defer.resolve(body);
            }
        });
        return defer.promise();
    }
});

module.exports = Grabber;