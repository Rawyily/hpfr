if (this.data.all_end == false && this.data.all_loading == false) {
    this.setData({
        all_loading: true
    })
    wx.cloud.callFunction({
        name: "H_infringement",
        data: {
            getAllInfringement: true,
            skip: this.data.all_skip,
            limit: this.data.all_limit,
            openid: app.globalData.openid
        }
    }).then(res => {
        console.log(res);
        let a = res.result
        for (let i = 0; i < res.result.length; i++) {
            const t = ymd(res.result[i]._createTime)
            a[i].createTimeY = t[0]
            a[i].createTimeM = t[1]
            a[i].createTimeD = t[2]
        }
        this.setData({
            allInfringement: [...this.data.allInfringement, ...a],
            all_skip: this.data.all_skip + res.result.length
        })
        if (res.result.length < this.data.all_limit) {
            this.setData({
                all_end: true
            })
        }
        console.log(a);
    }).finally(res => {
        this.setData({
            all_loading: false
        })
    })
}