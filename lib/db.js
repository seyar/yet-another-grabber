var inherit = require('inherit');
var Database = require('mongopromise');

var Db = inherit({
        /**
         * Mongo database adapter
         *
         * @constructor
         */
        __constructor: function (name) {
            'use strict';

            this.db = new Database(name);
        },

        /**
         * Retrieve all categories
         *
         * @returns {Promise}
         */
        getCategories: function () {
            'use strict';

            return this.db.collection('category').find();
        },

        /**
         *
         * @param _id
         * @returns {Promise}
         */
        getCategory: function (_id) {
            'use strict';
            console.log('_id = ', _id);
        },

        /**
         *
         * @returns {Promise}
         */
        insertPost: function () {
            'use strict';
        }

    });

module.exports = Db;