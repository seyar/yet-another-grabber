var request = require('request');
var vow = require('vow');

/**
 * Grabber for sites and rss
 *
 * @constructor
 */
function Grabber() {

}

/**
 * Retrieves html from site
 *
 * @param {String} url
 * @returns {Promise}
 */
Grabber.prototype.grab = function (url) {
    var defer = vow.defer();
    request(url, function (error, response, body) {
        if (error) {
            defer.reject(error);
        } else {
            defer.resolve(body);
        }
    });
    return defer.promise();
};

module.exports = new Grabber();