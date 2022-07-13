module.exports = (e) => {
    // console.log(e);
    const date = +e
    const time = new Date(date)
    const year = time.getFullYear()
    var month = time.getMonth() + 1
    var day = time.getDate()
    var hours = time.getHours()
    var Minutes = time.getUTCMinutes()
    var Seconds = time.getSeconds()
    const MinutesSeconds = time.getUTCMilliseconds()

    let hoursname = undefined
    let hour = +time.getHours()
    console.log(hour);
    if (0 <= hour && hour < 5) {
        hoursname = "凌晨"
    } else if (5 <= hour && hour < 8) {
        hoursname = "早上"
    } else if (8 <= hour && hour < 11) {
        hoursname = "上午"
    } else if (11 <= hour && hour < 13) {
        hoursname = "中午"
    } else if (13 <= hour && hour < 17) {
        hoursname = "下午"
    } else if (17 <= hour && hour < 18) {
        hoursname = "傍晚"
    } else if (18 <= hour && hour < 24) {
        hoursname = "晚上"
    }

    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    if (hours < 10) {
        hours = '0' + hours
    }
    if (Minutes < 10) {
        Minutes = '0' + Minutes
    }
    if (Seconds < 10) {
        Seconds = '0' + Seconds
    }

    const ymdshms = year + '-' + month + '-' + day + '  ' + hoursname + '  ' + hours + ':' + Minutes + ':' + Seconds
    return ymdshms
}