/**
 * Created by zhoufan on 2016/7/28.
 */
var MJRoomSound = {

    getPath:function(sex,audioName){
        var path = (sex==1) ? "man/" : "woman/";
        if (MJRoomModel.isYZWDMJ()){
            cc.log("res/audio/mj/yzwdmj/+path+audioName =","res/audio/mj/yzwdmj/"+path+audioName);
            return "res/audio/mj/yzwdmj/"+path+audioName;
        }
        if (MJRoomModel.isAHMJ()){
            return "res/audio/mj/ahmj/"+path+audioName;
        }
        if (MJRoomModel.isTJMJ()){
            return "res/audio/mj/tjmj/"+path+audioName;
        }
        if (MJRoomModel.isGDCSMJ()){
            return "res/audio/mj/gdcsmj/"+path+audioName;
        }
        if(MJRoomModel.wanfa == MJWanfaType.CSMJ || MJRoomModel.wanfa == MJWanfaType.TDH){
            var type = parseInt(cc.sys.localStorage.getItem("sy_mj_yuyan"+MJRoomModel.wanfa))||cc.sys.localStorage.getItem("sy_mj_yuyan") || 1;
            var audioPath = "res/audio/mj/csmj/pth/"+path+audioName;
            if(type === 2){
                audioPath = "res/audio/mj/csmj/bdh1/"+path+audioName;
            }else if(type === 3){
                audioPath = "res/audio/mj/csmj/bdh2/"+path+audioName;
            }
            return audioPath;
        }

        if(MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ()){
            var type = parseInt(cc.sys.localStorage.getItem("tc_mj_yuyan"+MJRoomModel.wanfa))|| 2;
            var audioPath = "res/audio/mj/"+path+audioName;
            if(type === 2){
                audioPath = "res/audio/mj/tcpfmj/"+path+audioName;
            }
            // cc.log("type =",type);
            
            // cc.log("audioPath =",audioPath);
            return audioPath;
        }

        return "res/audio/mj/"+path+audioName;
    },

    pushOutSound:function(){
        AudioManager.play("res/audio/mj/out.mp3");
    },

    /**
     *
     * @param userId
     * @param mjVo {MJVo}
     */
    letOutSound:function(userId,mjVo){
        var vo = MJRoomModel.getPlayerVo(userId) || MJReplayModel.getPlayerVo(userId);
        var type = parseInt(cc.sys.localStorage.getItem("tc_mj_yuyan"+MJRoomModel.wanfa)) || 2;
        var format = ".wav";
        if(MJRoomModel.isZYMJ()|| MJRoomModel.isYZWDMJ() || MJRoomModel.isTJMJ() || MJRoomModel.isGDCSMJ() || ((MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ()) && type==2)){
            format = ".mp3";
        }
        var path = mjVo.t+""+mjVo.n;
        if(MJRoomModel.wanfa == MJWanfaType.CSMJ || MJRoomModel.wanfa == MJWanfaType.TDH){
            var localID = 1;//(Math.random() < 0.5 ? 1 : 2) + "";
            path = mjVo.t+""+mjVo.n+localID;
            format = ".mp3";
        }
        AudioManager.play(this.getPath(vo.sex,path+format));
    },

    actionSound:function(userId,prefix){
        var vo = MJRoomModel.getPlayerVo(userId) || MJReplayModel.getPlayerVo(userId);
        var type = parseInt(cc.sys.localStorage.getItem("tc_mj_yuyan"+MJRoomModel.wanfa)) || 2;
        var format = ".wav";
        if(prefix == "bai"){
            format = ".mp3";
            var randNum = cc.random0To1();
            prefix = randNum > 0.5 ? "bai":"wobaile";
        }
        if(MJRoomModel.isZYMJ() || prefix == "ting" || prefix == "buhua" || MJRoomModel.isYZWDMJ() || MJRoomModel.isTJMJ() || MJRoomModel.isGDCSMJ()
            || ((MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ()) && type==2)){
            format = ".mp3";
        }
        if(MJRoomModel.wanfa == MJWanfaType.CSMJ || MJRoomModel.wanfa == MJWanfaType.TDH){
            if(prefix == "peng" || prefix == "chi" || prefix == "bu" || prefix == "gang" || prefix == "hu" || prefix == "zimo"){
                var localID = 1;//Math.floor(Math.random() * 100)% 3 + 1;
                prefix += localID;
            }
            format = ".mp3";
        }
        AudioManager.play(this.getPath(vo.sex,prefix+format));
    },

    alertSound:function(){
        AudioManager.play("res/audio/common/special_alert.mp3");
    },

    fixMsg:function(userId,id){
        var format = ".m4a";
        var sex = MJRoomModel.getPlayerVo(userId).sex;
        var path = (sex==1) ? "man/" : "woman/";
        var realPath = "res/audio/fixMsg/"+path+ChatData.mj_fix_msg_name[id-1]+format;
        if(MJRoomModel.isTJMJ()){
            format = ".mp3";
            realPath = "res/audio/mj/tjmj/"+path+ChatData.tjmj_fix_msg_name[id-1]+format;
        }else if(MJRoomModel.wanfa == MJWanfaType.YJMJ){
            format = ".mp3";
            realPath = "res/audio/fixMsg/yjmj/"+path+ChatData.yjmj_fix_msg_name[id-1]+format;
        }else if(MJRoomModel.isGDCSMJ()){
            format = ".mp3";
            realPath = "res/audio/mj/gdcsmj/"+path+"chat/"+ChatData.gdcsmj_fix_msg_name[id-1]+format;
        }else if(MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ()){
            format = ".mp3";
            realPath = "res/audio/mj/tcpfmj/"+path+"chat/"+ChatData.tcpfmj_fix_msg_name[id-1]+format;
        }
        AudioManager.play(realPath);
    }

}
