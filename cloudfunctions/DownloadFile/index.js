const cloud = require('wx-server-sdk')
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
    const fileID = event.fileID
    const {
        downloadFile,
        getTempFileURL
    } = event
    if (downloadFile) {
        const res = await cloud.downloadFile({
            fileID: fileID,
        })
        const buffer = res.fileContent
        return {
            buffer,
            res
        }
    } else if (getTempFileURL) {
        const fileList = [event.fileID]
        const result = await cloud.getTempFileURL({
            fileList: fileList,
        })
        return result.fileList
    }



}