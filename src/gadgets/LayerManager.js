/**
 * Created by zhoufan on 2016/6/24.
 */
var LayerFactory = {
    LOGIN:"res/login.json",
    HOME:"res/lobby.json",
    HALL:"res/hall.json",

    ROOM:"res/DTZroom.json",
    BBT_ROOM:"res/bbtRoom.json",

    PYQ_HALL:"res/pyqHall.json",
    PDK_ROOM:"res/pdkRoom.json",
    PDK_MONEY_ROOM:"res/pdkMoneyRoom.json",
    DTZ_ROOM:"res/DTZroom.json",
    DTZ_MONEY_ROOM:"res/DTZMoney3RenRoom.json",
    DTZ_3REN_ROOM:"res/DTZ3RenRoom.json",
    PDK_HOME:"res/pdkHome.json",
    PHZ_ROOM_MORE:"res/phzRoomMore.json",
    PHZ_ROOM_LESS:"res/phzRoom2Ren.json",
    PHZ_MONEY_ROOM:"res/phzMoneyRoom.json",
    PHZ_REPLAY:"res/phzReplay.json",
    PHZ_REPLAY_MORE:"res/phzReplayMore.json",
    PHZ_REPLAY_LESS:"res/phzReplayLess.json",
    MJ_ROOM:"res/mjRoom.json",
    DN_ROOM:"res/dnRoom.json",
    DN_ROOM_MORE:"res/dnRoomMore.json",
    PHZ_ROOM:"res/phzRoom.json",
    YZLC_ROOM:"res/yzlcRoom.json",
    YZLC_ROOM_MORE:"res/yzlcRoomMore.json",
    YZLC_ROOM_LESS:"res/yzlcRoom2Ren.json",
    HBGZP_ROOM:"res/hbgzpRoom.json",
    HBGZP_ROOM_MORE:"res/hbgzpRoomMore.json",
    HBGZP_ROOM_LESS:"res/hbgzpRoom2Ren.json",
    HBGZP_REPLAY:"res/hbgzpReplay.json",
    HBGZP_REPLAY_MORE:"res/hbgzpReplayMore.json",
    HBGZP_REPLAY_LESS:"res/hbgzpReplayLess.json",
    SEEPLAYBACK:"res/seePlayBack.json",
    BBTSEEPLAYBACK:"res/bbtseePlayBack.json",
    DTZSEEPLAYBACK_MORE:"res/DTZReplay.json",
    DTZSEEPLAYBACK:"res/DTZ3RenReplay.json",
    MATCH_PDK_ROOM:"res/matchPdkRoom.json",
    MATCH_HOME_LAYER:"res/matchHomePop.json",
    MATCH_DTZ_ROOM:"res/matchDtzRoom.json",
    DDZ_ROOM:"res/ddzRoom.json",
    DDZ_MONEY_ROOM:"res/ddzMoneyRoom.json",
    BSMJ_ROOM:"res/bsmjRoom.json",
    BSMJ_ROOM_TWO:"res/bsmjRoomTwo.json",
    BSMJ_ROOM_THREE:"res/bsmjRoomThree.json",
    BSMJ_REPLAY:"res/bsmjReplay.json",
    BSMJ_REPLAY_TWO:"res/bsmjReplayTwo.json",
    BSMJ_REPLAY_THREE:"res/bsmjReplayThree.json",
    HZMJ_ROOM:"res/hzmjRoom.json",
    HZMJ_ROOM_TWO:"res/hzmjRoomTwo.json",
    HZMJ_ROOM_THREE:"res/hzmjRoomThree.json",
    HZMJ_REPLAY:"res/hzmjReplay.json",
    HZMJ_REPLAY_TWO:"res/hzmjReplayTwo.json",
    HZMJ_REPLAY_THREE:"res/hzmjReplayThree.json",
    CSMJ_ROOM:"res/csmjRoom.json",
    CSMJ_ROOM_TWO:"res/csmjRoomTwo.json",
    CSMJ_ROOM_THREE:"res/csmjRoomThree.json",
    YJMJ_ROOM:"res/yjmjRoom.json",
    YJMJ_ROOM_TWO:"res/yjmjRoomTwo.json",
    YJMJ_ROOM_THREE:"res/yjmjRoomThree.json",
    YJGHZ_ROOM:"res/yjghzRoom.json",
    YJGHZ_ROOM_LESS:"res/yjghzRoom2Ren.json",
    AHMJ_ROOM:"res/ahmjRoom.json",
    AHMJ_ROOM_TWO:"res/ahmjRoomTwo.json",
    AHMJ_ROOM_THREE:"res/ahmjRoomThree.json",
    ZZMJ_ROOM:"res/zzmjRoom.json",
    ZZMJ_ROOM_TWO:"res/zzmjRoomTwo.json",
    ZZMJ_ROOM_THREE:"res/zzmjRoomThree.json",
    ZHZ_ROOM_MORE:"res/zhzRoomMore.json",
    ZHZ_ROOM_LESS:"res/zhzRoom2Ren.json",
    ZHZ_ROOM:"res/zhzRoom.json",
    XXEQS_ROOM_LESS:"res/xxeqsRoom2Ren.json",
    XXEQS_ROOM:"res/xxeqsRoom.json",
    NXGHZ_ROOM_LESS:"res/nxghzRoom2Ren.json",
    NXGHZ_ROOM:"res/nxghzRoom.json",
    AHPHZ_ROOM:"res/ahphzRoom.json",
    AHPHZ_ROOM_LESS:"res/ahphzRoom2Ren.json",
    YZCHZ_ROOM:"res/yzchzRoom.json",
    YZCHZ_ROOM_LESS:"res/yzchzRoom2Ren.json",
    SYMJ_ROOM:"res/symjRoom.json",
    SYMJ_ROOM_TWO:"res/symjRoomTwo.json",
    SYMJ_ROOM_THREE:"res/symjRoomThree.json",
    SYMJ_REPLAY:"res/symjReplay.json",
    SYMJ_REPLAY_TWO:"res/symjReplayTwo.json",
    SYMJ_REPLAY_THREE:"res/symjReplayThree.json",
    YZWDMJ_ROOM_TWO:"res/yzwdmjRoomTwo.json",
    YZWDMJ_ROOM_THREE:"res/yzwdmjRoomThree.json",
    YZWDMJ_ROOM:"res/yzwdmjRoom.json",
    ZZPH_ROOM_MORE:"res/zzphRoomMore.json",
    ZZPH_ROOM_LESS:"res/zzphRoom2Ren.json",
    ZZPH_ROOM:"res/zzphRoom.json",
    QF_ROOM:"res/qfRoom.json",
    QF_REPLAY:"res/qfReplay.json",
    NXMJ_ROOM:"res/nxmjRoom.json",
    NXMJ_ROOM_TWO:"res/nxmjRoomTwo.json",
    NXMJ_ROOM_THREE:"res/nxmjRoomThree.json",

    buildInst:function(name){
        var layer = null;
        //cc.log("name =",name);
        switch (name){
            case this.ROOM:
                layer = new DTZRoom(name);
                break;
            case this.DTZ_ROOM:
                layer = new DTZRoom(name);
                break;
            case this.DTZ_3REN_ROOM:
                layer = new DTZRoom(name);
                break;
            case this.DTZ_MONEY_ROOM:
                layer = new DTZMoneyRoom(name);
                break;
            case this.PDK_ROOM:
                layer = new PDKRoom();
                break;
            case this.PDK_MONEY_ROOM:
                layer = new PDKMoenyRoom();
                break;
            case this.BBT_ROOM:
                layer = new BBTRoom();
                break;
            case this.HOME:
                layer = new LobbyHomeLayer();
                break;
            case this.BJD_HOME:
                layer = new LobbyHomeLayer();
                break;
            case this.LOBBY:
                layer = new LobbyHomeLayer();
                break;
            case this.LOGIN:
                layer = new LoginLayer();
                break;
            case this.SEEPLAYBACK:
            	layer = new SeePlayBackLayer();
            	break;
            case this.BBTSEEPLAYBACK:
                layer = new BBTSeePlayBackLayer();
                break;
            case this.DTZSEEPLAYBACK:
            case this.DTZSEEPLAYBACK_MORE:
                layer = new DTZSeePlayBackLayer(name);
                break;
            case this.PHZ_ROOM:
            case this.PHZ_ROOM_MORE:
            case this.PHZ_ROOM_LESS:
                layer = new PHZRoom(name);
                break;
            case this.YZLC_ROOM:
            case this.YZLC_ROOM_MORE:
            case this.YZLC_ROOM_LESS:
                layer = new YZLCRoom(name);
                break;
            case this.ZHZ_ROOM:
            case this.ZHZ_ROOM_MORE:
            case this.ZHZ_ROOM_LESS:
                layer = new ZHZRoom(name);
                break;
            case this.XXEQS_ROOM:
            case this.XXEQS_ROOM_LESS:
                layer = new XXEQSRoom(name);
                break;
            case this.NXGHZ_ROOM:
            case this.NXGHZ_ROOM_LESS:
                layer = new NXGHZRoom(name);
                break;
            case this.AHPHZ_ROOM:
            case this.AHPHZ_ROOM_LESS:
                layer = new AHPHZRoom(name);
                break;
            case this.YZCHZ_ROOM:         
            case this.YZCHZ_ROOM_LESS:
                layer = new YZCHZRoom(name);
                break;
            case this.PHZ_MONEY_ROOM:
                layer = new PHZMoneyRoom(name);
                break;
            case this.PHZ_REPLAY:
            case this.PHZ_REPLAY_MORE:
            case this.PHZ_REPLAY_LESS:
                if(PHZRePlayModel.playType == PHZGameTypeModel.YJGHZ||PHZRePlayModel.playType == PHZGameTypeModel.NXGHZ){
                    layer = new YJGHZReplay(name);
                }else if(PHZRePlayModel.playType == PHZGameTypeModel.YZLC){
                    layer = new YZLCReplay(name);
                }else{
                    layer = new PHZReplay(name);
                }
                break;
            case this.MATCH_HOME_LAYER:
                layer = new MatchHomeLayer(name);
                break;
            case this.MATCH_PDK_ROOM:
                layer = new MatchPdkRoom(name);
                break;
            case this.MATCH_DTZ_ROOM:
                layer = new MatchDtzRoom(name);
                break;
            case this.DDZ_ROOM:
                layer = new DdzOnlineRoom(name);
                break;
            case this.DDZ_MONEY_ROOM:
                layer = new DdzMoneyRoom(name);
                break;
            case this.BSMJ_ROOM:
            case this.BSMJ_ROOM_TWO:
            case this.BSMJ_ROOM_THREE:
                layer = new BSMJRoom(name);
                break;
            case this.BSMJ_REPLAY:
            case this.BSMJ_REPLAY_TWO:
            case this.BSMJ_REPLAY_THREE:
                layer = new BSMJReplay(name);
                break;
            case this.HZMJ_ROOM:
            case this.HZMJ_ROOM_TWO:
            case this.HZMJ_ROOM_THREE:

                if(MJRoomModel.wanfa == MJWanfaType.DZMJ){
                    layer = new DZMJRoom(name);
                }else{
                    layer = new HZMJRoom(name);
                }
                break;
            case this.CSMJ_ROOM:
            case this.CSMJ_ROOM_TWO:
            case this.CSMJ_ROOM_THREE:
                layer = new CSMJRoom(name);
                break;
            case this.YJMJ_ROOM:
            case this.YJMJ_ROOM_TWO:
            case this.YJMJ_ROOM_THREE:
                layer = new YJMJRoom(name);
                break;
            case this.YJGHZ_ROOM:
            case this.YJGHZ_ROOM_LESS:
                layer = new YJGHZRoom(name);
                break;
            case this.AHMJ_ROOM:
            case this.AHMJ_ROOM_TWO:
            case this.AHMJ_ROOM_THREE:
                layer = new AHMJRoom(name);
                break;
            case this.ZZPH_ROOM_LESS:
            case this.ZZPH_ROOM:
            case this.ZZPH_ROOM_MORE:
                layer = new ZZPHRoom(name);
                break;
            case this.HZMJ_REPLAY:
            case this.HZMJ_REPLAY_TWO:
            case this.HZMJ_REPLAY_THREE:
                // layer = new HZMJReplay(name);
                if(MJRoomModel.isTCDPMJ() ||MJRoomModel.isTCPFMJ() || MJRoomModel.wanfa == MJWanfaType.AHMJ ||
                    MJRoomModel.wanfa == MJWanfaType.CXMJ || MJRoomModel.wanfa == MJWanfaType.KWMJ || MJRoomModel.isYYNXMJ()){
                    cc.log("AHMJReplay =============================");
                    layer = new AHMJReplay(name);
                }else{
                    layer = new HZMJReplay(name);
                }
                break;
            case this.ZZMJ_ROOM:
            case this.ZZMJ_ROOM_TWO:
            case this.ZZMJ_ROOM_THREE:
                layer = new ZZMJRoom(name);
                break;
            case this.SYMJ_ROOM:
            case this.SYMJ_ROOM_TWO:
            case this.SYMJ_ROOM_THREE:
                layer = new SYMJRoom(name);
                break;
            case this.SYMJ_REPLAY:
            case this.SYMJ_REPLAY_TWO:
            case this.SYMJ_REPLAY_THREE:
                layer = new SYMJReplay(name);
                break;
            case this.HBGZP_ROOM:
            case this.HBGZP_ROOM_MORE:
            case this.HBGZP_ROOM_LESS:
                layer = new HBGZPRoom(name);
                break;
            case this.HBGZP_REPLAY:
            case this.HBGZP_REPLAY_MORE:
            case this.HBGZP_REPLAY_LESS:
                layer = new HBGZPReplay(name);
                break;
            case this.YZWDMJ_ROOM_TWO:
            case this.YZWDMJ_ROOM_THREE:
            case this.YZWDMJ_ROOM:
                layer = new YZWDMJRoom(name);
                break;
            case this.QF_ROOM:
                layer = new QFRoom(name);
                break;
            case this.QF_REPLAY:
                layer = new QFSeePlayBackLayer(name);
                break;
            case this.NXMJ_ROOM:
            case this.NXMJ_ROOM_TWO:
            case this.NXMJ_ROOM_THREE:
                layer = new NXMJRoom(name);
                break;
        }

        if(name == "SDH_ROOM" || name == "XTBP_ROOM"){
            var layerClass = SDHRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        if(name == "DT_ROOM"){
            var layerClass = DTRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        if(name == "NSB_ROOM"){
            var layerClass = NSBRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        if(name == "YYBS_ROOM"){
            var layerClass = YYBSRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        if(name == "TCGD_ROOM"){
            var layerClass = TCGDRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        if(name == "HSTH_ROOM"){
            var layerClass = HSTHRoomModel.getRoomLayerById();
            layer = new layerClass();
        }

        return layer;
    }
}

var LayerManager = {

    init:function(root){
        this._layerMap = {};
        this._currentLayer = null;
        this.inRoom = false;
        this._root = root;
    },

    getLayer:function(name){
        return this._layerMap[name];
    },

    getCurrentLayer:function(){
        if(this._currentLayer)
            return this._currentLayer.getName();
        return "";
    },

    getCurrentLayerObj:function(){
        if(this._currentLayer)
            return this._currentLayer;
        return null;
    },

    isInReplay:function(){
        var layers = [LayerFactory.SEEPLAYBACK,LayerFactory.DTZSEEPLAYBACK,LayerFactory.DTZSEEPLAYBACK_MORE,LayerFactory.DTZ_ROOM];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInRoom:function(){
        return this.inRoom;
    },

    isInMJ: function() {
        if(this.inRoom && ClubRecallDetailModel.isMJWanfa(BaseRoomModel.curRoomData.wanfa)){
            return true;
        }
        return false;
    },

    isInHBGZP: function() {
        var layers = [LayerFactory.HBGZP_ROOM, LayerFactory.HBGZP_ROOM_MORE, LayerFactory.HBGZP_ROOM_LESS];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInYZLC: function(){
        var layers = [LayerFactory.YZLC_ROOM, LayerFactory.YZLC_ROOM_MORE, LayerFactory.YZLC_ROOM_LESS];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInBSMJ: function() {
        var layers = [LayerFactory.BSMJ_ROOM,LayerFactory.BSMJ_ROOM_TWO,LayerFactory.BSMJ_ROOM_THREE];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInHZMJ: function() {
        var layers = [LayerFactory.HZMJ_ROOM,LayerFactory.HZMJ_ROOM_TWO,LayerFactory.HZMJ_ROOM_THREE];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInSYMJ: function() {
        var layers = [LayerFactory.SYMJ_ROOM, LayerFactory.SYMJ_ROOM_TWO, LayerFactory.SYMJ_ROOM_THREE];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInYZWDMJ: function() {
        var layers = [LayerFactory.YZWDMJ_ROOM_TWO,LayerFactory.YZWDMJ_ROOM_THREE,LayerFactory.YZWDMJ_ROOM];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInDTZ: function() {
        var layers = [LayerFactory.DTZ_ROOM,LayerFactory.DTZ_3REN_ROOM,LayerFactory.DTZ_MONEY_ROOM,LayerFactory.MATCH_DTZ_ROOM];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },

    isInPDK:function(){
        var layers = [LayerFactory.PDK_ROOM , LayerFactory.PDK_MONEY_ROOM , LayerFactory.MATCH_PDK_ROOM];
        return (ArrayUtil.indexOf(layers , this.getCurrentLayer())>=0);
    },

    isInPHZ:function(){
        if(this.inRoom && ClubRecallDetailModel.isPHZWanfa(BaseRoomModel.curRoomData.wanfa)){
            return true;
        }
        return false;
    },

    isInDDZ:function(){
        var layers = [LayerFactory.DDZ_ROOM,LayerFactory.DDZ_MONEY_ROOM];
        return (ArrayUtil.indexOf(layers , this.getCurrentLayer())>=0);
    },
    isInQF: function() {
        var layers = [LayerFactory.QF_ROOM];
        return (ArrayUtil.indexOf(layers,this.getCurrentLayer())>=0);
    },
    
    addLayer:function(name){
         //cc.log("name =",name);
        var scene = this._layerMap[name];
        if(!scene){
            scene = LayerFactory.buildInst(name);
            this._layerMap[name] = scene;
            this._root.addChild(scene);
        }
        return this._layerMap[name];
    },

    showLayer:function(name) {
        if(this._currentLayer) {
            if(name == this._currentLayer.getName()){
                return this._currentLayer;
            }
            if(this._currentLayer.isForceRemove()){
                cc.log("this._currentLayer.getName()..." , this._currentLayer.getName());
                this.removeLayer(this._currentLayer.getName());
            }else{
                this._currentLayer.visible = false;
                this._currentLayer.onHide();
            }
        }
        var layer = this._layerMap[name];
        if(!layer) {
            layer = this.addLayer(name);
        } else {
            layer.visible = true;
            layer.onShow();
        }

        if(name == LayerFactory.HOME || name == LayerFactory.LOGIN){
            this.inRoom = false;
        }

        this._currentLayer = layer;
        if(sy.scene.paomadeng){
            if(name == LayerFactory.HALL){
                sy.scene.paomadeng.updatePosition(10,595);
            }else if(name==LayerFactory.ROOM || name == LayerFactory.HOME){
                sy.scene.paomadeng.updatePosition(10,595);
            }else if(name==LayerFactory.PHZ_ROOM || name==LayerFactory.PHZ_ROOM_MORE  || name==LayerFactory.PHZ_MONEY_ROOM
                || name == LayerFactory.PHZ_ROOM_LESS || name ==LayerFactory.YZCHZ_ROOM || name ==LayerFactory.YZCHZ_ROOM_LESS
                || name ==LayerFactory.AHPHZ_ROOM || name ==LayerFactory.AHPHZ_ROOM_LESS 
                ||  name ==LayerFactory.ZZPH_ROOM_MORE ||  name ==LayerFactory.ZZPH_ROOM_LESS||  name ==LayerFactory.ZZPH_ROOM){
                sy.scene.paomadeng.updatePosition(50,640);
            }else if(name == LayerFactory.DTZ_MONEY_ROOM){
                sy.scene.paomadeng.updatePosition(50,580);
            }else if (name == LayerFactory.PDK_MONEY_ROOM) {
                sy.scene.paomadeng.updatePosition(50,640)
            }else if (name == LayerFactory.MATCH_HOME_LAYER) {
                sy.scene.paomadeng.updatePosition(50,580)
            }else if (name == LayerFactory.LOGIN) {
                sy.scene.paomadeng.updatePosition(10,550)
            }else{
                sy.scene.paomadeng.updatePosition(150,640);
            }
            var curMsg = PaoMaDengModel.getCurrentMsg();
            if((curMsg&&curMsg.type == 0 && this.isInRoom()) || this.isInReplay()){
                sy.scene.paomadeng.stop();
            }
        }
        return layer;
    },

    /**
     * 移除场景
     * @param name
     */
    removeLayer:function(name) {
        var layer = this._layerMap[name];
        if(layer){
            layer.removeAllEvents();
            layer.onRemove();
            this._root.removeChild(layer);
            layer = null;
            delete this._layerMap[name];
        }else{
            cc.log("LayerManager removeLayer::未找到layer..." , name);
        }
    },

    dispose:function(){
        var layers = [];
        for(var key in this._layerMap){
            layers.push(key);
        }
        for(var i=0;i<layers.length;i++){
            this.removeLayer(layers[i]);
        }
        this._currentLayer=null;
    	this._layerMap = {};
    }
}