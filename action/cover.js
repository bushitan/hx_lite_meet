var API = require('../utils/api.js');
function ActionCover(_GP,start=0,range=10) {
    this.GP = _GP
    this.GP.setData({
        articleList: [],
        isMore: true,
        isScrollLock: false, //查询锁，防止结果未返回，又继续查
    })
    var _request_scroll = new API.RequestScroll(start,range)
    this.GetArticleList = function(url,data){
        if (this.GP.data.isMore == false )
            return 
        this.GP.setData({
            isScrollLock: true, //加锁
        })
        _request_scroll.Filter(url, data, this)  //将this传入，有下边来选择执行函数
    }
    this.success = function (res,is_more) {
        var article_list = this.GP.data.articleList
        article_list = article_list.concat(res.data.article_list) //新增文章拼接
        console.log(is_more)
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