var request = require('request');
var vow = require('vow');

function Grabber(url) {
    this._url = url;
}

Grabber.prototype.grab = function () {
    var defer = vow.defer();
    request(this._url, function (error, response, body) {
        if (error) {
            defer.reject(error);
        } else {
            defer.resolve(body);
        }
    });
    return defer.promise();
};

module.exports = Grabber;