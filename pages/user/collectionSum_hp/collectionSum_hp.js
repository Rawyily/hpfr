// pages/user/collectionSum_hp/collectionSum_hp.js
var ymdshms = require('../../../utils/ymdshms.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        SystemInfo: undefined,
        // model pixelRatio windowWidth windowHeight language version platform
        Menu: undefined,
        openid: app.globalData.openid,
        item_id: 1,
        tap: 1,
        Carray: [],
        Cgather: [],
        Cmeme: [],
        /**all.wxml*/
        all: [],
        all_advertising_img: [],
        all_limit: 18,
        all_skip: 0,
        all_loading: false,
        all_end: false,
        all_scrollTop: undefined,
        /**gather.wxml */
        gather: [],
        gather_advertising_img: [],
        gather_skip: 0,
        gather_loading: false,
        gather_end: false,
        gather_init: false,
        gather_scrollTop: undefined,
        gather_limit: 10,
        /**keywords.wxml*/

        /**meme*/
        meme: [],
        meme_advertising_img: [],
        meme_skip: 0,
        meme_loading: false,
        meme_end: false,
        meme_init: false,
        meme_scrollTop: undefined,

    },
    // Init
    init() {
        // console.log("init");
        // const that = this
        const SystemInfo = wx.getSystemInfoSync()
        // console.log(SystemInfo);
        const Ment = wx.getMenuButtonBoundingClientRect()
        // console.log(Ment);
        this.setData({
            SystemInfo: SystemInfo,
            Menu: Ment,
            all_limit: Math.round(SystemInfo.windowHeight / (SystemInfo.windowWidth / 3)) * 3,
            gather_limit: Math.round(SystemInfo.windowHeight / (SystemInfo.windowWidth / 3)),
        })
        // console.log(this.data);
    },
    // 点击顶导航栏
    changeItemID(e) {
        // console.log("changeItemID_current=" + e.target.dataset.itemid);
        console.log("[app] tap:" + e.target.dataset.itemid);
        this.setData({
            item_id: e.target.dataset.itemid
        })
    },
    // swiper 有变化时调用(初始化)
    changeTap(e) {
        // console.log("changeTap_current=" + e.detail.current);
        console.log("[app] current:" + e.detail.current);
        this.setData({
            tap: e.detail.current
        })
        if (e.detail.current == 2) {
            if (this.data.gather_init == false) {
                this.getMyGather()
                this.setData({
                    gather_init: true
                })
            }
        } else if (e.detail.current == 3) {
            if (this.data.meme_init == false) {
                this.getMyCollectionHeadPortrait_MEME()
                this.setData({
                    meme_init: true
                })
            }
        } else if (e.detail.current == 0) {
            console.log("[app navigateBack]");
            wx.navigateBack({
                delta: -1,
            })
        }
    },
    // 点击回到顶部
    scrollTop() {
        const tap = this.data.tap
        if (tap == 1) {
            this.setData({
                all_scrollTop: 0
            })
        } else if (tap == 2) {
            this.setData({
                gather_scrollTop: 0
            })
        } else if (tap == 3) {
            this.setData({
                meme_scrollTop: 0
            })
        }
        console.log("[app] 点击回到顶部：" + this.data.tap);
    },
    // 获取收藏数组
    getUserHeadPortraitCollectionArray() {
        wx.cloud.callFunction({
            name: "HGuserheadPortraitarray",
            data: {
                openid: app.globalData.openid
            }
        }).then(res => {
            console.log(res.result.data);
            this.setData({
                Carray: res.result.data[0].array,
                Cgather: res.result.data[0].gather,
                Cmeme: res.result.data[0].meme,
            })
            this.getMyCollectionHeadPortrait()
            console.log(res.result.data[0].gather);
        })
    },
    // 获取all头像数据
    getMyCollectionHeadPortrait() {
        console.log(this.data.all_loading == false, this.data.all_end == false);
        if (this.data.all_loading == false && this.data.all_end == false) {
            this.setData({
                all_loading: true
            })
            let Carray = this.data.Carray
            const array = Carray.slice(this.data.all_skip, (this.data.all_skip + this.data.all_limit))
            wx.cloud.callFunction({
                name: "HGappheadportraitgather",
                data: {
                    array,
                    type: true
                }
            }).then(res => {
                console.log(res.result);
                this.setData({
                    all: [...this.data.all, ...[{
                        array: res.result
                    }]],
                    all_skip: this.data.all_skip + res.result.length
                })
                if (res.result.length < this.data.all_limit) {
                    this.setData({
                        all_end: true
                    })
                }
            }).finally(res => {
                console.log("finally");
                this.setData({
                    all_loading: false
                })
            })
        }
    },
    //获取广告
    getAdvertising_img() {
        wx.cloud.callFunction({
            name: "HGadvertisingimgWhere",
            data: {
                skip: 0,
                limit: 11,
                where: {
                    classify: "DATE A LIVE"
                }
            }
        }).then(res => {
            // console.log(res);
            this.setData({
                all_advertising_img: res.result,
                gather_advertising_img: res.result,
                meme_advertising_img: res.result,
            })
            console.log("[app] 获取广告成功");
        })
    },
    // 预览
    previewImage(e) {
        console.log("[app] 预览");
        // console.log(e.target.dataset.url);
        wx.previewImage({
            current: e.target.dataset.url, // 当前显示图片的http链接
            urls: [e.target.dataset.url] // 需要预览的图片http链接列表
        })
    },
    // 前往详情页
    goDetails(e) {
        // console.log(e.target.dataset.data);
        console.log("[app] 前往详情页");
        const data = JSON.stringify(e.target.dataset.data)
        wx.navigateTo({
            url: '/pages/headPortrait/details/details?' +
                "data=" + data
        })
    },
    getMyGather() {
        if (this.data.gather_loading == false && this.data.gather_end == false) {
            this.setData({
                gather_loading: true
            })
            const Cgather = this.data.Cgather
            console.log(this.data.Cgather);
            console.log(this.data.gather_limit);
            const array = Cgather.slice(this.data.gather_skip, (this.data.gather_skip + this.data.gather_limit))
            console.log(array);
            wx.cloud.callFunction({
                name: "HGappheadportraitgather",
                data: {
                    idTransfromGather: true,
                    array
                }
            }).then(res => {
                console.log(res.result);
                let resResult = res.result;
                for (let index = 0; index < resResult.length; index++) {
                    resResult[index]._updateTime = ymdshms(resResult[index]._updateTime)[0]
                }
                this.setData({
                    gather: [...this.data.gather, ...[{
                        array: resResult
                    }]],
                    gather_skip: this.data.gather_skip + res.result.length
                })
                if (res.result.length < this.data.gather_limit) {
                    this.setData({
                        gather_end: true
                    })
                }
            }).finally(res => {
                console.log(res);
                this.setData({
                    gather_loading: false
                })
            })
        }
    },
    go_gather(e) {
        console.log(e);
        const data = JSON.stringify(e.currentTarget.dataset.data)
        wx.navigateTo({
            url: "/pages/headPortrait/gather/gather?data=" + data

        })
    },
    getMyCollectionHeadPortrait_MEME() {
        if (this.data.meme_loading == false && this.data.meme_end == false) {
            this.setData({
                meme_loading: true
            })
            let Cmeme = this.data.Cmeme
            console.log(Cmeme);
            const array = Cmeme.slice(this.data.meme_skip, (this.data.meme_skip + this.data.all_limit))
            wx.cloud.callFunction({
                name: "HGappheadportraitgather",
                data: {
                    array,
                    type: true
                }
            }).then(res => {
                console.log(res.result);
                this.setData({
                    meme: [...this.data.meme, ...[{
                        array: res.result
                    }]],
                    meme_skip: this.data.meme_skip + res.result.length
                })
                if (res.result.length < this.data.all_limit) {
                    this.setData({
                        meme_end: true
                    })
                } else {

                }
            }).finally(res => {
                console.log("finalley");
                this.setData({
                    meme_loading: false
                })
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.init()
        this.getUserHeadPortraitCollectionArray()
        this.getAdvertising_img()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})