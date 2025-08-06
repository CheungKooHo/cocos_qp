/**
 * Created by Administrator on 2016/6/27.
 */
var ClosingInfoModel = {
    ext:null,
    isReplay:false,
    closingPlayers:[],
    cards:[],//牌
    leftCards:[],//剩下的牌
    tun:0,//囤数
    fan:0,//番数
    huxi:0,//胡息
    huSeat:0,//胡的人座位号
    huCard:0,//胡的牌
    totalTun:0,
    fanTypes:[],
    round:0,
    ascore:0,
    bscore:0,
    cscore:0,
    addScore:0,
    gotoBigResult:false,
    clubResultCoinData:[],
}
var ClosingInfoResponder = BaseResponder.extend({

    respond:function(message){
        cc.log("ClosingInfoResponder::"+JSON.stringify(message));
        //if(message.bird && message.bird.length>0){
        //    MJRoomModel.overNiaoIds = message.bird;
        //    MJRoomModel.overNiaoSeats = message.birdSeat;
        //}
        var players = message.closingPlayers;
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(WXHeadIconManager.isRemoteHeadImg(p.icon)){
                p.icon = WXHeadIconManager.replaceUrl(p.icon);
                if(WXHeadIconManager.hasLocalHeadImg(p.userId)){
                    p.icon = WXHeadIconManager.getHeadImgPath(p.userId);
                }
            }
        }
        ClosingInfoModel.ext = message.ext;
        ClosingInfoModel.isReplay = false;
        ClosingInfoModel.closingPlayers = message.closingPlayers;
        ClosingInfoModel.cutCard = message.cutDtzCard || [];
        QFRoomModel.overbird = message.bird || [];
        ClosingInfoModel.round = message.ext[4];
        ClosingInfoModel.ascore = message.ext[5];
        ClosingInfoModel.bscore = message.ext[6];
        ClosingInfoModel.groupLogId = message.groupLogId||0;//俱乐部名片id
        var extIndex = 7;
        if (players.length == 3) {
            ClosingInfoModel.cscore = message.ext[extIndex];
            extIndex++;
        }
        ClosingInfoModel.gotoBigResult = message.wanfa == 190?message.ext[6]:message.ext[extIndex];
        ClosingInfoModel.pdkcutCard = message.cutCard || [];
        var wanfa = message.wanfa;

        cc.log("CloseInfoResponder wanfa..." , wanfa);
        if(message.isBreak){
            if(wanfa == 8){
                var mc = new DTZBigResultPop(message.closingPlayers);
                PopupManager.addPopup(mc);
            }else if(wanfa == 1){
                var mc = new PDKBigResultPop(message.closingPlayers);
                PopupManager.addPopup(mc);
            }else if(wanfa == 10){
                var mc = new BBTBigResultPop(message.closingPlayers);
                PopupManager.addPopup(mc);
            }else if(wanfa == 190){
                var mc = new QFBigResultPop(message.closingPlayers);
                PopupManager.addPopup(mc);
            }
        }else{
            SyEventManager.dispatchEvent(SyEvent.OVER_PLAY , message.closingPlayers);
        }

        SyEventManager.dispatchTableEvent(SDHTabelType.OnOver,message);

        //解散房间有时候提前进入大厅，没有弹出大结算，这里处理下
        if(ClubRecallDetailModel.isSDHWanfa(wanfa) && message.isBreak){
            PopupManager.removeAll();
            var BigResultLayer = SDHRoomModel.getBigResultLayer();
            var layer = new BigResultLayer(message);
            PopupManager.addPopup(layer);
        }

        if(ClubRecallDetailModel.isDTWanfa(wanfa) && message.isBreak){
            PopupManager.removeAll();
            var SmallResultLayer = DTRoomModel.getSamllResultLayer();
            var layer = new SmallResultLayer(message);
            PopupManager.addPopup(layer,1);
        }

        if(wanfa == NSBGameType.NSB && message.isBreak){
            PopupManager.removeAll();
            var BigResultLayer = NSBRoomModel.getBigResultLayer();
            var layer = new BigResultLayer(message);
            PopupManager.addPopup(layer);
        }

        if(wanfa == YYBSGameType.YYBS && message.isBreak){
            PopupManager.removeAll();
            var BigResultLayer = YYBSRoomModel.getBigResultLayer();
            var layer = new BigResultLayer(message);
            PopupManager.addPopup(layer);
        }

        if(wanfa == TCGDGameType.TCGD && message.isBreak){
            PopupManager.removeAll();
            var BigResultLayer = TCGDRoomModel.getBigResultLayer();
            var layer = new BigResultLayer(message);
            PopupManager.addPopup(layer);
        }

        if(wanfa == HSTHGameType.HSTH && message.isBreak){
            PopupManager.removeAll();
            var BigResultLayer = HSTHRoomModel.getBigResultLayer();
            var layer = new BigResultLayer(message);
            PopupManager.addPopup(layer);
        }
    }
})