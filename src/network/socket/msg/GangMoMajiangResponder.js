/**
 * Created by zhoufan on 2016/8/16.
 */
var CsMjGangModel = {
    userId:"",
    name:"",
    seat:0,
    gangId:0,
    gangActs:[],
}
var GangMoMajiangResponder = BaseResponder.extend({

    respond:function(message){
        cc.log("GangMoMajiangResponder::"+JSON.stringify(message));
        CsMjGangModel.userId = message.userId;
        CsMjGangModel.name = message.name;
        CsMjGangModel.seat = message.seat;
        CsMjGangModel.gangId = message.gangId;
        CsMjGangModel.gangActs = message.gangActs;
        CsMjGangModel.nextDisCardIndex = message.nextDisCardIndex || 0;
        MJRoomModel.remain = message.remain;

        SyEventManager.dispatchEvent(SyEvent.CS_GANG_MAJIANG,message);

    }
})
