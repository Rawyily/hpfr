// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database()
    const _ = db.command
    const {
        type,
        _id
    } = event
    if (type == "addbrowse") {
        db.collection('app-headPortrait').doc(_id).update({
            data: {
                browse: _.inc(1)
            }
        }).then(res=>{
            return "browse: _.inc(1)"
        })
    } else if (type == "addcollection") {
        db.collection('app-headPortrait').doc(_id).update({
            data: {
                collection: _.inc(1)
            }
        }).then(res=>{
            return "collection: _.inc(1)"
        })
    } else if (type == "cancelcollection") {
        db.collection('app-headPortrait').doc(_id).update({
            data: {
                collection: _.inc(-1)
            }
        }).then(res=>{
            return "collection: _.inc(-1)"
        })
    } else if (type == "addcreate") {
        db.collection('app-headPortrait').doc(_id).update({
            data: {
                create: _.inc(1)
            }
        }).then(res=>{
            return "create: _.inc(1)"
        })
    } else if (type == "adddownload") {
        db.collection('app-headPortrait').doc(_id).update({
            data: {
                download: _.inc(1)
            }
        }).then(res=>{
            return "download: _.inc(1)"
        })
    } else {
        return "error: type is unknow !"
    }
    return event
}