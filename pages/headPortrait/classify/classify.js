// pages/headPortrait/classify/classify.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        limit: Math.round(app.globalData.windowHeight / (app.globalData.windowWidth / 3)) * 3,
        skip: 0,
        classify: undefined,
        array: [],
        MenuTop: app.globalData.MenuTop,
        MenuBottom: app.globalData.MenuBottom,
        MenuLeft: app.globalData.MenuLeft,
        MenuHeight: app.globalData.MenuHeight,
        windowHeight: undefined,
        loading: false,
        End: false,
        scrollTop: undefined,
        binddragend: true,
        binddragging: false,
        advertising_img:[],
    },
    // 获取数据
    HGappheadPortrait(e) {
        this.setData({
            loading: true
        })
        console.log(e);
        wx.cloud.callFunction({
            name: "HGappheadPortrait",
            data: {
                limit: this.data.limit,
                skip: this.data.skip,
                name: e,
                type: "classify"
            }
        }).then(res => {
            console.log(res.result);
            console.log(this.data.limit, this.data.skip, this.data.classify);
            // var data = res.result
            // for (let i = 0; i < 5; i++) {
            //     data = [...data, ...data]
            // }
            const newArray = [{
                array: res.result
            }]
            const array = [...this.data.array, ...newArray]
            this.setData({
                array,
                skip: this.data.skip + res.result.length,
                loading: false
            })
            if (res.result.length < this.data.limit) {
                this.setData({
                    End: true
                })
            }
            console.log(this.data.array);
        })
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
        console.log(this.data.loading == false && this.data.End == false);
        if (this.data.loading == false && this.data.End == false) {
            const name = this.data.classify
            this.HGappheadPortrait(name)
        }
    },
    // 点击顶部返回顶部
    scrollTop() {
        this.setData({
            scrollTop: 0
        })
    },
    // 开始滑动
    binddragstart(e) {
        console.log("滑动开始");
        this.setData({
            binddragend: false,
            binddragging: true
        })
    },
    // 滑动中
    binddragging(e) {
        console.log("滑动ing");
    },
    // 滑动结束
    binddragend(e) {
        console.log("滑动结束");
        this.setData({
            binddragging: false
        })
        setTimeout(() => {
            if (this.data.binddragging == false) {
                this.setData({
                    binddragend: true,
                })
            }
        }, 2500)

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
    goDetails(e){
        // console.log(e);
        const data = e.currentTarget.dataset.data
        // console.log(data);
        const dataToString = JSON.stringify(data)
        // console.log(dataToString);
        wx.navigateTo({
        url: "/pages/headPortrait/details/details"+
        "?data="+dataToString
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options);
        // 获取数据
        this.HGappheadPortrait(options.name)
        // 设置标题
        this.setData({
            classify: options.name
        })
        // 获取广告
        this.getAdvertising_img()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        // 设置scrollview高度
        const that = this
        wx.getSystemInfo({
            success(res) {
                console.log(res.windowHeight)
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