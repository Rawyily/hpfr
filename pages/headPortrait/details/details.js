// pages/HeadPortrait_s/details/details.js
var ymdshms = require('../../../utils/ymdshms.js')
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        MenuHeight: app.globalData.MenuHeight,
        MenuTop: app.globalData.MenuTop,
        windowWidth: app.globalData.windowWidth,

        warning_first: undefined,
        warning_second: undefined,

        data: undefined,


        collectioned: false,
        collectionIconType: "outline",
        collectionOk: false,

        uABC_lastTimeStamp: undefined,
        uABCed_lastTimeStamp: false,

        nameshow: true,
        createTime: undefined,

        meme: false,
    },
    /**************** init  ***************************/
    // 按传入的值操作浏览 收藏 生成器使用 下载 的值
    HSappheadPortraitDocInc(e) {
        // console.log(e);
        wx.cloud.callFunction({
            name: "HSappheadPortraitDocInc",
            data: {
                type: e,
                _id: this.data.data._id
            }
        }).then(res => {
            console.log(res);
            var data = this.data.data
            if (e == "addbrowse") {
                data.browse = data.browse + 1
            } else if (e == "addcollection") {
                data.collection = data.collection + 1
            } else if (e == "cancelcollection") {
                data.collection = data.collection - 1
            } else if (e == "addcreate") {
                data.create = data.create + 1
            } else if (e == "adddownload") {
                data.download = data.download + 1
            }
            this.setData({
                data: data
            })
        })
        console.log("[app] " + e);
    },
    // 查询是否收藏
    checkCollectionResults(e) {
        console.log(e);
        console.log("查询是否收藏");
        wx.cloud.callFunction({
            name: "HGuserheadPortraitarray",
            data: {
                type: "check",
                openid: app.globalData.openid,
                _id: e
            }
        }).then(res => {
            console.log(res);
            if (res.result > 0) {
                // var data = this.data.data
                // data.collection = data.collection + 1
                this.setData({
                    collectioned: true,
                    collectionIconType: "field",
                    // data
                })
            }
        }).catch(err => {
            // console.log(err);
        })
    },
    /***************************** 事件 *********************************/
    //左滑返回
    callback(e) {
        wx.navigateBack({
            delta: -1,
        })
        console.log("[app] 请求返回上一页面");
    },
    // 预览
    previewImage(e) {
        console.log("[app] 点击预览图片");
        wx.previewImage({
            current: this.data.data.original, // 当前显示图片的http链接
            urls: [this.data.data.original] // 需要预览的图片http链接列表
        })
    },
    // 点击收藏
    collection(e) {
        console.log(this.data.collectioned);
        if (this.data.collectioned) {
            this.setData({
                collectionOk: false
            })
            wx.cloud.callFunction({
                name: "HSuserheadPortraitarray",
                data: {
                    openid: app.globalData.openid,
                    type: "cancelcollection",
                    hp_id: this.data.data._id
                }
            }).then(res => {
                this.HSappheadPortraitDocInc("cancelcollection")
                this.setData({
                    collectioned: false,
                    collectionIconType: "outline"
                })
                wx.showToast({
                    title: '已取消收藏',
                    icon: "none",
                    duration: 1200
                })
            })
            if (this.data.meme) {
                wx.cloud.callFunction({
                    name: "HSuserheadPortraitarray",
                    data: {
                        openid: app.globalData.openid,
                        type: "cancelmeme",
                        hp_id: this.data.data._id
                    }
                })
            }
        } else {
            wx.cloud.callFunction({
                name: "HSuserheadPortraitarray",
                data: {
                    openid: app.globalData.openid,
                    type: "addcollection",
                    hp_id: this.data.data._id
                }
            }).then(res => {
                this.HSappheadPortraitDocInc("addcollection")
                this.setData({
                    collectioned: true,
                    collectionIconType: "field"
                })
                this.collectionOk()
            })
            if (this.data.meme) {
                wx.cloud.callFunction({
                    name: "HSuserheadPortraitarray",
                    data: {
                        openid: app.globalData.openid,
                        type: "addmeme",
                        hp_id: this.data.data._id
                    }
                })
            }
        }
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
            url: "/pages/user/collectionSum_hp/collectionSum_hp"
        })
    },
    // 添加到生成器
    addCanvas() {
        wx.showLoading({
            title: '加载中',
            mask: true
        }).then(res => {
            wx.getImageInfo({
                src: this.data.data.original,
            }).then(res => {
                console.log(res);
                app.globalData.createHeadPortraitWxml_HeadPortraitimgSrc = res.path;
                wx.hideLoading({
                    success: (res) => {
                        wx.navigateTo({
                            url: "/pages/home/createHeadPortrait/createHeadPortrait",
                        })
                    },
                })
                // 修改create数据
                this.HSappheadPortraitDocInc("addcreate")
            })
        }).catch(err => {
            wx.hideLoading({
                success: (res) => {},
            })
        }).finally(res => {
            console.log("[app] 添加头像到生成器");
        })
    },
    // 下载
    download() {
        wx.showLoading({
            title: '准备中...',
        })
        wx.getImageInfo({
            src: this.data.data.original,
        }).then(res => {
            console.log(res);
            wx.hideLoading({
                success: (res) => {},
            })
            wx.saveImageToPhotosAlbum({
                filePath: res.path,
            })
            this.HSappheadPortraitDocInc("adddownload")
        })

    },
    // 用户中心使用
    uABC(e) {
        // console.log(e.timeStamp);
        const lastTimeStamp = this.data.uABC_lastTimeStamp
        const timeStamp = e.timeStamp
        this.setData({
            uABC_lastTimeStamp: timeStamp
        })
        if (timeStamp - lastTimeStamp < 350) {
            // console.log("双击");
            wx.showLoading({
                title: '正在更新...',
            })
            wx.cloud.callFunction({
                name: "HSuserdata",
                data: {
                    _id: app.globalData.user_id,
                    data: {
                        headportrait: this.data.data.original
                    }
                }
            }).then(res => {
                wx.showToast({
                    title: '已使用',
                    icon: "none"
                })
                this.upappheadportrait()
            }).catch(err => {
                wx.showToast({
                    title: '出错了',
                    icon: "error"
                })
            })

        }
        if (this.data.uABCed_lastTimeStamp == false) {
            wx.showToast({
                title: '双击使用',
                icon: "none"
            })
            this.setData({
                uABCed_lastTimeStamp: true
            })
        }
    },
    // 更新app内使用的头像框
    upappheadportrait() {
        app.globalData.headportrait = this.data.data.original;
    },
    // 点击关键词搜索
    tpaKeyWordsToSearch(e) {
        wx.showLoading({
          title: '正在跳转...',
        })
        console.log("[app] 点击关键词搜索");
        console.log(e);
        const search = e.currentTarget.dataset.search
        wx.navigateTo({
            url: "/pages/headPortrait/search/search?search=" + search
        }).finally(res => {
            wx.hideLoading()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log("[app] 加载资料");
        // 头像数据储存到data的data
        const data = JSON.parse(options.data)
        console.log(data);
        this.setData({
            data,
            // 处理时间戳
            createTime: ymdshms(data._createTime)[0]
        })
        // 是否显示名字
        if (options.name == " ") {
            this.setData({
                nameshow: false
            })
        }
        // 警告
        this.setData({
            warning_first: undefined,
            warning_second: undefined
        })
        // 添加浏览量
        this.HSappheadPortraitDocInc("addbrowse")

        // 查询是否收藏
        this.checkCollectionResults(data._id)

        // 是否是表情包
        if (data.classify.includes("表情包") | data.keywords.includes("表情包")) {
            this.setData({
                meme: true
            })
        }
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