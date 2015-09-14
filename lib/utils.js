var inherit = require('inherit');

var Utils = inherit({}, {

    /**
     * Clean all danger tags
     *
     * @param {String} str
     * @returns {String}
     */
    cleanText: function (str) {
        var str = str
            .replace(/(\t|\r\n|\n|\r)/g, '')
            .replace(/<script[^>]*>[^>]+<\/script>/gi, '')
            .replace(/<style[^>]*>[^>]+<\/style>/gi, '')
            .replace(/<link[^>]+rel="stylesheet"[^>]+>/gi, '')
            .replace(/<\!--[\s\S]*?-->/gi, '')
            .replace(/<\&nbsp;/gi, '')
            .replace(/^\s+|\s+$/gi, '')
            ;

        return str;
    },

    /**
     * Removes all tags
     *
     * @param {String} str
     */
    striptags: function (str) {
        return str
            .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/g, '');
    },

    /**
     * Translitaretes string
     *
     * @param {String} str
     */
    translit: function (str) {
        if (typeof(str) !== 'string') {
            throw new Error('Unexpected type of param');
        }

        var transl = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
            'о': 'o', 'п': 'p', 'р': 'r','с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
            'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh','ъ': '`', 'ы': 'y', 'ь': '`', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };

        return str.split('').map(function (letter) {
            return transl[letter] || letter;
        }).join('');
    },

    /**
     * Returns last part/folder of url
     *
     * @param {String} str
     */
    lastUrlPart: function (str) {
        if (typeof(str) !== 'string') {
            throw new Error('Unexpected type of param');
        }

        return str.substring(str.lastIndexOf('/') + 1);
    }
});

module.exports = Utils;