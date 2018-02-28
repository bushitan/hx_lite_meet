
var API = require('../../utils/api.js');
var PRO_COVER = require('../../pro/pro_cover.js');
var xx_cover; //封面的公共方法 
var PRO_PAGE = require('../../pro/pro_page.js');
var APP = getApp()
var GP;
Page({
    data: {
    },
    clickInfo() {
        var url = '../map_info/map_info'
        wx.navigateTo({
            url: url
        })
    },
    toXXArticle(e) {
        var index = e.detail  //索引
        var coverMatrix = GP.data.coverMatrix
        var tagIndex = GP.data.tagIndex
        var article_id = coverMatrix[tagIndex][index].article_id
        wx.navigateTo({
            url: '../article/article?article_id=' + article_id,
        })
    },
    clickTag(e) {
        var index = e.detail
        GP.setData({
            tagIndex: index
        })
    },
    /**
     * index初始化
     * 加载默认的标签
     */
    onLoad: function (options) {

        GP = this
        xx_cover = new PRO_COVER.Cover(GP) //初始化 封面下拉列表
        GP.onInit(options)
        //必须要登陆以后再做的事情
        // if (APP.globalData.isLogin == true)
        //     GP.onInit(options)
        // else
        //     APP.login(options)

    },

    /**
     * 选择新行业后返回，更新默认目录
     */
    onShow() {

        if (APP.globalData.isLogin == true) {  //已经登录

        }
    },

    //必须要登陆以后发起的请求，在这里完成
    onInit: function (options) {
        API.Request({
            'url': API.MEET_SPOT,
            'data': { "meet_id": 1 },
            'success': function (res) {
                GP.setData({
                    tagIndex: 0,
                    tagList: res.data.tag_list,
                    coverMatrix: res.data.cover_matrix,
                })
            },
        })
    },


    onShareAppMessage: function () {
        return {
            title: '快讯',
            desc: '简讯、资讯信息',
            path: '/pages/index/index?father_tag_id=' + GP.data.fatherTag.tag_id
        }
    },


})
