/**
 * @name categories
 */
var inherit = require('inherit');
var Grabber = require('./grabber');
var utils = require('./utils');

var Categories = inherit({

    /**
     * @constructor
     */
    __constructor: function (params) {
        this._grabber = new Grabber();
    },

    /**
     * Задает критерий поиска категорий
     *
     * @param {String} querySelector
     */
    setQuerySelector: function (querySelector) {
        this._querySelector = querySelector;
    },

    /**
     *
     * @param {String} url
     * @returns {*}
     */
    parseCategories: function (url) {
        console.info('Start parse categories on url = ', url);

        return this._grabber.grab(url)
            .then(this._parseCategories, this);
    },

    /**
     * Parse categories into links from one html page
     *
     * @param {Html} body
     * @returns {Object} {url: '', title: ''}
     * @returns {Promise}
     */
    _parseCategories: function ($) {
        var $links = $(this._querySelector);

        var result = [];
        $links.each(function () {
            var url = $(this).attr('href');
            result.push({
                url: utils.lastUrlPart(url),
                title: $(this).text(),
                source: url
            });
        });
        this._categories = result;
        return result;
    }
});

module.exports = Categories;
