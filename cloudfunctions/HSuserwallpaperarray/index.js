// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const {
        openid,
        type,
        isAcross,
        _id
    } = event
    const db = cloud.database()
    const _ = db.command
    const dbcw = db.collection('user-wallpaper-array').where({
        openid
    })
    if (isAcross) {
        if (type == "addcollection") {
            return dbcw.update({
                data: {
                    acrossSum: _.inc(1),
                    myacross: _.unshift(_id)
                }
            })
        } else if (type == "cancelcollection") {
            return dbcw.update({
                data: {
                    acrossSum: _.inc(-1),
                    myacross: _.pull(_id)
                }
            })
        }
    } else {
        if (type == "addcollection") {
            return dbcw.update({
                data: {
                    verticalSum: _.inc(1),
                    myvertical: _.unshift(_id)
                }
            })
        } else if (type == "cancelcollection") {
            return dbcw.update({
                data: {
                    verticalSum: _.inc(-1),
                    myvertical: _.pull(_id)
                }
            })
        }
    }
    return event
}