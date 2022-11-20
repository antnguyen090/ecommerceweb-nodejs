var express = require('express');
var router = express.Router();
const layout	     = __path_views_frontend + 'frontend';
const { json } = require('express');

const mainName = "blog"
let   pageTitle= 'Tin Tức Cây Cảnh'
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');
const ParamsHelpers = require(__path_helpers + 'params');


/* GET home page. */
router.get('/(:slug)?', async function(req, res, next) {
    let categorySlug
    try {
    let listBlogCategory = await res.locals.listBlogCategory
    let totalArticle =  listBlogCategory.map((item)=>{
        return item.articleList.length
        })
    .reduce(
         (previousValue, currentValue) => previousValue + currentValue,
        );
    let pagination = {
        totalItems: 1,
        totalItemsPerPage: 4,
        currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
        pageRanges: 3
    };
    if(req.params.slug){
        let category = await FrontEndHelpers.checkCategoryBlogExits({status: 'active', slug: req.params.slug})
        if(category){
            let dataArticle = await FrontEndHelpers.getArticleByBlogCategory(
                                                    req.params.slug,
                                                    pagination.currentPage,
                                                    pagination.totalItemsPerPage,
                                                )
            let listArticle = dataArticle.arrArticle
            pagination.totalItems     = dataArticle.totalItem
            res.render(`${folderView}blogcategory`, {
                pageTitle: dataArticle.name,
                layout,
                listArticle,
                pagination,
                slug: req.params.slug,
                totalArticle
            });   
            return
        } else{
            let checkArticle =  await FrontEndHelpers.checkArticleExits({status: 'active', slug: req.params.slug})
            if(checkArticle){
                let article = await FrontEndHelpers.getOneArticle({status: 'active',slug: req.params.slug})
                let categoryObj = await listBlogCategory.find(item => item.id == article.category);
                let articleRelated = await FrontEndHelpers.getArticleRelated(categoryObj.slug)
                res.render(`${folderView}blogdetail`, {
                    pageTitle: article.name,
                    layout,
                    article,
                    categoryObj,
                    articleRelated,
                    slug: categoryObj.slug,
                    totalArticle
                });
                return   
            } else{
                next()
            }
        }
    } else{
        let listArticle = await FrontEndHelpers.getAllArticle({status: 'active'}, pagination.currentPage,pagination.totalItemsPerPage)
        pagination.totalItems     = totalArticle
        res.render(`${folderView}blogcategory`,{
            pageTitle: 'Tất Cả Bài Viết',
            pagination,
            layout,
            listArticle,
            slug: req.params.slug,
            totalArticle
        })
    }
    } catch (error) {
        console.log(error)
    }
    
});

module.exports = router;


