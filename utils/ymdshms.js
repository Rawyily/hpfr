module.exports = (e)=>{
    // console.log(e);
    const date = +e
    const time = new Date(date)
    const year = time.getFullYear()
    var month = time.getMonth()+1
    var day = time.getDate()
    var hours = time.getHours()
    var Minutes = time.getUTCMinutes()
    var Seconds = time.getSeconds()
    const MinutesSeconds = time.getUTCMilliseconds()
    if (month < 10) { month = '0' + month}
    if ( day < 10) {  day = '0' + day}
    if (hours < 10) { hours = '0' + hours}
    if (Minutes < 10) { Minutes = '0' + Minutes}
    if (Seconds < 10) { Seconds = '0' + Seconds}
    const ymdshms = year+'/'+month+'/'+day+' '+hours+':'+Minutes+':'+Seconds
    return [ymdshms,MinutesSeconds]
}