var inherit = require('inherit');
var PostLinksReceiver = require('./post-links-receiver');
var PostReceiver = require('./post-receiver');
var imageLoader = require('./image-loader');

var Parser = inherit(/** @lends Parser.prototype */ {
    /**
     * @constructor
     * @param {Object} settings
     */
    __constructor: function (settings) {
        this._settings = settings;

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
        return this._getPostsLinks(existingPosts)
            .then(this._postReceiver.getPost, this._postReceiver)
            .then(function (post) {
                p = post;
                return imageLoader.load(post);
            })
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
    }
});

module.exports = Parser;
