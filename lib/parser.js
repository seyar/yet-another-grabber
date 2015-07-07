/**
 * @name parser
 */
var inherit = require('inherit');
var Grabber = require('./grabber');

var Parser = inherit(Grabber, /** @lends Parser.prototype */{
    __constructor: function (settings) {
        'use strict';

        this._url = Object.keys(settings)[0];

        this._settings = settings[this._url];
    }
    //
    //setPage: function (page) {
    //    'use strict';
    //
    //    /**
    //     * Page html
    //     *
    //     * @type {Promise}
    //     */
    //    this._page = page;
    //}
});

module.exports = Parser;
