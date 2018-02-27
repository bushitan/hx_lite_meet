
var GP
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');


Page({
    data: {
        male: ['男', '女'],
        area:['北京','广西','天津','广东'],
    },
    onLoad: function (options) {
        GP = this
    },

    inputName(e) {
        console.log(e.detail)
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
             'url': API.PAY_GET_TAG,
             'data':{
                 "tag_id": GP.data.fatherTag.tag_id,
             },
             'success':function(res){
                var object = res.data
                GP.setData({
                    roleList:object.role_list,
                    roleIndex:0,
                    vipRole: object.vip_role,
                    superVipRole: object.super_vip_role,
                    showSingleBtn:object.show_single_btn,
                })
             },
         })
    },



    /**
     * 调取微信支付api
     */
    wxPay(object) {
        wx.requestPayment({
            'timeStamp': object.timeStamp,
            'nonceStr': object.nonceStr,
            'package': object.package,
            'signType': 'MD5',
            'paySign': object.paySign,
            'success': function (res) {
                console.log(res)
                GP.paySuccess()
            },
            'fail': function (res) {
                console.log(res)
                GP.payFail()
            }
        })
    }, 

})