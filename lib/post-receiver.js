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
    getPost: function (link) {
        return this._getPost(link)
            .then(this._parsePost, this)
            .fail(function (error) {
                throw new Error(error);
            })
    },

    /**
     * Load posts
     *
     * @param {String} url
     * @returns {Promise}
     * @returns {Object} url
     * @returns {Object} postText
     */
    _getPost: function (url) {
        return this._grabber.grab(url)
            .then(function (post) {
                return {postUrl: url, postText: post};
            })
            .fail(function (error) {
                throw new Error(error);
            });
    },

    /**
     * Parse post into variables
     *
     * @returns {Post[]}
     */
    _parsePost: function (post) {
        return this._postAdapter.parse(post);
    }
});

module.exports = PostReceiver;