/**
 * Created by xiaofu on 2017/9/1.
 */

var MatchApplyModel = {
    data:null,
    maxRenshu:0,
    curRenshu:0,
    matchType:"",
    keyId:0,
    status:0,
    shared:0,
    matchPay:null,
    award:null,

    clearClubData:function(){
        this.data = null;
        this.maxRenshu = 0;
        this.curRenshu = 0;
        this.matchType = "";
        this.keyId = 0;
        this.status = 0;
        this.shared = 0;
        this.award = null;
        this.matchPay = null;
    },

    init: function (message) {
        this.clearClubData();
        this.data = message[0];
        this.maxRenshu = this.data.maxRenshu;
        this.curRenshu = this.data.curRenshu;
        this.matchType = this.data.matchType;
        this.keyId = this.data.keyId;
        this.award = this.data.award;
        this.status = this.data.status;
        this.shared = this.data.shared || 0;
        this.matchPay = this.data.matchPay || null;
    },

    //写这个方法是为了获取钻石赛报名费用
    getPayCount: function () {
        var count = null;
        if (this.matchPay){
            if (this.matchPay.indexOf("card") != -1){
                count = this.matchPay.substring(4);
            }
        }
        return count;
    },



}
