// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {

    const {
        type,
        isAcross,
        _id
    } = event
    const db = cloud.database()
    const dbc_id_a = db.collection('app-wallpaper-across').doc(_id)
    const dbc_id_v = db.collection('app-wallpaper-vertical').doc(_id)
    const _ = db.command
    const fun = (e) => {
        const dbc_id = e
        if (type == "addbrowse") {
            dbc_id.update({
                data: {
                    browse: _.inc(1)
                }
            })
        } else if (type == "addcollection") {
            dbc_id.update({
                data: {
                    collection: _.inc(1)
                }
            })
        } else if (type == "cancelcollection") {
            dbc_id.update({
                data: {
                    collection: _.inc(-1)
                }
            })
        } else if (type == "addlike") {
            dbc_id.update({
                data: {
                    like: _.inc(1)
                }
            })
        } else if (type == "cancellike") {
            dbc_id.update({
                data: {
                    like: _.inc(-1)
                }
            })
        } else if (type == "adddownload") {
            dbc_id.update({
                data: {
                    download: _.inc(1)
                }
            })
        } else if(type == "addsetbackgroundimage"){
            dbc_id.update({
                data: {
                    setbackgroundimage: _.inc(1)
                }
            })
        }
    }
    if (isAcross) {
        fun(dbc_id_a)
    } else {
        fun(dbc_id_v)
    }
    return event
}