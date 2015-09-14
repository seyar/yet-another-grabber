/**
 * @name links-receiver
 */
var inherit = require('inherit');
var vow = require('vow');
var Grabber = require('./grabber');
var Categories = require('./categories');

var Receiver = inherit({
    /**
     * @param {Object} options
     * @constructor
     */
    __constructor: function (options) {
        this._settings = options;

        this._grabber = new Grabber();

        this._categoriesGrabber = new Categories();
        this._categoriesGrabber.setQuerySelector(this._settings.categories.querySelector);
    },

    /**
     *
     * @returns {*} postLinks
     * @returns {String} postLinks.categoryUrl
     * @returns {String} postLinks.postUrl
     */
    getPostsLinks: function (existingPosts) {
        var url = this._settings.baseUrl + this._settings.categories.url;

        return this._getCategoriesLinks(url)
            .then(this._getPostsLinks, this)
            .then(function (links) {
                if (!links.length) {
                    throw new Error('no post links');
                }
                return this._getIsNotExistingPost(existingPosts, links);
            }, this)
            .fail(function (err) {
                throw new Error(err);
            });
    },

    /**
     * Grabs categories from remote site
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
        var baseUrl = this._settings.baseUrl;
        //var amountPosts = this._settings.amountPostsForEachCategory;
        //var j = 0;

        this._grabber.grab(categoryUrl)
            .then(function ($) {
                var $links = $(this._settings.postsLinks.querySelector);
                var result = this._data;
                $links.each(function () {
                    var url = $(this).attr('href');
                    // if href doesnt contains base url
                    if (url.indexOf('http') === -1) {
                        url = (baseUrl + url).replace(/([^:])\/\//, '$1/');
                    }
                    result.push({
                        categoryUrl: categoryUrl,
                        postUrl: url
                    });
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
    },

    /**
     * Define if post exists
     *
     * @param {Post[]} existingPosts
     * @param {Object} links
     * @param {String} links.postUrl
     * @returns {*}
     */
    _getIsNotExistingPost: function (existingPosts, links) {
        var result;
        if (existingPosts.length > 0) {
            links.forEach(function (link) {
                var exists = false;
                existingPosts.forEach(function (post) {
                    if (post.getSource() === link.postUrl) {
                        exists = true;
                        return;
                    }
                });
                if (!exists) {
                    result = link;
                    return link;
                }
            });
            return result;
        } else {
            return links[0];
        }
    }
});

module.exports = Receiver;