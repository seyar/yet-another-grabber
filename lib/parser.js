/**
 * @name parser
 */
var inherit = require('inherit');
var Grabber = require('./grabber');

var Parser = inherit(Grabber, /** @lends Parser.prototype */ {
    __constructor: function (settings) {
        this._url = settings.baseUrl;

        this._settings = settings;
    }
});

module.exports = Parser;
