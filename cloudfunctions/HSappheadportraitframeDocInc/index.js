// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const _ = cloud.database().command
    if (event.field == "browse") {
        cloud.database().collection('app-headPortraitFrame').doc(event._id).update({
            data: {
                browse: _.inc(1)
            }
        })
    } else if (event.field == "collection") {
        cloud.database().collection('app-headPortraitFrame').doc(event._id).update({
            data: {
                collection: _.inc(1)
            }
        })
    } else if (event.field == "use") {
        cloud.database().collection('app-headPortraitFrame').doc(event._id).update({
            data: {
                use: _.inc(1)
            }
        })
    } else {
        return "error: field is unknow !"
    }
}