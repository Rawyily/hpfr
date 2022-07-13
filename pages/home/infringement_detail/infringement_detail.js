// pages/home/infringement_detail/infringement_detail.js
var ymdshms = require('../../../utils/ymdshms.js')
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
        data: undefined,
        reviewTheResults: NaN,
        classify: NaN,
        ScrollTop: 0,
        dialogShow: false,
        buttons: [{
            text: '取消'
        }, {
            text: '确定'
        }],
    },
    init(e) {
        let data = e
        data._updateTime = ymdshms(e._updateTime)[0]
        data._createTime = ymdshms(e._createTime)[0]
        this.setData({
            data
        })
        switch (data.classify) {
            case "headPortrait":
                this.setData({
                    classify: "头像"
                })
                break;
            case "headPortraitFrame":
                this.setData({
                    classify: "头像框"
                })
                break;
            case "wallpaper-across":
                this.setData({
                    classify: "壁纸(横)"
                })
                break;
            case "wallpaper-vertical":
                this.setData({
                    classify: "壁纸(竖)"
                })
                break;
            default:
                break;
        }
        switch (data.reviewTheResults) {
            case 0:
                this.setData({
                    reviewTheResults: "待审核"
                })
                break;
            case 1:
                this.setData({
                    reviewTheResults: "已通过"
                })
                break;
            case 2:
                this.setData({
                    reviewTheResults: "未通过"
                })
                break;
            default:
                break;
        }
        // 获取提交的证据
        const _id = data._id
        wx.cloud.callFunction({
            name: "H_infringement",
            data: {
                _id,
                getDoc: true
            }
        }).then(res => {
            console.log(res);
            this.setData({
                data: {
                    ...data,
                    ...res.result
                }
            })
            console.log(this.data.data);

        }).catch(err=>{
            // console.log(err);
            wx.showToast({
              title: '获取数据失败',
              icon:"error"
            })
        })
    },
    ScrollTop() {
        this.setData({
            ScrollTop: 0
        })
    },
    swiperChange() {
        wx.navigateBack({
            delta: -1,
        })
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
    del() {
        this.setData({
            dialogShow: true
        })
    },
    DelInfringement() {
        wx.cloud.callFunction({
            name: "H_infringement",
            data: {
                del: true,
                _id: this.data.data._id
            }
        }).then(res => {
            console.log(res);
            if (res.errMsg == "cloud.callFunction:ok") {
                wx.showToast({
                  title: '撤销成功',
                })
            }
        }).catch(res=>{
            wx.showToast({
                title: '出错了',
                icon:"none"
              })
        })
    },
    tapDialogButton(e) {
        this.setData({
            dialogShow: false
        })
        console.log(e.detail.index);
        if (e.detail.index == 1) {
            wx.showLoading({
                title: '撤销中...'
            })
            this.DelInfringement()
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const data = JSON.parse(options.data)
        // console.log(data);
        this.init(data)
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