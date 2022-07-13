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
        _id
    } = event
    db.collection('app-headportrait-keywords').doc(_id).update({
        data: {
            sum: _.inc(1)
        }
    }).then(res => {
        return "sum: _.inc(1)"
    })
}