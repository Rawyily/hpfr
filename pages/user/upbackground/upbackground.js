// pages/user/upbackground/upbackground.js
const app = getApp()
var ymdshms = require('../../../utils/ymdshms.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        last_background: undefined,
        now_background: undefined,
        Menu: wx.getMenuButtonBoundingClientRect(),
        SystemInfo: undefined,

        history: [],
        _updateTime: undefined,
        history_init: false,

        images1: [],
        history_skip: 0,
        images2: [],
        scrollTop: 0,
        end: false,
        saveloading: false,
        disabled: true,
        e: undefined,
        icon_clear: undefined,
        dialogShow: false,
        buttons: [{
            text: '取消'
        }, {
            text: '确定'
        }],
    },
    swiperchange(e) {
        console.log(e);
        if (e.detail.current == 0) {
            wx.navigateBack({
                delta: -1,
            })
        } else if (e.detail.current == 2 && this.data.history_init == false) {
            this.getMyHistory()
        }
    },
    getMyHistory() {
        wx.cloud.callFunction({
            name: "HGuserbackgroundimages",
            data: {
                openid: app.globalData.openid,
                mybackgrounded: true
            }
        }).then(res => {
            console.log(res);
            this.setData({
                history: res.result[0].mybackgrounded,
                _updateTime: ymdshms(res.result[0]._updateTime)[0],
                history_init: true
            })
            this.addImages2()
        })
    },
    addImages2() {
        if (this.data.end == false) {
            const history = this.data.history
            let images = history.splice(this.data.history_skip, (this.data.history_skip + 8))
            this.setData({
                images2: [...this.data.images2, ...images],
                history_skip: this.data.history_skip + images.length
            })
            if (images.length < 8) {
                this.setData({
                    end: true
                })
            }
            console.log(this.data);
        }
    },
    scrollTop() {
        this.setData({
            scrollTop: 0
        })
    },
    upimg() {
        wx.showLoading({
            title: '等待选择图片...'
        })
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            camera: 'back',
        }).then(res => {
            if (res.tempFiles[0].size > 1024 * 1024) {
                wx.showToast({
                    title: '不能大于1M',
                    icon: "error"
                })
            } else {
                wx.showLoading({
                    title: '正在检查图片...'
                })
                wx.getImageInfo({
                    src: res.tempFiles[0].tempFilePath,
                }).then(res => {
                    console.log(res);
                    if (res.height > res.width) {
                        wx.showToast({
                            title: '方向不能为竖',
                            icon: "error"
                        })
                    } else {
                        console.log(res.path);
                        const e = {
                            type: res.type,
                            path: res.path,
                            datatype: "base64"
                        }
                        this.setData({
                            e,
                            now_background: res.path,
                            disabled: false
                        })
                        wx.hideLoading({
                            success: (res) => {},
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    wx.showToast({
                        title: '出错了',
                        icon: "error"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            wx.showToast({
                title: '失败了',
                icon: "error"
            })
        })
    },
    UpFile() {
        wx.showLoading({
            title: '更新中...'
        })
        const fs = wx.getFileSystemManager()
        const {
            type,
            datatype,
            path
        } = this.data.e
        const file = fs.readFileSync(path, datatype)
        const data = {
            type,
            datatype,
            file
        }
        wx.cloud.callFunction({
            name: "UpFile",
            data
        }).then(res => {
            console.log(res.result);
            this.setData({
                now_background: res.result
            })
            wx.cloud.callFunction({
                name: "HS_user_background_images",
                data: {
                    openid: app.globalData.openid,
                    original: res.result,
                    type: "upmybackground"
                }
            }).then(res => {
                wx.showToast({
                    title: '成功'
                })
                let images1 = this.data.images1
                images1.unshift(this.data.now_background)
                app.globalData.userbackgroundimages = this.data.now_background
                this.setData({
                    images1,
                    disabled: true
                })
            })
        }).catch(err => {
            console.log(err);
        })
    },
    tapDialogButton(e) {
        console.log(e.detail.index)
        this.setData({
            dialogShow: false
        })
        if (e.detail.index == 1) {
            wx.showLoading({
                title: '清除中...'
            })
            wx.cloud.callFunction({
                name: "HS_user_background_images",
                data: {
                    openid: app.globalData.openid,
                    type: "clearmybackgrounded"
                }
            }).then(res => {
                console.log(res);
                const d = new Date()
                const time = d.getTime()
                this.setData({
                    images1: [],
                    images2: [],
                    history:[],
                    _updateTime:ymdshms(time)[0]
                })
                wx.showToast({
                    title: '已成功清空',
                })
            }).catch(res => {
                wx.showToast({
                    title: '清空失败',
                    icon: "error"
                })
            })

        }
    },
    clear() {
        const length = this.data.history.length+this.data.images1.length+this.data.images2.length
        if (length > 0) {
            this.setData({
                dialogShow: true,
            })
        } else {
            wx.showToast({
                title: '已经是空的了',
                icon: "none"
            })
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // background
        console.log(options);
        const systemicon = app.globalData.systemIcon
        const icon_clear = systemicon[6].url
        this.setData({
            last_background: options.background,
            now_background: options.background,
            icon_clear
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
        this.setData({
            SystemInfo: wx.getSystemInfoSync()
        })
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