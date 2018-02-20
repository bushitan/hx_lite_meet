
var GP
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var Flow = require('flow.js');

var STYLE_ORDER_MEMBER = 0
var STYLE_ORDER_SINGLE = 1

Page({
    data: {
        artId:"",
        art:[],
        isLock: "0", //充值权限控制
        
        // iconVip: '../../images/member_vip_icon.png',
        // iconSuperVip: '../../images/member_super_vip_icon.png',
        vip_name: "短信会员",
        supervip_name: "资讯会员",

        //模式为order进入的方式，
        isFromOrder:false,
        //显示支付订单
        //订单模式
        styleOrder: "",
        STYLE_ORDER_MEMBER: STYLE_ORDER_MEMBER, //会员订单
        STYLE_ORDER_SINGLE: STYLE_ORDER_SINGLE, //点播订单
        // 二维选择数组
        multiArray: [],
        multiIndex: [],

        memberIndex:0,

        isPayBtnDisable: false,
        showProcotol: false,
        
        roleIndex:0, //选择下标
        roleList: [], //角色选择列表
        fatherTag: "",  //父类标签
        showSingleBtn:false, //默认不显示点播按钮
        vipRole:{},  //VIP会员角色信息
        superVipRole:{}, //超级会员角色信息

        showOrder: false, //支付订单页面，
        order:{} ,//职业订单详情
        discountList:[], //优惠券列表
    },
    onLoad: function (options) {
        GP = this
        var _father_tag = wx.getStorageSync(APP.KEY.FATHER_TAG) 
        var articleID = ""
        if (options.hasOwnProperty("article_id"))
            articleID = options.article_id
        GP.setData({
            fatherTag: _father_tag,
            articleID: articleID,
            // isFromArticle: options.hasOwnProperty("article_id"),  //是否从文章过来
        })
        wx.setNavigationBarTitle({  // 设置当前页面
            title: _father_tag.tag_name
        })
        //必须要登陆以后再做的事情
        if (APP.globalData.isLogin == true)
            GP.onInit(options)
        else
            APP.login(options)

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

    //选择会员等级
    bindPickTag(e) {
        var _value = e.detail.value
        GP.setData({
            roleIndex: _value,
        })
    },


    /**
     * 事件
     * 点击： 会员支付按钮
     * return： order ， discount_list
     */
    clickMember: function (e) {
        var roleIndex = GP.data.roleIndex
        var roleList = GP.data.roleList
        var fatherTag = GP.data.fatherTag
        API.Request({
            'url': API.PAY_CREATE_ORDER,
            'data': {
                is_member_order: true,
                tag_id: fatherTag.tag_id,
                role_id: roleList[roleIndex].role_id,
            },
            success: function (res) {
                var object = res.data
                GP.setData({
                    order: object.order_dict,
                    discountList: object.discount_list,
                    showOrder: true,
                    styleOrder: STYLE_ORDER_MEMBER,
                    discountIndex: 0, //优惠券选择下标
                })
            }
        })
    },

    clickSingle(e){
        var data = {
            is_member_order: true,
            article_id: GP.data.articleID,
        }
        API.Request({
            'url': API.PAY_CREATE_ORDER,
            'data': {
                is_member_order: false,
                article_id: GP.data.articleID,
            },
            success: function (res) {
                var object = res.data
                GP.setData({
                    order: object.order_dict,
                    discountList: object.discount_list,
                    showOrder: true,
                    styleOrder: STYLE_ORDER_SINGLE,
                    discountIndex: 0, //优惠券选择下标
                    articleTitle: object.article_title, //点播的文章列表
                })
            }
        })
    },


    creatPayOrder( data ){
       
    },

    /**
     * 事件
     * 返回按钮
     */
    toBack: function () {
        // wx.navigateBack({
        // })
        wx.switchTab({
            url: '../index/index',
        })
    },


    /**
     * 点击确认支付
     */
    clickCreateOrder(){

        var _order_id = GP.data.order.order_id
        var _discount_list = GP.data.discountList
        var _discount_index = GP.data.discountIndex
        var _discount_id = ""
        if (_discount_list.length > 0)
            _discount_id = _discount_list[_discount_index].discount_id
       
        console.log(_order_id,_discount_id)
        API.Request({
            'url': API.PAY_CONFIRM_ORDER,
            'data': {
                order_id: _order_id,
                discount_id: _discount_id,
            },
            success: function (res) {
                var object = res.data
                console.log(object)

                if (object.is_zero == true)
                    GP.paySuccess()   //0元支付，直接提示成功
                else
                    GP.wxPay(object) //微信支付，调取支付接口
            }
        })
    },

    /**
     * 支付成功
     */
    paySuccess(){
        wx.showToast({
            title: '支付成功',
            success: function () {
                APP.login()
                setTimeout(
                    function () {
                            // wx.navigateBack()
                        GP.toBack()
                    },
                    1500, )
            },
        })
    },

    /**
     * 支付失败
     */
    payFail(){
        wx.showModal({
            title: '微信支付提示',
            content: '支付已取消，若出现微信支付不成功的问题，请联系管理员',
            showCancel:false,
        })
    },


    /**
     * 调取微信支付api
     */ 
    wxPay(object){
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












    //打钩，同意协议
    bindProtocolChange(e){
        // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        console.log(e.detail.value.length)
        if (e.detail.value.length == 0)
            GP.setData({ isPayBtnDisable: true })
        else
            GP.setData({ isPayBtnDisable: false })
    },

    //跟后台要对应行业的协议内容
    openProtocol() {
        // var member_pick_range = GP.data.member_pick_range
        // var memberIndex = GP.data.memberIndex
        // var tag_id = member_pick_range[memberIndex - 1].tag_id
        // console.log(tag_id)
        // GP.setData({ showProcotol: true })

        wx.navigateTo({
            url: '../detail/detail',
        })
    },
    closeProtocol() {
        GP.setData({ showProcotol: false })
    },
    



    // //  1 标签、角色二维联动变换
    // // 二维选择器中，上下移动列号
    // bindMultiPickerColumnChange: function (e) {
    //     var data = {
    //         multiArray: this.data.multiArray,
    //         multiIndex: this.data.multiIndex
    //     };
    //     data.multiIndex[e.detail.column] = e.detail.value;    // 移动colum的元素，改变当前colum的value
    //     var memberObject = GP.data.member_pick_range // 所有数据
    //     var colum_0_index = GP.data.multiIndex[0]    // 第一列的索引
    //     if (e.detail.column == 0) {//当第一列移动，更改第二列内容
    //         var member_list = memberObject[colum_0_index].list
    //         var colum_1 = []
    //         for (var i = 0; i < member_list.length;i++)
    //             colum_1.push(member_list[i].role_name)
    //         data.multiArray[1] = colum_1
    //         data.multiIndex[1] = 0
    //     }
    //     GP.setData(data);//更新数据
    // },

    // bindPickMember(e) { 

    //     var member_pick_range = GP.data.member_pick_range
    //     var _value = e.detail.value
    //     if (_value == 0){ //显示：请选择网站，初始化pick
    //         Flow.Page.InitPick(member_pick_range) 
    //     }
    //     else {//pick的一般变换，下标-1 是member_pick_range真实范围
    //         var _list = member_pick_range[_value - 1].list
    //         var _tagRange = []
    //         for (var i = 0; i < _list.length; i++) {
    //             _tagRange.push(_list[i].role_name)
    //         }

    //         GP.setData({
    //             memberIndex: _value,
    //             tagIndex: 0,
    //             tagRange: _tagRange,
    //         })
    //     }
       
    // },


    // 点击选择器的确定，改变数据值
    tagRoleChange:()=>{
        Flow.Page.ChangeTagRole()
    },

    // 2.2 点播打折券选取
    setSingleDiscount: function (e) {
        GP.setData({
            styleOrder: STYLE_ORDER_SINGLE,
        })
        GP.data.art_id
        Flow.PreOrder.GetPreSingleOrder()  
    },

    // 2.3 重新选择优惠券
    bindDiscountChange: function (e) {
        var _index = e.detail.value
        Flow.PreOrder.ChangeDiscount(_index)
    },


    // 2.4 关闭优惠券
    closeDiscount: function () {
        GP.setData({
            showOrder: false,
        })

    },

    // 3.1 创建订单
    createOrder:function(){
        if (GP.data.styleOrder == STYLE_ORDER_MEMBER) {
            // var _select_tag_role = Flow.Page.GetSelectTagRole()
            // var _tag_id = _select_tag_role["tag_id"]
            // var _role_id = _select_tag_role["role_id"]
            // var pick_discount_id = Flow.PreOrder.GetPreOrder()["pick_discount_id"]

            // // console.log(a)
            // Flow.Order.AddMember(_tag_id, _role_id, pick_discount_id)

            var _pre_order = Flow.PreOrder.GetPreOrder()
            Flow.PreOrder.ComfirmMember(_pre_order.order_id, _pre_order.pick_discount_id)
        }
        else {
            // Flow.Order.AddSingle()
            var _pre_order = Flow.PreOrder.GetPreOrder()
            Flow.PreOrder.ComfirmMember(_pre_order.order_id, _pre_order.pick_discount_id)
        }
    },


 

})