/**
 * Created by Administrator on 2016/12/16.
 */

var YJGHZRePlayer = cc.Class.extend({
    _playerVo:null,
    _iconUrl:"",
    ctor:function(vo,root,seq,isMore){
        this._iconUrl = "";
        this._playerVo = vo;
        this.seq = seq;
        this.iconbg = ccui.helper.seekWidgetByName(root,"player"+seq)
        this.initX = this.iconbg.x;
        this.initY = this.iconbg.y;
        this.iconbg.temp = vo.seat;
        this.iconbg.visible = true;
        this.name = ccui.helper.seekWidgetByName(root,"name"+seq);
        this.name.setString(vo.name);
        this.point = ccui.helper.seekWidgetByName(root,"point"+seq);
        this.zj = ccui.helper.seekWidgetByName(root,"zj"+seq);
        this.zj.visible = false;
        this.huxi = 0;
        this.totalHuXi = 0;
        this.lastAction = -1;
        this.hx = ccui.helper.seekWidgetByName(root,"hx"+seq);
        this.updateHuXi(0);
        this.showIcon();
        this.isBanker((vo.handCardIds.length>20));
        if (PHZRePlayModel.playType == PHZGameTypeModel.LDFPF){
            this.updatePoint(vo.allHuxi);
        }else{
            this.updatePoint(vo.point);
        }
        if(isMore){
        	this.sx = ccui.helper.seekWidgetByName(root,"sx"+seq);
        	this.sx.visible = false;
        }

        this.tuoguanSp = ccui.helper.seekWidgetByName(this.iconbg, "tuoguanSp");
        if (this.tuoguanSp){
            this.tuoguanSp.visible = false;
        }

        this.qihu_img = this.iconbg.getChildByName("qihu_img");
        if (!this.qihu_img){
            this.qihu_img = new cc.Sprite("res/ui/phz/phzRoom/phz_qihu.png");
            this.iconbg.addChild(this.qihu_img,20);
            this.qihu_img.setName("qihu_img");
            this.qihu_img.x = 45;
            this.qihu_img.y = 45;
            this.qihu_img.visible = false;
        }

        this.niao_img = this.iconbg.getChildByName("niao_img");
        if (!this.niao_img){
            this.niao_img = new cc.Sprite("res/ui/phz/phz_niao.png");
            this.iconbg.addChild(this.niao_img,20);
            this.niao_img.setName("niao_img");
            this.niao_img.x = 75;
            this.niao_img.y = 15;
            this.niao_img.visible = false;
        }

        if (!isMore){
            this.daniao_score = ccui.helper.seekWidgetByName(root,"daniao_score"+seq);
            this.daniao_score.setString(0);
            this.daniao_score.visible = false;
        }
        this.chuiImg = this.iconbg.getChildByName("chuiImg");
        if (!this.chuiImg){
            this.chuiImg = new cc.Sprite("res/ui/phz/phzRoom/img_chui0.png");
            this.iconbg.addChild(this.chuiImg,20);
            this.chuiImg.setName("chuiImg");
            this.chuiImg.x = 75;
            this.chuiImg.y = 15;
            this.chuiImg.visible = false;

        }


    },

    updateTuoguan:function(isTuoguan){
        if(this.tuoguanSp){
            this.tuoguanSp.visible = isTuoguan == 1;
        }
    },

    showChuiImg:function(type){
        var pngUrl ="res/ui/phz/phzRoom/img_chui"+type+".png";
        this.chuiImg.setTexture(pngUrl);
        this.chuiImg.visible =true;
    },

    hideChuiImg:function(){
        this.chuiImg.visible = false;
    },
    showQiHuImg:function(){
        this.qihu_img.visible =true;
    },
    hideQiHuImg:function(){
        this.qihu_img.visible =false;
    },
    showDaNiaoImg:function(type){
        // cc.log("type =",type);
        if (this.daniao_score){
            if (type == 0){
                this.niao_img.visible = false;
                this.daniao_score.visible = false;
            }else if(type == 1){
                this.niao_img.visible = true;
                this.daniao_score.visible = false;
            }else{
                this.niao_img.visible = true;
                this.daniao_score.visible = true;
                this.daniao_score.setString("" + type);
            }
        }
    },
    updateHuXi:function(huxi) {
    	this.hx.setString(huxi+"胡息");
    },
    
    updatePoint:function(point){
        // cc.log("point =",point);
        this.point.setString(point);
    },

    updateShuXing:function(bool){
    	this.sx.visible = bool;
    },
    
    playerInfo:function(){
        var mc = new PlayerInfoPop(this._playerVo);
        PopupManager.addPopup(mc);
    },

    //是否是庄家
    isBanker:function(bool){
        this.zj.visible = bool;
    },

    //显示玩家头像
    showIcon:function(){
        var url = this._playerVo.icon;
        var defaultimg = (this._playerVo.sex == 1) ? "res/ui/dtz/images/default_m.png" : "res/ui/dtz/images/default_w.png";
        if(!url){
            url = defaultimg;
        }
        if(this._iconUrl==url){
            return;
        }
        if(this.iconbg.getChildByTag(345)){
            this.iconbg.removeChildByTag(345);
        }
        //this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        this._iconUrl = url;
        var sprite = new cc.Sprite(defaultimg);
        if(this._playerVo.icon){
            sprite.x = sprite.y = 0;
            try{//因为loadImg不稳定，所以使用try catch，避免程序运行时中断
                var sten = new cc.Sprite("res/ui/dtz/images/img_14_c.png");
                var clipnode = new cc.ClippingNode();
                clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 42, y: 43, alphaThreshold: 0.8});
                clipnode.addChild(sprite);
                this.iconbg.addChild(clipnode,5,345);
                var self = this;
                cc.loader.loadImg(this._playerVo.icon, {width: 252, height: 252}, function (error, img) {
                    if (!error) {
                        sprite.setTexture(img);
                        sprite.x = 0;
                        sprite.y = 0;
                    }else{
                        self._iconUrl = "";
                    }
                });
            }catch(e){}
        }else{
            sprite.x = 42;
            sprite.y = 43;
            this.iconbg.addChild(sprite,5,345);
        }
    }
});



