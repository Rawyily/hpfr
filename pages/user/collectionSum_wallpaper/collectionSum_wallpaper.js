// pages/user/collectionSum_wallpaper/collectionSum_wallpaper.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        SystemInfo: undefined,
        Menu: undefined,
        myacross: [],
        myvertical: [],
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
        across_limit: Math.ceil(app.globalData.screenHeight / (app.globalData.windowWidth / 75 * 28)) * 2,
        across_skip: 0,
        /*1_vertical.wxml*/
        vertical: [],
        vertical_scrollTop: 0,
        vertical_init: false,
        vertical_advertising_img: [],
        vertical_loading: false,
        vertical_end: false,
        vertical_limit: Math.ceil(app.globalData.screenHeight / (app.globalData.windowWidth / 75 * 39)) * 3,
        vertical_skip: 0,
    },
    init() {
        const SystemInfo = wx.getSystemInfoSync()
        // console.log(SystemInfo);
        const Ment = wx.getMenuButtonBoundingClientRect()
        // console.log(Ment);
        this.setData({
            SystemInfo: SystemInfo,
            Menu: Ment,
            across_limit: Math.ceil(SystemInfo.windowHeight / (SystemInfo.windowWidth / 75 * 28)) * 2,
            vertical_limit: Math.ceil(SystemInfo.windowHeight / (SystemInfo.windowWidth / 75 * 39)) * 3,
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
            if (this.data.vertical_init == false) {
                this.getMyVerticalWallpaper()
                this.setData({
                    vertical_init: true
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
                across_scrollTop: 0
            })
        } else if (tap == 2) {
            this.setData({
                vertical_scrollTop: 0
            })
        }
        console.log("[app] 点击回到顶部：" + this.data.tap);
    },
    getMycollectionArray() {
        wx.cloud.callFunction({
            name: "HG_user_wallpaper_array_collection",
            data: {
                getArray: true,
                openid: app.globalData.openid
            }
        }).then(res => {
            console.log(res);
            this.setData({
                myacross: res.result[0].myacross,
                myvertical: res.result[0].myvertical
            })
            this.getMyAcrossWallpaper()
        })
    },
    getMyAcrossWallpaper() {
        console.log(this.data.myacross, this.data.myvertical);
        if (this.data.across_loading == false && this.data.across_end == false) {
            this.setData({
                across_loading: true
            })
            let myacross = this.data.myacross
            const array = myacross.slice(this.data.across_skip, (this.data.across_skip + this.data.across_limit))
            console.log(array);
            wx.cloud.callFunction({
                name: "HG_user_wallpaper_array_collection",
                data: {
                    array,
                    isAcross: true
                }
            }).then(res => {
                console.log(res.result);
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
            }).finally(res => {
                console.log("finally");
                this.setData({
                    across_loading: false
                })
            })
        }
    },
    getMyVerticalWallpaper() {
        console.log(this.data.myacross, this.data.myvertical);
        if (this.data.vertical_loading == false && this.data.vertical_end == false) {
            this.setData({
                vertical_loading: true
            })
            let myvertical = this.data.myvertical
            const array = myvertical.slice(this.data.vertical_skip, (this.data.vertical_skip + this.data.vertical_limit))
            console.log(array);
            wx.cloud.callFunction({
                name: "HG_user_wallpaper_array_collection",
                data: {
                    array,
                    isAcross: false
                }
            }).then(res => {
                console.log(res.result);
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
            }).finally(res => {
                console.log("finally");
                this.setData({
                    vertical_loading: false
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
                    across_advertising_img: res.result,
                    vertical_advertising_img: res.result,
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
        details(e){
            console.log(e.currentTarget.dataset.data);
            const data = JSON.stringify(e.currentTarget.dataset.data)
            wx.navigateTo({
              url: "/pages/wallpaper/details/details?data="+data,
            })
        },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.init()
        this.getMycollectionArray()
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