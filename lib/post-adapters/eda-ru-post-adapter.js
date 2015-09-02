var inherit = require('inherit');
var PostAdapter = require('./post-adapter');

var EdaRu = inherit(PostAdapter, {

    _getVideo: function ($) {
        return $(this._settings.post.video).parent().html();
    }
});

module.exports = EdaRu;