var YJGHZReplay = BaseLayer.extend({
    playIntval:1.5,//自动播放速度
    ctor:function(json){
        this.layouts = {};
        this._super(json);

        //落地扫替换下王牌的资源
        if(PHZRoomModel.wanfa != PHZGameTypeModel.ZHZ && PHZRoomModel.wanfa != PHZGameTypeModel.GLZP){
            var replaceFrameArr = ["cards_cards1_11b.png","cards_cards2_11b.png","cards_cards3_11b.png",
                "cards_listencard_81b.png","cards_Qh.png","cards_yy_cards3_11b.png","phz_cphua.png"];
            for(var i = 0;i<replaceFrameArr.length;++i){
                cc.spriteFrameCache.removeSpriteFrameByName(replaceFrameArr[i]);
                var frame = new cc.Sprite("res/ui/phz/ldswp/" + replaceFrameArr[i]).getSpriteFrame();
                cc.spriteFrameCache.addSpriteFrame(frame,replaceFrameArr[i]);
            }
        }else if(PHZRoomModel.wanfa == PHZGameTypeModel.GLZP){
            //桂林字牌替换牌底的资源
            var replaceFrameArr = ["cards_back.png","cards_face_1.png","cards_face_2.png",
                "cards_face_3.png","cards_face_4.png","cards_face1.png",
                "cards_paidun.png","cards_small_back.png","cards_small_face_1.png",
                "cards_small_face_2.png","cards_small_face_3.png","cards_small_face_4.png",
                "cards_small_face1_1.png","cards_small_face1_2.png","cards_small_face1_3.png",
                "cards_small_face1_4.png","cards_small_face2_1.png","cards_small_face2_2.png",
                "cards_small_face2_3.png","cards_small_face2_4.png","cards_yy_bg_face.png",
                "cards_yy_bg_face1.png","cards_yy_bg_small_face.png","cards_yy_bg_small_face1.png",
                "cards_yy_bg_small_face2.png","yzchz_bg_cp.png","yzchz_small_back.png"
            ];
            for (var i = 0; i < replaceFrameArr.length; ++i) {
                cc.spriteFrameCache.removeSpriteFrameByName(replaceFrameArr[i]);
                var frame = new cc.Sprite("res/ui/phz/glzpCard/" + replaceFrameArr[i]).getSpriteFrame();
                cc.spriteFrameCache.addSpriteFrame(frame, replaceFrameArr[i]);
            }
        }else{
            cc.spriteFrameCache.removeSpriteFramesFromFile(res.phz_plist);
            cc.spriteFrameCache.removeSpriteFramesFromFile(res.phz_cards_plist);
            cc.spriteFrameCache.addSpriteFrames(res.phz_plist);
            cc.spriteFrameCache.addSpriteFrames(res.phz_cards_plist);
        }
    },
    selfRender:function(){
        for(var i=1;i<4;i++){
            this.player = this.getWidget("player"+i);
            UITools.addClickEvent(this.player,this,this.onPlayerInfo);
        }
        this.Label_fh = this.getWidget("Label_fh");//房号
        this.Label_progress = this.getWidget("Label_progress");//进度
        this.Label_jushu = this.getWidget("Label_jushu");//局数
        this.Label_time = this.getWidget("Label_11");//时间
        if(this.Label_time){
            this.Label_time.setString(PHZRePlayModel.time);
        }
        this.replay_l = this.getWidget("replay_l");
        UITools.addClickEvent(this.replay_l,this,this.onLeft);
        this.replay = this.getWidget("replay");
        UITools.addClickEvent(this.replay,this,this.onPlay);
        this.replay_r = this.getWidget("replay_r");
        UITools.addClickEvent(this.replay_r,this,this.onRight);
        this.btn_exit = this.getWidget("btn_exit");
        UITools.addClickEvent(this.btn_exit,this,this.onReturnHome);
        // cc.log("PHZRePlayModel.roomName =",PHZRePlayModel.roomName);
        if (this.getChildByName("roomName_label")){
            this.roomName_label.setString(PHZRePlayModel.roomName);
        }else{
            this.roomName_label = new cc.LabelTTF(PHZRePlayModel.roomName,"Arial",26,cc.size(500, 30));
            this.addChild(this.roomName_label, 10);
            this.roomName_label.setName("roomName_label");
            this.roomName_label.setColor(cc.color(255,255,255));
            this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.roomName_label.x = cc.winSize.width/2;
            this.roomName_label.y = cc.winSize.height/2 + 300;
        }
        
    },

    onHide:function(){
        this.unscheduleUpdate();
    },

    onPlayerInfo:function(obj){
        this._players[obj.temp].playerInfo();
    },

    saveDataByStep:function(step,seat){
        for(var key in this.layouts){
            var layout = this.layouts[key];
            PHZRePlayModel.saveDataByStep(step,key,ArrayUtil.clone(layout.data1),layout.getData2WithCloned(),ArrayUtil.clone(layout.data3));
        }
        PHZRePlayModel.saveLastOutSeatByStep(step,seat);
    },

    refreshAllLayout:function(step){
        if(step<-1){
            step = -1;
        }
        for(var key in this.layouts){
            var data = PHZRePlayModel.getDataByStep(step,key);
            if(data){
                var layout = this.layouts[key];
                layout.refreshByCurData(data.data1,data.data2,data.data3);
            }
        }
        this.lastLetOutSeat = PHZRePlayModel.getLastOutSeatByStep(step);

        for (var key in this._players) {
            var state = PHZRePlayModel.tgState[key][step + 1];
            this._players[key].updateTuoguan(state);
        }
    },

    onLeft: function () {
        this.lastPHZChuPai = 0;
        this.replay.loadTextureNormal("res/ui/phz/seePlayBack/playback5.png");
        this.autoPlay = false;
        PHZRePlayModel.step = (this.playedStep-1<0)?0:this.playedStep-1;
        //cc.log("onLeft::"+PHZRePlayModel.step);
        this.playedStep = -1;
        this.refreshAllLayout(PHZRePlayModel.step-1);
        this.playing();
    },

    onRight:function(){
        this.replay.loadTextureNormal("res/ui/phz/seePlayBack/playback5.png");
        this.autoPlay = false;
        if(this.playedStep>=(PHZRePlayModel.steps.length-1)){
            return FloatLabelUtil.comText("已经播放到最后一步了");
        }
        if(PHZRePlayModel.step>this.playedStep){
            this.playing();
        }else{
            this.playedStep = -1;
            PHZRePlayModel.ff();
            this.refreshAllLayout(PHZRePlayModel.step-1);
            this.playing();
        }
    },

    onPlay:function(){
        if(this.autoPlay){
            this.autoPlay = false;
            this.replay.loadTextureNormal("res/ui/phz/seePlayBack/playback5.png");
        }else{
            this.autoPlay = true;
            this.replay.loadTextureNormal("res/ui/phz/seePlayBack/playback3.png");
        }
    },

    onReturnHome:function(){
        for(var i=1;i<=PHZRePlayModel.players.length;i++){
            this._players[i].hideQiHuImg();
            this._players[i].showDaNiaoImg(0);
            this._players[i].hideChuiImg();
         }
        PopupManager.showPopup(DTZTotalRecordPop);
        if(PopupManager.getClassByPopup(PyqHall)){
            PopupManager.showPopup(PyqHall);
        }

        var layer = LayerFactory.HOME;
        LayerManager.showLayer(layer);
        if(TotalRecordModel.isShowRecord){
            var mc = new DTZTotalRecordPop(TotalRecordModel.data,TotalRecordModel.isDaiKai);
            PopupManager.addPopup(mc);
            TotalRecordModel.isShowRecord = false;
        }
        if(RecordModel.isShowRecord){
            var mc = new PHZRecordPop(RecordModel.data,RecordModel.isDaiKai);
            PopupManager.open(mc,true);
            RecordModel.isShowRecord = false;
        }
        if(ClubRecallModel.isShowRecord){
            PopupManager.showPopup(PyqHall);
            //同步修改
            PopupManager.showPopup(ClubCreditPop);
            ClubRecallModel.isShowRecord = false;
        }
        if(ClubRecallDetailModel.isShowRecord){
            PopupManager.showPopup(ClubPhzRecallDetailPop);
            ClubRecallDetailModel.isShowRecord = false;
        }
        this.showqihu_step = [];
        this.isShuangLongBuPai = false;
        this.isGetWangpai = false;
    },

    cleanChuPai:function(){
    	for(var i=1;i<=PHZRePlayModel.players.length;i++){
            this.getWidget("cp"+i).removeAllChildren(true);
        }
    },

    initData:function(){
        this.cleanChuPai();
        //房号
        this.Label_fh.setString("房号："+PHZRePlayModel.tableId);
        this.Label_jushu.setString("第"+PHZRePlayModel.playCount+"局");
        this.Label_progress.setString("进度:0/"+PHZRePlayModel.steps.length);
        this.roomName_label.setString(PHZRePlayModel.roomName);
        this.autoPlay = true;
        this.replay.loadTextureNormal("res/ui/phz/seePlayBack/playback3.png");
        this._players = {};
        this.lastPHZChuPai = 0;
        this.dt = this.playIntval - 0.5;
        var players = PHZRePlayModel.players;
        //清除数据
        for(var d=1;d<=players.length;d++){
            var layout = this.layouts[d];
            if(layout){
                layout.clean();
            }
        }
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var isMore = (players.length==4) ? true : false;
        	var seq = PHZRePlayModel.getPlayerSeq(p.userId, p.seat);
        	this._players[p.seat] = new YJGHZRePlayer(p,this.root,seq,isMore);
        	if(isMore)
        		this._players[p.seat].updateShuXing(p.handCardIds[0]=="");
            if (PHZRePlayModel.playType == PHZGameTypeModel.SYBP && PHZRePlayModel.closingData[i].strExt[10] != -1){
                // cc.log("PHZRePlayModel.closingData[i].strExt[10] =",PHZRePlayModel.closingData[i].strExt[10]);
                this._players[p.seat].showChuiImg(PHZRePlayModel.closingData[i].strExt[10]);
            }
        	this.initCards(seq, p.handCardIds);
        }
        this.playedStep = -1;
        this.lastLetOutSeat = -1;
        this.showqihu_step = [];
        this.isShuangLongBuPai = false;
        this.isGetWangpai = false;
        this.saveDataByStep(-1);
        this.scheduleUpdate();
    },
    //进度更新
    updateProgress:function(){
        this.Label_progress.setString("进度:"+(PHZRePlayModel.step+1)+"/"+PHZRePlayModel.steps.length);
    },

    update:function(dt){
        this.dt += dt;
        if(this.dt >= this.playIntval){
            this.dt = 0;
            if(this.autoPlay){
                this.playing();
                PHZRePlayModel.ff();
            }
        }
    },

    cleanChuPai:function(){
        for(var i=1;i<=PHZRePlayModel.players.length;i++){
            this.getWidget("cp"+i).removeAllChildren(true);
        }
    },

    playing:function(){
        //playedStep存储的是已经播放过的步骤，当playedStep等于step时，就不再播放当前步骤了
        if(this.playedStep==PHZRePlayModel.step){
            cc.log("step::"+PHZRePlayModel.step+" has played...return playing function...");
            if(this.autoPlay)
                this.dt = this.playIntval;
            return;
        }
        var step = PHZRePlayModel.getCurrentlyStep();
        cc.log("step =",JSON.stringify(step));
        
        if(step){

            this.updateProgress();
            this.playedStep = PHZRePlayModel.step;
            
            // cc.log("playing::"+PHZRePlayModel.step+" data::"+JSON.stringify(step));
            var seat = step.seat;
            var action = step.action;
            var ids = step.ids;
            var seq = PHZRePlayModel.getPlayerSeq("",seat);
            var userId = PHZRePlayModel.getPlayerBySeat(seat);
            var actType = (action==9)? 1:2;//1表示摸牌，2表示出牌
            //如果已经显示弃胡，回退后需要隐藏
            if (this.showqihu_step.length>0){
                for (var i = 0; i < this.showqihu_step.length; i++) {
                    if (this.showqihu_step[i][0] > PHZRePlayModel.step){
                        this._players[this.showqihu_step[i][1]].hideQiHuImg();
                        this.showqihu_step.splice(i,1);
                    }
                }
            }
            if(action!=YJGHZAction.GUO && action != 100){
                this.cleanChuPai();
            }
            //表示有人要了那张牌
            if(action!=0&&action!=9&&action!=101 && action != YJGHZAction.GUO){
                this.lastPHZChuPai = 0;
            }
            switch(action){
                case 0://出牌
                case 9://摸牌
                    //如果点击了回退按钮，就不进入该语句
                    // cc.log("this.lastPHZChuPai =",this.lastPHZChuPai,"this.lastLetOutSeat =",this.lastLetOutSeat);
                    if((this.lastPHZChuPai > 0 && this.lastLetOutSeat>0)){//这里有牌缓存了
                        var chuPaiSeq = PHZRePlayModel.getPlayerSeq("",this.lastLetOutSeat);
                        if(this.lastPHZChuPai > 80 && (PHZRoomModel.wanfa == PHZGameTypeModel.LDS || PHZRoomModel.wanfa == PHZGameTypeModel.YZCHZ || PHZRoomModel.wanfa == PHZGameTypeModel.GLZP)){
                            this.getLayout(chuPaiSeq).handleLongBuZi(PHZAI.getPHZDef(this.lastPHZChuPai));
                            this.lastPHZChuPai = 0;
                        }else{
                            this.getLayout(chuPaiSeq).chuPai(PHZAI.getPHZDef(this.lastPHZChuPai));
                        }
                    }
                    this.lastLetOutSeat = seat;
                    if(actType==1){
                        this.lastPHZChuPai = ids[0];
                    }else{
                        this.getLayout(seq).chuPai(PHZAI.getPHZDef(ids[0]));
                    }
                    PHZRoomEffects.chuPai(this.getWidget("cp"+seq),PHZAI.getPHZDef(ids[0]),actType,PHZRePlayModel.players.length,seq);
                    PHZRoomSound.letOutSound(userId,PHZAI.getPHZDef(ids[0]));
                    break;
                case YJGHZAction.HU://胡
                	PHZRoomEffects.huPai(this.root,seq,PHZRePlayModel.players.length);
                    break;
                case YJGHZAction.GUO://过
                    PHZRoomEffects.normalAction("guo",this.root,seq,PHZRePlayModel.players.length);
                    break;
                case YJGHZAction.PENG://碰
                case YJGHZAction.TI://提
                case YJGHZAction.WEI://偎
                case YJGHZAction.CHI://吃
                case YJGHZAction.PAO://跑
                case YJGHZAction.LIU_WEI://偎后溜
                    var fromPHZ = ids[0];
                    this.getLayout(seq).chiPai(ids,action);
                    if(this.lastLetOutSeat>0){
                        var lastseq = PHZRePlayModel.getPlayerSeq("",this.lastLetOutSeat)
                        var layout = this.getLayout(lastseq);
                        var fromData = layout.data3;
                        if(fromData.length>0){
                            fromData = fromData[fromData.length - 1];
                            if(fromData.c == fromPHZ){
                                layout.beiPengPai(fromPHZ);
                            }
                        }
                    }
                    var prefixMap = {1: "liu", 2: "pao", 3: "wei", 5: "peng", 6: "chi",11:"liu"};

                    var prefix = prefixMap[action];
                    if(prefix){
                    	PHZRoomEffects.normalAction(prefix,this.root,seq,PHZRePlayModel.players.length);
                    }
                    PHZRoomSound.actionSound(userId,prefix);
                    break;
                case 100://刷新托管状态
                    this._players[seat].updateTuoguan(ids[0]);
                    break;
            }

            this.lastAction = action;
            //更新胡息
            //for(var i=1;i<=PHZRePlayModel.players.length;i++){
            //	var seq = PHZRePlayModel.getPlayerSeq("",i);//将玩家的座位号转换为玩家序号
            //	this._players[i].updateHuXi(this.getLayout(seq).totalHuXi);
            //}
            this.saveDataByStep(PHZRePlayModel.step,this.lastLetOutSeat);
            //判断是否胡牌
            if(PHZRePlayModel.step == (PHZRePlayModel.steps.length-1)){
                var soundPrefix = (this.lastLetOutSeat==seat || PHZRoomModel.remain==19) ? "zimo" : "hu";
                PHZRoomSound.actionSound(userId,soundPrefix);
                //PHZRoomEffects.huPai(this.root,seq,PHZRePlayModel.players.length);
                this.showqihu_step = [];
                this.isShuangLongBuPai = false;
                this.isGetWangpai = false;
                var self = this;
                setTimeout(function(){
                    var layer = LayerFactory.HOME;
                    LayerManager.showLayer(layer);
                    for(var i=1;i<=PHZRePlayModel.players.length;i++){
                        self._players[i].hideQiHuImg();
                        self._players[i].showDaNiaoImg(0);
                        self._players[i].hideChuiImg();
                    }
                    var mc;
                    if(PHZRoomModel.wanfa == PHZGameTypeModel.NXGHZ){
                        mc = new NXGHZSmallResultPop(PHZRePlayModel.closingData,true);
                    }else{
                        mc = new YJGHZSmallResultPop(PHZRePlayModel.closingMsg,true)
                    }
                    PopupManager.addPopup(mc);
                },1800);
            }
        }
    },  

    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout){
            return layout;
        }
        layout = new YJGHZRePlayLayout();
        this.layouts[direct] = layout;
        return layout;
    },

    initCards:function(direct,P1Mahjong){
        var layout = this.getLayout(direct);
        layout.initData(direct,this.getWidget("mPanel"+direct),this.getWidget("oPanel"+direct));
        layout.refresh(P1Mahjong,[],[]);
    }

})