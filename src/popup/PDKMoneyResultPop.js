
/**
 * Created by zhoufan on 2016/6/30.
 */
var PDKMoneyResultPop = BasePopup.extend({

    ctor: function (data) {
        this.data = data;
        this._super("res/pdkMoneyResultPop.json");
    },

    selfRender: function () {
        //this.qiepaiImg = this.getWidget("Image_21");
        //this.qiepaiImg.visible = ClosingInfoModel.cutCard.length>0;
        //this.data.sort(this.sortByPoint);
        this.moneyModeId = ClosingInfoModel.ext[6];
        this.moneyBeilv = ClosingInfoModel.ext[7];
        this.moneyCost = ClosingInfoModel.ext[8];

        if(this.data[0].userId != PlayerModel.userId){
            //this.getWidget("main2").loadTexture("res/ui/anhua/anhua_img_061.png");
            //this.getWidget("Image_178").loadTexture("res/ui/phz/img_06.png");
            AudioManager.play("res/audio/common/audio_lose.mp3");
        }else{
            AudioManager.play("res/audio/common/audio_win.mp3");
        }

        //根据我的位置控制显示顺序
        var mySeat = 0;
        for(var indexOfPlayer = 0 ; indexOfPlayer < this.data.length ; indexOfPlayer ++){
            if(this.data[indexOfPlayer].userId == PlayerModel.userId){
                mySeat = this.data[indexOfPlayer].seat;
            }
        }
        var upSeat = this.getUpSeat(mySeat);
        var nextSeat = this.getNextSeat(mySeat);

        var showSeq = [];
        if(PDKRoomModel.renshu == 3){
            showSeq.push(mySeat);
            showSeq.push(upSeat);
            showSeq.push(nextSeat);
        }else{
            showSeq.push(mySeat);
            if(mySeat == 1){
                showSeq.push(2);
            }else if(mySeat == 2){
                showSeq.push(1);
            }
        }


        cc.log("PDKRoomModel.renshu...this.data" , PDKRoomModel.renshu , this.data.length);
        for(var indexShow = 0 ; indexShow < PDKRoomModel.renshu ; indexShow ++){
            var showSeat = showSeq[indexShow];

            for(var indexOfData = 0 ; indexOfData < PDKRoomModel.renshu ; indexOfData ++){
                cc.log("this.data[indexOfData].seat" , this.data[indexOfData].seat , showSeat);
                if(this.data[indexOfData].seat == showSeat){
                    this.showPlayerMsg(this.data[indexOfData] , indexShow + 1);
                }
            }


        }

        if(PDKRoomModel.renshu == 2){
            this.getWidget("player3").visible = false;
        }
        for(var i = 0 ; i < 3 ; i ++){
            var seq = i+1;
            //this.getWidget("player"+seq).visible = false;
        }
        if (ClosingInfoModel.cutCard.length > 0){
            var pupaiSprite = new cc.Sprite("res/ui/pdk/pdkSmallResult/pupai.png");
            pupaiSprite.x = 300;
            pupaiSprite.y = 220;
            this.root.addChild(pupaiSprite);
            var isHongshi = PDKRoomModel.isHongShi();
            for(var j=0;j<ClosingInfoModel.cutCard.length;j++){
                var cardList =  PDKAI.getCardDef(ClosingInfoModel.cutCard[j]);
                var card = new PDKBigCard(cardList);
                card.scale=0.4;
                card.x = 360+j*25;
                card.y = 220;
                this.root.addChild(card);
                if (isHongshi && cardList.n == 10 && cardList.t == 3){
                    var sprite = new cc.Sprite("res/ui/pdk/pdkRoom/img_xiabiao.png");
                    sprite.x = 20;
                    sprite.y = 18;
                    card.addChild(sprite);
                }
            }
        }
        this.issent = false;
        this.addCustomEvent(SyEvent.SETTLEMENT_SUCCESS,this,this.onSettlement);
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.changeSrvOver);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);
        var btnok = this.getWidget("btnok");
        var btClose = this.getWidget("close_btn");

        UITools.addClickEvent(btnok,this,this.onContinue);
        UITools.addClickEvent(btClose , this , this.onToHome);

        var btnshare = this.getWidget("btnshare");
        if (btnshare) {
            UITools.addClickEvent(btnshare, this, this.onToHome);
        }
        //this.showIcon();
        //this.Label_43 = this.getWidget("Label_43");
        //this.Label_43.visible = false;
        this.dt = 0;
        this.start = 3;
        if(PDKRoomModel.isGameSite>0)
            this.scheduleUpdate();

        //显示局数
        this.getWidget("Label_curRound").setString(ClosingInfoModel.ext[4]);
        this.getWidget("Label_MaxRound").setString("/"+PDKRoomModel.totalBurCount+"局");

        //显示金币场
        this.getWidget("lbBeilv").setString("娱乐场");
        this.getWidget("lbMoneyStr").setString(this.moneyCost);
        this.getWidget("lbBeilvStr").setString(this.moneyBeilv + "倍");
        this.getWidget("lbTime").setString(ClosingInfoModel.ext[2]);


        //俱乐部房间图片标识
        var tableType = 0;
        tableType = ClosingInfoModel.ext[5];
        this.Image_jlbRoom = this.getWidget("Image_jlbRoom");
        this.Image_jlbRoom.visible = false;
        if (PDKRoomModel.isClubRoom(tableType)){
            this.Image_jlbRoom.visible = true;
        }
    },


    showPlayerMsg:function(userData , showSeqp){

        var seq = showSeqp;
        var user = userData;
        cc.log("显示玩家信息..." , user.name);
        this.getWidget("name"+seq).setString(user.name);
        var fnt = (seq==0) ? "res/font/font_res_huang.fnt" : "res/font/font_res_hui.fnt";
        var l = this.getWidget("p" + seq);
        var label = new cc.LabelBMFont(user.leftCardNum+"",fnt);
        label.x = l.width/2;
        label.y = l.height/2;
        //l.addChild(label);
        var finalPoint = this.getWidget("point"+seq);
        //finalPoint.setString(user.point);

        var fontName =  "res/font/dn_bigResult_font_1.fnt";
        if(user.point >= 0){
            fontName =  "res/font/dn_bigResult_font_1.fnt";
        }else{
            fontName =  "res/font/dn_bigResult_font_2.fnt";
        }

        if(user.userId == PlayerModel.userId){//溢出分数处理
            user.point = user.point - user.ext[5];
            cc.log("处理溢出分数：" ,user.point , user.ext[5] );
            //显示溢出的标签
            this.getWidget("shagnxianSign" + seq).visible = (user.ext[5] > 0);
        }

        label = new cc.LabelBMFont(user.point + "", fontName);
        finalPoint.addChild(label);

        //显示奖券
        if (user.ext[9] && parseInt(user.ext[9]) > 0 && PlayerModel.userId == user.userId){
            label.y = label.y + 15;

            var img = "res/ui/dtz/giftExChangePop/img_3.png";
            var spriteBg = new cc.Sprite(img);
            spriteBg.x = 75;
            spriteBg.y = -35;
            label.addChild(spriteBg);

            var defaultimg = "res/ui/dtz/giftExChangePop/img_15.png";
            var sprite = new cc.Sprite(defaultimg);
            sprite.y = 15;
            sprite.x = 0;
            spriteBg.addChild(sprite);

            var lqlabel = new cc.LabelTTF("+"+user.ext[9], "Arial", 28);
            lqlabel.y = 15;
            lqlabel.x = 50;
            lqlabel.setColor(cc.color(250,55,77));
            spriteBg.addChild(lqlabel);
        }


        this.getWidget("sy"+seq).setString("剩余:"+user.leftCardNum);
        if(user.boom==0){
            this.getWidget("bm"+seq).visible = false;
        }else{
            this.getWidget("bomb"+seq).setString("x"+user.boom);
        }

        this.getWidget("qg"+seq).visible = (user.leftCardNum>=AI.MAX_CARD);

        var icon = this.getWidget("icon"+seq);
        var defaultimg = "res/ui/dtz/dtzCom/default_m.png";

        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);

        var sprite = new cc.Sprite(defaultimg);
        sprite.setScale(0.7);
        sprite.x = 40;
        sprite.y = 22;
        icon.addChild(sprite,5,345);
        //user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.x = 44;
                    sprite.y = 22;
                }
            });
        }

        var tstrAllCards = user.ext[0].substring(1 , user.ext[0].length - 1);
        cc.log("strAllCards..." , user.ext[0] , tstrAllCards);

        var allCards = tstrAllCards.split(',');
        cc.log("allCards ..." , allCards , user.ext[0]);
        var ids = user.cards;
        var cardIds = [];   //未打出的牌
        var allcardIds = [];//所有手牌

        //
        for(var index = 0 ; index < allCards.length ; index ++){
            allcardIds.push(AI.getCardDef( parseInt(allCards[index])));
        }

        for(var j = 0 ; j < ids.length ; j ++) {
            cardIds.push(AI.getCardDef(ids[j]));
        }

        this.sortCards(allcardIds);
        var isHongshi = PDKRoomModel.isHongShi();
        for(var j = 0; j < allcardIds.length ; j ++) {
            var card = new DTZBigCard(allcardIds[j] , 2);
            card.setScale(0.5);
            card.anchorX = card.anchorY = 0;
            card.x = 0 + 30 * j;

            if(ArrayUtil.indexOf(ids , allcardIds[j].c) < 0){//是已经打出去的牌
                card.disableAction();
            }
            this.getWidget("p" + seq).addChild(card);
            if (isHongshi && allcardIds[j].n == 10 && allcardIds[j].t == 3){
                var sprite = new cc.Sprite("res/ui/pdk/pdkRoom/img_xiabiao.png");
                sprite.x = 20;
                sprite.y = 18;
                card.addChild(sprite);
            }
        }

        //显示炸弹分数
        this.getWidget("zdpoint" + seq).setString(user.ext[1] + "");

        //显示玩家ID
        this.getWidget("id" + seq).setString("ID:" + user.userId);

        //显示玩家是否破产
        cc.log("user.ext[]::" , user.ext);
        this.getWidget("pochanSign" + seq).visible = (user.ext[4] == 1);


        //房主标识
        //cc.log("user.userId == ClosingInfoModel.ext[1] ... " , user.userId , ClosingInfoModel.ext[1] )
        //if(user.userId == ClosingInfoModel.ext[1]){
        //    var fangzhu = new cc.Sprite("res/ui/pdk/pdkSmallResult/fangzhu.png");
        //    fangzhu.anchorX = fangzhu.anchorY = 0;
        //    fangzhu.x = -42;
        //    fangzhu.y = -15;
        //    icon.addChild(fangzhu,10);
        //}

    },


    showIcon:function(){
        //this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var url = PlayerModel.icon;
        var defaultimg = "res/ui/pdk/common/default_m.png" ;
        if(!url)
            url = defaultimg;
        if(this._iconUrl == url)
            return;
        this._iconUrl = url;
        var sprite = new cc.Sprite(defaultimg);
        sprite.setScale(1.2)
        var sten = new cc.Sprite("res/ui/dtz/images/img_14_c.png");
        var clipnode = new cc.ClippingNode();
        clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: this.icon.width/2, y: this.icon.height/2,alphaThreshold: 0.8});
        clipnode.addChild(sprite);
        this.icon.addChild(clipnode,5,345);
        if(this._playerVo.icon){
            sprite.x = sprite.y = 0;
            try{
                var self = this;
                cc.loader.loadImg(this._playerVo.icon, {width: 252, height: 252}, function (error, img) {
                    if (!error && (LayerManager.getCurrentLayer()==LayerFactory.ROOM||LayerManager.getCurrentLayer()==LayerFactory.MATCH_ROOM)) {
                        sprite.setTexture(img);
                        sprite.x = 0;
                        sprite.y = 0;
                    }else{
                        self._iconUrl = "";
                    }
                });
            }catch(e){}
        }else{
            //sprite.x = this.icon.width/2;
            //sprite.y = this.icon.height/2;
            //this.icon.addChild(sprite,5,345);
        }
    },

    onSettlement:function(){
        PopupManager.remove(this);
    },

    update:function(dt){
        this.dt += dt;
        if(this.dt >= 1){
            this.dt = 0;
            if(!this.issent){
                this.start--;
                if(this.start <= 0){
                    this.unscheduleUpdate();
                    this.onOk();
                    return;
                }
                this.Label_43.setString(this.start+"秒后自动关闭");
            }
        }
    },

    onOk:function(){

        var data = this.data;
        if(PDKRoomModel.isGameSite>0){
            LayerManager.showLayer(LayerFactory.HOME);
            PopupManager.remove(this);
            PopupManager.removeAll();
            sySocket.sendComReqMsg(201,[],"");
        }else{
            if(PDKRoomModel.nowBurCount == PDKRoomModel.totalBurCount){//最后的结算 PDKRoomModel.totalBurCount
                PopupManager.remove(this);
                var mc = new PDKBigResultPop(data);
                PopupManager.addPopup(mc);
            }else{
                this.issent = true;
                sySocket.sendComReqMsg(3);
            }
        }
    },

    onClose:function(){
        this.issent = true;
        sySocket.sendComReqMsg(3);
        this.unscheduleUpdate();
    },

    sortCards:function(cardids){
        var length = cardids.length;
        cc.log("length ..." , length);
        var s1 = function(c1,c2){
            var n1 = c1.i;
            var n2 = c2.i;
            if(n1 == n2){
                var t1 = c1.t;
                var t2 = c2.t;
                return t2-t1;
            }else{
                return n2-n1;
            }
        }
        cardids.sort(s1);
    },

    getUpSeat:function(seat){

        if(seat == 1){
            return 3;
        }else{
            return seat - 1;
        }

    },

    getNextSeat:function(seat){
        if(seat == 3){
            return 1;
        }else{
            return seat + 1;
        }

    },

    /**
     * 分享战报
     */
    onShare:function(){

    },

    askCheckServer:function(){
        this.isChangingSrv = true;
        var strparams = [];
        var moneyWanfa = 16;
        var modeId = this.moneyModeId;//moneyWanfa * 10 + this.moneyRoomLevel;
        strparams.push("1");
        strparams.push(modeId+"");
        cc.log("金币场请求切服..." , strparams );
        //LayerManager.showLayer(LayerFactory.DTZ_MONEY_LOADING);
        PopupManager.addPopup(new DTZMoneyLoadingPopup(moneyWanfa));
        var self = this;
        setTimeout(function(){
            self.isChangingSrv = false;
            SyEventManager.dispatchEvent(SyEvent.REMOVE_MONEY_LOADING,{});
            sy.scene.hideLoading();
        } , 5000);
        sySocket.sendComReqMsg(29 , [moneyWanfa] , strparams);//先请求后台分配服务器
    },

    onSuc:function(){
        if(this.isChangingSrv){//由切服出发的重连成功才继续进入金币场
            this.doJoinMoneyRoom()
        }
    },

    changeSrvOver:function(){
        cc.log("选服完毕 请求后台加入房间消息 "  , this.isChangingSrv);
        if(this.isChangingSrv){//由切服出发的重连成功才继续进入金币场
            this.doJoinMoneyRoom();
        }
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        if(status==ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            SyEventManager.dispatchEvent(SyEvent.REMOVE_MONEY_LOADING,{});
            FloatLabelUtil.comText("加入金币场失败");
        }else if(status==ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    doJoinMoneyRoom:function(){
        var moneyWanfa = 16;
        var roomTypeValue = moneyWanfa;
        var roomTypeAndLevel = this.moneyModeId;// moneyWanfa * 10 + this.moneyRoomLevel;
        //cc.log("roomTypeValue roomTypeAndLevel" , roomTypeValue,String(roomTypeAndLevel));
        sySocket.sendComReqMsg(2,[parseInt(1) , roomTypeValue],String(roomTypeAndLevel));
        this.isChangingSrv = false;
        LayerManager.showLayer(LayerFactory.HOME);
        PopupManager.remove(this);
        //PopupManager.removeAll();

        //这里不再移除结算页面 一旦请求成功收到Createtable消息会移除所有弹框
    },

    /**
     * 金币场开始下一局
     */
    onContinue:function(){
        this.askCheckServer();
    },

    /**
     * 返回大厅
     */
    onToHome: function () {

        LayerManager.showLayer(LayerFactory.HOME);
        PopupManager.remove(this);
        PopupManager.removeAll();

    }


});
