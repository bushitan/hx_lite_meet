var API = require('../../utils/api.js');
var KEY = require('../../utils/key.js');
var APP = getApp()
var GP;
Page({
    data: {
        isLoading: true
    },
    /**
     * index初始化
     * 加载默认的标签
     */
    onLoad: function (options) {

        GP = this

        //必须要登陆以后再做的事情
        if (APP.globalData.isLogin == true)
            GP.onInit(options)
        else
            APP.login(options)

    },

    /**
     * 选择新行业后返回，更新默认目录
     */
    onShow() {

        if (APP.globalData.isLogin == true) {  //已经登录

        }
    },

    //必须要登陆以后发起的请求，在这里完成
    onInit: function (options) {

        API.Request({
            'url': API.MEET_AGENDA,
            'data': { "meet_id": 1 },
            'success': function (res) {
                GP.setData({
                    tagIndex: 0,
                    tagList: res.data.tag_list,
                    coverMatrix: res.data.cover_matrix,
                })
            },
        })

        API.Request({
            'url': API.MEET_INDEX,
            'success': function (res) {
                APP.globalData.agendaSwiperList = res.data.agenda_swiper_list
                APP.globalData.newsSwiperList = res.data.news_swiper_list
                APP.globalData.currenMeet = res.data.current_meet
                GP.setData({
                    agendaSwiperList: res.data.agenda_swiper_list,
                    newsSwiperList: res.data.news_swiper_list,
                    currenMeet: res.data.current_meet,

                    isLoading: false,
                })
            },
        })
    },
})
