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
            //{
            //    adapter: 'findfoodru',
            //    baseUrl: 'http://findfood.ru',
            //    amountCategories: 1,
            //    //amountPostsForEachCategory: 1,
            //    categories: {
            //        url: '/',
            //        querySelector: '.grid_3 ul a'
            //    },
            //    postsLinks: {
            //        querySelector: '#yw0 .items a:nth-child(1)'
            //    },
            //    post: {
            //        title: 'h1',
            //        text: 'div[itemprop=recipeInstructions]',
            //        ingridients: [
            //            '.ingredient a[id^="link-recipe-ingredient"]',
            //            '.ingredient .ingredient-measure-amount span'
            //        ]
            //    }
            //}
        ]
    },
    dbName: 'rest'
};
