// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const {openid,type,hp_id,gather_id} = event
    const db = cloud.database()
    const _ = db.command
    if (type == "addcollection") {
        return db.collection('user-headPortrait-array').where({
            openid
        }).update({
            data: {
                collectionSum:_.inc(1),
                array:_.unshift(hp_id)
            }
        }).then(res=>{
            console.log(res);
        })
    } else if(type == "cancelcollection"){
        return db.collection('user-headPortrait-array').where({
            openid
        }).update({
            data: {
                collectionSum:_.inc(-1),
                array:_.pull(hp_id)
            }
        }).then(res=>{
            console.log(res);
        })
    }else if(type == "addgather"){
        return db.collection('user-headPortrait-array').where({
            openid
        }).update({
            data: {
                collectionGatherSum:_.inc(1),
                gather:_.unshift(gather_id)
            }
        }).then(res=>{
            console.log(res);
        })
    }else if(type == "cancelgather"){
        return db.collection('user-headPortrait-array').where({
            openid
        }).update({
            data: {
                collectionGatherSum:_.inc(-1),
                gather:_.pull(gather_id)
            }
        }).then(res=>{
            console.log(res);
        })
    }else if(type == "addmeme"){
        return db.collection('user-headPortrait-array').where({
            openid
        }).update({
            data: {
                meme:_.unshift(hp_id)
            }
        })
    }else if(type == "cancelmeme"){
        return db.collection('user-headPortrait-array').where({
            openid
        }).update({
            data: {
                meme:_.pull(hp_id)
            }
        })
    }
}