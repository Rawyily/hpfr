// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = await cloud.getWXContext()
    const openid = wxContext.OPENID
    const unionid = wxContext.UNIONID
    const that_time = new Date()
    const time = that_time.getTime()
    const db = cloud.database()
    // 注册
    try {
        // 主要数据
        db.collection('user-data').add({
            data: {
                unionid,
                openid,
                nickname: "这是您的昵称",
                headportrait: "cloud://cloud1-8g9nn2wx1bea9f4c.636c-cloud1-8g9nn2wx1bea9f4c-1306497002/cloudbase-cms/upload/2022-05-22/gvrei21damwycgbxw17prdmi8rqoeen3_.jpeg",
                _createTime: time,
                _updateTime: time
            }
        })
        // 头像收藏
        db.collection('user-headPortrait-array').add({
            data: {
                unionid,
                openid,
                collectionSum: 0,
                collectionGatherSum: 0,
                array: [],
                gather: [],
                meme:[],
                _createTime: time,
                _updateTime: time
            }
        })
        // 头像框收藏
        db.collection('user-headPortraitFrame-array').add({
            data: {
                unionid,
                openid,
                used_headportraitframe_id: "b69f67c0628908f003f9b2f9681b568d",
                collectionSum: 0,
                array: [],
                _createTime: time,
                _updateTime: time
            }
        })

        // 壁纸收藏
        db.collection('user-wallpaper-array').add({
            data: {
                unionid,
                openid,
                acrossSum: 0,
                myacross: [],
                verticalSum: 0,
                myvertical: [],
                _createTime: time,
                _updateTime: time
            }
        })
        // 背景图片
        db.collection('user-background-images').add({
            data: {
                unionid,
                openid,
                mybackground: "cloud://cloud1-8g9nn2wx1bea9f4c.636c-cloud1-8g9nn2wx1bea9f4c-1306497002/HUuserbackgroundimages/ba622fe20ffb289a36c6c301621c65af.jpeg",
                mybackgrounded: [],
                _createTime: time,
                _updateTime: time
            }
        })
    } catch (error) {
        return error
    }

}