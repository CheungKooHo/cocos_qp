/**
 * Created by Administrator on 2017/5/12.
 */
var MatchDtzRoom = BaseRoom.extend({

//原Room.js 中的代码
    _cardPanel: null,
    _cardW: 96,
    _cardG: 40, //65
    //用于卡牌定位
    firstLineLimit : 22,
    initCardYLine1 : 100,
    initCardYLine2 : 20,
    line1cardNumber:0,
    line2cardNumber:0,
    initX : 100,
    _cardScale:1.1,
    _letOutCardScale:0.85,
    /**
     * {Array.<DTZBigCard>}
     */
    choiceTeamCardList: [],
    _cards: [],
    _allCards: [],
    _cCardPattern: null,
    _lastCardPattern: null,
    _lastLetOutSeat: 0,
    _touchedCards: null,
    _touchListener: null,
    _startId: null,
    _currentlyMoveId: null,
    _startX: null,
    _touchBeganX: null,
    _isLeft2Right: false,
    _isLeft2RightWithBegan: false,
    _players: null,
    seatSeq: {},
    _letOutButtonTouchable: null,

    //附加记录的卡牌
    _curChoiceCards:null,
    _curChoiceCardsTypeData:null,
    _curTipCard: null,
    _lastCardTypeData:null,

    //左上角分数详情
    roomCurScore:0,  //当前牌面分数
    roomFiveNum:0,   //5个数
    roomTenNum:0,    //10个数
    roomKNum:0,      //k个数
    curaTeamScore:0, //本局a组得分
    curbTeamScore:0, //本局b组得分
    aTeamAllScore:0,    // a组总得分
    bTeamAllScore:0,    // b组总得分
    aTeamTongziScore:0, // a组总筒子分
    bTeamTongziSscore:0,// b组总筒子分


    // 原OnlineRoom.js
    _statusMap: null,
    _dt: null,
    _countDown: null,
    _timedt: null,
    //
    _hasChoiceTeam: false,

    _pzLableColor: [],
    showResultTimeOutHandle:null,
    matchWaitTime:0,

    ctor: function (name) {
        this._letOutButtonTouchable = true;
        this._cards = [];
        this._allCards = [];
        this._touchedCards = [];
        this._players = {};
        this.seatSeq = DTZRoomModel.seatSeq;
        //var layerName = DTZRoomModel.is4Ren() ? LayerFactory.DTZ_ROOM : LayerFactory.DTZ_3REN_ROOM;
        //if(DTZRoomModel.isMoneyRoom()){
        //    layerName = LayerFactory.DTZ_MONEY_ROOM;
        //}
        this._renshu = DTZRoomModel.is4Ren() ? 4 : 3;
        this._statusMap = {};
        this._dt = 0;
        //this._countDown = DTZRoomModel.getTuoguanTime();
        this._timedt = 0;
        this._curChoiceCards = null;
        this._curChoiceCardsTypeData = null;
        this._curTipCard =  null;
        this._lastCardTypeData = null;
        this.matchWaitTime = 0;//比赛场等待的时间
        this._super(name);
    },

    /**
     * 获取网络状态的PNG图片
     * @param type
     * @returns {string}
     */
    getNetTypePNG:function(type){
        return "res/ui/dtz/dtzRoom/net_" + type + ".png";
    },

    getWidgetName:function(wName){
        var name = "";
        switch(wName){
            case this.BTN_READY:
                name = "Button_30";
                break;
            case this.BTN_INVITE:
                name = "Button_17";
                break;
            case this.BTN_BREAK:
                name = "Button_6";
                break;
            case this.BTN_SETUP:
                name = "Button_23";
                break;
            case this.BTN_LEAVE:
                name = "Button_20";
                break;
            case this.BTN_CHAT:
                name = "Button_42";
                break;
            case this.BTN_YUYIN:
                name = "Button_40";
                break;
            case this.NET_TYPE:
                name = "netType";
                break;
            case this.BATTERY:
                name = "battery";
                break;
        }
        return name;
    },

    getModel: function () {
        return DTZRoomModel;
    },

    /**
     * 初始化四个玩家框
     */
    initPlayerSeat: function(){
        for(var index = 1 ; index <= this._renshu ; index ++){
            this.playerNode = ccui.helper.seekWidgetByName(this.root,"player" + index);
            this.playerNode.visible = true;

            var likaiNode = ccui.helper.seekWidgetByName(this.playerNode , "zl" + index );
            likaiNode.visible = false;

            var grayImg = ccui.helper.seekWidgetByName(this.playerNode , "imgGray" + index );
            grayImg.visible = false;

            var yyNode = ccui.helper.seekWidgetByName(this.playerNode , "yy" + index);
            yyNode.visible = false;
        }
    },

    selfRender: function () {
        //cc.log("DTZRoom...selfRender...!");
        BaseRoom.prototype.selfRender.call(this);

        for (var i = 1; i <= this._renshu; i++) {
            //if (i > 1)
            //    this.getWidget("bt" + i).visible = false;
            this.getWidget("ybq" + i).visible = false;
            UITools.addClickEvent(this.getWidget("player" + i), this, this.onPlayerInfo);
        }
        this.curScoreLable = this.getWidget("LableScore");//当前牌局分数
        this.aTeamScoreLable = this.getWidget("LableScoreA");//当前A组总分数
        this.bTeamScoreLable = this.getWidget("LableScoreB");//当前B组总分数
        this.aTeamCurScoreLable = this.getWidget("LableCurScoreA");//当前这局A组分数
        this.bTeamCurScoreLable = this.getWidget("LableCurScoreB");//当前这局B组分数

        this.roomFiveLable = this.getWidget("LableFive");
        this.roomTenLable = this.getWidget("LableTen");
        this.roomKLable = this.getWidget("LableK");

        this.roomFiveNumLable = this.getWidget("LableFiveNum");//当前牌面5的个数
        this.roomTenNumLable = this.getWidget("LableTenNum");//当前牌面10的个数
        this.roomKNumLable = this.getWidget("LableKNum");//当前牌面K的个数
        this.aTongziScoreLable = this.getWidget("LableATongzi");//a组总的筒子的分
        this.bTongziScoreLable = this.getWidget("LableBTongzi");//b组总的筒子得分
        if (!DTZRoomModel.is4Ren()) {
            this.cTeamScoreLable = this.getWidget("LableScoreC");//当前B组总分数
            this.cTeamCurScoreLable = this.getWidget("LableCurScoreC");//当前这局C组分数
            this.cTongziScoreLable = this.getWidget("LableCTongzi");//c组总的筒子得分
            this.lableNameA = this.getWidget("lableNameA");
            this.lableNameB = this.getWidget("lableNameB");
            this.lableNameC = this.getWidget("lableNameC");
        }

        this.yuyin = this.getWidget("yuyin");//语音
        this.yuyin.visible = false;
        this.Image_40 = this.getWidget("Image_40");//闹钟
        this.lableRoomRound = this.getWidget("lableRoomRound");//第几局
        this.lableRoomId = this.getWidget("lableRoomId");//房号
        this.Button_6 = this.getWidget("Button_6");//出牌;
        this.Button_4 = this.getWidget("Button_4");//提示;
        this.Button_giveUp = this.getWidget("ButtonGiveup");//不出牌
        this.Button_30 = this.getWidget("Button_30");//准备
        this.Button_20 = this.getWidget("Button_20");//退出房间
        this.Button_25 = this.getWidget("Button_25");//解散房间
        this.Image_set = this.getWidget("Image_set");
        //this.jiesuanlable = this.getWidget("dtzJiesuan");//结算分lable
        //this.jianglilable = this.getWidget("dtzJiangli");//奖励lable
        //this.RoomIdlable = this.getWidget("RoomIdImg");  //房号lable
        this.Button_sset = this.getWidget("Button_sset");
        //this.RoomIdRoot = this.getWidget("ImageRoomId"); //中间大房号根节点
        this.RoomScoreLable = this.getWidget("lableTitle_4");

        UITools.addClickEvent(this.Button_sset, this, this.onZhanKai);
        this.visibleOpButton(false);
        this.Button_17 = this.getWidget("Button_17");//邀请微信好友
        this.Button_17.visible = false;
        this.Label_39 = this.getWidget("Label_39");//时间
        this.Button_40 = this.getWidget("Button_40");//语音按钮
        this.Button_42 = this.getWidget("Button_42");//快捷聊天
        this.Button_23 = this.getWidget("Button_23");//设置
        this.btn_CancelTuoguan = this.getWidget("btn_CancelTuoguan");//取消托管按钮
        this.bg_CancelTuoguan = this.getWidget("bg_CancelTuoguan");
        if(this.bg_CancelTuoguan && this.btn_CancelTuoguan){
            this.bg_CancelTuoguan.visible = false;
            this.bg_CancelTuoguan.setLocalZOrder(100);
            UITools.addClickEvent(this.btn_CancelTuoguan, this, this.onCancelTuoguan);
        }

        UITools.addClickEvent(this.Button_42, this, this.onChat);
        UITools.addClickEvent(this.Button_23, this, this.onSetUp);

        this.btn_match = this.getWidget("btn_match");
        UITools.addClickEvent(this.btn_match, this, this.onRwardRank);

        //显示倍率
        this.beilvLabel = this.getWidget("BitmapLabel_beilv");

        //显示排名
        this.rankLabel = this.getWidget("BitmapLabel_rank");

        this.lbCoin_0 = this.getWidget("lbCoin_0");
        this.lbCoin_0.setString("");

        //比赛提示
        this.Panel_matchTip = this.getWidget("Panel_matchTip");
        this.Panel_matchTip.visible = false;

        //比赛提示时间
        this.Label_matchTipTime = this.getWidget("Label_matchTipTime");
        this.Label_matchTipTime.setString("");

        var cardPanel = this._cardPanel = ccui.helper.seekWidgetByName(this.root, "cardPanel");
        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        });
        cc.eventManager.addListener(this._touchListener, cardPanel);

        // PDKRoom.js selfRender
        this.uidText = this.getWidget("uid1");
        this.Panel_37 = this.getWidget("Panel_37");
        this.Panel_36 = this.getWidget("Panel_36");
        this.Panel_15 = this.getWidget("Panel_15");
        this.battery = this.getWidget("battery");
        this.netType = this.getWidget("netType");

        var paiNumStr = "模式：4副牌";
        if (DTZRoomModel.is3FuPai()){
            paiNumStr = "模式：3副牌";
        }
        this.paiNumLabel = this.getWidget("Label_paiNum");
        this.paiNumLabel.setString(paiNumStr);


        var endScoreStr = "结算：" + DTZRoomModel.endScore;

        var exScoreStr =  "奖励：" + DTZRoomModel.exScore;

        this.awardLabel = this.getWidget("Label_award");
        this.awardLabel.setString(exScoreStr);


        this.jsScoreLabel = this.getWidget("Label_jsScore");
        if(!DTZRoomModel.isMatchRoom()){
            this.jsScoreLabel.setString(endScoreStr);
        }

        //伸缩按钮
        this.allScoreShowBtn = this.getWidget("btn_AllScoreShow");
        this.allScoreHideBtn = this.getWidget("btn_AllScoreHide");
        this.curScoreShowBtn = this.getWidget("btn_curScoreShow");
        this.curScoreHideBtn = this.getWidget("btn_curScoreHide");
        this.curTouchPanel = this.getWidget("curScoreTouchPanel");
        this.allTouchPanel = this.getWidget("allScoreTouchPanel");

        this.allScoreNode = this.getWidget("allScoreImg");
        this.curScoreNode = this.getWidget("curScoreImg");


        UITools.addClickEvent(this.allTouchPanel, this, this.showOrHideAllScore);
        UITools.addClickEvent(this.allScoreNode , this , this.showOrHideAllScore);
        UITools.addClickEvent(this.curTouchPanel, this, this.showOrHideScore);
        UITools.addClickEvent(this.curScoreNode , this , this.showOrHideScore);
        UITools.addClickEvent(this.Panel_15, this, this.onCancelSelect, false);
        UITools.addClickEvent(this.Button_6, this, this.onPlayCard);
        UITools.addClickEvent(this.Button_4, this, this.onPlayTip);
        UITools.addClickEvent(this.Button_17, this, this.onInvite);
        UITools.addClickEvent(this.Button_30, this, this.onReady);
        UITools.addClickEvent(this.Button_20, this, this.onLeave);
        UITools.addClickEvent(this.Button_25, this, this.onBreak);
        UITools.addClickEvent(this.Button_giveUp , this , this.onGiveUp);

        //选择座位按钮
        if (DTZRoomModel.is4Ren()) {
            this.choiceSeatBtn1 = this.getWidget("ChoiceTeam_" + 1);
            this.choiceSeatBtn2 = this.getWidget("ChoiceTeam_" + 2);
            this.choiceSeatBtn3 = this.getWidget("ChoiceTeam_" + 3);
            this.choiceSeatBtn4 = this.getWidget("ChoiceTeam_" + 4);
            this.choiceSeatBtn1.setTag(1);
            this.choiceSeatBtn2.setTag(2);
            this.choiceSeatBtn3.setTag(3);
            this.choiceSeatBtn4.setTag(4);
            //增加分组按钮监听
            UITools.addClickEvent(this.choiceSeatBtn1 , this, this.onChoiceSeat);
            UITools.addClickEvent(this.choiceSeatBtn2 , this , this.onChoiceSeat);
            UITools.addClickEvent(this.choiceSeatBtn3 , this , this.onChoiceSeat);
            UITools.addClickEvent(this.choiceSeatBtn4 , this , this.onChoiceSeat);
        }

        this.addCustomEvent(SyEvent.JOIN_ROOM, this, this.onJoin);
        this.addCustomEvent(SyEvent.EXIT_ROOM, this, this.onExitRoom);
        this.addCustomEvent(SyEvent.START_PLAY, this, this.startGame);
        this.addCustomEvent(SyEvent.LET_OUT_CARD, this, this.onLetOutCard);
        this.addCustomEvent(SyEvent.OVER_PLAY, this, this.onOver);
        this.addCustomEvent(SyEvent.PLAYER_STATUS_CHANGE, this, this.onChangeStauts);
        this.addCustomEvent(SyEvent.ONLINE_OFFLINE_NOTIFY, this, this.onOnline);
        this.addCustomEvent(SyEvent.ROOM_FAST_CHAT, this, this.onFastChat);
        this.addCustomEvent(SyEvent.USER_AUDIO_PLAY_START, this, this.onStartSpeak);
        this.addCustomEvent(SyEvent.USER_AUDIO_PLAY_FINISH, this, this.onStopSpeak);
        this.addCustomEvent(SyEvent.DOUNIU_INTERACTIVE_PROP,this,this.runPropAction);
        this.addCustomEvent(SyEvent.DTZ_UPDATE_GPS , this,this.updateGpsBtn);
        this.addCustomEvent(SyEvent.ROOM_ROLD_ICON , this,this.setRoldPlayerIcon);
        this.addCustomEvent(SyEvent.UPDATE_BG_YANSE , this,this.updateBgColor);
        this.addCustomEvent(SyEvent.UPDATE_TUOGUAN , this,this.updatePlayTuoguan);
        this.addCustomEvent(SyEvent.DTZ_DEAL_SCORE , this , this.onDealScore);
        this.addCustomEvent(SyEvent.MATCH_REFRESH_RANK,this,this.updateRank);
        this.addCustomEvent(SyEvent.MATCH_SHOW_TIP,this,this.showMatchTip);
        this.addCustomEvent(SyEvent.MATCH_UP_TIP,this,this.matchUpTip);

        if(DTZRoomModel.is4FuPai()){
            //修改界面部分
            this.RoomScoreLable.setString("喜总分");
        }else{
            this.RoomScoreLable.setString("地炸/筒分");
        }

        //扑八张
        if (DTZRoomModel.is4Ren()) {
            this.getWidget("dark8Node").visible = (DTZRoomModel.isDark8 == 1);
        } else {
            this.getWidget("dark8Node").visible = true;
            var darkTexture = "res/ui/dtz/dtz3RenRoom/a_66.png";
            if (DTZRoomModel.is2Ren()) {
                if (DTZRoomModel.is4FuPai()) {
                    darkTexture = "res/ui/dtz/dtz3RenRoom/a_96.png";
                }else{
                    darkTexture = "res/ui/dtz/dtz3RenRoom/a_66.png";
                    if(DTZRoomModel.isWTZ()){
                        darkTexture = "res/ui/dtz/dtz3RenRoom/a_72.png";
                    }
                }
            }
            if (DTZRoomModel.is3Ren()) {
                if (DTZRoomModel.is4FuPai()) {
                    darkTexture = "res/ui/dtz/dtz3RenRoom/a_52.png";
                } else {
                    darkTexture = "res/ui/dtz/dtz3RenRoom/a_9.png";
                    if(DTZRoomModel.isWTZ()){
                        darkTexture = "res/ui/dtz/dtz3RenRoom/a_15.png";
                    }
                }
            }
            this.getWidget("dark8Node").loadTexture(darkTexture);
        }

        //显示版本号
        this.getWidget("Label_version").setString(SyVersion.v);

        //GPS
        this.btn_Gps = this.getWidget("btn_Gps");
        if(SyConfig.HAS_GPS && DTZRoomModel.renshu > 2){
            this.btn_Gps.visible = true;
        }else{
            this.btn_Gps.visible = false;
        }
        if(GPSModel.getGpsData(PlayerModel.userId) == null){
            this.btn_Gps.setBright(false);
            this.btn_Gps.setTouchEnabled(false);
        }else{
            this.btn_Gps.setBright(true);
            this.btn_Gps.setTouchEnabled(true);
        }
        //if(DTZRoomModel.isMoneyRoom() && this.btn_Gps){
        //    this.btn_Gps.visible = false;//放开GPS按钮
        //}
        UITools.addClickEvent(this.btn_Gps ,this,this.onGpsPop);
        this.btn_cardNote = this.getWidget("btn_cardNote");
        this.btn_cardNote.visible = (DTZRoomModel.is4Ren() && DTZRoomModel.isShowCardNumber());
        UITools.addClickEvent(this.btn_cardNote ,this,this.onCardNote);


        this.Image_bg = this.getWidget("Image_bg");//背景图
        if(this.Image_bg){
            this.Image_bg.visible = true;
        }
        //初始化牌桌字体颜色
        this.initLabelColor();
        this.dealMoneyView();
        this.playOrRemoveWaitingAnm();
        //SyEventManager.dispatchEvent(SyEvent.REMOVE_MONEY_LOADING,{});//发送消息关闭假的假的匹配界面

        if (SdkUtil.isIphoneX()) {
            this.getWidget("cardBg").x += 20;
            this._cardPanel.y += 30;
            this.getWidget("ButtonGiveup").y += 20;
            this.getWidget("Button_4").y += 20;
            this.getWidget("Button_6").y += 20;
            this.getWidget("Button_42").y += 20;
            this.getWidget("Button_40").y += 20;
            this.recordBtn.y += 20;
            this.getWidget("ybq1").y += 20;
            this.btn_Gps.x += 20;
        }
    },


    updateRank:function(event){
        //1：当前轮数 2：自己的排名 3：剩下的人数
        var message = event.getUserData();
        var curRank = message[2];
        var totalRenshu = message[3];
        cc.log("现在排名=="+curRank+"总人数=="+totalRenshu);
        this.rankLabel.setString("名次："+curRank+"/"+totalRenshu);
        //重新刷新记录自己的排名和总人数
        var players = DTZRoomModel.players;
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(p.userId == PlayerModel.userId){
                p.ext[14]=curRank;
                p.ext[14]=totalRenshu;
            }
        }

    },

    showMatchTip:function(event){
        this.matchWaitTime = 0;
        this.Label_matchTipTime.setString("");
        this.Panel_matchTip.visible = true;
    },

    //晋级提示
    matchUpTip:function(event){
        FloatLabelUtil.comText("恭喜您晋级复赛！");
    },

    /**
     * 处理金币场模式
     */
    dealMoneyView:function(){
        var isMatchRoom = DTZRoomModel.isMatchRoom();
        if(isMatchRoom){
            cc.log("当前是金币场房间！！！！");
            this.btnStopMoneyRoom = this.getWidget("btnStopMoneyRoom");
            this.Button_30.visible = false;

            if(this.aTeamScoreLable && this.bTeamScoreLable && this.cTeamScoreLable){
                this.aTeamScoreLable.visible = this.bTeamScoreLable.visible = this.cTeamScoreLable.visible = false;
            }

            //我也是醉了 又改回来
            var tgTime = DTZRoomModel.getTuoguanTime();
            this.countDownLabel = new cc.LabelAtlas(tgTime + "", "res/font/yxjsqnumber.png", 40, 52, '0');
            this.countDownLabel.scale = 0.85;
            this.countDownLabel.anchorX = 0.5;
            this.countDownLabel.visible = false;
            this.addChild(this.countDownLabel);

            if(this.btnStopMoneyRoom){
                UITools.addClickEvent(this.btnStopMoneyRoom , this , this.onLeave);
            }
        }else{

        }

    },

    /**
     * 增加等待好友动画
     */
    playOrRemoveWaitingAnm:function(){
        if(!DTZRoomModel.isMatchRoom()){
            return
        }
        //双明要影藏一万个东西 决定放到列表里
        var showOrHideNode = [];
        showOrHideNode.push(this.getWidget("allScoreImg"));
        showOrHideNode.push(this.getWidget("curScoreImg"));
        showOrHideNode.push(this.getWidget("Image_matchinfo"));
        showOrHideNode.push(this.getWidget("dark8Node"));
        showOrHideNode.push(this.getWidget("Button_42"));
        showOrHideNode.push(this.getWidget("Button_40"));
        showOrHideNode.push(this.getWidget("Button_sset"));
        showOrHideNode.push(this.getWidget("Label_39"));
        showOrHideNode.push(this.recordBtn);
        showOrHideNode.push(this.jsScoreLabel);
        showOrHideNode.push(this.btn_match);

        var alwaysHideNode = [];
        alwaysHideNode.push(this.getWidget("Button_17"));
        alwaysHideNode.push(this.getWidget("Image_infoBg"));

        for(var index = 0; index < alwaysHideNode.length ; index++){
            if(alwaysHideNode[index]){
                alwaysHideNode[index].visible = false;
            }
        }

        //人数不够 未开始的情况下
        if(DTZRoomModel.players.length < DTZRoomModel.renshu){
            if(DTZRoomModel.isMatchRoom()) {
                this.matchWaitTime = 0;
                this.Label_matchTipTime.setString("");
                this.Panel_matchTip.visible = true;
            }

            for(var index = 0 ; index < showOrHideNode.length; index++){
                if(showOrHideNode[index]){
                    showOrHideNode[index].visible = false;
                }
            }
        }else{//移除已有的动画
            //if(this.waitAnimation){
            //    this.waitAnimation.removeFromParent();
            //    this.waitAnimation = null;
            //}
            this.Panel_matchTip.visible = false;
            SyEventManager.dispatchEvent(SyEvent.MATCH_REMOVE_WAIT);
            for(var index = 0 ; index < showOrHideNode.length; index++){
                if(showOrHideNode[index]){
                    showOrHideNode[index].visible = true;
                }
            }
            if(this.btnStopMoneyRoom){
                this.btnStopMoneyRoom.visible = false;
            }
        }
    },

    onCardNote: function() {
        //sySocket.sendComReqMsg(129);
        ComReq.comReqJiPaiQi();
    },

    initData: function () {
        cc.log("DTZRoom initData...");
        //移除上一把的结算页面(托管开始下一局的时候)
        //PopupManager.removeClassByPopup(DTZSmallResultPop);
        PlayDTZMessageSeq.clean();
        if(this.showResultTimeOutHandle){
            clearTimeout(this.showResultTimeOutHandle);
            this.showResultTimeOutHandle = null;
        }

        if(this.bg_CancelTuoguan){
            this.bg_CancelTuoguan.visible = false;
        }

        if(this.countDownLabel){//coolProgress
            this.countDownLabel.visible = false
        }

        this.playOrRemoveWaitingAnm();

        this.firstLineLimit = DTZRoomModel.firstLineLimit;
        this.initCardYLine1 = DTZRoomModel.initCardYLine1;
        this.initCardYLine2 = DTZRoomModel.initCardYLine2;
        this.initX = DTZRoomModel.initX;
        this._cardScale = DTZRoomModel._cardScale;
        this._letOutCardScale = DTZRoomModel._letOutCardScale;

        this._curChoiceCards = null;
        this._curChoiceCardsTypeData = null;
        this._curTipCard =  null;
        this._lastCardTypeData = null;
        var players = DTZRoomModel.players;
        cc.log("players..length======",players.length)
        if (DTZRoomModel.is4Ren()) {
            this.getWidget("LableChoiceTeam").visible = false;
        } else {
            var groupMaping = {1:"A",2:"B",3:"C"};
            for (var i=0;i<players.length;i++) {
                var group = DTZRoomModel.getPlayerGroup(players[i]);
                var name = players[i].name;
                name = CustomTextUtil.subTextWithFixWidth(name, 80, 20);
                this["lableName"+groupMaping[group]].setString(name);
                this.visibleOpScore(groupMaping[group], true);
            }
            for(;i<3;i++) {
                this.visibleOpScore(groupMaping[(i+1)], false);
            }
        }
        this.seatSeq = DTZRoomModel.seatSeq;
        sy.scene.hideLoading();
        this.Image_40.visible = false;
        this.lableRoomRound.setString(DTZRoomModel.nowBurCount);
        this._players = {};
        //分数相关
        this.roomFiveNum = DTZRoomModel.fiveNum;
        this.roomTenNum = DTZRoomModel.tenNum;
        this.roomKNum = DTZRoomModel.kNum;
        this.roomCurScore = DTZRoomModel.curScore;  //当前牌面分数
        this.aTeamAllScore = DTZRoomModel.aTeamScore;
        this.bTeamAllScore = DTZRoomModel.bTeamScore;
        this.cTeamAllScore = DTZRoomModel.cTeamScore;
        this.aTeamTongziScore = DTZRoomModel.aTeamTongziScore;
        this.bTeamTongziScore = DTZRoomModel.bTeamTongziScore;
        this.cTeamTongziScore = DTZRoomModel.cTeamTongziScore;
        this.curaTeamScore = DTZRoomModel.aTeamCurScore;
        this.curbTeamScore = DTZRoomModel.bTeamCurScore;
        this.curcTeamScore = DTZRoomModel.cTeamCurScore;

        this.aTeamCurScoreLable.setString(this.curaTeamScore);
        this.bTeamCurScoreLable.setString(this.curbTeamScore);
        if (this.cTeamCurScoreLable) {
            this.cTeamCurScoreLable.setString(this.curcTeamScore);
        }
        this.aTeamScoreLable.setString(this.aTeamAllScore);
        this.bTeamScoreLable.setString(this.bTeamAllScore);
        if (this.cTeamScoreLable) {
            this.cTeamScoreLable.setString(this.cTeamAllScore);
        }
        this.curScoreLable.setString(this.roomCurScore+"分");
        this.roomFiveNumLable.setString(this.roomFiveNum);
        this.roomTenNumLable.setString(this.roomTenNum);
        this.roomKNumLable.setString(this.roomKNum);
        DTZExfunc.updateRoomCount(this);

        for (var i = 1; i <= this._renshu; i++) {
            this.getWidget("player" + i).visible = false;
            this.getWidget("ybq" + i).visible = false;
            this.getWidget("zhunbei" + i).visible = false;
            this.getWidget("small" + i).removeAllChildren(true);
        }
        if (this._cards.length > 0) {//清理掉上一局的牌
            for (var i = 0; i < this._cards.length; i++) {
                this._cardPanel.removeChild(this._cards[i]);
            }
            this._cards.length = 0;
        }
        this._lastCardPattern = null;
        //this.Button_6.visible = this.Button_4.visible = false;
        this.visibleOpButton(false);
        if(!DTZRoomModel.isMatchRoom()){
            this.Button_30.visible = (DTZRoomModel.mySeat != 0);
        }
        if(this.countDownLabel){
            this._countDown = DTZRoomModel.getTuoguanRealTime();
        }
        var isContinue = false;//是否是恢复牌局
        var hasGrouped = DTZRoomModel.is4Ren() ? DTZExfunc.checkGroupOver() : true;
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            isContinue = (p.handCardIds.length > 0 || p.outCardIds.length > 0 || p.mingci > 0);//p.mingci 该玩家可能确实没有手牌了
            if (isContinue)
                break;
        }

        //判断当前玩家数量
        //this.RoomIdRoot.visible = (players.length < 4);
        if (DTZRoomModel.is4Ren()) {
            this.initPlayerSeat();//显示四个空的玩家座位
        }
        for (var i = 0; i < players.length; i++) {
            var isYbq = false;
            var p = players[i];
            var seq = 0;//this.getPlayerSeq(p.userId, DTZRoomModel.mySeat, p.seat);
            var cardPlayer = null; //= this._players[p.seat] = new CardPlayer(p, this.root, seq , p.group);
            //分组结束后 显示所有玩家 并且 我自身在一号位置
            if(hasGrouped){
                if (DTZRoomModel.is4Ren()) {
                    this.getWidget("LableChoiceTeam").visible = false;
                }
                seq = this.getPlayerSeq(p.userId, DTZRoomModel.mySeat, p.seat);
                cardPlayer = this._players[p.seat] = new CardPlayer(p, this.root, seq , p.group);
            }else{//分组结束前 只显示已经选座的玩家 并且 房主在一号位置
                if(p.seat != 0){
                    seq = p.seat;
                    cardPlayer = this._players[p.seat] = new CardPlayer(p, this.root, seq , p.group);
                    //if(p.status == 1){
                        //已经准备了
                        this.Button_30.visible = false;
                    //}
                }

                if (p.userId == PlayerModel.userId && DTZRoomModel.is4Ren()) {
                    this.getWidget("LableChoiceTeam").visible = (p.seat == 0)
                }
            }

            if (!isContinue) {
                if (p.status)
                    cardPlayer.showStatus(p.status);
            } else {//恢复牌局
                if (p.outCardIds.length > 0) {//模拟最后一个人出牌
                    if (p.userId == PlayerModel.userId && DTZRoomModel.nextSeat == p.seat) {
                        this._lastCardPattern = null;
                        this._lastCardTypeData = null;
                    } else {
                        var cardTransData = [];
                        for (var j = 0; j < p.outCardIds.length; j++) {
                            cardTransData.push(DTZAI.getCardDef(p.outCardIds[j]));
                        }
                        this._lastCardPattern = DTZAI.filterCards(cardTransData);
                        this._lastCardTypeData = DTZAI.getCardsType(cardTransData , this._lastCardTypeData);
                        this.specialDealForLastCards(p.ext[5]);
                    }
                    this._lastLetOutSeat = p.seat;
                    p.ext[1] += p.outCardIds.length;
                    this.letOutCards(p.outCardIds, p.seat , DTZRoomModel.nextSeat , isContinue);
                } else {
                    if (p.recover.length > 0) {//恢复牌局的状态重设
                        if (p.recover[0] == 0) {
                            if (p.userId == PlayerModel.userId && DTZRoomModel.nextSeat == p.seat) {//要不起，轮到我出牌，需要通知后台
                                if (DTZRoomModel.is3Ren()) {
                                    //sySocket.sendComReqMsg(124 , []);
                                    ComReq.comReqGiveUpOutCard();
                                }
                            }else{
                                cardPlayer.showStatus(-1);
                            }
                        }
                        //if (p.recover[1] == 1){
                        //    cardPlayer.baoting();
                        //}
                        cardPlayer.leaveOrOnLine(p.recover[2]);
                    }
                }
                cardPlayer.showLastCard();
            }

            if (p.userId == PlayerModel.userId) {//自己的状态处理
                if (p.handCardIds.length > 0) {
                    var isFirstOut = DTZRoomModel.getPlayerIsFirstOut(p);
                    this.visibleOpButton(( DTZRoomModel.nextSeat == DTZRoomModel.mySeat) , !isFirstOut);
                    this._players[DTZRoomModel.mySeat].deal(p.handCardIds);
                    this.initCards(p.handCardIds,true);
                } else {//恢复牌局的时候 我自身已经没有牌了 要发出牌消息告诉后台 来跳过自己
                    if(isContinue){
                        this.visibleOpButton(false);
                        if(DTZRoomModel.nextSeat == DTZRoomModel.mySeat){
                            this.sendPlayCardMsg(0,[]);
                        }
                    }
                }

                if (p.status){
                    this.Button_30.visible = false;
                }

                //判断是否需要显示 取消托管按钮
                cc.log("判断是否要显示取消托管按钮... " , DTZRoomModel.isOpenTuoguan());
                if(DTZRoomModel.isOpenTuoguan() && this.bg_CancelTuoguan){
                    var isMeTuoguan = DTZRoomModel.getPlayerIsTuoguan(p);
                    cc.log("断线重连判断是否是托管状态..."  , isMeTuoguan);
                    this.bg_CancelTuoguan.visible = isMeTuoguan;
                }

                //显示预赛还是复赛
                this.lbCoin_0.setString(DTZRoomModel.getMatchInfos(p));
                if(DTZRoomModel.getPlayerIsTuoguan(p)){
                    //比赛场注释报错
                    this._players[p.seat].updateTuoguan(true);
                    this.bg_CancelTuoguan.visible = true;
                }
                this.rankLabel.setString("名次："+p.ext[14]+"/"+p.ext[15]);
            }
        }
        if (DTZRoomModel.is4Ren()) {
            if (!hasGrouped){
                //判断哪几个选座按钮该显示
                for(var index = 1 ; index <= 4 ; index ++){
                    if(this._players[index] == null && DTZRoomModel.mySeat != 1){
                        this["choiceSeatBtn"+ index].visible = true;
                    }else{
                        this["choiceSeatBtn"+ index].visible = false;
                    }
                }
            }else{
                for(var index = 1 ; index <= 4 ; index ++){
                    this["choiceSeatBtn"+ index].visible = false;
                }
            }
        }
        //IP相同的显示//比赛场报错记录一下
        if(players.length>1){
            var seats = DTZRoomModel.isIpSame();
            if(seats.length>0){
                for(var i=0;i<seats.length;i++) {
                    this._players[seats[i]].isIpSame(true);
                }
            }
        }
        if (isContinue) {
            this.showJianTou(DTZRoomModel.nextSeat);
            //this.Button_20.visible = false;
            if (DTZRoomModel.isNextSeatBt()) {
                //this.Image_baodan.visible = true;
            }
            //this.Image_qiepai.visible = (DTZRoomModel.renshu == 2);
        }
        this.uidText.setString("UID：" + PlayerModel.userId);
        //if(!DTZRoomModel.isMatchRoom()){
        //    this.Button_17.visible = (players.length < DTZRoomModel.renshu);
        //}

        this.beilvLabel.setString("");

        if (DTZRoomModel.getMoneyRoomBeilv()){
            this.beilvLabel.setString("倍率："+DTZRoomModel.getMoneyRoomBeilv());
        }
        if (DTZRoomModel.is3Ren() || (DTZRoomModel.is2Ren() && DTZRoomModel.isBida())) {
                this.Button_4.x = 512;
                this.Button_6.x = 772;
            this.Button_giveUp.visible = false;
        }
    },

    //这种情况是前端无法独立解析 飞机牌的连续次数 要依赖后台的数据修正
    specialDealForLastCards:function(realSerialNum){
        if( this._lastCardTypeData
            && (this._lastCardTypeData.type == DTZAI.PLANE || this._lastCardTypeData.type == DTZAI.PLANEWithCard)
            && this._lastCardTypeData.serialNum != realSerialNum ){

            var oldSerialNum = this._lastCardTypeData.serialNum;
            this._lastCardTypeData.serialNum  = realSerialNum;
            this._lastCardTypeData.value = this._lastCardTypeData.value + (oldSerialNum - realSerialNum);
        }
    },

    /**
     * 不出牌
     */
    onGiveUp: function (){
        //sySocket.sendComReqMsg(124 , []);
        ComReq.comReqGiveUpOutCard();
        this.visibleOpButton(false);
    },

    /**
     * 不出牌的回调
     */
    resGiveUp:function(){
        this.visibleOpButton(false);
        this.onCancelSelect();
    },

    onCancelSelect: function () {
        var isHas = false;
        this._curChoiceCards = null;
        for (var i = 0; i < this._cards.length; i++) {
            if (this._cards[i].isEnable()) {
                isHas = true;
                break;
            }
        }
        if (!isHas) {
            this.unSelectAllCards();
            this._allCards.length = 0;
            this.isCanLetOut();
        }
    },

    onOver: function (event) {
        var data = event.getUserData();
        if(PlayDTZMessageSeq.sequenceArray.length>0){
            PlayDTZMessageSeq.cacheClosingMsg(data);
            return;
        }

        /**
         * 影藏
         */
        if(this.countDownLabel){//coolProgress
            this.countDownLabel.visible = false;
        }

        this.visibleOpButton(false);
        this.Image_40.visible  = false;
        var self = this;

        //清空玩家名次 和 光圈效果
        for (var i = 1; i <= self._renshu; i++) {
            if (this._players[i] != null) {
                this._players[i].hideNumber();
                this._players[i].playerQuanAnimation(false);
            }
        }

        this.showResultTimeOutHandle = setTimeout(function () {//延迟弹出结算框
            for (var i = 1; i <= self._renshu; i++) {
                self.getWidget("ybq" + i).visible = false;
                self.getWidget("zhunbei" + i).visible = false;
            }

            for(var i=0;i<data.length;i++){
                if (PlayerModel.userId == data[i].userId){
                    self._players[data[i].seat].updatePoint(data[i].ext[18] || 0);
                }
            }

            var mc = new MatchDtzResultPop(data);
            PopupManager.addPopup(mc);
        }, 600);
    },

    /**
     * 收到出牌消息，前台开始处理
     * @param event
     */
    onLetOutCard: function (event) {
        this.changeLetOutButton(false);
        this.Panel_matchTip.visible = false;
        //增加保险措施
        SyEventManager.dispatchEvent(SyEvent.MATCH_REMOVE_WAIT);
        this._countDown = DTZRoomModel.getTuoguanTime();

        //某种莫名的情况下 玩家的准备字样又显示出来了 增加一个保护
        for (var i = 1; i <= this._renshu; i++) {
            //this.getWidget("ybq" + i).visible = false;
            this.getWidget("zhunbei" + i).visible = false;
        }
        var self = this;
        var buyao = false;
        var message = event.getUserData();
        var seat = message.seat;
        var isFirstOut = message.isFirstOut;
        if (seat == DTZRoomModel.mySeat) {//我自己出牌了，清理掉选择的牌
            //如果当前手牌还在执行动画 则停止动画并且修正位置 和显示状态
            if(DTZRoomModel.isOpenTuoguan()){
                for(var index = 0 ; index < this._cards.length ; index++){
                    var tCardNode = this._cards[index];
                    if(tCardNode && tCardNode.isAction == true){
                        tCardNode.stopAction(tCardNode.curAction);
                        //方式一
                        //var fixObjAction = cc.orbitCamera(0, 1, 0, 90, -90, 0, 0);
                        //tCardNode.runAction(fixObjAction);
                        //方式二
                        cc.log("还原动作的影响值........................");
                        var camera = new cc.ActionCamera();
                        camera.startWithTarget(tCardNode);
                        camera.setEye(tCardNode.tEye.x,tCardNode.tEye.y,tCardNode.tEye.z);
                        tCardNode.isAction = false;
                        tCardNode.x = tCardNode.realX;
                        tCardNode.y = tCardNode.realY;
                        tCardNode.varNode.visible = true;
                        tCardNode.backNode.visible = false;
                    }
                }
            }


            this._allCards.length = 0;
            this._curTipCard = null; //清理掉上次提示的牌
            this.enableAllCards();
        }
        //记录当前牌面分数和 5 10 K的个数
        DTZExfunc.countCurScoreAndNumber(this , message.cardIds);
        //下个出牌的位置
        var nextSeat = message.nextSeat;
        if (message.cardIds.length == 0) {//不要
            buyao = true;
            this._players[seat].showStatus(-1);
        } else {
            //已经出牌了
            this._players[seat].hideLeaveSp();
            var ids = message.cardIds;
            var cardTransData = [];
            for (var i = 0; i < ids.length; i++) {
                cardTransData.push(DTZAI.getCardDef(ids[i]));
            }
            if(message.isPlay != 2 && cardTransData.length > 0){
                this._lastCardPattern = DTZAI.filterCards(cardTransData);
                this._lastCardTypeData = DTZAI.getCardsType(cardTransData , this._lastCardTypeData);
            }
            this._lastLetOutSeat = seat;
        }

        if (nextSeat == DTZRoomModel.mySeat) {//轮到我出牌了
            if (this._lastLetOutSeat == DTZRoomModel.mySeat){//转了一圈 没人要的起
                this._lastCardPattern = null;
                this._lastCardTypeData = null;
            }
            if(isFirstOut){
                this.visibleOpButton(true , false);
            }else{
                this.visibleOpButton(true);
            }
            this.showJianTou(nextSeat);
            this.isCanLetOut();

            if(self._cards.length == 0){ //我已经打完了所有牌
                this.sendPlayCardMsg(0 , []);
                this.visibleOpButton(false);
            }
            //三人打筒子要不起由后台触发，前端回复确认消息就行
            if (DTZRoomModel.is3Ren() && message.isLet===0) {
                this.visibleOpButton(false);
            }
        } else {
            this.showJianTou(nextSeat);
            this.visibleOpButton(false);
        }

        if (!buyao) {
            DTZRoomSound.letOutSound(message.userId , this._lastCardTypeData);
        } else {
            DTZRoomSound.yaobuqi(message.userId);
        }

        this.letOutCards(message.cardIds, message.seat ,message.nextSeat);
        if(message.curScore != null){
            if (DTZRoomModel.is3Ren() && buyao) {
                //noting to do
            } else {
                this.curScoreLable.setString(message.curScore+"分");
            }
        }
        PlayDTZMessageSeq.finishPlay();
    },

    update:function(dt){
        this._dt += dt;
        PlayDTZMessageSeq.updateDT(dt);
        var actionTime = 0.2;

        if(this._dt>=1){
            this._dt = 0;
            if(this._countDown >= 0 && this.countDownLabel){
                var countDown = ""+this._countDown;
                var self = this;
                if(this._countDown < DTZRoomModel.getTuoguanTime()){
                    this.countDownLabel.runAction(
                        cc.sequence(
                            cc.scaleTo(actionTime * 0.5 , 0.85 , 0.85) ,
                            cc.scaleTo(actionTime * 0.5 , 0.8 , 0.8),
                            cc.callFunc(function(){
                                self.showTouguanTime(countDown);
                                self._countDown--;
                            })));
                }else{
                    this.showTouguanTime(countDown);
                    this._countDown--;
                }

                if(this._countDown <= 3 && self.countDownLabel.visible == true ){//&& (PHZRoomModel.timeSeat == PHZRoomModel.mySeat)
                    DTZRoomSound.timeSound()
                }

            }
            if (this.Panel_matchTip.isVisible()){
                this.matchWaitTime = this.matchWaitTime + 1;
                this.Label_matchTipTime.setString(this.matchWaitTime+"s")
            }
            this._timedt+=1;
            if(this._timedt%60==0)
                this.calcTime();
            if(this._timedt>=180){
                this._timedt = 0;
                this.calcWifi();
            }
        }
    },

    showTouguanTime:function(_time){
        var countDown = (_time<10) ? "0"+_time : ""+_time;
        this.countDownLabel.setString(countDown);
    },

    /**
     * 发送出牌消息
     * @param type
     * @param allCards
     */
    sendPlayCardMsg: function (type, allCards) {
        var build = MsgHandler.getBuilder("proto/PlayCardReqMsg.txt");
        var msgType = build.msgType;
        var builder = build.builder;
        var PlayCardReq = builder.build("PlayCardReq");
        var cardIds = [];
        for (var i = 0; i < allCards.length; i++) {
            cardIds.push(allCards[i].c);
        }
        var msg = new PlayCardReq();
        msg.cardIds = cardIds;
        msg.cardType = type;
        sySocket.send(msg, msgType);
    },

    /**
     * 出牌动作
     */
    onPlayCard: function (obj, tongziBreak , boomBreak , superboomBreak , xiBreak) {
        var self = this;
        tongziBreak = tongziBreak || false;
        boomBreak = boomBreak || false;
        superboomBreak = superboomBreak || false;
        xiBreak = xiBreak || false;

        //如果过了任意检测就直接出牌 玩家已经点击确认 不在考虑其他拆开的情况
        if(tongziBreak || boomBreak || superboomBreak || xiBreak){
            //cc.log("检测当前要打的牌的类型..." , JSON.stringify(curCardsTypeData));
            var curCardsTypeData = DTZAI.getCardsType(this._curChoiceCards , this._lastCardTypeData);
            this.sendPlayCardMsg(curCardsTypeData.type , this._curChoiceCards);
            return ;
        }

        if (this._curChoiceCardsTypeData) {//this._cCardPattern

            if(!superboomBreak && DTZExfunc.isSuperBoomBreak(this)){
                AlertPop.show("地炸被拆散!确定出牌吗？", function () {
                    self.onPlayCard(obj, false , false , true , false);
                });
                return;
            }

            if(DTZRoomModel.is4FuPai() && !xiBreak && DTZExfunc.isXiBreak(this)){
                AlertPop.show("喜被拆散!确定出牌吗？", function () {
                    self.onPlayCard(obj, false , false , false , true);
                });
                return;
            }

            if (!tongziBreak && DTZExfunc.isTongziBreak(this)) {
                AlertPop.show("筒子被拆散，确定出牌吗？", function () {
                    self.onPlayCard(obj, true , false , false , false);
                });
                return;
            }

            if(!boomBreak && DTZExfunc.isBombBreak(this)){
                AlertPop.show("炸弹被拆散，确定出牌吗？", function () {
                    self.onPlayCard(obj, false , true , false , false , false);
                });
                return;
            }

        } else {//有可能提前选择了牌，再次筛选一次
            //cc.log("还有这种逻辑？...有可能提前选择了牌，再次筛选一次");
            if (this._allCards.length > 0) {
                var curCardTypeDate =  DTZAI.getCardsType(this._curChoiceCards , this._lastCardTypeData);
                if (curCardTypeDate) {
                    if (!tongziBreak && DTZExfunc.isTongziBreak(this)) {
                        AlertPop.show("筒子被拆散，确定出牌吗？", function () {
                            self.onPlayCard(obj, true);
                        });
                        return;
                    }
                }
            }
        }

        var curCardsTypeData = DTZAI.getCardsType(this._curChoiceCards , this._lastCardTypeData);
        //cc.log("检测当前要打的牌的类型..." , JSON.stringify(curCardsTypeData));
        this.sendPlayCardMsg(curCardsTypeData.type , this._curChoiceCards);
    },

    onPlayTip: function () {
        //获取当前要比较的牌面
        //cc.log("点击提示..." , this._curTipCard , this._lastCardTypeData);
        var result = [];
        if(this._curTipCard != null && this._curTipCard.length > 0){ //递归进行提示 在已经提示了一组牌的情况下 去找下一组提示牌
            result = DTZAI.autoGetCards(this._curTipCard , this._cards , null);
        }else if(this._lastCardTypeData != null){ //按照当前记录的上家牌型来提示第一手牌
            result = DTZAI.autoGetCards(null , this._cards , this._lastCardTypeData);
        }else if(this._lastCardTypeData == null){
            //cc.log("无限制提示,本轮是我出首牌");
            result = DTZAI.autoGetUnlimitCards(this._cards);
        }

        //先把现在选中的牌取消
        var allCards = [];
        this.unSelectAllCards();
        this._curTipCard = result;
        this._curChoiceCards = result;
        this._allCards = result;
        //cc.log("tip result.length!!!", result.length);

        for (var i = 0; i < result.length; i++) {
            var card = result[i];
            card.selectAction();
        }

        this._cCardPattern = DTZAI.filterCards(this._curChoiceCards,DTZExfunc.getCardsOnHand(this),this._lastCardPattern);
        this._curChoiceCardsTypeData = DTZAI.getCardsType(this._curChoiceCards , this._lastCardTypeData);
        DTZRoomModel.prompt(this._cCardPattern , result);
        this.isCanLetOut();

        if(result.length === 0 && this._lastCardTypeData != null){
            //检测是否是要不起
            var firstResult = [];
            firstResult = DTZAI.autoGetCards(null , this._cards , this._lastCardTypeData);
            if(firstResult.length === 0){
                //确实要不起啊
                //cc.log("检测结果 要不起");
                FloatLabelUtil.comText("没有大过上家的牌");
                //this.onGiveUp()
            }
        }

    },

    /**
     * 邀请
     */
    onInvite: function () {
        //cc.log("房间信息:" , DTZRoomModel.wanfa  , DTZRoomModel.costFangFei , DTZRoomModel.endScore , DTZRoomModel.exScore);
        var fangfeiDesc = "";
        var wanfaDesc = "";
        var endScoreDesc = "";
        var exScoreDesc = "";
        var isDark8Desc = "";
        var isShowDesc = "";
        var sjctDesc = "";
        var ypbdDesc = "";
        var wtzDesc = "";
        var tuoguanDesc = "";


        //fangfeiDesc = DTZRoomModel.costFangFei <= 20 ? "AA支付":"房主支付";
        //if (DTZRoomModel.is2Ren()) {
        //    fangfeiDesc = DTZRoomModel.costFangFei <= 30 ? "AA支付":"房主支付";
        //}
        fangfeiDesc = "房主支付";
        if (DTZRoomModel.getCostFangShi() == 1){
            fangfeiDesc = "AA支付";
        }else if (DTZRoomModel.getCostFangShi() == 3) {
            fangfeiDesc = "群主支付";
        }
        wanfaDesc = "4人";
        if (DTZRoomModel.is3Ren()) {
            wanfaDesc = "3人";
        } else if (DTZRoomModel.is2Ren()) {
            wanfaDesc = "2人";
        }
        wanfaDesc += DTZRoomModel.is3FuPai() ? "3副牌":"4副牌";
        endScoreDesc = DTZRoomModel.endScore + "分";
        if(DTZRoomModel.exScore != 0){
            exScoreDesc = ",终局奖励" + DTZRoomModel.exScore + "分";
        }else{
            exScoreDesc = ",无奖励";
        }
        if (DTZRoomModel.is4Ren()) {
            if(DTZRoomModel.isDark8){
                isDark8Desc = ",暗8张牌";
            }
        }
        if(DTZRoomModel.isShowCardNumber()){
            isShowDesc = ",显示剩余牌数";
        }

        if(DTZRoomModel.isBida()){
            ypbdDesc = ",有牌必打";
        }

        if(DTZRoomModel.isWTZ()){
            wtzDesc = ",王筒子";
        }


        if(DTZRoomModel.isSjct()){
            sjctDesc = ",随机出头";
        }

        if(DTZRoomModel.isOpenTuoguan()){
            tuoguanDesc = ",托管";
        }

        //cc.log("房间信息组成的描述..." , fangfeiDesc , wanfaDesc , endScoreDesc , exScoreDesc , isDark8Desc);
        var clubStr = "";
        if (DTZRoomModel.isClubRoom(DTZRoomModel.tableType)){
            clubStr = "[亲友圈]";
        }
        var playerNum = " "+ DTZRoomModel.renshu + "缺" + (DTZRoomModel.renshu - DTZRoomModel.players.length);
        var obj = {};
        obj.tableId = DTZRoomModel.tableId;
        obj.userName = PlayerModel.username;
        obj.callURL = SdkUtil.SHARE_URL + '?num=' + DTZRoomModel.tableId + '&userId=' + encodeURIComponent(PlayerModel.userId);
        obj.title = '快乐打筒子  房号:' + DTZRoomModel.tableId + playerNum;

        obj.description = clubStr + wanfaDesc + "," + fangfeiDesc + "," + endScoreDesc  +
            isDark8Desc + isShowDesc + exScoreDesc + sjctDesc +
            ypbdDesc + wtzDesc + tuoguanDesc + "。速速加入游戏！";
        //三副牌 AA支付 600分 终局奖励100分 加入快乐打筒子,万元大奖等你拿！
        //csvhelper.strFormat("{0}人,{1}张,{2}局{3}{4}。点我>自动进房间！", DTZRoomModel.renshu, DTZRoomModel.wanfa, DTZRoomModel.totalBurCount, cardNum, heiStr);

        obj.shareType = 1;
        SdkUtil.sdkFeed(obj);
    },

    /**
     * 传说中的互动表情
     */
    runPropAction:function(event){
        //seat 接收者的座位号  userId表示发送者的userId  content表示道具的索引值
        var data = event.getUserData();
        var userId = data.userId;
        var seat = data.seat;
        var content = data.content;
        var p = DTZRoomModel.getPlayerVo(userId);
        var fromPlayer = this._players[p.seat];
        var targetPlayer = this._players[seat];
        if(fromPlayer._playerVo.userId != targetPlayer._playerVo.userId) {
            var url = "res/ui/dtz/chat/prop" + content + ".png";
            var prop = new cc.Sprite(url);
            var initX = fromPlayer.getContainer().x;
            var initY = fromPlayer.getContainer().y;
            var x = initX - 20;
            var y = initY - 50;

            prop.setPosition(x, y);
            this.root.addChild(prop,2000);
            initX = targetPlayer.getContainer().x;
            initY = targetPlayer.getContainer().y;
            var targetX = initX - 20;
            var targetY = initY - 50;

            var action = cc.sequence(cc.moveTo(0.3, targetX, targetY), cc.callFunc(function () {
                targetPlayer.playPropArmature(content);
                prop.removeFromParent(true);
            }));
            prop.runAction(action);
        }else{
            targetPlayer.playPropArmature(content);
        }
    },

    /**
     * 有人加入房间
     * @param event
     */
    onJoin: function (event) {
        var p = event.getUserData();
        //cc.log("有玩家加入房间...玩家作为为:" + JSON.toString(p));
        var seq = 0;
        if(p.seat != 0){
            seq = this.getPlayerSeq(p.userId, DTZRoomModel.mySeat, p.seat);
            this._players[p.seat] = new CardPlayer(p, this.root, seq , p.group);
            if(DTZRoomModel.isMatchRoom()){
                if(p.userId == PlayerModel.userId){
                    DTZRoomModel.mySeat = p.seat;
                }
            }
        }
        if (!DTZRoomModel.is4Ren()) {
            var groupMaping = {1:"A",2:"B",3:"C"};
            var group = DTZRoomModel.getPlayerGroup(p);
            cc.log("player group ..." , group);
            var groupString = groupMaping[group];
            var name = CustomTextUtil.subTextWithFixWidth(p.name, 80, 20);
            this["lableName"+groupString].setString(name);
            this.visibleOpScore(groupString, true);
        }
        this.Button_17.visible = false;
        var seats = DTZRoomModel.isIpSame();
        if(seats.length>0){
            for(var i=0;i<seats.length;i++) {
                this._players[seats[i]].isIpSame(true);
            }
        }

        //显示房间信息
        for(var i=0;i<DTZRoomModel.players.length;i++){
            var player = DTZRoomModel.players[i];
            if(player.userId == PlayerModel.userId){
                this.lbCoin_0.setString(DTZRoomModel.getMatchInfos(player));
            }
            this._players[player.seat].updatePoint(player.ext[8] || 0);
        }

        //this.playOrRemoveWaitingAnm();
        //如果人数已经足够 判断是否缓存了开始消息
        if(DTZRoomModel.isMatchRoom() && ObjectUtil.size(this._players) >= DTZRoomModel.renshu){
            var beginMsg = PlayDTZMessageSeq.getBeginMsg();
            if(beginMsg){
                cc.log("玩家数量显示完毕 执行缓存的开始游戏消息");
                this.startGame(beginMsg);
            }
        }
    },

    /**
     * 玩家选择作为 通知后台
     */
    onChoiceSeat: function(sender){
        var tag = sender.getTag();
        //sySocket.sendComReqMsg(120 , [tag]);//
        ComReq.comReqChoiceSeat(tag);
        //cc.log("选择的座位tag值为：" , tag);
    },

    /**
     * 后台推送告知 开始选择分组
     *
     *
     */
    onChoiceTeam: function (data){
        //this.RoomIdRoot.visible = false;
        this.choiceTeamCardList = [];
        //cc.log("onChoiceTeam data::" , JSON.stringify(data) );
    },

    /**
     *
     * 有玩家选择了分组卡牌
     * 有玩家ID 可以考虑后期加入显示效果
     */
    onPlayerChoiceTeamCard:function (event){
        var choiceCardIndex = event[0] || 0;
        var playerId = event[1];
        //cc.log("有玩家选择了分组卡牌！！！！！" ,  JSON.stringify(event) + "玩家数据为..." + JSON.stringify(DTZRoomModel.players) , choiceCardIndex);
        //cc.log("分组的位置为:" , choiceCardIndex);

        //新的分组规则
        //后台告知某个玩家选择了座位
        var choiceCardIndex = event[0] || 0;
        var playerId = event[1];
        var playerList = DTZRoomModel.players;
        var teamId = 0;

        if(choiceCardIndex == 2 || choiceCardIndex == 4){
            teamId = 2;
        }else{
            teamId = 1;
        }

        for(var index = 0 ; index < playerList.length ; index++){
            var tPlayerInfo = playerList[index];
            if(tPlayerInfo.getUserId() == playerId){
                //如果这个玩家已经是显示状态 清理之前的显示 并且重新显示这个地方的选座按钮
                this.clearTheShowPlayer(playerId);
                //将这个玩家显示在座位上 并且显示那个位置的选座按钮
                this["choiceSeatBtn" + choiceCardIndex].visible = false;
                tPlayerInfo.seat = choiceCardIndex;
                DTZRoomModel.updatePayerTeamId(playerId , teamId);
                this._players[choiceCardIndex] = new CardPlayer(tPlayerInfo, this.root, choiceCardIndex, teamId);

            }

            if(playerId == PlayerModel.userId){
                this.getWidget("LableChoiceTeam").visible = false;
                DTZRoomModel.mySeat = choiceCardIndex;
            }
        }

        var seats = DTZRoomModel.isIpSame();
        if(seats.length>0){
            for(var i=0;i<seats.length;i++) {
                this._players[seats[i]].isIpSame(true);
            }
        }
    },

    /**
     * 清空某个已显示的玩家
     */
    clearTheShowPlayer:function(userId){
        var seats = DTZRoomModel.isIpSame();
        for(var index = 1 ; index <= 4 ; index ++){
            if(this._players[index] != null){
                if (ArrayUtil.indexOf(seats, index) < 0) {
                    this._players[index].isIpSame(false);
                }
                if(this._players[index].getUserId() == userId){
                    //进行清理
                    //cc.log("进行清理..." , (index));
                    var playerNode = this.getWidget("player" + (index) );
                    var jiahaoImg = this.getWidget("jiahaoImg" + (index)).visible = true;

                    //清空名字
                    this.getWidget("name" + (index)).setString("");
                    //清空头像
                    if(playerNode.getChildByTag(345)){
                        //cc.log("移除头像成功...");
                        playerNode.removeChildByTag(345);
                    }
                    //清理已经选择的分组图标
                    ccui.helper.seekWidgetByName(playerNode,"teamIcon1").visible = false;
                    ccui.helper.seekWidgetByName(playerNode,"teamIcon2").visible = false;
                    //清理准备状态
                    var readySp = this.getWidget("zhunbei" + (index));
                    if(readySp){
                        readySp.visible = false;
                    }
                    //清理房主标示
                    var readySp = this.getWidget("CreaterSignImg" + (index));
                    if(readySp){
                        readySp.visible = false;
                    }

                    //显示这个位置的选座按钮
                    //if (DTZRoomModel.mySeat != 1) {//房主不显示换座位按钮
                    this["choiceSeatBtn" + (index)].visible = true;
                    //}
                    this._players[index] = null;
                }
            }
        }
    },

    /**
     * 分组完成 刷新各个玩家的座位
     *
     */
    onUpdatePlayerMsg:function(messageData){
       DTZExfunc.updatePlayerMsg(this , messageData);
    },

    /**
     * 一圈结束 三家要不起 清空计分 计分加入对应的玩家
     */
    onDealScore:function(event){
        //cc.log("一轮结束..." + JSON.stringify(messageData));

        //var tScole = parseInt(this.curScoreLable.getString());
        var messageData = event.getUserData();
        var addScoreUserId = messageData[0]; //加分的玩家ID
        var aTongziScore = messageData[1]; //刷新地炸筒子分 / 喜
        var bTongziScore = messageData[2]; //刷新地炸筒子分 / 喜
        var cTongziScore = 0;
        var curIndex = 3;
        if (DTZRoomModel.is3Ren()) {
            cTongziScore = messageData[curIndex];
            curIndex++;
        }
        var tScole = messageData[curIndex];  //增加的分值
        curIndex++;

        var shouldClearnOutCard = 1; //是否要清理所有打出去的牌 (小结弹出的时候 不应该清楚) 0不清理 1清理
        if( messageData[curIndex] != null){
            shouldClearnOutCard = messageData[curIndex];
        }
        //cc.log("shouldClearnOutCard..." , shouldClearnOutCard)
        if(shouldClearnOutCard == 1){
            //一圈比大小结束 清楚所有人打出去的牌
            if (!DTZRoomModel.is3Ren() && !(DTZRoomModel.is2Ren() && DTZRoomModel.isBida())) {
                for(var index = 1 ; index <= this._renshu ; index ++){
                    this.getWidget("small" + index).removeAllChildren(true);
                    this.getWidget("ybq" + index).visible = false;
                }
            }
        }

        if(aTongziScore != null && bTongziScore != null){
            this.aTeamTongziScore = aTongziScore;
            this.bTeamTongziScore = bTongziScore;
        }
        this.cTeamTongziScore = cTongziScore;
        var tTeamId = 0;
        var addScorePlayerSeat = 0;

        for (var seat in this._players) {
            var seat = parseInt(seat);
            var curPlayer = this._players[seat];
            //cc.log("this._PlayerData ... " , JSON.stringify(curPlayer));
            if(curPlayer.getUserId() == addScoreUserId){
                tTeamId = curPlayer.getTeamId();
                curPlayer.updatePointByBomb(tScole , true);
                addScorePlayerSeat = seat;
                //cc.log("这个分数应该加在" + tTeamId + "组" + tScole + "玩家的seat为：" + addScorePlayerSeat);

                var taddScorePalyerSeq = this.getPlayerSeq(-1, DTZRoomModel.mySeat, addScorePlayerSeat);
                var tTargetPlayer = curPlayer;
                if(tScole > 0){
                    var coinNumber = Math.min( Math.max( (tScole / 5) , 5)  , 16);
                    coinNumber = Math.ceil(coinNumber);
                    DTZJetton.runEffect(this.root , cc.p(600 , 664) , tTargetPlayer, false , coinNumber);
                }
            }
        }

        var tcurScore = this.curaTeamScore;
        if (tTeamId == 2) {
            tcurScore = this.curbTeamScore;
        } else if (tTeamId == 3) {
            tcurScore = this.curcTeamScore;
        }
        tcurScore += tScole;
        if(tTeamId == 1){
            this.curaTeamScore = tcurScore;
        } else if (tTeamId == 3) {
            this.curcTeamScore = tcurScore;
        }else{
            this.curbTeamScore = tcurScore;
        }

        //清理记录的上一次牌型
        this._lastCardTypeData = null;
        this._curTipCard = null;
        DTZExfunc.cleanSomeCount(this);
        DTZExfunc.updateRoomCount(this);
    },

    /**
     * 后台推送 有玩家出完牌了 显示名次
     */
    showWinNumber :function(messageData){
        //cc.log("有玩家出完牌了..." + JSON.stringify(messageData));

        var tWinPlayerUserId = messageData[0];
        var tWinPlayerNum = messageData[1];

        for (var seat in this._players) {
            var seat = parseInt(seat);
            var curPlayer = this._players[seat];

            if(curPlayer.getUserId() == tWinPlayerUserId){
                curPlayer.showNumber(tWinPlayerNum);
            }
        }
    },

    /**
     * 牌局开始 OnlimeRoom.js (子类实现)
     * @param event
     */
    startGame: function (event) {
        //PopupManager.removeClassByPopup(CutCardPop);
        //cc.log("游戏开始...DTZRoom startGame...");
        var message = event.getUserData();
        var isMatchRoom = DTZRoomModel.isMatchRoom();
        if(isMatchRoom){//金币场 在人数没有显示完全的时候 要把开始游戏消息缓存下来
            if(ObjectUtil.size(this._players) < DTZRoomModel.renshu){
                PlayDTZMessageSeq.cacheBeginMsg(message);
                cc.log("金币场 如果玩家加入房间消息没处理完 缓存住开始游戏消息！！");
                return;
            }
        }

        //this.playOrRemoveWaitingAnm();

        for (var i = 1; i <= this._renshu; i++) {
            this.getWidget("ybq" + i).visible = false;
            this.getWidget("zhunbei" + i).visible = false;
            this.getWidget("small" + i).removeAllChildren(true);
            if (this._players[i] != null) {
                this._players[i].showLastCard();
                this._players[i].hideNumber();
                this._players[i].playerQuanAnimation(false);
            }
        }

        PopupManager.removeAll();

        this.visibleOpButton((DTZRoomModel.nextSeat == DTZRoomModel.mySeat) , false);

        var p = event.getUserData();
        this._players[DTZRoomModel.mySeat].deal(p.handCardIds);
        this._countDown = DTZRoomModel.countDown;//发牌后显示第一家出牌的操作时间
        this.showJianTou();
        this._lastCardPattern = null;
        this._lastCardTypeData = null;
        this._curChoiceCardsTypeData = null;
        this._curChoiceCards = null;
        this._lastLetOutSeat = 0;
        this.initCards(p.handCardIds , true);

        this.playOrRemoveWaitingAnm();
        this.Panel_matchTip.visible = false;
        SyEventManager.dispatchEvent(SyEvent.MATCH_REMOVE_WAIT);
    },

    /**
     * 获取显示时间的label OnlimeRoom.js (子类实现)
     *
     */
    getLabelTime: function () {
        return this.getWidget("Label_39");//时间;
    },

    /**
     * 闹钟上面的箭头 OnlimeRoom.js
     * @param seat
     */
    showJianTou: function (seat) {
        this.Image_40.visible = false;
        seat = seat || DTZRoomModel.nextSeat;
        //cc.log("显示箭头..." , seat);
        if(seat == null ||　seat == 0 ){
            //cc.log("这个值是null 或者 0 ...", DTZRoomModel.nextSeat);
            return;
        }

        //显示或者影藏光圈
        for(var index = 1 ; index <= 4 ; index ++) {
            if (this._players[index]) {
                this._players[index].playerQuanAnimation(index == seat);
            }
        }

        var coords = null;
        if(DTZRoomModel.isMatchRoom()){
            var direct = this.getPlayerSeq("",DTZRoomModel.mySeat,seat);
            cc.log("direct..." , direct);
            coords = {1:{x:320,y:290},2:{x:985,y:455},3:{x:265,y:455}};
            this.countDownLabel.x = coords[direct].x;
            this.countDownLabel.y = coords[direct].y;
            this.countDownLabel.visible = (ObjectUtil.size(this._players) == DTZRoomModel.renshu);
        }

        this.showTouguanTime(this._countDown);
    },


    //OnlimeRoom.js
    onShow: function () {
        this._dt = 0;
        this._timedt = 0;
        this.calcTime();
        this.scheduleUpdate();
    },

    //OnlimeRoom.js
    onHide: function () {
        this.unscheduleUpdate();
    },



    onGpsPop:function(){
        PopupManager.addPopup(new GpsPop(DTZRoomModel , DTZRoomModel.renshu));
    },

    updateGpsBtn:function(){
        if(this.btn_Gps){
            if(GPSModel.getGpsData(PlayerModel.userId) == null){
                this.btn_Gps.setBright(false);
                this.btn_Gps.setTouchEnabled(false);
            }else{
                this.btn_Gps.setBright(true);
                this.btn_Gps.setTouchEnabled(true);
            }
        }
    },

    //标记 玩家已经显示了头像
    setRoldPlayerIcon:function(event)
    {
        var seat = event.getUserData();
        var players = DTZRoomModel.players;
        for(var i=0;i<players.length;i++) {
            var p = players[i];
            if(p.seat ==seat){
                p.isRoladIcon = 1;
            }
        }
    },

    /**
     * 退出房间
     * @param event
     */
    onExitRoom:function(event){
        var p = event.getUserData();
        if (DTZRoomModel.is4Ren()) {
            this.clearTheShowPlayer(p.userId);
        } else {
            this._players[p.seat].exitRoom();
            delete this._players[p.seat];
            var seats = DTZRoomModel.isIpSame();
            for (var key in this._players) {
                if (ArrayUtil.indexOf(seats, key) < 0) {
                    this._players[key].isIpSame(false);
                }
            }
        }
        //this.playOrRemoveWaitingAnm();
    },

     /*
     显示或者影藏总分表
      */
    showOrHideAllScore:function(){
        if(this.allScoreNode.isMoveing == true){
            return;
        }
        var time = 1;
        var offsetY1 = DTZRoomModel.is4Ren() ? 658 : 642;
        var offsetY2 = DTZRoomModel.is4Ren() ? 780 : 795;
        var endPos = cc.p(this.allScoreNode.x , 0);
        if(this.allScoreShowBtn.visible){
            this.allScoreShowBtn.visible = false;
            this.allScoreHideBtn.visible = true;
            endPos = cc.p(this.allScoreNode.x , offsetY1);
        }else{
            this.allScoreShowBtn.visible = true;
            this.allScoreHideBtn.visible = false;
            endPos = cc.p(this.allScoreNode.x , offsetY2);
        }

        var actionEndCallBack = cc.callFunc(this.actionEndCallBack, this);
        var move_ease_in = cc.moveTo(time , endPos).easing(cc.easeElasticOut(0.5));
        var rep = cc.sequence(move_ease_in ,  actionEndCallBack);
        this.allScoreNode.runAction(rep);
        this.allScoreNode.isMoveing = true;
    },

    showOrHideScore:function(){
        if(this.curScoreNode.isMoveing == true ){
            return;
        }
        var time = 1;
        var endPos = cc.p(this.curScoreNode.x , 0);
        if(this.curScoreShowBtn.visible){
            this.curScoreShowBtn.visible = false;
            this.curScoreHideBtn.visible = true;
            endPos = cc.p(this.curScoreNode.x , 659);
        }else{
            this.curScoreShowBtn.visible = true;
            this.curScoreHideBtn.visible = false;
            endPos = cc.p(this.curScoreNode.x , 780);
        }

        var actionEndCallBack = cc.callFunc(this.actionEndCallBack, this);
        var moveAction = cc.moveTo(time , endPos);
        var move_ease_in = moveAction.clone().easing(cc.easeElasticOut(0.5));
        var rep = cc.sequence(move_ease_in ,  actionEndCallBack);
        this.curScoreNode.runAction(rep);//move_ease_in
        this.curScoreNode.isMoveing = true;
    },

    actionEndCallBack:function(sender){
        if(sender){
            sender.isMoveing = false;
        }
    },

    onChangeStauts:function (event){
        var message = event.getUserData();
        var params = message.params;
        var seat = params[0];
        var status = params[1];
        this._players[seat].showStatus(status);
        //cc.log("后台通知" + seat + "座位的玩家准备 我的座位是" + DTZRoomModel.mySeat + "状态值为:" + status);
        if(seat == DTZRoomModel.mySeat){
            //cc.log("隐藏准备按钮..." , DTZRoomModel.mySeat);
            this.Button_30.visible = false;
            this.Button_17.visible = false;
            //隐藏选座按钮
            if (DTZRoomModel.is4Ren()) {
                this.choiceSeatBtn1.visible = false;
                this.choiceSeatBtn2.visible = false;
                this.choiceSeatBtn3.visible = false;
                this.choiceSeatBtn4.visible = false;
            }
        }
    },

    onZhanKai: function () {
        this.image_setPp = new DTZRoomSetPop();
        PopupManager.addPopup(this.image_setPp);
    },

    /**
     * 点击当前排名 和奖励
     */
    onRwardRank:function(){
        ComReq.comReqMatchRecord([1],[""+DTZRoomModel.matchKeyId]);
    },


    onPlayerInfo: function (obj) {
        if(this.Image_set.visible){
            return;
        }
        //cc.log("onPlayerInfo:" + JSON.stringify(this._players));
        if(this._players[obj.temp] == null){
            //cc.log("这个位置还没有玩家...");
        }else{
            this._players[obj.temp].showInfo();
        }

    },


    getChatJSON:function(){
        return "res/chat.json";
    },

    visibleOpButton: function(visible , buyaoVisible){
        this.Button_6.visible = this.Button_4.visible = this.Button_giveUp.visible = visible;
        if((visible == true && buyaoVisible == false)){//this._lastCardTypeData == null buyaoVisible == false
            //cc.log("没有记录的上一副玩家出的牌型 , 轮到我出第一手牌 并且修改其他两个按钮的位置 相对往左边移动");
            this._lastCardTypeData = null;
            if(this.Button_4.x == 662){
                this.Button_4.x = 522;
                this.Button_6.x = 782;
            }
            this.Button_giveUp.visible = false;
            //增加出牌的手指动画 先关闭这个功能 文字显示的滑动出牌和游戏不符合
            //this.showFingerEffect();
        }else{
            if (!DTZRoomModel.is3Ren() && !(DTZRoomModel.isBida()) ) {
                if (this.Button_4.x != 662) {//修正位置
                    this.Button_4.x = 662;
                    this.Button_6.x = 873;
                }
            }
            this.Button_giveUp.visible = visible;
        }
        if (DTZRoomModel.is3Ren() || (DTZRoomModel.is2Ren() && DTZRoomModel.isBida())) {
            this.Button_giveUp.visible = false;
        }
    },

    visibleOpScore: function(groupString,visible) {
        this["lableName"+groupString].visible = visible;
        this.getWidget("LableScore"+groupString).visible= visible;
        this.getWidget("LableCurScore"+groupString).visible= visible;
        this.getWidget("Lable"+groupString+"Tongzi").visible= visible;
    },

    unSelectAllCards: function () {
        this._curChoiceCards = null;
        for (var i = 0; i < this._cards.length; i++) {
            var card = this._cards[i];
            if (card.isSelected()){
                card.unselected();
            }else{
                card.fixHeight();
            }
        }
    },

    enableAllCards: function () {
        for (var i = 0; i < this._cards.length; i++) {
            this._cards[i].enableAction();
        }
    },

    onTouchBegan: function (touch, event) {
        return DTZCardDelegate.dealTouchBegin(this , touch , event);
    },

    onTouchMoved: function (touch, event) {
        return DTZCardDelegate.dealTouchMove(this , touch , event);
    },

    onTouchEnded: function (touch, event) {
        return DTZCardDelegate.dealTouchEnded(this, touch , event);
    },

    changeLetOutButton: function (isTouch) {
        if (isTouch == this._letOutButtonTouchable)
            return;
        this._letOutButtonTouchable = isTouch;
        if (isTouch) {
            this.Button_6.setTouchEnabled(true);
            this.Button_6.setBright(true);
            //this.Button_6.loadTextureNormal("res/ui/buttons/btn_15.png");
        } else {
            this.Button_6.setTouchEnabled(false);
            this.Button_6.setBright(false);
            //this.Button_6.loadTextureNormal("res/ui/buttons/btn_15_g.png");
        }
    },

    isCanLetOut: function () {

        var tCards = this._curChoiceCards;
        var allCardsObj = [];
        for (var i = 0; i < this._cards.length; i++) {
            var card = this._cards[i];
            if (card.isSelected()) {
                allCardsObj.push(card);
            }
        }
        tCards = this._curChoiceCards = allCardsObj;

        //当前牌是否可以打出的判断
        if(tCards === null || tCards.length <= 0){
            this.changeLetOutButton(false);
            //cc.log("当前未选择牌 不可打出 ...");
            return
        }
        if(this._lastCardTypeData != null){
            //cc.log("当前有记录上家的牌型..." , JSON.stringify(this._lastCardTypeData));
            //this.Button_giveUp.visible = true;
        }else{
            //cc.log("没人要的起 轮到我出牌...")
            //this.Button_giveUp.visible = false;

        }
        var curTipCardsTypeDate = DTZAI.getCardsType(tCards , this._lastCardTypeData);
        //cc.log("当前选择牌 解析出的牌型为：" , JSON.stringify(curTipCardsTypeDate));
        if(curTipCardsTypeDate.type <= 0){
            this.changeLetOutButton(false);
            //cc.log("当前选择的牌 牌型异常 不可打出 ...");
            return;
        }else{
            if(this._lastCardTypeData == null || this._lastCardTypeData.type == 0){
                this.changeLetOutButton(true);
                return;
            }else if(curTipCardsTypeDate.type == this._lastCardTypeData.type && this._lastCardTypeData.type == DTZAI.LIANDUI ){ //连对
                if( curTipCardsTypeDate.value > this._lastCardTypeData.value && curTipCardsTypeDate.serialNum == this._lastCardTypeData.serialNum){
                    this.changeLetOutButton(true);
                }else{
                    this.changeLetOutButton(false);
                }
                return;
            } else if ((this._lastCardTypeData.type == DTZAI.THREE || this._lastCardTypeData.type == DTZAI.THREEWithCard) && //三张和三张带
                    (curTipCardsTypeDate.type == DTZAI.THREE || curTipCardsTypeDate.type == DTZAI.THREEWithCard) ){
                //cc.log("上家的是三张 下家三张或者非三张都可以打");
                if(curTipCardsTypeDate.value > this._lastCardTypeData.value){
                    this.changeLetOutButton(true);
                }else{
                    this.changeLetOutButton(false);
                }
                return;
            } else if((this._lastCardTypeData.type == DTZAI.PLANE || this._lastCardTypeData.type == DTZAI.PLANEWithCard) && //飞机和飞机带
                (curTipCardsTypeDate.type == DTZAI.PLANE || curTipCardsTypeDate.type == DTZAI.PLANEWithCard)){
                if((curTipCardsTypeDate.serialNum == this._lastCardTypeData.serialNum)  && (curTipCardsTypeDate.value > this._lastCardTypeData.value)){
                    this.changeLetOutButton(true);
                }else{
                    this.changeLetOutButton(false);
                }
                return;
            }  else if (curTipCardsTypeDate.type >= DTZAI.BOMB && curTipCardsTypeDate.type >= this._lastCardTypeData.type){ //炸弹 以及筒子 地炸 喜

                if(curTipCardsTypeDate.type == this._lastCardTypeData.type && this._lastCardTypeData.type == DTZAI.TONGZI){ //筒子要比较面值和颜色
                    if(curTipCardsTypeDate.value == this._lastCardTypeData.value && DTZRoomModel.is3FuPai()){//三副牌才要比较颜色
                        this.changeLetOutButton( curTipCardsTypeDate.repeatColor > this._lastCardTypeData.repeatColor );
                        return;
                    }else{
                        this.changeLetOutButton( curTipCardsTypeDate.value > this._lastCardTypeData.value);
                        return;
                    }
                }

                if(curTipCardsTypeDate.type == this._lastCardTypeData.type && this._lastCardTypeData.type == DTZAI.BOMB) { //炸弹要比较长度
                    if(curTipCardsTypeDate.repeatNum == this._lastCardTypeData.repeatNum){
                        this.changeLetOutButton( curTipCardsTypeDate.value > this._lastCardTypeData.value );
                        return;
                    }else{
                        this.changeLetOutButton( curTipCardsTypeDate.repeatNum > this._lastCardTypeData.repeatNum );
                        return;
                    }
                }

                if(curTipCardsTypeDate.type == this._lastCardTypeData.type && this._lastCardTypeData.type == DTZAI.SUPERBOOM){ //都是地炸比较大小就行
                    this.changeLetOutButton( curTipCardsTypeDate.value > this._lastCardTypeData.value );
                    return;
                }

                if(curTipCardsTypeDate.type == this._lastCardTypeData.type && this._lastCardTypeData.type == DTZAI.XI && DTZRoomModel.is4FuPai()){ //都是喜比较大小就行
                    this.changeLetOutButton( curTipCardsTypeDate.value > this._lastCardTypeData.value );
                    return;
                }

                //类型碾压
                this.changeLetOutButton(true);
                return;
            }else if(curTipCardsTypeDate.type == this._lastCardTypeData.type && curTipCardsTypeDate.value > this._lastCardTypeData.value ){
                this.changeLetOutButton(true);
                return;
            } else{
                //不属于以上任何情况 按钮为false
                this.changeLetOutButton(false);
                return;
            }
        }
    },

    /**
     * 初始化卡牌 小付
     * @param cards {Array.<CardVo>}
     */
    initCards: function (cards , showAction) {
        //cc.log("initCards..."  + cards.length + JSON.stringify(cards));
        //this.RoomIdRoot.visible = false;
        showAction = showAction || false;

        if (this._cards.length > 0) {//清理掉上一局的牌
            for (var i = 0; i < this._cards.length; i++) {
                var realValue = this._cardPanel.removeChild(this._cards[i]);
            }
            this._cards.length = 0;
        }
        if (this._cards.length == 0) {
            cards.sort(function (item1, item2) {
                if (item1.i != item2.i) {
                    return item2.i - item1.i;
                } else {
                    return item2.t - item1.t;
                }
            });

            var winSize = cc.director.getWinSize();
            var centerX = (winSize.width - this._cardW) / 2;
            var centerY = (winSize.height) / 2;
            //var initX = (winSize.width - (this._cardW+this._cardG*(cards.length-1)))/2;
            var initX = this.initX;


            for (var i = 0; i < cards.length; i++){
                var card = new DTZBigCard(cards[i]);
                card.cardId = i;
                card.anchorX = card.anchorY = 0.5;
                card.scale = this._cardScale;
                card.setLocalZOrder(i);
                this._cards.push(card);
            }
            //检测筒子
            DTZExfunc.signTongzi(this._cards);
            if(DTZRoomModel.is3FuPai()){
                //检测地炸
                DTZExfunc.signSuperBoom(this._cards);
            }else if(DTZRoomModel.is4FuPai()){
                //检测囍
                DTZExfunc.signXi(this._cards);
            }
            //新增排序 保护筒子地炸囍不被拆散 并且保护第一行的结尾不会拆开连续的牌
            DTZExfunc.fixSort(this , showAction);
        }
        this.isCanLetOut();
    },

    getPlayerSeq: function (userId, ownSeat, seat) {
        if (userId == PlayerModel.userId)
            return 1;

        var seqArray = this.seatSeq[ownSeat];
        cc.log("seqArray...seat " , seqArray , seat);
        var seq = ArrayUtil.indexOf(seqArray, seat) + 1;
        return seq;
    },

    letOutCards: function (cardIds, seat, nextSeat , isContinue) {
        //cc.log("打出去的牌..." , cardIds , isOver , nextSeat);

        var isOver = false;
        var initX = 0;
        var isContinue = isContinue || false;
        cc.log("isContinue ... " , isContinue);

        //新的清卡牌规则
        if(DTZRoomModel.cleanCards == 1){
            if(cardIds.length != 0){
                //有玩家出牌了 清理掉所有之前出的牌
                for(var index = 1 ; index <= this._renshu ; index++) {
                    this.getWidget("small" + index).removeAllChildren(true);
                }
            }
            //不管当前的玩家是出牌还是不要 清理掉下个出牌的玩家的不要显示
            if(nextSeat != null && nextSeat != 0){//后台下发了nextSeat就直接清空这个玩家出过的牌 并且 影藏不要的状态
                var tnextPlaySep = this.getPlayerSeq(-1, DTZRoomModel.mySeat, nextSeat);
                this.getWidget("small" + tnextPlaySep).removeAllChildren(true);
                this.getWidget("ybq" + tnextPlaySep).visible = false;
            }

            //出完牌的人的特殊处理
            var nextSeq = this.getPlayerSeq(-1, DTZRoomModel.mySeat, this.seatSeq[seat][1]);
            var nextNextSeqp = this.getPlayerSeq(-1, DTZRoomModel.mySeat, this.seatSeq[seat][2]);

            //这个地方改为 判断后面两家是否出完牌了 出完了则清理掉之前打的牌
            if(DTZExfunc.isPlayerHasNoCard(this , nextSeq)){
                this.getWidget("ybq" + nextSeq).visible = false;
            }

            if(DTZExfunc.isPlayerHasNoCard(this ,nextSeq) && DTZExfunc.isPlayerHasNoCard(this , nextNextSeqp)){
                this.getWidget("ybq" + nextNextSeqp).visible = false;
            }
        }

        if (cardIds.length == 0){
            return;
        }

        AudioManager.play("res/audio/common/audio_card_out.mp3");
        var seq = 1;
        //this.unSelectAllCards();
        var removeCardLength = 0;

        if (seat == DTZRoomModel.mySeat) {//自己出牌
            var cards = this._cards;
            var length = this._cards.length;
            cc.log("当前玩家剩余卡牌数："+this._cards.length + "后台通知删除卡牌数:" + cardIds.length)
            for (var n = 0; n < cardIds.length; n++) {
                var removeCardSus = false;
                for (var i = 0; i < cards.length; i++) {
                    var card = cards[i];
                    if (card.getData().c == cardIds[n]) {
                        this._cardPanel.removeChild(card);
                        this._cards.splice(i, 1);
                        removeCardLength ++;
                        removeCardSus = true;
                        break;
                    }
                }
            }
            //重新检测筒子
            DTZExfunc.signTongzi(this._cards);
            if(DTZRoomModel.is3FuPai()){
                //检测地炸
                DTZExfunc.signSuperBoom(this._cards);
            }else if(DTZRoomModel.is4FuPai()){
                //检测囍
                DTZExfunc.signXi(this._cards);
            }
            //自己出牌后 重新定位
            this.resetCardList();
        } else {
            seq = this.getPlayerSeq(-1, DTZRoomModel.mySeat, seat);
            var playerVo = DTZRoomModel.getPlayerVoBySeat(seat);
            if (playerVo != null) {
                if (!isOver && isContinue == false) {
                    //刷新玩家的剩余牌数量
                    playerVo.ext[6] -= cardIds.length;
                }
                if (this._players[seat]) {
                    this._players[seat].showLastCard();
                }
            }
        }

        //显示玩家或者我打出去的卡牌
        var copyCardIds = ArrayUtil.clone(cardIds);
        var outCardObj = [];
        var tcheckTypeObj = [];
        var length = copyCardIds.length;
        var smallW = this._cardW * this._letOutCardScale;
        var outCardOffX = 36;
        var effectX = 0;//记录卡牌显示的中间位置 用来控制特效的显示位置
        var effectY = 0;
        var midLength = Math.ceil( length / 2 );

        var parentNode = this.getWidget("small" + seq)
        parentNode.removeAllChildren(true);
        for (var i = 0; i < length; i++) {
            var smallCard = new SmallCard(DTZAI.getCardDef(copyCardIds[i]));
            var smallCardforType = new SmallCard(DTZAI.getCardDef(copyCardIds[i]));
            outCardObj.push(smallCard);
            tcheckTypeObj.push(smallCardforType);
        }
        if (DTZRoomModel.is3Ren() && seq == 3) {
            seq = 4;
        }
        var cardType = DTZAI.getCardsType(tcheckTypeObj , this._lastCardTypeData);
        var cardListWidth = (smallW + outCardOffX * (length - 1));
        //cc.log("cardType" , cardType.type);
        if (seq == 1 || seq == 3) {
            initX = (800 - cardListWidth) / 2;
            effectX = parentNode.x + parentNode.width * 0.5 ;
        } else if (seq == 2) {
            initX = (800 - smallW);
            effectX = parentNode.x + parentNode.width - cardListWidth * 0.5;
            //copyCardIds.reverse();
        } else {
            initX = 0;
            effectX = parentNode.x + cardListWidth * 0.5 ;
        }
        effectY = parentNode.y + parentNode.height * 0.5;
        //cc.log("记录特效应该显示的位置..." , effectX , effectY);

        var specialIndex = -1;
        var offX = 12;
        //cc.log("cardType.type" , cardType.type);
        if(cardType.type == DTZAI.PLANEWithCard || cardType.type == DTZAI.THREEWithCard){
            //cc.log("这个卡牌要特殊显示")
            if(cardType.type == DTZAI.PLANEWithCard){
                var threeLength = cardType.serialNum * 3;
                specialIndex = threeLength
            }else if(cardType.type == DTZAI.THREEWithCard){
                specialIndex = 3;
            }
        }
        //cc.log("第" + specialIndex + "张牌隔开");

        //换行的显示情况
        var changeLineLength = 20;
        if(length >= changeLineLength && (cardType.type == DTZAI.PLANEWithCard || cardType.type == DTZAI.PLANE)){
            var cutPos = 0;
            var fixBeginX = 0;
            if(specialIndex != -1){ //三张带牌 把带的牌切到第二排
                cutPos = specialIndex;
            }else{
                cutPos = parseInt(Math.round(length / 2));
            }
            //cc.log("cutPos length..." , cutPos , length);
            fixBeginX = (outCardOffX * (length - cutPos - 1));
            if(seq == 1 || seq == 3){
                initX = initX + fixBeginX * 0.5;
            }

            for (var i = 0; i < length; i++) {
                var smallCard = outCardObj[i];//new SmallCard(DTZAI.getCardDef(copyCardIds[i]));
                //cc.log("绘制的卡牌i , c" , smallCard.i , smallCard.c);
                smallCard.anchorX = 0;
                smallCard.anchorY = 0;
                smallCard.scale = this._letOutCardScale;

                if (seq == 2) {
                    smallCard.x = initX - i * outCardOffX;
                    smallCard.setLocalZOrder(length - i);
                    if(specialIndex != -1 && specialIndex <= i){
                        smallCard.x = smallCard.x - offX;
                    }
                 } else {
                    smallCard.x = initX + i * outCardOffX;
                    if (specialIndex != -1 && specialIndex <= i) {
                        smallCard.x = smallCard.x + offX;
                    }
                }

                if(i >= cutPos){
                    smallCard.y = -60;
                    smallCard.x = smallCard.x = initX + (i - cutPos) * outCardOffX;
                    if(seq == 2){
                        smallCard.setLocalZOrder(length - i + cutPos + 1);
                        smallCard.x = smallCard.x = initX - (i - cutPos) * outCardOffX;
                    }
                }else{
                    smallCard.y = 0;
                }
                parentNode.addChild(smallCard);
            }
        }else{  //正常的现实情况
            for (var i = 0; i < length; i++) {
                var smallCard = outCardObj[i];//new SmallCard(DTZAI.getCardDef(copyCardIds[i]));
                //cc.log("绘制的卡牌i , c" , smallCard.i , smallCard.c);
                smallCard.anchorX = 0;
                smallCard.anchorY = 0;
                smallCard.scale = this._letOutCardScale;
                if (seq == 2) {
                    smallCard.x = initX - i * outCardOffX;
                    smallCard.setLocalZOrder(length - i);
                    if(specialIndex != -1 && specialIndex <= i){
                        smallCard.x = smallCard.x - offX;
                    }
                } else {
                    smallCard.x = initX + i * outCardOffX;
                    if(specialIndex != -1 && specialIndex <= i){
                        smallCard.x = smallCard.x + offX;
                    }
                }
                smallCard.y = 0;

                parentNode.addChild(smallCard);
            }
        }
        //播放特效
        DTZRoomEffects.play(this.root, this._lastCardTypeData , cc.p(effectX , effectY));
    },

    /**
     * 出牌后重新排版和检测
     */
    resetCardList:function() {
        //自己出牌后 重新定位
        this.cardMapData = DTZAI.getCardsMap(this._cards , false);
        var winSize = cc.director.getWinSize();
        var initX = this.initX;
        DTZExfunc.updateShowMap(this,this._cards);

        this._cards.sort(function (item2, item1) {

            if (item1.i != item2.i) {
                return item2.i - item1.i;
            } else {
                if( (item2.isSpecialCard() != item1.isSpecialCard()) ){
                    return item2.isSpecialCard() - item1.isSpecialCard()
                }else{
                    return item2.t - item1.t;
                }
            }
        });

        var offX = 0;
        if(this.line2cardNumber < this.firstLineLimit){
            offX = (this.firstLineLimit - this.line2cardNumber) * this._cardG * 0.5;
            initX = initX + offX;
        }

        for (var i = 0; i < this._cards.length; i++) {
            var card = this._cards[i];
            var cardSize = card.getContentSize();
            var cardWidth = cardSize.width * card.scale;
            var realX = initX + (i + 1) * this._cardG * card.scale + cardWidth * 0.5;
            card.cardId = i;
            card.setLocalZOrder(i);

            var showLine = DTZExfunc.getShowLine(this , card , i);

            if (showLine == 1) {
                realX = initX + (i - this.line2cardNumber + 1) * this._cardG * card.scale + cardWidth * 0.5;
                card.y = this.initCardYLine1;
                card.setLocalZOrder(-1);
                card.setLine(1);
            } else {
                card.y = this.initCardYLine2;
                card.setLine(2);
            }
            card.x = realX
        }
        this._curChoiceCards = null;
    },

    initLabelColor: function () {
        var color1 = cc.color(227,227,227);//灰色
        var color2 = cc.color(255,228,104);//黄色
        for(var i = 1 ; i <= 4 ; i ++) {
            this.getWidget("lableTitle_" + i).setColor(color1);
        }
        this.getWidget("Label_94").setColor(color1);
        this.getWidget("Label_95").setColor(color1);
        if (!DTZRoomModel.is4Ren()) {
            this.lableNameA.setColor(color1);
            this.lableNameB.setColor(color1);
            this.lableNameC.setColor(color1);
            this.cTeamScoreLable.setColor(color2);
        }
        this.aTeamScoreLable.setColor(color2);
        this.bTeamScoreLable.setColor(color2);
        this.curScoreLable.setColor(color2);

        var type = this.getLocalItem("sy_dtz_pz") || 1;
        this.showBgColor(type);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    updateBgColor:function(event){
        var type = event.getUserData();
        this.showBgColor(type);
    },

    updatePlayTuoguan:function(event){
        var data = event.getUserData();
        cc.log("updatePlayTuoguan..." , data);
        //data = data.split(",");
        if(data.length >= 2){
            //var userId = data[0];
            var seat = data[0];
            var isTuoguan = data[1];
            cc.log("seat , isTuoguan" , seat , isTuoguan);
            var player = this._players[seat];
            if(player){
                player.updateTuoguan(isTuoguan);
            }else{
                cc.log("!!!!!!!未获取到player");
            }
            if(seat == DTZRoomModel.mySeat && this.bg_CancelTuoguan){
                this.bg_CancelTuoguan.visible = isTuoguan;
            }
        }
    },

    //更新背景图和 更新字体颜色
    showBgColor: function (_type) {
        //绿色背景1蓝色背景2紫色背景3
        var color = cc.color(130,248,171);
        var sezhi1 = 130;
        var sezhi2 = 248;
        var sezhi3 = 171;
        var bgTexture = "res/ui/dtz/dtzRoom/background1.jpg";
        var wfcolor = cc.color(30,111,74);
        if (_type == 1){

        }else if (_type == 2){
            bgTexture = "res/ui/dtz/dtzRoom/background2.jpg";
            color = cc.color(112,225,235);
            sezhi1 = 112;
            sezhi2 = 225;
            sezhi3 = 235;
            wfcolor = cc.color(54,80,103);
        }else if (_type == 3){
            bgTexture = "res/ui/dtz/dtzRoom/background3.jpg";
            color = cc.color(164,203,251);
            sezhi1 = 164;
            sezhi2 = 203;
            sezhi3 = 251;
            wfcolor = cc.color(50,73,117);
        }
        DTZRoomModel._pzLableColor = [sezhi1,sezhi2,sezhi3];
        cc.log("DTZRoomModel._pzLableColor::"+DTZRoomModel._pzLableColor , bgTexture);
        //this.Image_bg.loadTexture(bgTexture);
        this.Panel_15.setBackGroundImage(bgTexture);
        this.aTeamCurScoreLable.setColor(color);
        this.bTeamCurScoreLable.setColor(color);
        this.aTongziScoreLable.setColor(color);
        this.bTongziScoreLable.setColor(color);
        this.roomFiveLable.setColor(color);
        this.roomTenLable.setColor(color);
        this.roomKLable.setColor(color);
        this.roomFiveNumLable.setColor(color);
        this.roomTenNumLable.setColor(color);
        this.roomKNumLable.setColor(color);
        if (!DTZRoomModel.is4Ren()){
            this.cTongziScoreLable.setColor(color);
            this.cTeamCurScoreLable.setColor(color);
        }
        //中间玩法的颜色
        this.paiNumLabel.setColor(wfcolor);
        this.awardLabel.setColor(wfcolor);
        this.jsScoreLabel.setColor(wfcolor);
    }

});