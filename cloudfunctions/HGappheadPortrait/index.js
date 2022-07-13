// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database()
    const _ = db.command
    const dbc = db.collection('app-headPortrait')
    const {
        where,
        limit,
        skip,
        type,
        name
    } = event
    if (type == "all") {
        return (await dbc.orderBy('_createTime', 'desc').limit(limit).skip(skip).get()).data
    } else if (type == "classify") {
        return (await dbc.where({
            classify: _.all([name])
        }).orderBy('_createTime', 'desc').limit(limit).skip(skip).get()).data
    } else if (type == "keywords") {
        return (await dbc.where({
            keywords: _.all([name])
        }).orderBy('_createTime', 'desc').limit(limit).skip(skip).get()).data
    } else if (type == "search") {
        if (name.length == 32) {
            const hp = (await dbc.doc(name).get()).data
            return [[], [hp]]
        }
        const gather = (await db.collection('app-headportrait-gather').where({
            name: name
        }).orderBy('_createTime', 'desc').get()).data
        const hp = (await dbc.where(_.or([{
                classify: _.all([name])
            },
            {
                keywords: _.all([name])
            }
        ])).orderBy('_createTime', 'desc').limit(limit).skip(skip).get()).data
        return [gather, hp]
    }
}