// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (event, context) => {
    const {
        limit,
        skip,
        type,
        array,
        idTransfromGather
    } = event
    if (type) {
        const db = cloud.database()
        var data = await []
        for (let i = 0; i < array.length; i++) {
            const newdata = (await db.collection('app-headPortrait').doc(array[i]).get()).data
            data.push(newdata)
        }
        return data
    } else if (idTransfromGather) {
        var data = await []
        for (let i = 0; i < array.length; i++) {
            const one = (await cloud.database().collection("app-headportrait-gather").doc(array[i]).get()).data
            data.push(one)
        }
        return data 
    } else {
        return (await cloud.database().collection('app-headportrait-gather').orderBy('_updateTime', 'desc').limit(limit).skip(skip).get()).data
    }
}