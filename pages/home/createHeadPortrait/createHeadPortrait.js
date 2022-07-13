// pages/home/createHeadPortrait/createHeadPortrait.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 设备信息
        MenuWidth: app.globalData.MenuWidth,
        MenuHeight: app.globalData.MenuHeight,

        MenuTop: app.globalData.MenuTop,
        MenuRight: app.globalData.MenuRight,
        MenuBottom: app.globalData.MenuBottom,
        MenuLeft: app.globalData.MenuLeft,

        windowWidth: app.globalData.windowWidth,
        windowHeight: app.globalData.windowHeight,

        pixelRatio: app.globalData.pixelRatio,
        //画布信息
        ctx: undefined,
        canvas: undefined,
        dpr: undefined,
        canvasWidth: undefined,
        canvasHeight: undefined,

        CanvasOpen: false, //画布是否开启
        HeadPortraitLoad: false, //头像是否已经加载
        CanvasheadPortraitX: 0, //头像的左上坐标点

        icon1: undefined,
        icon2: undefined,
        icon3: undefined,

        // ZoomInOnWidth: undefined,
        // ZoomInOnHeight: undefined,
        ZoomInOnHeadPortraitImgObj: undefined,

        HPF_icon_show: false, //头像框是否显示

        sliderValue: 50,//滑块的值

        mploading: true,

        // appimg:app.globalData.createHeadPortraitWxml_HeadPortraitimgSrc

    },
    /*************左滑返回******************/
    bindchange(e) {
        if (e.detail.current == 0) {
            wx.navigateBack({
                delta: 0,
            })
        }
    },
    /*************初始化画布******************/
    CanvasSelect() {
        wx.createSelectorQuery()
            .select('#canvas')
            .fields({
                node: true,
                size: true,
            })
            .exec(this.CanvasExec.bind(this));
    },
    // Canvas渲染
    CanvasExec(res) {
        // console.log("CanvasExec");
        //获取canvas和ctx
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        // 处理style设置的宽高变形
        const width = res[0].width
        const height = res[0].height
        const dpr = app.globalData.pixelRatio

        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        // console.log("dpr:" + dpr, "| canvas.width:" + canvas.width, "| canvas.height:" + canvas.height);
        this.setData({
            ctx: ctx,
            canvas: canvas,
            dpr: dpr,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            CanvasOpen: true,
            CanvasheadPortraitX: 0
        })
        console.log("[app] 画布初始化完成");
    },
    // Canvas(url) {
    //     console.log("[app] Canvas()画布开始渲染");
    //     const ctx = this.data.ctx
    //     const canvas = this.data.canvas
    //     const dpr = this.data.dpr
    //     const canvasWidth = this.data.canvasWidth
    //     const canvasHeight = this.data.canvasHeight
    //     // console.log(this.data);
    //     // Canvas添加图片
    //     this.addCanvasHeadPortrait(url)
    //     //添加图片—头像框
    // },
    addCanvasHeadPortrait(url) {
        const ctx = this.data.ctx
        const canvas = this.data.canvas
        const dpr = this.data.dpr
        const canvasWidth = this.data.canvasWidth
        const canvasHeight = this.data.canvasHeight
        // console.log(url);
        // console.log(ctx, canvas, dpr, canvasWidth, canvasHeight);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        try {
            const image = canvas.createImage();
            image.src = url;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, canvasWidth / dpr, canvasHeight / dpr)
                this.setData({
                    HeadPortraitLoad: true,
                    ZoomInOnHeadPortraitImgObj: image
                })
                console.log("[app] 头像渲染成功");
            }
        } catch (error) {
            console.log("[app] 头像渲染失败");
            /*******************失败也加载头像框***************************/
            this.setData({
                HeadPortraitLoad: true
            })
        }
        const loadHeadPortraitFrame = setInterval(() => {
            if (this.data.HeadPortraitLoad) {
                clearInterval(loadHeadPortraitFrame)
                this.addCanvasHeadPortraitFrame()
            }
        }, 10);
    },
    //渲染头像框
    addCanvasHeadPortraitFrame() {
        this.setData({
            HeadPortraitLoad: false
        })
        const ctx = this.data.ctx
        const canvas = this.data.canvas
        const dpr = this.data.dpr
        const canvasWidth = this.data.canvasWidth
        const canvasHeight = this.data.canvasHeight
        try {
            const image = canvas.createImage();
            image.src = app.globalData.createHeadPortraitWxml_HeadPortraitFrameimgSrc;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, canvasWidth / dpr, canvasHeight / dpr);
                this.setData({
                    HPF_icon_show: true
                })
                console.log("[app] 头像框渲染成功");
            }
        } catch (error) {
            console.log("[app] 头像框渲染失败");
        }
        this.setData({
            mploading: false,
        })
        if (app.globalData.cropperImgUrl) {
            app.globalData.createHeadPortraitWxml_HeadPortraitimgSrc = app.globalData.cropperImgUrl;
            app.globalData.cropperImgUrl = undefined;
            console.log("[app] 删除cropper的图片");
        }
    },
    CanvasShowing() {
        console.log("[app]  CanvasShowing()开始渲染");
        console.log(app.globalData.cropperImgUrl);
        console.log(app.globalData.createHeadPortraitWxml_HeadPortraitimgSrc);
        if (app.globalData.cropperImgUrl == undefined) {
            console.log("[app] 渲染非裁剪头像");
            this.addCanvasHeadPortrait(app.globalData.createHeadPortraitWxml_HeadPortraitimgSrc)

        } else {
            console.log("[app] 渲染裁剪头像");
            this.addCanvasHeadPortrait(app.globalData.cropperImgUrl);
        }
        // console.log(app.globalData.createHeadPortraitWxml_HeadPortraitimgSrc, app.globalData.cropperImgUrl);
    },
    // 选择头像
    // ChooseHeadPortrait() {

    // },
    // 上传头像
    UploadHeadPortrait() {
        console.log("[app] 请求上传图片");
        wx.navigateTo({
            url: "/pages/Utils/cropper/cropper"
        })
    },
    // 剪切头像
    ModifyTheHeadPortrait() {
        console.log("[app] 剪切上传图片");
        // console.log(app.globalData.createHeadPortraitWxml_HeadPortraitimgSrc);
        // console.log(app.globalData.cropperImgUrl);
        wx.navigateTo({
            url: "/pages/Utils/cropper/cropper?imgSrc=" + app.globalData.createHeadPortraitWxml_HeadPortraitimgSrc,
        })
    },
    // 点击放大头像
    bigIcon() {
        console.log("[app] 点击放大头像");
        const Xman = this.data.canvasWidth / this.data.dpr / 2;
        const Xnum = this.data.canvasWidth / this.data.dpr / 20;
        const x = this.data.CanvasheadPortraitX - Xnum;
        if (x < -Xman) {} else {
            const canvas = this.data.canvas
            const ctx = this.data.ctx
            const dpr = this.data.dpr
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(this.data.ZoomInOnHeadPortraitImgObj, x / 2, x / 2, canvas.width / dpr - x, canvas.height / dpr - x)
            this.setData({
                CanvasheadPortraitX: x,
                HPF_icon_show: false
            })
        }
    },
    // 点击缩小头像
    smallIcon() {
        console.log("[app] 点击缩小头像");
        const Xmin = this.data.canvasWidth / this.data.dpr / 2;
        const Xnum = this.data.canvasWidth / this.data.dpr / 20;
        const x = this.data.CanvasheadPortraitX + Xnum;
        if (x > Xmin) {} else {
            const canvas = this.data.canvas
            const ctx = this.data.ctx
            const dpr = this.data.dpr
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(this.data.ZoomInOnHeadPortraitImgObj, x / 2, x / 2, canvas.width / dpr - x, canvas.height / dpr - x)
            this.setData({
                CanvasheadPortraitX: x,
                HPF_icon_show: false
            })

        }
    },
    // 点击隐藏或显示头像框
    HPF_icon() {
        if (this.data.HPF_icon_show) {
            const canvas = this.data.canvas
            const ctx = this.data.ctx
            const dpr = this.data.dpr
            const x = this.data.CanvasheadPortraitX
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(this.data.ZoomInOnHeadPortraitImgObj, x / 2, x / 2, canvas.width / dpr - x, canvas.height / dpr - x)
            this.setData({
                HPF_icon_show: false
            })
            console.log("[app] 头像框隐藏");
        } else {
            const canvas = this.data.canvas
            const ctx = this.data.ctx
            const dpr = this.data.dpr
            const x = this.data.CanvasheadPortraitX
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(this.data.ZoomInOnHeadPortraitImgObj, x / 2, x / 2, canvas.width / dpr - x, canvas.height / dpr - x)
            const image = canvas.createImage();
            image.src = app.globalData.createHeadPortraitWxml_HeadPortraitFrameimgSrc;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, canvas.width / dpr, canvas.height / dpr);
                this.setData({
                    HPF_icon_show: true
                })
            }
            console.log("[app] 头像框显示");
        }
    },
    // 滑条
    sliderChange(e) {
        const value = e.detail.value
        // console.log(value);
        this.setData({
            sliderValue: value
        })
        console.log("[app] 滑条 "+ value);
    },
    // 保存
    save(value) {
        console.log("[app] 请求保存 "+ value );
        const canvas = this.data.canvas
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: this.data.canvasWidth,
            height: this.data.canvasHeight,
            destWidth: value,
            destHeight: value,
            quality: 1, // 压缩质量
            canvas: canvas,
            success(res) {
                // console.log(res.tempFilePath)
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                        console.log("[app] 保存成功 "+ value );
                    }
                })
            }
        })
    },
    saveMax() {
        this.save(1080)
    },
    saveNormal() {
        this.save(this.data.canvasWidth)
    },
    saveMin() {
        this.save(50)
    },
    saveSlider() {
        this.save(this.data.sliderValue)
    },
    // 点击canvas预览
    previewImage() {
        const canvas = this.data.canvas
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: this.data.canvasWidth,
            height: this.data.canvasHeight,
            destWidth: this.data.canvasWidth,
            destHeight: this.data.canvasHeight,
            quality: 1, // 压缩质量
            canvas: canvas,
            success(res) {
                // console.log(res.tempFilePath)
                wx.previewImage({
                    current: res.tempFilePath, // 当前显示图片的http链接
                    urls: [res.tempFilePath] // 需要预览的图片http链接列表
                })
                console.log("[app] 预览Canvas");
            }
        })

    },
    // 前往头像页面
    gotoheadportrait() {
        console.log("[app] 前往头像页面");
        // console.log("gotoheadportrait");
        wx.switchTab({
            url: '/pages/headPortrait/index/index',
        }).catch(err => {
            // console.log(err);
            wx.showToast({
                title: '出错了！',
                icon: "error",
                duration: 1000
            })
        })
    },
    // 前往头像框页面
    gotoheadportraitframe() {
        console.log("[app] 前往头像框页面");
        // console.log("gotoheadportraitframe");
        wx.switchTab({
            url: '/pages/headPortraitFrame/index/index',
        }).catch(err => {
            // console.log(err);
            wx.showToast({
                title: '出错了！',
                icon: "error",
                duration: 1000
            })
        })
    },
    geticon(){
        const systemicon = app.globalData.systemIcon
        this.setData({
            icon1:systemicon[0].url,
            icon2:systemicon[1].url,
            icon3:systemicon[2].url
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // console.log(options);

        // Canvas初始化
        this.CanvasSelect()
        this.geticon()
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
        // 页面显示Canvas渲染
        const run = setInterval(() => {
            if (this.data.CanvasOpen) {
                clearInterval(run)
                this.CanvasShowing()
            }
        }, 10)
        // const menu = wx.getMenuButtonBoundingClientRect()
        // console.log(menu);
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