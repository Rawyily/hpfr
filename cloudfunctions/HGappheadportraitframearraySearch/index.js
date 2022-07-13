// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const _ = cloud.database().command
    const {
        search,
        limit,
        skip
    } = event
    const data = (await cloud.database().collection('app-headPortraitFrame').where(_.or([{
            _id: search
        },
        {
            name: search
        },
        {
            name: " "+search
        }
    ])).orderBy('_createTime', 'desc').limit(limit).skip(skip).get()).data
    return data
}