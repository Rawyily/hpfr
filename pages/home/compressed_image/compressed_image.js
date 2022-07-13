// pages/home/compressed_image/compressed_image.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        MenuTop: app.globalData.MenuTop,
        MenuHeight: app.globalData.MenuHeight,
        MenuWidth: app.globalData.MenuWidth,
        MenuLeft: app.globalData.MenuLeft,
        currentValue: 100,
        width: app.globalData.windowWidth,
        marginleft: undefined,
        mode: "widthFix",
        src: undefined,
        src9: undefined,
        choose: undefined,
        padding: 0,
        compressLoading: false
    },
    // 滑动页面
    swiperChange(e) {
        console.log(e);
        wx.navigateBack({
            delta: -1,
        })
    },
    // 滑动滑块
    onDrag(event) {
        this.setData({
            currentValue: event.detail.value,
        });
    },
    // 点击滑块
    changeV(e) {
        this.setData({
            currentValue: e.detail
        })
    },
    // 选择图片
    choose(e) {
        console.log(e);
        wx.chooseMedia({
            mediaType:["image"]
        }).then(res => {
            console.log(res);
            // 上传单图
            if (res.tempFiles.length == 1) {
                this.setData({
                    currentValue: 100,
                    src: res.tempFiles[0].tempFilePath,
                    src9: undefined,
                    choose: res.tempFiles,
                    padding: 0,
                })
                wx.getImageInfo({
                    src: res.tempFiles[0].tempFilePath,
                }).then(res => {
                    console.log(res);
                    // 竖
                    if (res.height > res.width) {
                        const windowHeight = wx.getSystemInfoSync().windowHeight
                        const Height = windowHeight - this.data.MenuHeight - (this.data.width / 750 * 300)
                        const maxHeight = Math.round(Height * 8 / 10)
                        const width = maxHeight / res.height * res.width
                        const padding = Math.round((this.data.width - width) / 2)
                        console.log(Height, maxHeight);
                        this.setData({
                            padding
                        })
                        // 正方形
                    } else if (res.height == res.width) {
                        this.setData({
                            padding: Math.round(this.data.width / 10) - 1
                        })
                        // 横
                    } else {
                        this.setData({
                            padding: Math.round(this.data.width / 20) - 1
                        })
                    }
                })
                // 上传多张图片
            } else {
                let src9 = []
                for (let index = 0; index < res.tempFiles.length; index++) {
                    src9[index] = res.tempFiles[index].tempFilePath
                }
                this.setData({
                    currentValue: 100,
                    src: undefined,
                    src9,
                    choose: res.tempFiles,
                    padding: 0,
                })
                console.log(this.data.src9);
            }
        })
    },
    // 预览
    previewImage(e) {
        if (this.data.choose.length > 1) {
            wx.previewImage({
                current: e.currentTarget.dataset.url,
                urls: this.data.src9 // 需要预览的图片http链接列表
            })
        } else {
            wx.previewImage({
                urls: this.data.src // 需要预览的图片http链接列表
            })
        }
    },
    compress() {
        if (this.data.choose == undefined) {
            wx.showToast({
                title: '请选择需要压缩的图片',
                icon: "none"
            })
        } else {
            this.setData({
                compressLoading: true
            })
            if (this.data.choose.length == 1) {
                wx.compressImage({
                    src: this.data.choose[0].tempFilePath,
                    quality: this.data.currentValue // 压缩质量
                }).then(res => {
                    console.log(this.data.currentValue);
                    this.setData({
                        src: res.tempFilePath,
                        compressLoading: false
                    })
                    console.log(res);
                })
            } else {
                this.setData({
                    src9: []
                })
                for (let index = 0; index < this.data.choose.length; index++) {
                    wx.compressImage({
                        src: this.data.choose[index].tempFilePath,
                        quality: this.data.currentValue // 压缩质量
                    }).then(res => {
                        let src9 = this.data.src9
                        src9[index] = res.tempFilePath
                        this.setData({
                            src9
                        })
                    }).catch(err => {
                        const title = index + "压缩错误"
                        wx.showToast({
                            title,
                            icon: "error"
                        })
                    })
                    if (index == (this.data.choose.length - 1)) {
                        this.setData({
                            compressLoading: false
                        })
                    }
                }
            }
        }
    },
    save() {
        if (this.data.choose == undefined) {
            wx.showToast({
                title: '没有需要保存图片',
                icon: "none"
            })
        } else {
            if (this.data.choose.length > 1) {
                for (let index = 0; index < this.data.src9.length; index++) {
                    wx.saveImageToPhotosAlbum({
                        filePath: this.data.src9[index],
                    })
                    console.log(index);
                }
            }else{
                wx.saveImageToPhotosAlbum({
                    filePath: this.data.src,
                })
            }
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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