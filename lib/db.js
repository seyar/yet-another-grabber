var inherit = require('inherit');
var Database = require('mongopromise');
var Helper = require('./helper');

var Db = inherit({
    /**
     * Mongo database adapter
     *
     * @constructor
     */
    __constructor: function (name) {
        this.db = new Database(name);
    },

    /**
     * Retrieve all categories
     *
     * @returns {Promise}
     */
    getCategories: function () {
        return this.db.collection('category').find();
    },

    /**
     *
     * @param _id
     * @returns {Promise}
     */
    getCategory: function (_id) {
        console.log('_id = ', _id);
    },

    /**
     *
     * @param {Array} categories
     */
    saveCategories: function (categories) {
console.log('db.js::saveCategories()');

        if (!categories) {
            throw new Error('No categories');
        }

        if (!Array.isArray(categories)) {
            throw new Error('Categories is not array');
        }

        categories = categories.forEach(function (category) {
            category.url = Helper.lastUrlPart(category.url);
            category.status = ['active'];
            var criteria = {url: category.url, title: category.title};
            var a = this.db.collection('category').update(criteria, category, { upsert: true});
            //console.log("a = ", a);
        }.bind(this));
    },

    savePosts: function (posts) {
console.log("posts = ", posts);
    },

    /**
     *
     * @returns {Promise}
     */
    _savePost: function () {
    }

});

module.exports = Db;
