var inherit = require('inherit');
var request = require('request');
var vow = require('vow');
var cheerio = require('cheerio');

var Grabber = inherit({
    __constructor: function () {
        this._results = {};
    },

    /**
     * Retrieves html from site
     *
     * @param {String} url
     * @returns {Promise} cheerio obj
     */
    grab: function (url) {
        var defer = vow.defer();

        if (this._results[url]) {
            return defer.resolve(this._results[url]);
        }

        request(url, function (error, response, body) {
            if (error) {
                defer.reject(error);
            } else {
                var jQ = cheerio.load(body);
                this._results[url] = jQ;
                defer.resolve(jQ);
            }
        }.bind(this));

        return defer.promise();
    }
});

module.exports = Grabber;
