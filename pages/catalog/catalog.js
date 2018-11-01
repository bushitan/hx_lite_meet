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
        var meet_id
        if (options.hasOwnProperty('meet_id') ) 
            meet_id = options.meet_id
        else
            // meet_id = wx.getStorageSync(API.KEY_MEET_ID) || -1
            meet_id = -1
        API.Request({
            'url': API.MEET_MAIN_CHECK_ALIVE_BY_ID,
            'data': { "meet_id": meet_id},
            'success': function (res) {
                if (res.data.is_alive == true) {
                    wx.setStorageSync(API.KEY_MEET_ID, meet_id) 
                    wx.switchTab({
                        url: '/pages/agenda/agenda',
                    })
                }else{
                    wx.setStorageSync(API.KEY_MEET_ID,"") 
                    GP.onInit()
                }
            },
            "fail":function(){
                GP.onInit()
            }
        })
            // MEET_MAIN_CHECK_ALIVE_BY_ID
        // }
            
        // else
        //     GP.onInit()
        
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
        // return APP.share
        return {
            title: "华讯会务",
            imageUrl: "../../images/logo.png",
            path: '/pages/catalog/catalog'
        }
    },
})
