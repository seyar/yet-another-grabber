var inherit = require('inherit');
var Parser = require('./parser');
var Categories = require('./categories');
var config = require('./../config').databases;
var Db = require('./db');

var App = inherit({
    parsePosts: function () {
        Object.keys(config).forEach(function (dbName) {
            var db = Db.getInstance(dbName);

            var configRow = config[dbName];

            Object.keys(configRow.urls.html).forEach(function (settingsKey) {
                var configForSite = configRow.urls.html[settingsKey];
                var parser = new Parser(configForSite, db);

                return parser.parse()
                    .then(function (posts) {
                        db.savePosts(posts)
                    })
                    .fail(function (error) {
                        throw new Error(error);
                    })
                    .done(function () {
                        console.info('Done');
                        //process.exit(1);
                    });
            });
        });
        return true;
    },

    parseCategories: function () {
        var categories = new Categories();
        Object.keys(config).forEach(function (dbName) {
            var db = Db.getInstance(dbName);

            var configRow = config[dbName];

            Object.keys(configRow.urls.html).forEach(function (settingsKey) {
                var configForSite = configRow.urls.html[settingsKey];

                categories.setQuerySelector(configForSite.categories.querySelector);

                return categories.parseCategories(configForSite.baseUrl + configForSite.categories.url)
                    .then(function (categories) {
                        db.saveCategories(categories);
                    })
                    .fail(function (error) {
                        throw new Error(error);
                    })
                    .done(function () {
                        console.info('Stop');
                    });
            });
        });
    }
});

var app = new App();
app.parsePosts();
module.exports = app;
