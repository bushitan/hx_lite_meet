

// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var APP = getApp()
var GP;

  
Page({
    data:{
        userInfo:{},
        //华讯数据
        name: "",
        user_id:"",
        logo:"",
        icon_news_self: "../../images/news_self.png",
        icon_roster: "../../images/my_roster.png",
        icon_vip: "../../images/my_vip.png",
        icon_meet: "../../images/my_meet.png",
        icon_discount: "../../images/my_discount.png",
        icon_search: "../../images/my_search.png",
        
       
        icon1: '../../images/mine_fill.png',
        icon2: '../../images/order_fill.png',
        icon3: '../../images/coupons_fill.png',
        icon4: '../../images/label_fill.png',
        icon5: '../../images/search_blue.png',
        // icon4: '../../images/label_fill.png',
        isPay:false, //默认未支付
    },

   
    clickLogo:function(){
        GP.SetUserInfo()
        
    },

    SetUserInfo:() =>{
        wx.getUserInfo({
            success: function (res) {
                var userInfo = res.userInfo
                var nickName = userInfo.nickName
                // var avatarUrl = userInfo.avatarUrl
                // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                // var province = userInfo.province
                // var city = userInfo.city
                // var country = userInfo.country
                console.log(userInfo)
                GP.setData({
                    userInfo: {
                        logo: userInfo.avatarUrl,
                        nick_name: userInfo.nickName,
                    }
                })

                GP.setLogo(userInfo.avatarUrl, userInfo.nickName)   
                wx.showModal({
                    titles: '更新头像成功',
                    // content: '我们无法知晓你的头像',
                })            
            },
            fail(){
                wx.openSetting({
                    success: (res) => {
                        console.log("授权结果..")
                        console.log(res)
                        if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                                wx.showModal({
                                    title: '您未授权',
                                    content: '我们无法知晓你的头像',
                                })
                            // GP.SetUserInfo()
                        }
                    }
                })
            }
        })
    },

    setLogo(logo_url , nick_name) {
        API.Request({
            url: API.MEET_SIGN_SET_LOGO,
            data: { 
                logo: logo_url, 
                nick_name: nick_name
            },
            success: function (res) {
                console.log(res)
            }
        })
    },


    //根据id获取节目信息
    onLoad:function(option){
        // 页面初始化 options为页面跳转所带来的参数
        GP = this
        
        var user_info = wx.getStorageSync(KEY.USER_INFO)

        if (user_info == "") {
            user_info = {}
            wx.setStorageSync(KEY.USER_INFO, user_info)
        } 
        GP.setData({
            userInfo: user_info
        })

        GP.onInit()
    },

  
    //必须要登陆以后发起的请求，在这里完成
    onInit:function(option){
            API.Request({
                url: API.MEET_SIGN_GET_INFO,
                success:function(res){
                    console.log(res)
                    GP.setData({
                        userInfo: res.data.dict_attendee
                    })
                    wx.setStorageSync(KEY.USER_INFO, res.data.dict_attendee)
                }
            })


    },


    onShow(){
        if (APP.globalData.isLogin == true) {  //已经登录
            wx.setNavigationBarTitle({  // 设置当前页面
                title: APP.globalData.title
            })
        }
        //检测是否已经支付
        API.Request({
            url: API.MEET_SIGN_PAY_CHECK,
            success: function (res) {
                console.log(res)
                GP.setData({
                    isPay: res.data.is_pay
                })
            }
        })
    },




    onShareAppMessage: function () {
        return APP.share
    },

    // 到交钱报名
    toSign() {
        var url = '../pay/pay'
        wx.navigateTo({
            url: url
        })
    },

    // 到入场券
    toMyInfo() {
        var url = '../my_info/my_info'
        wx.navigateTo({
            url: url
        })
    },
    // 到入场券
    toMyTicket() {
        var url = '../my_ticket/my_ticket'
        wx.navigateTo({
            url: url
        })
    },   


    toScanCode(){
        wx.scanCode({
            success:function(res){
                console.log(res)
                console.log(res.result)
                wx.showModal({
                    title: '扫码成功',
                    content: '',
                })
            },

            fail: (res) => {
                console.log(res)
            }
        })
    },
})