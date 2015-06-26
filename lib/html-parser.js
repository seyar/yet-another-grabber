var inherit = require('inherit');
var Parser = require('./parser');
var cheerio = require('cheerio');

var HtmlParser = inherit(Parser, /** @lends Parser.prototype */ {
    __constructor: function (pagePromise, settings) {
        this.__base.apply(this, [pagePromise]);

        this._settings = settings;
    },

    /**
     * Categories setter
     *
     * @param {Object} categories
     */
    setCategories: function (categories) {
        this._categories = categories;
    },

    /**
     * Parse categories into links
     *
     * @returns {Promise}
     */
    parseCategories: function () {
        return this._page
            .then(function (body) {
                var jQ = cheerio.load(body);
                var $links = jQ(this._settings.categories.querySelector);

                var result = [];
                $links.each(function (i, link) {
                    result.push(jQ(this).attr('href'));
                });

                return result;
            }, this);
    },

    getPostsLinks: function () {
        return this._page
            .then(function (body) {
                var jQ = cheerio.load(body);
                var $links = jQ(this._settings.postsLinks.querySelector);

                var result = [];
                $links.each(function (i, link) {
                    result.push(jQ(this).attr('href'));
                });

                return result;
            }, this);
    },

    getPost: function (url) {
        url = this._categories[0];

    }
});

module.exports = HtmlParser;
