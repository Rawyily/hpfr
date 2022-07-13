// pages/home/set_indexvideo_open/set_indexvideo_open.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item_id: 1,
        button: false,
        MenuHeight:app.globalData.MenuHeight,
        MenuLeft:app.globalData.MenuLeft,
        MenuTop:app.globalData.MenuTop
    },
    swiperchange(e) {
        const current = e.detail.current
        console.log(current);
        if (current == 0) {
            wx.navigateBack({
                delta: -1,
            })
        } else if (current == 2) {
            wx.navigateTo({
                url: '/pages/index/index',
            })
            this.setData({
                item_id: 1
            })
        }

    },
    button() {
        app.ButtonsAudio()
        wx.getStorage({
            key: "indexvideo",
        }).then(res => {
            const data = JSON.parse(res.data)
            console.log(data);
            wx.setStorage({
                key: "indexvideo",
                data: !data
            }).then(res => {
                console.log(res);
                this.setData({
                    button: !data
                })
                wx.getStorage({
                    key: "indexvideo",
                }).then(res => {
                    console.log(res.data);
                })
            }).catch(err => {
                wx.showToast({
                    title: '出错了',
                    icon: "error"
                })
            })

        }).catch(err => {
            wx.showToast({
                title: '出错了',
                icon: "error"
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.getStorage({
            key: "indexvideo",
        }).then(res => {
            console.log(res.data);
            this.setData({
                button: JSON.parse(res.data)
            })
        }).catch(err=>{
            wx.setStorage({
                key: "indexvideo",
                data: false
            })
            this.setData({
                button: false
            })
            wx.showToast({
              title:"发生错误,已重置为关闭",
              icon:"none"
            })
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