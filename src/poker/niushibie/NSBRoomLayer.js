/**
 * Created by cyp on 2019/11/13.
 */
var NSBRoomLayer = NSBBaseRoomLayer.extend({
    tableMsgArr:null,
    ctor:function(){
        this._super();

        this.tableMsgArr = [];

        this.addCustomEvent(SyEvent.GetTableMsg,this,this.onGetTableData);

        this.soundHandle = new NSBRoomSound();

        this.initLayer();
        this.addRoomTitle();
        this.addRoomLayer();
        this.addBottomBtn();
        this.addYuyinRecored();
        this.addRoomBtn();

    },

    onEnterTransitionDidFinish:function(){
        this._super();

        this.scheduleUpdate();
    },

    initLayer:function(){
        var roomInfoBg = new cc.Scale9Sprite("res/ui/diantuo/jiugonga1.png");
        roomInfoBg.setAnchorPoint(0,1);
        roomInfoBg.setPosition(120,cc.winSize.height - 15);
        roomInfoBg.setContentSize(160,100);
        this.addChild(roomInfoBg);

        this.label_room_id = new cc.LabelTTF("房号:123456","Arial",24);
        this.label_room_id.setAnchorPoint(0,0.5);
        this.label_room_id.setPosition(10,roomInfoBg.height - 20);
        roomInfoBg.addChild(this.label_room_id);

        this.label_jushu = new cc.LabelTTF("局数:0/10","Arial",24);
        this.label_jushu.setAnchorPoint(0,0.5);
        this.label_jushu.setPosition(10,this.label_room_id.y - 30);
        roomInfoBg.addChild(this.label_jushu);

        this.label_room_name = new cc.LabelTTF("牛十别房间名","",24);
        this.label_room_name.setAnchorPoint(0,0.5);
        this.label_room_name.setPosition(10,this.label_jushu.y - 30);
        roomInfoBg.addChild(this.label_room_name);

        this.label_rule_tip = new ccui.Text("","",26);
        this.label_rule_tip.setTextAreaSize(cc.size(800,0));
        this.label_rule_tip.setFontName("res/font/bjdmj/fzcy.TTF");
        this.label_rule_tip.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.label_rule_tip.setOpacity(100);
        this.label_rule_tip.setColor(cc.color(0,0,0));
        this.label_rule_tip.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 10);
        this.addChild(this.label_rule_tip);

        var btn_bg = new cc.Scale9Sprite("res/ui/diantuo/image_xiadi.png");
        btn_bg.setContentSize(cc.winSize.width,btn_bg.height);
        btn_bg.setAnchorPoint(0.5,0);
        btn_bg.setPosition(cc.winSize.width/2,0);
        this.addChild(btn_bg);

        this.paiZhuoFen = new cc.Sprite("res/ui/diantuo/paizhuofen.png");
        this.paiZhuoFen.setPosition(cc.winSize.width/2 - 50,cc.winSize.height/2 + 80);
        this.paiZhuoFen.setVisible(false);
        this.addChild(this.paiZhuoFen);

        this.setPaiZhuoFen(0);

        var tongji_bg = new cc.Sprite("res/ui/niushibie/tongji.png");
        tongji_bg.setPosition(cc.winSize.width - 240,cc.winSize.height - 60);
        this.addChild(tongji_bg);

        var label_txt1 = new cc.LabelTTF("己方:","Arial",24);
        label_txt1.setPosition(40,tongji_bg.height/2 + 20);
        tongji_bg.addChild(label_txt1);

        var label_txt2 = new cc.LabelTTF("对方:","Arial",24);
        label_txt2.setPosition(40,tongji_bg.height/2 - 20);
        tongji_bg.addChild(label_txt2);

        this.label_team_my = new cc.LabelTTF("0","Arial",24);
        this.label_team_my.setPosition(tongji_bg.width/2 + 25,label_txt1.y);
        this.label_team_my.setColor(cc.color.YELLOW);
        tongji_bg.addChild(this.label_team_my);

        this.label_team_other = new cc.LabelTTF("0","Arial",24);
        this.label_team_other.setPosition(tongji_bg.width/2 + 25,label_txt2.y);
        this.label_team_other.setColor(cc.color.YELLOW);
        tongji_bg.addChild(this.label_team_other);

    },

    setPaiZhuoFen:function(num){
        this.paiZhuoFen.removeAllChildren(true);
        var numStr = String(num);
        for(var i = 0;i<numStr.length;++i){
            var n = Number(numStr[i]);
            var spr = new cc.Sprite("res/ui/diantuo/score_img.png",cc.rect(n*36,0,36,48));
            spr.setPosition(160 + 40*i,this.paiZhuoFen.height/2);
            this.paiZhuoFen.addChild(spr);
        }
    },

    addRoomTitle:function(){
        var spr = new cc.Sprite("res/ui/niushibie/wanfa_nsb.png");
        spr.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 150);
        this.addChild(spr);
    },

    addBottomBtn:function(){

        var img = "res/ui/diantuo/huatong.png";
        this.btn_yuyin = new ccui.Button(img,img);
        this.btn_yuyin.setPosition(cc.winSize.width - 60,250);
        this.addChild(this.btn_yuyin);

        img = "res/ui/diantuo/liaotian.png";
        this.btn_chat = new ccui.Button(img,img);
        this.btn_chat.setPosition(this.btn_yuyin.x - 100,this.btn_yuyin.y);
        this.addChild(this.btn_chat);

        this.btn_chat.setScale(0.8);
        this.btn_yuyin.setScale(0.8);

        img = "res/ui/diantuo/paixu_n.png";
        this.btn_paixu = new ccui.Button(img,img);
        this.btn_paixu.setPosition(cc.winSize.width - 80,26);
        this.addChild(this.btn_paixu);

        img = "res/ui/diantuo/wushik_n.png";
        this.btn_wushik = new ccui.Button(img,img);
        this.btn_wushik.setPosition(this.btn_paixu.x - 150,this.btn_paixu.y);
        this.addChild(this.btn_wushik);

        img = "res/ui/diantuo/zhadan_n.png";
        this.btn_zhadan = new ccui.Button(img,img);
        this.btn_zhadan.setPosition(this.btn_wushik.x - 150,this.btn_paixu.y);
        this.addChild(this.btn_zhadan);

        img = "res/ui/niushibie/btn_tonghuashun.png";
        this.btn_tonghuashun = new ccui.Button(img,img);
        this.btn_tonghuashun.setPosition(this.btn_zhadan.x - 150,this.btn_paixu.y);
        this.addChild(this.btn_tonghuashun);

        img = "res/ui/niushibie/btn_kanfen.png";
        this.btn_show_defen = new ccui.Button(img,img);
        this.btn_show_defen.setPosition(this.btn_tonghuashun.x - 150,this.btn_paixu.y);
        this.addChild(this.btn_show_defen);

        img = "res/ui/niushibie/btn_mingpai.png";
        this.btn_mingpai = new ccui.Button(img,img);
        this.btn_mingpai.setPosition(this.btn_show_defen.x - 150,this.btn_paixu.y);
        this.addChild(this.btn_mingpai);


        this.btn_chat.addTouchEventListener(this.onClickBtn,this);
        this.btn_yuyin.addTouchEventListener(this.onClickBtn,this);
        this.btn_show_defen.addTouchEventListener(this.onClickBtn,this);
        this.btn_paixu.addTouchEventListener(this.onClickBtn,this);
        this.btn_wushik.addTouchEventListener(this.onClickBtn,this);
        this.btn_zhadan.addTouchEventListener(this.onClickBtn,this);
        this.btn_tonghuashun.addTouchEventListener(this.onClickBtn,this);
        this.btn_mingpai.addTouchEventListener(this.onClickBtn,this);

        if(BaseRoomModel.isBanVoiceAndProps()){
            this.btn_yuyin.setVisible(false);
        }
    },

    addRoomLayer:function(){

        this.addChild(this.playerLayer = new NSBPlayerLayer(),2);
        this.addChild(this.cardLayer = new NSBCardLayer(),1);
        this.addChild(this.optBtnLayer = new NSBOptBtnLayer(),10);
    },

    addRoomBtn:function(){
        var isQyqRoom = NSBRoomModel.tableType == 1;

        var img_wx = "res/ui/diantuo/btn_invite.png";
        if(isQyqRoom)img_wx = "res/ui/bjdmj/wx_invite.png";
        var img_qyq = "res/ui/bjdmj/qyq_invite.png";
        var img_back = "res/ui/bjdmj/back_qyq_hall.png";

        this.roomBtnContent = new cc.Node();
        this.roomBtnContent.setPosition(cc.winSize.width/2,cc.winSize.height/2 - 80);
        this.addChild(this.roomBtnContent);

        var btnArr = [];

        this.btn_invite_wx = new ccui.Button(img_wx,img_wx);
        this.roomBtnContent.addChild(this.btn_invite_wx);
        btnArr.push(this.btn_invite_wx);

        if(isQyqRoom){
            if(ClickClubModel.getIsForbidInvite()){
                if(NSBRoomModel.privateRoom == 1){
                    img_qyq = "res/ui/bjdmj/haoyouyaoqing.png";
                }
                this.btn_invite_qyq = new ccui.Button(img_qyq,img_qyq);
                this.roomBtnContent.addChild(this.btn_invite_qyq);
                btnArr.push(this.btn_invite_qyq);
            }

            this.btn_qyq_back = new ccui.Button(img_back,img_back);
            this.roomBtnContent.addChild(this.btn_qyq_back);
            btnArr.push(this.btn_qyq_back);
        }

        var offsetX = 200;
        var startX = -(btnArr.length - 1)/2 * offsetX;
        for(var i = 0;i<btnArr.length;++i){
            btnArr[i].setPosition(startX + offsetX*i,0);
            btnArr[i].addTouchEventListener(this.onClickBtn,this);
        }

        var img_ready = "res/ui/diantuo/btn_ready.png";
        this.btn_ready = new ccui.Button(img_ready,img_ready);
        this.btn_ready.setPosition(cc.winSize.width/2,150);
        this.addChild(this.btn_ready);
        this.btn_ready.addTouchEventListener(this.onClickBtn,this);

        //this.roomBtnContent.setVisible(false);
    },

    addYuyinRecored:function(){
        this.yuyinBg = new cc.Scale9Sprite("res/ui/mj/zzmjRoom/img_40.png");
        this.yuyinBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.yuyinBg.setContentSize(330,210);
        this.addChild(this.yuyinBg,100);

        var img1 = new cc.Sprite("res/ui/mj/zzmjRoom/img_39.png");
        img1.setPosition(this.yuyinBg.width/2,this.yuyinBg.height/2 + 25);
        this.yuyinBg.addChild(img1);

        var progressBg = new cc.Sprite("res/ui/mj/zzmjRoom/img_audio_1.png");
        progressBg.setPosition(this.yuyinBg.width/2,this.yuyinBg.height/2 + 25);
        this.yuyinBg.addChild(progressBg);

        var tipLabel = new cc.LabelTTF("手指上滑取消发送","",28);
        tipLabel.setPosition(this.yuyinBg.width/2,30);
        this.yuyinBg.addChild(tipLabel);

        this.addCustomEvent(SyEvent.USER_AUDIO_READY,this,this.onRadioReady);
        this.progCycle = new cc.ProgressTimer(new cc.Sprite("res/ui/dtz/images/img_audio_2.png"));
        this.progCycle.x = progressBg.width/2;
        this.progCycle.y = progressBg.height/2;
        this.progCycle.setPercentage(0);
        progressBg.addChild(this.progCycle,1);
        this.recordBtn = new RecordAudioButton(this.yuyinBg,this.progCycle,"res/ui/diantuo/huatong.png","res/ui/diantuo/huatong.png");
        this.recordBtn.x = this.btn_yuyin.width/2;
        this.recordBtn.y = this.btn_yuyin.height/2;
        this.btn_yuyin.addChild(this.recordBtn,1);
        this.btn_yuyin.setOpacity(0);
        this.recordBtn.setOpacity(100);
        this.recordBtn.setBright(IMSdkUtil.isReady());

        this.yuyinBg.setVisible(false);
    },

    /**
     * sdk调用，当语音使用状态改变
     */
    onRadioReady:function(event){
        var useful = event.getUserData();
        this.recordBtn.setBright(useful);
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_invite_wx){
                this.onInvite();
            }else if(sender == this.btn_invite_qyq){
                var inviteType = 0
                if(NSBRoomModel.privateRoom == 1) inviteType = 2
                var pop = new PyqInviteListPop(inviteType);
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_qyq_back){
                var pop = new PyqHall();
                pop.setBackBtnType(2);
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_chat){
                var pop = new ChatPop();
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_ready){
                sySocket.sendComReqMsg(4);
            }else if(sender == this.btn_show_defen){
                this.showScoreLayer(1);
            }else if(sender == this.btn_paixu){
                SyEventManager.dispatchEvent("NSB_Sort_Card");
            }else if(sender == this.btn_wushik){
                SyEventManager.dispatchEvent("NSB_Get_WuShiK");
            }else if(sender == this.btn_zhadan){
                SyEventManager.dispatchEvent("NSB_Get_ZhaDan");
            }else if(sender == this.btn_tonghuashun){
                SyEventManager.dispatchEvent("NSB_Get_TongHuaShun");
            }else if(sender == this.btn_mingpai){
                sySocket.sendComReqMsg(4200);
            }


        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    /**
     * 邀请
     */
    onInvite:function(){
        var wanfa = "牛十别";
        var queZi = NSBRoomModel.renshu + "缺"+(NSBRoomModel.renshu - NSBRoomModel.players.length);
        var obj={};
        obj.tableId=NSBRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+NSBRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
        obj.title=wanfa+'  房号['+NSBRoomModel.tableId+"] "+queZi;

        var youxiName = "牛十别";
        if(NSBRoomModel.tableType == 1){
            youxiName = "[亲友圈]牛十别"
        }
        obj.description=csvhelper.strFormat("{0} {1}局",youxiName,NSBRoomModel.totalBurCount);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    getName:function(){
        return "NSB_ROOM";
    },

    update:function(){
        if(NSBRoomModel.pauseValue == 0 && this.tableMsgArr.length > 0){
            var event = this.tableMsgArr.shift();
            this.handleTableData(event.eventType,event.getUserData());
        }
    },

    onGetTableData:function(event){
        this.tableMsgArr.push(event);
    },

    handleTableData:function(type,data){
        var date = new Date();
        cc.log("=============handleTableData=============",type,date.getSeconds(),date.getMilliseconds());
        var state = NSBRoomModel.handleTableData(type,data);
        if(!state)return;

        if(type == NSBTabelType.CreateTable){
            this.tableMsgArr = [];
            sy.scene.hideLoading();
            this.removeScoreLayer();
            this.updateRoomInfo();
            this.updateRoomBtnState();
            this.updateReadyBtnState();
            this.updateRoomTip();
            this.setRuleTip();
            this.setTeamScore();

            this.setChatBtnOpacity();

            if(NSBRoomModel.nowBurCount == 1
                && NSBRoomModel.remain == 0 && !this.isShowGps){
                this.isShowGps = true;
                this.onClickGpsBtn();
            }

        }else if(type == NSBTabelType.JoinTable){
            this.updateRoomBtnState();

            this.onClickGpsBtn();

        }else if(type == NSBTabelType.ExitTable){
            this.updateRoomBtnState();
        }else if(type == NSBTabelType.ChangeState){
            this.updateReadyBtnState();
        }else if(type == NSBTabelType.DealCard){
            this.updateRoomTip();

            if(data.dealDice > 0){
                this.showMoDuiCard(data.dealDice);
            }

        }else if(type == NSBTabelType.PlayCard){
            this.updateRoomTip();
            this.setTeamScore();
        }else if(type == NSBTabelType.OnOver){
            var SmallResultLayer = NSBRoomModel.getSamllResultLayer();
            if(data.isBreak){

            }else{
                var layer = new SmallResultLayer(data);
                PopupManager.addPopup(layer);
            }
        }else if(type == NSBTabelType.MingPai){
            this.setChatBtnOpacity();
        }


        this.playerLayer.handleTableData(type,data);
        this.cardLayer.handleTableData(type,data);
        this.optBtnLayer.handleTableData(type,data);

        this.soundHandle.handleTableData(type,data);

    },

    setTeamScore:function(){
        var my_team_id = 0;
        var scoreData = {};

        var players = NSBRoomModel.players;
        for(var i = 0;i<players.length;++i){
            var p = players[i];
            scoreData[p.ext[6]] = p.ext[4];
            if(p.seat == NSBRoomModel.mySeat){
                my_team_id = p.ext[6];
            }
        }

        for(var k in scoreData){
            if(k == my_team_id){
                this.label_team_my.setString(scoreData[k] || 0);
            }else{
                this.label_team_other.setString(scoreData[k] || 0);
            }
        }
    },

    showMoDuiCard:function(id){
        if(!id)return;

        var card = new NSBCard(id);
        card.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 100);
        card.setScale(0);
        this.addChild(card,20);

        var action = cc.sequence(cc.scaleTo(0.2,1),cc.delayTime(0.8),cc.callFunc(function(node){
            node.removeFromParent(true)
        }));

        card.runAction(action);
    },

    showScoreLayer:function(type){
        this.removeScoreLayer();

        var layer = new NSBShowScoreLayer(type);
        layer.setName("ScoreLayer");
        this.addChild(layer,20);
    },

    removeScoreLayer:function(){
        var layer = this.getChildByName("ScoreLayer");
        layer && layer.removeFromParent(true);
    },

    setRuleTip:function(){
        var str = ClubRecallDetailModel.getNSBWanfa(NSBRoomModel.intParams,true);
        this.label_rule_tip.setString(str);
    },

    updateRoomInfo:function(){
        this.label_room_id.setString("房号:" + NSBRoomModel.tableId);
        var jushuStr = "局数:" + NSBRoomModel.nowBurCount;
        if(NSBRoomModel.totalBurCount < 100){
            jushuStr += ("/" + NSBRoomModel.totalBurCount);
        }
        this.label_jushu.setString(jushuStr);
        this.label_room_name.setString(NSBRoomModel.roomName || "牛十别");

        if(!NSBRoomModel.replay){
            this.btn_chat.setLocalZOrder(2);
            this.btn_yuyin.setLocalZOrder(2);
        }
    },

    //本地座位为1的玩家如果明牌了，吧按钮透明化处理，可以看到下面的牌
    setChatBtnOpacity:function(){
        var opacity = 255;

        var seat = NSBRoomModel.getSeatWithSeq(2);
        var p = NSBRoomModel.getPlayerDataByItem("seat",seat);

        if(p && p.shiZhongCard == 1)opacity = 100;

        this.btn_chat.setOpacity(opacity);
        this.recordBtn.prog.setOpacity(opacity);
    },

    updateRoomBtnState:function(){
        this.roomBtnContent.setVisible(NSBRoomModel.players.length < NSBRoomModel.renshu);
    },

    updateReadyBtnState:function(){
        var isShowReadyBtn = false;
        var players = NSBRoomModel.players;
        for(var i = 0;i<players.length;++i){
            if(players[i].userId == PlayerModel.userId && players[i].status == 0){
                isShowReadyBtn = true;
            }
        }
        this.btn_ready.setVisible(isShowReadyBtn);
    },

    updateRoomTip:function(){
        if(NSBRoomModel.remain == 2){
            this.paiZhuoFen.setVisible(true);
            this.setPaiZhuoFen(NSBRoomModel.ext[3] || 0);
        }else{
            this.paiZhuoFen.setVisible(false);
        }
    },
});