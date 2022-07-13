// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database()
    const _ = db.command
    const dbc = db.collection('user-wallpaper-array')
    if (event.type == "check" && event.isAcross == true) {
        const data = (await dbc.where({
            openid: event.openid,
            myacross: _.all([event._id])
        }).get()).data
        return data.length
    } else if (event.type == "check" && event.isAcross == false) {
        const data = (await dbc.where({
            openid: event.openid,
            myvertical: _.all([event._id])
        }).get()).data
        return data.length
    } else {
        return dbc.where({
            openid: event.openid,
        }).get()
    }
}