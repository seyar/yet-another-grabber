var inherit = require('inherit');
var utils = require('./../utils');
var Post = require('../models/post');
var imageLoader = require('../image-loader');

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
     * Parses one page
     *
     * @param {Array} data
     * @param {Object} data.0
     * @returns {Array}
     */
    parse: function (data) {
        if (!Array.isArray(data)) {
            throw new Error('Data is not array');
        }

        return data.map(function (item) {
            return this._parse(item);
        }.bind(this));
    },

    /**
     *
     * @param {Object} options
     * @param {Object} options.categoryUrl
     * @param {Object} options.postUrl
     * @param {Object} options.postText
     * @returns {Object}
     */
    _parse: function (options) {
        var url = options.postUrl;
        var $ = options.postText;
        imageLoader.load($(this._settings.post.text));
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
        // TODO fix bug with .html() and encoding
        return $(this._settings.post.text).text();
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
