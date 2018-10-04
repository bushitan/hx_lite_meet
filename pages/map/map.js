
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
    toPhone(){
        wx.makePhoneCall({
            phoneNumber: GP.data.mapDict.phone //仅为示例，并非真实的电话号码
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
        GP.onInit(options)
    },

    /**
     * 选择新行业后返回，更新默认目录
     */
    onShow() {
        if (GP.data.meetID != wx.getStorageSync(API.KEY_MEET_ID)) {
            GP.onInit()
        }
    },

    //必须要登陆以后发起的请求，在这里完成
    onInit: function () {
        GP.setData({
            meetID: wx.getStorageSync(API.KEY_MEET_ID)
        })
        API.Request({
            'url': API.MEET_MAIN_GET_BY_ID,
            'data': { "meet_id": GP.data.meetID },
            'success': function (res) {

                var markers = []
                markers.push({
                    // iconPath: "/resources/others.png",
                    id: 0,
                    latitude: res.data.meet_dict.latitude,
                    longitude: res.data.meet_dict.longitude,
                    width: 50,
                    height: 50
                })
                GP.setData({
                    // tagIndex: 0,
                    // tagList: res.data.tag_list,
                    // coverMatrix: res.data.cover_matrix,
                    mapDict: res.data.meet_dict,
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
