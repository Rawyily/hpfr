// pages/headPortrait/gather/gather.js
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

        advertising_img: [],
        array: [],
        scrollTop: 0,
        loading: false,
        End: false,
        limit: Math.round(app.globalData.windowHeight / (app.globalData.windowWidth / 3)) * 3,
        skip: 0,

        keyword:undefined,
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
            this.HGappheadPortrait(this.data.keyword)
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
    // 
    HGappheadPortrait(e) {
        if (this.data.loading == false && this.data.End == false) {
            this.setData({
                loading: true
            })
            console.log(this.data.skip, this.data.limit);
            wx.cloud.callFunction({
                name: "HGappheadPortrait",
                data: {
                    type:"keywords",
                    name:e,
                    limit:this.data.limit,
                    skip:this.data.skip
                }
            }).then(res => {
                console.log(res);
                this.setData({
                    array: [...this.data.array, ...[{
                        array: res.result
                    }]],
                    skip:this.data.skip+res.result.length
                })
                if (res.result.length < this.data.limit) {
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options.keyword);
        this.setData({
            keyword:options.keyword
        })
        this.HGappheadPortrait(options.keyword)
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
                    windowHeight: res.windowHeight
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