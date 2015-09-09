var inherit = require('inherit');
var PostLinksReceiver = require('./post-links-receiver');
var PostReceiver = require('./post-receiver');
var imageLoader = require('./image-loader');
var vow = require('vow');

var Parser = inherit(/** @lends Parser.prototype */ {
    /**
     * @constructor
     * @param {Object} settings
     * @param {Db} db instance
     */
    __constructor: function (settings, db) {
        this._settings = settings;

        this._postLinksReceiver = new PostLinksReceiver(settings);
        this._postReceiver = new PostReceiver(settings);
    },

    /**
     * Start parsing
     *
     * @returns {Promise}
     */
    parse: function () {
        console.info('Start parse posts');
        var p;
        return this._postLinksReceiver.getPostsLinks.apply(this._postLinksReceiver)
            .then(this._postReceiver.getPosts, this._postReceiver)
            .then(function (posts) {
                p = posts;
                var imageLoadPromises = [];
                posts.forEach(function (post) {
                    imageLoadPromises.push(imageLoader.load(post));
                });
                return vow.all(imageLoadPromises);
            })
            .then(function (imageLinks) {
                console.log("imageLinks = ", imageLinks);
            })
            .fail(function (err) {
                throw new Error(err);
            });
    }
});

module.exports = Parser;
