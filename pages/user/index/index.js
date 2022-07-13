// pages/user/index/index.js
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        windowHeight: undefined,
        /**index.wxml */
        item_id: 0,
        /** 0_user.wxml */
        userBackground: undefined,

        hphpf_lastTapTime: undefined,
        hp_src: undefined,
        hp_size: "big",
        hp_circular: false,
        hp_style: undefined,
        // hp_img_style:undefined,
        hp_style_array: [
            "top: 0rpx;left: 0rpx;width: 160rpx;height: 160rpx;",
            "top: 10rpx;left: 10rpx;width: 140rpx;height: 140rpx;",
            "top: 20rpx;left: 20rpx;width: 120rpx;height: 120rpx;",
            "top: 30rpx;left: 30rpx;width: 100rpx;height: 100rpx;",
        ],
        // hp_img_style_array:undefined,
        hpf_src: undefined,

        name: undefined,
        openid: undefined,

        headportraitnum: null,
        headportraitgathernum: null,
        headportraitframenum: null,
        wallpapernum: null,
        // 选项列表
        selectlist: [{
                title: "更换头像和昵称",
                link: "/pages/user/setNewNicknameOrHeadportrait/setNewNicknameOrHeadportrait"
            },
            {
                title: "更换背景图",
                link: "/pages/user/upbackground/upbackground"
            },
            {
                title: "小程序使用记录",
                link: "/pages/user/loginRecord/loginRecord"
            },
        ],
        icon: [],
        nickname_lastTapTime: undefined,
        mode:"heightFix"
    },
    /**index.wxml */
    swiperchange(e) {
        console.log(e);
    },
    /** 0_user.wxml */
    // 双击头像改变头像大小
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
                })
            } else if (this.data.hp_size == "standard") {
                this.setData({
                    hp_style: this.data.hp_style_array[2],
                    hp_size: "small",
                })
                wx.setStorage({
                    key: "USER_INDEX_HP_SIZE",
                    data: "small"
                })
            } else if (this.data.hp_size == "small") {
                this.setData({
                    hp_style: this.data.hp_style_array[3],
                    hp_size: "x-small",
                })
                wx.setStorage({
                    key: "USER_INDEX_HP_SIZE",
                    data: "x-small"
                })
            } else if (this.data.hp_size == "x-small") {
                this.setData({
                    hp_style: this.data.hp_style_array[0],
                    hp_size: "big",
                })
                wx.setStorage({
                    key: "USER_INDEX_HP_SIZE",
                    data: "big"
                })
            }
        }
    },
    // 初始化
    init() {
        console.log("[app] init !");
        // 恢复设置的头像大小
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
            }
        })
        // 识别头像框的是否为圆
        console.log("[app] 圆:" + !app.globalData.headportraitframeData.square);
        this.setData({
            hp_circular: app.globalData.headportraitframeData.square
        })
    },
    // 跳转子页面
    ToSelectListLink(e) {
        console.log(e);
        const i = e.currentTarget.dataset.i
        const link = e.currentTarget.dataset.i.link
        console.log("[app] 前往子页面:" + link);
        if (i.title == "更换头像和昵称") {
            wx.navigateTo({
                url: link + "?avatarUrl=" + this.data.hp_src + "&name=" + this.data.name
            }).catch(err => {
                wx.navigateTo({
                    url: "/pages/Utils/error/error",
                })
            })
        } else if(i.title == "更换背景图"){
            wx.navigateTo({
                url: link + "?background=" + this.data.userBackground
            }).catch(err => {
                wx.navigateTo({
                    url: "/pages/Utils/error/error",
                })
            })
        }else{
            wx.navigateTo({
                url: link,
            })
        }

    },
    // 双击昵称
    getUserProfile(e) {
        const lastTapTime = this.data.nickname_lastTapTime;
        const timeStamp = e.timeStamp;
        this.setData({
            nickname_lastTapTime: timeStamp
        })
        if (timeStamp - lastTapTime < 350) {
            console.log("[app] 双击昵称");
        }
    },
    geticon() {
        const icon = app.globalData.systemIcon
        const myicon = [
            icon[3].url,
            icon[3].url,
            icon[7].url,
        ]
        this.setData({
            icon: myicon
        })
    },
    getHpHpfWalNum() {
        wx.cloud.callFunction({
            name: "HGusercollectionsum"
        }).then(res => {
            console.log(res);
            this.setData({
                headportraitnum: res.result.data2.data[0].collectionSum,
                headportraitframenum: res.result.data1.data[0].collectionSum,
                headportraitgathernum: res.result.data2.data[0].collectionGatherSum,
                wallpapernum: res.result.data3.data[0].verticalSum + res.result.data3.data[0].acrossSum,
            })
        })
    },
    toMyHpfCollection() {
        wx.navigateTo({
            url: "/pages/user/collectionSum_hpf/collectionSum_hpf"
            //   +"?_id="
            //   +app.globalData.user_headportraitfrma_array_id
            //   +"&hp_src="+this.data.hp_src
            //   +"&hpf_src="+this.data.hpf_src
            //   +"&square="+this.data.hp_circular
        })
    },
    toMyHpCollection() {
        wx.navigateTo({
            url: "/pages/user/collectionSum_hp/collectionSum_hp",
        })
    },
    toMyWallpaperCollection() {
        wx.navigateTo({
            url: "/pages/user/collectionSum_wallpaper/collectionSum_wallpaper"
        })
    },
    getuserbackgroundimages() {
        if (app.globalData.userbackgroundimages == undefined) {
            wx.cloud.callFunction({
                name: "HGuserbackgroundimages",
                data: {
                    openid: app.globalData.openid
                }
            }).then(res => {
                console.log(res);
                this.setData({
                    userBackground: res.result[0].mybackground
                })
                app.globalData.userbackgroundimages = res.result[0].mybackground
                this.setbackgroundmode(res.result[0].mybackground)
            })
        } else {
            if (app.globalData.userbackgroundimages != this.data.userBackground) {
                this.setData({
                    userBackground: app.globalData.userbackgroundimages
                })
                this.setbackgroundmode(app.globalData.userbackgroundimages)
            }
        }
    },
    // 预览
    previewImage() {
        console.log("[app] 点击预览图片");
        wx.previewImage({
            current: this.data.userBackground, // 当前显示图片的http链接
            urls: [this.data.userBackground] // 需要预览的图片http链接列表
        })
    },
    setbackgroundmode(e){
        wx.getImageInfo({
          src: e
        }).then(res=>{
            console.log(res);
            const a = res.width/res.height
            if (a < 1.5) {
                this.setData({
                    mode:"aspectFill"
                })
            } else {
                this.setData({
                    mode:"heightFix"
                })
            }
        })
    },
    /**  */
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.geticon()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({
            hp_src: app.globalData.headportrait,
            hpf_src: app.globalData.headportraitframe,
            windowHeight: app.globalData.windowHeight,
            name: app.globalData.nickname,
            openid: app.globalData.openid
        })
        this.init()
        this.getHpHpfWalNum()
        this.getuserbackgroundimages()
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