// pages/headPortrait/gather/gather.js
var ymdshms = require('../../../utils/ymdshms.js')
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

        gather: [],
        gather_init: false,
        hp: [],
        advertising_img: [],
        scrollTop: 0,
        loading: false,
        End: false,
        limit: Math.round(app.globalData.windowHeight / (app.globalData.windowWidth / 3)) * 3,
        skip: 0,

        search: undefined,
        value: undefined,
        placeholder: "请输入搜索关键词",
    },
    // 左滑返回
    swiperchange(e) {
        console.log(e.detail.current);
        if (e.detail.current == 0) {
            wx.navigateBack({
                delta: -1,
            })
        }
    },
    // 触底加载
    bindscrolltolower() {
        // console.log(this.data.loading == false && this.data.End == false);
        if (this.data.loading == false && this.data.End == false) {
            this.HGappheadPortrait(this.data.search)
        }
    },
    // 点击顶部返回顶部
    scrollTop() {
        this.setData({
            scrollTop: 0
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
                advertising_img: res.result,
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
    // 点击跳转 详情
    goDetails(e) {
        // console.log(e);
        const data = e.currentTarget.dataset.data
        // console.log(data);
        const dataToString = JSON.stringify(data)
        // console.log(dataToString);
        wx.navigateTo({
            url: "/pages/headPortrait/details/details" +
                "?data=" + dataToString
        })
    },
    // 搜索
    HGappheadPortrait(e) {
        if (this.data.loading == false && this.data.End == false) {
            this.setData({
                loading: true
            })
            console.log(this.data.skip, this.data.limit);
            wx.cloud.callFunction({
                name: "HGappheadPortrait",
                data: {
                    type: "search",
                    name: e,
                    limit: this.data.limit,
                    skip: this.data.skip
                }
            }).then(res => {
                console.log(res.result);
                if (this.data.gather_init == false) {
                    var gather = res.result[0]
                    for (let index = 0; index < gather.length; index++) {
                        gather[index]._updateTime = ymdshms(gather[index]._updateTime)[0]
                    }
                    this.setData({
                        gather,
                        gather_init: true
                    })
                }
                this.setData({
                    hp: [...this.data.hp, ...[{
                        array: res.result[1]
                    }]],
                    skip: this.data.skip + res.result.length
                })
                if (res.result[1].length < this.data.limit) {
                    this.setData({
                        End: true
                    })
                }
            }).finally(res => {
                this.setData({
                    loading: false
                })
            })
        }

    },
    // 详情
    go_gather(e) {
        console.log(e);
        const data = JSON.stringify(e.currentTarget.dataset.data)
        wx.navigateTo({
            url: "/pages/headPortrait/gather/gather?data=" + data

        })
    },
    // 搜索
    bindsearch(e) {
        wx.showLoading({
            title: '正在搜索...'
        })
        console.log(e);
        const search = e.detail
        this.setData({
            placeholder: search
        })
        wx.cloud.callFunction({
            name: "HGappheadPortrait",
            data: {
                type: "search",
                name: search,
                limit: this.data.limit,
                skip: 0
            }
        }).then(res => {
            wx.showToast({
              title: '搜索成功',
            })
            if (res.result[0].length > 0 | res.result[1].length > 0) {
                this.setData({
                    gather_init: true,
                    scrollTop: 0,
                    loading: false,
                    skip: res.result.length,
                    search,
                    value: search,
                })
                var gather = res.result[0]
                for (let index = 0; index < gather.length; index++) {
                    gather[index]._updateTime = ymdshms(gather[index]._updateTime)[0]
                }
                this.setData({
                    gather,
                    hp: [{array: res.result[1]}],
                })
                if (res.result[1].length < this.data.limit) {
                    this.setData({
                        End: true
                    })
                }
            } else {
                wx.showToast({
                    title: '搜索结果为空...'
                })
            }
            console.log(res.result);
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options.search);
        this.setData({
            search: options.search,
            placeholder: options.search
        })
        this.HGappheadPortrait(options.search)
        this.getAdvertising_img()
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