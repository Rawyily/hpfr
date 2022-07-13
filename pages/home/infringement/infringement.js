// pages/home/infringement/infringement.js
var ymd = require('../../../utils/ymd.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        MenuTop: app.globalData.MenuTop,
        MenuLeft: app.globalData.MenuLeft,
        MenuHeight: app.globalData.MenuHeight,
        windowWidth: app.globalData.windowWidth,
        // swiper
        item_id: 1,
        // 导航栏
        tap: 0,
        // 是否显示 提交侵权反馈 页面
        addNew: false,
        // 标题
        title: "侵权反馈记录",

        // 输入框内容_id
        value_id: undefined, //双向绑定
        last_value_id: undefined, //上一次输入成功的_id
        // 上传的图片
        chooseImg: [],
        // 文字说明
        textarea: "",
        // _id内容
        _id: null,
        _id_classify: undefined,
        // button
        button_submit: false,
        button_text: "提交",
        button_disbled: false,
        // 所有反馈 1
        // infringement: [],
        all_Infringement: [],
        all_skip: 0,
        all_limit: Math.round(app.globalData.windowHeight / (app.globalData.windowWidth / 750 * 220)) + 2,
        all_loading: false,
        all_end: false,
        all_ScrollTop: 0,
        //我的反馈
        MyInfringement: [],
        my_skip: 0,
        my_loading: false,
        my_end: false,
        my_ScrollTop: 0,
        triggered: false,
        enabled: true,
        Atriggered: false,
        Aenabled: true
    },
    // 点击跳转
    TapChangeItemID(e) {
        console.log("itemid " + e.currentTarget.dataset.itemid);
        this.setData({
            tap: e.currentTarget.dataset.itemid
        })
    },
    // 滑动页面事件
    swiperChange(e) {
        console.log(e.detail.current);
        const current = e.detail.current
        switch (current) {
            case 0:
                wx.navigateBack({
                    delta: -1,
                })
                break;
            case 1:
                this.setData({
                    tap: 0,
                    title: "所有的反馈记录"
                })
                break;
            case 2:
                this.setData({
                    tap: 1,
                    title: "我提交的反馈"
                })
                break;
            case 3:
                if (this.data.addNew == false) {
                    this.setData({
                        item_id: 2
                    })
                }
                this.setData({
                    tap: 1,
                    title: "添加新的反馈"
                })
                break;
            default:
                break;
        }
    },
    // 点击添加新的
    addNew(e) {
        console.log(e);
        this.setData({
            addNew: true,
            item_id: 3
        })
    },
    // 输入框输入后返回结果
    // 684266796299961004a57b3336a9cedd
    vanfieldConfirm() {
        console.log(this.data.infringement);
        const infringement = this.data.infringement.includes(this.data.value_id);
        if (infringement) {
            wx.showToast({
                title: '该编号已反馈过了',
                icon: "none"
            })
        } else {
            const re = /^[a-z0-9_]{32}$/;
            const bre = re.test(this.data.value_id)
            console.log(bre);
            console.log(this.data.value_id, this.data.value_id.length);
            if (this.data.value_id != this.data.last_value_id) {
                if (!bre) {
                    wx.showToast({
                        title: '请检查编号是否正确',
                        icon: "none"
                    })
                } else {
                    wx.cloud.callFunction({
                        name: "H_infringement",
                        data: {
                            check_id: this.data.value_id
                        }
                    }).then(res => {
                        this.setData({
                            last_value_id: this.data.value_id,
                        })
                        console.log(res);
                        if (res.result !== null) {
                            console.log(res.result[1][0]);
                            this.setData({
                                _id: res.result[1][0],
                                _id_classify: res.result[0],
                                button_disbled: false
                            })
                        } else {
                            wx.showToast({
                                title: '该编号是不存在的',
                                icon: 'none'
                            })
                            this.setData({
                                _id: null
                            })
                            console.log(this.data._id);
                        }
                    })
                }
            }
        }
    },
    // 输入框失去焦点
    vanfieldBlur(e) {
        this.vanfieldConfirm()
    },
    // 点击前往详情
    goDetail() {
        console.log(this.data._id_classify);
        const key = this.data._id_classify
        switch (key) {
            case "headPortrait":
                const data = JSON.stringify(this.data._id)
                wx.navigateTo({
                    url: '/pages/headPortrait/details/details?' +
                        "data=" + data
                })
                break;
            case "headPortraitFrame":
                const {
                    name, original, square, gif, browse, collection, use, _id, _createTime, _updateTime
                } = this.data._id
                wx.navigateTo({
                    url: '/pages/headPortraitFrame/details/details?' +
                        '&name=' + name +
                        '&original=' + original +
                        '&square=' + square +
                        '&gif=' + gif +
                        '&browse=' + browse +
                        '&collection=' + collection +
                        '&use=' + use +
                        '&_id=' + _id +
                        '&_createTime=' + _createTime +
                        '&_updateTime=' + _updateTime
                })
                break;
            case "wallpaper-across":
                wx.navigateTo({
                    url: "/pages/wallpaper/details/details?data=" + JSON.stringify(this.data._id),
                })
                break;
            case "wallpaper-vertical":
                wx.navigateTo({
                    url: "/pages/wallpaper/details/details?data=" + JSON.stringify(this.data._id),
                })
                break;
            default:
                break;
        }
    },
    chooseImg() {
        // 选择图片
        const count = 9 - this.data.chooseImg.length
        console.log(count);
        wx.chooseMedia({
            count,
            mediaType: ["image"],
            sizeType: ['compressed']
        }).then(res => {
            console.log(res);
            let array = [];
            let size = 0
            const maxSize = 1048576
            for (let i = 0; i < res.tempFiles.length; i++) {
                if (res.tempFiles[i].size > maxSize) {
                    size = size + 1
                } else {
                    array.push(res.tempFiles[i])
                }
            }
            this.setData({
                chooseImg: [...this.data.chooseImg, ...array]
            })
            console.log(size);
            console.log(array);
            if (size > 0) {
                wx.showToast({
                    title: "有" + size + "张添加失败",
                    icon: "none"
                })
            }

        })
    },
    // 预览
    previewImage(e) {
        if (this.data.chooseImg.length > 1) {
            const chooseImg = this.data.chooseImg
            let urls = []
            for (let index = 0; index < chooseImg.length; index++) {
                urls.push(chooseImg[index].tempFilePath)
            }
            wx.previewImage({
                current: e.currentTarget.dataset.url,
                urls
            })
        } else {
            wx.previewImage({
                urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
            })
        }
    },
    // 删除添加的图片
    del_img(e) {
        console.log(e.currentTarget.dataset.index);
        let chooseImg = this.data.chooseImg
        chooseImg.splice(e.currentTarget.dataset.index, 1);
        this.setData({
            chooseImg
        })
    },
    // 失去焦点
    textareablur(e) {
        console.log(e.detail.value.length);
        this.setData({
            textarea: e.detail.value
        })
        console.log(this.data.textarea.length);
    },
    submit() {
        console.log(this.data._id);
        // 1.判断举报内容_id是否存在
        const re = /^[a-z0-9_]{32}$/;
        const bre = re.test(this.data.value_id)
        if (bre && this.data.value_id == this.data._id._id) {
            // 证据>0
            console.log(this.data.textarea.length, this.data.chooseImg.length);
            if (this.data.textarea.length > 0 | this.data.chooseImg.length > 0) {
                this.setData({
                    button_submit: true,
                    button_text: "提交中...",
                    button_disbled: true,
                })
                this.addNewInfringement()
            } else {
                wx.showToast({
                    title: '请完成侵权相关资料的填写',
                    icon: "none"
                })
            }
        } else {
            wx.showToast({
                title: '请填写正确的编号',
                icon: "none"
            })
        }
    },
    // 提交
    addNewInfringement() {
        // 1.储存图片证据
        if (this.data.chooseImg.length > 0) {
            const fs = wx.getFileSystemManager()
            let data = []
            const choose = this.data.chooseImg
            for (let i = 0; i < choose.length; i++) {
                data[i] = fs.readFileSync(choose[i].tempFilePath, "base64")
            }
            console.log(data);
            let tmpPath = []
            for (let i = 0; i < choose.length; i++) {
                tmpPath[i] = choose[i].tempFilePath.replace("http:/", "");
            }
            console.log(tmpPath);
            wx.cloud.callFunction({
                name: "H_infringement",
                data: {
                    data,
                    tmpPath,
                    openid: app.globalData.openid
                }
            }).then(res => {
                console.log(res.result);
                const d = new Date()
                const time = d.getTime()
                const newInfringement = {
                    unionid: app.globalData.unionid,
                    openid: app.globalData.openid,
                    classify: this.data._id_classify,
                    infringement_id: this.data._id._id,
                    img: res.result,
                    text: this.data.textarea,
                    id_imgurl: [this.data._id.thumbnail, this.data._id.original],
                    reviewTheResults: 0,
                    _createTime: time,
                    _updateTime: time
                }
                console.log(newInfringement);
                wx.cloud.callFunction({
                    name: "H_infringement",
                    data: {
                        newInfringement
                    }
                }).then(res => {
                    console.log(res.errMsg);
                    if (res.errMsg == "cloud.callFunction:ok") {
                        wx.showToast({
                            title: '提交成功',
                        })
                        let gv = this.data.infringement
                        gv.unshift(this.data._id._id)
                        wx.setStorage({
                            key: "infringement",
                            data: JSON.stringify(gv)
                        }).finally(res => {
                            this.setData({
                                button_submit: false,
                                button_text: "已提交",
                                button_disbled: true,
                                // 输入框内容_if
                                value_id: null,
                                last_value_id: null,
                                // 上传的图片
                                chooseImg: [],
                                // 文字说明
                                textarea: null,
                                //
                                _id: null,
                                _id_classify: null,
                                infringement: gv
                            })
                        })
                    } else {
                        wx.showToast({
                            title: '出错了',
                            icon: "error"
                        })
                        this.setData({
                            button_submit: false,
                            button_text: "提交",
                            button_disbled: false,
                        })
                    }
                }).catch(err => {
                    wx.showToast({
                        title: '出错了',
                        icon: "error"
                    })
                    this.setData({
                        button_submit: false,
                        button_text: "提交",
                        button_disbled: false,
                    })
                })
            }).catch(err => {
                wx.showToast({
                    title: '出错了',
                    icon: "error"
                })
                this.setData({
                    button_submit: false,
                    button_text: "提交",
                    button_disbled: false,
                })
            })
        } else {
            const d = new Date()
            const time = d.getTime()
            const newInfringement = {
                unionid: app.globalData.unionid,
                openid: app.globalData.openid,
                classify: this.data._id_classify,
                infringement_id: this.data._id._id,
                img: [],
                text: this.data.textarea,
                id_imgurl: [this.data._id.thumbnail, this.data._id.original],
                reviewTheResults: 0,
                _createTime: time,
                _updateTime: time
            }
            console.log(newInfringement);
            wx.cloud.callFunction({
                name: "H_infringement",
                data: {
                    newInfringement
                }
            }).then(res => {
                console.log(res.errMsg);
                if (res.errMsg == "cloud.callFunction:ok") {
                    wx.showToast({
                        title: '提交成功',
                    })
                    let gv = this.data.infringement
                    gv.unshift(this.data._id._id)
                    wx.setStorage({
                        key: "infringement",
                        data: JSON.stringify(gv)
                    }).finally(res => {
                        this.setData({
                            button_submit: false,
                            button_text: "已提交",
                            button_disbled: true,
                            // 输入框内容_if
                            value_id: null,
                            last_value_id: null,
                            // 上传的图片
                            chooseImg: [],
                            // 文字说明
                            textarea: null,
                            //
                            _id: null,
                            _id_classify: null,
                            infringement: gv
                        })
                    })
                } else {
                    wx.showToast({
                        title: '出错了',
                        icon: "error"
                    })
                    this.setData({
                        button_submit: false,
                        button_text: "提交",
                        button_disbled: false,
                    })
                }
            }).catch(err => {
                wx.showToast({
                    title: '出错了',
                    icon: "error"
                })
                this.setData({
                    button_submit: false,
                    button_text: "提交",
                    button_disbled: false,
                })
            })
        }

    },
    // 获取全部反馈
    getAllInfringement() {
        if (this.data.all_end == false && this.data.all_loading == false) {
            this.setData({
                all_loading: true
            })
            wx.cloud.callFunction({
                name: "H_infringement",
                data: {
                    getAllInfringement: true,
                    skip: this.data.all_skip,
                    limit: this.data.all_limit,
                    openid: app.globalData.openid
                }
            }).then(res => {
                console.log(res);
                let a = res.result
                for (let i = 0; i < res.result.length; i++) {
                    const t = ymd(res.result[i]._createTime)
                    a[i].createTimeY = t[0]
                    a[i].createTimeM = t[1]
                    a[i].createTimeD = t[2]
                }
                this.setData({
                    all_Infringement: [...this.data.all_Infringement, ...a],
                    all_skip: this.data.all_skip + res.result.length
                })
                if (res.result.length < this.data.all_limit) {
                    this.setData({
                        all_end: true
                    })
                }
                console.log(a);
            }).finally(res => {
                this.setData({
                    all_loading: false
                })
            })
        }
    },
    getMyInfringement() {
        if (this.data.my_end == false && this.data.my_loading == false) {
            this.setData({
                my_loading: true
            })
            wx.cloud.callFunction({
                name: "H_infringement",
                data: {
                    getMyInfringement: true,
                    skip: this.data.my_skip,
                    limit: this.data.all_limit,
                    openid: app.globalData.openid
                }
            }).then(res => {
                console.log(res);
                let a = res.result
                for (let i = 0; i < res.result.length; i++) {
                    const t = ymd(res.result[i]._createTime)
                    a[i].createTimeY = t[0]
                    a[i].createTimeM = t[1]
                    a[i].createTimeD = t[2]
                }
                this.setData({
                    MyInfringement: [...this.data.MyInfringement, ...a],
                    my_skip: this.data.my_skip + res.result.length
                })
                if (res.result.length < this.data.all_limit) {
                    this.setData({
                        my_end: true
                    })
                }
                console.log(a);
            }).finally(res => {
                this.setData({
                    my_loading: false
                })
            })
        }
    },
    previewImage(e) {
        console.log("点击图片");
        console.log(e);
        wx.previewImage({
            urls: [e.currentTarget.dataset.url]
        })
    },
    goInfringement(e) {
        console.log("点击_id");
        console.log(e);
        const _id = e.currentTarget.dataset._id
        const classify = e.currentTarget.dataset.classify
        console.log(_id, classify);
        switch (classify) {
            case "headPortrait":
                wx.navigateTo({
                    url: "/pages/headPortrait/search/search?search=" + _id
                })
                break;
            case "headPortraitFrame":
                wx.navigateTo({
                    url: "/pages/headPortraitFrame/search/search?search=" + _id
                })
                break;
            case "wallpaper-across":
                wx.navigateTo({
                    url: "/pages/wallpaper/search/search?search=" + _id
                })
                break;
            case "wallpaper-vertical":
                wx.navigateTo({
                    url: "/pages/wallpaper/search/search?search=" + _id
                })
                break;

            default:
                break;
        }
    },
    ScrollTop() {
        const tap = this.data.tap
        console.log(tap);
        switch (tap) {
            case 0:
                this.setData({
                    all_ScrollTop: 0
                })
                break;
            case 1:
                this.setData({
                    my_ScrollTop: 0
                })
                break;
            default:
                break;
        }
    },
    goInfringementDetail(e) {
        console.log("点击详情");
        const data = e.currentTarget.dataset.data
        wx.navigateTo({
            url: "/pages/home/infringement_detail/infringement_detail?data=" + JSON.stringify(data),
        })
        console.log(data);
    },
    onRefresh() {
        this.setData({
            triggered: true,
            my_ScrollTop: 0
        })
        wx.cloud.callFunction({
            name: "H_infringement",
            data: {
                getMyInfringement: true,
                skip: 0,
                limit: this.data.all_limit,
                openid: app.globalData.openid
            }
        }).then(res => {
            this.setData({
                my_ScrollTop: 60
            })
            console.log(res);
            let a = res.result
            for (let i = 0; i < res.result.length; i++) {
                const t = ymd(res.result[i]._createTime)
                a[i].createTimeY = t[0]
                a[i].createTimeM = t[1]
                a[i].createTimeD = t[2]
            }
            this.setData({
                MyInfringement: a,
                my_skip: res.result.length
            })
            if (res.result.length < this.data.all_limit) {
                this.setData({
                    my_end: true,
                    my_ScrollTop: 60
                })
            }
        }).finally(res => {
            this.setData({
                triggered: false,
                enabled: false
            })
            setTimeout(() => {
                this.setData({
                    enabled: true
                })
            }, 1000)
        })
    },
    AonRefresh() {
        this.setData({
            Atriggered: true,
            all_ScrollTop: 0
        })
        wx.cloud.callFunction({
            name: "H_infringement",
            data: {
                getAllInfringement: true,
                skip: 0,
                limit: this.data.all_limit,
                openid: app.globalData.openid
            }
        }).then(res => {
            this.setData({
                all_ScrollTop: 60
            })
            console.log(res);
            let a = res.result
            for (let i = 0; i < res.result.length; i++) {
                const t = ymd(res.result[i]._createTime)
                a[i].createTimeY = t[0]
                a[i].createTimeM = t[1]
                a[i].createTimeD = t[2]
            }
            this.setData({
                all_Infringement: a,
                all_skip: res.result.length,
                all_ScrollTop: 60
            })
            if (res.result.length < this.data.all_limit) {
                this.setData({
                    all_end: true,
                })
            }
        }).finally(res => {
            this.setData({
                triggered: false,
                all_ScrollTop: 60,
                Aenabled: false
            })
            setTimeout(() => {
                this.setData({
                    Aenabled: true
                })
            }, 1000)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getAllInfringement()
        this.getMyInfringement()
        // 载入以往提交内容的_ic
        wx.getStorage({
            key: "infringement",
        }).then(res => {
            console.log(res.data);
            const infringement = JSON.parse(res.data)
            this.setData({
                infringement
            })
        }).catch(err => {
            const v = []
            wx.setStorage({
                key: "infringement",
                data: JSON.stringify(v)
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