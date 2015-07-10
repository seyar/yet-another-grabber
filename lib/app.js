var inherit = require('inherit');
var HtmlParser = require('./html-parser');
var config = require('./../config').databases;
var Db = require('./db');

var App = inherit({
    __constructor: function () {


        // var url = "http://www.wunderground.com/cgi-bin/findweather/getForecast?&query=" + 02888;
        // var grabber = new Grabber(url);
        // grabber.grab()
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
    },

    parsePosts: function () {
        Object.keys(config).forEach(function (dbName) {
            var db = new Db(dbName);

            var configRow = config[dbName];

            Object.keys(configRow.urls.html).forEach(function (settingsKey) {
                var configForSite = configRow.urls.html[settingsKey];
                var parser = new HtmlParser(configForSite);

                return parser.parse()
                    .fail(function (error) {
                        throw new Error(error);
                    })
                    .done();
            });
        });
    },

    parseCategories: function () {
        Object.keys(config).forEach(function (dbName) {
            var db = new Db(dbName);

            var configRow = config[dbName];

            Object.keys(configRow.urls.html).forEach(function (settingsKey) {
                var configForSite = configRow.urls.html[settingsKey];
                var parser = new HtmlParser(configForSite);

                return parser.parseCategories()
                    .then(function (categories) {
                        db.saveCategories(categories);
                    })
                    .fail(function (error) {
                        throw new Error(error);
                    })
                    .done();
            });
        });
    }
});

var app = new App();
app.parseCategories();
module.exports = app;
