var inherit = require('inherit');
var utils = require('./../utils');

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
        if (Array.isArray(data)) {
            return data.map(function (item) {
                item.mongoData = this._parse(item);
                delete item.postText;
                return item;
            }.bind(this));
        }
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

        var title = this._getTitle($);
        var video = this._getVideo($);
        var text = this._getText($);
        var ingridients = this._getIngridients($);

        var r = {
            url: url,
            title: title,
            video: video,
            slug: utils.striptags(text).slice(0, 255),
            textPreview: utils.striptags(text).slice(0, 255),
            text: text,
            source: url,
            hasVideo: Boolean(text.indexOf('<object') !== -1),
            ingridients: ingridients
        };

        return r;
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
        console.log("this._settings.post.text = ", this._settings.post.text);
        var str = $(this._settings.post.text).html();
        return utils.cleanText(str);
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
