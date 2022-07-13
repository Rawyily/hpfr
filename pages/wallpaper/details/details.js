// pages/wallpaper/details/details.js
var ymdshms = require('../../../utils/ymdshms.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: undefined,
        createTime: undefined,
        windowWidth: app.globalData.windowWidth,
        windowHeight: undefined,
        MenuBottom: app.globalData.MenuBottom,
        iphone: undefined,
        mp_icon_star: "outline",
        mp_icon_like: "outline",
        collectionOk: false,
        icon_upbackgroundimage: undefined,
        MenuLeft: app.globalData.MenuLeft,
        MenuHeight: app.globalData.MenuHeight,
    },
    //左滑返回
    callback(e) {
        if (e.detail.current == 0) {
            wx.navigateBack({
                delta: -1,
            })
            console.log("[app] 请求返回上一页面");
        }
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
    // 下载
    download(e) {
        wx.showLoading({
            title: '正在保存...',
        })
        const url = e.target.dataset.url
        console.log(url);
        wx.getImageInfo({
            src: url,
        }).then(res => {
            console.log(res.path);
            wx.saveImageToPhotosAlbum({
                filePath: res.path,
            }).then(res => {
                this.inc("adddownload")
                let data = this.data.data
                data.download += 1
                this.setData({
                    data
                })
                wx.showToast({
                    title: '保存成功',
                })
            }).catch(err => {
                console.log(err);
                wx.showToast({
                    title: '保存图片失败',
                    icon: "error"
                })
            })
        }).catch(err => {
            console.log(err);
            wx.showToast({
                title: '保存图片失败,生成外部链接',
                icon: "none"
            }).finally(res => {
                this.downloadfile(url)
            })

        })
    },
    downloadfile(fileID) {
        wx.cloud.callFunction({
            name: "DownloadFile",
            data: {
                fileID,
                getTempFileURL: true
            }
        }).then(res => {
            console.log(res);
            wx.setClipboardData({
                data: res.result[0].tempFileURL,
                // success(res) {
                //     wx.getClipboardData({
                //         success(res) {
                //             console.log(res.data)
                //         }
                //     })
                // }
            })
        })
    },
    icon() {
        const icon = app.globalData.systemIcon
        console.log(icon);
        this.setData({
            iphone: icon[4].url
        })
    },
    inc(e) {
        // addbrowse addlike cancellike addcollection cancelcollection adddownload
        console.log(e);
        const isAcross = this.data.data.isAcross
        console.log(isAcross);
        const type = e
        wx.cloud.callFunction({
            name: "HSappwallpaperDocInc",
            data: {
                isAcross,
                type,
                _id: this.data.data._id
            }
        }).then(res => {
            console.log(res);
        })
    },
    // Browse
    browse() {
        let data = this.data.data
        data.browse += 1
        this.setData({
            data
        })
        this.inc("addbrowse")
    },
    like() {
        console.log(app.globalData.like);
        let data = this.data.data
        if (this.data.mp_icon_like == "outline") {
            const e = {
                type: true,
                _id: this.data.data._id
            }
            app.addlikeOrdel(e)
            data.like += 1
            this.setData({
                mp_icon_like: "field",
                data
            })
            this.inc("addlike")
        } else if (this.data.mp_icon_like == "field") {
            const e = {
                type: false,
                _id: this.data.data._id
            }
            app.addlikeOrdel(e)
            data.like += -1
            this.setData({
                mp_icon_like: "outline",
                data
            })
            this.inc("cancellike")
        }
    },
    collection() {
        if (this.data.mp_icon_star == "field") {
            wx.showLoading({
                title: '正在取消收藏...',
            })
            wx.cloud.callFunction({
                name: "HSuserwallpaperarray",
                data: {
                    type: "cancelcollection",
                    openid: app.globalData.openid,
                    isAcross: this.data.data.isAcross,
                    _id: this.data.data._id
                }
            }).then(res => {
                console.log(res);
                this.inc("cancelcollection")
                const data = this.data.data
                data.collection += -1
                this.setData({
                    data,
                    mp_icon_star: "outline",
                    collectionOk: false
                })
                wx.showToast({
                    title: '取消收藏成功',
                    icon: "success"
                })
            }).catch(err => {
                wx.showToast({
                    title: '取消收藏失败',
                    icon: "error"
                })
            })
        } else {
            wx.showLoading({
                title: '正在添加收藏...',
            })
            wx.cloud.callFunction({
                name: "HSuserwallpaperarray",
                data: {
                    type: "addcollection",
                    openid: app.globalData.openid,
                    isAcross: this.data.data.isAcross,
                    _id: this.data.data._id
                }
            }).then(res => {
                console.log(res);
                this.inc("addcollection")
                const data = this.data.data
                data.collection += 1
                this.setData({
                    data,
                    mp_icon_star: "field"
                })
                wx.showToast({
                    title: '添加收藏成功',
                    icon: "success"
                })
                this.collectionOk()
            }).catch(err => {
                wx.showToast({
                    title: '添加收藏失败',
                    icon: "error"
                })
            })
        }
    },
    isCollection() {
        wx.cloud.callFunction({
            name: "HGuserwallpaperarray",
            data: {
                type: "check",
                _id: this.data.data._id,
                isAcross: this.data.data.isAcross,
                openid: app.globalData.openid
            }
        }).then(res => {
            console.log(res.result);
            if (res.result > 0) {
                this.setData({
                    mp_icon_star: "field"
                })
            } else {
                this.setData({
                    mp_icon_star: "outline"
                })
            }
        })
    },
    init() {
        // 判断是否like
        const like = app.globalData.like;
        const i = like.includes(this.data.data._id)
        if (i) {
            this.setData({
                mp_icon_like: "field"
            })
        }
        // 浏览量+1
        this.browse()
        // 判断是否收藏
        this.isCollection()
    },
    // 收藏 成功和取消的弹窗
    collectionOk() {
        // console.log("collectionOk");
        this.setData({
            collectionOk: true
        })
        setTimeout(() => {
            this.setData({
                collectionOk: false
            })
        }, 2500)
    },
    // 前往我的收藏
    gomycollection() {
        wx.navigateTo({
            url: "/pages/user/collectionSum_wallpaper/collectionSum_wallpaper"
        })
    },
    // 更新个人页面的背景图
    upbackgroundimage() {
        if (app.globalData.userbackgroundimages == this.data.data.original) {
            wx.showToast({
                title: '已经使用了',
                icon: "none"
            })
        } else {
            const that = this
            wx.showLoading({
                title: '正在设置...',
            })
            wx.cloud.callFunction({
                name: "HS_user_background_images",
                data: {
                    openid: app.globalData.openid,
                    original: this.data.data.original,
                    type: "upmybackground"
                }
            }).then(res => {
                console.log(res);
                this.inc("addsetbackgroundimage")
                const data = this.data.data
                data.setbackgroundimage = data.setbackgroundimage + 1
                that.setData({
                    data
                })
                app.globalData.userbackgroundimages = this.data.data.original
                wx.showToast({
                    title: '修改背景图成功',
                })
            }).catch(err => {
                wx.showToast({
                    title: '出错了',
                    icon: "error"
                })
            })
        }
    },
    // 搜索
    TapkeyWordsToSearch(e) {
        console.log("[app] 搜索");
        console.log(e);
        const search = e.currentTarget.dataset.search
        wx.showLoading({
            title: '正在跳转...',
        })
        wx.navigateTo({
            url: "/pages/wallpaper/search/search" + "?search=" + search
        }).finally(res => {
            wx.hideLoading()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.icon()
        const data = JSON.parse(options.data)
        console.log(data);
        this.setData({
            data,
            createTime: ymdshms(data._createTime)[0]
        })
        this.init()
        const icon = app.globalData.systemIcon
        this.setData({
            icon_upbackgroundimage: icon[5].url
        })
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