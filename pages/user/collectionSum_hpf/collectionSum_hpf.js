// pages/user/collectionSum_hpf/collectionSum_hpf.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _id: undefined,
        hp_src: undefined,
        hpf_src: undefined,
        hp_circular: false,
        hphpf_lastTapTime: undefined,
        hp_size: "big",
        hp_style: undefined,
        hp_style_array: [
            "top: 0rpx;left: 0rpx;width: 160rpx;height: 160rpx;",
            "top: 10rpx;left: 10rpx;width: 140rpx;height: 140rpx;",
            "top: 20rpx;left: 20rpx;width: 120rpx;height: 120rpx;",
            "top: 30rpx;left: 30rpx;width: 100rpx;height: 100rpx;",
        ],

        scrollTop: 0,
        hpfList: [],
        limit: 18,
        skip: 0,
        loading: false,
        end: false,
        last_timeStamp: undefined,

        original: undefined,
        hpf_id: undefined,
        hpfData: undefined,

        item_id: 1,
        background: "background:linear-gradient(35deg,#fff9f9,#ffcccc);",

        rawheadportraitsize: undefined,
        statusBarHeight: app.globalData.statusBarHeight,
        refresher_triggered: false,
    },
    init(e) {
        this.setData({
            limit: Math.round(app.globalData.windowHeight / (app.globalData.windowWidth / 3)) * 3

        })
        console.log("[app] init !");
        // 恢复设置的头像大小
        this.restore_hp_size()
        this.get_mycollectionhpf(e._id)

    },
    get_mycollectionhpf(e) {
        this.setData({
            loading: true
        })
        // console.log(e);
        const limit = this.data.limit
        const skip = this.data.skip
        const _id = e
        wx.cloud.callFunction({
            name: "HGusercollectionheadportraitframe",
            data: {
                limit: limit,
                skip: skip,
                _id: _id
            }
        }).then(res => {
            this.setData({
                loading: false
            })
            console.log(res.result);
            const getarray = res.result
            const oldarray = this.data.hpfList
            const newarray = [...oldarray, ...getarray]
            this.setData({
                hpfList: newarray
            })
            console.log(newarray);
            const newskip = getarray.length
            this.setData({
                skip: this.data.skip + newskip
            })
            if (newskip < limit) {
                console.log("end");
                this.setData({
                    end: true
                })
            }
        })
    },
    bindscrolltolower() {
        if (this.data.end == false && this.data.loading == false) {
            this.get_mycollectionhpf(this.data._id)
        }
    },
    // 恢复设置的头像大小
    restore_hp_size() {
        const that = this
        wx.getStorage({
            key: "USER_INDEX_HP_SIZE",
            success(res) {
                console.log("[app] size: " + res.data);
                const data = res.data
                if (data == "big") {
                    that.setData({
                        hp_style: that.data.hp_style_array[0],
                        hp_size: "big",
                    })
                } else if (data == "standard") {
                    that.setData({
                        hp_style: that.data.hp_style_array[1],
                        hp_size: "standard",
                    })
                } else if (data == "small") {
                    that.setData({
                        hp_style: that.data.hp_style_array[2],
                        hp_size: "small",
                    })
                } else if (data == "x-small") {
                    that.setData({
                        hp_style: that.data.hp_style_array[3],
                        hp_size: "x-small",
                    })
                }
                that.setData({
                    rawheadportraitsize: res.data
                })
            }
        })
    },
    // 双击变换头像大小
    set_hp_style(e) {
        // console.log(e);
        const lastTapTime = this.data.hphpf_lastTapTime;
        const timeStamp = e.timeStamp;
        this.setData({
            hphpf_lastTapTime: timeStamp
        })
        if (timeStamp - lastTapTime < 350) {
            console.log("[app] 双击头像");

            if (this.data.hp_size == "big") {
                this.setData({
                    hp_style: this.data.hp_style_array[1],
                    hp_size: "standard",
                })
                wx.setStorage({
                    key: "USER_INDEX_HP_SIZE",
                    data: "standard"
                }).then(res => {
                    console.log(res);
                })
            } else if (this.data.hp_size == "standard") {
                this.setData({
                    hp_style: this.data.hp_style_array[2],
                    hp_size: "small",
                })
                wx.setStorage({
                    key: "USER_INDEX_HP_SIZE",
                    data: "small"
                }).then(res => {
                    console.log(res);
                })
            } else if (this.data.hp_size == "small") {
                this.setData({
                    hp_style: this.data.hp_style_array[3],
                    hp_size: "x-small",
                })
                wx.setStorage({
                    key: "USER_INDEX_HP_SIZE",
                    data: "x-small"
                }).then(res => {
                    console.log(res);
                })
            } else if (this.data.hp_size == "x-small") {
                this.setData({
                    hp_style: this.data.hp_style_array[0],
                    hp_size: "big",
                })
                wx.setStorage({
                    key: "USER_INDEX_HP_SIZE",
                    data: "big"
                }).then(res => {
                    console.log(res);
                })
            }
        }
    },
    setmyhpf(e) {
        console.log(e);
        console.log(e.currentTarget.dataset.hi);
        // const timeStamp = e.timeStamp
        // const lastTapTime = this.data.last_timeStamp
        // this.setData({
        //     last_timeStamp: e.timeStamp
        // })
        const ues_hpf_src = this.data.hpf_src
        const new_hpf_src = e.currentTarget.dataset.hi.thumbnail
        console.log(ues_hpf_src, new_hpf_src);
        const nusrc = "cloud://cloud1-8g9nn2wx1bea9f4c.636c-cloud1-8g9nn2wx1bea9f4c-1306497002/cloudbase-cms/upload/2022-05-25/hi9wnttif36t3yaz8iaczszbwf5so87b_.png"
        if (ues_hpf_src == new_hpf_src) {
            this.setData({
                hpf_src: nusrc,
                hp_circular: true,
                original: nusrc,
                hpf_id: "6d85a2b9628ddd8f06b1faf350e0cfbf",
                hpfData: {
                    _id: "6d85a2b9628ddd8f06b1faf350e0cfbf",
                    square: true,
                    gif: false,
                    original: nusrc,
                    thumbnail: nusrc
                }
            })
        } else {
            this.setData({
                hpf_src: e.currentTarget.dataset.hi.thumbnail,
                hp_circular: e.currentTarget.dataset.hi.square,
                original: e.currentTarget.dataset.hi.original,
                hpf_id: e.currentTarget.dataset.hi._id,
                hpfData: e.currentTarget.dataset.hi
            })
        }
    },
    longpress(e) {
        console.log(e);
        // 前往详情页
        // console.log(e.currentTarget.dataset.data);
        console.log("[app] 前往详情页");
        const name = e.currentTarget.dataset.hi.name;
        const original = e.currentTarget.dataset.hi.original;
        const square = e.currentTarget.dataset.hi.square;
        const gif = e.currentTarget.dataset.hi.gif;
        const browse = e.currentTarget.dataset.hi.browse;
        const collection = e.currentTarget.dataset.hi.collection;
        const use = e.currentTarget.dataset.hi.use;
        const _id = e.currentTarget.dataset.hi._id;
        const _createTime = e.currentTarget.dataset.hi._createTime;
        const _updateTime = e.currentTarget.dataset.hi._updateTime;
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
    },
    // 按钮
    cancel() {
        if (this.data.refresher_triggered) {
            wx.setStorage({
                key: "USER_INDEX_HP_SIZE",
                data: this.data.rawheadportraitsize
            })
        }
        wx.navigateBack({
            delta: -1,
        })
    },
    back(e) {
        console.log(e);
        if (e.detail.current == 0) {
            this.cancel()
        }
    },
    save(e) {
        console.log(e);
        wx.showLoading({
            title: '正在更改...',
        })
        wx.cloud.callFunction({
            name: "HSuserheadPortraitFramearray",
            data: {
                type: "upUse",
                _id: app.globalData.user_headportraitfrma_array_id,
                headportraitframe_id: this.data.hpf_id
            }
        }).then(res => {
            if (this.data.hpfData) {
                app.globalData.headportraitframe = this.data.original
                app.globalData.headportraitframeData = this.data.hpfData
            }
            wx.hideLoading({
                success: (res) => {},
            })
            // wx.navigateBack({
            //     delta: -1,
            // })
            wx.showToast({
                title: '更改成功',
            })
            this.setData({
                rawheadportraitsize: this.data.hp_size
            })
        })

    },
    setbackdground(evant) {
        console.log(evant);
        const z = this.data.background
        const a = "background:linear-gradient(35deg,#fff9f9,#ffcccc);"
        const b = "background:#FFFFFF;"
        const c = "background:#FFFAFA;"
        const d = "background:#FFF68F;"
        const e = "background:#FFEFD5;"
        const f = "background:#FFE4E1;"
        const g = "background:#FFDEAD;"
        const h = "background:#FFB90F;"
        const i = "background:#CAFF70;"
        const j = "background:#98F5FF"
        const k = "background:none;"
        console.log(z == k);
        switch (z) {
            case a:
                this.setData({
                    background: b
                })
                wx.setStorage({
                    key: "collectionSum_hpf_headportraitbackgroundcolor",
                    data: b
                })
                break;
            case b:
                this.setData({
                    background: c
                })
                wx.setStorage({
                    key: "collectionSum_hpf_headportraitbackgroundcolor",
                    data: c
                })
                break;
            case c:
                this.setData({
                    background: d
                })
                wx.setStorage({
                    key: "collectionSum_hpf_headportraitbackgroundcolor",
                    data: d
                })
                break;
            case d:
                this.setData({
                    background: e
                })
                wx.setStorage({
                    key: "collectionSum_hpf_headportraitbackgroundcolor",
                    data: e
                })
                break;
            case e:
                this.setData({
                    background: f
                })
                wx.setStorage({
                    key: "collectionSum_hpf_headportraitbackgroundcolor",
                    data: f
                })
                break;
            case f:
                this.setData({
                    background: g
                })
                wx.setStorage({
                    key: "collectionSum_hpf_headportraitbackgroundcolor",
                    data: g
                })
                break;
            case g:
                this.setData({
                    background: h
                })
                wx.setStorage({
                    key: "collectionSum_hpf_headportraitbackgroundcolor",
                    data: h
                })
                break;
            case h:
                this.setData({
                    background: i
                })
                wx.setStorage({
                    key: "collectionSum_hpf_headportraitbackgroundcolor",
                    data: i
                })
                break;
            case i:
                this.setData({
                    background: j
                })
                wx.setStorage({
                    key: "collectionSum_hpf_headportraitbackgroundcolor",
                    data: j
                })
                break;
            case j:
                this.setData({
                    background: k
                })
                wx.setStorage({
                    key: "collectionSum_hpf_headportraitbackgroundcolor",
                    data: k
                })
                break;
            case k:
                this.setData({
                    background: a
                })
                wx.setStorage({
                    key: "collectionSum_hpf_headportraitbackgroundcolor",
                    data: a
                })
                break;
            default:
                break;
        }
    },
    scrollTop(e) {
        console.log(e);
        this.setData({
            scrollTop: 0
        })
    },
    bindrefresherpulling(e) {
        console.log("下拉");
        this.setData({
            refresher_triggered: true
        })
        console.log(this.data.limit, this.data.skip, this.data._id);
        const limit = this.data.limit
        const skip = 0
        const _id = this.data._id
        wx.cloud.callFunction({
            name: "HGusercollectionheadportraitframe",
            data: {
                limit: limit,
                skip: skip,
                _id: _id
            }
        }).then(res => {
            const getarray = res.result
            this.setData({
                hpfList: getarray,
                skip: getarray.length
            })
            console.log(getarray);
            console.log(getarray.length);
            if (getarray.length < limit) {
                this.setData({
                    end: true
                })
            }
            this.setData({
                refresher_triggered: false
            })
        }).catch(err => {
            wx.showToast({
                title: '出错了',
                icon: 'success'
            })
            this.setData({
                refresher_triggered: false
            })
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const square = app.globalData.headportraitframeData.square
        this.setData({
            _id: app.globalData.user_headportraitfrma_array_id,
            hp_src: app.globalData.headportrait,
            hpf_src: app.globalData.headportraitframeData.thumbnail,
            hp_circular: JSON.parse(square)
        })
        this.init({
            _id: app.globalData.user_headportraitfrma_array_id
        })
        console.log(square);
        console.log(this.data);
        console.log(app.globalData.headportraitframeData.thumbnail);
        // 
        wx.getStorage({
            key: "collectionSum_hpf_headportraitbackgroundcolor"
        }).then(res => {
            console.log(res.data);
            // console.log("collectionSum_hpf_headportraitbackgroundcolor");
            this.setData({
                background: res.data
            })
        }).catch(err => {
            const k = "background:none;"
            wx.setStorage({
                key: "collectionSum_hpf_headportraitbackgroundcolor",
                data: k
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