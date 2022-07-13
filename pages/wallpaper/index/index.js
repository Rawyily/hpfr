// pages/wallpaper/index/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        /**wxml 公用*/
        MenuBottom: app.globalData.MenuBottom,
        MenuLeft: app.globalData.MenuLeft,
        MenuRight: app.globalData.MenuRight,
        MenuWidth: app.globalData.MenuWidth,
        MenuHeight: app.globalData.MenuHeight,

        windowHeight: app.globalData.windowHeight,
        windowWidth: app.globalData.windowWidth,

        statusBarHeight: app.globalData.statusBarHeight,

        /**index.wxml*/
        item_id: 0,
        tap: 0,
        value: undefined,
        /*0_across.wxml*/
        across: [],
        across_scrollTop: 0,
        across_init: false,
        across_advertising_img: [],
        across_loading: false,
        across_end: false,
        across_limit: Math.ceil(app.globalData.windowHeight / (app.globalData.windowWidth / 75 * 28)) * 2,
        across_skip: 0,
        /*1_vertical.wxml*/
        vertical: [],
        vertical_scrollTop: 0,
        vertical_init: false,
        vertical_advertising_img: [],
        vertical_loading: false,
        vertical_end: false,
        vertical_limit: Math.ceil(app.globalData.windowHeight / (app.globalData.windowWidth / 75 * 39)) * 3,
        vertical_skip: 0,
        /*2_keywords.wxml*/
        keywords: [],
        keywords_scrollTop: 0,
        keywords_init: false,
        keywords_advertising_img: [],
        keywords_loading: false,
        keywords_end: false,
        keywords_limit: 100,
        keywords_skip: 0,
    },
    /** index.wxml **/
    // 点击状态栏回到顶部
    scrollTop() {
        const tap = this.data.tap
        console.log(tap, "scrollTop");
        if (tap == 0) {
            this.setData({
                across_scrollTop: 0
            })
        } else if (tap == 1) {
            this.setData({
                vertical_scrollTop: 0
            })
        } else if (tap == 2) {
            this.setData({
                gather_scrollTop: 0
            })
        } else if (tap == 3) {
            this.setData({
                keywords_scrollTop: 0
            })
        }
        console.log("[app] 点击回到顶部：" + this.data.tap);
    },
    // 搜索
    bindselectresult(e) {
        console.log("[app] 搜索");
        console.log(e.detail);
        const search = e.detail
        wx.showLoading({
            title: '搜索中...',
        })
        wx.navigateTo({
            url: "/pages/wallpaper/search/search" + "?search=" + search
        }).finally(res => {
            wx.hideLoading()
        })
    },
    // 点击顶导航栏
    changeItemID(e) {
        // console.log("changeItemID_current=" + e.target.dataset.itemid);
        console.log("[app] current:" + e.target.dataset.itemid);
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
        if (e.detail.current == 1) {
            if (this.data.vertical_init == false) {
                this.getVertical()
                this.setData({
                    vertical_init: true
                })
            }
        } else if (e.detail.current == 2) {
            if (this.data.keywords_init == false) {
                this.getkeywords()
                this.setData({
                    keywords_init: true
                })
            }
        } else if (e.detail.current == 1) {
            if (this.data.post_init == false) {
                this.setData({})
            }
        }
        console.log(this.data);
    },
    /************* across.wxml **************/
    getAcross() {
        if (this.data.across_loading == false && this.data.across_end == false) {
            this.setData({
                across_loading: true
            })
            wx.cloud.callFunction({
                name: "HGappwallpaperacross",
                data: {
                    limit: this.data.across_limit,
                    skip: this.data.across_skip,
                    type: "all"
                }
            }).then(res => {
                console.log(res);
                this.setData({
                    across: [...this.data.across, ...[{
                        array: res.result
                    }]],
                    across_skip: this.data.across_skip + res.result.length
                })
                if (res.result.length < this.data.across_limit) {
                    this.setData({
                        across_end: true
                    })
                }
            }).finally(err => {
                this.setData({
                    across_loading: false
                })
            })
        }
    },
    /*************vertical.wxml **************/
    getVertical() {
        if (this.data.vertical_loading == false && this.data.vertical_end == false) {
            this.setData({
                vertical_loading: true
            })
            wx.cloud.callFunction({
                name: "HGappwallpapervertical",
                data: {
                    limit: this.data.vertical_limit,
                    skip: this.data.vertical_skip,
                    type: "all"
                }
            }).then(res => {
                console.log(res);
                this.setData({
                    vertical: [...this.data.vertical, ...[{
                        array: res.result
                    }]],
                    vertical_skip: this.data.vertical_skip + res.result.length
                })
                if (res.result.length < this.data.vertical_limit) {
                    this.setData({
                        vertical_end: true
                    })
                }
            }).finally(err => {
                this.setData({
                    vertical_loading: false
                })
            })
        }
    },
    /*************keywords.wxml **************/
    getkeywords() {
        if (this.data.keywords_loading == false && this.data.keywords_end == false) {
            this.setData({
                keywords_loading: true
            })
            wx.cloud.callFunction({
                name: "HGappwallpaperkeywords",
                data: {
                    limit: this.data.keywords_limit,
                    skip: this.data.keywords_skip
                }
            }).then(res => {
                console.log(res);
                this.setData({
                    keywords: [...this.data.keywords, ...[{
                        array: res.result.data
                    }]],
                    keywords_skip: this.keywords_skip + res.result.data.length
                })
                if (res.result.data.length < this.data.keywords_limit) {
                    this.setData({
                        keywords_end: true
                    })
                }
            }).finally(res => {
                this.setData({
                    keywords_loading: false
                })
            })
        }
    },
    goKeywords(e) {
        const item = e.currentTarget.dataset.keyword
        console.log(item);
        wx.navigateTo({
            url: "/pages/wallpaper/search/search?keyword=" + item.keyword,
        }).then(res => {
            wx.cloud.callFunction({
                name: "HSappwallpaperkeywords",
                data: {
                    type: "inc",
                    _id: item._id
                }
            }).then(res => {
                console.log(res);
            })
        })

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
                across_advertising_img: res.result,
                vertical_advertising_img: res.result,
                keywords_advertising_img: res.result,
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
    details(e) {
        console.log(e.currentTarget.dataset.data);
        const data = JSON.stringify(e.currentTarget.dataset.data)
        wx.navigateTo({
            url: "/pages/wallpaper/details/details?data=" + data,
        })
    },
    upwindowHeight() {
        if (app.globalData.windowHeight == app.globalData.screenHeight) {
            const setwindowHeight = setInterval(() => {
                const System = wx.getSystemInfoSync()
                if (System.windowHeight == System.screenHeight) {
                    console.log("[app] windowHeight错位err +1");
                } else {
                    this.setData({
                        windowHeight:System.windowHeight
                    })
                    app.globalData.windowHeight = System.windowHeight
                    clearInterval(setwindowHeight);
                    console.log("[app] 获取设备基本信息完成");
                }
            }, 100);
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.upwindowHeight()
        this.getAcross()
        this.getAdvertising_img()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.upwindowHeight()

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.upwindowHeight()

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        this.upwindowHeight()

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        this.upwindowHeight()

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