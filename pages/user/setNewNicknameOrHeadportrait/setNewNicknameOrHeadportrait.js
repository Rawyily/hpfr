// pages/user/setNewNicknameOrHeadportrait/setNewNicknameOrHeadportrait.js 
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        item_id: 1,
        avatarUrl: undefined,
        theme: wx.getSystemInfoSync().theme,
        MenuBottom: app.globalData.MenuBottom,
        name: "请输入昵称"
    },
    swiperchange(e) {
        console.log(e.detail.current);
        if (e.detail.current == 0) {
            wx.navigateBack({
                delta: -1,
            })
        }
    },
    onChooseAvatar(e) {
        const {
            avatarUrl
        } = e.detail
        this.setData({
            avatarUrl,
        })
        console.log(avatarUrl);
    },
    bindconfirm(e) {
        const name = e.detail.value
        console.log(name);
        this.setData({
            name: name
        })
    },

    save() {
        if (this.data.avatarUrl == undefined) {
            wx.showToast({
                title: '没有头像',
                icon: "error"
            })
        } else {
            wx.showLoading({
                title: '请稍等...',
            })
            console.log(this.data.name, this.data.avatarUrl);
            const nickname = this.data.name
            const url = this.data.avatarUrl
            const fs = wx.getFileSystemManager()
            fs.readFile({
                filePath: this.data.avatarUrl,
                encoding: 'base64',
                success(res) {
                    // console.log(res.data)
                    const file = res.data
                    wx.cloud.callFunction({
                        name: "HUuserdataheadportraitFile",
                        data: {
                            nickname: nickname,
                            file: file,
                            url: url,
                            openid: app.globalData.user_id
                        }
                    }).then(
                        res => {
                            console.log(res);
                            wx.showToast({
                                title: '成功',
                                icon: "success"
                            })
                            app.globalData.nickname = nickname
                            app.globalData.headportrait = url
                        }

                    ).catch(err => {
                        wx.showToast({
                            title: '错误',
                            icon: "error"
                        })
                    })
                },
                fail(res) {
                    console.error(res)
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.onThemeChange((result) => {
            this.setData({
                theme: result.theme
            })
        })
        console.log(options);
        this.setData({
            avatarUrl: options.avatarUrl,
            name: options.name
        })
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