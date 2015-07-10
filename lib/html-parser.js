var inherit = require('inherit');
var Parser = require('./parser');
var cheerio = require('cheerio');
var vow = require('vow');
var PageParser = require('./page-parser');
var Edaru = require('./eda-ru-page-parser');

var HtmlParser = inherit(Parser, /** @lends Parser.prototype */ {
    /**
     * @constructor
     * @param {Object} settings
     */
    __constructor: function () {
        this.__base.apply(this, arguments);

        this._defaultPageParser = new PageParser(this._settings);
        this._pageParsers = {
            edaru: new Edaru(this._settings)
        };
    },

    /**
     * Start parsing
     *
     * @returns {Promise}
     */
    parse: function () {
        console.log('Start');
        return this.grab(this._url)
            .then(this._parseCategories, this)
            .then(this._getPostsLinks, this)
            .then(this._getPosts, this)
            .then(this._parsePosts, this)
        ;
    },

    /**
     *
     * @returns {Promise}
     */
    parseCategories: function () {
        return this.grab(this._url)
            .then(this._parseCategories, this);
    },

    /**
     * Parse categories into links
     *
     * @param {Html} body
     * @returns {Promise}
     */
    _parseCategories: function (body) {
        var jQ = cheerio.load(body);
        var $links = jQ(this._settings.categories.querySelector);

        var result = [];
        $links.each(function () {
            result.push({
                url: jQ(this).attr('href'),
                title: jQ(this).text()
            });
        });
        this._categories = result;
        return result;
    },

    /**
     * Load categories page and parse post links
     */
    _getPostsLinks: function () {
        this._data = [];
        var i = 0;
        var promise = vow.defer();

        return this._getPostsLinksRecursive(this._categories, i, promise);
    },

    /**
     * Recursivly gets categories
     *
     * @param categoriesUrls
     * @param i
     * @param promise
     * @returns {*}
     */
    _getPostsLinksRecursive: function (categoriesUrls, i, promise) {
        var categoryUrl = categoriesUrls[i].url;
        var amount = this._settings.amountCategories;
        var amountPosts = this._settings.amountPostsForEachCategory;
        var j = 0;
        this.grab(categoryUrl)
            .then(function (body) {
                var jQ = cheerio.load(body);
                var $links = jQ(this._settings.postsLinks.querySelector);
                var result = this._data;
                $links.each(function () {
                    if (j < amountPosts) {
                        result.push({
                            categoryUrl: categoryUrl,
                            postUrl: jQ(this).attr('href')
                        });
                    }
                    j++;
                });
            }, this)
            .fail(function (error) {
                throw new Error(error);
            })
            .done(function () {
                i++;
                if (i < amount) {
                    this._getPostsLinksRecursive(categoriesUrls, i, promise);
                }
                if (i === amount) {
                    promise.resolve(this._data);
                }
            }, this);
        return promise.promise();
    },

    /**
     * Load posts
     *
     * @returns {Promise}
     */
    _getPosts: function () {
        var i = 0;
        var promise = vow.defer();
        // this._data.forEach(function (item) {
        return this._getPostsRecursive(i, promise);
        // }.bind(this));
        // return promise.promise();
    },

    _getPostsRecursive: function (i, promise) {
        // var amount = this._settings.amountPostsForEachCategory;

        if (!this._data[i]) {
            promise.resolve(this._data);
            return true;
        }

        var postUrl = this._data[i].postUrl;
        this.grab(postUrl)
            .then(function (post) {
                this._data[i].postText = post;
            }, this)
            .fail(function (error) {
                throw new Error(error);
            })
            .done(function () {
                i++;
                this._getPostsRecursive(i, promise);
            }, this);

        return promise.promise();
    },

    /**
     * Parse post into variables
     *
     * @returns {Array}
     */
    _parsePosts: function () {
        var pageParser = this._getPageParser();
        var newData = pageParser.parse(this._data);

        return newData;
    },

    _getPageParser: function () {
        var parserKey = this._url
            .replace(/http[s]?:\/\//, '')
            .replace('.', '');

        return this._pageParsers[parserKey] || this._defaultPageParser;
    }
});

module.exports = HtmlParser;
