
var Query = require('../query/cover.js');
function ActionCover(_GP,start=0,range=10) {
    this.GP = _GP
    this.GP.setData({
        articleList: [],
        isMore: true,
        isScrollLock: false, //查询锁，防止结果未返回，又继续查
    })
    var query_cover = new Query.QueryCover(start,range)
    this.GetArticleList = function(url,data){
        if (this.GP.isMore == false )
            return 
        this.GP.setData({
            isScrollLock: true, //加锁
        })
        query_cover.Filter(url, data, this)  //将this传入，有下边来选择执行函数
    }
    this.Success = function (res,is_more) {
        var article_list = this.GP.data.articleList
        article_list = article_list.concat(res.data.article_list) //新增文章拼接
        this.GP.setData({
            articleList: article_list, //初始化文章，
            isScrollLock: false, //解锁
            isMore: is_more,
        })       
    }

}

module.exports = {
    ActionCover: ActionCover,
}