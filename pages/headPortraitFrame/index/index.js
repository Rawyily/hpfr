// pages/HeadPortrait/HeadPortrait.js
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
        /**公用.wxml*/
        limit: 18, //每次获取18条
        /**all.wxml*/
        skip: 0, //从第0条开始读取 
        allHPF: [], //allheadportraitframe
        allEnd: false,
        allloading: false,
        all_advertising_img: [],
        all_scrollTop: undefined,
        /**recommend.wxml */
        recommend_init: false,
        recommend_HPF: [],
        recommend_skip: 0, //从第0条开始读取 
        recommend_End: false,
        recommend_loading: false,
        recommend_advertising_img: [],
        recommend_scrollTop: undefined,
        /**square.wxml */
        square_init: false,
        square_HPF: [],
        square_skip: 0, //从第0条开始读取 
        square_End: false,
        square_loading: false,
        square_advertising_img: [],
        square_scrollTop: undefined,
        /**circular.wxml */
        circular_init: false,
        circular_HPF: [],
        circular_skip: 0, //从第0条开始读取 
        circular_End: false,
        circular_loading: false,
        circular_advertising_img: [],
        circular_scrollTop: undefined,
        /**gif.wxml */
        gif_init: false,
        gif_HPF: [],
        gif_skip: 0, //从第0条开始读取 
        gif_End: false,
        gif_loading: false,
        gif_advertising_img: [],
        gif_scrollTop: undefined,
    },
    /**自定义函数**/
    test() {
        console.log("-------------------------------test----------------------------");
        this.setData({
            scrollTop: 0
        })
    },
    /** index.wxml **/
    // 点击顶导航栏
    changeItemID(e) {
        // console.log("changeItemID_current=" + e.target.dataset.itemid);
        console.log("[app] current:" + e.target.dataset.itemid);
        this.setData({
            item_id: e.target.dataset.itemid
        })
    },
    // swiper 有变化时调用
    changeTap(e) {
        // console.log("changeTap_current=" + e.detail.current);
        console.log("[app] current:" + e.detail.current);
        this.setData({
            tap: e.detail.current
        })
        if (e.detail.current == 1) {
            if (this.data.recommend_init) {
                // console.log("recommend_init:true");
            } else {
                this.HGappheadportraitframeOrderBy()
                this.setData({
                    recommend_init: true
                })
            }

        } else if (e.detail.current == 2) {
            if (this.data.square_init) {
                // console.log("square_init:true");
            } else {
                this.HGappheadportraitframeWhere({
                    whereNum: 2,
                    skip: this.data.square_skip
                })
                this.setData({
                    square_init: true
                })
            }

        } else if (e.detail.current == 3) {
            if (this.data.circular_init) {
                // console.log("circular_init:true");
            } else {
                this.HGappheadportraitframeWhere({
                    whereNum: 3,
                    skip: this.data.circular_skip
                })
                this.setData({
                    circular_init: true
                })
            }

        } else if (e.detail.current == 4) {
            if (this.data.gif_init) {
                // console.log("gif_init:true");
            } else {
                this.HGappheadportraitframeWhere({
                    whereNum: 4,
                    skip: this.data.gif_skip
                })
                this.setData({
                    gif_init: true
                })
            }

        }
    },
    /** wxml 公用 **/
    // 搜索
    bindselectresult(e) {
        console.log("[app] 搜索");
        console.log(e.detail);
        wx.showLoading({
            title: '搜索中...',
        })
        wx.navigateTo({
            url: "/pages/headPortraitFrame/search/search?search=" + e.detail
        }).finally(res => {
            wx.hideLoading()
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
                all_advertising_img: res.result,
                recommend_advertising_img: res.result,
                square_advertising_img: res.result,
                circular_advertising_img: res.result,
                gif_advertising_img: res.result,
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
    // 点击回到顶部
    scrollTop() {
        const tap = this.data.tap
        if (tap == 0) {
            this.setData({
                all_scrollTop: 0
            })
        } else if (tap == 1) {
            this.setData({
                recommend_scrollTop: 0
            })
        } else if (tap == 2) {
            this.setData({
                square_scrollTop: 0
            })
        } else if (tap == 3) {
            this.setData({
                circular_scrollTop: 0
            })
        } else if (tap == 4) {
            this.setData({
                gif_scrollTop: 0
            })
        }
        console.log("[app] 点击回到顶部：" + this.data.tap);
    },
    // 前往详情页
    goDetails(e) {
        // console.log(e.target.dataset.data);
        console.log("[app] 前往详情页");
        const name = e.target.dataset.data.name;
        const original = e.target.dataset.data.original;
        const square = e.target.dataset.data.square;
        const gif = e.target.dataset.data.gif;
        const browse = e.target.dataset.data.browse;
        const collection = e.target.dataset.data.collection;
        const use = e.target.dataset.data.use;
        const _id = e.target.dataset.data._id;
        const _createTime = e.target.dataset.data._createTime;
        const _updateTime = e.target.dataset.data._updateTime;
        wx.navigateTo({
            url: '/pages/headPortraitFrame/details/details?' +
                '&name=' + name +
                '&original=' + original +
                '&square=' + square +
                '&gif=' + gif +
                '&browse=' + browse +
                '&collection=' + collection +
                '&use=' + use +
                '&_id=' + _id +
                '&_createTime=' + _createTime +
                '&_updateTime=' + _updateTime
        })
    },
    /** all.wxml **/
    // 获取数据
    HGappheadportraitframe() {
        if (this.data.allloading == false) {
            if (this.data.allEnd) {} else {
                this.setData({
                    allloading: true
                })
                wx.cloud.callFunction({
                    name: "HGappheadportraitframe",
                    data: {
                        limit: this.data.limit,
                        skip: this.data.skip
                    }
                }).then(res => {
                    // console.log(res);
                    if (res.result.length == 0) {
                        this.setData({
                            allloading: false
                        })
                    } else {
                        const newArray = [{
                            array: res.result
                        }]
                        const allHPF = [...this.data.allHPF, ...newArray]
                        this.setData({
                            allHPF: allHPF,
                            skip: this.data.skip + res.result.length,
                            allloading: false
                        })
                    }
                    if (res.result.length < this.data.limit) {
                        this.setData({
                            allEnd: true
                        })
                    }
                    console.log("[app] all.wxml获取数据" + res.result.length + "条" + " limit:" + this.data.limit);
                })
            }
        }

    },
    /** recommend.wxml **/
    // 获取推荐列表数据
    HGappheadportraitframeOrderBy() {
        if (this.data.recommend_loading == false) {
            if (this.data.recommend_End) {
                // console.log("recommend_End");
            } else {
                // console.log(this.setData.recommend_End);
                this.setData({
                    recommend_loading: true
                })
                wx.cloud.callFunction({
                    name: "HGappheadportraitframeOrderBy",
                    data: {
                        limit: this.data.limit,
                        skip: this.data.recommend_skip
                    }
                }).then(res => {
                    // console.log(res);
                    if (res.result.length == 0) {
                        this.setData({
                            recommend_loading: false
                        })
                    } else {
                        const newArray = [{
                            array: res.result
                        }]
                        const recommend_HPF = [...this.data.recommend_HPF, ...newArray]
                        this.setData({
                            recommend_HPF: recommend_HPF,
                            recommend_skip: this.data.recommend_skip + res.result.length,
                            recommend_loading: false
                        })
                    }
                    if (res.result.length < this.data.limit) {
                        // console.log(res.result.length, this.data.limit);
                        this.setData({
                            recommend_End: true
                        })
                    }
                    console.log("[app] recom.wxml获取数据" + res.result.length + "条");
                })
            }
        }

    },
    /** square、square、gif .wxml **/
    // 获取数据
    HGappheadportraitframeWhereLoad(e) {
        // console.log(e.target.dataset.wherenum);
        this.HGappheadportraitframeWhere({
            whereNum: e.target.dataset.wherenum,
        })
    },
    // 按条件获取
    HGappheadportraitframeWhere(e) {
        // console.log(e.whereNum, e.skip);
        if (e.whereNum == 2) {
            if (this.data.square_loading == false) {
                if (this.data.square_End) {} else {
                    this.setData({
                        square_loading: true
                    })
                    wx.cloud.callFunction({
                        name: "HGappheadportraitframeWhere",
                        data: {
                            where: {
                                square: true
                            },
                            limit: this.data.limit,
                            skip: this.data.square_skip
                        }
                    }).then(res => {
                        // console.log(res);
                        if (res.result.length == 0) {
                            this.setData({
                                square_loading: false
                            })
                        } else {
                            const newArray = [{
                                array: res.result
                            }]
                            const square_HPF = [...this.data.square_HPF, ...newArray]
                            this.setData({
                                square_HPF: square_HPF,
                                square_skip: this.data.square_skip + res.result.length,
                                square_loading: false
                            })
                            // console.log(this.data.square_HPF);
                        }
                        if (res.result.length < this.data.limit) {
                            this.setData({
                                square_End: true
                            })
                        }
                        console.log("[app] square.wxml获取数据" + res.result.length + "条");
                    })
                }
            }


        } else if (e.whereNum == 3) {

            if (this.data.circular_loading == false) {
                if (this.data.circular_End) {} else {
                    this.setData({
                        circular_loading: true
                    })
                    wx.cloud.callFunction({
                        name: "HGappheadportraitframeWhere",
                        data: {
                            where: {
                                square: false
                            },
                            limit: this.data.limit,
                            skip: this.data.circular_skip
                        }
                    }).then(res => {
                        // console.log(res);
                        if (res.result.length == 0) {
                            this.setData({
                                circular_loading: false
                            })
                        } else {
                            const newArray = [{
                                array: res.result
                            }]
                            const circular_HPF = [...this.data.circular_HPF, ...newArray]
                            this.setData({
                                circular_HPF: circular_HPF,
                                circular_skip: this.data.circular_skip + res.result.length,
                                circular_loading: false
                            })
                            // console.log(this.data.circular_HPF);
                        }
                        if (res.result.length < this.data.limit) {
                            this.setData({
                                circular_End: true
                            })
                        }
                        console.log("[app] circular.wxml获取数据" + res.result.length + "条");
                    })
                }
            }
        } else if (e.whereNum == 4) {
            if (this.data.gif_loading == false) {
                if (this.data.gif_End) {} else {
                    this.setData({
                        gif_loading: true
                    })
                    wx.cloud.callFunction({
                        name: "HGappheadportraitframeWhere",
                        data: {
                            where: {
                                gif: true
                            },
                            limit: this.data.limit,
                            skip: this.data.gif_skip
                        }
                    }).then(res => {
                        // console.log(res);
                        if (res.result.length == 0) {
                            this.setData({
                                gif_loading: false
                            })
                        } else {
                            const newArray = [{
                                array: res.result
                            }]
                            const gif_HPF = [...this.data.gif_HPF, ...newArray]
                            this.setData({
                                gif_HPF: gif_HPF,
                                gif_skip: this.data.gif_skip + res.result.length,
                                gif_loading: false
                            })
                            // console.log(this.data.gif_HPF);
                        }
                        if (res.result.length < this.data.limit) {
                            this.setData({
                                gif_End: true
                            })
                        }
                        console.log("[app] gif.wxml获取数据" + res.result.length + "条");
                    })
                }
            }
        }

    },

    /**********************************处理bug********************************************/

    //--------------生命周期---------------------//
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log("onLoad!!!");
        const limit = Math.round(app.globalData.windowHeight / (app.globalData.windowWidth / 3)) * 3; //每次获取18条
        this.setData({
            limit
        })
        // 加载all.wxml数据
        this.HGappheadportraitframe()
        // 加载广告
        this.getAdvertising_img()
        // console.log(wx.getSystemInfoSync());
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