// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const {file,nickname} = event
    const tmppath = "/tmp/"+openid+nickname+".jpeg"
    await fs.writeFile(tmppath,file,'base64',(err)=>{
    })
    const fileStream = await fs.createReadStream(tmppath)
    const fileID = await cloud.uploadFile({
      cloudPath: "HUuserdataheadportraitFile/"+openid+".jpeg",
      fileContent: fileStream,
    })
    await cloud.database().collection('user-data').where({
        openid
    }).update({
        data:{
            nickname:nickname,
            headportrait:fileID.fileID
        }
    })
    const avatarUrl = fileID.fileID
    cloud.database().collection('user-getUserProfile').add({
        data: {
            nickname:nickname,
            avatarUrl
        }
    })
    return [event,fileID.fileID,avatarUrl]

}