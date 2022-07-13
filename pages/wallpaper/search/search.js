// pages/wallpaper/search/search.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        MenuBottom: app.globalData.MenuBottom,
        MenuLeft: app.globalData.MenuLeft,
        MenuRight: app.globalData.MenuRight,
        MenuWidth: app.globalData.MenuWidth,
        MenuHeight: app.globalData.MenuHeight,
        windowHeight: undefined,
        windowWidth: undefined,

        item_id: 1,

        /**across.wxml*/
        across: [],
        across_scrollTop: 0,
        across_init: false,
        across_advertising_img: [],
        across_loading: false,
        across_end: false,
        across_limit: Math.ceil(app.globalData.windowHeight / (app.globalData.windowWidth / 75 * 28)) * 2,
        across_skip: 0,
        across_end_text: "END",


        /*vertical.wxml*/
        vertical: [],
        vertical_scrollTop: 0,
        vertical_init: false,
        vertical_advertising_img: [],
        vertical_loading: false,
        vertical_end: false,
        vertical_limit: Math.ceil(app.globalData.windowHeight / (app.globalData.windowWidth / 75 * 39)) * 3,
        vertical_skip: 0,
        vertical_end_text: "END",

        placeholder: "请输入搜索关键词",

        keywords: false,
    },
    // 左滑返回
    swiperchange(e) {
        this.setData({
            item_id: e.detail.current
        })
        console.log(e.detail.current);
        if (e.detail.current == 0) {
            wx.navigateBack({
                delta: -1,
            })
        } else if (e.detail.current == 1) {
            if (this.data.across_init == false) {
                this.getAcross()
                this.setData({
                    across_init: true
                })
            }
        } else if (e.detail.current == 2) {
            if (this.data.vertical_init == false) {
                this.getVertical()
                this.setData({
                    vertical_init: true
                })
            }
        }
    },
    getAcross() {
        if (this.data.across_loading == false && this.data.across_end == false) {
            const acrosslength = this.data.across.length
            this.setData({
                across_loading: true
            })
            console.log(this.data.placeholder);
            wx.cloud.callFunction({
                name: "HGappwallpaperacross",
                data: {
                    limit: this.data.across_limit,
                    skip: this.data.across_skip,
                    search: this.data.placeholder,
                    type: "search"
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
                if (res.result.length == 0 && acrosslength == 0) {
                    this.setData({
                        across_end_text: "搜索结果为空",
                        item_id:2
                    })
                }
            }).finally(res => {
                this.setData({
                    across_loading: false
                })
            })
        }
    },
    getVertical() {
        if (this.data.vertical_loading == false && this.data.vertical_end == false) {
            const verticallength = this.data.vertical.length
            this.setData({
                vertical_loading: true
            })
            wx.cloud.callFunction({
                name: "HGappwallpapervertical",
                data: {
                    limit: this.data.vertical_limit,
                    skip: this.data.vertical_skip,
                    search: this.data.placeholder,
                    type: "search"
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
                if (res.result.length == 0 && verticallength == 0) {
                    this.setData({
                        vertical_end_text: "搜索结果为空"
                    })
                }
                console.log(res.result.length, verticallength);
            }).finally(res => {
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
    bindsearch(e) {
        console.log(e);
        const search = e.detail
        console.log(search);
        if (search == this.data.placeholder) {
            wx.showToast({
                title: '重复搜索',
                icon: "error"
            })
        } else {
            if (this.data.item_id == 1) {
                this.searchAcross(search)
            } else if (this.data.item_id == 2) {
                this.serchVertical(search)
            }
        }
    },
    searchAcross(e) {
        wx.showLoading({
            title: '搜索中...',
        })
        wx.cloud.callFunction({
            name: "HGappwallpaperacross",
            data: {
                limit: this.data.across_limit,
                skip: 0,
                search: e,
                type: "search"
            }
        }).then(res => {
            console.log(res.result);
            if (res.result.length > 0) {
                wx.hideLoading()
                this.setData({
                    across: [{
                        array: res.result
                    }],
                    across_scrollTop: 0,
                    across_init: true,
                    across_skip: res.result.length,
                    across_end_text: "END",

                    vertical: [],
                    vertical_scrollTop: 0,
                    vertical_init: false,
                    vertical_end: false,
                    vertical_skip: 0,
                    vertical_end_text: "END",
                    placeholder: e
                })
                if (res.result.length < this.data.across_limit) {
                    this.setData({
                        across_end: true
                    })
                } else {
                    this.setData({
                        across_end: false
                    })
                }
            } else {
                wx.cloud.callFunction({
                    name: "HGappwallpapervertical",
                    data: {
                        limit: this.data.vertical_limit,
                        skip: 0,
                        search: e,
                        type: "search"
                    }
                }).then(res => {
                    wx.hideLoading()
                    if (res.result.length > 0) {
                        this.setData({
                            across: [{
                                array: []
                            }],
                            across_scrollTop: 0,
                            across_init: true,
                            across_end: true,
                            across_skip: 0,
                            across_end_text: "搜索结果为空",

                            vertical: [{
                                array: res.result
                            }],
                            vertical_scrollTop: 0,
                            vertical_init: true,
                            vertical_skip: res.result.length,
                            vertical_end_text: "END",
                            item_id: 2,
                            placeholder: e
                        })
                        if (res.result.length < this.data.vertical_limit) {
                            this.setData({
                                vertical_end: true
                            })
                        } else {
                            this.setData({
                                vertical_end: false
                            })
                        }
                    } else {
                        wx.showToast({
                            title: '搜索结果为空',
                            icon: "none"
                        })
                    }
                }).catch(err => {
                    wx.showToast({
                        title: '出错了',
                        icon: "error"
                    })
                })
            }
        }).catch(err => {
            wx.showToast({
                title: '出错了',
                icon: 'error'
            })
        })
    },
    serchVertical(e) {
        wx.showLoading({
            title: '搜索中...',
        })
        wx.cloud.callFunction({
            name: "HGappwallpapervertical",
            data: {
                limit: this.data.across_limit,
                skip: 0,
                search: e,
                type: "search"
            }
        }).then(res => {
            console.log(res.result);
            // vertical搜索成功
            if (res.result.length > 0) {
                wx.hideLoading()
                this.setData({
                    across: [],
                    across_scrollTop: 0,
                    across_init: false,
                    across_end: false,
                    across_skip: 0,
                    across_end_text: "END",

                    vertical: [{
                        array: res.result
                    }],
                    vertical_scrollTop: 0,
                    vertical_init: true,
                    vertical_skip: res.result.length,
                    vertical_end_text: "END",
                    placeholder: e
                })
                if (res.result.length < this.data.vertical_limit) {
                    this.setData({
                        vertical_end: true
                    })
                } else {
                    this.setData({
                        vertical_end: false
                    })
                }
            } else {
                wx.cloud.callFunction({
                    name: "HGappwallpaperacross",
                    data: {
                        limit: this.data.vertical_limit,
                        skip: 0,
                        search: e,
                        type: "search"
                    }
                }).then(res => {
                    if (res.result.length > 0) {
                        wx.hideLoading()
                        this.setData({
                            across: [{
                                array: res.result
                            }],
                            across_scrollTop: 0,
                            across_init: true,
                            across_skip: res.result.length,
                            across_end_text: "END",

                            vertical: [{
                                array: []
                            }],
                            vertical_scrollTop: 0,
                            vertical_init: true,
                            vertical_end: true,
                            vertical_skip: 0,
                            vertical_end_text: "搜索结果为空",
                            item_id: 1
                        })
                        if (res.result.length < this.data.across_limit) {
                            this.setData({
                                across_end: true
                            })
                        } else {
                            this.setData({
                                across_end: false
                            })
                        }
                    } else {
                        wx.showToast({
                            title: '搜索结果为空',
                            icon: "none"
                        })
                    }
                }).catch(err => {
                    wx.showToast({
                        title: '出错了',
                        icon: 'error'
                    })
                })
            }
        }).catch(err => {
            wx.showToast({
                title: '出错了',
                icon: "none"
            })
        })
    },
    across_scrollTop(e) {
        this.setData({
            across_scrollTop: 0
        })
        console.log(this.data.across_scrollTop);
    },
    vertical_scrollTop(e) {
        this.setData({
            vertical_scrollTop: 0
        })
        console.log(this.data.vertical_scrollTop);
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options.search);
        if (options.search) {
            this.setData({
                placeholder: options.search
            })
        } else if (options.keyword) {
            console.log("options.keyword",options.keyword);
            this.setData({
                placeholder: options.keyword,
                keywords:true
            })
        }
        this.getAcross()
        this.setData({
            across_init: true
        })
        this.getAdvertising_img()
        console.log(this.data.placeholder);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        const that = this
        wx.getSystemInfo({
            success(res) {
                console.log(res.windowHeight)
                console.log(res.screenHeight)
                that.setData({
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth,
                })
            }
        })
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