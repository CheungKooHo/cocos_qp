/**
 * Created by xiaofu on 2017/9/1.
 */

var MatchType = {
    FREE_MATCH:1,
    DIAMOND_MATCH:2,
    TICKET_MATCH:3
}

var MatchModel = {

    resultRank:[],

    init: function (message) {
        this.data = JSON.parse(message[0]);
        this.channelType = message[1];
        //for(var i in message){
        //    if(i=="jjs_free_pdk") {
        //        this.freeMatchData = message[i];
        //    }else if(i=="jjs_card_pdk"){
        //        this.zsMatchData = message[i];
        //    }else if(i=="jjs_ticket_pdk"){
        //        this.ticketMatchData = message[i];
        //    }
        //}
    },

    getChannelName:function(){
        var name = "";
        if(this.channelType == "liantong"){
            name = "联通专区";
        }else if(this.channelType == "yidong"){
            name = "移动专区";
        }else if(this.channelType == "dianxin"){
            name = "电信专区";
        }else if(this.channelType == "mangguo"){
            name = "芒果专区";
        }
        return name;
    },

    saveResultRank:function(param){
        this.resultRank = param;
    },

    getResultRank:function(){
        return this.resultRank;
    },

    cleanResultRank:function(){
        this.resultRank.length = 0;
    },



}
