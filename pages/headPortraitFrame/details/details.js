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
        warning_squarefalse: undefined,
        warning_giftrue: undefined,
        name: undefined,
        nameshow: true,
        original: undefined,
        square: undefined,
        gif: undefined,
        browse: undefined,
        collection: undefined,
        collectioned: false,
        collectionOk: false,
        movecollection: false,
        collectionIconType: "outline",
        use: undefined,
        _id: undefined,
        _createTime: undefined,
        _updateTime: undefined,
        createTime: undefined,

        uABC_lastTimeStamp: undefined,
        uABCed_lastTimeStamp: false,
    },
    //返回
    callback(e) {
        // console.log(e);
        wx.navigateBack({
            delta: 0,
        })
        console.log("[app] 请求返回上一页面");
    },
    // 添加到生成器
    addCanvas() {
        wx.showLoading({
            title: '加载中',
            mask: true
        }).then(res => {
            wx.getImageInfo({
                src: this.data.original,
            }).then(res => {
                // console.log(res);
                app.globalData.createHeadPortraitWxml_HeadPortraitFrameimgSrc = res.path;
                wx.hideLoading({
                    success: (res) => {
                        wx.navigateTo({
                            url: "/pages/home/createHeadPortrait/createHeadPortrait",
                        })
                    },
                })
                this.use()
            })
        }).catch(err => {
            wx.hideLoading({
                success: (res) => {},
            })
        }).finally(res => {
            console.log("[app] 添加头像框到生成器");
        })

    },
    // 预览
    previewImage() {
        console.log("[app] 点击预览图片");
        wx.previewImage({
            current: this.data.original, // 当前显示图片的http链接
            urls: [this.data.original] // 需要预览的图片http链接列表
        })
    },
    // 按传入的值操作增加数值 浏览 收藏 生成器使用
    HSappheadportraitframeDocInc(e) {
        // console.log(e);
        wx.cloud.callFunction({
            name: "HSappheadportraitframeDocInc",
            data: e
        }).then(res => {
            // console.log(res);
            if (e.field == "browse") {
                this.setData({
                    browse: +this.data.browse + 1
                })
            } else if (e.field == "collection") {
                this.setData({
                    collection: +this.data.collection + 1
                })
            } else if (e.field == "use") {
                this.setData({
                    use: +this.data.use + 1
                })
            }
        })
        console.log("[app] " + e.field + "+1");
    },
    // 点击收藏 添加和取消
    collection() {
        if (this.data.collectioned) {
            if (this.data.movecollection) {
                wx.cloud.callFunction({
                    name: "HSuserheadPortraitFramearray",
                    data: {
                        openid: app.globalData.openid,
                        type: "add",
                        _id: this.data._id
                    }
                }).then(res => {
                    this.setData({
                        collection: +this.data.collection + 1,
                        movecollection: false,
                        collectionIconType: "field"
                    })
                    this.collectionOk()
                })

            } else {
                wx.cloud.callFunction({
                    name: "HSuserheadPortraitFramearray",
                    data: {
                        openid: app.globalData.openid,
                        type: "del",
                        _id: this.data._id
                    }
                }).then(res => {
                    this.setData({
                        collection: +this.data.collection - 1,
                        movecollection: true,
                        collectionIconType: "outline",
                        collectionOk: false
                    })
                    wx.showToast({
                        title: '已取消收藏',
                        icon: "none",
                        duration: 1200
                    })
                })

            }
        } else {
            wx.cloud.callFunction({
                name: "HSuserheadPortraitFramearray",
                data: {
                    openid: app.globalData.openid,
                    type: "add",
                    _id: this.data._id
                }
            }).then(res => {
                this.HSappheadportraitframeDocInc({
                    _id: this.data._id,
                    field: "collection"
                })
                this.setData({
                    collectioned: true,
                    collectionIconType: "field"
                })
                this.collectionOk()
            })
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
    // ？？？
    gomycollection() {
        // console.log(app.globalData.openid);
        wx.navigateTo({
            url:"/pages/user/collectionSum_hpf/collectionSum_hpf"
          //   +"?_id="
          //   +app.globalData.user_headportraitfrma_array_id
          //   +"&hp_src="+this.data.hp_src
          //   +"&hpf_src="+this.data.hpf_src
          //   +"&square="+this.data.hp_circular
          })
    },
    // 使用值+1
    use() {
        this.HSappheadportraitframeDocInc({
            _id: this.data._id,
            field: "use"
        })
    },
    // 查询是否收藏了
    checkCollectionResults(e) {
        // console.log(e);
        wx.cloud.callFunction({
            name: "HGuserheadPortraitFramearray",
            data: {
                type: "check",
                openid: e.openid,
                _id: e._id
            }
        }).then(res => {
            console.log(res);
            if (res.result.length > 0) {
                this.setData({
                    collectioned: true,
                    collectionIconType: "field",
                    collection: +this.data.collection + 1
                })
            }
        }).catch(err => {
            // console.log(err);
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
                title: '设置中...',
            })
            wx.cloud.callFunction({
                name: "HSuserheadPortraitFramearray",
                data: {
                    type: "upUse",
                    _id: app.globalData.user_headportraitfrma_array_id,
                    headportraitframe_id: this.data._id
                }
            }).then(res => {
                wx.showToast({
                    title: '已使用',
                    icon: "none"
                })
                this.upappheadportraitframe()
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
    upappheadportraitframe() {
        // console.log(this.data.original);
        app.globalData.headportraitframe = this.data.original;
        const obj = {
            browse: this.data.browse,
            collection: this.data.collection,
            gif: JSON.parse(this.data.gif),
            name: this.data.name,
            original: this.data.original,
            square: JSON.parse(this.data.square),
            thumbnail: this.data.original,
            use: this.data.use,
            _createTime: this.data._createTime,
            _id: this.data._id,
            _updateTime: this.data._updateTime
        }
        // console.log(obj);
        app.globalData.headportraitframeData = obj
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log("[app] 加载资料");
        // console.log(options);
        this.setData({
            name: options.name,
            original: options.original,
            square: options.square,
            gif: options.gif,
            browse: options.browse,
            collection: options.collection,
            use: options.use,
            _id: options._id,
            _createTime: options._createTime,
            _updateTime: options._updateTime,
            createTime: ymdshms(options._createTime)[0]
        })
        if (options.name == " ") {
            this.setData({
                nameshow: false
            })
        }
        // 添加浏览量
        this.HSappheadportraitframeDocInc({
            _id: options._id,
            field: "browse"
        })
        if (options.square == "false") {
            this.setData({
                warning_squarefalse: "该类型的头像框于生成器的方形头像不匹配！"
            })
        }
        if (options.gif == "true") {
            this.setData({
                warning_giftrue: "该类型的头像框添加到生成器无法保持动态！"
            })
        }
        // 检查是否已经收藏
        this.checkCollectionResults({
            openid: app.globalData.openid,
            _id: options._id
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