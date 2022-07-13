// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const data = (await cloud.database().collection('app-headPortraitFrame').where(event.where).orderBy('_createTime','desc').limit(event.limit).skip(event.skip).get()).data
    return data
}