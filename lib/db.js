var inherit = require('inherit');
var Database = require('mongopromise');

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

        },

        /**
         *
         * @returns {Promise}
         */
        insertPost: function () {

        }

    });

module.exports = Db;