var Grabber = require('./grabber');
var cheerio = require('cheerio');
var config = require('./../config');

function App () {
    var url = "http://www.wunderground.com/cgi-bin/findweather/getForecast?&query=" + 02888;
    var grabber = new Grabber(url);
    grabber.grab()
        .then(function (body) {
            var $ = cheerio.load(body);
            var temperature = $("[data-variable='temperature'] .wx-value").html();
        })
        .fail(function (error) {
            console.error(error);
        })
        .done(function () {
            console.log('Done');
        });
}



module.exports = new App();