var inherit = require('inherit');
var PostLinksReceiver = require('./post-links-receiver');
var PostReceiver = require('./post-receiver');

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
        return this._postLinksReceiver.getPostsLinks.apply(this._postLinksReceiver)

            .then(this._postReceiver.getPosts, this._postReceiver)
            .fail(function (err) {
                throw new Error(err);
            });
    }
});

module.exports = Parser;
