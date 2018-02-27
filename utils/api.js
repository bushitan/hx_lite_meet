/* api.js  公共类
    小程序的api接口集合 
 */
var KEY = require('key.js');
// var host_url = 'http://192.168.199.203:8000/huaxun_2/api/';
// var host_url = 'http://127.0.0.1:8000/huaxun_2/api/';
// var host_url = 'http://127.0.0.1:8000/huaxun/api/';
// var host_url = 'http://192.168.200.104:8000/huaxun/api/'; 
// var host_url = 'https://xcx.308308.com/huaxun_2/api/';
// var meet_url = 'https://xcx.308308.com/huaxun_2/meet/';
var host_url = 'http://127.0.0.1:8000/huaxun_2/api/';
var meet_url = 'http://127.0.0.1:8000/huaxun_2/meet/';

function Request(options) {
    // var _session = wx.getStorageSync(KEY.SESSION)
    // if (_session == "")
    //     WXLogin(options)
    // if (!_session) //检查session,不存在，为false
    //     _session = "false"
    // else
        _Request(options)
}

function _Request(options){
    var data = options.data
    if (data == undefined)
        data = {}
    //session 不存在，设置为false
    var _session = wx.getStorageSync(KEY.SESSION)
    if (!_session) //检查session,不存在，为false
        _session = "false"
    data['meet_session'] = _session  //每个请求都加session
    wx.request
        ({
            url: options.url,
            method: "GET",
            data: data,
            success: function (res) {
                if ( res.data.static == false){   //用户未登陆，重新登录
                    WXLogin(options)
                    return
                }
                if (options.success != undefined)
                    options.success(res)
            },
            fail: function (res) {
                if (options.fail != undefined)
                    options.fail(res)
                setTimeout(function () { _Request(options) },5000)
                //todo 重新连接，每隔5秒
            },
            complete: function (res) {
                if (options.complete != undefined)
                    options.complete(res)
            },
        })
}

function WXLogin(options){
    wx.login
    ({
        success: function (res) {
            var _session = wx.getStorageSync(KEY.SESSION)
            _Request({
                'url': meet_url + 'login/',
                'data': {
                    js_code: js_code,
                    meet_session: session,
                },
                'success': function (res) {
                    var object = res.data
                    wx.setStorageSync(KEY.SESSION, res.data.dict_user.session)
                    _Request(options)
                },
            })
        }
    });
}

//下拉滚动查询
function RequestScroll(start = 0, range = 10) {
    // this.GP = _GP
    this.start = start //文章初始位置
    this.range = range //文章加载范围
    var that = this
    this.ReStart = function(){
        this.start = 0
    },
    this.Filter = function (url, data, hack) {
        if (data == undefined) data = {}  //如果数据为空，则创建对象
        data['start_index'] = this.start
        data['end_index'] = this.start + this.range
        var that = this
        _Request({
            'url': url,
            'data': data,
            'success': function (res) {
                // this.start = this.start + this.range //文章索引增加
                that._success() 
                if (res.data.article_list.length < that.range)
                    hack.success(res, false) //没有文章
                else
                    hack.success(res, true) //还有文章
            },
            // 'fail': function (res) {
            //     if (hack.fail != undefined)
            //         hack.fail(res)
            // },
            // 'complete': function (res) {
            //     if (hack.complete != undefined)
            //         hack.complete(res)
            // },
        })
    }
    this._success = function () {
        this.start = this.start + this.range //文章索引增加
    }
}





// function myLogin(js_code, session, options){
//     _Request({
//         'url': meet_url + 'login/',
//         'data': {
//             js_code: js_code,
//             meet_session: session,
//         },
//         'success': function (res) {
//             var object = res.data
//             wx.setStorageSync(KEY.SESSION, res.data.dict_user.session)
//             _Request(options)
//         },
//         // 'fail': function (res) {
//         //     wx.showModal({
//         //         title: '网络连接失败，是否重新登陆？',
//         //         content: '请确认网络是否正常',
//         //         confirmText: "重新登陆",
//         //         success: function (res) {
//         //             if (res.confirm) {
//         //                 WXLogin(options)
//         //             }
//         //         }
//         //     })
//         // },
//     })
// }



module.exports = {
    Request: Request,
    RequestScroll: RequestScroll,
    MEET_INDEX: meet_url + 'index/',
    MEET_AGENDA: meet_url + 'agenda/get_list/meet_id/',
    MEET_GUEST: meet_url + 'guest/get_list/meet_id/',
    MEET_NEWS: meet_url + 'news/get_list/meet_id/',
    MEET_SPOT: meet_url + 'spot/get_list/meet_id/',

    MEET_LOGIN: meet_url + 'login/',

    MEET_ARTICLE: meet_url + 'article/get/article_id/',







    ARTICLE_INDEX: host_url + 'index/',

    ARTICLE_INDEX: host_url + 'article/index/',
    ARTICLE_INDEX: host_url + 'article/index/',

    // GetArticleSearch: host_url + 'api/',
    // 快讯
    ARTICLE_INDEX: host_url + 'article/index/',
    ARTICLE_GET_LIST_TAG: host_url + 'article/get_list/tag/',
    ARTICLE_GET_ID: host_url + 'article/get/id/',
    ARTICLE_GET_LIST_SEARCH: host_url + 'article/get_list/search/',
    ARTICLE_CHECK_SINGLE: host_url + 'article/check/single/',
    //活动
    ARTICLE_GET_LIST_MEET: host_url + 'article/get_list/meet/',

    // 供求
    MATCH_SET_ISSUE: host_url + 'match/set/issue/',
    MATCH_GET_LIST_TAG: host_url + 'match/get_list/tag/',
    MATCH_GET_LIST_SELF: host_url + 'match/get_list/self/',
    MATCH_DELETE_SELF: host_url + 'match/delete/self/',

    // 我 登陆
    MY_LOGIN: host_url + 'my/login/',
    MY_SET_WX: host_url + 'my/set/wx/',
    MY_SET_ROSTER: host_url + 'my/set/roster/',
    MY_GET_SELF: host_url + 'my/get/self/',

    // 支付
    PAY_GET_TAG: host_url + 'pay/get/tag/',
    PAY_CREATE_ORDER: host_url + 'pay/create/order/',
    PAY_CONFIRM_ORDER: host_url + 'pay/confirm/order/',
    PAY_GET_LIST_MEMBER: host_url + 'pay/get_list/member/',
    PAY_GET_LIST_DISCOUNT: host_url + 'pay/get_list/discount/',
    // PAY_CALLBACK_WX: host_url + 'pay/callback/wx/',

    // 花名册
    ROSTER_GET_TAG: host_url + 'roster/get_list/tag/',
    ROSTER_GET_ID: host_url + 'roster/get/id/',
    ROSTER_GET_LIST_SEARCH: host_url + 'roster/get_list/search/',
    ROSTER_GET_SELF: host_url + 'roster/get/self/',
    ROSTER_SET_SELF: host_url + 'roster/set/self/',
    
}
