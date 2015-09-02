/**
 * @name links-receiver
 */
var inherit = require('inherit');
var vow = require('vow');
var Grabber = require('./grabber');

var Receiver = inherit({
    /**
     * @constructor
     */
    __constructor: function (settings) {
        this._settings = settings;

        this._grabber = new Grabber();
    },

    /**
     * Load categories page and parse post links
     * @param {Object} categories
     * @return {*}
     */
    _getPostsLinks: function (categories) {
        this._data = [];
        var i = 0;
        var promise = vow.defer();

        return this._getPostsLinksRecursive(categories, i, promise);
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
        var categoryUrl = categoriesUrls[i];
        var amount = this._settings.amountCategories;
        var amountPosts = this._settings.amountPostsForEachCategory;
        var j = 0;
        console.log("categoryUrl = ", categoryUrl);
        this._grabber.grab(categoryUrl)
            .then(function ($) {
                //var $ = cheerio.load(body);
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
                    this._getPostsLinksRecursive(categoriesUrls, i, promise);
                }
                if (i === amount) {
                    promise.resolve(this._data);
                }
            }, this);
        return promise.promise();
    }
});

module.exports = Receiver;