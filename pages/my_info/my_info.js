
var GP
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');


Page({
    data: {
        male: ['男', '女'],
        area:['北京','广西','天津','广东'],
        userInfo:{},
        lock:false,
    },
    onLoad: function (options) {
        GP = this
        GP.onInit()
    },

    inputName(e) {
        var _userInfo = GP.data.userInfo
        _userInfo.name = e.detail
        GP.setData({
            userInfo: _userInfo
        })
    },
    inputCompany(e) {
        var _userInfo = GP.data.userInfo
        _userInfo.company = e.detail
        GP.setData({
            userInfo: _userInfo
        })
    },
    inputPhone(e) {
        var _userInfo = GP.data.userInfo
        _userInfo.phone = e.detail
        GP.setData({
            userInfo: _userInfo
        })
    },


    selectMale(e) {
        var index = e.detail
        console.log(GP.data.male[index])
    },
    selectArea(e){
        var index = e.detail
        console.log(GP.data.area[index])
    },

    /**
     *  进入渠道：
     * 1 、 文章进入，有点播
     * 2、 供求、花名册、会员，没有点播
     */
    onInit: function (options) {
        API.Request({
            url: API.MEET_SIGN_GET_INFO,
            success: function (res) {
                console.log(res)
                GP.setData({
                    userInfo: res.data.dict_attendee
                })
            }
        })

        // 获取入场券信息
        API.Request({
            url: API.MEET_SIGN_PAY_GET_INFO,
            success: function (res) {
                console.log(res)
                GP.setData({
                    signList: res.data.list_sign
                })
                // wx.setStorageSync(KEY.USER_INFO, res.data.dict_attendee)
            }
        })
    },

    // 上传信息
    updateInfo(){
        var userInfo = GP.data.userInfo
        if (userInfo.name == "" || userInfo.company == "" || userInfo.phone == "") {
            var n = userInfo.name == "" ? "姓名  " : ""
            var c = userInfo.company =="" ? "企业名称  " : ""
            var p = userInfo.phone == "" ? "手机  " : ""
            wx.showModal({
                title: '温馨提示',
                content: '为了方便联系您，请填写：' +n+c+p ,
            }) 
            return 
        }
        // 上锁
        if ( GP.data.lock == true){
            wx.showModal({
                title: '温馨提示',
                content: '正在上传中，请别着急',
            })
            return 
        }
        GP.setData({
            lock:true,
        })
        API.Request({
            url: API.MEET_SIGN_SET_INFO,
            data: {
                name: userInfo.name,
                company: userInfo.company,
                phone: userInfo.phone,
            },
            success: function (res) {
                console.log(res)
                // GP.setData({
                //     userInfo: res.data.dict_attendee
                // })
            },
            complete:function(res){
                GP.setData({
                    lock: false,
                })
            },
        })
    },



})