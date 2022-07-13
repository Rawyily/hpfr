// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const {getArray,openid,isAcross,array} = event
    const db = cloud.database()
    if (getArray) {
        return (await db.collection('user-wallpaper-array').where({
            openid
        }).field({
            myacross:1,
            myvertical:1
        }).get()).data
    } else if(isAcross == true){
        var data = await []
        for (let i = 0; i < array.length; i++) {
            const newdata = (await db.collection('app-wallpaper-across').doc(array[i]).get()).data
            data.push(newdata)
        }
        return data
    }else if(isAcross == false){
        var data = await []
        for (let i = 0; i < array.length; i++) {
            const newdata = (await db.collection('app-wallpaper-vertical').doc(array[i]).get()).data
            data.push(newdata)
        }
        return data
    }
}