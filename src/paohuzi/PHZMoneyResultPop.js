/**
 * Created by zhoufan on 2016/11/29.
 */
// var PHZSmallResultCell = ccui.Widget.extend({
//     ctor:function(data){
//         this._super();
//         var action = data.action;
//         var cards = data.cards;
//         var huxi = data.huxi;
//         this.anchorX=0;
//         this.anchorY=0;
//         this.setContentSize(32,260);
//         if(action!=0){
//             if(action==10)
//                 action=3;
//             var header = new cc.Sprite("res/ui/phz/act"+action+".png");
//             header.x = 21;
//             header.y = 240;
//             this.addChild(header);
//         }
// 		var zorder = cards.length;
//         for(var i=0;i<cards.length;i++){
// 			zorder--;
//             var vo = PHZAI.getPHZDef(cards[i]);
//             if(action==4 && i>0)
//                 vo.a = 1;
//             if(action==3 && i>0)
//                 vo.a = 1;
// 			var ishu = false;
// 			if(cards[i]==ClosingInfoModel.huCard){
// 				ishu = true;
// 			}
// 			vo.ishu = ishu;
//             var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
//             card.x = 6;
//             card.y = 40 + i * 39;
//             this.addChild(card,zorder);

//         }
//         var label = UICtor.cLabel(huxi+"",24,cc.size(32,30),cc.color(128,51,6),1,1);
//         label.x = 21;
//         label.y = 15;
//         this.addChild(label);
//     }
// });

