/**
 * Created by zhoufan on 2016/12/7.
 */
var PHZRoomSound = {

    getLetOutPath:function(sex,audioName){
        var sex = (sex==1) ? "man/" : "woman/";
    	var path = "shaoyang/" + sex;
        var soundPath = "res/audio/phz/"+path+audioName+".mp3";
        cc.log("PHZSetModel.yyxz =",PHZSetModel.yyxz);
        if (PHZSetModel.yyxz == 2){
            path = sex;
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
        }else if (PHZSetModel.yyxz == 3){
            path = "changde/";
            soundPath = "res/audio/phz/"+path+audioName+".wav";
            if(PHZGameTypeModel.GLZP == PHZRoomModel.wanfa){
                path = "glzp/" + sex;
                soundPath = "res/audio/phz/"+path+audioName+".mp3";
            }
        }else if (PHZSetModel.yyxz == 4){
            path = "chenzhou/" + sex;
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
            if(PHZGameTypeModel.AHPHZ == PHZRoomModel.wanfa){
                path = "anhua/" + sex;
                soundPath = "res/audio/phz/"+path+audioName+".wav";
            }
        }else if (PHZSetModel.yyxz == 5){
            path = "leiyang/";
            soundPath = "res/audio/phz/"+path+audioName+".mp3"; 
        }else if(PHZSetModel.yyxz == 6){
            path = "bendihua/";
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
        }else if(PHZSetModel.yyxz == 7){
            path = "yongzhouhua/";
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
        }else if(PHZSetModel.yyxz == 8){
            path = "zhuzhou/"+ sex;
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
        }else if(PHZSetModel.yyxz == 9){
            path = "localism/" + sex;
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
        }
        cc.log("soundPath =",JSON.stringify(soundPath));

        return soundPath;
    },

    getActionPath:function(sex,audioName){
        var sex = (sex==1) ? "man/" : "woman/";
        var path = "shaoyang/" + sex;
        var soundPath = "res/audio/phz/"+path+audioName+".mp3";
        if (PHZSetModel.yyxz == 2 || audioName == "huang"){
            path = sex;
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
        }else if (PHZSetModel.yyxz == 3){
            path = "changde/";
            soundPath = "res/audio/phz/"+path+audioName+".wav";
            if(PHZGameTypeModel.GLZP == PHZRoomModel.wanfa){
                path = "glzp/" + sex;
                soundPath = "res/audio/phz/"+path+audioName+".mp3";
            }else{
                if(audioName == "zimo"){
                    soundPath = "res/audio/phz/"+path+"hu"+".wav";
                }
            }
        }else if (PHZSetModel.yyxz == 4){
            path = "chenzhou/" + sex;
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
            if(PHZGameTypeModel.AHPHZ == PHZRoomModel.wanfa){
                path = "anhua/" + sex;
                if(audioName == "chongpao"){
                    audioName = "pao";
                }
                soundPath = "res/audio/phz/"+path+audioName+".wav";
            }
        }else if (PHZSetModel.yyxz == 5){
            path = "leiyang/";
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
        }else if(PHZSetModel.yyxz == 6){
            path = "bendihua/";
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
        }else if(PHZSetModel.yyxz == 7){
            path = "yongzhouhua/";
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
        }else if(PHZSetModel.yyxz == 8){
            path = "zhuzhou/"+ sex;
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
        }else if(PHZSetModel.yyxz == 9){
            path = "localism/" + sex;
            soundPath = "res/audio/phz/"+path+audioName+".mp3";
        }
        return soundPath;
    },

    yzlcLetOutSound:function(userId,actionName,isAction){
        var vo = PHZRoomModel.getPlayerVo(userId) || PHZRePlayModel.getPlayerVo(userId);
        var sex = (vo.sex==1) ? "man/" : "woman/";
        var path = "yzlc/" + sex;
        var soundPath = "res/audio/phz/"+path+"qylc_"+actionName+".mp3";
        if(!!isAction){
            if(actionName == "da"){
                var localID = Math.floor(Math.random()*10)%2;
                soundPath = "res/audio/phz/"+path+"qylc_"+actionName+"_"+localID+".mp3";
            }
        }else{
            soundPath = "res/audio/phz/"+path+"qylc_sound_"+actionName+".mp3";
        }
        AudioManager.play(soundPath);
    },

    hbgzpLetOutSound:function(userId,actionName){
        var vo = HBGZPRoomModel.getPlayerVo(userId) || HBGZPRePlayModel.getPlayerVo(userId);
        var sex = (vo.sex==1) ? "man/" : "woman/";
        var path = "hbgzp/" + sex;
        var soundPath = "res/audio/phz/"+path+actionName+".mp3";
        AudioManager.play(soundPath);
    },

    hbgzpFixMsg:function(userId,id){
        var sex = HBGZPRoomModel.getPlayerVo(userId).sex;
        var path = (sex==1) ? "hbgzp/man/" : "hbgzp/woman/";
        var realPath = "res/audio/phz/"+(path+ChatData.hbgzp_fix_msg_name[id-1])+".mp3";
        AudioManager.play(realPath);
    },

    /**
     *
     * @param userId
     * @param mjVo {PHZVo}
     */
    letOutSound:function(userId,mjVo){
        var vo = PHZRoomModel.getPlayerVo(userId) || PHZRePlayModel.getPlayerVo(userId);
        var t = mjVo.t==1 ? "s" : "b";
        AudioManager.play(this.getLetOutPath(vo.sex,t+mjVo.n));
    },

    actionSound:function(userId,prefix){
        var vo = PHZRoomModel.getPlayerVo(userId) || PHZRePlayModel.getPlayerVo(userId);
        AudioManager.play(this.getActionPath(vo.sex,prefix));
    },

    fixMsg:function(userId,id){
        var format = ".m4a";
        var sex = PHZRoomModel.getPlayerVo(userId).sex;
        var path = (sex==1) ? "man/" : "woman/";
        var realPath = "res/audio/fixMsg/"+path+ChatData.phz_fix_msg_name[id-1]+format;

        if(PHZRoomModel.wanfa == PHZGameTypeModel.YJGHZ){
            format = ".mp3";
            realPath = "res/audio/fixMsg/yjghz/"+path+ChatData.yjghz_fix_msg_name[id-1]+format;
        }
        AudioManager.play(realPath);
    }

}