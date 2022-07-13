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
    const {file,type,datatype} = event
    const d = new Date()
    const time  = d.getTime()
    const tmpPath =await "/tmp/"+openid+"_time_"+time+"."+type
    await fs.writeFile(tmpPath,file,datatype,(err)=>{
    })
    const fileStream = await fs.createReadStream(tmpPath)
    const fileID = await cloud.uploadFile({
      cloudPath: "UpFile/"+openid+"_time_"+time+"."+type,
      fileContent: fileStream,
    })
    const cloudFileID =await fileID.fileID
    return cloudFileID
}