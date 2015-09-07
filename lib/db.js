var inherit = require('inherit');
var Database = require('mongopromise');
var utils = require('./utils');
var Category = require('./models/category');
var Post = require('./models/post');

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
        return this.db.collection('category').find()
            .then(function (categories) {
                return categories.data.map(function (category) {
                    return new Category(category);
                })
            });
    },

    /**
     *
     * @param _id
     * @returns {Promise}
     */
    getCategory: function (_id) {

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

    savePosts: function (posts) {
        if (!posts) {
            throw new Error('pass posts param');
        }

        if (!Array.isArray(posts)) {
            throw new Error('posts should be array');
        }

        posts.forEach(this._savePost.bind(this));
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
        if (!post instanceof Post) {
            throw new Error('Not Post model');
        }

        if (!post.getTitle() || !post.getUrl() || !post.getText()) {
            console.error(post);
            throw new Error('not enough data');
        }

        var pst = {
            dateCreated: new Date().getTime() / 1000,
            title: post.getTitle(),
            url: post.getUrl(),
            slug: post.getSlug(),
            textPreview: post.getTextPreview(),
            text: post.getText(),
            categoryId: post.categoryId,
            userId: '',
            image: '',
            source: post.getSource(),
            status: post.getStatus(),
            hasVideo: post.hasVideo,
            ingridients: post.getIngridients()
        };
        return this.db.collection('post').insert(pst);
    }

    /**
     * Defines category for post
     *
     * @param {Object} post
     * @returns {String}
     */
    //_defineCategory: function (post) {
    //    return this.getCategories()
    //        .then(function (categories) {
    //            // TODO использовать модель
    //            return categories.data.filter(function (category) {
    //                return post.categoryUrl.indexOf(category.url) !== -1;
    //            })[0];
    //        })
    //        .fail(function (error) {
    //            throw new Error(error);
    //        });
    //}
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
