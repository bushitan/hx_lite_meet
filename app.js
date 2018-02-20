//app.js
var API = require('utils/api.js');
var Key = require('utils/storage_key.js');
var g
var GP
App({
    
    //全局变量配置
    STATIC: {
        YES: 1,
        NO:  0,
        ROLE_LEVEL_1 : 1,
        ROLE_LEVEL_2 : 2,
        ROLE_LEVEL_3 : 3,
    },
    KEY: {
        //用户权限
        SESSION:"session", 
        //快讯 
        FATHER_TAG:"father_tag",
        INDEX_ARTICLE_LIST:"index_article_list", //index的当前显示标签，文章内点击下一篇使用
        MATCH_SON_TAG:"match_son_tag",

    },

    globalData: {
        agendaSwiperList: "",
        newsSwiperList: "",
        currenMeet: "",
        isLogin:false,
    }, 

    /**
     *  检测用户是否当前行业的会员
     */
    checkMember(article_role_value){
        var _memberList = GP.globalData.userMemberList
        var _father_tag = wx.getStorageSync(GP.KEY.FATHER_TAG )
        for ( var i=0 ; i<_memberList.length;i++){
            if (_memberList[i].tag_id == _father_tag.tag_id)  //如果行业相同
                if (_memberList[i].role_value > GP.STATIC.ROLE_LEVEL_1 && article_role_value == undefined)    //如果为会员
                    return true
                else if (_memberList[i].role_value >= article_role_value)
                    return true
        }
        return false
    },


    onLaunch: function () {
        var that =this
        GP = this
        var _pixelRatio,_windowWidth,_windowHeight
        
        wx.getSystemInfo({
          success: function(res) {
            //设置屏幕宽/高
            // console.log(res)
            that.globalData.windowWidth = res.windowWidth
            that.globalData.windowHeight = res.windowHeight
            console.log(res.windowWidth,res.windowHeight,res.pixelRatio)
          }
        })

    },

    login:function(options){
        //暂不做登陆验证
        // getCurrentPages()[0].onInit(options)  
        // return 

        //正常登陆验证
        if (GP.globalData.isLogin == true)  //已经登陆，执行初始化
            getCurrentPages()[0].onInit(options)  
        else {  //未登录 重新登录
            console.log("session:", wx.getStorageSync('session'))
            wx.login
                ({
                    success: function (res) {
                        var _session = wx.getStorageSync(GP.KEY.SESSION)
                        if (!_session) //检查session,不存在，为false
                            _session = "false"
                        console.log(res.code)
                        GP.myLogin(res.code, _session, options) //检测登陆
                    }
                });
        }
    },

    myLogin(js_code, session, options){
        wx.request
            ({
                url: API.MY_LOGIN,
                method: "GET",
                data: {
                    js_code: js_code,
                    session: session,
                },
                success: function (res) {
                    var object = res.data
                    console.log("success:")
                    console.log(res)
                    GP.globalData.tagMatrix = object.tag_matrix
                    GP.globalData.tagFatherList = object.tag_father_list
                    GP.globalData.user_id = object.user_id
                    GP.globalData.logo = object.logo
                    GP.globalData.nick_name = object.nick_name
                    GP.globalData.userMemberList = object.user_member_list
                    console.log(object.tag_matrix)
                    //初始化静态变量
                    // GP.STATIC = res.data.util
                    wx.setStorageSync('session', res.data.session)
                    getCurrentPages()[0].onInit(options)  //Todo 初始化页面、目录

                    GP.globalData.isLogin = true
                    //暂时专供抢画后保存图片用，日后与login合体          
                },
                fail: function (res) {
                    wx.showModal({
                        title: '网络连接失败，是否重新登陆？',
                        content: '请确认网络是否正常',
                        confirmText: "重新登陆",
                        success: function (res) {
                            if (res.confirm) {
                                GP.login()
                            }

                        }
                    })
                },
            })
    },

})
