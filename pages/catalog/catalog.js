var API = require('../../utils/api.js');
var PRO_PAGE = require('../../pro/pro_page.js');

var ActionCover = require('../../action/cover.js');
var action_cover
var APP = getApp()
var GP;
Page({
    data: {
        list: [],
        isMore:true
    },

    //页面onload
    onLoad: function (options) {
        GP = this

        if ( wx.getStorageSync(API.KEY_MEET_ID ) != "" )
            wx.switchTab({
                url: '/pages/agenda/agenda',
            })
        else
            GP.onInit()
        
    },

    //页面show
    onShow() {
        if (APP.globalData.isLogin == true) {  //已经登录
        }
    },

    onInit: function (options) {
        

        API.Request({
            url: API.MEET_CATALOG,
            success: function (res) {
                console.log(res)
                GP.setData({
                    list: res.data.catalog_list,
                    isMore:false,
                })
            }
        })
    },

    //点击节点
    toAgenda(e) {
        // var url = '../article_text/article_text?art_id=220'
        // console.log()
        wx.setStorageSync(API.KEY_MEET_ID, e.currentTarget.dataset.meet_id)
        wx.switchTab({
            url: '/pages/agenda/agenda',
        })
    },



    onShareAppMessage: function () {
        return APP.share
    },
})
