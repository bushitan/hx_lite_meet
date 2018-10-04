
var API = require('../../utils/api.js');
var PRO_COVER = require('../../pro/pro_cover.js');
var xx_cover; //封面的公共方法 
var PRO_PAGE = require('../../pro/pro_page.js');
var APP = getApp()
var GP;
Page({
    data: {
        mapDict: {
            // latitude: 23.1066805,
            // longitude: 113.3245904,
            // phoneNumber: "020-89338222",
            // address:"阅江西路22号首层"
        },
        markers:[]
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
    toPhone(){
        wx.makePhoneCall({
            phoneNumber: GP.data.mapDict.phoneNumber //仅为示例，并非真实的电话号码
        })
    },

    toMap() {
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
                // var latitude = res.latitude
                // var longitude = res.longitude
                wx.openLocation({
                    latitude: GP.data.mapDict.latitude,
                    longitude: GP.data.mapDict.longitude,
                    scale: 28
                })
            }
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

                var markers = []
                markers.push({
                    // iconPath: "/resources/others.png",
                    id: 0,
                    latitude: res.data.map_dict.latitude,
                    longitude: res.data.map_dict.longitude,
                    width: 50,
                    height: 50
                })
                GP.setData({
                    // tagIndex: 0,
                    // tagList: res.data.tag_list,
                    // coverMatrix: res.data.cover_matrix,
                    mapDict:res.data.map_dict,
                    markers: markers,
                })
            },
        })
    },


    onShareAppMessage: function () {
        return APP.share
        // return {
        //     title: '快讯',
        //     desc: '简讯、资讯信息',
        //     path: '/pages/index/index?father_tag_id=' + GP.data.fatherTag.tag_id
        // }
    },


})
