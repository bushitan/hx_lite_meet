

var API = require('../utils/api.js');
var GP

// 更新封面
function Cover(_GP){
    this.GP = _GP  
    this.Init = function () {
        this.GP.setData({
            articleList: [],
            startIndex: 0,
            rangeIndex:10,
            isMore: true,
            isScrollLock: false, //查询锁，防止结果未返回，又继续查
        })
    }
    this.Init()
   
    //1 下拉锁，防止未更新、重复下拉
    this.CheckScrollLock = function (GP) {
        var GP = this.GP
        if (GP.data.isMore == false) //没有更多文章，返回
            return false
        if (GP.data.isScrollLock == true) //下拉查询锁已关闭，返回
            return false
        GP.setData({
            isScrollLock: true  //关闭查询锁
        })
        return true
    }

    //2 下拉底部，刷新加载
    this.AddList = function (url, data, callback ) {
        data['start_index'] = this.GP.data.startIndex
        data['end_index'] = this.GP.data.startIndex + this.GP.data.rangeIndex
        var tempThis = this
        API.Request({
            'url': url,
            'data': data,
            'success': function (res) {
                if (callback != undefined)
                    callback(res)
                tempThis._BaseSuccess(res)
            },
        })
    }
    this._BaseSuccess = function(res) {
        var object = res.data
        var GP = this.GP
        //没有文章了，下拉刷新结束
        if (object.article_list.length < GP.data.rangeIndex) { //没有文章了，下拉刷新结束
            GP.setData({
                isMore: false,
            })
        }
        //新文章追加到旧的尾部
        var article_list = GP.data.articleList
        article_list = article_list.concat(object.article_list) //新增文章拼接
        GP.setData({
            articleList: article_list, //初始化文章，
            startIndex: GP.data.startIndex + GP.data.rangeIndex, //更新范围
            isScrollLock: false  //解锁
        })
    }

 

}

module.exports = {
    Cover: Cover,
}