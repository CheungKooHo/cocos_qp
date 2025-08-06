/**
 * Created by zhoufan on 2016/7/23.
 */
/**
 * 卡牌的数据映射
 * @type {{userId: number, name: string, seat: number, sex: number, icon: string, point: number, status: number, ip: string}}
 */
var RoomPlayerVo = {
    userId:0,
    name:0,
    seat:0,
    sex:0,
    icon:"",
    point:0,
    status:0,
    handCardIds:null,
    outCardIds:null,
    recover:null,
    ip:"",
    outedIds:null,
    moldIds:null,
    angangIds:null,
    ext:[]
};

var RoomModel = {
    seatSeq:{
        1:[1,2,3],
        2:[2,3,1],
        3:[3,1,2]
    },
    tableId:0,
    nowBurCount:0,
    totalBurCount:0,
    /**
     * {Array.<RoomPlayerVo>}
     */
    players:[],
    mySeat:0,
    nextSeat:0,
    btMap:{},
    promptCardPattern:null,
    wanfa:0,
    renshu:0,
    _playersIp:[],
    ipSameTipStr:null,
    isStart:false,
    ext:[],
    isGameSite:0,//是否比赛场
    gameSiteRound:0,// 比赛场当前轮数
    promotionNum:0,// 晋级人数
    integralTimes:0,// 倍数加成
    roundNumber:0,   // 当前轮参赛人数
    gameSiteMaxRound:0,//比赛场最大轮数
    init:function(message){
        //{"tableId":"100001","nowBurCount":1,"totalBurCount":10,"players":[{"userId":"999","name":"test","seat":3,"sex":1,"icon":"123","point":0,"handCardIds":[],"outCardIds":[]}],"nextSeat":null}
        this.wanfa = message.wanfa;
        this.renshu = message.renshu;
        if(this.renshu==2){
            this.seatSeq = {1:[1,2],2:[2,1]};
        }else{
            this.seatSeq = {1:[1,2,3],2:[2,3,1],3:[3,1,2]};
        }
        AI.MAX_CARD = this.wanfa;
        this.tableId = message.tableId;
        this.nowBurCount = message.nowBurCount;
        this.totalBurCount = message.totalBurCount;
        this.players = message.players;
        this.ext=message.ext;
        this.isStart = false;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.userId == PlayerModel.userId){
                var ids = p.handCardIds;
                var cardIds = [];
                for(var j=0;j<ids.length;j++){
                    cardIds.push(AI.getCardDef(ids[j]));
                }
                p.handCardIds = cardIds;
                if(p.handCardIds.length>0 || p.outCardIds.length>0){
                    this.isStart = true;
                }
                break;
            }
        }
        this.nextSeat = message.nextSeat;
        this.isGameSite = 0;
        //比赛场信息
        if(message.matchExt){
            this.isGameSite = message.matchExt[0];
            this.gameSiteRound = message.matchExt[1];
            this.promotionNum = message.matchExt[2];
            this.integralTimes = message.matchExt[3];
            this.roundNumber = message.matchExt[4];
            this.gameSiteMaxRound = message.matchExt[5];
        }
        this.mySeat = this.getPlayerVo().seat;
        this.cleanData();
        //if(this.players.length>1 && this.isIpSame() && !this.isStart && (this.nowBurCount==1)){//第一局是否开始
        //    this.showTipsIpSame();
        //}
    },

    updateGPS:function(userId,gps){
        var p = this.getPlayerVo(userId);
        p.gps = gps;
    },

    baoting:function(seat){
        this.btMap[seat] = 1;
    },

    isNextSeatBt:function(){
        var nextSeat = this.seatSeq[this.mySeat][1];
        if(this.btMap[nextSeat])
            return true;
        return false;
    },

    isShowCardNumber:function(){
        return this.ext[0]==1;
    },
    /**
     * 上一次提示出牌的数据
     * @param cardPattern {CardPattern}
     */
    prompt:function(cardPattern){
        this.promptCardPattern = cardPattern;
    },

    /**
     * 获取player对象
     * @param userId
     * @returns {RoomPlayerVo}
     */
    getPlayerVo:function(userId){
        userId = userId || PlayerModel.userId;
        var player = null;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.userId == userId){
                player = p;
                break;
            }
        }
        return player;
    },
    /**
     * 获取player对象
     * @param userId
     * @returns {RoomPlayerVo}
     */
    getPlayerVoBySeat:function(seat){
        var player = null;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.seat == seat){
                player = p;
                break;
            }
        }
        return player;
    },
    /**
     * player对象与其他人IP是否有相同
     * @param userId
     * @returns {RoomPlayerVo}
     */
    isIpSame:function(){
        this._playersIp.length = 0;
        this.ipSameTipStr = "";
        var sameIp = null;
        var val = 0;
        var ipSameTipStr = "";
        for(var i=0;i<this.players.length;i++){
            this._playersIp.push(this.players[i].ip);
        }
        var clone = ArrayUtil.clone(this._playersIp);
        for(var i=0;i<this.players.length-1;i++){
            var p = this.players[i];
            if(sameIp == p.ip)
                continue;
            for(var j=i;j<clone.length;j++){
                if(p.ip == clone[j]){
                    ipSameTipStr += "\n"+this.players[j].ip+"  "+this.players[j].name;
                    val += 1;
                }
            }
            if(val == 1){
                ipSameTipStr = "";
            }else{
                sameIp = p.ip;
            }
            this.ipSameTipStr += ipSameTipStr;
            val = 0;
            ipSameTipStr = "";
        }
        if(sameIp){
            return true;
        }else{
            return false;
        }
    },

    //IP相同提示信息
//    showTipsIpSame:function(){
//        AlertPopRichText.show("res/alertPop.json","发现相同IP玩家，是否解散房间？",this.ipSameTipStr,function(){
//            sySocket.sendComReqMsg(21);
//        },function(){
////  		sySocket.sendComReqMsg(4);
//        },false,true);
//    },

    /**
     *
     * @param player {RoomPlayerVo}
     * @return
     */
    join:function(player){
        if(this.players.length>=3)
            return;
        var isHas = false;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.userId == player.userId){
                isHas = true;
                break;
            }
        }
        if(!isHas){
            this.players.push(player);
            SyEventManager.dispatchEvent(SyEvent.JOIN_ROOM,player);
        }
    },

    exitRoom:function(userId){
        var player = null;
        var index = -1;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.userId == userId){
                player = p;
                index = i;
                break;
            }
        }
        if(player){
            SyEventManager.dispatchEvent(SyEvent.EXIT_ROOM,player);
            this.players.splice(index,1);
            this._playersIp.splice(index,1);
        }
    },

    cleanData:function(){
        this.btMap = {};
        this.promptCardPattern = null;
    },

    /**
     * 发牌
     * @param message
     */
    dealCard:function(message){
        this.cleanData();
        this.nextSeat = message.nextSeat;
        for(var i=0;i<this.players.length;i++){
            var p = this.players[i];
            if(p.userId == PlayerModel.userId){
                var ids = message.handCardIds;
                var cardIds = [];
                for(var j=0;j<ids.length;j++){
                    cardIds.push(AI.getCardDef(ids[j]));
                }
                p.handCardIds = cardIds;
                SyEventManager.dispatchEvent(SyEvent.START_PLAY,p);
                break;
            }
        }
    },

    /**
     * 出牌
     */
    letOutCard:function(message){
        this.promptCardPattern = null;
        SyEventManager.dispatchEvent(SyEvent.LET_OUT_CARD,message);
    }

}