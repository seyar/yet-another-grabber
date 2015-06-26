var inherit = require('inherit');
var grabber = require('./grabber');
var htmlParser = require('./html-parser');
var config = require('./../config').databases;
var Db = require('./db');

var App = inherit({
    __constructor: function () {
        Object.keys(config).forEach(function (dbName) {
            var db = new Db(dbName);

            var configRow = config[dbName];

            Object.keys(configRow.urls.html).forEach(function (url) {

                var configForSite = configRow.urls.html[url];
                var pageHtmlPromise = grabber.grab(url);
                var parser = new htmlParser(pageHtmlPromise, configForSite);
                parser.parseCategories()
                    .then(function (cats) {
                        parser.setCategories(cats);
                    })
                    .then(function () {
                        var pageHtmlPromise = grabber.grab(parser._categories[0]);
                        parser.setPage(pageHtmlPromise);
                        return parser.getPostsLinks();
                    })
                    .then(function (postLinks) {
                        return parser.getPost(postLinks[0]);
                    })
                    .fail(function (error) {
                        throw new Error(error);
                    }).done();
            });
        });

        //var url = "http://www.wunderground.com/cgi-bin/findweather/getForecast?&query=" + 02888;
        //var grabber = new Grabber(url);
        //grabber.grab()
        //    .then(function (body) {
        //        var $ = cheerio.load(body);
        //        var temperature = $("[data-variable='temperature'] .wx-value").html();
        //    })
        //    .fail(function (error) {
        //        console.error(error);
        //    })
        //    .done(function () {
        //        console.log('Done');
        //    });
    }
});

module.exports = new App();
