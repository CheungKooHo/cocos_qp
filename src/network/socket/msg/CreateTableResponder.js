/**
 * Created by zhoufan on 2016/6/24.
 */
var CreateTableResponder = BaseResponder.extend({

    loaderList:[],
    message:null,

    respond:function(message){
        this.message = message;
        cc.log("CreateTableResponder::"+JSON.stringify(message));
        //sy.scene.hideLoading();
        PopupManager.removeAll();
        var players = message.players;
        var loaderList = this.loaderList = [];
        for(var i=0;i<players.length;i++){
            cc.log("player.handcardsId =",JSON.stringify(players[i].handCardIds));
            var p = players[i];
            p.icon = WXHeadIconManager.replaceUrl(p.icon);
            var userId = p.userId;
            var icon = p.icon;
            if(SyConfig.isIos()){
                if(WXHeadIconManager.isRemoteHeadImg(icon)){
                    var hasLocal = WXHeadIconManager.hasLocalHeadImg(userId);
                    if(hasLocal)
                        p.icon = WXHeadIconManager.getHeadImgPath(userId);
                    //if(WXHeadIconManager.isHeadImgRefresh(userId,icon) || !hasLocal){
                    //    if(!WXHeadIconManager.hasLoaded(userId))
                    //        loaderList.push({userId:userId,icon:icon});
                    //}else{
                    //    p.icon = WXHeadIconManager.getHeadImgPath(userId);
                    //}
                }
            }
        }


        //GPSModel.clean();
        //GPSSdkUtil.startLocation();
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(p.gps)
                GPSModel.updateGpsData(p.userId, p.gps);
        }

        if(loaderList.length>0){
            this.loadIcon();
        }else{
            this.toRoom(message);
        }
        // var bool = PHZRoomModel
        if(message.fromOverPop == 1){//从结算弹框过来的createtable消息，重新再发个准备消息过去，防止createtable和deal消息先后顺序不对
            sySocket.sendComReqMsg(4);
        }
        GPSModel.calcDistance(PlayerModel.userId);

    },

    toRoom:function(message){
        var wanfa = message.wanfa;
        cc.log("创建房间成功 wafa ... " , wanfa);
        BaseRoomModel.curRoomData = message;
        LayerManager.inRoom = true;
        switch (wanfa){
            case 113:
            case 114://打筒子
            case 115:
            case 116:
            case 117:
            case 118:
            case 210:
            case 211:
            case 212:
                DTZRoomModel.init(message);
                if(message.isGameSite>0){
                    LayerManager.showLayer(LayerFactory.MATCH_DTZ_ROOM);
                    var layer = LayerManager.getLayer(LayerFactory.MATCH_DTZ_ROOM);
                    layer.initData();
                }else {
                    var layerName = DTZRoomModel.is4Ren() ? LayerFactory.DTZ_ROOM : LayerFactory.DTZ_3REN_ROOM;
                    if (DTZRoomModel.isMatchRoom()) {
                        layerName = LayerFactory.MATCH_DTZ_ROOM;
                    }else if(DTZRoomModel.isMoneyRoom()){
                        layerName = LayerFactory.DTZ_MONEY_ROOM;
                    }
                    LayerManager.showLayer(layerName);
                    var layer = LayerManager.getLayer(layerName);
                    layer.initData();
                }
                break;
            case 15:
            case 16://跑得快
                PDKRoomModel.init(message);
                if(message.isGameSite>0){
                    LayerManager.showLayer(LayerFactory.MATCH_PDK_ROOM);
                    var layer = LayerManager.getLayer(LayerFactory.MATCH_PDK_ROOM);
                    layer.initData();
                }else {
                    var layerName = LayerFactory.PDK_ROOM;
                    if (PDKRoomModel.isMatchRoom()) {
                        layerName = LayerFactory.MATCH_PDK_ROOM;
                    }else if(PDKRoomModel.isMoneyRoom()){
                        layerName = LayerFactory.PDK_MONEY_ROOM;
                    }
                    LayerManager.showLayer(layerName);
                    // cc.log("layerName==="+layerName)
                    var layer = LayerManager.getLayer(layerName);
                    layer.initData();
                }
                break;
            case PHZGameTypeModel.SYZP://邵阳字牌
            case PHZGameTypeModel.LDFPF://娄底放炮罚
            case PHZGameTypeModel.SYBP://邵阳剥皮
            case PHZGameTypeModel.CZZP://郴州字牌
            case PHZGameTypeModel.LYZP://耒阳字牌
            case PHZGameTypeModel.WHZ://岳阳歪胡子
            case PHZGameTypeModel.LDS://落地扫
            case PHZGameTypeModel.HYLHQ://衡阳六胡抢
            case PHZGameTypeModel.HYSHK://衡阳十胡卡
            case PHZGameTypeModel.XTPHZ://湘潭跑胡子
            case PHZGameTypeModel.XXGHZ://湘乡告胡子
            case PHZGameTypeModel.XXPHZ://湘乡跑胡子
            case PHZGameTypeModel.GLZP://桂林字牌
            case PHZGameTypeModel.LSZP://蓝山字牌
            case PHZGameTypeModel.NXPHZ://宁乡跑胡子
            case PHZGameTypeModel.SMPHZ://石门跑胡子
            case PHZGameTypeModel.CDPHZ://常德跑胡子
            case PHZGameTypeModel.HSPHZ://汉寿跑胡子
                PHZRoomModel.init(message);
                var LayerName = LayerFactory.PHZ_ROOM_MORE;
                if (message.renshu==3){
                    LayerName = LayerFactory.PHZ_ROOM;
                }else if (message.renshu==2){
                    LayerName = LayerFactory.PHZ_ROOM_LESS;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case PHZGameTypeModel.YZLC://永州老戳
                PHZRoomModel.init(message);
                var LayerName = LayerFactory.YZLC_ROOM_MORE;
                if (message.renshu==3){
                    LayerName = LayerFactory.YZLC_ROOM;
                }else if (message.renshu==2){
                    LayerName = LayerFactory.YZLC_ROOM_LESS;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case PHZGameTypeModel.HBGZP://湖北个子牌
                HBGZPRoomModel.init(message);
                var LayerName = LayerFactory.HBGZP_ROOM_MORE;
                if(message.renshu == 3) {
                    LayerName = LayerFactory.HBGZP_ROOM;
                } else if(message.renshu == 2){
                    LayerName = LayerFactory.HBGZP_ROOM_LESS;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case PHZGameTypeModel.XXEQS://湘西2710
                PHZRoomModel.init(message);
                var LayerName = LayerFactory.XXEQS_ROOM;
                if (message.renshu==2){
                    LayerName = LayerFactory.XXEQS_ROOM_LESS;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case PHZGameTypeModel.ZHZ://捉红字
                PHZRoomModel.init(message);
                var LayerName = LayerFactory.ZHZ_ROOM_MORE;
                if (message.renshu==3){
                    LayerName = LayerFactory.ZHZ_ROOM;
                }else if (message.renshu==2){
                    LayerName = LayerFactory.ZHZ_ROOM_LESS;
                }
                //cc.log("LayerName========"+LayerName)
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case PHZGameTypeModel.AHPHZ://安化跑胡子
                PHZRoomModel.init(message);
                LayerName = LayerFactory.AHPHZ_ROOM;
                if (message.renshu==2){
                    LayerName = LayerFactory.AHPHZ_ROOM_LESS;
                }
                //cc.log("LayerName========"+LayerName)
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case PHZGameTypeModel.YZCHZ://永州扯胡子
                PHZRoomModel.init(message);
                LayerName = LayerFactory.YZCHZ_ROOM;
                if (message.renshu==2){
                    LayerName = LayerFactory.YZCHZ_ROOM_LESS;
                }
                //cc.log("LayerName========"+LayerName)
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case PHZGameTypeModel.ZZPH://株洲碰胡
                PHZRoomModel.init(message);
                LayerName = LayerFactory.ZZPH_ROOM;
                if (message.renshu==2){
                    LayerName = LayerFactory.ZZPH_ROOM_LESS;
                }else if (message.renshu==4){
                    LayerName = LayerFactory.ZZPH_ROOM_MORE;
                }
                //cc.log("LayerName========"+LayerName)
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case 131:
                BBTRoomModel.init(message);
                var LayerName = LayerFactory.BBT_ROOM;
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case 91:
            case 92:
                DdzRoomModel.init(message);
                var LayerName = LayerFactory.DDZ_ROOM;
                if(DdzRoomModel.isMoneyRoom()){
                    LayerName = LayerFactory.DDZ_MONEY_ROOM;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case MJWanfaType.ZZMJ:
                MJRoomModel.init(message);
                var LayerName = LayerFactory.ZZMJ_ROOM;
                if(message.renshu == 3) {
                    LayerName = LayerFactory.ZZMJ_ROOM_THREE;
                } else if(message.renshu == 2){
                    LayerName = LayerFactory.ZZMJ_ROOM_TWO;
                }
                cc.log("message.renshu",message.renshu);
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case MJWanfaType.HZMJ:
            case MJWanfaType.DZMJ:
                MJRoomModel.init(message);
                var LayerName = LayerFactory.HZMJ_ROOM;
                if(message.renshu == 3) {
                    LayerName = LayerFactory.HZMJ_ROOM_THREE;
                } else if(message.renshu == 2){
                    LayerName = LayerFactory.HZMJ_ROOM_TWO;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case MJWanfaType.BSMJ:
            case MJWanfaType.DHMJ:
                MJRoomModel.init(message);
                var LayerName = LayerFactory.BSMJ_ROOM;
                if(message.renshu == 3) {
                    LayerName = LayerFactory.BSMJ_ROOM_THREE;
                } else if(message.renshu == 2){
                    LayerName = LayerFactory.BSMJ_ROOM_TWO;
                }
               LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case MJWanfaType.CSMJ:
            case MJWanfaType.TDH:
            case MJWanfaType.TJMJ:
            case MJWanfaType.GDCSMJ:
            case MJWanfaType.TCMJ:
            case MJWanfaType.NYMJ:
                MJRoomModel.init(message);
                var LayerName = LayerFactory.CSMJ_ROOM;
                if(message.renshu == 3) {
                    LayerName = LayerFactory.CSMJ_ROOM_THREE;
                } else if(message.renshu == 2){
                    LayerName = LayerFactory.CSMJ_ROOM_TWO;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case MJWanfaType.NXMJ:
                MJRoomModel.init(message);
                var LayerName = LayerFactory.NXMJ_ROOM;
                if(message.renshu == 3) {
                    LayerName = LayerFactory.NXMJ_ROOM_THREE;
                } else if(message.renshu == 2){
                    LayerName = LayerFactory.NXMJ_ROOM_TWO;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case MJWanfaType.YJMJ:
                MJRoomModel.init(message);
                var LayerName = LayerFactory.YJMJ_ROOM;
                if(message.renshu == 3) {
                    LayerName = LayerFactory.YJMJ_ROOM_THREE;
                } else if(message.renshu == 2){
                    LayerName = LayerFactory.YJMJ_ROOM_TWO;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();

                break;
            case PHZGameTypeModel.NXGHZ://南县鬼胡子
                PHZRoomModel.init(message);
                var LayerName = LayerFactory.NXGHZ_ROOM;

                if (message.renshu==2){
                    LayerName = LayerFactory.NXGHZ_ROOM_LESS;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case PHZGameTypeModel.YJGHZ://鬼胡子
                PHZRoomModel.init(message);
                var LayerName = LayerFactory.YJGHZ_ROOM;

                if (message.renshu==2){
                    LayerName = LayerFactory.YJGHZ_ROOM_LESS;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case MJWanfaType.AHMJ:
            case MJWanfaType.CXMJ:
            case MJWanfaType.KWMJ:
            case MJWanfaType.TCPFMJ:
            case MJWanfaType.TCDPMJ:
            case MJWanfaType.YYNXMJ:
                MJRoomModel.init(message);
                var LayerName = LayerFactory.AHMJ_ROOM;
                if(message.renshu == 3) {
                    LayerName = LayerFactory.AHMJ_ROOM_THREE;
                } else if(message.renshu == 2){
                    LayerName = LayerFactory.AHMJ_ROOM_TWO;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case MJWanfaType.SYMJ:
                MJRoomModel.init(message);
                var LayerName = LayerFactory.SYMJ_ROOM;
                if(message.renshu == 3) {
                    LayerName = LayerFactory.SYMJ_ROOM_THREE;
                } else if(message.renshu == 2){
                    LayerName = LayerFactory.SYMJ_ROOM_TWO;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case MJWanfaType.YZWDMJ:
                MJRoomModel.init(message);
                var LayerName = LayerFactory.YZWDMJ_ROOM;
                if(message.renshu == 3) {
                    LayerName = LayerFactory.YZWDMJ_ROOM_THREE;
                } else if(message.renshu == 2){
                    LayerName = LayerFactory.YZWDMJ_ROOM_TWO;
                }
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData();
                break;
            case SDHGameType.XTSDH:
            case SDHGameType.XTBP:
                SDHRoomModel.init(message);

                var layerName = "SDH_ROOM";
                if(wanfa == SDHGameType.XTBP){
                    layerName = "XTBP_ROOM";
                }
                var layer = LayerManager.showLayer(layerName);
                layer.handleTableData(SDHTabelType.CreateTable,message);
                break;
            case DTGameType.DT:
                DTRoomModel.init(message);
                var layer = LayerManager.showLayer("DT_ROOM");
                layer.handleTableData(DTTabelType.CreateTable,message);
                break;
            case QfGameType.QF:
                var curLayerName = LayerManager.getCurrentLayer();
                QFRoomModel.init(message);
                var LayerName = LayerFactory.QF_ROOM;
                LayerManager.showLayer(LayerName);
                var layer = LayerManager.getLayer(LayerName);
                layer.initData(curLayerName == LayerFactory.LOGIN);
                break;
            case NSBGameType.NSB:
                NSBRoomModel.init(message);
                var layer = LayerManager.showLayer("NSB_ROOM");
                layer.handleTableData(NSBTabelType.CreateTable,message);
                break;
            case YYBSGameType.YYBS:
                YYBSRoomModel.init(message);
                var layer = LayerManager.showLayer("YYBS_ROOM");
                layer.handleTableData(YYBSTabelType.CreateTable,message);
                break;
            case TCGDGameType.TCGD:
                TCGDRoomModel.init(message);
                var layer = LayerManager.showLayer("TCGD_ROOM");
                layer.handleTableData(TCGDTabelType.CreateTable,message);
                break;
            case HSTHGameType.HSTH:
                HSTHRoomModel.init(message);
                var layer = LayerManager.showLayer("HSTH_ROOM");
                layer.handleTableData(HSTHTabelType.CreateTable,message);
                break;
        }
        IMSdkUtil.sdkApplyMessageKey("");


    },

    loadIcon:function(){
        if(this.loaderList.length<=0){
            this.toRoom(this.message);
            return;
        }
        var obj = this.loaderList.pop();
        WXHeadIconManager.saveFile(obj.userId,obj.icon,this.loadIcon,this);
        cc.log("weixinIconMsg..." , JSON.stringify(obj.icon));
    }
})
