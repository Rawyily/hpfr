// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const {
        type,
        openid,
        original
    } = event
    const db = cloud.database()
    const _ = db.command
    const dbc = db.collection("user-background-images")
    const dbcw = dbc.where({
        openid
    })
    const d = new Date()
    const time = d.getTime()
    if (type == "upmybackground") {
        return dbcw.update({
            data: {
                mybackground: original,
                mybackgrounded:_.unshift(original),
                _updateTime:time
            }
        })
    }else if(type == "clearmybackgrounded"){
        return dbcw.update({
            data: {
                mybackgrounded:[],
                _updateTime:time
            }
        })
    }
}