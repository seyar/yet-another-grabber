var inherit = require('inherit');
var Grabber = require('./grabber');
var vow = require('vow');
var PostAdapterFactory = require('./post-adapters/post-adapter-factory');
var PostLinksReceiver = require('./post-links-receiver');

var Parser = inherit(/** @lends Parser.prototype */ {
    /**
     * @constructor
     * @param {Object} settings
     * @param {Db} db instance
     */
    __constructor: function (settings, db) {
        //this._url = settings.baseUrl;

        this._db = db;

        this._settings = settings;

        this._grabber = new Grabber();

        this._postAdapter = PostAdapterFactory.getPageAdapter(this._settings.adapter, settings);

        this._postLinksReceiver = new PostLinksReceiver(settings);
    },

    /**
     * Start parsing
     *
     * @returns {Promise}
     */
    parse: function () {
        console.info('Start parse posts');
        return this._db.getCategories()
            // this._grabber.grab(this._url)
            .then(this._getCategoryLinks, this)
            .then(this._postLinksReceiver._getPostsLinks, this._postLinksReceiver)
            .then(this._getPosts, this)
            .then(this._parsePosts, this)
            .fail(function (err) {
                throw new Error(err);
            });
    },

    /**
     * Load posts
     *
     * @returns {Promise}
     */
    _getPosts: function (links) {
        var i = 0;
        var promise = vow.defer();
console.log("links = ", links);
        // this._data.forEach(function (item) {
        return this._getPostsRecursive(links, i, promise);
        // }.bind(this));
        // return promise.promise();
    },

    _getPostsRecursive: function (links, i, promise) {
// var amount = this._settings.amountPostsForEachCategory;

        if (!links[i]) {
            promise.resolve(links);
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
                this._getPostsRecursive(links, i, promise);
            }, this);

        return promise.promise();
    },

    /**
     * Parse post into variables
     *
     * @returns {Array}
     */
    _parsePosts: function (posts) {
        var newData = this._postAdapter.parse(posts);

        return newData;
    },

    _getCategoryLinks: function (dbCategories) {
        var map = dbCategories.data.map(function (category) {
            return category.source;
        });
        return map;
    }
});

module.exports = Parser;
