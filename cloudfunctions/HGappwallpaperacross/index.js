// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

// 云函数入口函数
exports.main = async (event, context) => {
    const {type,limit,skip,search} = event
    const _ = cloud.database().command
    const dbc = cloud.database().collection('app-wallpaper-across')
    if (type == "all") {
        return (await dbc.orderBy("_updateTime",'desc').limit(limit).skip(skip).get()).data
    } else if(type == "search"){
        if (search.length == 32) {
            return (await dbc.where({
                _id:search
            }).get()).data
        }
        return (await dbc.where(_.or([
            {
                name: _.all([search])
            },
            {
                keywords: _.all([search])
            }
        ])).orderBy("_updateTime",'desc').limit(limit).skip(skip).get()).data
    }
    
}