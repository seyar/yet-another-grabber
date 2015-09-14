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
     * @param {String} data.categoryId
     * @param {String} data.title
     * @param {String} data.slug 255 символов предтекст
     * @param {String} data.textPreview 255 символов предтекст
     * @param {String} data.text
     * @param {String} data.video
     * @param {String} data.user
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

    getCategoryId: function () {
        return this._data.categoryId;
    },

    setCategoryId: function (categoryId) {
        return this._data.categoryId = categoryId;
    },

    getTitle: function () {
        return this._data.title;
    },

    getText: function () {
        return this._data.text;
    },

    setText: function (text) {
        return this._data.text = text;
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

    getUser: function () {
        return this._data.user;
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