var PHZMoneyResultPop=BasePopup.extend({
	pointInfo:null,
	isRePlay:null,
    ctor: function (data,isRePlay) {
        this.data = data;
        this.isRePlay = isRePlay;
        this._super("res/phzMoneyResultPop.json");
    },

    selfRender: function () {
        var isHuang = false;
		this.winUserId = 0;
		this.data.sort(function (user1 , user2){
			var point1 = parseInt(user1.point);
			var point2 = parseInt(user2.point);
			return  point1 < point2;
		});
		var myPoint = 0;
		for(var i=0;i<this.data.length;i++){
			if(this.data[i].seat == PHZRoomModel.mySeat){
				myPoint = this.data[i].point;
			}
		}
		var Image_84 = this.getWidget("Image_84");
		var imgUrl = myPoint > 0 ? "res/ui/phz/phzSmallResult/image_win.png" : "res/ui/phz/phzSmallResult/image_lose.png";
		Image_84.loadTexture(imgUrl);

        if(ClosingInfoModel.ext[3] == PHZGameTypeModel.SYBP || ClosingInfoModel.ext[3] == 34  || ClosingInfoModel.ext[3] == 36 || ClosingInfoModel.ext[3] == 38){
        	if(ClosingInfoModel.huSeat){
        	}else{
        		isHuang = true;
        	}
        }else{
	        for(var i=0;i<this.data.length;i++){
	            if(this.data[i].point>0){
	                break;
	            }else if(this.data[i].point==0){
	                isHuang = true;
	                break;
	            }
	        }
        }
		this.getWidget("Image_HZ").visible = isHuang;

        if(this.data.length==3){
        	this.getWidget("user4").visible = false;
        }
        for(var i=0;i<this.data.length;i++){
        	if(this.isSpecialPHZ()){
        		this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i],this.pointInfo[i] , i);
        	}else {
        		this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i] , "" , i);
        	}
        }
        this.list = this.getWidget("ListView_6");
        var cards = ClosingInfoModel.cards;
        for(var i=0;i<cards.length;i++){
            var cell = new PHZSmallResultCell(cards[i]);
            this.list.pushBackCustomItem(cell);
        }
		var offX = 39;
		var Image_1 = this.getWidget("resultView");
		var leftCards = ClosingInfoModel.leftCards;
		var allLeftCards = ClosingInfoModel.startLeftCards;
		var dipaiHeight = 570;

		var dipaiPanel = this.getWidget("Panel_dipai");
        for(var i=0;i<allLeftCards.length;i++){ //leftCards
            var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),PHZAI.getPHZDef(allLeftCards[i]));
			card.x = 68 + i * offX;
			if(ArrayUtil.indexOf(leftCards , allLeftCards[i]) >= 0){
			}else{
				card.graySmallCard();
			}
			dipaiPanel.addChild(card);
        }
        if(ClosingInfoModel.huxi>0){
            var huxi = this.getWidget("huxi");
			huxi.setString("胡息:"+ClosingInfoModel.huxi);
        }else{
            this.getWidget("huxi").visible = false;
        }

		/*天胡 +10,地胡 +10,自摸 +10,
		胡牌时只有一张红字，一点朱  翻倍,
		胡牌时有10-12张红字，小红胡  翻倍,
		胡牌时有13张红字或以上,大红胡 +60,
		胡牌时全是黑字，乌胡 +60*/
		//ClosingInfoModel.fanTypes = [1,2,3,4,5,6,7];
		var mingtangList = ["  天胡     +10","  地胡     +10","  自摸     +10",
			"一点朱     x2","小红胡     x2","大红胡     +60","  乌胡     +60"];
		var str = "";
		var tunStr = ""
		if (PHZRoomModel.wanfa == PHZGameTypeModel.SYZP){
			mingtangList = ["  天胡     +10","  地胡     +10","  自摸     +10",
				"一点朱     x2","小红胡     x2","  红胡     x2","  黑胡     x2"];
			if (ClosingInfoModel.tun){
				tunStr = "\n"+"囤数:" + ClosingInfoModel.tun
			}
		}
		if (PHZRoomModel.wanfa == PHZGameTypeModel.LDFPF){
			mingtangList = ["  天胡     +100","  地胡     +100","  自摸     x2",
				"一点朱     x2"," 十红     x2","  十三红     +100","  乌胡     +100",
				"一块扁     x2","海底捞     x2","  20卡     x2","  30卡     +100","  飘胡     +30"
			];
		}
		if (ClosingInfoModel.fanTypes){
			for(var i=0;i<ClosingInfoModel.fanTypes.length;i++) {
				for(var j=0;j<mingtangList.length;j++) {
					if (ClosingInfoModel.fanTypes[i] == j + 1){
						str = str + mingtangList[j] + "\n"
					}
				}
			}
		}

		str = str + tunStr;

		var zimo = this.getWidget("zimo"); //自摸文本
		zimo.setString("" + str);

		this.resultView = this.getWidget("resultView");
		this.roomView = this.getWidget("roomView");

        var renshu = ClosingInfoModel.ext[7];
        if(!this.isRePlay){
        	for(var n=0;n<renshu;n++) {
        		var onePlayerVo = ClosingInfoModel.closingPlayers[n];
        		var oneCards = onePlayerVo.cards;//剩余的牌的id值
        		var cardVo = PHZAI.getVoArray(oneCards);//剩余的牌
        		var zorder = cardVo.length;
        		var result = PHZAI.sortHandsVo(cardVo);
        		for (var i = 0; i < result.length; i++) {
        			var seat = onePlayerVo.seat;
        			var seq = PHZRoomModel.getPlayerSeq("", seat);
        			var cardArray = result[i];
        			for (var j = 0; j < cardArray.length; j++) {
						//cc.log("seq============="+seq)
        				if(seq!=1) {
        				}
        			}
        		}
        	}
        }
        this.Button_2 = this.getWidget("Button_2");
        this.Button_Ready = this.getWidget("btnReady");
        UITools.addClickEvent(this.Button_2,this,this.onOk);
        UITools.addClickEvent(this.Button_Ready,this,this.onOk);
        this.Button_zm = this.getWidget("Button_15");
        this.Button_toResultView = this.getWidget("btnToResultView");
        UITools.addClickEvent(this.Button_zm,this,this.onZhuoMian);
        UITools.addClickEvent(this.Button_toResultView , this, this.onJieSuan);
        this.onJieSuan();
		var btn_jiesan = this.getWidget("btn_jiesan");
		//var btn_share = this.getWidget("btn_share");
		//btn_share.visible = false;
		//UITools.addClickEvent(btn_share,this,this.onShare);
		UITools.addClickEvent(btn_jiesan,this,this.onBreak);


		var btn_handXq = this.getWidget("btn_handXq");
		UITools.addClickEvent(btn_handXq,this,this.onHandCard);

		var Image_40 = this.getWidget("Image_40"); //自摸图片
		Image_40.visible = false;

		this.addCustomEvent(SyEvent.SETTLEMENT_SUCCESS,this,this.onSettlement);
		this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.changeSrvOver);
		this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
		this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);


		var btnok = this.getWidget("btnok");
		var btClose = this.getWidget("close_btn");
		btClose.visible = true;

		UITools.addClickEvent(btnok,this,this.onContinue);
		UITools.addClickEvent(btClose , this , this.onToHome);

		var btnshare = this.getWidget("btnshare");
		if (btnshare) {
			UITools.addClickEvent(btnshare, this, this.onToHome);
		}

		this.moneyModeId = ClosingInfoModel.ext[10];
		this.moneyBeilv = ClosingInfoModel.ext[11];
		this.moneyCost = ClosingInfoModel.ext[12];

		//显示金币场
		this.getWidget("lbBeilv").setString("娱乐场");
		this.getWidget("lbMoneyStr").setString(this.moneyCost);
		this.getWidget("lbBeilvStr").setString(this.moneyBeilv + "倍");
		this.getWidget("lbTime").setString(ClosingInfoModel.ext[2]);

	},
    
    isSpecialPHZ:function(){
    	return (ClosingInfoModel.ext[3] == 38 && ClosingInfoModel.ext[7] == 4)
    },

    refreshSingle:function(widget,user,pointInfo , index){
		cc.log("index..." , index);
		//user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";

    	if(user.isShuXing){
    		if(user.seat == user.isShuXing){
    			ccui.helper.seekWidgetByName(widget,"sx").visible = true;
    		}else{
    			ccui.helper.seekWidgetByName(widget,"sx").visible = false;
    		}
    	}else{
    		ccui.helper.seekWidgetByName(widget,"sx").visible = false;
    	}

        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
		ccui.helper.seekWidgetByName(widget, "uid").setString("UID:" + user.userId);
        var defaultimg = (user.sex == 1) ? "res/ui/dtz/images/default_m.png" : "res/ui/dtz/images/default_w.png";
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale=0.95;
        sprite.x = 40;
        sprite.y = 40;
        widget.addChild(sprite,5,345);
		//sprite.setScale(1.05);
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 75, height: 75}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }

        var point = ccui.helper.seekWidgetByName(widget,"point");

		if (user.totalPoint != null ){
		}

		if (index == 0){
			var nowPoint = this.getWidget("nowPoint");
			nowPoint.setString("");
			if (ClosingInfoModel.fan != null){
				nowPoint.setString("共计:"+ClosingInfoModel.fan);
			}
		}

		var fontName =  "res/font/dn_bigResult_font_1.fnt";
		if(user.point >= 0){
			fontName =  "res/font/dn_bigResult_font_1.fnt";
		}else{
			fontName =  "res/font/dn_bigResult_font_2.fnt";
		}

		if(user.userId == PlayerModel.userId){//溢出分数处理
			user.point = user.point - user.strExt[6];
			cc.log("处理溢出分数：" ,user.point , user.strExt[6] );
			//显示溢出的标签
			ccui.helper.seekWidgetByName(widget,"shagnxianSign").visible = (user.strExt[6] > 0);
			//this.getWidget("shagnxianSign" + seq).visible = (user.strExt[5] > 0);
		}

		var label = new cc.LabelBMFont(user.point + "", fontName);
		label.anchorX = 0;
		label.x = 5;
		label.scale = 0.9;
		point.addChild(label);

		//破产
		ccui.helper.seekWidgetByName(widget,"pochanSign").visible = (user.strExt[5] == 1);

		//显示奖券
		if (user.strExt[7] && parseInt(user.strExt[7]) > 0 && PlayerModel.userId == user.userId){

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

			var lqlabel = new cc.LabelTTF("+"+user.strExt[7], "Arial", 28);
			lqlabel.y = 15;
			lqlabel.x = 50;
			lqlabel.setColor(cc.color(250,55,77));
			spriteBg.addChild(lqlabel);
		}

    },

    onOk:function(){
        if(ClosingInfoModel.isReplay || !LayerManager.isInRoom()){
            PopupManager.remove(this);
            return;
        }
        var data = this.data;
        if(ClosingInfoModel.ext[3] == PHZGameTypeModel.SYZP || ClosingInfoModel.ext[3] == 36 || ClosingInfoModel.ext[3] == 38){
        	if(PHZRoomModel.nowBurCount == PHZRoomModel.totalBurCount){//最后的结算
        		PopupManager.remove(this);
        		var mc = new PHZBigResultPop(data);
        		PopupManager.addPopup(mc);
        		var obj = HongBaoModel.getOneMsg();
        		if(obj){
        			var mc = new HongBaoPop(obj.type,obj.data);
        			PopupManager.addPopup(mc);
        		}
        	}else{
        		sySocket.sendComReqMsg(3);
        	}
        }else{
        	if(ClosingInfoModel.ext[6] == 1){//最后的结算
        		PopupManager.remove(this);
        		var mc = new PHZBigResultPop(data);
        		PopupManager.addPopup(mc);
        		var obj = HongBaoModel.getOneMsg();
        		if(obj){
        			var mc = new HongBaoPop(obj.type,obj.data);
        			PopupManager.addPopup(mc);
        		}
        	}else{
        		sySocket.sendComReqMsg(3);
        	}
        }
    },

	onBreak:function(){
		AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
			sySocket.sendComReqMsg(7);
		},null,2)
	},

	onShare:function(){

	},
    
    onHandCard:function(){
		cc.log("onHandCard ClosingInfoModel.huSeat..." , ClosingInfoModel.huSeat);
    	var mc = new PHZHandCardPop(this.data,ClosingInfoModel.ext[1] , this.winUserId);
    	PopupManager.open(mc,true);
    },
    
    onJieSuan:function(){
		this.resultView.visible = true;
		this.roomView.visible = false;
    },
    
    onZhuoMian:function(){

		this.resultView.visible = false;
		this.roomView.visible = true;

    },

	onSettlement:function(){
		PopupManager.remove(this);
	},

	askCheckServer:function(){
		this.isChangingSrv = true;
		var strparams = [];
		var moneyWanfa = 33;
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
		var moneyWanfa = 33;
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
