// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database()
    const data = await db.collection('user-headPortraitFrame-array').doc(event._id).field({
        array: true
    }).get()
    const array = await data.data.array
    const max = await event.skip + event.limit
    // 1 3
    if (array.length < max) {
        let hpfarray = await []
        for (let i = event.skip; i < array.length; i++) {
            const hpf = (await db.collection('app-headPortraitFrame').doc(array[i]).get()).data
            hpfarray.push(hpf);
        }
        return hpfarray
    } else {
        let hpfarray = await []
        for (let i = event.skip; i < max; i++) {
            const hpf = (await db.collection('app-headPortraitFrame').doc(array[i]).get()).data
            hpfarray.push(hpf);
        }
        return hpfarray
    }
}