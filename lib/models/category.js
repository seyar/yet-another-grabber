/**
 * @name category-model
 */
var inherit = require('inherit');

var Category = inherit({
    /**
     * @constructor
     * @param {Object} data
     * @param {String} data.title
     * @param {String} data.url
     * @param {String} data.status
     */
    __constructor: function (data) {
        this._data = data
    },

    getTitle: function () {
        return this._data.title;
    },

    getUrl: function () {
        return this._data.url;
    },

    getStatus: function () {
        return this._data.status;
    },

    toString: function () {
        return {
            title: this.getTitle(),
            url: this.getUrl(),
            status: this.getStatus()
        };
    }
});

module.exports = Category;