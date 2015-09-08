var inherit = require('inherit');
var request = require('request');
var vow = require('vow');
var cheerio = require('cheerio');
var loader = require('./image-loader');
var iconv = require('iconv-lite');
var jschardet = require('jschardet');
var charset = require('charset');
var utils = require('./utils');

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
            defer.resolve(this._results[url]);
        } else {
            request({url: url, encoding: 'utf-8'}, function (error, response, body) {
                if (error) {
                    defer.reject(error);
                } else {
                    var enc = charset(response.headers, body);
                    enc = enc || jschardet.detect(body).encoding.toLowerCase();
                    enc = enc === 'utf-8' ? 'utf8' : enc;

                    if (enc != 'utf8') {
                        body = iconv.decode(new Buffer(body, 'binary'), 'utf-8');
                    }
                    body = utils.cleanText(body);
                    var $ = cheerio.load(body);
                    this._results[url] = $;
                    defer.resolve($);
                }
            }.bind(this));
        }

        return defer.promise();
    }
});

module.exports = Grabber;
