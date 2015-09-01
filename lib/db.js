var inherit = require('inherit');
var Database = require('mongopromise');
var utils = require('./utils');

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
        if (!categories) {
            throw new Error('No categories');
        }

        if (!Array.isArray(categories)) {
            throw new Error('Categories is not array');
        }

        categories = categories.forEach(function (category) {
            category.status = ['active'];
            var criteria = {url: category.url};
            this.db.collection('category').update(criteria, category, {upsert: true});
        }.bind(this));

        return true;
    },

    savePosts: function (posts) {
        if (!posts) {
            throw new Error('pass posts param');
        }

        if (!Array.isArray(posts)) {
            throw new Error('posts should be array');
        }

        posts.forEach(function (post) {
            this._defineCategory(post)
                .then(function (category) {
                    post.mongoData.categoryId = category._id;
                    return post;
                })
                .then(function (post) {
                    return this._savePost(post.mongoData);
                }, this)
                .done()
        }.bind(this));
        return true;
    },

    /**
     * @example
     * fields
     *   dateCreated,
         title,
         url,
         slug,
         textPreview,
         text,
         categoryId,
         userId,
         image,
         source,
         status,
         hasVideo,
         ingridients
     * @param {Object} post
     * @returns {Promise}
     */
    _savePost: function (post) {
console.log("post = ", post);
        if (!post.title || !post.url || !post.text) {
            throw new Error('not enough data');
        }
        var STATUS_INACTIVE = 'inactive';
        return this.db.collection('post').insert({
            dateCreated: new Date().getTime(),
            title: post.title,
            url: post.url,
            slug: post.text,
            textPreview: post.text.slice(0, 255),
            text: post.text,
            categoryId: post.categoryId,
            userId: '',
            image: '',
            source: post.source,
            status: STATUS_INACTIVE,
            hasVideo: Boolean(post.text.indexOf('<object>') !== -1),
            ingridients: this._getIngridients(post.ingridients)
        });
    },

    /**
     * Defines category for post
     *
     * @param {Object} post
     * @returns {String}
     */
    _defineCategory: function (post) {
        return this.getCategories()
            .then(function (categories) {
                return categories.data.filter(function (category) {
                    return post.categoryUrl.indexOf(category.url) !== -1;
                })[0];
            })
            .fail(function (error) {
                throw new Error(error);
            });
    },

    /**
     * Converts ingridients object to string
     *
     * @param {Object} ingridients
     */
    _getIngridients: function (ingridients) {
        return ingridients.toString();
    }
}, {
    _instance: [],

    /**
     * Синглтон базы
     *
     * @param {String} name
     * @returns {Db}
     */
    getInstance: function (name) {
        if (!this._instance[name]) {
            this._instance[name] = new Db(name);
        }

        return this._instance[name];
    }
});

module.exports = Db;
