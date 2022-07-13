// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const {
        check_id,
        data,
        tmpPath,
        openid,
        newInfringement,
        getAllInfringement,
        getMyInfringement,
        skip,
        limit,
        getDoc,
        _id,
        del
    } = event
    const db = cloud.database()
    if (check_id) {
        const data1 = (await db.collection('app-headPortrait').where({
            _id: check_id
        }).get()).data
        if (data1 && data1.length > 0) {
            return ["headPortrait", data1]
        } else {
            const data2 = (await db.collection('app-headPortraitFrame').where({
                _id: check_id
            }).get()).data
            if (data2 && data2.length > 0) {
                return ["headPortraitFrame", data2]
            } else {
                const data3 = (await db.collection('app-wallpaper-across').where({
                    _id: check_id
                }).get()).data
                if (data3 && data3.length > 0) {
                    return ["wallpaper-across", data3]
                } else {
                    const data4 = (await db.collection('app-wallpaper-vertical').where({
                        _id: check_id
                    }).get()).data
                    if (data4 && data4.length > 0) {
                        return ["wallpaper-vertical", data4]
                    } else {
                        return null
                    }
                }
            }
        }
    } else if (tmpPath) {
        const d = new Date()
        // 时间戳
        // const time = d.getTime()
        // 日期
        const dayPath = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate() + '/'
        let filePathArray = []
        for (let i = 0; i < data.length; i++) {
            await fs.writeFile(tmpPath[i], data[i], "base64", (err) => {})
            const fileContent = await fs.createReadStream(tmpPath[i])
            const newTmpPath = tmpPath[i].replace("/tmp/", "")
            const fileID = await cloud.uploadFile({
                cloudPath: "Infringement/" + openid + "/" + dayPath + newTmpPath,
                fileContent
            })
            filePathArray[i] = await fileID.fileID
        }
        return filePathArray
    } else if (newInfringement) {
        try {
            return (await db.collection('infringement').add({
                data: newInfringement
            })).data
        } catch (error) {
            return "error"
        }

    } else if (getAllInfringement) {
        return (await db.collection("infringement").field({
            img: -1,
            text: -1,
            openid: -1,
            unionid: -1,
        }).orderBy('_updateTime', "desc").skip(skip).limit(limit).get()).data
    } else if (getMyInfringement) {
        return (await db.collection("infringement").field({
            img: -1,
            text: -1,
            openid: -1,
            unionid: -1,
        }).where({
            openid
        }).orderBy('_updateTime', "desc").skip(skip).limit(limit).get()).data
    } else if (getDoc) {
        return (await db.collection("infringement").doc(_id).field({
            img: 1,
            text: 1,
            openid: 1,
            unionid: 1,
        }).get()).data
    }else if(del){
        return (await db.collection("infringement").doc(_id).remove()).data
    }
}