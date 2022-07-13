// pages/headPortraitFrame/search/search.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item_id: 1,
        MenuBottom: app.globalData.MenuBottom,
        search: "请输入搜索的关键词",
        searcharray: [],
        limit: Math.round(app.globalData.windowHeight / (app.globalData.windowWidth / 3)) * 3,
        skip: 0,
        loading: false,
        End: false,
        scrollHeight: undefined,
        scrollTop:0,
        advertising_img:[]
    },
    swiperchange(e) {
        console.log(e.detail.current);
        if (e.detail.current == 0) {
            wx.navigateBack({
                delta: -1,
            })
        }
    },
    // 搜索框确认
    bindsearch(e) {
        console.log("[app] 搜索框搜索" + e.detail);
        const new_search = e.detail;
        const last_seach = this.data.search
        this.setData({
            search:new_search,
            skip:0,
            searcharray:[]
        })
        // 禁止重复搜索
        if (new_search == last_seach) {
            wx.showToast({
                title: '不能重复搜索',
                icon: "none"
            })
        } else {
            this.setData({
                End: false
            })
            this.HGappheadportraitframearraySearch(new_search)
        }
    },
    search(e) {
        this.setData({
            search:e,
        })
        wx.showLoading({
            title: '搜索中...',
        })
        if (this.data.loading == false && this.data.End == false) {
            this.HGappheadportraitframearraySearch(e)
        }

    },

    bindscrolltolower() {
        if (this.data.End == false) {
            const e = this.data.search
            this.HGappheadportraitframearraySearch(e)
        }

    },
    HGappheadportraitframearraySearch(e) {
        if (this.data.loading == false) {
            this.setData({
                loading: true
            })
            const limit = this.data.limit
            const skip = this.data.skip
            const search = e

            wx.cloud.callFunction({
                name: "HGappheadportraitframearraySearch",
                data: {
                    limit,
                    skip,
                    search
                }
            }).then(res => {
                console.log(res.result);
                if (res.result.length > 0) {
                    wx.hideLoading()
                    const data_array = this.data.searcharray
                    const new_array = [{
                        array: res.result
                    }]
                    const array = [...data_array, ...new_array]
                    this.setData({
                        searcharray: array,
                        skip:skip+res.result.length
                    })
                } else {
                    if (this.data.searcharray.length == 0) {
                        wx.hideLoading()
                        wx.showToast({
                            title: '搜索结果为空',
                            icon: "none",
                            duration:2000
                        })
                    }

                }
                if (res.result.length < limit) {
                    this.setData({
                        End: true
                    })
                }
            }).catch(err => {
                wx.hideLoading()
                wx.showToast({
                    title: '出错了',
                    icon: "error"
                })
            }).finally(res => {
                this.setData({
                    loading: false
                })
                console.log(limit,skip,search);
            })
        }

    },
    scrollTop(){
        this.setData({
            scrollTop:0
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
     // 预览
     previewImage(e) {
        console.log("[app] 预览");
        // console.log(e.target.dataset.url);
        wx.previewImage({
            current: e.target.dataset.url, // 当前显示图片的http链接
            urls: [e.target.dataset.url] // 需要预览的图片http链接列表
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log("[app] 开始搜索" + options.search);
        this.search(options.search)
        wx.getSystemInfo({
            success: (result) => {
                const scrollHeight = result.windowHeight - app.globalData.MenuBottom - 60
                this.setData({
                    scrollHeight
                })
            },
        })
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