/**
 * Created by Administrator on 2016/6/27.
 */

var DaPaiTingPaiResponder = BaseResponder.extend({

    respond:function(message){
        cc.log("DaPaiTingPaiResponder::"+JSON.stringify(message));

        if(ClubRecallDetailModel.isPHZWanfa(BaseRoomModel.curRoomData.wanfa)){
            PlayPHZMessageSeq.receiveTingMsg(2,message);
            return;
        }

        SyEventManager.dispatchEvent(SyEvent.DAPAI_TING,message);
    }
})