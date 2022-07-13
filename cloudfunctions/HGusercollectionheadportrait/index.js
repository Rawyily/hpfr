// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})


// 云函数入口函数
exports.main = async (event, context) => {
    const {type,openid} = event
    const db = cloud.database()
    const dbc = db.collection('app-headPortrait')
    if (type == "mycollection") {
        return (await db.collection("user-headPortrait-array").where({
            openid
        }).field({
            array:true,
            gather:true
        }).get()).data
    }
}