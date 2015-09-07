/**
 * @name categories
 */
var inherit = require('inherit');
var Grabber = require('./grabber');
var utils = require('./utils');
var CategoryModel = require('./models/category');

var Categories = inherit({

    /**
     * @constructor
     */
    __constructor: function () {
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
     * @returns {Promise}
     */
    parseCategories: function (url) {
        console.info('Start parse categories on url = ', url);

        return this._grabber.grab(url)
            .then(this._parseCategories, this)
            .then(function (categories) {
                return categories;
            })
            .fail(function (error) {
                throw new Error(error);
            });
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
        var status = [this.__self.STATUS_ACTIVE];
        $links.each(function () {
            var url = $(this).attr('href');
            result.push(new CategoryModel({
                url: utils.lastUrlPart(url),
                source: url,
                title: $(this).text(),
                status: status
            }));
        });

        return result;
    }
}, {
    STATUS_ACTIVE: 'active'
});

module.exports = Categories;
