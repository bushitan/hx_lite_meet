var API = require('../../utils/api.js');
var PRO_PAGE = require('../../pro/pro_page.js');

var ActionCover = require('../../action/cover.js');
var action_cover
var APP = getApp()
var GP;
Page({
    data: {
        isMore:true,
    },

    //页面onload
    onLoad: function (options) {
        GP = this
        GP.onInit()
    },

    //页面show
    onShow() {
        if (GP.data.meetID != wx.getStorageSync(API.KEY_MEET_ID)) {
            GP.onInit()
        }
    },

    onInit: function (options) {
        GP.setData({
            meetID: wx.getStorageSync(API.KEY_MEET_ID)
        })
        API.Request({
            'url': API.MEET_GUEST,
            'data': { "meet_id": GP.data.meetID },
            'success': function (res) {
                GP.setData({
                    articleList: res.data.article_list,
                    isMore:false,
                })
            },
        })    
    },

    //点击节点
    clickNode() {
        // var url = '../article_text/article_text?art_id=220'
        // wx.navigateTo({
        //     url: url
        // })
    },


    onShareAppMessage: function () {
        return APP.share
    },
})
