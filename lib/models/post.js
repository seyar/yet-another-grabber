/**
 * @name post-model
 */
var inherit = require('inherit');

var Post = inherit({
    /**
     * @constructor
     *
     * @param {Object} data
     * @param {String} data.url
     * @param {String} data.title
     * @param {String} data.slug 255 символов предтекст
     * @param {String} data.textPreview 255 символов предтекст
     * @param {String} data.text
     * @param {String} data.video
     * @param {Boolean} data.hasVideo
     * @param {String} data.source
     * @param {String} data.status
     * @param {Array} data.ingridients
     */
    __constructor: function (data) {
        this._data = data;
    },

    getUrl: function () {
        return this._data.url;
    },

    getTitle: function () {
        return this._data.title;
    },

    getText: function () {
        return this._data.text;
    },

    getSlug: function () {
        return this._data.slug;
    },

    getTextPreview: function () {
        return this._data.textPreview;
    },

    getVideo: function () {
        return this._data.video;
    },

    getSource: function () {
        return this._data.source;
    },

    getStatus: function () {
        return this._data.status;
    },

    hasVideo: function () {
        return Boolean(this._data.video);
    },

    getIngridients: function () {
        return this._data.ingridients;
    }
});

module.exports = Post;