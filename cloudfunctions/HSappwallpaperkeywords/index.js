// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database()
    const dbc = db.collection("app-wallpaper-keywords")
    const _ = db.command
    const {
        _id,
        type
    } = event
    if (type == "inc") {
        dbc.doc(_id).update({
            data: {
                numberofuse: _.inc(1)
            }
        }).then(res => {
            return "numberofuse: _.inc(1)"
        })
    } else {

    }

}