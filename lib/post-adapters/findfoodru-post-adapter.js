var inherit = require('inherit');
var PostAdapter = require('./post-adapter');
var $ = require('cheerio');

var EdaRu = inherit(PostAdapter, {

    _getText: function ($) {
        var html = '';
        $(this._settings.post.text).each(function () {
            html += $(this).html();
        });
        return html;
    }
});

module.exports = EdaRu;
