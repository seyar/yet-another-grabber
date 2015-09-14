/**
 * @name image-loader
 */
var vow = require('vow');
var path = require('path');
var http = require('http');
var fs = require('fs');
var inherit = require('inherit');
var cheerio = require('cheerio');
var crypto = require('crypto');

var DESTINATION_FOLDER = 'uploads/';
var FILENAME_LENGTH = 6;
var SHA1_KEY = 'abcdegsfsd';

var Loader = inherit({}, {

    /**
     *
     * @param {Post} post
     */
    load: function (post) {
        var text = post.getText();
        var $ = cheerio.load(text, {decodeEntities: false});
        var $imageTags = $('img');
        var links = this._getLinks($imageTags);

        return this._downloadFiles(links)
            .fail(function (err) {
                throw new Error(err);
            });
    },

    /**
     * Replaces img sources
     * @param {String} post text
     * @param {Object[]} imageLinks
     * @param {String} imageLinks.source
     * @param {String} imageLinks.fileName
     * @param {String} imageLinks.fullPath
     * @returns {String}
     */
    replaceImageUrls: function (post, imageLinks) {
        imageLinks.forEach(function (imageLink) {
            post = post.replace(imageLink.source, imageLink.fullPath);
        });
        return post;
    },

    /**
     *
     * @param {Cheerio} $imageLinks
     * @returns {Array}
     */
    _getLinks: function ($imageTags) {
        var result = [];
        $imageTags.each(function (index, element) {
            var src = cheerio(element).attr('src');
            result.push(src);
        });

        return result;
    },

    /**
     *
     * @param {String[]} links
     * @returns {Promise}
     */
    _downloadFiles: function (links) {
        if (!links) {
            throw new Error('No links param');
        }

        if (!Array.isArray(links) || !links.length) {
            return vow.resolve([]);
        }

        var randString = this._getRandomString(links[0].substr(5));

        var promises = links.map(function (link) {
            return this._download(link, randString);
        }.bind(this));

        return vow.all(promises)
    },

    /**
     * Downloads one file
     *
     * @param {String} source url
     * @param {String} destinationFolder
     */
    _download: function (source, destinationFolder) {
        var defer = vow.defer();
        var fileName = this._getRandomString(source);
        var ext = path.extname(source);
        var fullPath = DESTINATION_FOLDER + destinationFolder + '/' + fileName + ext;
        fs.mkdir(path.dirname(fullPath), function () {

            var destination = fs.createWriteStream(fullPath);
            http.get(source, function (response) {
                response.pipe(destination);
                destination
                    .on('finish', function () {
                        destination.close(function () {
                            defer.resolve({
                                source: source,
                                fileName: fileName,
                                fullPath: '/' + fullPath
                            });
                        });
                    })
                    .on('error', function (err) {
                        fs.unlink(destination);
                        defer.reject(err);
                    });
            });
        });

        return defer.promise();
    },

    /**
     *
     * @param {String} text
     * @returns {String}
     */
    _getRandomString: function (text) {
        return crypto.createHmac('sha1', SHA1_KEY).update(text).digest('hex')
            .substr(0, FILENAME_LENGTH);
    }
});

module.exports = Loader;