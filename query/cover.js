
var API = require('../utils/api.js');


function QueryCover(start,range) {
    // this.GP = _GP
    this.start = start //文章初始位置
    this.range = range //文章加载范围
    var that = this
    this.Filter = function (url, data,hack){
        if (data == undefined) data = {}  //如果数据为空，则创建对象
        data['start_index'] = this.start
        data['end_index'] = this.start + this.range
        var that = this
        API.Request({
            'url': url,
            'data': data,
            'success': function (res) {
                that._success()
                if (res.data.article_list.length < this.range)
                    hack.Success(res,false) //没有文章
                else
                    hack.Success(res,true) //还有文章
            },
            'fail': function (res) {
                if (hack.Fail != undefined)
                    hack.Fail (res)
            },
            'complete': function (res) {
                if (hack.Complete != undefined)
                    hack.Complete (res)
            },
        })
    }
    this._success = function(){
        this.start = this.start + this.range //文章索引增加
    }
}

module.exports = {
    QueryCover: QueryCover,
}