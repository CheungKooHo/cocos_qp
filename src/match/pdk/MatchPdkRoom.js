/**
 * Created by zhoufan on 2015/8/22.
 * @class
 * @extend {Room}
 */
var MatchPdkRoom = BaseRoom.extend({//Room
	/** @lends PDKRoom.prototype */

	//----------------------------------------------------------------//
	_cardPanel:null,
	_cardW:140,
	_cardG:60,//65
	/**
	 * {Array.<BigCard>}
	 */
	_cards:[],
	_allCards:[],
	_cCardPattern:null,
	_lastCardPattern:null,
	_lastLetOutSeat:0,
	_touchedCards:null,
	_touchListener:null,
	_startId:null,
	_currentlyMoveId:null,
	_startX:null,
	_touchBeganX:null,
	_isLeft2Right:false,
	_isLeft2RightWithBegan:false,
	_players:null,
	seatSeq:{},
	_letOutButtonTouchable:null,

	//----------------------------------------------------------------//
	_statusMap:null,
	_dt:null,
	_countDown:0,
	_timedt:null,
	matchWaitTime:0,



	ctor:function(){
		this._statusMap = {};
		this._dt = 0;
		this._countDown = 0;
		this._timedt = 0;
		this._loacationDt = 0;

		this.matchWaitTime = 0;//等待比配的时间

		this._super(LayerFactory.MATCH_PDK_ROOM);
		this._letOutButtonTouchable = true;
		this._cards = [];
		this._allCards = [];
		this._touchedCards = [];
		this._players = {};
		this.seatSeq = PDKRoomModel.seatSeq;


	},

	/**
	 * 初始化房间数据
	 */
	initData:function(){
		for(var i=1;i<=3;i++){
			this.getWidget("small"+i).removeAllChildren(true);
			this.getWidget("ybq"+i).visible = false;
		}
		//清空数据
		MatchAwardModel.init(null);
		MatchResultModel.init(null);
		PlayPDKMessageSeq.clean();
		this.seatSeq = PDKRoomModel.seatSeq;
		sy.scene.hideLoading();
		PopupManager.removeClassByPopup(CutCardPop);
		this.Image_40.visible = false;
		this.Image_baodan.visible = false;
		this.playAnimateDt= 0;
		this.isOver = false;

		if(this.labelRand){
			this.labelRand.setString(PDKRoomModel.nowBurCount + "/" + PDKRoomModel.totalBurCount);
		}

		this.beilvLabel.setString("");

		if (PDKRoomModel.getMoneyRoomBeilv()){
			this.beilvLabel.setString(""+PDKRoomModel.getMoneyRoomBeilv());
		}


		this._players = {};
		var players = PDKRoomModel.players;
		for(var i=1;i<=3;i++){
			this.getWidget("player"+i).visible = false;
			this.getWidget("ybq"+i).visible = false;
			this.getWidget("small"+i).removeAllChildren(true);
			if(i>1)
				this.getWidget("bt"+i).visible = false;
		}
		if(this._cards.length>0){//清理掉上一局的牌
			for(var i=0;i<this._cards.length;i++){
				this._cardPanel.removeChild(this._cards[i]);
			}
			this._cards.length=0;
		}
		this._lastCardPattern = null;
		this.btnBreak.visible = this.Button_4.visible = false;

		if(this.countDownLabel){
			this._countDown = PDKRoomModel.getMatchTuoguanTime();
		}
		var isContinue = false;//是否是恢复牌局
		for(var i=0;i<players.length;i++){
			var p = players[i];
			isContinue = (p.handCardIds.length>0 || p.outCardIds.length>0);
			if(isContinue)
				break;
		}

		//比赛场房间改成了发牌消息的时候清掉所有弹框（这里是处理小结算框已经弹出来了，在收到发牌消息前切到后台，在发牌消息发了之后再切回来的情况）
		if(players.length > 0){
			MatchModel.cleanResultRank();
			if(this.overTimeOut >= 0){
				clearTimeout(this.overTimeOut);
			}
			if(PopupManager.hasClassByPopup(MatchPdkSmallResultPop)){
				PopupManager.removeClassByPopup(MatchPdkSmallResultPop);
			}
		}

		for(var i=0;i<players.length;i++){
			var isYbq = false;
			var p = players[i];
			var seq = this.getPlayerSeq(p.userId,PDKRoomModel.mySeat, p.seat);
			var cardPlayer = this._players[p.seat] = new PDKCardPlayer(p,this.root,seq);
			if(!isContinue){
				if(p.status)
					cardPlayer.showStatus(p.status);
			}else{//恢复牌局
				if(p.outCardIds.length>0){//模拟最后一个人出牌
					if(p.userId == PlayerModel.userId && PDKRoomModel.nextSeat== p.seat){
						this._lastCardPattern = null;
					}else{
						var cardTransData = [];
						for(var j=0;j<p.outCardIds.length;j++){
							cardTransData.push(AI.getCardDef(p.outCardIds[j]));
						}
						this._lastCardPattern = AI.filterCards(cardTransData);
						if(p.recover.length >= 4){
							//连对牌型 后台传的连对数值(5)和前段的数值(3)不一致，那前段只在炸弹带牌和三带这类有误差的牌型上做修正类型即可
							if(this._lastCardPattern.type == AI.BOMBWITHCARD || this._lastCardPattern.type == AI.THREE){
								var curCardType = p.recover[3];
								this.fixCardType(curCardType);
							}
						}
					}

					this._lastLetOutSeat = p.seat;
					p.ext[1]+=p.outCardIds.length;
					this.letOutCards(p.outCardIds,p.seat);

					//为什么出牌人的保单状态不考虑？
					if(p.recover.length > 2){
						if(p.recover[1]==1){
							cardPlayer.baoting();
						}
					}

				}else{
					cc.log("p.recover value ..." , p.recover);
					if(p.recover.length>0){//恢复牌局的状态重设
						if(p.recover[0]==0){
							cardPlayer.showStatus(-1);
							if(p.userId == PlayerModel.userId && PDKRoomModel.nextSeat== p.seat){//要不起，轮到我出牌，需要通知后台
								isYbq = true;
								this.sendPlayCardMsg(0,[]);
							}
						}
						if(p.recover[1]==1){
							cc.log("p.recover[1]..." , p.seat , cardPlayer.seq);
							cardPlayer.baoting();
						}

						cardPlayer.leaveOrOnLine(p.recover[2]);
					}
				}
				cardPlayer.showLastCard();
			}
			if(p.userId ==PlayerModel.userId){//自己的状态处理
				if(p.handCardIds.length>0){
					//var ids = [310,210,308,111,211,311,112,412,112,113,207];
					//var cardIds = [];
					//for(var j=0;j<ids.length;j++){
					//	cardIds.push(AI.getCardDef(ids[j]));
					//}
					//p.handCardIds = cardIds;
					this.btnBreak.visible = this.Button_4.visible = (!isYbq && PDKRoomModel.nextSeat==PDKRoomModel.mySeat);
					this._players[PDKRoomModel.mySeat].deal(p.handCardIds);
					this.initCards(p.handCardIds);
				}else{
					//if(p.ext.length>0 && p.ext[0]==1 && p.status==0)
					//	this.Button_qiepai.visible = true;
				}
				if(p.status)
					this.Button_30.visible = false;

			}
		}

		for(var i=0;i<players.length;i++){
			var p = players[i];
			//显示排名
			if(p.userId == PlayerModel.userId){
				//显示预赛还是复赛
				this.lbCoin_0.setString(PDKRoomModel.getMatchInfos(p));
				if(PDKRoomModel.getPlayerIsTuoguan(p)){
					this._players[p.seat].updateTuoguan(true);
					this.bg_CancelTuoguan.visible = true;
				}
				this.rankLabel.setString(""+p.ext[10]+"/"+p.ext[11]);

				//		var rank = new cc.LabelBMFont(p.ext[10]+"/"+p.ext[11],"res/font/res_font_2.fnt");
				//		rank.x = this.Panel_rank.width/2;
				//		rank.y = this.Panel_rank.height/2-1;
				//		this.Panel_rank.addChild(rank,1,123);
			}
		}

		if(isContinue){
			this.showJianTou(PDKRoomModel.nextSeat);
			//this.Button_20.visible = false;
			if(PDKRoomModel.isNextSeatBt()){
				this.Image_baodan.visible = true;
			}
			//this.Image_qiepai.visible = (PDKRoomModel.renshu==2);
		}
		//this.uidText.setString("UID："+PlayerModel.userId);
		this.Button_17.visible = (players.length<PDKRoomModel.renshu);
		//this.Button_20.visible = (PDKRoomModel.nowBurCount==1);
		//this.Label_27.setString(PDKRoomModel.tableId);
		if(this.labelRoomId){
			this.labelRoomId.setString(PDKRoomModel.tableId);
		}
		//IP相同的显示
		if(players.length>1){
			var seats = PDKRoomModel.isIpSame();
			if(seats.length>0){
				for(var i=0;i<seats.length;i++) {
					this._players[seats[i]].isIpSame(true);
				}
			}
		}
		this.isCanLetOut();
		this.playOrRemoveWaitingAnm();

	},

	isForceRemove:function(){
		return true;
	},

	/**
	 * button名称定义
	 */
	BTN_READY:"BTN_READY",
	BTN_INVITE:"BTN_INVITE",
	BTN_BREAK:"BTN_BREAK",
	BTN_SETUP:"BTN_SETUP",
	BTN_LEAVE:"BTN_LEAVE",
	BTN_CHAT:"BTN_CHAT",
	BTN_YUYIN:"BTN_YUYIN",
	NET_TYPE:"NET_TYPE",
	BATTERY:"BATTERY",
	/**
	 // * 获取指定按钮的名字
	 // * @param wName
	 // */
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
				name = "Button_75";
				break;
			case this.BTN_LEAVE:
				name = "Button_7";
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

	selfRender:function(){
		//Room.prototype.selfRender.call(this);
		BaseRoom.prototype.selfRender.call(this);//这里面可能会有部分不兼容的控件名
		//------------------------------------------------------------------------//
		cc.log("PDKRoom selfRender...");
		for(var i=1;i<=3;i++){
			if(i>1)
				this.getWidget("bt"+i).visible = false;
			this.getWidget("ybq"+i).visible = false;
			UITools.addClickEvent(this.getWidget("player"+i),this,this.onPlayerInfo);
			UITools.addClickEvent(this.getWidget("icon"+i),this,this.onPlayerInfo);
		}
		this.yuyin.visible = false;
		this.Image_40 = this.getWidget("Image_40");//闹钟
		this.Label_56 = this.getWidget("Label_56");//第几局
		this.Button_4 = this.getWidget("Button_4")//提示;
		this.Button_30 = this.getWidget("Button_30");//准备
		this.Button_sset = this.getWidget("Button_sset");
		UITools.addClickEvent(this.Button_sset,this,this.onZhanKai)
		this.btnBreak.visible = this.Button_4.visible = false;
		this.Button_17 = this.getWidget("Button_17");//邀请微信好友
		this.Button_17.visible = false;
		this.Label_27 = this.getWidget("Label_27");
		this.Label_39 = this.getWidget("Panel_time");//时间
		this.labelTime = this.getWidget("LableTime");
		this.Button_40 =this.getWidget("Button_40");//语音按钮
		this.Button_42 =this.getWidget("Button_42");//快捷聊天
		UITools.addClickEvent(this.Button_42,this,this.onChat);
		var cardPanel = this._cardPanel = ccui.helper.seekWidgetByName(this.root,"cardPanel");
		this._touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan.bind(this),
			onTouchMoved: this.onTouchMoved.bind(this),
			onTouchEnded: this.onTouchEnded.bind(this)
		});
		cc.eventManager.addListener(this._touchListener, cardPanel);

		this._cardPanelAni = this.getWidget("cardPanelAni");

		//比赛提示
		this.Panel_matchTip = this.getWidget("Panel_matchTip");
		this.Panel_matchTip.visible = false;

		//比赛提示时间
		this.Label_matchTipTime = this.getWidget("Label_matchTipTime");
		this.Label_matchTipTime.setString("");

		//------------------------------------------------------------------------//

		this.Image_qiepai = this.getWidget("Image_qiepai");
		this.Image_baodan = this.getWidget("Image_baodan");
		this.uidText = this.getWidget("uid1");
		this.Panel_37 = this.getWidget("Panel_fh");
		this.labelRand = this.getWidget("labelRand");
		this.labelRoomId = this.getWidget("labelRoomId");
		this.wanfaImg = this.getWidget("Image_wanfa");
		this.Panel_36 = this.getWidget("Panel_jushu");
		this.Panel_15 = this.getWidget("Panel_15");
		this.Label_38 = this.getWidget("Label_38");
		this.battery = this.getWidget("battery");
		this.netType = this.getWidget("netType");
		this.btn_CancelTuoguan = this.getWidget("btn_CancelTuoguan");//取消托管按钮
		this.bg_CancelTuoguan = this.getWidget("bg_CancelTuoguan");

		this.btn_match = this.getWidget("btn_match");
		UITools.addClickEvent(this.btn_match, this, this.onRwardRank);

		//显示倍率
		this.beilvLabel = this.getWidget("BitmapLabel_beilv");

		//显示排名
		this.rankLabel = this.getWidget("BitmapLabel_rank");

		this.lbCoin_0 = this.getWidget("lbCoin_0");
		this.lbCoin_0.setString("");

		if(this.bg_CancelTuoguan && this.btn_CancelTuoguan){
			this.bg_CancelTuoguan.visible = false;
			this.bg_CancelTuoguan.setLocalZOrder(100);
			UITools.addClickEvent(this.btn_CancelTuoguan, this, this.onCancelTuoguan);
		}
		//this.Button_qiepai = this.getWidget("Button_qiepai");


		this.btn_Gps = this.getWidget("btn_Gps");
		if(SyConfig.HAS_GPS && PDKRoomModel.renshu > 2){
			this.btn_Gps.visible = false;
		}else{
			this.btn_Gps.visible = false;
		}
		if(GPSModel.getGpsData(PlayerModel.userId) == null){
			this.btn_Gps.setBright(false);
			//this.btn_Gps.setTouchEnabled(false);
		}else{
			this.btn_Gps.setBright(true);
			this.btn_Gps.setTouchEnabled(true);
		}
		if (SdkUtil.isReview()){
			this.btn_Gps.visible = false;
		}
		//if(PDKRoomModel.isMatchRoom() && this.btn_Gps){
		//	this.btn_Gps.visible = false;
		//}
		UITools.addClickEvent(this.btn_Gps ,this,this.onGpsPop);

		UITools.addClickEvent(this.Panel_15,this,this.onCancelSelect,false);
		UITools.addClickEvent(this.btnBreak,this,this.onPlayCard);
		UITools.addClickEvent(this.Button_4,this,this.onPlayTip);
		UITools.addClickEvent(this.Button_17,this,this.onInvite);
		UITools.addClickEvent(this.Button_30,this,this.onReady);
		cc.log(".........PDKRoom addClickEvent");

		this.addCustomEvent(SyEvent.DOUNIU_INTERACTIVE_PROP,this,this.runPropAction);
		this.addCustomEvent(SyEvent.DTZ_UPDATE_GPS,this,this.updateGpsBtn);
		this.addCustomEvent(SyEvent.ROOM_ROLD_ICON,this,this.setRoldPlayerIcon);
		this.addCustomEvent(SyEvent.UPDATE_TUOGUAN , this,this.updatePlayTuoguan);
		this.addCustomEvent(SyEvent.MATCH_REFRESH_RANK,this,this.updateRank);
		this.addCustomEvent(SyEvent.MATCH_SHOW_TIP,this,this.showMatchTip);
		this.addCustomEvent(SyEvent.MATCH_UP_TIP,this,this.matchUpTip);
		this.addCustomEvent(SyEvent.UPDATE_BG_YANSE , this,this.updateBgColor);

		this.countDownLabel = new cc.LabelBMFont("","res/font/font_res_tu.fnt");
		this.countDownLabel.x = this.Image_40.width/2;
		this.countDownLabel.y = this.Image_40.height/2+8;
		this.Image_40.addChild(this.countDownLabel);
		this.calcTime();
		this.calcWifi();
		this.scheduleUpdate();
		//语音状态，是否可以使用了

		var imgPath = "res/ui/pdk/pdkRoom/15wanfa.png";
		if(PDKRoomModel.wanfa == 15){
			imgPath = "res/ui/pdk/pdkRoom/15wanfa.png";
		}else if (PDKRoomModel.wanfa == 16){
			imgPath = "res/ui/pdk/pdkRoom/16wanfa.png";
		}
		if(this.wanfaImg){
			this.wanfaImg.loadTexture(imgPath);
		}
		//var hongshiDesc = PDKRoomModel.getHongShiName();
		//this.getWidget("Label_hongshi").setString(hongshiDesc);
		if (SdkUtil.isIphoneX()) {
			this.getWidget("player3").x += 30;
			this.btn_Gps.x += 15;
			this.getWidget("small3").x += 30;
		}

		var type = UITools.getLocalItem("sy_pdk_pz") || 1;
		this.showBgColor(type);

		this.dealMoneyView();
	},

	updateBgColor:function(event){
		var type = event.getUserData();
		this.showBgColor(type);
	},

	//更新背景图和 更新字体颜色
	showBgColor: function (_type) {
		//绿色背景1蓝色背景2紫色背景3
		var bgTexture = "res/ui/bbt/Bgc1.jpg";
		if (_type == 1){

		}else if (_type == 2){
			bgTexture = "res/ui/bbt/Bgc2.jpg";
		}else if (_type == 3){
			bgTexture = "res/ui/bbt/Bgc3.jpg";
		}
		this.Panel_15.setBackGroundImage(bgTexture);
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
			if(seat == PDKRoomModel.mySeat && this.bg_CancelTuoguan){
				this.bg_CancelTuoguan.visible = isTuoguan;
			}
		}
	},

	updateRank:function(event){
		//1：当前轮数 2：自己的排名 3：剩下的人数
		var message = event.getUserData();
		var curRank = message[2];
		var totalRenshu = message[3];

		cc.log("现在排名=="+curRank+"总人数=="+totalRenshu);

		this.rankLabel.setString(""+curRank+"/"+totalRenshu);

		//if(this.Panel_rank.getChildByTag(123)){
		//	this.Panel_rank.removeChildByTag(123);
		//}
		//var rank = new cc.LabelBMFont(curRank+"/"+totalRenshu,"res/font/res_font_2.fnt");
		//rank.x = this.Panel_rank.width/2;
		//rank.y = this.Panel_rank.height/2-1;
		//this.Panel_rank.addChild(rank,1,123);


		//重新刷新记录自己的排名和总人数
		var players = PDKRoomModel.players;
		for(var i=0;i<players.length;i++){
			var p = players[i];
			if(p.userId == PlayerModel.userId){
				p.ext[10]=curRank;
				p.ext[11]=totalRenshu;
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

	dealMoneyView:function(){
		var isMatchRoom = PDKRoomModel.isMatchRoom();
		if(isMatchRoom){
			cc.log("当前是金币场房间！！！！");
			this.btnStopMoneyRoom = this.getWidget("btnStopMoneyRoom");
			this.btnStopMoneyRoom.visible = false;
			this.Button_30.visible = false;

			////我也是醉了 又改回来
			//var tgTime = PDKRoomModel.getTuoguanTime();
			//if(this.countDownLabel){
			//	this.countDownLabel.setString(tgTime);
			//}

			if(this.btnStopMoneyRoom){
				UITools.addClickEvent(this.btnStopMoneyRoom , this , this.onLeave);
			}
		}else{

		}
	},

	setRadioBtnImg:function(){
		this.audioBtnImg = "res/ui/pdk/pdkRoom/pdkRoom_4.png";
		this.btnUntouchImg = "res/ui/pdk/pdkRoom/pdkRoom_5.png";
	},


	//标记 玩家已经显示了头像
	setRoldPlayerIcon:function(event) {
		var seat = event.getUserData();
		//cc.log("修改玩家是否已经绘制完头像" , seat);
		var players = PDKRoomModel.players;
		for(var i=0;i<players.length;i++) {
			var p = players[i];
			if(p.seat ==seat){
				p.isRoladIcon = 1;
			}
		}
	},

	updateGpsBtn:function(){
		if(this.btn_Gps){
			if(GPSModel.getGpsData(PlayerModel.userId) == null){
				this.btn_Gps.setBright(false);
				//this.btn_Gps.setTouchEnabled(false);
			}else{
				this.btn_Gps.setBright(true);
				this.btn_Gps.setTouchEnabled(true);
			}
		}
	},

	onZhanKai:function(){
		var mc = new PDKSetUpPop();
		PopupManager.addPopup(mc);
		//var mc = new pdkRoomSetPop();
		//PopupManager.addPopup(mc);

	},

	/**
	 * 点击当前排名 和奖励
	 */
	onRwardRank:function(){
		ComReq.comReqMatchRecord([1],[""+PDKRoomModel.matchKeyId]);
	},

	onPlayerInfo:function(obj){
		this._players[obj.temp].showInfo();
	},

	onChat:function(){
		var mc = new ChatPop();
		PopupManager.addPopup(mc);
	},

	onQiePai:function(){
		sySocket.sendComReqMsg(22,[]);
	},

	onGpsPop:function(){
		PopupManager.addPopup(new GpsPop(PDKRoomModel , 3));
	},

	runPropAction:function(event){
		//seat 接收者的座位号  userId表示发送者的userId  content表示道具的索引值
		var data = event.getUserData();
		var userId = data.userId;
		var seat = data.seat;
		var content = data.content;
		cc.log("content..." , content);
		var p = PDKRoomModel.getPlayerVo(userId);
		var fromPlayer = this._players[p.seat];
		var targetPlayer = this._players[seat];
		if(fromPlayer._playerVo.userId != targetPlayer._playerVo.userId) {
			var url = "res/ui/dtz/chat/prop" + content + ".png";
			var prop = new cc.Sprite(url);
			var initX = fromPlayer.getContainer().x;
			var initY = fromPlayer.getContainer().y;
			var x = initX;
			var y = initY;
			prop.setPosition(x, y);
			this.root.addChild(prop,2000);
			initX = targetPlayer.getContainer().x;
			initY = targetPlayer.getContainer().y;
			var targetX = initX;
			var targetY = initY - 40;
			cc.log("fromPlayer._playerVo.seat... " , p.seat , targetX , targetY);
			var action = cc.sequence(cc.moveTo(0.3, targetX, targetY), cc.callFunc(function () {
				targetPlayer.playPropArmature(content);
				prop.removeFromParent(true);
			}));
			prop.runAction(action);
		}else{
			targetPlayer.playPropArmature(content);
		}
	},

	onCancelSelect:function(){
		var isHas = false;
		for(var i=0;i<this._cards.length;i++){
			if(this._cards[i].isEnable()){
				isHas = true;
				break;
			}
		}
		if(!isHas){
			this.unSelectAllCards();
			this._allCards.length=0;
			this.isCanLetOut();
		}
	},

	/**
	 * 在线或者离线状态
	 * @param event
	 */
	onOnline:function(event){
		var data = event.getUserData();
		this._players[data[0]].leaveOrOnLine(data[1]);
	},

	/**
	 * 状态改变
	 * @param event
	 */
	onChangeStauts:function(event){
		var message = event.getUserData();
		var params = message.params;
		var seat = params[0];
		var status = params[1];
		cc.log("改变该座位玩家状态..." , seat);
		this._players[seat].showStatus(status);
		if(seat == PDKRoomModel.mySeat){
			this.Button_30.visible = /*this.Button_qiepai.visible =*/false;
		}
	},

	unSelectAllCards:function(){
		for(var i=0;i<this._cards.length;i++){
			var card = this._cards[i];
			if(card.isSelected())
				card.unselected();
		}
	},

	enableAllCards:function(){
		for(var i=0;i<this._cards.length;i++){
			this._cards[i].enableAction();
		}
	},

	/**
	 * 当前牌局结束
	 * @param event
	 */
	onOver:function(event){
		var data = event.getUserData();
		if(PlayPDKMessageSeq.sequenceArray.length>0){
			PlayPDKMessageSeq.cacheClosingMsg(data);
			return;
		}
		this.isOver = true;
		var self = this;
		setTimeout(function() {
			for (var i = 0; i < data.length; i++) {
				self.letOutCards(data[i].cards, data[i].seat, true);
			}
		},700);
		this.btnBreak.visible = this.Button_4.visible = false;
		this.Image_40.visible = /*this.Image_qiepai.visible =*/ false;
		var self = this;
		for(var i=0;i<data.length;i++){
			if (PlayerModel.userId == data[i].userId){
				self._players[data[i].seat].updatePoint(data[i].totalPoint);
			}
		}
		this.overTimeOut = setTimeout(function(){
			var mc = new MatchPdkSmallResultPop(data);
			PopupManager.addPopup(mc);}
		,1000)
	},

	/**
	 * 修正前端错误的出牌类型
	 */
	fixCardType:function(cardType){
		if(this._lastCardPattern){
			if(this._lastCardPattern.type != cardType){
				cc.log("修正_lastCardPattern.type：", this._lastCardPattern.type  , cardType);
				this._lastCardPattern.type = cardType;//强行赋值！
			}
		}
	},

	/**
	 * 收到出牌消息，前台开始处理
	 * @param event
	 */
	onLetOutCard:function(event){
		this.Panel_matchTip.visible = false;
		//增加保险措施
		SyEventManager.dispatchEvent(SyEvent.MATCH_REMOVE_WAIT);
		this._countDown = PDKRoomModel.getTuoguanTime();

		for(var i=1;i<=3;i++){
			this.getWidget("ybq"+i).visible = false;
		}
		var self = this;
		var buyao = false;
		var message = event.getUserData();
		var seat = message.seat;
		//下个出牌的位置
		var nextSeat = this.seatSeq[seat][1];
		if(seat == PDKRoomModel.mySeat){//我自己出牌了，清理掉选择的牌
			this._allCards.length = 0;
			this.enableAllCards();
		}
		if(message.cardIds.length==0){//要不起
			buyao = true;
			this._players[seat].showStatus(-1);
			if(this._lastCardPattern && this._lastCardPattern.type==AI.BOMB && nextSeat == this._lastLetOutSeat)
				RoomEffects.bomb(this._players,this.root,this._lastLetOutSeat,PDKRoomModel.getMoneyRoomBeilv());
		}else{
			//已经出牌了
			var ids = message.cardIds;
			var cardTransData = [];
			var handsTransData = [];
			for(var i=0;i<ids.length;i++){
				cardTransData.push(AI.getCardDef(ids[i]));
			}

			//修复最后一手出三张 前端未识别出牌型的问题
			//是最后一手牌 话说这种东西后台传下来不好么 非要前段用剩余牌数判断 问题是剩余牌数也只在短线重连的时候传 做金币场的时候必改之
			if(seat == PDKRoomModel.mySeat){
				this._lastCardPattern = AI.filterCards(cardTransData,this.getCardsOnHand());
			}else{
				if(this._players[seat].getPlayLastCardsNum() == cardTransData.length){
					handsTransData = ArrayUtil.clone(cardTransData);
					this._lastCardPattern = AI.filterCards(cardTransData,handsTransData);
				}else{//保留原来的逻辑
					this._lastCardPattern = AI.filterCards(cardTransData);
				}
			}

			//cc.log("this._lastCardPattern::" , this._lastCardPattern);
			if(this._lastCardPattern.type == AI.BOMBWITHCARD || this._lastCardPattern.type == AI.THREE){
				this.fixCardType(message.cardType);
			}

			this._lastLetOutSeat = seat;
			var direct = this.getPlayerSeq("",PDKRoomModel.mySeat,seat);
			RoomEffects.play(this.root,this._lastCardPattern,direct);
			//if(this._lastCardPattern && this._lastCardPattern.type==AI.BOMB && nextSeat == PDKRoomModel.mySeat)
			//	RoomEffects.bomb(this._players,this.root,seat,PDKRoomModel.getMoneyRoomBeilv());
			cc.log("lastCardPattern::"+JSON.stringify(this._lastCardPattern));
		}
		//报停
		if(message.isBt){
			this._players[seat].baoting();
			if(PDKRoomModel.isNextSeatBt()){
				this.Image_baodan.visible = true;
			}
		}

		if(nextSeat == PDKRoomModel.mySeat){//轮到我出牌了
			if(message.isLet===1){
				this.Button_4.visible = this.btnBreak.visible = true;
				if(this._lastLetOutSeat == PDKRoomModel.mySeat)//转了一圈了
					this._lastCardPattern = null;
				var selectedCards = ArrayUtil.clone(this.getCardsOnHand());
				var result = AI.filterCards(selectedCards,this.getCardsOnHand(),this._lastCardPattern);
				if(result){
					if(!this._lastCardPattern || (this._lastCardPattern.type==result.type || result.type==AI.BOMB )
						&& result.type != AI.BOMBWITHCARD){//这里就是传说中的自动出最后一手牌？ 增加保护 炸弹带牌牌型不自动打出
						setTimeout(function(){
							self._allCards = selectedCards;
							self._cCardPattern = result;
							if(self.isBombBreak()){
								self._allCards.length=0;
								self._cCardPattern = null;
								return self.smartLetOut();
							}
							self.onPlayCard(this.btnBreak,true);
						},300);
					}else{
						this.smartLetOut();
					}
				}else{
					this.smartLetOut();
				}
				this.showJianTou(nextSeat);
			}else{//我也要不起
				setTimeout(function(){
					//self._players[PDKRoomModel.mySeat].showStatus(-1);
					self.sendPlayCardMsg(0,[]);
					self.letOutCards([],PDKRoomModel.mySeat);
					self.showJianTou(self.seatSeq[PDKRoomModel.mySeat][1]);
				},1000);
				this.Button_4.visible = this.btnBreak.visible = false;
			}
		}else{
			this.showJianTou(nextSeat);
			this.Button_4.visible = this.btnBreak.visible = false;
		}
		if(!buyao)
			RoomSound.letOutSound(message.userId,this._lastCardPattern);
		this.letOutCards(message.cardIds,message.seat);
		PlayPDKMessageSeq.finishPlay();
	},

	onTouchBegan: function (touch, event) {
		return PDKCardDelegate.dealTouchBegin(this, touch , event);
	},

	onTouchMoved: function (touch, event) {
		return PDKCardDelegate.dealTouchMove(this, touch , event);
	},

	onTouchEnded: function (touch, event) {
		return PDKCardDelegate.dealTouchEnded(this, touch , event);
	},

	changeLetOutButton:function(isTouch){
		if(isTouch == this._letOutButtonTouchable)
			return;
		this._letOutButtonTouchable = isTouch;
		if(isTouch){
			this.btnBreak.setTouchEnabled(true);
			this.btnBreak.loadTextureNormal("res/ui/pdk/pdkRoom/btn_2.png");
		}else{
			this.btnBreak.setTouchEnabled(false);
			this.btnBreak.loadTextureNormal("res/ui/pdk/pdkRoom/btn_5.png");
		}
	},

	isCanLetOut:function(){
		//cc.log("isCanLetOut1::"+JSON.stringify(this._lastCardPattern));
		this._cCardPattern = AI.filterCards(this._allCards,this.getCardsOnHand(),this._lastCardPattern);
		//cc.log("isCanLetOut2::"+JSON.stringify(this._cCardPattern));
		if(this._lastCardPattern && this._cCardPattern && this._cCardPattern.type != this._lastCardPattern.type && this._cCardPattern.type != AI.BOMB)
			this._cCardPattern = null;

		/**
		 * 四带三的特殊处理
		 * 如果上家是三带 或者 炸弹带 必须类型相同才可以打
		 */
		if((this._lastCardPattern && this._cCardPattern &&
			(this._lastCardPattern.type == AI.BOMBWITHCARD || this._lastCardPattern.type == AI.THREE)
			&& (this._cCardPattern.type != this._cCardPattern.type))){
			this.changeLetOutButton(false);
			return;
		}

		//cc.log("isCanLetOut3::"+JSON.stringify(this._cCardPattern));
		this.changeLetOutButton((this._cCardPattern!=null));


		if(this._allCards.length <= 0){
			PDKRoomModel.prompt(null);
			this.changeLetOutButton(false);
		}
		//把选中的牌全部取消了,提示的数据也需要清掉
	},

	getModel: function () {
		return PDKRoomModel;
	},

	getLabelTime: function () {
		return this.getWidget("LableTime");//时间;
	},

	/**
	 * 初始化卡牌
	 * @param cards {Array.<CardVo>}
	 */
	initCards:function(cards){
		cc.log("initCards....")
		if(this._cards.length>0){//清理掉上一局的牌
			for(var i=0;i<this._cards.length;i++){
				this._cardPanel.removeChild(this._cards[i]);
			}
			this._cards.length=0;
		}
		if(this._cardPanelAni){//清理掉开局动画的牌
			this._cardPanelAni.removeAllChildren();
		}
		if(this._cards.length == 0){
			var winSize = cc.director.getWinSize();
			var centerX = (winSize.width - this._cardW)/2;
			var maxCard = PDKRoomModel.isWanfa15()?15:16;
			var isHongshi = PDKRoomModel.isHongShi();
			var offX = 60;
			if(cards.length > 1){
				offX = 60 * (cards.length - 1) / maxCard ;//手牌位置稍微往右移动一点
			}else{
				offX = 0;
			}
			var initX = (winSize.width - (this._cardW+this._cardG*(cards.length-1)))/2 ;
			for(var i=0;i<cards.length;i++){
				var card = new PDKBigCard(cards[i]);
				card.cardId = i;
				card.anchorX=card.anchorY=0;
				var realX = initX+i*this._cardG;
				card.x = realX;
				//card.x = centerX;
				card.y = 0;
				this._cardPanel.addChild(card);
				this._cards.push(card);
				card.varNode.visible = true;
				card.backNode.visible = false;
				if (isHongshi && cards[i].n == 10 && cards[i].t == 3){
					var sprite = new cc.Sprite("res/ui/pdk/pdkRoom/img_xiabiao.png");
					sprite.x = 20;
					sprite.y = 18;
					card.addChild(sprite);
				}
				//card.letOutAnimate(realX);
			}

			this._cardPanel.visible = false;
			for(var i=0;i<cards.length;i++){
				var card = new PDKBigCard(cards[i]);
				card.cardId = i;
				card.anchorX=card.anchorY=0;
				var realX = initX+i*this._cardG;
				card.x = centerX;
				card.y = 0;
				this._cardPanelAni.addChild(card);
				if (isHongshi && cards[i].n == 10 && cards[i].t == 3){
					var sprite = new cc.Sprite("res/ui/pdk/pdkRoom/img_xiabiao.png");
					sprite.x = 20;
					sprite.y = 18;
					card.addChild(sprite);
				}
				card.varNode.visible = false;
				card.backNode.visible = true;
				var realX = realX;
				var realY = card.y;
				var rep = this.createAction(realX , realY , i, cards.length);
				card.runAction(rep);
			}
		}
	},

	onShowAndHide : function(sender){
		var tPuckObj = sender;
		tPuckObj.varNode.setVisible(true);
		tPuckObj.backNode.setVisible(false);
		tPuckObj.isAction = false;
	},

	createAction: function (realX, realY, i, length) {
		var self = this;
		var showSpeed = 0.25;
		var moveSpeed = 0.04;
		var beginPosx = realX;
		var beginPosY = realY;

		var actMoveto = cc.moveTo(0.1 + i * moveSpeed, cc.p(beginPosx, beginPosY));
		var actSqwar = cc.spawn(actMoveto);//actRotateBy

		var actopmPrbotCamera = cc.orbitCamera(showSpeed, 1, 0, 0, -90, 0, 0);
		var actPrbotCamera2 = cc.orbitCamera(showSpeed, 1, 0, 90, -90, 0, 0);
		var showAndHide = cc.callFunc(this.onShowAndHide, this);
		var removeCardAni = cc.callFunc(function(){
			if(self._cardPanelAni && i == length -1){//清理掉上一局的牌
				self._cardPanelAni.removeAllChildren();
				self._cardPanel.visible = true;
			}
		});

		var rep = cc.sequence(actSqwar, actopmPrbotCamera, showAndHide, actPrbotCamera2,removeCardAni);
		return rep;
	},

	getPlayerSeq:function(userId,ownSeat,seat){
		if(userId == PlayerModel.userId)
			return 1;
		var seqArray = this.seatSeq[ownSeat];
		var seq = ArrayUtil.indexOf(seqArray,seat)+1;
		return seq;
	},

	/**
	 *
	 * @returns {Array.<CardVo>}
	 */
	getCardsOnHand:function(){
		var result = [];
		for(var i=0;i<this._cards.length;i++){
			result.push(this._cards[i].getData());
		}
		return result;
	},

	letOutCards:function(cardIds,seat,isOver){
		if(!isOver){
			var nextSeq = this.getPlayerSeq(-1,PDKRoomModel.mySeat,this.seatSeq[seat][1]);
			this.getWidget("small"+nextSeq).removeAllChildren(true);
		}else{
			if(cardIds.length>0){
				var overSeq = this.getPlayerSeq(-1,PDKRoomModel.mySeat,seat);
				this.getWidget("small"+overSeq).removeAllChildren(true);
			}
		}
		if(cardIds.length==0)
			return;
		AudioManager.play("res/audio/common/audio_card_out.mp3");
		var seq = 1;
		if(seat == PDKRoomModel.mySeat){//自己出牌
			var cards = this._cards;
			for(var n=0;n<cardIds.length;n++){
				for(var i=0;i<cards.length;i++){
					var card = cards[i];
					if(card.getData().c == cardIds[n]){
						this._cardPanel.removeChild(card);
						this._cards.splice(i,1);
						break;
					}
				}
			}
			var winSize = cc.director.getWinSize();
			var length = this._cards.length;
			var maxCard = PDKRoomModel.isWanfa15()?15:16;
			var offX = 60;
			if(cards.length > 1){
				offX = 60 * (cards.length - 1)/maxCard ;//手牌位置稍微往右移动一点
			}else{
				offX = 0;
			}
			var initX = (winSize.width - (this._cardW+this._cardG*(cards.length-1)))/2;
			for(var i=0;i<length;i++){
				this._cards[i].x = initX+i*this._cardG;
				this._cards[i].cardId = i;
			}
		}else{
			seq = this.getPlayerSeq(-1,PDKRoomModel.mySeat,seat);

			var playerVo=PDKRoomModel.getPlayerVoBySeat(seat);
			if(playerVo!=null){
				if(!isOver){
					playerVo.ext[1]-=cardIds.length;
				}
				if(this._players[seat]){
					this._players[seat].showLastCard();
				}
			}

		}
		var copyCardIds = ArrayUtil.clone(cardIds);
		var offX = 33;
		var smallCardScale = 0.65;
		length = copyCardIds.length;
		var smallW = this._cardW * smallCardScale;
		if(seq == 1){
			initX = (800 - (smallW+offX*(length-1)))/2;
		}else if(seq == 2) {
			initX = (800-smallW);
			copyCardIds.reverse();
		}else{
			initX = 0;
		}
		this.getWidget("small"+seq).removeAllChildren(true);
		for(var i=0;i<length;i++){
			var smallCard = new SmallCard(AI.getCardDef(copyCardIds[i]) , 2);
			smallCard.anchorX=smallCard.anchorY=0;
			smallCard.scale = smallCardScale;
			if(seq == 2){
				smallCard.x = initX - i*offX;
				smallCard.setLocalZOrder(length-i);
			}else{
				smallCard.x = initX + i*offX;
			}
			smallCard.y = 0;
			this.getWidget("small"+seq).addChild(smallCard);
		}
	},

	/**
	 * 发送出牌消息
	 * @param type
	 * @param allCards
	 */
	sendPlayCardMsg:function(type,allCards){
		var build = MsgHandler.getBuilder("proto/PlayCardReqMsg.txt");
		var msgType = build.msgType;
		var builder = build.builder;
		var PlayCardReq = builder.build("PlayCardReq");
		var cardIds = [];
		for(var i=0;i<allCards.length;i++){
			cardIds.push(allCards[i].c);
		}
		var msg = new PlayCardReq();
		msg.cardIds = cardIds;
		msg.cardType = type;
		sySocket.send(msg,msgType);
	},

	/**
	 * 是否有炸弹被拆散
	 * @returns {boolean}
	 */
	isBombBreak:function(){
		if(this._cCardPattern.type == AI.BOMB)
			return false;
		var cardsOnHand = this.getCardsOnHand();
		var temp = {};
		var bombi = [];
		for(var i=0;i<cardsOnHand.length;i++){
			var card = cardsOnHand[i];
			if(temp[card.i]){
				temp[card.i] += 1;
			}else{
				temp[card.i] = 1;
			}
			if(temp[card.i]==4)
				bombi.push(card.i);
		}
		var isHas = false;
		for(var i=0;i<this._allCards.length;i++){
			var card = this._allCards[i];
			if(ArrayUtil.indexOf(bombi,card.i) >= 0){
				isHas = true;
				break;
			}
		}
		return isHas;
	},

	/**
	 * 出牌动作
	 */
	onPlayCard:function(obj,bombBreak){
		var self = this;
		if(this._cCardPattern){
			if(!bombBreak && this.isBombBreak()){
				AlertPop.show("炸弹被拆散，确定出牌吗？",function(){self.onPlayCard(obj,true);});
				return;
			}
			this.sendPlayCardMsg(this._cCardPattern.type,this._allCards);
		}else{//有可能提前选择了牌，再次筛选一次
			if(this._allCards.length>0){
				this._cCardPattern = AI.filterCards(this._allCards,this.getCardsOnHand(),this._lastCardPattern);
				if(this._cCardPattern){
					if(!bombBreak && this.isBombBreak()){
						AlertPop.show("炸弹被拆散，确定出牌吗？",function(){self.onPlayCard(obj,true);});
						return;
					}
					this.sendPlayCardMsg(this._cCardPattern.type,this._allCards);
				}
			}
		}
	},

	smartLetOut:function(){
		var result = [];
		var allCards = [];
		//下家报停，单张的情况
		if(PDKRoomModel.isNextSeatBt() && this._lastCardPattern && this._lastCardPattern.type==AI.SINGLE){
			var resultbt = AI.autoFilter(this.getCardsOnHand(), this._lastCardPattern,2);
			if(resultbt.length==1){
				result.push(0);
			}else if(resultbt.length>1){
				result = resultbt;
			}
		}else {
			if(!this._lastCardPattern || this._lastCardPattern.type!=AI.THREE) {
				result = AI.autoFilter(this.getCardsOnHand(), this._lastCardPattern,2);
				if (result.length > 0) {
					for (var i = 0; i < result.length; i++) {
						allCards.push(this._cards[result[i]].getData());
					}
					var selectedCards = ArrayUtil.clone(allCards);
					this._cCardPattern = AI.filterCards(selectedCards, this.getCardsOnHand(), this._lastCardPattern);
					if(this._cCardPattern){
						if(this._cCardPattern.maxCount>=4&&this._cCardPattern.type!=AI.BOMB){//防止3个带最后把炸弹带出去了
							result.length = 0;
						}else{
							PDKRoomModel.prompt(this._cCardPattern);
							var resultNext = AI.autoFilter(this.getCardsOnHand(), this._lastCardPattern,2);
							//只有唯一可以出的牌
							if (resultNext.length > 0)
								result.length = 0;
							else{
								cc.log("只有唯一可以出的牌");
							}
						}
					}else{
						result.length = 0;
					}
				}
			}
		}

		if(result.length>0){
			this.unSelectAllCards();
			allCards.length=0;
			for (var i = 0; i < this._cards.length; i++) {
				var card = this._cards[i];
				if (ArrayUtil.indexOf(result, i) >= 0) {
					card.selectAction();
					allCards.push(card.getData());
				} else {
					card.disableAction();
				}
			}
			this._allCards = allCards;
		}
		if(this._allCards.length==0){
			for (var i = 0; i < this._cards.length; i++) {
				var card = this._cards[i];
				if(card.isSelected())
					this._allCards.push(card.getData());
			}
		}
		this.isCanLetOut();
		PDKRoomModel.prompt(null);
	},

	/**
	 * 提示动作
	 */
	onPlayTip:function(){
		var result = AI.autoFilter(this.getCardsOnHand(),this._lastCardPattern,1);
		if(PDKRoomModel.isNextSeatBt() && this._lastCardPattern && this._lastCardPattern.type==AI.SINGLE){
			//cc.log("下家报停情况下 单排的提示逻辑..");
			result = AI.autoFilter(this.getCardsOnHand(),this._lastCardPattern,2);
		}

		//没下个牌的提醒了，或者已经提示到了炸弹，停止往下搜索
		if(PDKRoomModel.promptCardPattern && (result.length==0 || PDKRoomModel.promptCardPattern.type == AI.BOMB)){
			PDKRoomModel.prompt(null);
			this.onPlayTip();
			return;
		}
		//先把现在选中的牌取消
		this.unSelectAllCards();
		var allCards = [];
		for(var i=0;i<result.length;i++){
			var card = this._cards[result[i]];
			card.selectAction();
			if(card.isSelected())
				allCards.push(card.getData());
		}
		this._allCards = allCards;
		this._cCardPattern = AI.filterCards(this._allCards,this.getCardsOnHand(),this._lastCardPattern);
		PDKRoomModel.prompt(this._cCardPattern);
		this.isCanLetOut();
	},

	/**
	 * 邀请
	 */
	onInvite:function(){
		var obj={};
		obj.tableId=PDKRoomModel.tableId;
		obj.userName=PlayerModel.username;
		obj.callURL=SdkUtil.SHARE_URL+'?num='+PDKRoomModel.tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
		obj.title='跑得快   房号：'+PDKRoomModel.tableId;
		var cardNum = "";
		if(PDKRoomModel.isShowCardNumber()){
			cardNum = ",显示剩余牌数";
		}
		var heitao = cc.sys.localStorage.getItem("sy_pdk_heitao3");
		var heiStr = "";
		if(heitao == 1 && PDKRoomModel.renshu == 3){
			heiStr = ",首局必出黑桃三";
		}

		var zhangDesc = "16张";
		if(PDKRoomModel.wanfa == 15){
			zhangDesc = "15张"
		}

		var clubStr = "";
		if (PDKRoomModel.isClubRoom(PDKRoomModel.tableType)){
			clubStr = "[亲友圈]";
		}
		var hongshiStr = PDKRoomModel.getHongShiName();
		obj.description= clubStr + csvhelper.strFormat("{0}人,{1},{2}局{3}{4},{5}。",PDKRoomModel.renshu,zhangDesc,PDKRoomModel.totalBurCount,cardNum,heiStr,hongshiStr);
		obj.shareType=1;
		ShareDTPop.show(obj);
	},

	/**
	 * 有人加入房间
	 * @param event
	 */
	onJoin:function(event){
		var p = event.getUserData();
		cc.log("p.seat , p.userId" , p.seat , p.userId);
		if(PDKRoomModel.isMatchRoom()){
			if(p.userId == PlayerModel.userId){
				PDKRoomModel.mySeat = p.seat;//修正错误的mySeat值

			}
		}
		var seq = this.getPlayerSeq(p.userId,PDKRoomModel.mySeat, p.seat);
		this._players[p.seat] = new PDKCardPlayer(p,this.root,seq);
		var seats = PDKRoomModel.isIpSame();
		if(seats.length>1){
			for(var i=0;i<seats.length;i++) {
				this._players[seats[i]].isIpSame(true);
			}
		}

		//显示房间信息
		for(var i=0;i<PDKRoomModel.players.length;i++){
			var player = PDKRoomModel.players[i];
			if(player.userId == PlayerModel.userId){
				this.lbCoin_0.setString(PDKRoomModel.getMatchInfos(player));
			}
			this._players[player.seat].updatePoint(player.ext[9]);
		}

		//如果人数已经足够 判断是否缓存了开始消息
		if(PDKRoomModel.isMatchRoom() && ObjectUtil.size(this._players) >= PDKRoomModel.renshu){
			var beginMsg = PlayPDKMessageSeq.getBeginMsg();
			if(beginMsg){
				cc.log("玩家数量未显示完毕 执行缓存的开始游戏消息");
				this.startGame(beginMsg);
			}
		}

	},

	onExitRoom:function(event){
		var p = event.getUserData();
		this._players[p.seat].exitRoom();
		delete this._players[p.seat];
		var seats = PDKRoomModel.isIpSame();
		for (var key in this._players) {
			if (ArrayUtil.indexOf(seats, key) < 0) {
				this._players[key].isIpSame(false);
			}
		}

	},


	/**
	 * 牌局开始
	 * @param event
	 */
	startGame:function(event){

		for(var i=1;i<=3;i++){
			this.getWidget("small"+i).removeAllChildren(true);
			this.getWidget("ybq"+i).visible = false;
		}
		PopupManager.removeClassByPopup(CutCardPop);
		PopupManager.removeAll();
		var message = event.getUserData();
		var isMatchRoom = PDKRoomModel.isMatchRoom();
		if(isMatchRoom){//金币场 在人数没有显示完全的时候 要把开始游戏消息缓存下来
			if(ObjectUtil.size(this._players) < PDKRoomModel.renshu){
				PlayPDKMessageSeq.cacheBeginMsg(message);
				cc.log("金币场 如果玩家加入房间消息没处理完 缓存住开始游戏消息！！");
				return;
			}
		}


		for(var i=1;i<=3;i++){
			if(i>1)
				this.getWidget("bt"+i).visible = false;
			this.getWidget("ybq"+i).visible = false;
			if(this._players[i]!=null) {
				this._players[i].showLastCard();
				this._players[i].showIsFirstOut();
			}
		}

		this.btnBreak.visible = this.Button_4.visible = (PDKRoomModel.nextSeat==PDKRoomModel.mySeat);
		var p = event.getUserData();
		this._players[PDKRoomModel.mySeat].deal(p.handCardIds);
		this._countDown = PDKRoomModel.countDown;//发牌后显示第一家出牌的操作时间
		this.showJianTou();
		this._lastCardPattern = null;
		this._lastLetOutSeat = 0;
		this.initCards(p.handCardIds);


		this.playOrRemoveWaitingAnm();
		this.Panel_matchTip.visible = false;
		SyEventManager.dispatchEvent(SyEvent.MATCH_REMOVE_WAIT);
	},

	/**
	 * 闹钟上面的箭头
	 * @param seat
	 */
	showJianTou:function(seat){
		this.Image_40.visible = true;
		seat = seat || PDKRoomModel.nextSeat;
		for(var i=1;i<=3;i++){
			this.getWidget("tip"+i).visible = false;
		}
		this.getWidget("tip"+this.getPlayerSeq("",PDKRoomModel.mySeat,seat)).visible = true;

		this.showTouguanTime(this._countDown);

		//var tgTime = PDKRoomModel.getTuoguanTime();
		//if(this.countDownLabel){
		//	this.countDownLabel.setString(tgTime);
		//}
	},

	onShow:function(){
		this._dt = 0;
		this._timedt = 0;
		this.calcTime();
		this.scheduleUpdate();
	},

	onHide:function(){
		this.unscheduleUpdate();
	},

	calcTime:function(){
		var date = new Date();
		var hours = date.getHours().toString();
		hours = hours.length < 2 ? "0"+hours : hours;
		var minutes = date.getMinutes().toString();
		minutes = minutes.length < 2 ? "0"+minutes : minutes;
		var time = hours+":"+minutes;
		if(this.labelTime){
			this.labelTime.setString(time);
		}
	},

	getNetTypePNG:function(type){
		return "res/ui/dtz/dtzRoom/net_"+type+".png";
	},

	update:function(dt){
		this._dt += dt;
		PlayPDKMessageSeq.updateDT(dt);
		this._loacationDt += dt;

		if(this._dt>=1){
			this._dt = 0;
			if(this._countDown >= 0){
				this.showTouguanTime(this._countDown);
				this._countDown--;
			}
			this._timedt+=1;
			if(this._timedt%60==0)
				this.calcTime();
			if(this._timedt>=180){
				this._timedt = 0;
				this.calcWifi();
			}
			if (this.Panel_matchTip.isVisible()){
				this.matchWaitTime = this.matchWaitTime + 1;
				this.Label_matchTipTime.setString(this.matchWaitTime+"s")
			}
		}
	},

	showTouguanTime:function(_time){
		var countDown = (_time<10) ? "0"+_time : ""+_time;
		this.countDownLabel.setString(countDown);
	},

	playOrRemoveWaitingAnm:function(){
		if(!PDKRoomModel.isMatchRoom()){
			return
		}
		//双明要影藏一万个东西 决定放到列表里
		var showOrHideNode = [];
		showOrHideNode.push(this.getWidget("Image_infoBg"));
		showOrHideNode.push(this.getWidget("Button_42"));//聊天
		showOrHideNode.push(this.getWidget("Button_40"));//语音
		showOrHideNode.push(this.getWidget("Button_sset"));//设置按钮
		showOrHideNode.push(this.getWidget("Image_databg"));
		showOrHideNode.push(this.recordBtn);//真.录音按钮
		//showOrHideNode.push(this.getWidget("Image_87"));
		showOrHideNode.push(this.getWidget("Image_downbg"));//倍率和排名的底框
		showOrHideNode.push(this.getWidget("Image_beilv"));//倍率
		showOrHideNode.push(this.getWidget("Image_rank"));//排名
		showOrHideNode.push(this.getWidget("btn_match"));//排名

		//showOrHideNode.push(this.getWidget("bg_CancelTuoguan"));


		var alwaysHideNode = [];
		alwaysHideNode.push(this.getWidget("Button_17"));

		for(var index = 0; index < alwaysHideNode.length ; index++){
			if(alwaysHideNode[index]){
				alwaysHideNode[index].visible = false;
			}
		}

		//人数不够 未开始的情况下
		if(PDKRoomModel.players.length < PDKRoomModel.renshu){
			if(PDKRoomModel.isMatchRoom()) {
				this.matchWaitTime = 0;
				this.Label_matchTipTime.setString("");
				this.Panel_matchTip.visible = true;
			}
			//if(this.waitAnimation == null){
			//	if(PDKRoomModel.isMatchRoom()){
			//		ccs.armatureDataManager.addArmatureFileInfo(
			//			"res/plist/dengren0.png",
			//			"res/plist/dengren0.plist",
			//			"res/plist/dengren.ExportJson");
			//		this.waitAnimation = new ccs.Armature("dengren");
			//		this.waitAnimation.x = 673;
			//		this.waitAnimation.y = 336;
			//		this.root.addChild(this.waitAnimation,99);
			//		this.waitAnimation.getAnimation().play("dengren",-1,1);
			//		if(this.btnStopMoneyRoom){
			//			this.btnStopMoneyRoom.visible = false;
			//		}
			//	}
			//}

			for(var index = 0 ; index < showOrHideNode.length; index++){
				if(showOrHideNode[index]){
					showOrHideNode[index].visible = false;
				}
			}
		}else{//移除已有的动画
			//if(this.waitAnimation){
			//	this.waitAnimation.removeFromParent();
			//	this.waitAnimation = null;
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
		//this.getWidget("Button_53").visible = false;
		//if (this.recordBtn) {
		//	this.recordBtn.visible = false;
		//}
	},

});