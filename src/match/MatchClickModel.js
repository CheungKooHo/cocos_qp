/**
 * Created by Administrator on 2016/6/24.
 */
var MatchClickModel = {
    matchType:0,            //上次点击比赛场的类型
    keyId:0,          //上次点击比赛场的id
    isFromShareMatch:false,     //是否分享
    isCanSend:false,   //是否可以发请求
    ischangeSever:false,   //是否切服

    clearClubData:function(){
        this.matchType =  0;
        this.keyId = 0;
        this.isFromShareMatch = false;
        this.isCanSend = false;
    },

    init:function(data){
        this.clearClubData();
        this.matchType = data.matchType;
        this.keyId = data.keyId;
        this.isFromShareMatch = data.isShare || false;
        this.ischangeSever = false;
        this.isCanSend = false;
    },

    //设置需要发送数据的标识
    setIsSendMatchMsg:function(_bool){
        this.isCanSend = _bool;
    },

    //是否需要发送数据
    isNeedSendMsg:function(){
        return this.isCanSend;
    },

}