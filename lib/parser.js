var inherit = require('inherit');
var PostLinksReceiver = require('./post-links-receiver');
var PostReceiver = require('./post-receiver');
var imageLoader = require('./image-loader');

var Parser = inherit(/** @lends Parser.prototype */ {
    /**
     * @constructor
     * @param {Object} settings
     * @param {Db} db
     */
    __constructor: function (settings, db) {
        this._settings = settings;
        this._db = db;

        this._postLinksReceiver = new PostLinksReceiver(settings);
        this._postReceiver = new PostReceiver(settings);
    },

    /**
     * Start parsing
     *
     * @param {Post[]} existingPosts instance
     * @returns {*}
     */
    parse: function (existingPosts) {
        console.info('Start parse posts');
        var p;
        var categoryUrl;
        return this._getPostsLinks(existingPosts)
            .then(function (link) {
                categoryUrl = link.categoryUrl;
                return link.postUrl;
            })
            .then(this._postReceiver.getPost, this._postReceiver)
            .then(function (post) {
                p = post;
                var categoryId = this._defineCategory(categoryUrl);
                return categoryId;
            }, this)
            .then(function (categoryId) {
                p.setCategoryId(categoryId);
                return p;
            }, this)
            .then(function (post) {
                return imageLoader.load(post, this._settings.baseUrl);
            }, this)
            .then(function (imageLinks) {
                if (imageLinks) {
                    var text = imageLoader.replaceImageUrls(p.getText(), imageLinks);
                    p.setText(text);
                }
                return p;
            })
            .fail(function (err) {
                throw new Error(err);
            });
    },

    _getPostsLinks: function (existingPosts) {
        return this._postLinksReceiver.getPostsLinks(existingPosts);
    },

    /**
     *
     * @param {String} categoryUrl
     * @returns {*|Promise}
     */
    _defineCategory: function (categoryUrl) {
        return this._db.getCategoryByUrl(categoryUrl);
    }
});

module.exports = Parser;
