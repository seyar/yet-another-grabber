/**
 * @name links-receiver
 */
var inherit = require('inherit');
var vow = require('vow');
var Grabber = require('./grabber');
var Categories = require('./categories');

var Receiver = inherit({
    /**
     * @constructor
     */
    __constructor: function (settings) {
        this._settings = settings;

        this._grabber = new Grabber();

        this._categoriesGrabber = new Categories();
        this._categoriesGrabber.setQuerySelector(this._settings.categories.querySelector);
    },

    /**
     *
     * @returns {Object[]} postLinks
     * @returns {String} postLinks.categoryUrl
     * @returns {String} postLinks.postUrl
     */
    getPostsLinks: function () {
        var url = this._settings.baseUrl + this._settings.categories.url;

        return this._getCategoriesLinks(url)
            .then(this._getPostsLinks, this)
            .then(function (links) {
                return links[0];
            });
    },

    /**
     *
     * @param {String[]} categoriesUrl
     * @returns {Promise}
     */
    _getCategoriesLinks: function (categoriesUrl) {
        return this._categoriesGrabber.parseCategories(categoriesUrl)
            .then(function (categories) {
                return categories.map(function (category) {
                    return category.getSource();
                });
            })
            .fail(function (err) {
                throw new Error(error);
            });
    },

    /**
     * Load categories page and parse post links
     *
     * @param {String[]} categories
     * @returns {Promise}
     */
    _getPostsLinks: function (categoriesUrls) {
        this._data = [];
        var i = 0;
        var defer = vow.defer();

        return this._getPostsLinksRecursive(categoriesUrls, i, defer);
    },

    /**
     * Recursivly gets categories
     *
     * @param categoriesUrls
     * @param i
     * @param defer
     * @returns {*}
     */
    _getPostsLinksRecursive: function (categoriesUrls, i, defer) {
        var categoryUrl = categoriesUrls[i];
        var amount = this._settings.amountCategories;
        var amountPosts = this._settings.amountPostsForEachCategory;
        var j = 0;

        this._grabber.grab(categoryUrl)
            .then(function ($) {
                var $links = $(this._settings.postsLinks.querySelector);
                var result = this._data;
                $links.each(function () {
                    if (j < amountPosts) {
                        result.push({
                            categoryUrl: categoryUrl,
                            postUrl: $(this).attr('href')
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
                    this._getPostsLinksRecursive(categoriesUrls, i, defer);
                }
                if (i === amount) {
                    defer.resolve(this._data);
                }
            }, this);
        return defer.promise();
    }
});

module.exports = Receiver;