module.exports = {
    databases: {
        rest: {
            urls: {
                rss: [],
                html: {
                    'http://eda.ru': {
                        categories: {
                            url: '/recipes',
                            querySelector: '.b-tag-menu-items a[id^="link-recipecatalog"]'
                        },
                        postsLinks: {
                            querySelector: '.b-recipe-widget__name a[id^="link-recipewidget"]'
                        }
                    }
                }
            }
        }
    }
};
