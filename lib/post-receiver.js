/**
 * @name post-receiver
 */
var inherit = require('inherit');
var vow = require('vow');
var Grabber = require('./grabber');
var PostAdapterFactory = require('./post-adapters/post-adapter-factory');

var PostReceiver = inherit({
    /**
     * @constructor
     */
    __constructor: function (settings) {
        this._grabber = new Grabber();
        this._postAdapter = PostAdapterFactory.getPageAdapter(settings.adapter, settings);
    },

    /**
     * Load posts
     *
     * @returns {Promise}
     */
    getPosts: function (links) {
        return this._getPosts(links)
            .then(this._parsePosts, this)
            .fail(function (error) {
                throw new Error(error);
            })
    },

    /**
     * Load posts
     *
     * @returns {Promise}
     */
    _getPosts: function (links) {
        var i = 0;
        var defer = vow.defer();

        return this._getPostsRecursive(links, i, defer);
    },

    /**
     *
     * @param {Object[]} links
     * @param {String} links.postUrl
     * @param {Number} i
     * @param {Promise} defer
     * @returns {Promise}
     */
    _getPostsRecursive: function (links, i, defer) {
        if (!links[i]) {
            defer.resolve(links);
            return true;
        }

        var postUrl = links[i].postUrl;
        this._grabber.grab(postUrl)
            .then(function (post) {
                links[i].postText = post;
            }, this)
            .fail(function (error) {
                throw new Error(error);
            })
            .done(function () {
                i++;
                this._getPostsRecursive(links, i, defer);
            }, this);

        return defer.promise();
    },

    /**
     * Parse post into variables
     *
     * @returns {Post[]}
     */
    _parsePosts: function (posts) {
        return this._postAdapter.parse(posts);
    }
});

module.exports = PostReceiver;