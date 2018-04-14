
var GP
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');


Page({
    data: {
        radio: [
            { name: "标准双人间（两人合住）", checked: true, price: "￥450.00" },
            { name: "标准单人间（包间）", checked: false, price: "￥800.00" },
        ],
        costList:[],
        costSelectIndex:0,
        total:351.29,
    },
    onLoad: function (options) {
        GP = this
        GP.onInit()


        /**
         * 检查是否已经支付，已经支付换页面
         * 
         * 未支付：
         * 1支付
         * 2、成功，调到填写资料
         * 3、不成功：
         * 4、返回
         */
        
        //
    },

    selectChange(e) {
        var index = e.detail
        // console.log(index )
        GP.setData({
            costSelectIndex:index
        })
    },
    /**
     *  进入渠道：
     * 1 、 文章进入，有点播
     * 2、 供求、花名册、会员，没有点播
     */
    onInit: function (options) {
        
        API.Request({
            'url': API.MEET_SIGN_GET_COST,
            
             'success':function(res){
                var object = res.data
                console.log(res.data)
                var list_cost = res.data.list_cost
                if (list_cost.length > 0 )
                    list_cost[0]["checked"] = true
                GP.setData({
                    costList: list_cost
                })
                // GP.setData({
                //     roleList:object.role_list,
                //     roleIndex:0,
                //     vipRole: object.vip_role,
                //     superVipRole: object.super_vip_role,
                //     showSingleBtn:object.show_single_btn,
                // })
             },
         })
    },

    pay(){

        API.Request({
            'url': API.MEET_SIGN_PAY_ORDER,
            'data': {
                cost_id: GP.data.costList[GP.data.costSelectIndex].cost_id
            },
            'success': function (res) {
                GP.wxPay(res.data.wx_sign)
            },
        })
    },

    paySuccess(res) {
        wx.showModal({
            title: '支付成功',
            content: '完善',
            success:function(){
                wx.switchTab({
                    url: '/pages/my/my',
                })
            },
        })
    },
    payFail(res) {
        wx.showModal({
            title: '支付失败',
            content: '如已经扣款，请联系客服人员',
            success: function () {
                wx.switchTab({
                    url: '/pages/my/my',
                })
            },
        })
    },
    /**
     * 调取微信支付api
     */
    wxPay(object) {
        // wx.requestPayment({
        //     'timeStamp': object.timeStamp,
        //     'nonceStr': object.nonceStr,
        //     'package': object.package,
        //     'signType': 'MD5',
        //     'paySign': object.paySign,
        //     'success': function (res) {
        //         console.log(res)
        //         // GP.paySuccess()
        //     },
        //     'fail': function (res) {
        //         console.log(res)
        //         // GP.payFail()
        //     }
        // })
        wx.requestPayment({
            'timeStamp': object.timeStamp,
            'nonceStr': object.nonceStr,
            'package': object.package,
            'signType': 'MD5',
            'paySign': object.paySign,
            'success': function (res) {
                console.log(res)
                GP.paySuccess(res)
            },
            'fail': function (res) {
                console.log(res)
                // GP.paySuccess(res)
                GP.payFail(res)
            }
        })
    }, 

})