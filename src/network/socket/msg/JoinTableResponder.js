/**
 * Created by Administrator on 2016/6/27.
 */
var JoinTableResponder = BaseResponder.extend({

    respond:function(message){
        //cc.log("JoinTableResponder::"+JSON.stringify(message));
        //{"player":{"userId":"111","name":"test111","seat":1,"sex":1,"icon":"123","point":0,"handCardIds":[],"outCardIds":[]},"nextSeat":null}
        var wanfa = message.wanfa;
        var p = message.player;
        if(WXHeadIconManager.isRemoteHeadImg(p.icon)){
            p.icon = WXHeadIconManager.replaceUrl(p.icon);
            if(WXHeadIconManager.hasLocalHeadImg(p.userId)){
                p.icon = WXHeadIconManager.getHeadImgPath(p.userId);
            }
        }
        switch (wanfa) {
            case 113:
            case 114://打筒子
            case 115:
            case 116:
            case 117:
            case 118:
            case 210:
            case 211:
            case 212:
                DTZRoomModel.join(message.player);
                break;
            case 15:
            case 16:
                PDKRoomModel.join(message.player);
                break;
            case PHZGameTypeModel.SYZP://邵阳字牌
            case PHZGameTypeModel.SYBP://邵阳剥皮
            case PHZGameTypeModel.LDFPF://放炮罚
            case PHZGameTypeModel.CZZP://郴州字牌
            case PHZGameTypeModel.LYZP://耒阳字牌
            case PHZGameTypeModel.ZHZ://捉红字
            case PHZGameTypeModel.WHZ://岳阳歪胡子
            case PHZGameTypeModel.LDS://落地扫
            case PHZGameTypeModel.YZCHZ://永州扯胡子
            case PHZGameTypeModel.ZZPH://株洲碰胡
            case PHZGameTypeModel.HYLHQ://衡阳六胡抢
            case PHZGameTypeModel.HYSHK://衡阳十胡卡
            case PHZGameTypeModel.XTPHZ://湘潭跑胡子
            case PHZGameTypeModel.XXGHZ://湘乡告胡子
            case PHZGameTypeModel.XXPHZ://湘乡跑胡子
            case PHZGameTypeModel.AHPHZ://安化跑胡子
            case PHZGameTypeModel.GLZP://桂林字牌
            case PHZGameTypeModel.LSZP://蓝山字牌
            case PHZGameTypeModel.NXPHZ://宁乡跑胡子
            case PHZGameTypeModel.YJGHZ://沅江鬼胡子
            case PHZGameTypeModel.SMPHZ://石门跑胡子
            case PHZGameTypeModel.CDPHZ://常德跑胡子
            case PHZGameTypeModel.HSPHZ://汉寿跑胡子
            case PHZGameTypeModel.XXEQS://湘西2710
            case PHZGameTypeModel.NXGHZ://南县鬼胡子
            case PHZGameTypeModel.YZLC://永州老戳
                PHZRoomModel.join(message.player);
                break;
            case 131:
                BBTRoomModel.join(message.player);
                break;
            case 91:
            case 92:
                DdzRoomModel.join(message.player);
                break;
            case PHZGameTypeModel.HBGZP://湖北个子牌
                HBGZPRoomModel.join(message.player);
                break;
            case MJWanfaType.ZZMJ:
            case MJWanfaType.HZMJ:
            case MJWanfaType.DZMJ:
            case MJWanfaType.BSMJ:
            case MJWanfaType.CSMJ:
            case MJWanfaType.SYMJ:
            case MJWanfaType.TDH:
            case MJWanfaType.YZWDMJ:
            case MJWanfaType.AHMJ:
            case MJWanfaType.CXMJ:
            case MJWanfaType.TJMJ:
            case MJWanfaType.YJMJ:
            case MJWanfaType.YYNXMJ:
            case MJWanfaType.GDCSMJ:
            case MJWanfaType.NXMJ:
            case MJWanfaType.KWMJ:
            case MJWanfaType.TCMJ:
            case MJWanfaType.DHMJ:
            case MJWanfaType.TCPFMJ:
            case MJWanfaType.TCDPMJ:
            case MJWanfaType.NYMJ:
                MJRoomModel.join(message.player);
                break;
            case QfGameType.QF:
                QFRoomModel.join(message.player);
                break;
        }

        SyEventManager.dispatchTableEvent(SDHTabelType.JoinTable,message);

    }
})