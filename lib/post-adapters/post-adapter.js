var inherit = require('inherit');
var utils = require('./../utils');
var Post = require('../models/post');

var STATUS_INACTIVE = 'inactive';
var ADMIN_ID = '55ef32a1630753590f90aad4';

var PostAdapter = inherit({
    /**
     * @constructor
     * @param {Object} settings
     */
    __constructor: function (settings) {
        this._settings = settings;
    },

    /**
     *
     * @param {Object} post
     * @param {Object} post.postUrl
     * @param {Object} post.postText
     * @returns {Object}
     */
    parse: function (post) {
        var url = post.postUrl;
        var $ = post.postText;
        var text = this._getText($);

        var post = new Post({
            url: url,
            title: this._getTitle($),
            video: this._getVideo($),
            slug: utils.striptags(text).slice(0, 255),
            textPreview: utils.striptags(text).slice(0, 255),
            text: text,
            user: ADMIN_ID,
            source: url,
            hasVideo: Boolean(text.indexOf('<object') !== -1),
            ingridients: this._getIngridients($),
            status: STATUS_INACTIVE
        });

        return post;
    },

    /**
     *
     * @param $
     * @returns {*|{http://eda.ru}|XMLList}
     */
    _getTitle: function ($) {
        return $(this._settings.post.title).text();
    },

    /**
     *
     * @param $
     * @returns {*|{http://eda.ru}}
     * @private
     */
    _getVideo: function ($) {
        return $(this._settings.post.video).html();
    },

    /**
     *
     * @param $
     * @returns {*|{http://eda.ru}}
     * @private
     */
    _getText: function ($) {
        return $(this._settings.post.text).html();
    },

    /**
     *
     * @param $
     */
    _getIngridients: function ($) {
        var result = [];
        var $amounts = $(this._settings.post.ingridients[1]);

        $(this._settings.post.ingridients[0]).each(function (index) {
            var tmp = {
                ingridientName: $(this).text(),
                ingridientAmount: $($amounts[index]).text()
            };
            result.push(tmp);
        });

        return JSON.stringify(result);
    }
});

module.exports = PostAdapter;
