/**
 * Created by cyp on 2019/6/21.
 */
var YYBSRoomLayer = YYBSBaseRoomLayer.extend({
    tableMsgArr:null,

    ctor:function(){
        this._super();

        this.tableMsgArr = [];

        this.addCustomEvent(SyEvent.GetTableMsg,this,this.onGetTableData);

        this.soundHandle = new YYBSRoomSound();

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

    onTouXiang:function(msg){
        cc.log("===========onTouXiang===========",msg.strParams[0]);
        var data = JSON.parse(msg.strParams[0]);
        var time = msg.params[0];

        var agree_num = 0;
        var my_agree = false;
        var is_refuse = false;
        var refuse_seat = 0;
        for(var i = 0;i<data.length;++i){
            if(data[i].state == 1 || data[i].state == 2) agree_num++;
            if(data[i].seat == YYBSRoomModel.mySeat && data[i].state == 2)my_agree = true;
            if(data[i].state == 3){
                is_refuse = true;
                refuse_seat = data[i].seat;
            }
        }

        if(is_refuse){

            this.touXiangTipLayer && this.touXiangTipLayer.removeFromParent(true);
            this.touXiangTipLayer = null;

            var name = "";
            var p = YYBSRoomModel.getPlayerDataByItem("seat",refuse_seat);
            if(p && p.name)name = p.name;

            FloatLabelUtil.comText("玩家【" + name + "】拒绝投降");

        } else if(agree_num == YYBSRoomModel.renshu){
            this.touXiangTipLayer && this.touXiangTipLayer.removeFromParent(true);
            this.touXiangTipLayer = null;
        }else{
            if(!this.touXiangTipLayer){
                this.touXiangTipLayer = new YYBSTouXiangTipLayer();
                this.addChild(this.touXiangTipLayer,30);
            }

            if(YYBSRoomModel.mySeat == YYBSRoomModel.banker){
                this.touXiangTipLayer.setLayerInfo(1,time);
            }else if(my_agree){
                this.touXiangTipLayer.setLayerInfo(3,time);
            }else if(!my_agree){
                this.touXiangTipLayer.setLayerInfo(2,time);
            }
        }

    },

    initLayer:function(){
        var roomInfoBg = new cc.Scale9Sprite("res/ui/sdh/jiugonga1.png");
        roomInfoBg.setAnchorPoint(0,1);
        roomInfoBg.setPosition(120,cc.winSize.height - 15);
        roomInfoBg.setContentSize(200,100);
        this.addChild(roomInfoBg);

        this.label_room_id = new cc.LabelTTF("房号:123456","Arial",24);
        this.label_room_id.setAnchorPoint(0,0.5);
        this.label_room_id.setPosition(20,roomInfoBg.height - 20);
        roomInfoBg.addChild(this.label_room_id);

        this.label_jushu = new cc.LabelTTF("局数:0/10","Arial",24);
        this.label_jushu.setAnchorPoint(0,0.5);
        this.label_jushu.setPosition(20,this.label_room_id.y - 30);
        roomInfoBg.addChild(this.label_jushu);

        this.label_room_name = new cc.LabelTTF("益阳巴十房间名","",24);
        this.label_room_name.setAnchorPoint(0,0.5);
        this.label_room_name.setPosition(20,this.label_jushu.y - 30);
        roomInfoBg.addChild(this.label_room_name);

        var scoreInfoBg = new cc.Sprite("res/ui/yybs/di1.png");
        scoreInfoBg.setAnchorPoint(1,1);
        scoreInfoBg.setPosition(cc.winSize.width - 130,cc.winSize.height - 15);
        this.addChild(scoreInfoBg);

        this.label_zhu = new cc.LabelTTF("无主","Arial",24);
        this.label_zhu.setColor(cc.color(251,201,66));
        this.label_zhu.setPosition(70,scoreInfoBg.height - 18);
        scoreInfoBg.addChild(this.label_zhu,1);

        this.label_jiaofen = new cc.LabelTTF("80","Arial",24);
        this.label_jiaofen.setColor(cc.color(251,201,66));
        this.label_jiaofen.setPosition(200,scoreInfoBg.height - 18);
        scoreInfoBg.addChild(this.label_jiaofen,1);

        this.label_defen = new cc.LabelTTF("10","Arial",24);
        this.label_defen.setColor(cc.color(251,201,66));
        this.label_defen.setPosition(310,scoreInfoBg.height - 18);
        scoreInfoBg.addChild(this.label_defen,1);

        this.listview_defen = new ccui.ListView();
        this.listview_defen.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this.listview_defen.setContentSize(336,48);
        this.listview_defen.setPosition(7,5);
        this.listview_defen.setItemsMargin(5);
        scoreInfoBg.addChild(this.listview_defen,1);

        this.label_rule_tip = new ccui.Text("","",26);
        this.label_rule_tip.setTextAreaSize(cc.size(500,0));
        this.label_rule_tip.setFontName("res/font/bjdmj/fzcy.TTF");
        this.label_rule_tip.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.label_rule_tip.setOpacity(100);
        this.label_rule_tip.setColor(cc.color(0,0,0));
        this.label_rule_tip.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 180);
        this.addChild(this.label_rule_tip);

        this.spr_tip = new cc.Sprite("res/ui/sdh/other_jiaofen.png");
        this.spr_tip.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.spr_tip.setVisible(false);
        this.addChild(this.spr_tip);

        var btn_bg = new cc.Scale9Sprite("res/ui/sdh/image_xiadi.png");
        btn_bg.setContentSize(cc.winSize.width,btn_bg.height);
        btn_bg.setAnchorPoint(0.5,0);
        btn_bg.setPosition(cc.winSize.width/2,0);
        this.addChild(btn_bg);

    },

    addRoomTitle:function(){
        var spr = new cc.Sprite("res/ui/yybs/title_yybs.png");
        spr.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 90);
        this.addChild(spr);
    },

    addBottomBtn:function(){
        var img = "res/ui/sdh/liaotian.png";
        this.btn_chat = new ccui.Button(img,img);
        this.btn_chat.setPosition(cc.winSize.width - 80,33);
        this.addChild(this.btn_chat,2);

        img = "res/ui/sdh/yuyin.png";
        this.btn_yuyin = new ccui.Button(img,img);
        this.btn_yuyin.setPosition(this.btn_chat.x - 160,this.btn_chat.y);
        this.addChild(this.btn_yuyin,2);

        img = "res/ui/sdh/shangyilun.png";
        this.btn_card_record = new ccui.Button(img,img,"res/ui/sdh/shangyilun2.png");
        this.btn_card_record.setPosition(this.btn_yuyin.x - 160,this.btn_chat.y);
        this.addChild(this.btn_card_record,2);

        img = "res/ui/sdh/dipai.png";
        this.btn_dipai = new ccui.Button(img,img,"res/ui/sdh/dipai1.png");
        this.btn_dipai.setPosition(this.btn_card_record.x - 160,this.btn_chat.y);
        this.addChild(this.btn_dipai,2);

        this.btn_chat.addTouchEventListener(this.onClickBtn,this);
        this.btn_yuyin.addTouchEventListener(this.onClickBtn,this);
        this.btn_card_record.addTouchEventListener(this.onClickBtn,this);
        this.btn_dipai.addTouchEventListener(this.onClickDipai,this);

        if(BaseRoomModel.isBanVoiceAndProps()){
            this.btn_yuyin.setVisible(false);
            this.btn_dipai.setPositionX(this.btn_card_record.x);
            this.btn_card_record.setPositionX(this.btn_yuyin.x);
        }
    },

    addRoomLayer:function(){

        this.addChild(this.playerLayer = new YYBSPlayerLayer(),2);
        this.addChild(this.cardLayer = new YYBSCardLayer(),1);
        this.addChild(this.optBtnLayer = new YYBSOptBtnLayer(),10);
        this.addChild(this.jiaoFenBtnLayer = new YYBSJiaoFenBtnLayer(),9);
        this.addChild(this.selectZhuLayer = new YYBSSelectZhuLayer(),11);

    },

    addRoomBtn:function(){
        var isQyqRoom = YYBSRoomModel.tableType == 1;

        var img_wx = "res/ui/sdh/weixinyaoqing.png";
        if(isQyqRoom)img_wx = "res/ui/bjdmj/wx_invite.png";
        var img_qyq = "res/ui/bjdmj/qyq_invite.png";
        var img_back = "res/ui/bjdmj/back_qyq_hall.png";

        this.roomBtnContent = new cc.Node();
        this.roomBtnContent.setPosition(cc.winSize.width/2,cc.winSize.height/2 - 30);
        this.addChild(this.roomBtnContent);

        var btnArr = [];

        this.btn_invite_wx = new ccui.Button(img_wx,img_wx);
        this.roomBtnContent.addChild(this.btn_invite_wx);
        btnArr.push(this.btn_invite_wx);

        if(isQyqRoom){
            if(ClickClubModel.getIsForbidInvite()){
                if(YYBSRoomModel.privateRoom == 1){
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

        var img_ready = "res/ui/sdh/btn_ready.png";
        this.btn_ready = new ccui.Button(img_ready,img_ready);
        this.btn_ready.setPosition(cc.winSize.width/2,200);
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
        this.recordBtn = new RecordAudioButton(this.yuyinBg,this.progCycle,"res/ui/sdh/yuyin.png","res/ui/sdh/yuyin.png");
        this.recordBtn.x = this.btn_yuyin.width/2;
        this.recordBtn.y = this.btn_yuyin.height/2;
        this.btn_yuyin.addChild(this.recordBtn,1);
        this.btn_yuyin.setOpacity(0);
        this.recordBtn.setOpacity(150);
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
                if(YYBSRoomModel.privateRoom == 1) inviteType = 2
                var pop = new PyqInviteListPop(inviteType);
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_qyq_back){
                var pop = new PyqHall();
                pop.setBackBtnType(2);
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_card_record){
                var layer = new YYBSCardRecordLayer();
                this.addChild(layer,20);
            }else if(sender == this.btn_chat){
                var pop = new ChatPop();
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_ready){
                sySocket.sendComReqMsg(4);
            }


        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClickDipai:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);


            var num = YYBSRoomModel.getDiPaiNum();
            var cards = [];
            for(var i = 0;i<num;++i)cards.push(0);

            if(YYBSRoomModel.replay){

                if(YYBSRoomModel.remain < 4){
                    cards = YYBSReplayMgr.diPaiArr1;
                }else{
                    cards = YYBSReplayMgr.diPaiArr2;
                }

            }else{
                var p = YYBSRoomModel.getPlayerDataByItem("seat",YYBSRoomModel.mySeat);
                if(p && p.moldIds.length > 0){
                    cards = p.moldIds;
                }
            }

            this.showDipai(true,cards);

        }else if(type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
            this.showDipai(false);
        }
    },

    showDipai:function(isShow,data){
        var bg = this.getChildByName("dipai_bg");
        if(isShow){
            var offsetX = 80;
            if(!bg){
                bg = new cc.Scale9Sprite("res/ui/bjdmj/popup/phoneLogin/kuang1.png");
                bg.setContentSize(data.length * offsetX + 40,150);
                bg.setPosition(cc.winSize.width/2,470);
                bg.setName("dipai_bg");
                this.addChild(bg,5);
            }
            bg.setVisible(true);

            bg.removeAllChildren(true);
            for(var i = 0;i<data.length;++i){
                var card = new YYBSCard(data[i]);
                card.setScale(0.5);
                card.setPosition(bg.width/2-(data.length -1)/2*offsetX + offsetX*i,bg.height/2);
                bg.addChild(card,1);
            }

        }else{
            bg && bg.setVisible(false);
        }
    },

    showDefenPai:function(type,data){
        if(type == 0 || type == 1){
            this.listview_defen.removeAllChildren();
        }

        if(type == 1 || type == 2){
            for(var i = 0;i<data.length;++i){
                var card = new ccui.ImageView("res/ui/sdh/smallCard/s_card_" + data[i] + ".png");
                card.ignoreContentAdaptWithSize(false);
                card.setContentSize(card.width*0.45,card.height*0.45);
                this.listview_defen.pushBackCustomItem(card);
            }
        }

        this.listview_defen.jumpToRight();
    },

    showKoudi:function(data){
        var node = this.getChildByName("koudi_node");
        node && node.removeFromParent(true);

        if(!data)return;

        node = new cc.Node();
        node.setName("koudi_node");
        node.setPosition(cc.winSize.width/2,470);
        this.addChild(node,20);

        var label = new cc.LabelTTF("抠底","Arial",40);
        label.setPosition(0,110);
        label.setColor(cc.color.YELLOW);
        node.addChild(label,1);

        var offsetX = 80;
        var bg = new cc.Scale9Sprite("res/ui/bjdmj/popup/phoneLogin/kuang1.png");
        bg.setContentSize(data.length * offsetX + 40, 150);
        node.addChild(bg);


        for(var i = 0;i<data.length;++i){
            var card = new YYBSCard(data[i]);
            card.setScale(0.5);
            card.setColor(cc.color(80,80,80));
            card.setPosition(bg.width/2,bg.height/2);
            bg.addChild(card,1);

            if(YYBSRoomModel.isFenPai(data[i])){
                card.setColor(cc.color.WHITE);
            }
            var action = cc.moveTo(0.3,bg.width/2-(data.length -1)/2*offsetX + offsetX*i,bg.height/2);
            card.runAction(action);
        }

        YYBSRoomModel.pauseMsg();

        setTimeout(function(){
            YYBSRoomModel.removeOnePause();
        },3000);

    },

    /**
     * 邀请
     */
    onInvite:function(){
        var wanfa = "益阳巴十";
        var queZi = YYBSRoomModel.renshu + "缺"+(YYBSRoomModel.renshu - YYBSRoomModel.players.length);
        var obj={};
        obj.tableId=YYBSRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+YYBSRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
        obj.title=wanfa+'  房号['+YYBSRoomModel.tableId+"] "+queZi;

        var youxiName = "益阳巴十";
        if(YYBSRoomModel.tableType == 1){
            youxiName = "[亲友圈]益阳巴十"
        }
        obj.description=csvhelper.strFormat("{0} {1}局",youxiName,YYBSRoomModel.totalBurCount);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    getName:function(){
        return "YYBS_ROOM";
    },

    update:function(){
        if(YYBSRoomModel.pauseValue == 0 && this.tableMsgArr.length > 0){
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
        var state = YYBSRoomModel.handleTableData(type,data);
        if(!state)return;

        if(type == YYBSTabelType.CreateTable){
            this.tableMsgArr = [];
            sy.scene.hideLoading();
            this.updateRoomInfo();
            this.updateRoomBtnState();
            this.updateReadyBtnState();
            this.updateRoomTip();
            this.updateDiPaiBtnState();
            this.updateRecordBtnState();
            this.showKoudi(false);
            this.setRuleTip();

            if(YYBSRoomModel.nowBurCount == 1
                && YYBSRoomModel.remain == 0 && !this.isShowGps){
                this.isShowGps = true;
                this.onClickGpsBtn();
            }

        }else if(type == YYBSTabelType.JoinTable){
            this.updateRoomBtnState();

            this.onClickGpsBtn();

        }else if(type == YYBSTabelType.ExitTable){
            this.updateRoomBtnState();
        }else if(type == YYBSTabelType.ChangeState){
            this.updateReadyBtnState();
        }else if(type == YYBSTabelType.DealCard){
            this.updateRoomTip();
            this.updateDiPaiBtnState();
            this.showKoudi(false);
        }else if(type == YYBSTabelType.JiaoFen){

            this.label_jiaofen.setString(YYBSRoomModel.ext[19] || 0);

        }else if(type == YYBSTabelType.DingZhuang){
            this.updateRoomTip();
        }else if(type == YYBSTabelType.XuanZhu){
            this.updateRoomInfo();
            this.updateRoomTip();
        }else if(type == YYBSTabelType.PlayCard){
            this.updateRoomTip();
            this.showDefenPai(2,data.scoreCard || []);
            this.label_defen.setString(YYBSRoomModel.ext[5] || 0);

            if(data.cardType == 100){//埋牌刷新底牌按钮
                this.updateDiPaiBtnState();
            }
            if(data.cardType == 200){//抠底显示底牌
                this.showKoudi(data.cardIds);
            }

        }else if(type == YYBSTabelType.OnOver){
            var SmallResultLayer = YYBSRoomModel.getSamllResultLayer();
            //var BigResultLayer = YYBSRoomModel.getBigResultLayer();
            if(data.isBreak){
                //PopupManager.removeAll();
                //var layer = new BigResultLayer(data);
                //PopupManager.addPopup(layer);
            }else{
                var layer = new SmallResultLayer(data);
                PopupManager.addPopup(layer);
            }
        }else if(type == YYBSTabelType.TouXiang){
            this.onTouXiang(data);
        }


        this.playerLayer.handleTableData(type,data);
        this.cardLayer.handleTableData(type,data);
        this.optBtnLayer.handleTableData(type,data);
        this.jiaoFenBtnLayer.handleTableData(type,data);
        this.selectZhuLayer.handleTableData(type,data);

        this.soundHandle.handleTableData(type,data);

    },

    setRuleTip:function(){
        var str = ClubRecallDetailModel.getYYBSWanfa(YYBSRoomModel.intParams,true);
        this.label_rule_tip.setString(str);
    },

    updateRoomInfo:function(){
        this.label_room_id.setString("房号:" + YYBSRoomModel.tableId);
        this.label_jushu.setString("局数:" + YYBSRoomModel.nowBurCount + "/" + YYBSRoomModel.totalBurCount);
        this.label_room_name.setString(YYBSRoomModel.roomName || "益阳巴十");

        var zhuStr = ["无主","方块","梅花","红桃","黑桃"];
        this.label_zhu.setString(zhuStr[YYBSRoomModel.ext[2]] || "");
        this.label_jiaofen.setString(YYBSRoomModel.ext[19] || 0);
        this.label_defen.setString(YYBSRoomModel.ext[5] || 0);
        this.showDefenPai(1,YYBSRoomModel.scoreCard || []);
    },

    updateDiPaiBtnState:function(){
        var canClick = (YYBSRoomModel.remain == 4 && YYBSRoomModel.banker == YYBSRoomModel.mySeat);

        if(YYBSRoomModel.replay){
            canClick = true;
            this.btn_dipai.setLocalZOrder(101);
        }


        this.btn_dipai.setBright(canClick);
        this.btn_dipai.setTouchEnabled(canClick);
    },

    updateRecordBtnState:function(){
        var canClick = true;

        //未开启允许查牌
        if(!YYBSRoomModel.intParams[5])canClick = false;


        this.btn_card_record.setBright(canClick);
        this.btn_card_record.setTouchEnabled(canClick);
    },

    updateRoomBtnState:function(){
        this.roomBtnContent.setVisible(YYBSRoomModel.players.length < YYBSRoomModel.renshu);
    },

    updateReadyBtnState:function(){
        var isShowReadyBtn = false;
        var players = YYBSRoomModel.players;
        for(var i = 0;i<players.length;++i){
            if(players[i].userId == PlayerModel.userId && players[i].status == 0){
                isShowReadyBtn = true;
            }
        }
        this.btn_ready.setVisible(isShowReadyBtn);
    },

    updateRoomTip:function(){
        var img = "";
        if(YYBSRoomModel.nextSeat != YYBSRoomModel.mySeat){
            if(YYBSRoomModel.remain == 1 && YYBSRoomModel.qzCards.length > 0)img = "res/ui/yybs/txt_wait_fz.png";
            if(YYBSRoomModel.remain == 2)img = "res/ui/sdh/other_xuanzhu.png";
            if(YYBSRoomModel.remain == 3)img = "res/ui/sdh/other_maipai.png";
        }

        if(img){
            this.spr_tip.setVisible(true);
            this.spr_tip.initWithFile(img);
        }else{
            this.spr_tip.setVisible(false);
        }
    },
});