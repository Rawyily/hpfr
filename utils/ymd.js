module.exports = (e)=>{
    // console.log(e);
    const date = +e
    const time = new Date(date)
    const year = time.getFullYear()
    var month = time.getMonth()+1
    var day = time.getDate()
    return [year,month,day]
}