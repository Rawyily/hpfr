// pages/HeadPortrait/HeadPortrait.js
var ymdshms = require('../../../utils/ymdshms.js')
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        /**wxml 公用*/
        MenuTop:app.globalData.MenuTop,
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
        limit: Math.round(app.globalData.windowHeight / (app.globalData.windowWidth / 3)) * 3,

        /**all.wxml*/
        all: [],
        all_advertising_img: [],
        all_skip: 0,
        all_loading: false,
        all_End: false,
        all_scrollTop: undefined,


        /**classify.wxml*/
        classifyImgUrl: [],
        classify_init: false,
        classify_scrollTop: undefined,

        /**gather.wxml */
        gather: [],
        gather_advertising_img: [],
        gather_skip: 0,
        gather_loading: false,
        gather_End: false,
        gather_init: false,
        gather_scrollTop: undefined,
        gather_limit: Math.round(app.globalData.windowHeight / (app.globalData.windowWidth / 3)),
        /**keywords.wxml*/

        keywords: [],
        keywords_advertising_img: [123],
        keywords_skip: 0,
        keywords_loading: false,
        keywords_End: false,
        keywords_init: false,
        keywords_limit: 100,

        /**meme*/
        meme: [],
        meme_advertising_img: [],
        meme_skip: 0,
        meme_loading: false,
        meme_End: false,
        meme_init: false,
        meme_scrollTop: undefined,

        /*********************************/
        swiperHeight: app.globalData.windowHeight - app.globalData.MenuBottom - (app.globalData.windowWidth / 750 * 70)
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
    // swiper 有变化时调用(初始化)
    changeTap(e) {
        // console.log("changeTap_current=" + e.detail.current);
        console.log("[app] current:" + e.detail.current);
        this.setData({
            tap: e.detail.current
        })
        if (e.detail.current == 1) {
            if (this.data.classify_init == false) {
                this.HGsystemheadportraitclassifyImages()
                this.setData({
                    classify_init: true
                })
            }

        } else if (e.detail.current == 2) {
            if (this.data.gather_init == false) {
                this.HGappheadportraitgather()
                this.setData({
                    gather_init: true
                })
            }
        } else if (e.detail.current == 3) {
            if (this.data.keywords_init == false) {
                this.HGappheadportraitkeywords()
                this.setData({
                    keywords_init: true
                })
            }
        } else if (e.detail.current == 4) {
            if (this.data.meme_init == false) {
                this.getmeme()
                this.setData({
                    meme_init: true
                })
            }
        }
    },
    /** wxml 公用 **/
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
                keywords_advertising_img: res.result,
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
    // 点击回到顶部
    scrollTop() {
        const tap = this.data.tap
        if (tap == 0) {
            this.setData({
                all_scrollTop: 0
            })
        } else if (tap == 1) {
            this.setData({
                classify_scrollTop: 0
            })
        } else if (tap == 2) {
            this.setData({
                gather_scrollTop: 0
            })
        } else if (tap == 3) {
            this.setData({
                keywords_scrollTop: 0
            })
        } else if (tap == 4) {
            this.setData({
                meme_scrollTop: 0
            })
        }
        console.log("[app] 点击回到顶部：" + this.data.tap);
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
    // 搜索
    bindselectresult(e) {
        console.log("[app] 搜索");
        console.log(e.detail);
        const search = e.detail
        wx.showLoading({
            title: '搜索中...',
        })
        wx.navigateTo({
            url: "/pages/headPortrait/search/search?search=" + search
        }).finally(res => {
            wx.hideLoading()
        })
    },
    // --------------------------------------------------------------------------------------------------
    /** all.wxml **/
    // 获取数据
    HGappheadPortrait() {
        if (this.data.all_loading == false && this.data.all_End == false) {
            this.setData({
                all_loading: true
            })
            wx.cloud.callFunction({
                name: "HGappheadPortrait",
                data: {
                    limit: this.data.limit,
                    skip: this.data.all_skip,
                    where: undefined,
                    type: "all",
                }
            }).then(res => {
                this.setData({
                    all: [...this.data.all, ...[{
                        array: res.result
                    }]],
                    skip: this.data.all_skip + res.result.length,
                })

                if (res.result.length < this.data.limit) {
                    this.setData({
                        all_End: true
                    })
                }
                console.log("[app] all.wxml获取数据" + res.result.length + "条" + " limit:" + this.data.limit);
            }).finally(res => {
                this.setData({
                    all_loading: false
                })
            })
        }
    },
    /** classify.wxml*/
    HGsystemheadportraitclassifyImages() {
        wx.cloud.callFunction({
            name: "HGappheadportraitclassifyImages"
        }).then(res => {
            console.log(res);
            this.setData({
                classifyImgUrl: res.result
            })
        })
    },
    classifyTap(e) {
        console.log(e.currentTarget.dataset.name);
        wx.navigateTo({
            url: "/pages/headPortrait/classify/classify" + "?name=" + e.currentTarget.dataset.name
        })
    },
    /** gather.wxml*/
    HGappheadportraitgather() {
        console.log("gather");
        console.log(this.data.gather_limit, this.data.gather_skip);
        if (this.data.gather_loading == false && this.data.gather_End == false) {
            this.setData({
                gather_loading: true
            })
            wx.cloud.callFunction({
                name: "HGappheadportraitgather",
                data: {
                    skip: this.data.gather_skip,
                    limit: this.data.gather_limit
                }
            }).then(res => {
                console.log(res.result);
                var array = res.result;
                for (let index = 0; index < array.length; index++) {
                    array[index]._updateTime = ymdshms(array[index]._updateTime)[0]
                }
                this.setData({
                    gather: [...this.data.gather, ...[{
                        array
                    }]],
                    gather_skip: this.data.gather_skip + res.result.length
                })
                if (res.result.length < this.data.gather_limit) {
                    this.setData({
                        gather_End: true
                    })
                }
                console.log(this.data.gather);
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
    /** keywords.wxml */
    HGappheadportraitkeywords() {
        if (this.data.keywords_loading == false && this.data.keywords_End == false) {
            this.setData({
                keywords_loading: true
            })
            wx.cloud.callFunction({
                name: "HGappheadportraitkeywords",
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
                        keywords_End: true
                    })
                }
            }).finally(res => {
                this.setData({
                    keywords_loading: false
                })
            })
        }
    },
    go_keywords(e) {
        console.log(e.currentTarget.dataset);
        const index = e.currentTarget.dataset.index
        const i = e.currentTarget.dataset.findex
        wx.navigateTo({
            url: "/pages/headPortrait/keywords/keywords?keyword=" + e.currentTarget.dataset.data.keyword,
        }).then(res => {
            wx.cloud.callFunction({
                name: "HSappheadportraitkeywords",
                data: {
                    _id: e.currentTarget.dataset.data._id
                }
            }).then(res => {
                let keywords = this.data.keywords
                console.log(index);
                keywords[i].array[index].sum = keywords[i].array[index].sum + 1
                this.setData({
                    keywords
                })
            })
        })
    },
    getmeme() {
        if (this.data.meme_loading == false && this.data.meme_End == false) {
            this.setData({
                meme_loading: true
            })
            wx.cloud.callFunction({
                name: "HGappheadPortrait",
                data: {
                    limit: this.data.limit,
                    skip: this.data.meme_skip,
                    where: undefined,
                    type: "classify",
                    name: "表情包"
                }
            }).then(res => {
                console.log(res);
                console.log(res.result.length);
                this.setData({
                    meme: [...this.data.meme, ...[{
                        array: res.result
                    }]],
                    meme_skip: this.data.meme_skip + res.result.length,
                })
                if (res.result.length < this.data.limit) {
                    this.setData({
                        meme_End: true
                    })
                }
                console.log("[app] all.wxml获取数据" + res.result.length + "条" + " limit:" + this.data.limit);
            }).finally(res => {
                this.setData({
                    meme_loading: false
                })
            })

        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log("onLoad!!!");
        // 加载all.wxml数据
        this.HGappheadPortrait()
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