module.exports = {
    urls: {
        rss: [],
        html: [
            {
                adapter: 'edaru',
                baseUrl: 'http://eda.ru',
                amountCategories: 1,
                //amountPostsForEachCategory: 1,
                categories: {
                    url: '/recipes',
                    querySelector: '.b-tag-menu-items a[id^="link-recipecatalog"]'
                },
                postsLinks: {
                    querySelector: '.b-recipe-widget__name a[id^="link-recipewidget"]'
                },
                post: {
                    title: 'h1',
                    text: '.b-directions .instructions',
                    ingridients: [
                        '.ingredient a[id^="link-recipe-ingredient"]',
                        '.ingredient .ingredient-measure-amount span'
                    ],
                    video: 'object'
                }
            }
        ]
    },
    dbName: 'rest'
};
