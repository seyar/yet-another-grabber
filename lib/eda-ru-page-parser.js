var inherit = require('inherit');
var PageParser = require('./page-parser');

var EdaRu = inherit(PageParser, {

    _getVideo: function (jQ) {
        return jQ(this._settings.post.video).parent().html();
    }
});

module.exports = EdaRu;
