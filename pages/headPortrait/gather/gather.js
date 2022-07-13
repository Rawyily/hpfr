// pages/headPortrait/gather/gather.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: undefined,
        MenuBottom: app.globalData.MenuBottom,
        MenuLeft: app.globalData.MenuLeft,
        MenuRight: app.globalData.MenuRight,
        MenuWidth: app.globalData.MenuWidth,
        MenuHeight: app.globalData.MenuHeight,
        windowHeight: undefined,
        windowWidth: undefined,

        gather: undefined,
        advertising_img: [],
        array: [],
        scrollTop: 0,
        loading: false,
        End: false,
        limit: Math.round(app.globalData.windowHeight / (app.globalData.windowWidth / 3)) * 3,
        skip: 0,
        staricontype: "outline",
    },
    // 左滑返回
    swiperchange(e) {
        console.log(e.detail.current);
        if (e.detail.current == 0) {
            wx.navigateBack({
                delta: -1,
            })
        }
    },
    // 触底加载
    bindscrolltolower() {
        // console.log(this.data.loading == false && this.data.End == false);
        if (this.data.loading == false && this.data.End == false) {
            this.HGappheadportraitgather()
        }
    },
    // 点击顶部返回顶部
    scrollTop() {
        this.setData({
            scrollTop: 0
        })
    },
    //获取广告
    getAdvertising_img() {
        wx.cloud.callFunction({
            name: "HGadvertisingimgWhere",
            data: {
                skip: 0,
                limit: 11,
                where: {
                    classify: "DATE A LIVE"
                }
            }
        }).then(res => {
            // console.log(res);
            this.setData({
                advertising_img: res.result,
            })
            console.log("[app] 获取广告成功");
        })
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
    // 点击跳转 详情
    goDetails(e) {
        // console.log(e);
        const data = e.currentTarget.dataset.data
        // console.log(data);
        const dataToString = JSON.stringify(data)
        // console.log(dataToString);
        wx.navigateTo({
            url: "/pages/headPortrait/details/details" +
                "?data=" + dataToString
        })
    },
    // 
    HGappheadportraitgather() {
        if (this.data.loading == false && this.data.End == false) {
            this.setData({
                loading: true
            })
            console.log(this.data.skip, this.data.limit);
            const array = this.data.data.array.slice(this.data.skip, (this.data.limit + this.data.skip));
            console.log(array);
            wx.cloud.callFunction({
                name: "HGappheadportraitgather",
                data: {
                    type: true,
                    array
                }
            }).then(res => {
                console.log(res);
                this.setData({
                    array: [...this.data.array, ...[{
                        array: res.result
                    }]],
                    skip: this.data.skip + res.result.length
                })
                if (res.result.length < this.data.limit) {
                    this.setData({
                        End: true
                    })
                }
            }).finally(res => {
                this.setData({
                    loading: false
                })
            })
        }

    },
    stariconTap() {
        if (this.data.staricontype == "field") {
            wx.showLoading({
                title: '取消中...',
              })
            wx.cloud.callFunction({
                name: "HSuserheadPortraitarray",
                data: {
                    openid: app.globalData.openid,
                    type: "cancelgather",
                    gather_id: this.data.data._id
                }
            }).then(res => {
                wx.showToast({
                    title: '已取消收藏',
                    icon: "success",
                    duration: 1200
                })
                this.setData({
                    staricontype: "outline"
                })
            }).catch(err=>{
                wx.showToast({
                    title: '出错了',
                    icon:'error',
                    duration: 1200
                })
            })
        } else {
            wx.showLoading({
                title: '收藏中...',
              })
            wx.cloud.callFunction({
                name: "HSuserheadPortraitarray",
                data: {
                    openid: app.globalData.openid,
                    type: "addgather",
                    gather_id: this.data.data._id
                }
            }).then(res => {
                wx.showToast({
                    title: '收藏成功',
                    icon:"success",
                    duration: 1200
                })
                this.setData({
                    staricontype: "field"
                })
            }).catch(err=>{
                wx.showToast({
                    title: '出错了',
                    icon:'error',
                    duration: 1200
                })
            })
        }
    },
    // 查询是否收藏
    checkCollectionResults(e) {
        console.log(e);
        console.log("查询是否收藏");
        wx.cloud.callFunction({
            name: "HGuserheadPortraitarray",
            data: {
                type: "checkgather",
                openid: app.globalData.openid,
                _id: e
            }
        }).then(res => {
            console.log(res);
            if (res.result > 0) {
                this.setData({
                    staricontype:"field"
                })
            }
        }).catch(err => {
            // console.log(err);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const data = JSON.parse(options.data)
        // for (let i = 0; i < 5; i++) {
        //     data.array = [...data.array, ...data.array]
        // }
        this.setData({
            data,
            gather: data.name
        })
        console.log(data);
        this.HGappheadportraitgather()
        this.getAdvertising_img()
        this.checkCollectionResults(data._id)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        const that = this
        wx.getSystemInfo({
            success(res) {
                console.log(res.windowHeight)
                console.log(res.screenHeight)
                that.setData({
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
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