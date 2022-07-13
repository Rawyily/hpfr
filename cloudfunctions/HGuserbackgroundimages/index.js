// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    if (event.mybackgrounded) {
        return (await cloud.database().collection("user-background-images").where({
            openid: event.openid
        }).field({
            mybackgrounded: true,
            _updateTime:true
        }).get()).data
    } else {
        return (await cloud.database().collection("user-background-images").where({
            openid: event.openid
        }).field({
            mybackground: true
        }).get()).data
    }
}