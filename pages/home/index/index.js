// pages/home/index/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 宽高
        MenuWidth: app.globalData.MenuWidth,
        MenuHeight: app.globalData.MenuHeight,
        // 四个角
        MenuTop: app.globalData.MenuTop,
        MenuRight: app.globalData.MenuRight,
        MenuBottom: app.globalData.MenuBottom,
        MenuLeft: app.globalData.MenuLeft,

        windowWidth: app.globalData.windowWidth,
        windowHeight: undefined,

        scrollView: [{
                current: 1,
                instructions: "支持生成1:1正方形的头像,可以先选择app内的头像或者上传头像,再选择app内的头像框,然后将两者添加到生成器内生成一个头像和头像框组合的新头像!注意,新头像和原头像的大小不同,因为添加了头像框在头像周围所以会显得头像小,而且目前圆形头像框不匹配正方形头像。",
                title: {
                    type: "生成器",
                    title: "头像框头像生成器",
                    secondtitle: "仅支持生成正方形带头像框的头像"
                },
                link: "/pages/home/createHeadPortrait/createHeadPortrait"
            },
            {
                current: 1 ,
                instructions: "设置页面，app初始化完成后的会播放一段大约10秒的减压小视频，可以决定是否开启，默认关闭。更换手机恢复默认设置。",
                title: {
                    type: "小视频",
                    title: "减压小视频开关",
                    secondtitle: "app加载后会播放约10秒的小视频，默认关闭"
                },
                link: "/pages/home/set_indexvideo_open/set_indexvideo_open"
            },
            {
                current: 1,
                instructions: "利用微信官方接口进行图片的压缩,不对图片的尺寸进行压缩,可以一次性压缩1~9张,仅对jpg类型100%支持。",
                title: {
                    type: "压缩器",
                    title: "图片压缩",
                    secondtitle: "对图片进行压缩,每次1~9张"
                },
                link: "/pages/home/compressed_image/compressed_image"
            },
            {
                current: 1,
                instructions: "输入有侵权内容所属内容页下方的编号,并上传9张以内的相关图片或提交500字以内的相关文字说明,确认提交侵权投诉后会进行审核,审核通过后会立即删除侵权内容并对上传侵权内容的账号进行处理。",
                title: {
                    type: "版权",
                    title: "版权相关",
                    secondtitle: "对有侵权行为的内容进行处理"
                },
                link: "/pages/home/infringement/infringement"
            },
        ],
        swiperarray: []
    },
    bindchange(e) {
        if (e.detail.current == 2) {
            this.ToLink(e.target.dataset.link)
            var scrollView = this.data.scrollView
            scrollView[e.target.dataset.idx].current = 1
            this.setData({
                scrollView
            })
        }
    },
    ToLink(link) {
        wx.navigateTo({
            url: link,
        })
        console.log("[app] 前往首页的子页面");
    },
    ArrowToLink(e) {
        this.ToLink(e.target.dataset.link)
    },
    HGapphomeswiper() {
        wx.cloud.callFunction({
            name: "HGapphomeswiper"
        }).then(res => {
            console.log(res.result.data);
            this.setData({
                swiperarray: res.result.data
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.HGapphomeswiper()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        const that = this
        wx.getSystemInfoSync({
            success(res) {
                console.log()
                app.globalData.windowHeight = res.windowHeight
                that.setData({
                    windowHeight:res.windowHeight
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