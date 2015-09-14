var inherit = require('inherit');
var Parser = require('./parser');
var Categories = require('./categories');
var config = require('./../config');
var Db = require('./db');

var App = inherit({
    parsePosts: function () {
        var db = Db.getInstance(config.dbName);
        Object.keys(config.urls.html).forEach(function (settingsKey) {
            var configForSite = config.urls.html[settingsKey];
            var parser = new Parser(configForSite);

            return db.getPosts()
                .then(parser.parse, parser)
                .then(db.savePost, db)
                .fail(function (error) {
                    throw new Error(error);
                })
                .done(function () {
                    console.info('Done');
                    //process.exit(1);
                });
        });

        return true;
    },

    parseCategories: function () {
        var categories = new Categories();
        var db = Db.getInstance(config.dbName);

        Object.keys(config.urls.html).forEach(function (settingsKey) {
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
    }
});

var app = new App();
app.parsePosts();
//app.parseCategories();
module.exports = app;
