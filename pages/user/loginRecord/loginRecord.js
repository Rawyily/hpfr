// pages/user/loginRecord/loginRecord.js
var ymdshms = require('../../../utils/ymdshms_detail.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        MenuBottom: app.globalData.MenuBottom,
        windowWidth:app.globalData.windowWidth,
        array: [],
        all: [],
        skip: 0,
        end: false,
        loading: false,

        dialogShow: false,
        buttons: [{
            text: '取消'
        }, {
            text: '确定'
        }],
    },
    init() {
        wx.getStorage({
            key: "loginRecord"
        }).then(res => {
            console.log(res);
            this.setData({
                all: JSON.parse(res.data)
            })
            this.getRecord()
        })
    },
    getRecord() {
        if (this.data.loading == false && this.data.end == false) {
            const all = this.data.all
            console.log(all);
            let array = all.slice(this.data.skip, (this.data.skip + 50))
            console.log(array);
            for (let i = 0; i < array.length; i++) {
                array[i] = ymdshms(array[i])
            }
            console.log(array);
            this.setData({
                array: [...this.data.array, ...array],
                skip: this.data.skip + array.length,
                loading: false
            })
            if (array.length < 50) {
                this.setData({
                    end: true
                })
            }
        }
    },
    swiperchange(){
        wx.navigateBack({
          delta: -1,
        })
    },
    tapClear(e){
        console.log(e);
        this.setData({
            dialogShow:true
        })
    },
    clearall(){
        this.setData({
            all:[],
            array: [],
            skip: 0,
            end: true,
        })
        const a = []
        wx.setStorage({
            key:"loginRecord",
            data:JSON.stringify(a)
        })
        wx.showToast({
          title: '已清空记录',
        })
    },
    tapDialogButton(e) {
        this.setData({
            dialogShow:false
        })
        if (e.detail.index == 1) {
            wx.showLoading({
                title: '清除中...'
            })
            this.clearall()
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.init()
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