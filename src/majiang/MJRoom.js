/**
 * Created by zhoufan on 2016/7/22.
 */
var MJRoom = BaseRoom.extend({
    layouts:{},
    initCoords:{},
    COUNT_DOWN:15,

    ctor:function(){
        this.layouts = {};
        this.tingList = [];
        this.initCoords = {};
        this.lastLetOutMJ = 0;
        this.lastLetOutSeat = 0;
        this.setUpTimeId = -1;
        this.jsqFen = 0;
        this.jsqShi = 0;
        this._super(LayerFactory.MJ_ROOM);
    },

    onRemove:function(){
        if(this.setUpTimeId>=0)
            clearTimeout(this.setUpTimeId);
        this.tingList.length=0;
        this._effectLayout.cleanData();
        BaseRoom.prototype.onRemove.call(this);
        MJRoomModel.mineLayout = null;
    },

    getModel:function(){
        return MJRoomModel;
    },

    getLabelTime:function(){
        return this.getWidget("Label_time");
    },

    getChatJSON:function(){
        return "res/mjChat.json";
    },

    selfRender:function(){
        BaseRoom.prototype.selfRender.call(this);
        this.hbtns = [];
        for(var i=1;i<=6;i++){
            if(i<=4){
                var p = this.getWidget("player"+i);
                this.initCoords[i] = {x: p.x,y: p.y};
                UITools.addClickEvent(p,this,this.onPlayerInfo);
            }
            var hbtn = this.getWidget("hbtn"+i);
            this.hbtns.push(hbtn);
            UITools.addClickEvent(hbtn,this,this.onOperate);
        }
        this.Image_24 = this.getWidget("Image_24");
        this.jt = this.getWidget("jt");
        this.jt1= this.getWidget("jt1");
        this.jt2= this.getWidget("jt2");
        this.jt3= this.getWidget("jt3");
        this.jt4= this.getWidget("jt4");
        this.jt.visible = false;
        this.Image_info1 = this.getWidget("Image_info1");
        this.Image_info2 = this.getWidget("Image_info2");
        this.Label_info_mj = this.getWidget("Label_info_mj");
        this.Label_info0 = this.getWidget("Label_info0");//房号
        this.Panel_btn = this.getWidget("Panel_btn");//按钮panel
		//this.Button_setup = this.getWidget("Button_setup");
        this.Button_setup1 = this.getWidget("Button_setup1");
        this.Image_setup = this.getWidget("Image_setup");
        this.Panel_20 = this.getWidget("Panel_20");
        this.Button_info = this.getWidget("Button_info");
        this.Button_gps = this.getWidget("Button_gps");

        if (SyConfig.HAS_GPS) {
            if(GPSModel.getGpsData(PlayerModel.userId) == null){
                this.Button_gps.setBright(false);
            }else{
                this.Button_gps.setBright(true);
            }
        } else {
            this.Button_gps.visible = false;
        }

        // this.Button_gps.visible =true;
        this.Label_ting = this.getWidget("Label_ting");//听牌
        this.Panel_ting = this.getWidget("Panel_ting");//听的牌面
        this.Label_ting.visible = this.Panel_ting.visible = false;
        this.Panel_ting.removeAllChildren(true);
        this.Panel_8 = this.getWidget("Panel_8");
        this.Panel_8.visible = false;
        this.Button_9 = this.getWidget("Button_9");//小结详情
        this.Button_10 = this.getWidget("Button_10");//继续按钮
        this.Main = this.getWidget("Panel_20");
        this.bgColor = cc.sys.localStorage.getItem("sy_mj_bgColor") || 1;
        this.updateBgColor(this.bgColor);
        this.Label_jsq = this.getWidget("Label_jsq");//计时器
        this.Label_jsq.setString("计时器\n00:00");
        UITools.addClickEvent(this.Button_9,this,this.onCheckResult);
        UITools.addClickEvent(this.Button_10,this,this.onJixuFromResult);
        UITools.addClickEvent(this.Panel_20,this,this.onCancelSelect,false);
		//UITools.addClickEvent(this.Button_setup,this,this.onShowSetUp);
        UITools.addClickEvent(this.Button_setup1,this,this.onShowSetUp);
        UITools.addClickEvent(this.Button_info,this,this.onRoomInfo);
        UITools.addClickEvent(this.Button_gps,this,this.onGPS);
        this.addCustomEvent(SyEvent.GET_MAJIANG,this,this.onGetMajiang);
        this.addCustomEvent(SyEvent.SELECT_MAJIANG,this,this.onSelectMajiang);
        this.addCustomEvent(SyEvent.DTZ_UPDATE_GPS , this,this.updateGpsBtn);
        this.addCustomEvent(SyEvent.ROOM_ROLD_ICON , this,this.setRoldPlayerIcon);
        this.addCustomEvent(SyEvent.UPDATE_BG_YANSE,this,this.changeBgColor);
        this.addCustomEvent(SyEvent.SHOW_DESKTTOP_CARDS,this,this.onShowDesktopCards);
        this.addCustomEvent(SyEvent.CANCEL_SHOW_DESKTTOP_CARDS,this,this.onHideDesktopCards);
        this.addCustomEvent(SyEvent.FIND_HU_BY_PUTOUT,this,this.onFindCardsByPutout);
        this.addCustomEvent(SyEvent.TING_PAI_LIST,this,this.onShowTingPai);
        this.addCustomEvent(SyEvent.DA_PAI_TING_PAI_LIST,this,this.findPutOutByTing);
        //this.addCustomEvent(SyEvent.CS_GANG_MAJIANG,this,this.onCsGang);
        //this.addCustomEvent(SyEvent.CS_HAIDI,this,this.onCsHaiDi);
        //this.addCustomEvent(SyEvent.DESKTOP_BG,this,this.onChangeBg);
        //this.addCustomEvent(SyEvent.MAHJONG_RES_CHANGE,this,this.onChangeMahjongRes);
        //this.addCustomEvent(SyEvent.DOUNIU_JETTON_FINISH, this, this.onJettonFinish);
        //this.addCustomEvent(SyEvent.MAJIANG_TRUSTEESHIP,this,this.onSetIsTrusteeship);//托管
        this.countDownLabel = new cc.LabelBMFont("15","res/font/font_mj3.fnt");
        this.countDownLabel.x = this.jt.width/2-1;
        this.countDownLabel.y = this.jt.height/2-3;
        this.jt.addChild(this.countDownLabel);
        this._effectLayout = new MJEffectLayout(this.root, this);
    },
    onShowTingPai:function(event){
        var tingList = event.getUserData().majiangIds;
      
       /* if(tingList.length<=0)
            return;*///可能这里没听牌了
        var huCards = MJAI.getVoArray(tingList);
       /* var huCards = MJRoomModel.getTingWithMahjong(vo);*/
        this.onShowHuCards(huCards);
        
    },
    //通过打出去的牌找出可以胡的牌
    onFindCardsByPutout:function(event){
        var card = event.getUserData();
        for (var i = 0; i < MJRoomModel.lzTingResult.length; i++) {
            var putOut = MJRoomModel.lzTingResult[i].pushOut;
            if (putOut.i == card.i) {
                return;
            }
        }
        var data1 = MJRoomModel.mineLayout.getPlace1Data();
        var handCards = ArrayUtil.clone(data1);
        var index = MJAI.findIndexByMJVoC(handCards,card.c);
        if(index>=0){
            handCards.splice(index,1);
        }
        var hu = new MajiangSmartFilter();
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(MJRoomModel.getFuType());
        huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
        var start = new Date().getTime();
        var result = hu.findHuCards(handCards,huBean);
        //cc.log("onFindCardsByPutout cost Time :::::"+(new Date().getTime() - start))
        MJRoomModel.lzTingResult.push({ting: result, pushOut: card});
    },

    //桌面有点击的那张牌时需置灰
    onShowDesktopCards:function(event){
        var card = event.getUserData();
        for(var lay in this.layouts){
            this.layouts[lay].onShowDesktopSameCards(card);
        }
    },

    onHideDesktopCards:function(){
        for(var lay in this.layouts){
            this.layouts[lay].onRemoveLastSameCards();
        }
    },

    updateBgColor:function(color){
        var color = parseInt(color);
        switch (color){
            case 1:
                this.Main.setBackGroundImage("res/ui/gansu_mj/mjRoom/mjRoom_1.jpg");
                break;
            case 2:
                this.Main.setBackGroundImage("res/ui/gansu_mj/mjRoom/mjRoomBg_1.jpg");
                break;
            case 3:
                this.Main.setBackGroundImage("res/ui/gansu_mj/mjRoom/mjRoomBg_2.jpg");
                break;
        }
        this.bgColor = color;
        this.updateRoomInfo(color);
    },

    changeBgColor:function(event){
        var temp = event.getUserData();
        this.updateBgColor(temp);
    },

    updateGpsBtn:function(){
        if(this.Button_gps){
            this.Button_gps.setBright(true);
        }
    },

    //标记 玩家已经显示了头像
    setRoldPlayerIcon: function(event) {
        var seat = event.getUserData();
        var players = MJRoomModel.players;
        for(var i=0;i<players.length;i++) {
            var p = players[i];
            if(p.seat ==seat){
                p.isRoladIcon = 1;
            }
        }
    },

    onCheckResult:function(){
        if(this.resultData){
            var mc = new MJSmallResultPop(this.resultData);
            PopupManager.addPopup(mc);
        }
    },

    onJixuFromResult:function(){
        this.Panel_8.visible = false;
        if(MJRoomModel.totalBurCount == MJRoomModel.nowBurCount){
            var mc = new MJBigResultPop(this.resultData);
            PopupManager.addPopup(mc);
        }else {
            sySocket.sendComReqMsg(3);
        }
    },


    onGPS: function() {
        PopupManager.addPopup(new GpsPop(MJRoomModel , 4));
    },

    onRoomInfo: function() {
        var mc = new MJRoomInfoPop();
        PopupManager.addPopup(mc);
    },

	onShowSetUp:function(obj,fromTimeOut){
        var self = this;
        if(!fromTimeOut&&this.setUpTimeId>=0){
            clearTimeout(this.setUpTimeId);
            this.setUpTimeId=-1;
        }
        if(!this.Image_setup.visible){
            if(fromTimeOut)
                return;
            this.Image_setup.visible = true;
            this.setUpTimeId = setTimeout(function(){
                self.onShowSetUp(obj,true);
            },10000);
        }else{
            this.Image_setup.visible = false;
        }
        this.Button_setup1.setBright(!this.Image_setup.visible);
    },

    ///**
    // * 海底
    // * @param event
    // */
    //onCsHaiDi:function(event){
    //    var seat = event.getUserData();
    //    if(seat==MJRoomModel.mySeat){
    //        PopupManager.addPopup(new MJHaiDiPop());
    //    }else{
    //        this.showJianTou(seat);
    //    }
    //},

    ///**
    // * 开杠
    // */
    //onCsGang:function(){
    //    var userId = CsMjGangModel.userId;
    //    var seat = CsMjGangModel.seat;
    //    var direct = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,seat);
    //    var acts = CsMjGangModel.gangActs;
    //    var self = this;
    //    for(var i=0;i<acts.length;i++){
    //        var vo = MJAI.getMJDef(acts[i].majiangId);
    //        if(i==0){
    //            this.layouts[direct].chuPai(vo,true);
    //            this._players[seat].chuPai(vo);
    //            MJRoomSound.letOutSound(userId,vo);
    //        }else{
    //            setTimeout(function(){
    //                self.layouts[direct].chuPai(vo,true);
    //                self._players[seat].chuPai(vo);
    //                MJRoomSound.letOutSound(userId,vo);
    //            },1500);
    //        }
    //    }
    //    this.updateRemain();
    //},

    onPlayerInfo:function(obj){
        this._players[obj.temp].showInfo();
    },

    resetBtnPanel:function(){
        for(var i=0;i<100;i++){
            if(!this.Panel_btn.getChildByTag((123+i)))
                break;
            this.Panel_btn.removeChildByTag((123+i));
        }
    },

    onSelectMajiang:function(event){
        var data = event.getUserData();
        this.resetBtnPanel();
        var action = data.action;
        var ids = data.ids;
        MJRoomModel.sendPlayCardMsg(action,ids);
    },

    onCancelSelect:function(){
        if(MJRoomModel.mineLayout){
            var mjs = MJRoomModel.mineLayout.getMahjongs1();
            for(var i=0;i<mjs.length;i++){
                mjs[i].unselected();
            }
        }
    },

    onOver:function(event){
        var data = event.getUserData();
        //消息队列还没播完，结算消息过来了，先缓存下来
        if(PlayMJMessageSeq.sequenceArray.length>0){
            PlayMJMessageSeq.cacheClosingMsg(data);
            return;
        }
        this.tingList.length=0;
        var self = this;
        this.resultData = data;
        this.hideTing();
        this.jt.visible = false;
        var closingPlayers = data.closingPlayers;
        for(var i=0;i<closingPlayers.length;i++){
            var p = closingPlayers[i];
            self._players[p.seat].updatePoint(closingPlayers[i].totalPoint);
            var seq = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat, p.seat);
            self.getLayout(seq).tanPai(p.handPais);
        }
        var t = 1000;
        this.overTimeout = setTimeout(function(){//延迟弹出结算框
            //self.root.removeChildByTag(MJRoomEffects.BAO_TAG);
            var mc = new MJSmallResultPop(data);
            PopupManager.addPopup(mc);
            self.Panel_8.visible = true;
        },t);
        //if(MJRoomModel.overNiaoIds.length>0) {
        //    setTimeout(function () {
        //        MJRoomEffects.niaoAction(data, self.root);
        //    }, 1500);
        //}
    },

    initData:function(){
        BaseRoom.prototype.initData.call(this);
        if(this.overTimeout) {
            clearTimeout(this.overTimeout);
        }
        PlayMJMessageSeq.clean();
        this.hideTing();
        this.tingList.length=0;
        this.checkHuResult = [];
        this._effectLayout.cleanData();
        this.updateCountDown(this.COUNT_DOWN);
        this.Image_24.setRotation(MJRoomModel.jtAngle);
        //this.resetCoordByKanBao();
        this.hideAllBanker();
        this.lastLetOutMJ=this.lastLetOutSeat=0;
        this.Label_info0.setString("房号:"+MJRoomModel.tableId);
        this.updateRoomInfo();
        this._players = {};
        var players = MJRoomModel.players;
        for(var i=1;i<=4;i++){
            this.getWidget("player"+i).visible = false;
            this.getWidget("cp"+i).visible = false;
            this.getWidget("oPanel"+i).removeAllChildren(true);
            var layout = this.layouts[i];
            if(layout)//清理掉上一次的牌局数据
                layout.clean();
        }
        var isContinue = false;
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(!isContinue)
                isContinue = (p.handCardIds.length>0 || p.outedIds.length>0 || p.moldCards.length>0);
        }
        this.Panel_btn.visible = this.Panel_8.visible = false;
        this.btnReady.visible = true;
        this.btnInvite.visible = (players.length<4);
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var seq = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat, p.seat);
            var cardPlayer = this._players[p.seat] = new MJPlayer(p,this.root,seq);
            cardPlayer.showTrusteeship(parseInt(p.ext[3]));//显示托管字样
            var isMoPai = false;
            if(p.ext.length>0){//长春麻将，听牌了
                if(p.ext[0]==1){
                    MJRoomModel.ting(p.seat);
                    this._players[p.seat].tingPai();
                }
                if(p.ext.length>1 && p.ext[1]===1)//是否摸牌
                    isMoPai = true;
            }
            if(!isContinue){
                if(p.status)
                    cardPlayer.onReady();
            }else{//恢复牌局
                var banker = null;
                //if(p.seat==MJRoomModel.nextSeat)
                //    banker= p.seat;
                this.initCards(seq,p.handCardIds, p.moldCards, p.outedIds, p.huCards, banker, isMoPai);
                if(p.outCardIds.length>0){//模拟最后一个人出牌
                    this.lastLetOutMJ = p.outCardIds[0];
                    this.lastLetOutSeat = p.seat;
                    this.getLayout(seq).showFinger(this.lastLetOutMJ);
                }
                if(p.recover.length>0){//恢复牌局的状态重设
                    cardPlayer.leaveOrOnLine(p.recover[0]);
                    if(p.recover[1]==1){
                        MJRoomModel.banker = p.seat;
                        cardPlayer.isBanker(true);
                    }
                }
                cardPlayer.startGame();
            }
            if(p.userId ==PlayerModel.userId){//自己的状态处理
                MJRoomModel.isTrusteeship = p.ext[3];
                //this.Image_cover.visible = (MJRoomModel.isTrusteeship) ? true : false;
                if(p.status){
                    this.btnReady.visible = false;
                }else{
                    this.btnInvite.visible = false;
                }
                var tingAct = p.recover.length>2 ? p.recover.splice(2,8) : [];
                var isTingPai = false;
                if(p.handCardIds.length%3==2){
                    //听牌后，如果有牌没出，重连时，需要把这张牌打出来,需要判断能不能胡
                    if(MJRoomModel.isTing() || MJRoomModel.isHued()){//直接出牌
                        MJRoomModel.needAutoLetOutId = p.handCardIds[p.handCardIds.length-1];
                        //MJRoomModel.sendPlayCardMsg(0,[MJRoomModel.needAutoLetOutId]);
                        if(tingAct.length==0)
                            MJRoomModel.chuMahjong(MJRoomModel.needAutoLetOutId);
                    }else{//检查是否可以听牌
                        //isTingPai = this.checkTingPai(tingAct);
                    }
                }
                //cc.log("isTingPai::"+isTingPai+" selfact::"+tingAct);
                if(!isTingPai)
                    this.refreshButton(tingAct);
            }
        }
        //IP相同的显示
        if(players.length>1){
            var seats = MJRoomModel.isIpSame();
            if(seats.length>0){
                for(var i=0;i<seats.length;i++) {
                    this._players[seats[i]].isIpSame(true);
                }
            }
        }
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if (p.userId == PlayerModel.userId && p.handCardIds.length > 0) {
                if(!MJRoomModel.isTingHu() || (MJRoomModel.isTingHu() && MJRoomModel.isTing())) {
                    this.startCheckHu();
                }
            }
        }
        if(isContinue){
            if(MJRoomModel.nextSeat)
                this.showJianTou();
            else
                this.showJianTou(-1);
            this.btnInvite.visible = false;
            //if(MJRoomModel.isTing() || MJRoomModel.isHued()){
                //var myDirect = MJRoomModel.getPlayerSeq(PlayerModel.userId,MJRoomModel.mySeat, MJRoomModel.mySeat);
                //this.layouts[myDirect].csGangPai();
            //}
            //this.Label_info_mj.y = 160;
        }else{
            this.root.removeChildByTag(MJRoomEffects.BAO_TAG);
            this.jt.visible = false;
            //this.Label_info_mj.y = 280;
        }
        if(isContinue||MJRoomModel.nowBurCount>1) {
            if (this.Label_jsq) {
                var time = MJRoomModel.getJSQTime();
                this.jsqShi = Math.floor(time / 3600);
                this.jsqFen = Math.floor((time - this.jsqShi * 3600) / 60);
                if (this.jsqFen >= 60) {
                    this.jsqShi++;
                    this.jsqFen = 0;
                }
                this.startTime = new Date().getTime() - (time - this.jsqShi * 3600 - this.jsqFen * 60) * 1000;
                var strShi = (this.jsqShi < 10) ? "0" + this.jsqShi : this.jsqShi;
                var strFen = (this.jsqFen < 10) ? "0" + this.jsqFen : this.jsqFen;
                this.Label_jsq.setString("计时器\n" + strShi + ":" + strFen);
                this.startJS = true;
                this.Label_jsq.visible = true;
            }
        }
    },

    updateCountDown:function(number){
        this._countDown = number;
        var countDown = (this._countDown<10) ? "0"+this._countDown : ""+this._countDown
        this.countDownLabel.setString(countDown);
        //if(this.jt.visible&&this._countDown>=0&&this._countDown<=3){
        //    AudioManager.play("res/audio/common/timerEffect.mp3");
        //}
    },

    startCheckHu:function(){
        this.isCheckHu = true;
        this.curIndex = 0;
        this.checkHuResult.length = 0;
    },


    update:function(dt){
        this._dt += dt;
        PlayMJMessageSeq.updateDT(dt);
        if(this._dt>=1){
            this.updateJSQ()
            this._dt = 0;
            if(this._countDown >= 0 && this.countDownLabel){
                this.updateCountDown(this._countDown);
                this._countDown--;
            }
            this._timedt+=1;
            if(this._timedt%60==0)
                this.calcTime();
            if(this._timedt>=180){
                this._timedt = 0;
                this.calcWifi();
            }
        }
       /* this.onCheckHuByPutOut();
        if(this.isTingPai) {
            this.onCheckHuByBaoTing();
        }*/
    },

    ////取消托管
    //unTrusteeship:function(){
    //    MJRoomModel.isTrusteeship = 0;
    //    //this.Image_cover.visible = false;
    //    sySocket.sendComReqMsg(203,[0]);
    //},
    //
    ////设置是否托管
    //onSetIsTrusteeship:function(event){
    //    var data = event.getUserData(); //[status,seat]
    //    MJRoomModel.isTrusteeship = data[0];
    //    if(data[1]==MJRoomModel.mySeat){
    //        //this.Image_cover.visible = (MJRoomModel.isTrusteeship==1) ? true : false;
    //    }
    //    this._players[data[1]].showTrusteeship(MJRoomModel.isTrusteeship);
    //},

    /**
     * 检查听牌
     * @param selfAct
     */
    checkTingPai:function(selfAct){
        if (!MJRoomModel.isTingHu()) {
            return false;
        }
        var data1 = MJRoomModel.mineLayout.getPlace1Data();
        var isTing = false;
        if(data1.length%3==2 && !MJRoomModel.isTing()){
            var huBean = new MajiangHuBean();
            huBean.setFuPaiType(MJRoomModel.getFuType());
            huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
            huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
            var result = MJAI.isTingPai(data1,huBean);
            if(result&&result.length>0){
                //将结果缓存下
                MJRoomModel.nearestTingResult = result;
                if(selfAct.length>0){
                    selfAct[7] = 1;
                }else{
                    selfAct = [0,0,0,0,0,0,0,1,0];
                }
                isTing = true;
                this.refreshButton(selfAct);
                MJRoomModel.mineLayout.ccTingPai();
            }
        }
        return isTing;
    },

    updateRemain:function(){
        this.Image_info2.removeChildByTag(999);
        var textRenderer =  new cc.LabelTTF("剩"+MJRoomModel.remain+"张", "", 22);
        var ele1 = [];
        ele1.push(RichLabelVo.createTextVo("剩",cc.color("#AFD1BA"),22));
        ele1.push(RichLabelVo.createTextVo(MJRoomModel.remain+"",cc.color("#f6c143"),22));
        ele1.push(RichLabelVo.createTextVo("张",cc.color("#AFD1BA"),22));
        var label = new RichLabel(cc.size(120,30));
        label.setLabelString(ele1);
        label.x = (this.Image_info2.width-textRenderer.getContentSize().width)/2;
        label.y = 16;
        this.Image_info2.addChild(label,1,999);
        if (MJRoomModel.remain == 4) {
            var winSize = cc.director.getWinSize();
            var last4 = new cc.Sprite("res/ui/gansu_mj/mjRoom/last4.png");
            last4.x = winSize.width/2+42;
            last4.y = winSize.height/2;
            this.root.addChild(last4,9999);
            last4.runAction(cc.sequence(cc.delayTime(3),cc.fadeOut(2),cc.callFunc(function() {
                last4.removeFromParent(true);
            })));
        }
    },

    getFontColorByBgColor:function(bgColor){
        var bgColor = parseInt(bgColor);
        var fontColor = [];
        switch (bgColor){
            case 1:
                fontColor = ["#fcdd31","#4fda9b"];
                break;
            case 2:
                fontColor = ["#fbdd31","#3cf1ef"];
                break;
            case 3:
                fontColor = ["#f6ff4e","#6e4114"];
                break;
            default :
                fontColor = ["#fcdd31","#4fda9b"];
                break;
        }
        return fontColor;
    },


    onChangeStauts:function(event){
        var message = event.getUserData();
        var params = message.params;
        var seat = params[0];
        this._players[seat].onReady();
        if(seat == this.getModel().mySeat){
            this.btnReady.visible = false;
            this.btnInvite.visible = (ObjectUtil.size(this._players)<4);
        }
    },

    updateRoomInfo:function(){
        var color = color || this.bgColor;
        var fontColor = this.getFontColorByBgColor(color);
        this.Label_info_mj.setColor(cc.color(fontColor[1]));
        this.updateRemain();
        var zuizi = MJRoomModel.getZuiZiName(MJRoomModel.getFuType());
        //var wa = MJRoomModel.getHuCountName(MJRoomModel.getHuCountConf());
        var jifen = MJRoomModel.getJiFenName(MJRoomModel.getJiFenConf());
        var cp = MJRoomModel.getChiPengName(MJRoomModel.getChiPengConf());
        var ting = MJRoomModel.getTingHuName(MJRoomModel.getTingHuConf());
        var jianglei = MJRoomModel.getJiangLeiName(MJRoomModel.getJiangLeiConf());
        this.Label_info_mj.setString(csvhelper.strFormat("{0} {1} {2} {3} {4}",zuizi,cp,jianglei,ting,jifen));
        this.Image_info1.removeChildByTag(999);
        var textRenderer =  new cc.LabelTTF(MJRoomModel.nowBurCount+"/"+MJRoomModel.totalBurCount+"局", "", 22);
        var ele1 = [];
        ele1.push(RichLabelVo.createTextVo(MJRoomModel.nowBurCount+"",cc.color(246,193,67),22));
        ele1.push(RichLabelVo.createTextVo("/"+MJRoomModel.totalBurCount+"局",cc.color("#AFD1BA"),22));
        var label = new RichLabel(cc.size(100,30),1);
        label.setLabelString(ele1);
        label.x = (this.Image_info1.width-textRenderer.getContentSize().width)/2;
        label.y = 16;
        this.Image_info1.addChild(label,1,999);
    },

    /**
     * 吃、杠牌等操作需要选择时的展示
     * @param action
     * @param resultArray {Array.<Array.<MJVo>>}
     * @param totalCount
     */
    displaySelectMahjongs:function(action,resultArray){
        if(this.Panel_btn.getChildByTag(123))
            this.Panel_btn.removeChildByTag(123);
        var totalCount = 0;
        for(var i=0;i<resultArray.length;i++){
            totalCount += resultArray[i].length;
        }
        var scale = 1;
        var bg = new cc.Scale9Sprite("res/ui/mj/img_50.png");
        bg.anchorX=bg.anchorY=0
        bg.setContentSize(totalCount*52*scale+(25*(resultArray.length+1)),86*scale + 30);
        if(bg.width>this.Panel_btn.width){
            bg.x = this.Panel_btn.width-bg.width;
        }else{
            bg.x = this.Panel_btn.width-bg.width-100;
        }
        bg.y = 170;
        var count = 0;

        var tipLabel = new UICtor.cLabel("请点击麻将选择要操作的牌",30);
        tipLabel.setPosition(bg.width/2,bg.height - 20);
        tipLabel.setColor(cc.color.YELLOW);
        bg.addChild(tipLabel,1);

        for(var i=0;i<resultArray.length;i++){
            var chiArr = resultArray[i];
            var initX = (i+1)*25;
            for(var j=0;j<chiArr.length;j++){
                var chiVo = chiArr[j];
                chiVo.se = action;
                if(action==MJAction.CHI){
                    chiVo.ids = [chiArr[0].c,chiArr[2].c];
                }else if(action==MJAction.XIA_DAN){
                    var danIds = [];
                    for(var d=0;d<chiArr.length;d++){
                        danIds.push(chiArr[d].c);
                    }
                    chiVo.ids = danIds;
                }else{
                    chiVo.ids = [chiArr[0].c];
                }
                var mahjong = new Mahjong(MJAI.getDisplayVo(1,3),chiVo);
                mahjong.scale=scale;
                mahjong.x = initX+50*scale*count;mahjong.y = 3;
                bg.addChild(mahjong);
                if(action==MJAction.CHI && j==1){
                    mahjong._bg.setColor(cc.color.YELLOW);
                }
                count++;
            }
        }
        this.Panel_btn.addChild(bg,1,123);
    },

    /**
     * 吃碰杠胡操作
     * @param obj
     * @param isAlert
     */
    onOperate:function(obj,isAlert){
        isAlert = isAlert || false;
        var self =this;
        var temp = obj.temp;
        switch (temp){
            case MJAction.HU:
                MJRoomModel.sendPlayCardMsg(1,[]);
                break;
            case MJAction.TING:
                var start = new Date().getTime();
                this.Panel_btn.visible = false;
                MJRoomModel.nextSeat = MJRoomModel.mySeat;
                MJRoomModel.isTingSelecting = true;
                MJRoomModel.selfAct.length=0;
                //var start = new Date().getTime();
                //var data1 = MJRoomModel.mineLayout.getPlace1Data();
                //var huBean = new MajiangHuBean();
                //huBean.setFuPaiType(MJRoomModel.getFuType());
                //huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
                //huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
                //var hu = new MajiangSmartFilter();
                //MJRoomModel.nearestTingResult = hu.checkTing(data1, huBean);
                //MJRoomModel.mineLayout.ccTingPai();
                //cc.log("onCheckHuByPutOut cost time::"+(new Date().getTime()-start));
                break;
            case MJAction.PENG:
            case MJAction.GANG:
            case MJAction.BU_ZHANG:
                var ids = [];
                var myLayout = this.getLayout(MJRoomModel.getPlayerSeq(PlayerModel.userId));
                var allMJs = myLayout.getPlace1Data();
                if(allMJs.length%3==2){//摸牌了，手上的牌和摊开的牌都需要找一遍
                    var result = MJAI.getGang(allMJs,myLayout.getPlace2Data());
                    if(result.length>1){
                        this.displaySelectMahjongs(temp,result);
                    }else{
                        var result0 = result[0];
                        for(var i=0;i<result0.length;i++){
                            ids.push(result0[i].c);
                        }
                        MJRoomModel.sendPlayCardMsg(temp,ids);
                    }
                }else{//别人出牌,我可以碰、杠
                    var lastVo = MJAI.getMJDef(this.lastLetOutMJ);
                    for(var i=0;i<allMJs.length;i++){
                        var vo = allMJs[i];
                        if(vo.t==lastVo.t&&vo.n==lastVo.n)
                            ids.push(vo.c);
                        if(ids.length>=temp)
                            break;
                    }
                    MJRoomModel.sendPlayCardMsg(temp,ids);
                }
                break;
            case MJAction.GUO:
                var allButtons = [];
                for(var i=0;i<MJRoomModel.selfAct.length;i++){
                    if(MJRoomModel.selfAct[i]==1)
                        allButtons.push(i);
                }
                //只有一个听的选择，是前台自己加上去的，点过时，前台自己处理，不给后台发送消息
                if(MJRoomModel.selfAct[7]==1&&allButtons.length==1){
                    this.Panel_btn.visible = false;
                    MJRoomModel.nextSeat = MJRoomModel.mySeat;
                    MJRoomModel.selfAct.length=0;
                }else{
                    var allMJs = this.getLayout(MJRoomModel.getPlayerSeq(PlayerModel.userId)).getPlace1Data();
                    var guoParams = (allMJs.length%3==2) ? [1] : [0];
                    ArrayUtil.merge(MJRoomModel.selfAct,guoParams);
                    if(obj.hasHu){
                        //Network.logReq("MJRoom::guo click...1");
                        AlertPop.show("当前为可胡牌状态，确定要选择【过】吗？",function(){
                            //Network.logReq("MJRoom::guo click...2");
                            MJRoomModel.sendPlayCardMsg(5,guoParams);
                        });
                    }else{
                        //Network.logReq("MJRoom::guo click...3");
                        MJRoomModel.sendPlayCardMsg(5,guoParams);
                    }
                }
                break;
            case MJAction.CHI:
                var lastVo = MJAI.getMJDef(this.lastLetOutMJ);
                var chi = MJAI.getChi(MJRoomModel.mineLayout.getPlace1Data(),lastVo);
                if(chi.length>1){
                    this.displaySelectMahjongs(MJAction.CHI,chi);
                }else{
                    var ids = [];
                    var array = chi[0];
                    for(var i=0;i<array.length;i++){
                        var vo = array[i];
                        if(vo.n!=lastVo.n)
                            ids.push(vo.c);
                    }
                    MJRoomModel.sendPlayCardMsg(6,ids);
                }
                break;
        }
    },

    hideAllBanker:function(){
        for(var key in this._players){
            this._players[key].isBanker(false);
        }
    },
    updateJSQ:function(){
        if(!this.startJS) return;
       var newTime =  new Date().getTime();
       if((newTime-this.startTime)<60*1000)
            return;
        this.startTime =newTime;
        this.jsqFen ++;
        if(this.jsqFen>=60){
            this.jsqShi ++;
            this.jsqFen = 0;
        }
        var strShi = (this.jsqShi<10)?"0"+this.jsqShi:this.jsqShi;
        var strFen = (this.jsqFen<10)?"0"+this.jsqFen:this.jsqFen;
        this.Label_jsq.setString("计时器\n"+strShi+":"+strFen);
    },
    startGame:function(event){
        //this.Label_info_mj.y = 160;
        this.startTime = new Date().getTime();
        this.startJS = true;
        this.Label_jsq.visible = true;
        this.tingList.length=0;
        this.lastLetOutMJ=this.lastLetOutSeat=0;
        this.updateRoomInfo();
        for(var i=1;i<=4;i++){
            this.getWidget("oPanel"+i).removeAllChildren(true);
            var layout = this.layouts[i];
            if(layout)//清理掉上一次的牌局数据
                layout.clean();
        }
        this.btnInvite.visible = this.btnReady.visible =false;
        var p = event.getUserData();
        this.showJianTou();
        this.updateCountDown(this.COUNT_DOWN);
        var direct = MJRoomModel.getPlayerSeq(PlayerModel.userId,MJRoomModel.mySeat,MJRoomModel.mySeat);
        this.initCards(direct,p.handCardIds,[],[],[]);
        this.hideAllBanker();
        this._players[p.banker].isBanker(true);
        //其他3人手上的牌
        for(var i=1;i<=4;i++){
            if(i != MJRoomModel.mySeat){
                var d = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,i);
                var iseat = (i==p.banker) ? i : null;
                this.initCards(d,[],[],[],[],iseat);
            }
            var mjp = this._players[i];
            if(mjp)
                mjp.startGame();
        }
        var isTing = false;
        //if(p.handCardIds.length%3==2)
        //    isTing = this.checkTingPai(p.selfAct);
        if(!isTing)
            this.refreshButton(p.selfAct);
    },


    findPutOutByTing:function(event){
       /* var start = new Date().getTime();
        var data1 = MJRoomModel.mineLayout.getPlace1Data();
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(MJRoomModel.getFuType());
        huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
        var hu = new MajiangSmartFilter();
        MJRoomModel.nearestTingResult = hu.checkTing(data1, huBean);*/
         var msg = event.getUserData();
        if(msg.info.length<=0) {
            PlayMJMessageSeq.finishPlay();
            return;
        }
        var List = [];
        for(var i=0;i<msg.info.length;i++){
            List.push(msg.info[i].majiangId);
        }
        MJRoomModel.nearestTingResult = MJAI.getVoArray(List);
        MJRoomModel.mineLayout.ccTingPai();
        PlayMJMessageSeq.finishPlay();
        //cc.log("findPutOutByTing cost time::"+(new Date().getTime()-start));
    },

    /**
     *
     * @param selfAct {Array.<number>}
     */
    refreshButton:function(selfAct){
        MJRoomModel.selfAct = selfAct || [];
        if(selfAct.length>0){
            if(selfAct[7] == 1) {
                //this.findPutOutByTing();
                //this.startCheckTing();
            }
            this.resetBtnPanel();
            this.Panel_btn.visible = true;
            var textureMap = {0:{t:"res/ui/gansu_mj/mjRoom/mj_btn_hu.png",v:1},1:{t:"res/ui/gansu_mj/mjRoom/mj_btn_peng.png",v:2},
                               2:{t:"res/ui/gansu_mj/mjRoom/mj_btn_gang.png",v:3},3:null,4:{t:"res/ui/gansu_mj/mjRoom/mj_btn_chi.png",v:6},
                               5:{t:"res/ui/gansu_mj/mjRoom/mj_btn_gang.png",v:7},
                               7:{t:"res/ui/gansu_mj/mjRoom/mj_btn_ting.png",v:21}};
            var rIndex=0;
            var hasHu = false;
            var btnCount = 0;
            for(var i=0;i<selfAct.length;i++) {
                var temp = selfAct[i];
                var tm = textureMap[i];
                if (temp == 1) {
                    if(tm && parseInt(tm.v)==1) {
                        if (MJRoomModel.isHued()) {
                            selfAct[i] = 0;
                        }else {
                            hasHu=true;
                        }
                    }
                    if(selfAct[i] == 1) {
                        btnCount++;
                    }
                }
            }
            if(btnCount <= 0) {
                this.Panel_btn.visible = false;
                return;
            }
            var textureLog = "";
            //过
            this.hbtns[rIndex].visible = true;
            this.hbtns[rIndex].loadTextureNormal("res/ui/gansu_mj/mjRoom/mj_btn_guo.png");
            this.hbtns[rIndex].temp = 5;
            this.hbtns[rIndex].hasHu = hasHu;
            rIndex++;
            for(var i=0;i<selfAct.length;i++){
                var temp = selfAct[i];
                var tm = textureMap[i];
                if(temp==1 && tm){
                    this.hbtns[rIndex].visible = true;
                    this.hbtns[rIndex].loadTextureNormal(tm.t);
                    this.hbtns[rIndex].temp = parseInt(tm.v);
                    rIndex++;
                    textureLog+=tm.t+",";
                }
            }
            for(;rIndex<6;rIndex++){
                this.hbtns[rIndex].visible = false;
            }
        }
    },

    onGetMajiang:function(event){
        var message = event.getUserData();
        var seat = message.seat;
        MJRoomModel.nextSeat = seat;
        var selfAct = message.selfAct;//[胡,碰,刚]
        var ids = message.majiangIds;
        this.showJianTou(seat);
        //this.refreshButton(selfAct);
        var id = ids.length>0 ? ids[0] : 0;
        this.getLayout(MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,seat)).moPai(id);
        if(MJRoomModel.isGSMJ()){
            var isTing = false;
            if (seat == MJRoomModel.mySeat && !MJRoomModel.isTing()) {
                //isTing = this.checkTingPai(selfAct);
            }
            if(!isTing)
                this.refreshButton(selfAct);
            MJRoomModel.remain=message.remain;
            if((MJRoomModel.isTing(seat) || MJRoomModel.isHued(seat)) && seat==MJRoomModel.mySeat && id>0){//直接出牌
                MJRoomModel.needAutoLetOutId = id;
            }
        }else{
            this.refreshButton(selfAct);
            MJRoomModel.remain-=1;
        }
        this.updateRemain();
        PlayMJMessageSeq.finishPlay();
    },

    /**
     * 出牌统一处理
     * @param id
     * @param seat
     * @param direct
     * @param userId
     */
    chuPaiAction:function(id,seat,direct,userId){
        this.lastLetOutMJ = id;
        this.lastLetOutSeat = seat;
        if(this.lastLetOutMJ==MJRoomModel.needAutoLetOutId)//清理掉自动出牌的值
            MJRoomModel.needAutoLetOutId = 0;
        var vo = MJAI.getMJDef(id);
        this.showJianTou(-1);
        MJRoomSound.letOutSound(userId,vo);
        this.layouts[direct].chuPai(vo);
        this._players[seat].chuPai(vo);
        MJRoomSound.pushOutSound();
        if(seat==MJRoomModel.mySeat){
            //没听牌，托管时间到了，后台打出了牌，取消听的状态
            if(!MJRoomModel.isTing(seat) && MJRoomModel.isTrusteeship){
                MJRoomModel.mineLayout.ccCancelTingPai();
            }
            if(!MJRoomModel.hasChuPai)
                MJRoomModel.hasChuPai = true;
            if (!MJRoomModel.isHued() && !MJRoomModel.isTingHu()) {
                this.startCheckHu();
            }
        }
    },


    startCheckTing:function(){
        MJCheckStage.clean();
        MJRoomModel.nearestTingResult.length = 0;
        this.isTingPai = true;
        this.checkTingNum = 0;
        this.curIndex = 0;
    },


    //听牌
    onCheckHuByBaoTing:function(){
        var start = new Date().getTime();
        var data1 = MJRoomModel.mineLayout.getPlace1Data();
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(MJRoomModel.getFuType());
        huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
        var hu = new MajiangSmartFilter();
        var result = hu.checkTing(data1, huBean,this.checkTingNum,this.curIndex);
        this.curIndex += MJAI.LANZHOU_CHECK_NUMS;
        if(this.curIndex >=MJAI.MJ.length) {
            this.curIndex = 0;
            this.checkTingNum++;
        }
        if(result.length>0){
            ArrayUtil.merge(result,MJRoomModel.nearestTingResult);
        }
        if(this.checkTingNum > data1.length){
            this.isTingPai = false;
            MJRoomModel.mineLayout.ccTingPai();
        }
        //cc.log("onCheckHuByBaoTing cost time:::::::"+(new Date().getTime()-start));
    },

    //出牌检测
    onCheckHuByPutOut:function(){
        /*if(this.isCheckHu){
            var start = new Date().getTime();
            var huBean = new MajiangHuBean();
            var allMJs = MJRoomModel.mineLayout.getPlace1Data();
            if(allMJs.length % 3 == 2){
                allMJs = ArrayUtil.clone(allMJs);
                allMJs.pop();
            }
            huBean.setFuPaiType(MJRoomModel.getFuType());
            huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
            huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
            var smart = new MajiangSmartFilter();
            var list = smart.findHuCards(allMJs,huBean,false,this.curIndex);
            if(list.length > 0) {
                ArrayUtil.merge(list, this.checkHuResult);
            }
            //this.curIndex += MJAI.LANZHOU_CHECK_NUMS;
            //if(this.curIndex > MJAI.MJ.length){
                this.isCheckHu = false;
               this.onShowHuCards(this.checkHuResult);
            //}
            //cc.log("onCheckHuByPutOut cost time::"+(new Date().getTime()-start));
        }*/
    },

    onShowHuCards:function(huArray){
        this.Panel_ting.removeAllChildren(true);
        this.tingList.length=0;
        if(huArray.length>0){
            this.Panel_ting.removeAllChildren(true);
            var orderNum = 0;
            this.Label_ting.visible = this.Panel_ting.visible = true;
            for(var key in huArray){
                var vo = huArray[key];
                //vo.tingDisplay = 1;
                var card = new Mahjong(MJAI.getDisplayVo(1,4),huArray[key]);
                card.x = orderNum*27;
                card.y = 0;
                this.Panel_ting.addChild(card);
                orderNum += 1;
                this.tingList.push(card);
            }
            MJRoomModel.setLocalBySmartFitler(huArray);
        }else{
            this.hideTing();
        }
    },


    /**
     * 收到出牌消息，前台开始处理
     * @param event
     */
    onLetOutCard:function(event){
        this.updateCountDown(this.COUNT_DOWN);
        var message = event.getUserData();
        var userId = message.userId;
        var seat = message.seat;
        var action = message.action;
        var selfAct = message.selfAct;
        var ids = message.majiangIds;
        var simulate = message.simulate;
        var ext = message.ext;
        var isOtherHasAction = 0;
        if(ext && ext.length>0)
            isOtherHasAction = parseInt(ext[0]);
        var direct = MJRoomModel.getPlayerSeq(userId,MJRoomModel.mySeat,seat);
        //前台自己已经模拟了出牌的消息，后台给过来的出牌消息不处理后续逻辑
        if(seat==MJRoomModel.mySeat&&action==0&&ids.length>0&&!simulate){
            if(this.getLayout(1).getOneMahjongOnHand(ids[0])==null) {
                PlayMJMessageSeq.finishPlay();
                return;
            }
        }
        MJRoomModel.isTingSelecting=false;
        this.Panel_btn.visible = false;
        for(var lay in this.layouts){
            this.layouts[lay].hideFinger();
        }
        this.updateRemain();
        switch (action){
            case MJAction.CHU_PAI://出牌动作
                //刷新一下玩家状态
                this._players[seat].setPlayerOnLine();
                if(isOtherHasAction==0){
                    var nextSeat = MJRoomModel.seatSeq[seat][1];
                    MJRoomModel.nextSeat = nextSeat;
                }
                if(ids.length>0){
                    this.chuPaiAction(ids[0],seat,direct,userId);
                }
                break;
            case MJAction.HU://胡牌动作
                var lastId = ids[ids.length-1];
                this.layouts[direct].huPai(ids,message.zimo,message.fromSeat);
                var prefix = (message.zimo==1) ? "zimo" : "hu";
                MJRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+direct),userId);
                MJRoomSound.actionSound(userId,prefix);
                MJRoomModel.hued(seat, {action:(message.zimo==1) ? 0 : 1,cards:[lastId]});
                if(message.fromSeat){
                    var fromDirect = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,message.fromSeat);
                    this.layouts[fromDirect].playDianPaoEff();
                    this.layouts[fromDirect].beiPengPai(lastId);
                }
                var loseActionArray = [];
                var zhuangTarget = this._players[seat];
                var ext = message.ext[1].split(",");
                var score = parseInt(ext[2]);
                if (message.fromSeat) {
                    loseActionArray.push({target:this._players[message.fromSeat],point:score});
                    this._players[seat].changeSPoint(score);
                    this._players[message.fromSeat].changeSPoint(-score);
                } else {
                    this._players[seat].changeSPoint(score*3);
                    for (var key in this._players) {
                        if (key != seat) {
                            this._players[key].changeSPoint(-score);
                            loseActionArray.push({target:this._players[key],point:score});
                        }
                    }
                }
                this._effectLayout.runJettonAction(loseActionArray, zhuangTarget);
                break;
            case MJAction.GUO://过
                if(isOtherHasAction == 0)
                    MJRoomModel.nextSeat = seat;
                this.showJianTou();
                //点了过，还有可能有需要自动出牌的操作需要做
                if(MJRoomModel.needAutoLetOutId>0)
                    MJRoomModel.chuMahjong(MJRoomModel.needAutoLetOutId);
                break;
            case MJAction.XIAO_HU://小胡 六六顺、板板胡等
                //this.layouts[direct].xiaohu(ids);
                //var huArray = message.huArray;
                //MJRoomEffects.normalAction(this.root,"btn_cs_xiaohu_"+huArray[0],this.getWidget("cp"+direct));
                break;
            case MJAction.TING://听牌特殊处理，先出牌，再播听牌动画
                prefix = "ting";
                MJRoomModel.ting(seat);
                var self = this;
                this._players[seat].tingPai();
               /* if(MJRoomModel.isTrusteeship){//托管状态
                    this._players[seat].unTingPai();
                }*/
                MJRoomEffects.normalAction(self.root,prefix,self.getWidget("cp"+direct));
                MJRoomSound.actionSound(userId,prefix);
                if (ids.length>0) {
                    self.chuPaiAction(ids[0],seat,direct,userId);
                }
               /* if (seat == MJRoomModel.mySeat) {
                    var vo = MJAI.getMJDef(ids[0]);
                    var huCards = MJRoomModel.getTingWithMahjong(vo);
                    this.onShowHuCards(huCards);
                }*/
                break;
            default://补张、吃、碰、杠牌动作
                var showTing = true;
                var beiPengId = ids[ids.length-1];
                var prefix = "peng";
                if(action==MJAction.BU_ZHANG){
                    prefix = "bu";
                    showTing = false;
                }else if(action==MJAction.CHI){
                    beiPengId = ids[1];
                    prefix = "chi";
                }else if(ids.length>3 || ids.length==1){
                    prefix = "gang";
                    MJRoomModel.gang(seat);
                    showTing = false;
                }
                this.layouts[direct].pengPai(ids,action,message.fromSeat);
                MJRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+direct));
                if(message.fromSeat){
                    var fromDirect = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,message.fromSeat);
                    this.layouts[fromDirect].beiPengPai(beiPengId);
                }
                MJRoomModel.nextSeat = seat;
                this.showJianTou();
                MJRoomSound.actionSound(userId,prefix);
                break;
        }
        this.refreshButton(selfAct);
        PlayMJMessageSeq.finishPlay();
    },

    refreshTingNum:function(card){
        var num = 4;
        var allOutCards = this.getAllOutCard();
        for(var i=0;i<allOutCards.length;i++){
            if(card._cardVo.i == allOutCards[i].i){
                num -= 1;
            }
        }
        if(num>0){
            card.tingpaiSprite.visible = true;
            card.tingpaiLab.setString(num);
            card.shadeSprite.visible = false;
        }else{
            card.tingpaiSprite.visible = false;
            card.shadeSprite.visible = true;
        }
    },

    hideTing: function() {
        this.Label_ting.visible = this.Panel_ting.visible = false;
    },

    /**
     * 显示可以胡的牌
     */
    smartFitlerMayHuPai:function(isReconect){
    	var allMJs = this.getLayout(MJRoomModel.getPlayerSeq(PlayerModel.userId)).getPlace1Data();
        //重连进来的情况，可能手上已经摸了牌了，把最后一张牌剔除
        if(isReconect && (!MJRoomModel.isTingHu() || MJRoomModel.isTing()) && MJRoomModel.isNeedSmartFitler()) {
            if(allMJs.length%3==2) {
                allMJs = ArrayUtil.clone(allMJs);
                allMJs.pop();
            }
        }
        if(allMJs.length%3!=1) {
            //cc.log("no need to smartFitlerMayHuPai...");
            return;
        }
        //重连进来时，如果是报听胡，没报听的情况，不提示胡牌
        if (isReconect && MJRoomModel.isTingHu() && !MJRoomModel.isTing()) {
            return;
        }
        var start = new Date().getTime();
        var huBean = new MajiangHuBean();
        huBean.setFuPaiType(MJRoomModel.getFuType());
        huBean.setJiangLei(MJRoomModel.getJiangLeiConf());
        huBean.setJiangModDefList(MJAI.getJiangDefList(MJRoomModel.getJiangConf()));
        var smart = new MajiangSmartFilter();
        var list = smart.isHu(allMJs,huBean);
        cc.log("smartFitlerMayHuPai cost time::"+(new Date().getTime()-start));
    	this.Panel_ting.removeAllChildren(true);
        this.tingList.length=0;
    	if(list.length>0){
            this.Panel_ting.removeAllChildren(true);
            var orderNum = 0;
            this.Label_ting.visible = this.Panel_ting.visible = true;
            for(var key in list){
                var vo = list[key];
                //vo.tingDisplay = 1;
                var card = new Mahjong(MJAI.getDisplayVo(1,4),list[key]);
                card.x = orderNum*27;
                card.y = 0;
                this.Panel_ting.addChild(card);
                orderNum += 1;
                this.tingList.push(card);
            }
            MJRoomModel.setLocalBySmartFitler(list);
            //for(var i=0;i<this.tingList.length;i++){
            //    this.refreshTingNum(this.tingList[i]);
            //}
    	}else{
            this.hideTing();
    	}
    },
    
    getAllOutCard:function(){
    	var outCards = [];
    	for(var i=0;i<MJRoomModel.players.length;i++){
    		var p = MJRoomModel.players[i];
    		var seq = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat, p.seat);
    		var layout = this.getLayout(seq);
    		if(p.userId == PlayerModel.userId && layout.getPlace1Data().length>0){
    			ArrayUtil.merge(layout.getPlace1Data(),outCards);
    		}
    		if(layout.gangPai.length>0){
    			ArrayUtil.merge(layout.gangPai,outCards);
    		}
    		if(layout.getPlace2Data().length>0){
    			ArrayUtil.merge(layout.getPlace2Data(),outCards);
    		}
    		if(layout.getPlace3Data().length>0){
    			ArrayUtil.merge(layout.getPlace3Data(),outCards);
    		}
    	}
    	return outCards;
    },

    /**
     * 邀请
     */
    onInvite:function(){
        var wanfa = "小甘麻将";
        var queZi = "4缺"+(4 - MJRoomModel.players.length);
    	var obj={};
    	obj.tableId=MJRoomModel.tableId;
    	obj.userName=PlayerModel.username;
    	obj.callURL=SdkUtil.SHARE_URL+'?num='+MJRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
    	obj.title=wanfa+'  房号['+MJRoomModel.tableId+"] "+queZi;
        var zuizi = MJRoomModel.getZuiZiName(MJRoomModel.getFuType());
        var wa = MJRoomModel.getHuCountName(MJRoomModel.getHuCountConf());
        var cp = MJRoomModel.getChiPengName(MJRoomModel.getChiPengConf());
        var ting = MJRoomModel.getTingHuName(MJRoomModel.getTingHuConf());
        var jianglei = MJRoomModel.getJiangLeiName(MJRoomModel.getJiangLeiConf());
        var fangfei = MJRoomModel.getFangFeiName(MJRoomModel.getFangFei());
        var jifen = MJRoomModel.getJiFenName(MJRoomModel.getJiFenConf());
        var difen = MJRoomModel.getDifenName(MJRoomModel.getDiFen());
        var youxiName = "兰州麻将";
        if(MJRoomModel.tableType == 1){
            youxiName = "[亲友圈]兰州麻将";
        }
    	obj.description=csvhelper.strFormat("{0} {1}局  {2} {3} {4} {5} {6} {7} {8} {9}",youxiName,MJRoomModel.totalBurCount,fangfei,zuizi,cp,jianglei,ting,wa,jifen,difen);
    	obj.shareType=1;
    	//SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    onJoin:function(event){
        var p = event.getUserData();
        var seq = MJRoomModel.getPlayerSeq(p.userId,MJRoomModel.mySeat, p.seat);
        this._players[p.seat] = new MJPlayer(p,this.root,seq);
        var me = MJRoomModel.getPlayerVo();
        this.btnInvite.visible = (ObjectUtil.size(this._players)<4)&&me.status;
        var seats = MJRoomModel.isIpSame();
        if(seats.length>0){
            for(var i=0;i<seats.length;i++) {
                this._players[seats[i]].isIpSame(true);
            }
        }
    },

    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout)
            return layout;
        layout = new MJLayout();
        this.layouts[direct] = layout;
        return layout;
    },

    showJianTou:function(seat){
        this.jt.visible = true;
        seat = seat || MJRoomModel.nextSeat;
        for(var i=1;i<=4;i++){
            this.getWidget("jt"+i).visible = false;
        }
        if(seat != -1 && seat!=null){
            var seq = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,seat);
            var direct = MJRoomModel.getJTSeq(seq);
            this.getWidget("jt"+direct).visible = true;
        }
    },


    /**
     *
     * @param direct
     * @param p1Mahjongs {Array.<MJVo>}
     * @param p2Mahjongs {Array}
     * @param p3Mahjongs {Array.<MJVo>}
     * @param anMahjongs {Array}
     * @param bankerSeat {number}
     * @param isMoPai {Boolean}
     */
    initCards:function(direct,p1Mahjongs,p2Mahjongs,p3Mahjongs,p4Mahjongs,bankerSeat,isMoPai){
        var layout = this.getLayout(direct);
        layout.initData(direct,this.getWidget("mPanel"+direct),this.getWidget("oPanel"+direct),this.getWidget("hPanel"+direct));
        layout.refresh(p1Mahjongs,p2Mahjongs,p3Mahjongs,p4Mahjongs,bankerSeat,isMoPai);
        if(direct==1){
            MJRoomModel.mineLayout = layout;
        }
    }
});
