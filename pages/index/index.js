// index.js
const app = getApp()
Page({
    data: {
        // 宽高
        MenuWidth: app.globalData.MenuWidth,
        MenuHeight: app.globalData.MenuHeight,
        // 四个角
        MenuTop: app.globalData.MenuTop,
        MenuRight: app.globalData.MenuRight,
        MenuBottom: app.globalData.MenuBottom,
        MenuLeft: app.globalData.MenuLeft,

        windowWidth: app.globalData.windowWidth,

        videoUrl: undefined,
        // item_id: 1,
    },
    /**自定义函数 */
    loadVideo() {
        //获取videoUrl
        wx.cloud.callFunction({
            name: "HGsystemvideoDoc",
            data: {
                _id: "b69f67c0628bcfc90440ecc272ed1046"
            }
        }).then(res => {
            this.setData({
                videoUrl: res.result.data.video
            })
            wx.hideLoading({
                success: (res) => {},
            })
        }).catch(err => {
            this.switchTab_homeIndex()
        })
    },
    switchTab_homeIndex() {
        console.log("[app] 视频播放完毕，返回");
        wx.navigateBack({
            delta: -1,
        })
    },
    swiperchange(e) {
        const current= e.detail.current
        console.log(current);
        if (current == 1) {
            this.switchTab_homeIndex()
        }
    },
    onLoad() {
        wx.showLoading({
            title: '视频准备中...',
        })
        this.loadVideo()
        // console.log(app.globalData);
    }
})