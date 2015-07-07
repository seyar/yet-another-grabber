var inherit = require('inherit');
var cheerio = require('cheerio');

var pageParser = inherit({
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
        var postHtml = options.postText;
        var jQ = cheerio.load(postHtml);

        var title = this._getTitle(jQ);
        var video = this._getVideo(jQ);
        var text = this._getText(jQ);
        var ingridients = this._getIngridients(jQ);

        var r = {
            title: title,
            video: video,
            text: text,
            ingridients: ingridients,
            source: url
        };

        return r;
    },

    /**
     *
     * @param jQ
     * @returns {*|{http://eda.ru}|XMLList}
     */
    _getTitle: function (jQ) {
        return jQ(this._settings.post.title).text();
    },

    /**
     *
     * @param jQ
     * @returns {*|{http://eda.ru}}
     * @private
     */
    _getVideo: function (jQ) {
        return jQ(this._settings.post.video).html();
    },

    /**
     *
     * @param jQ
     * @returns {*|{http://eda.ru}}
     * @private
     */
    _getText: function (jQ) {
        return jQ(this._settings.post.text).html();
    },

    /**
     *
     * @param jQ
     */
    _getIngridients: function (jQ) {
        var result = [];
        var $amounts = jQ(this._settings.post.ingridients[1]);

        jQ(this._settings.post.ingridients[0]).each(function (index) {
            var tmp = {
                ingridientName: jQ(this).text(),
                ingridientAmount: jQ($amounts[index]).text()
            };
            result.push(tmp);
        });
        return result;
    }
});

module.exports = pageParser;
