
var ZZMJReplay = BaseLayer.extend({

    playIntval:1.2,
    _isJuflag:false,

    ctor:function(){
        this.layouts = {};
        this._isJuflag = false;
        this._super(LayerFactory.ZZMJ_REPLAY);
    },

    selfRender:function(){
        for(var i=1;i<=6;i++){
            if(i<=3){
                var p = this.getWidget("player"+i);
                UITools.addClickEvent(p,this,this.onPlayerInfo);
            }
        }
        //this.jt = this.getWidget("jt");//箭头
        //this.jt.loadTexture("res/ui/changchun/img_15.png");
        this.Label_10 = this.getWidget("Label_10");
        this.Panel_20 = this.getWidget("Panel_20");
        this.Label_progress = this.getWidget("Label_progress");
        this.BitmapLabel_speed = this.getWidget("BitmapLabel_speed");
        this.Label_mj = this.getWidget("Label_mj");
        this.replay_l = this.getWidget("replay_l");
        UITools.addClickEvent(this.replay_l,this,this.onLeft);
        this.replay = this.getWidget("replay");
        this.replay.loadTextureNormal("res/ui/buttons/playback3.png");
        UITools.addClickEvent(this.replay,this,this.onPlay);
        this.replay_r = this.getWidget("replay_r");
        UITools.addClickEvent(this.replay_r,this,this.onRight);
        this.btn_exit = this.getWidget("btn_exit");
        UITools.addClickEvent(this.btn_exit,this,this.onReturnHome);
        this.Button_speed = this.getWidget("Button_speed");
        UITools.addClickEvent(this.Button_speed,this,this.onSpeed);
        //if(SetUpModel.mjbgVal==2){
        //    this.jt.loadTexture("res/ui/changchun/img_54.png");
        //    this.Panel_20.setBackGroundImage("res/ui/changchun/green_bg.png");
        //}
        this.addCustomEvent(SyEvent.DESKTOP_BG,this,this.onChangeBg);
        this.addCustomEvent(SyEvent.MAHJONG_RES_CHANGE,this,this.onChangeMahjongRes);

        this.roomName_label = new cc.LabelTTF(MJReplayModel.roomName,"Arial",26,cc.size(500, 30));
        this.addChild(this.roomName_label, 10);
        this.roomName_label.setAnchorPoint(0,0.5);
        this.roomName_label.setString(MJReplayModel.roomName);
        this.roomName_label.setColor(cc.color(255,255,255));
        this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.roomName_label.x = this.Label_10.x-this.Label_10.getContentSize().width +20;
        this.roomName_label.y = this.Label_10.y-30;

    },



    onSpeed: function() {
          if (this.playIntval == 1.2) {
              this.playIntval = 0.6;
              this.BitmapLabel_speed.setString("x2");
          } else if(this.playIntval == 0.6) {
              this.playIntval = 0.35;
              this.BitmapLabel_speed.setString("x4");
          } else if(this.playIntval == 0.35) {
              this.playIntval = 1.2;
              this.BitmapLabel_speed.setString("x1");
          }
    },

    onChangeBg:function(event){
        //var Val = event.getUserData();//Val==SetUpModel.mjbgVal
        //if(Val==1){
        //    this.jt.loadTexture("res/ui/changchun/img_15.png");
        //    this.Panel_20.setBackGroundImage("res/ui/changchun/bg_3.png");
        //}else{
        //    this.jt.loadTexture("res/ui/changchun/img_54.png");
        //    this.Panel_20.setBackGroundImage("res/ui/changchun/green_bg.png");
        //}
    },

    onShowBaoPai:function(){
        for(var key in this.layouts){
            this.layouts[key].findBaoPai();
        }
    },

    onChangeMahjongRes:function(){
        for(var key in this.layouts){
            this.layouts[key].changeMahjongRes();
        }
    },

    onHide:function(){
        this.unscheduleUpdate();
    },

    onPlayerInfo:function(obj){
        this._players[obj.temp].showInfo();
    },

    onLeft:function(){
        this.replay.loadTextureNormal("res/ui/buttons/playback5.png");
        this.autoPlay = false;
        MJReplayModel.step = (this.playedStep-1<0) ? 0 : this.playedStep-1;
        this.playedStep = -1;
        //MJReplayModel.rew();
        this.refreshAllLayout((MJReplayModel.step-1));
        this.playing();
    },

    onPlay:function(){
        if(this.autoPlay){
            this.autoPlay = false;
            this.replay.loadTextureNormal("res/ui/buttons/playback5.png");
        }else{
            this.replay.loadTextureNormal("res/ui/buttons/playback3.png");
            this.dt = this.playIntval;
            this.autoPlay = true;
        }
    },

    onRight:function(){
        this.replay.loadTextureNormal("res/ui/buttons/playback5.png");
        this.autoPlay = false;
        if(this.playedStep>=(MJReplayModel.steps.length-1))
            return FloatLabelUtil.comText("已经播放到最后一步");
        if(MJReplayModel.step>this.playedStep){
            this.playing();
        }else{
            this.playedStep=-1;
            MJReplayModel.ff();
            this.refreshAllLayout((MJReplayModel.step-1));
            this.playing();
        }
    },

    onReturnHome:function(){
        LayerManager.showLayer(LayerFactory.MJ_HOME);
        if(this._isJuflag){
            var mc = new JtZJPaiJuDetailPop(RecordModel.data);
            PopupManager.addPopup(mc);
        }else{
            var mc = new RecordPop(RecordModel.data,RecordModel.isDaiKai);
            PopupManager.addPopup(mc);
        }

    },

    initData:function(flag){
        this._isJuflag = flag;
        this.Label_10.setString("房号:"+MJReplayModel.tableId);
        var difen = MJRoomModel.getDiFenNameByZZ(ClosingInfoModel.ext[10]);
        this.Label_mj.setString(difen+"\n"+"卡二条");
        this.roomName_label.setString(MJReplayModel.roomName);
        //MJAI.initFengDanPattern(ClosingInfoModel.ext[10]);//初始化danPatterns
        this.autoPlay = true;
        this.replay.loadTextureNormal("res/ui/buttons/playback3.png");
        this._players = {};
        this.dt = this.playIntval-0.5;
        var players = MJReplayModel.players;
        for(var d=1;d<=4;d++){
            var layout = this.layouts[d];
            if(layout)//清理掉上一次的牌局数据
                layout.clean();
        }
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var seq = MJReplayModel.getPlayerSeq(p.userId,MJReplayModel.mySeat, p.seat);
            this._players[p.seat] = new MJReplayer(p,this.root,seq);
            this.initCards(seq,p.handCardIds, p.seat);
        }
        this.playedStep = -1;
        this.lastLetOutSeat = -1;
        this.lastMoSeat = -1;
        this.tingStep = 0;
        this.tingSeat = 0;
        this.cleanBaoPai();
        this.BaoDisplay();
        this.Label_progress.setString("0-"+MJReplayModel.steps.length);
        this.playIntval=1.2;
        this.BitmapLabel_speed.setString("x1");
        this.saveDataByStep(-1);
        this.scheduleUpdate();
    },

    cleanBaoPai:function(){
        MJRoomModel.seeBaoPai(0);
        //this.onShowBaoPai();
        if(this.root.getChildByTag(MJRoomEffects.BAO_TAG)) {
            this.removeChildByTag(MJRoomEffects.BAO_TAG);
        }

    },

    BaoDisplay:function(){
        //MJReplayModel.getBaoPaiId();
        //if(MJReplayModel.baoPaiId>0){
        //    MJRoomModel.seeBaoPai(MJReplayModel.baoPaiId);
        //    this.onShowBaoPai();
        //    MJRoomEffects.addBaoPaiDisplay(this.root,730,350);
        //}
    },

    updateProgress:function(){
        this.Label_progress.setString(""+(MJReplayModel.step+1)+"-"+MJReplayModel.steps.length);
    },

    saveDataByStep:function(step,seat){
        for(var key in this.layouts){
            var layout = this.layouts[key];
            //if(key==1){
            //    var step0 = MJReplayModel.getDataByStep(0,1);
            //    if(step0)
            //        cc.log("第0步的数据::"+JSON.stringify(step0.data2));
            //    cc.log("当前::"+JSON.stringify(layout.getData2WithClone()));
            //}
            MJReplayModel.saveDataByStep(step,key,ArrayUtil.clone(layout.data1),layout.getData2WithClone(layout.data2),ArrayUtil.clone(layout.data3));
        }
        MJReplayModel.saveLastOutSeatByStep(step,seat);
    },

    refreshAllLayout:function(step){
        if(step<-1)
            step = -1;
        //cc.log("refreshAllLayout::"+step);
        for(var key in this.layouts){
            var data = MJReplayModel.getDataByStep(step,key);
            if(data){
                var layout = this.layouts[key];
                //if(key==1){
                //    cc.log("refreshAllLayout::"+JSON.stringify(data.data2));
                //}
                layout.refreshByCurData(data.data1,data.data2,data.data3);
            }
        }
        this.lastLetOutSeat = MJReplayModel.getLastOutSeatByStep(step);
    },

    hideFinger:function(){
        for(var key in this.layouts){
            this.layouts[key].hideFinger();
        }
    },

    showJianTou:function(seat){
        //this.jt.visible = true;
        //seat = seat || MJReplayModel.getNextSeat();
        //for(var i=1;i<=4;i++){
        //    this.getWidget("jt"+i).visible = false;
        //}
        //if(seat != -1){
        //    var direct = MJReplayModel.getPlayerSeq("",MJReplayModel.mySeat, seat);
        //    //cc.log("showJianTou::"+direct);
        //    this.getWidget("jt"+direct).visible = true;
        //}
    },

    playing:function(){
        if(this.playedStep==MJReplayModel.step){
            cc.log("step::"+MJReplayModel.step+" has played...return playing function...");
            if(this.autoPlay)
                this.dt = this.playIntval;
            return;
        }
        var step = MJReplayModel.getCurrentlyStep();
        if(step){
            this.updateProgress();
            this.showJianTou();
            this.playedStep = MJReplayModel.step;
            cc.log("playing::"+MJReplayModel.step+" data::"+JSON.stringify(step));
            var seat = step.seat;
            var action = step.action;
            var ids = step.ids;
            var seq = MJReplayModel.getPlayerSeq("",MJReplayModel.mySeat, seat);
            var userId = MJReplayModel.getPlayerBySeat(seat);
            if(this.playedStep<this.tingStep){
                this._players[this.tingSeat].tingPai(false);
            }
            switch (action){
                case 0://出牌
                    this.hideFinger();
                    this.getLayout(seq).chuPai(MJAI.getMJDef(ids[0]));
                    this.lastLetOutSeat = seat;
                    MJRoomSound.letOutSound(userId,MJAI.getMJDef(ids[0]));
                    break;
                case 21://听牌
                    this._players[seat].tingPai(true);
                    this.tingStep = this.playedStep;
                    this.tingSeat = seat;
                    MJRoomEffects.normalAction(this.root,"ting",this.getWidget("cp"+seq),userId);
                    break;
                case 22://别人有操作时的补蛋
                    this.lastLetOutSeat = seat;
                    var nextstep = MJReplayModel.getNextStep();//取出下一步的数据
                    if(nextstep.action != 5){//如果别人可以碰，并且碰了
                        var lastOutseq = MJReplayModel.getPlayerSeq("",MJReplayModel.mySeat,this.lastLetOutSeat);
                        this.getLayout(lastOutseq).chuPai(MJAI.getMJDef(ids[0]));
                    }
                    break;
                case 1://胡牌
                    var isZiMo = (this.lastMoSeat==seat);
                    var prefix = isZiMo ? "zimo" : "hu";
                    MJRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+seq),userId);
                    MJRoomSound.actionSound(userId,prefix);
                    var fromMJ = ids[0];
                    if(!isZiMo && this.lastLetOutSeat>0 && ids.length > 0){
                        var lastseq = MJReplayModel.getPlayerSeq("",MJReplayModel.mySeat, this.lastLetOutSeat);
                        var layout = this.getLayout(lastseq);
                        var fromData = layout.data3;
                        if(fromData.length>0){
                            fromData = fromData[fromData.length-1];
                            if(fromData.c==fromMJ){
                                this.hideFinger();
                                layout.beiPengPai(fromMJ);
                            }
                        }
                    }
                    var huMJVo = this.getLayout(seq).huPai(isZiMo,this.lastLetOutSeat,fromMJ);
                    if (huMJVo) {
                        var huRecord = MJReplayModel.getHuRecordById(seat,huMJVo.c);
                        if (huRecord) {
                            var score = huRecord.ext[3];
                            var paoSeat = huRecord.ext[1];
                            if (huRecord.ext[1] > 0) {
                                this._players[seat].changeSPoint(score);
                                this._players[paoSeat].changeSPoint(-score);
                            } else {
                                this._players[seat].changeSPoint(score*3);
                                for (var key in this._players) {
                                    if (key != seat) {
                                        this._players[key].changeSPoint(-score);
                                    }
                                }
                            }
                        }
                    }
                    break;
                case 2://碰
                case 3://明杠
                case 4://暗杠
                case 6://吃
                case 7://补张(长沙麻将需要fromSeat)
                case 20://下蛋
                    var prefix = "peng";
                    if(action==7){
                        prefix = "bu";
                    }else if(action==6){
                        prefix = "chi";
                    }else if(action==3 || action==4){
                        prefix = "gang";
                    }else if(action==20){
                        prefix = "xiadan";
                    }
                    var fromMJ = (action==6) ? ids[1] : ids[ids.length-1];
                    this.getLayout(seq).pengPai(ids,action);
                    if(this.lastLetOutSeat>0){
                        var lastseq = MJReplayModel.getPlayerSeq("",MJReplayModel.mySeat, this.lastLetOutSeat);
                        var layout = this.getLayout(lastseq);
                        var fromData = layout.data3;
                        if(fromData.length>0){
                            fromData = fromData[fromData.length-1];
                            if(fromData.c==fromMJ){
                                this.hideFinger();
                                layout.beiPengPai(fromMJ);
                            }
                        }
                    }
                    MJRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+seq),userId);
                    MJRoomSound.actionSound(userId,prefix);
                    break;
                case 5://过
                    MJRoomEffects.normalAction(this.root,"guo",this.getWidget("cp"+seq),userId);
                    break;
                case 8://小胡
                    this.getLayout(seq).xiaohu(ids);
                    MJRoomEffects.normalAction(this.root,"btn_cs_xiaohu_"+step.type,this.getWidget("cp"+seq),userId);
                    break;
                case 9://摸牌
                    this.lastMoSeat = seat;
                    this.getLayout(seq).moPai(ids[0]);
                    break;
                case 11://长沙麻将杠
                    this.hideFinger();
                    this.getLayout(seq).chuPai(MJAI.getMJDef(ids[0]));
                    if(ids.length>1)
                        this.getLayout(seq).chuPai(MJAI.getMJDef(ids[1]));
                    this.lastLetOutSeat = seat;
                    break;
            }
            this.saveDataByStep(MJReplayModel.step,this.lastLetOutSeat);
            if(MJReplayModel.step==(MJReplayModel.steps.length-1)){
                var mc = new ZZMJSmallResultPop(MJReplayModel.closingMsg,true);
                PopupManager.addPopup(mc);
            }
        }
    },

    update:function(dt){
        this.dt+=dt;
        if(this.dt>=this.playIntval){
            this.dt=0;
            if(this.autoPlay && !MJReplayModel.isFinish()){
                this.playing();
                MJReplayModel.ff();
            }
        }
    },

    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout)
            return layout;
        layout = new ZZMJReplayLayout();
        this.layouts[direct] = layout;
        return layout;
    },

    initCards:function(direct,p1Mahjongs,seat){
        var layout = this.getLayout(direct);
        layout.initData(direct,this.getWidget("mPanel"+direct),this.getWidget("oPanel"+direct),this.getWidget("hPanel"+direct),seat);
        layout.refresh(p1Mahjongs,[],[],[]);
    },
});