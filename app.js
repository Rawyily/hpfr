// app.js
App({
    // 全局数据
    globalData: {

        /** ID */
        openid: undefined,
        appid: undefined,
        unionid: undefined,

        /**用户设备信息*/
        screenWidth: undefined, //设备屏幕宽度
        screenHeight: undefined, //设备屏幕高度
        windowWidth: undefined, //窗口宽度
        windowHeight: undefined, //窗口高度
        pixelRatio: undefined, //像素比
        statusBarHeight: undefined, //标题栏的高度

        /** 胶囊 */
        MenuWidth: undefined,
        MenuHeight: undefined,
        MenuTop: undefined,
        MenuRight: undefined,
        MenuBottom: undefined,
        MenuLeft: undefined,

        /**cloud: user-data */
        nickname: undefined,
        headportrait: undefined,
        user_id: undefined,

        /**登录 */
        login: false,

        /**cloud: user-headportraitframe-array */
        user_headportraitfrma_array_id: undefined,
        headportraitframe: undefined,
        headportraitframeData: undefined, // res.result

        /**cloud: system-icon */
        systemIcon: undefined,

        /** createHeadPortrait.wxml */
        createHeadPortraitWxml_HeadPortraitimgSrc: "/images/home/createHeadPortrait/defaultProfilePicture.png",
        createHeadPortraitWxml_HeadPortraitFrameimgSrc: "/images/home/createHeadPortrait/defaultProfilePictureBox.png",

        /** cropper */
        cropperImgUrl: undefined,

        loaded: undefined,

        /** user */
        userbackgroundimages: undefined,

        // initshowloadin: 0,

        /**wallpaper-details*/
        like: [],
    },
    /*************************初始化 app加载 ****************************************/
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力');
        } else {
            wx.cloud.init({
                env: 'cloud1-8g9nn2wx1bea9f4c',
                traceUser: true,
            });
        }
        wx.showLoading({
            title: '初始化 0%',
        })
        this.globalData.initshowloadin = true
        // 获取设备信息
        this.getSystemInfoAndMenuButtonInfo()
        // 获取ID
        this.HGidinfo()
        //登录
        this.HGsystemiconAll()
        // 解决默认头像的在Canvas中的创建异常
        this.createHeadPortraitImgInit()
        // setTimeout(() => {
        //     if (this.globalData.initshowloadin == true) {
        //         wx.hideLoading()
        //         wx.showToast({
        //             title: '网络不稳定',
        //             icon: 'error'
        //         })
        //     }
        // }, 8000);
        this.loginRecord()
    },

    /*************************** 自定义函数 *******************************************************************************/
    /*********************************************************************************************************************/

    /****************************公用函数*********************************************************************/
    // 返回上一页面
    callback() {
        const delta = getCurrentPages().length - 1
        console.log(delta);
        wx.navigateBack({
            delta: delta
        }).catch(res => {
            console.log(res);
            wx.navigateTo({
                // 错误页面
                url: "/pages/Utils/error/error"
            })
        })
    },
    // 设置按钮音效
    ButtonsAudio() {
        // console.log("按钮音效");
        const innerAudioContext = wx.createInnerAudioContext({
            useWebAudioImplement: true
        })
        innerAudioContext.volume = 0.3
        innerAudioContext.autoplay = false // 是否自动开始播放，默认为 false
        innerAudioContext.loop = false // 是否循环播放，默认为 false
        wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
            obeyMuteSwitch: false, // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
            success: function (e) {},
            fail: function (e) {}
        })
        innerAudioContext.src = "/audio/hrxz.com-q1ffgikhfli63978.mp3"
        innerAudioContext.play()
    },
    addlikeOrdel(e) {
        console.log(e);
        const {
            type,
            _id
        } = e
        let like = this.globalData.like
        if (type == true) {
            like.push(_id)
            this.globalData.like = like
        } else if (type == false) {
            const i = like.indexOf(_id)
            like.splice(i, 1)
            this.globalData.like = like
        }
    },
    UpFile(e) {
        const {
            file,
            type,
            datatype
        } = e
        wx.cloud.callFunction({
            name: "UpFile",
            data: {
                file,
                type,
                datatype
            }
        }).then(res => {
            console.log(res);
            return res.result
        }).catch(err => {
            console.log(err);
            return false
        })
    },
    /****************************onLaunch*********************************************************************/
    /****************1.获取设备基本信息***************************************/
    getSystemInfoAndMenuButtonInfo() {
        const SystemInfo = wx.getSystemInfoSync()
        this.globalData.screenWidth = SystemInfo.screenWidth;
        this.globalData.screenHeight = SystemInfo.screenHeight;
        this.globalData.windowWidth = SystemInfo.windowWidth;
        this.globalData.windowHeight = SystemInfo.windowHeight;
        this.globalData.pixelRatio = SystemInfo.pixelRatio;
        this.globalData.statusBarHeight = SystemInfo.statusBarHeight;
        let Menu = wx.getMenuButtonBoundingClientRect()
        // console.log(Menu);
        this.globalData.MenuWidth = Menu.width;
        this.globalData.MenuHeight = Menu.height;

        this.globalData.MenuTop = Menu.top;
        this.globalData.MenuRight = Menu.right;
        this.globalData.MenuBottom = Menu.bottom;
        this.globalData.MenuLeft = Menu.left;

        console.log("[app] 获取设备基本信息完成");
    },
    /****************2.获取ID***************************************/
    HGidinfo() {
        wx.cloud.callFunction({
            name: "HGidinfo"
        }).then(res => {
            this.globalData.appid = res.result.appid
            this.globalData.openid = res.result.openid
            this.globalData.unionid = res.result.unionid
            // console.log(res.result);
            // console.log(res.result.unionid.length);
            console.log("[app] 获取ID信息完成");
            console.log("[app] 开始登录");

            /**************** 3.开始登录 *******************************************/
            wx.showLoading({
                title: '初始化 25%',
            })
            if (res.result.unionid.length > 0) {
                this.login_Unionid(res.result.unionid)
            } else {
                this.login_Openid(res.result.openid)
            }
        })
    },
    // unionid登录
    login_Unionid(unionid) {
        // console.log(unionid);
        wx.cloud.callFunction({
            name: "HGuserdata",
            data: {
                where: {
                    unionid: unionid
                }
            }
        }).then(res => {
            // console.log(res);
            if (res.result.length > 0) {
                this.logined({
                    user_id: res.result[0]._id,
                    nickname: res.result[0].nickname,
                    headportrait: res.result[0].headportrait,
                    login: true
                })
                console.log("[app] unionid登录成功");
            } else {
                this.register()
            }
        })
    },
    // openid登录 
    login_Openid(openid) {
        // console.log(openid);
        wx.cloud.callFunction({
            name: "HGuserdata",
            data: {
                where: {
                    openid: openid
                }
            }
        }).then(res => {
            // console.log(res);
            if (res.result.length > 0) {
                this.logined({
                    user_id: res.result[0]._id,
                    nickname: res.result[0].nickname,
                    headportrait: res.result[0].headportrait,
                    login: true
                })
                console.log("[app] openid登录成功");
            } else {
                this.register()
            }
        })
    },
    // 登录完成
    logined(e) {
        // console.log(e.user_id, e.nickname, e.headportrait, e.login);
        this.globalData.user_id = e.user_id
        this.globalData.nickname = e.nickname
        this.globalData.login = e.login
        wx.showLoading({
            title: '初始化 50%',
        })
        // 获取用户头像框ID user-headportraitframe-array: _id、used-headportraitframe——id
        this.getmyhpf(this.globalData.openid)
        //转换头像为本地防止Canvas出错
        this.getImageInfo_hfp(e.headportrait)

    },
    //转换头像为本地防止Canvas出错
    getImageInfo_hfp(e) {
        wx.getImageInfo({
            src: e,
        }).then(res => {
            // console.log(res.path);
            this.globalData.headportrait = res.path
            // Canvas
            this.globalData.createHeadPortraitWxml_HeadPortraitimgSrc = res.path
            console.log("[app] 头像本地化Canvas防错成功");
        })
    },
    // 获取用户头像框ID user-headportraitframe-array: _id、used-headportraitframe——id
    getmyhpf(openid) {
        wx.cloud.callFunction({
            name: "HGuserheadPortraitFramearrayWhereField",
            data: {
                where: {
                    openid: openid
                },
                field: {
                    _id: true,
                    used_headportraitframe_id: true
                }
            }
        }).then(res => {
            wx.showLoading({
                title: '初始化 75%',
            })
            // console.log(res.result.data[0]);
            this.globalData.user_headportraitfrma_array_id = res.result.data[0]._id;
            //获取头像框图片路径
            wx.cloud.callFunction({
                name: "HGappheadportraitframeWhere",
                data: {
                    where: {
                        _id: res.result.data[0].used_headportraitframe_id
                    },
                    limit: 1,
                    skip: 0
                }
            }).then(res => {
                wx.showLoading({
                    title: '初始化 100%',
                })
                // console.log(res.result[0]);
                this.globalData.headportraitframeData = res.result[0]
                // 转化防止Canvas报错
                wx.getImageInfo({
                    src: res.result[0].original,
                }).then(res => {
                    // console.log(res.path);
                    this.globalData.headportraitframe = res.path
                    this.globalData.createHeadPortraitWxml_HeadPortraitFrameimgSrc = res.path
                    console.log("[app] 头像框本地化Canvas防错成功");
                    wx.hideLoading()
                    // this.globalData.initshowloadin = false
                    // 开屏视频
                    this.indexvideo()
                })
            })
        })
    },
    // 注册
    register() {
        wx.cloud.callFunction({
            name: "HA_register",
        }).then(res => {
            console.log(res);
            //注册成功 开始登录 openid登录
            this.login_Openid(this.globalData.openid)
            console.log("[app] 没有注册 开始注册并登录");
        })
        // const time = new Date()
        // console.log("openid:" + this.globalData.openid, "unionid:" + this.globalData.unionid);
        // user-data插入数据
        // wx.cloud.callFunction({
        //     name: "HAuserdata",
        //     data: {
        //         data: {
        //             unionid: this.globalData.unionid,
        //             openid: this.globalData.openid,
        //             nickname: "这是您的昵称",
        //             headportrait: "cloud://cloud1-8g9nn2wx1bea9f4c.636c-cloud1-8g9nn2wx1bea9f4c-1306497002/cloudbase-cms/upload/2022-05-22/gvrei21damwycgbxw17prdmi8rqoeen3_.jpeg",
        //             _createTime: time.getTime(),
        //             _updateTime: time.getTime(),
        //         }
        //     }
        // }).then(res => {
        //     // console.log(res);
        //     // user-headportraitframe-array 插入数据
        //     wx.cloud.callFunction({
        //         name: "HAuserheadPortraitFramearray",
        //         data: {
        //             data: {
        //                 unionid: this.globalData.unionid,
        //                 openid: this.globalData.openid,
        //                 used_headportraitframe_id: "b69f67c0628908f003f9b2f9681b568d",
        //                 collectionSum: 0,
        //                 array: [],
        //                 _createTime: time.getTime(),
        //                 _updateTime: time.getTime(),
        //             }
        //         }
        //     }).then(res => {
        //         // console.log(res);
        //         // console.log("HAuserheadPortraitFramearrayOk");
        //         //注册成功 开始登录 openid登录
        //         this.login_Openid(this.globalData.openid)
        //         console.log("[app] 没有注册 开始注册并登录");
        //     })
        // })
    },
    /***********************4.获取图标icon**************************************************/
    HGsystemiconAll() {
        wx.cloud.callFunction({
            name: "HGsystemiconAll",
        }).then(res => {
            // console.log(res);
            console.log("[app] 获取图标图片成功");
            this.globalData.systemIcon = res.result.data
        })
    },
    /*******************5.例如压缩解决默认头像（有大部分空白背景）的在Canvas中的创建异常********************************************/
    createHeadPortraitImgInit() {
        wx.compressImage({
            src: this.globalData.createHeadPortraitWxml_HeadPortraitimgSrc, // 图片路径
            quality: 100 // 压缩质量
        }).then(res => {
            // console.log(res);
            this.globalData.createHeadPortraitWxml_HeadPortraitimgSrc = res.tempFilePath
            console.log("[app] 压缩默认头像解决空白背景报错");
        })
    },
    indexvideo() {
        wx.getStorage({
            key: "indexvideo",
            success(res) {
                console.log("[app] 首屏视频:" + JSON.parse(res.data))
                if (JSON.parse(res.data) == true) {
                    wx.navigateTo({
                        url: '/pages/index/index',
                    })
                }
            },
            fail(err) {
                console.log(err);
                wx.setStorage({
                    key: "indexvideo",
                    data: false
                })
            }
        })
    },
    loginRecord() {
        const d = new Date()
        const time = d.getTime()
        wx.getStorage({
            key: "loginRecord",
            success(res) {
                let a = JSON.parse(res.data)
                a.unshift(time)
                wx.setStorage({
                    key: "loginRecord",
                    data: JSON.stringify(a)
                })
            },
            fail(err) {
                console.log(err);
                const a = [time]
                wx.setStorage({
                    key: "loginRecord",
                    data:JSON.stringify(a)
                })
            }
        })
    }
})