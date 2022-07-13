// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = await cloud.getWXContext()
    const openid = wxContext.OPENID;
    const db = cloud.database()
    const $ = db.command.aggregate
    const data1 = await db.collection('user-headPortraitFrame-array').where({
        openid: openid
    }).field({
        collectionSum: 1
    }).get()
    const data2 = await db.collection('user-headPortrait-array').where({
        openid: openid
    }).field({
        collectionSum: 1,
        collectionGatherSum: 1,
    }).get()
    const data3 = await db.collection('user-wallpaper-array').where({
        openid: openid
    }).field({
        acrossSum: 1,
        verticalSum: 1,
    }).get()
    return {
        data1,data2,data3
    }
}