var inherit = require('inherit');
var Database = require('mongopromise');
var Category = require('./models/category');
var Post = require('./models/post');
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
     * Returns all categories
     *
     * @returns {Promise}
     */
    getCategories: function () {
        return this.db.collection('category').find()
            .then(function (categories) {
                return categories.data.map(function (category) {
                    return new Category(category);
                })
            });
    },

    /**
     * Returns all posts
     *
     * @returns {Promise}
     */
    getPosts: function () {
        return this.db.collection('post').find()
            .then(function (posts) {
                return posts.data.map(function (post) {
                    return new Post(post);
                });
            });
    },

    /**
     *
     * @param {String} url
     * @returns {Promise}
     */
    getCategoryByUrl: function (url) {
        url = utils.lastUrlPart(url);
        return this.db.collection('category').find({url: url})
            .then(function (category) {
                if (!category.data[0]) {
                    throw new Error('Category not found');
                }
                return category.data[0]._id;
            });
    },

    /**
     *
     * @param {Categories} categories
     */
    saveCategories: function (categories) {
        categories.forEach(function (categoryModel) {
            if (categoryModel instanceof Category) {
                var criteria = {url: categoryModel.getUrl()};
                this.db.collection('category').update(criteria, categoryModel.toString(), {upsert: true});
            } else {
                throw new Error('data isnt instance of Categories');
            }
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
    savePost: function (post) {
        if (!post || !post instanceof Post) {
            throw new Error('Not Post model');
        }

        if (!post.getTitle() || !post.getUrl() || !post.getText()) {
            console.error(post);
            throw new Error('not enough data');
        }

        var postData = {
            dateCreated: new Date().getTime(),
            title: post.getTitle(),
            url: post.getUrl(),
            slug: post.getSlug(),
            textPreview: post.getTextPreview(),
            text: post.getText(),
            categoryId: post.getCategoryId(),
            userId: post.getUser(),
            image: '',
            source: post.getSource(),
            status: post.getStatus(),
            hasVideo: post.hasVideo,
            ingridients: post.getIngridients()
        };
        return this.db.collection('post').insert(postData);
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
