/**
 * @name parser
 */
var inherit = require('inherit');

var Parser = inherit({
    __constructor: function (page) {
        this._page = page;
    },

    setPage: function (page) {
        this._page = page;
    }
});

module.exports = Parser;
