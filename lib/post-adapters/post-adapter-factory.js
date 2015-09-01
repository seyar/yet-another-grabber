/**
 * @name post-adapter-factory
 * @type {string[]}
 */
var inherit = require('inherit');
var PostAdapter = require('./post-adapter');
var Edaru = require('./eda-ru-post-adapter');

var ADAPTERS = {
    edaru: Edaru
};
var PostAdapterFactory = inherit(null, {
    getPageAdapter: function (adapter, settings) {
        var result;
        if (ADAPTERS[adapter]) {
            return new ADAPTERS[adapter](settings);
        } else {
            return new PostAdapter(settings);
        }
    }
});

module.exports = PostAdapterFactory;
