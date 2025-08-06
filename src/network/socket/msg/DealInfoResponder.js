/**
 * Created by Administrator on 2016/6/27.
 */
var DealInfoResponder = BaseResponder.extend({

    respond:function(message){
        //message.handCardIds = [210,110,310,409,309,209,111,106,105,114,403,204,112,311,107,307]

        if(PDKRoomModel.isMatchRoom()) {
            PopupManager.removeAll();
            //MatchModel.cleanResultRank();
        }

         //cc.log("DealInfoResponder..." , message.gameType , JSON.stringify(message));
        var gameType = message.gameType;
        if(gameType == 8){          //打筒子
            DTZRoomModel.dealCard(message);
        }else if(gameType == 1){    //跑得快
            PDKRoomModel.dealCard(message);
        }else if(gameType == 4 || gameType == PHZGameTypeModel.YJGHZ|| gameType == PHZGameTypeModel.NXGHZ){    //跑胡子
            PHZRoomModel.dealCard(message);
        }else if(gameType == 10){
            BBTRoomModel.dealCard(message);
        }else if(gameType == 7){
            DdzRoomModel.dealCard(message);
        }else if(gameType==190){
            QFRoomModel.dealCard(message);
        }else{
            MJRoomModel.dealCard(message);
        }

        SyEventManager.dispatchTableEvent(SDHTabelType.DealCard,message);
    }
})