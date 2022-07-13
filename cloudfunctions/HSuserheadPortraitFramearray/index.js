// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    if (event.type == "add") {
        const _ = cloud.database().command
        cloud.database().collection('user-headPortraitFrame-array').where({
            openid:event.openid
        }).update({
            data: {
                collectionSum:_.inc(1),
                array:_.unshift(event._id)
            }
        }).then(res=>{
            console.log(res);
        })
    } else if(event.type == "del"){
        const _ = cloud.database().command
        cloud.database().collection('user-headPortraitFrame-array').where({
            openid:event.openid
        }).update({
            data: {
                collectionSum:_.inc(-1),
                array:_.pull(event._id)
            }
        }).then(res=>{
            console.log(res);
        })
    }else if(event.type == "upUse"){
        cloud.database().collection('user-headPortraitFrame-array').doc(event._id).update({
            data: {
                used_headportraitframe_id:event.headportraitframe_id
            }
        }).then(res=>{
            console.log(res);
        })
    }
}