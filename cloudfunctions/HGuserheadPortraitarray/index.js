// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database()
    const _ = db.command
    if (event.type == "check") {
        const data = (await db.collection('user-headPortrait-array').where({
            openid: event.openid,
            array: _.all([event._id])
        }).field({
            array: true
        }).get()).data
        return data.length
    } else if (event.type == "checkgather") {
        const data = (await db.collection('user-headPortrait-array').where({
            openid: event.openid,
            gather: _.all([event._id])
        }).field({
            gather: true
        }).get()).data
        return data.length
    } else {
        return db.collection('user-headPortrait-array').where({
            openid: event.openid,
        }).get()
    }
}