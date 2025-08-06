/**
 * Created by Administrator on 2016/10/11.
 */

var MatchItem = ccui.Widget.extend({
	ctor:function(matchData , rootLayer){
		this.matchData = matchData;
		this.matchExt = JSON.parse(this.matchData.matchExt);
		this.parentNode = rootLayer;
		this.dt = 1;
		this.countDown = 0;
		this.matchType = "";

		this.keyId = matchData.keyId;
		//cc.log("this.matchData ..." , JSON.stringify(this.matchData));
		this._super();

		this.setContentSize(cc.size(926,116));

		var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(926,116),cc.color(0,0,0),0);
		Panel_16.setAnchorPoint(cc.p(0,0));
		Panel_16.setPosition(0,0);

		var Image_matchCell1=this.Image_matchCell1= UICtor.cImg("res/ui/dtz/match/img_16.png");
		Image_matchCell1.setPosition(463,58);
		Panel_16.addChild(Image_matchCell1);

		var Label_title=this.Label_title= UICtor.cLabel("千钻争夺赛",28,cc.size(0,0),cc.color(32,77,143),0,0);
		Label_title.setAnchorPoint(cc.p(0,0.5));
		Label_title.setPosition(cc.p(-437+Image_matchCell1.getAnchorPointInPoints().x, 20+Image_matchCell1.getAnchorPointInPoints().y));
		Image_matchCell1.addChild(Label_title);

		var Label_count=this.Label_count= UICtor.cLabel("55",28,cc.size(0,0),cc.color(32,77,143),0,0);
		Label_count.setAnchorPoint(cc.p(0,0.5));
		Label_count.setPosition(cc.p(-405+Image_matchCell1.getAnchorPointInPoints().x, -24+Image_matchCell1.getAnchorPointInPoints().y));
		Image_matchCell1.addChild(Label_count);

		var Image_count=this.Image_count= UICtor.cImg("res/ui/dtz/match/img_11.png");
		Image_count.setPosition(cc.p(-425+Image_matchCell1.getAnchorPointInPoints().x, -24+Image_matchCell1.getAnchorPointInPoints().y));
		Image_matchCell1.addChild(Image_count);

		var Image_rewardbg=this.Image_rewardbg= UICtor.cImg("res/ui/dtz/match/img_25.png");
		Image_rewardbg.setPosition(cc.p(-69+Image_matchCell1.getAnchorPointInPoints().x, 1+Image_matchCell1.getAnchorPointInPoints().y));
		Image_matchCell1.addChild(Image_rewardbg);

		var Label_reward=this.Label_reward= UICtor.cLabel("第一名奖励",22,cc.size(160,90),cc.color(255,255,255),1,1);
		Label_reward.setAnchorPoint(cc.p(0,0.5));
		Label_reward.setPosition(cc.p(-80+Image_rewardbg.getAnchorPointInPoints().x, 0+Image_rewardbg.getAnchorPointInPoints().y));
		Image_rewardbg.addChild(Label_reward);

		var Image_state=this.Image_state= UICtor.cImg("res/ui/dtz/match/img_9.png");
		Image_state.setPosition(cc.p(98+Image_matchCell1.getAnchorPointInPoints().x, 33+Image_matchCell1.getAnchorPointInPoints().y));
		Image_matchCell1.addChild(Image_state);

		var Label_state=this.Label_state= UICtor.cLabel("已开赛",24,cc.size(0,0),cc.color(15,109,219),0,0);
		Label_state.setAnchorPoint(cc.p(0,0.5));
		Label_state.setPosition(cc.p(118+Image_matchCell1.getAnchorPointInPoints().x, 33+Image_matchCell1.getAnchorPointInPoints().y));
		Image_matchCell1.addChild(Label_state);

		var Button_choose=this.Button_choose= UICtor.cBtn("res/ui/dtz/match/img_14.png");
		Button_choose.setPosition(cc.p(346+Image_matchCell1.getAnchorPointInPoints().x, 0+Image_matchCell1.getAnchorPointInPoints().y));
		Image_matchCell1.addChild(Button_choose);

		var Image_timebg=this.Image_timebg= UICtor.cImg("res/ui/dtz/match/img_21.png");
		Image_timebg.setPosition(cc.p(138+Image_matchCell1.getAnchorPointInPoints().x, -11+Image_matchCell1.getAnchorPointInPoints().y));
		Image_matchCell1.addChild(Image_timebg);

		var Image_dian=this.Image_dian= UICtor.cImg("res/ui/dtz/match/img_18.png");
		Image_dian.setPosition(cc.p(0+Image_timebg.getAnchorPointInPoints().x, -1+Image_timebg.getAnchorPointInPoints().y));
		Image_timebg.addChild(Image_dian);

		var fntUrl = "res/font/matchTime1.fnt";
		if (this.matchData.open == 0 && this.matchData.restTime){
			fntUrl = "res/font/matchTime.fnt";
		}

		var Label_fen = this.Label_fen = new cc.LabelBMFont("",fntUrl);
		Label_fen.setPosition(cc.p(Image_timebg.getAnchorPointInPoints().x - 52, Image_timebg.getAnchorPointInPoints().y));
		Image_timebg.addChild(Label_fen);
		var Label_miao = this.Label_miao = new cc.LabelBMFont("",fntUrl);
		Label_miao.setPosition(cc.p(Image_timebg.getAnchorPointInPoints().x + 47, Image_timebg.getAnchorPointInPoints().y));
		Image_timebg.addChild(Label_miao);

		this.addChild(Panel_16);

		this.setData(this.matchData);
		//添加点击事件
		UITools.addClickEvent(this.Button_choose, this, this.onApplyMatch);

		this.scheduleUpdate();
	},

	getMathchDate:function(currentTime,matchTime){
		var label = "";
		var matchTime = new Date(matchTime);
		var currentTime = new Date(currentTime);
		if(matchTime.getMonth() == currentTime.getMonth()){
			if(matchTime.getDate() == currentTime.getDate()){
				label = "今天";
			}else if((matchTime.getDate() - currentTime.getDate()) == 1){
				label = "明天"
			}else {
				label = (matchTime.getMonth()+1) + "月" + matchTime.getDate() +"日";
			}
		}else{
			label = (matchTime.getMonth()+1) + "月" + matchTime.getDate() +"日";
		}
		return label;

	},

	update:function(dt){
		this.dt += dt;
		if(this.countDown > 0) {
			if (this.dt >= 1) {
				this.dt = 0;
				this.countDown--;
				if (this.countDown < 60) {
					this.countDown = this.countDown < 10 ? "0" + this.countDown : this.countDown;
					this.Label_miao.setString("" + this.countDown);
					this.Label_fen.setString("00");
					if (parseInt(this.countDown) <= 0){
						this.Image_timebg.visible = false;
						this.Image_state.y = this.Image_matchCell1.getAnchorPointInPoints().y;
						this.Label_state.y = this.Image_matchCell1.getAnchorPointInPoints().y;
						this.Label_state.setString("报名中");
						this.open = 1;
						this.Button_choose.loadTextureNormal("res/ui/dtz/match/img_23.png");
					}
				} else {
					var minutes = Math.floor(this.countDown / 60);
					var seconds = this.countDown % 60;
					minutes = minutes < 10 ? "0" + minutes : minutes;
					seconds = seconds < 10 ? "0" + seconds : seconds;
					this.Label_fen.setString(minutes);
					this.Label_miao.setString(seconds);
				}
			}
		}
	},

	onApplyMatch:function(){
		//cc.log("发送报名请求this.keyId=="+this.keyId);
		if (this.open == 2){
			FloatLabelUtil.comText("比赛已开始,请及时报名下一场");
		}else if (this.open == 1){
			var data = [];
			var self = this;
			var hasShared = self.matchData.shared || 0;
			data.push({status:0,maxRenshu: self.matchData.maxCount, curRenshu: self.matchData.currentCount, matchType: self.matchType,
				keyId: self.keyId,award:self.matchExt.reward,matchPay:self.matchData.matchPay,shared:hasShared});
			PopupManager.removeAll();
			MatchApplyModel.init(data);

			if(PopupManager.hasClassByPopup(MatchApplyPop)){
				PopupManager.removeClassByPopup(MatchApplyPop);
			}
			var mc = new MatchApplyPop(false);
			PopupManager.addPopup(mc);
		}else{
			FloatLabelUtil.comText("暂未开赛");
		}

	},

	setData:function(data){
		var color = "e0731b";
		var stateStr = "";
		var manTexture = "res/ui/dtz/match/img_10.png";
		var stateTexture = "res/ui/dtz/match/img_19.png";
		var stateBtn = "res/ui/dtz/match/img_20.png";
		var rootTexture = "res/ui/dtz/match/img_17.png";
		var rewardTexture = "res/ui/dtz/match/img_24.png";
		var timeTexture = "res/ui/dtz/match/img_22.png";
		var dianTexture = "res/ui/dtz/match/img_26.png";
		/** open 0:未开始
		 1：已开始，可报名
		 2：比赛正在进行中，已开赛，不可以报名
		 3：已结束
		 * */
		var hours = "00";
		var minutes = "00";
		var open = this.open = data.open;
		var matchPay = data.matchPay;
		this.Image_timebg.visible = true;
		this.Image_state.y = 33+this.Image_matchCell1.getAnchorPointInPoints().y;
		this.Label_state.y = 33+this.Image_matchCell1.getAnchorPointInPoints().y;
		this.Label_state.x = 118+this.Image_matchCell1.getAnchorPointInPoints().x
		this.Image_state.visible = true;
		if (open == 1) {
			color = "204d8f";
			stateStr = "报名中";
			manTexture = "res/ui/dtz/match/img_11.png";
			stateTexture = "res/ui/dtz/match/img_9.png";
			stateBtn = "res/ui/dtz/match/img_23.png";
			rootTexture = "res/ui/dtz/match/img_16.png";
			rewardTexture = "res/ui/dtz/match/img_25.png";
			timeTexture = "res/ui/dtz/match/img_21.png";
			this.Image_timebg.visible = false;
			this.Image_state.y = this.Image_matchCell1.getAnchorPointInPoints().y;
			this.Label_state.y = this.Image_matchCell1.getAnchorPointInPoints().y;
			if (matchPay.indexOf("card") != -1){
				var cardStr = matchPay.substring(4);
				stateStr = "报名消耗"+ cardStr +"钻";
				this.Image_state.visible = false;
				this.Label_state.setAnchorPoint(cc.p(0.5,0.5));
				this.Label_state.x = 132+this.Image_matchCell1.getAnchorPointInPoints().x
			}
		} else if (open == 2) {
			color = "204d8f";
			stateStr = "已开赛";
			manTexture = "res/ui/dtz/match/img_11.png";
			stateTexture = "res/ui/dtz/match/img_9.png";
			stateBtn = "res/ui/dtz/match/img_14.png";
			rootTexture = "res/ui/dtz/match/img_16.png";
			rewardTexture = "res/ui/dtz/match/img_25.png";
			timeTexture = "res/ui/dtz/match/img_21.png";
			this.Image_state.y = this.Image_matchCell1.getAnchorPointInPoints().y;
			this.Label_state.y = this.Image_matchCell1.getAnchorPointInPoints().y;
			this.Image_timebg.visible = false;
		} else if (open == 3) {

		} else{
				if (data.restTime) {//倒计时报名阶段
					color = "204d8f";
					stateStr = "即将开赛";
					manTexture = "res/ui/dtz/match/img_11.png";
					stateTexture = "res/ui/dtz/match/img_9.png";
					stateBtn = "res/ui/dtz/match/img_20.png";
					rootTexture = "res/ui/dtz/match/img_16.png";
					rewardTexture = "res/ui/dtz/match/img_25.png";
					timeTexture = "res/ui/dtz/match/img_21.png";
					dianTexture = "res/ui/dtz/match/img_18.png";
					this.countDown = data.restTime;
					hours = Math.floor(this.countDown / 60);
					minutes = this.countDown % 60;
				} else if (data.matchTime){ //即将开赛阶段
					//计算开始时间
					var date = new Date(data.matchTime);
					var h = date.getHours();
					h = h < 10 ? ('0' + h) : h;
					var minute = date.getMinutes();
					minute = minute < 10 ? ('0' + minute) : minute;
					//cc.log("seconds==", h, minute)
					hours = h;
					minutes = minute;
					//得到日期
					if (data.currentTime){
						var dateStr = this.getMathchDate(data.currentTime,data.matchTime);
						stateStr = dateStr;
					}
				}
		}
		this.matchType = data.matchType;
		//条目背景底图
		this.Image_matchCell1.loadTexture(rootTexture);
		//奖励背景底图
		this.Image_rewardbg.loadTexture(rewardTexture);
		//时间背景底图
		this.Image_timebg.loadTexture(timeTexture);
		//两个点的底图
		this.Image_dian.loadTexture(dianTexture);
		this.Label_title.setString(data.matchName);
		this.Label_title.setColor(cc.color(color));

		this.Label_count.setString(data.maxCount);
		this.Label_count.setColor(cc.color(color));

		this.Label_state.setString(stateStr);
		this.Label_state.setColor(cc.color(color));


		this.Label_fen.setString(hours);
		this.Label_miao.setString(minutes);

		//奖励提示和奖励数目
		var matchDesc = "";
		if (data.matchDesc){
			var matchDescPram = data.matchDesc.split(";");
			for(var j = 0 ; j < matchDescPram.length ; j ++){
				//cc.log("matchDescPram[j]=="+matchDescPram[j]);
				matchDesc = matchDesc + matchDescPram[j] + "\n"
			}
		}
		this.Label_reward.setString(matchDesc);
		this.Image_count.loadTexture(manTexture);
		this.Image_state.loadTexture(stateTexture);
		this.Button_choose.loadTextureNormal(stateBtn);
	},

});

var MatchHomeLayer = BaseLayer.extend({
	ctor:function(){
		this._super(LayerFactory.MATCH_HOME_LAYER);
	},

	selfRender:function(){
		this.lastClickTime = 0;//添加连续点击间隔
		this.getWidget("rname").setString(PlayerModel.name);
		this.getWidget("rid").setString("ID:"+PlayerModel.userId);
		this.rcard = this.getWidget("rcard");
		this.coinNum = this.getWidget("coinNum");
		this.rcard.setString(PlayerModel.cards);
		this.coinNum.setString(DTZRoomModel.moneyToStr(PlayerModel.getCoin()));
		this.addCustomEvent(SyEvent.PLAYER_PRO_UPDATE,this,this.onPlayerUpdate);

		if(PlayerModel.sex != 1){
			if(this.getWidget("imgMan") ){
				this.getWidget("imgMan").visible = false;
			}
			if(this.getWidget("imgWeman") ){
				this.getWidget("imgWeman").visible = true;
			}
		}

		/**
		 * 金币场按钮
		 */
		var Button_diamond = this.getWidget("Button_49");
		UITools.addClickEvent(Button_diamond , this , this.onDiamondBtn);

		var Button_Back = this.getWidget("btnBack");
		UITools.addClickEvent(Button_Back , this , this.onGotoNormolPanel);

		var Button_Set = this.getWidget("btnMoneySet");
		UITools.addClickEvent(Button_Set , this , this.onSetUp);

		var Button_Rule = this.getWidget("btnMoneyRule");
		UITools.addClickEvent(Button_Rule , this , this.onRule);

		var Button_charget = this.getWidget("btn_Charge");
		UITools.addClickEvent(Button_charget , this , this.onMoneyCharget);

		//查看历史战绩
		var btn_record = this.getWidget("btn_record");
		UITools.addClickEvent(btn_record , this , this.onRecord);

		//头像
		var sten = new cc.Sprite("res/ui/dtz/dtzCom/header_mask.png");
		var clipnode = new cc.ClippingNode();
		clipnode.attr({stencil:sten,anchorX:0.5,anchorY:0.5,x:86,y:676,alphaThreshold:0.8});
		var sprite = new cc.Sprite("res/ui/dtz/dtzHome/testIcon.png");
		clipnode.addChild(sprite);
		this.root.addChild(clipnode,6);
		if(parseInt(PlayerModel.urlSchemeRoomId)>0){
			sy.scene.showLoading("正在进入房间");
		}

		//显示版本号
		if(this.getWidget("Label_version")){
			this.getWidget("Label_version").setString(SyVersion.v);
		}

		cc.loader.loadImg(PlayerModel.headimgurl,{width: 252, height:252},function(error, texture){
			if(error==null){
				sprite.setTexture(texture);
			}
			//连接socket
			if(PlayerModel.isDirect2Room()){
				if(PlayerModel.playTableId==0){
					SyEventManager.dispatchEvent(SyEvent.DIRECT_JOIN_ROOM);
				}else{//身上有房号
					FloatLabelUtil.comText("您已有房间，无法加入好友房间");
				}
			}else{
				if(!sySocket.isOpen()){
					sySocket.connect();
				}else{
					sy.scene.hideLoading();
				}
			}
		});

		this.Image_38 = this.getWidget("Image_38");
		this.Image_38.visible = false;

		if(LoginData.apkurl){//安卓整包更新
			AlertPop.showOnlyOk("发现最新版本，请更新后进入游戏", function(){
				OnlineUpdateUtil.downloadApk();
			});
		}


		//金币场按钮
		this.btn_dtz = this.getWidget("btn_Dtz");
		this.btn_pdk = this.getWidget("btn_Pdk");
		this.btn_phz = this.getWidget("btn_Phz");
		this.btn_bbt = this.getWidget("btn_Bbt");
		this.btn_pdk.setBright(this.curWafa == 2);
		this.btn_phz.setBright(this.curWafa == 3);
		this.btn_bbt.setBright(this.curWafa == 4);
		if (SdkUtil.isReview()) {
			this.btn_bbt.visible = false;
		}
		this.btn_dtz.btnTag = 1;
		this.btn_pdk.btnTag = 2;
		this.btn_phz.btnTag = 3;
		this.btn_bbt.btnTag = 4;

		UITools.addClickEvent(this.btn_dtz , this , this.onChangeWanfa);
		UITools.addClickEvent(this.btn_pdk , this , this.onChangeWanfa);
		UITools.addClickEvent(this.btn_phz , this , this.onChangeWanfa);
		UITools.addClickEvent(this.btn_bbt , this , this.onChangeWanfa);

		if(SdkUtil.isReview() && this.btn_phz){
			this.btn_phz.visible = false;
		}

		//金币场事件
		this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.changeSrvOver);
		this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
		this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);
		this.addCustomEvent(SyEvent.MATCH_RECORD_DATA, this , this.initRecordData);

		//初始化比赛场所有的控件
		this.matchListView = this.getWidget("ListView_match");

		this.posConfig = [252.5, 56.5 ,273.5];

	},

	initData: function () {
		this.initRecordData();
	},

	initRecordData:function(){
		//初始选中跑得快
		var self = this;
		var defaultPage = UITools.getLocalItem("sy_dtz_matchPage") || 1;
		if(defaultPage == 1){
			this.checkPage(this.btn_dtz);
		}else if(defaultPage == 2){
			this.checkPage(self.btn_pdk);
		}else if(defaultPage == 3){
			this.checkPage(this.btn_phz);
		}
	},

	onSetUp:function(){
		var mc = new SetUpPop(true);
		PopupManager.addPopup(mc);
	},


	/**
	 *
	 * 选择分页
	 */
	onChangeWanfa:function(obj){
		var curTime = new Date();
		if(this.lastClickTime == 0 || this.lastClickTime < curTime - 1200){
			this.lastClickTime = curTime;
		}else{
			FloatLabelUtil.comText("请不要点击太快哦！");
			return
		}

		cc.log("obj.btnTag::" , obj.btnTag);
		if(obj.btnTag == 1){
			ComReq.comReqMatchConfig([0,3],["jjs_dtz"]);
		}else if(obj.btnTag == 2){
			ComReq.comReqMatchConfig([0,3],["jjs_share_pdk"]);
		}else if(obj.btnTag == 3){
			FloatLabelUtil.comText("暂未开放");
			return;
		}else{
			FloatLabelUtil.comText("暂未开放");
			return;
		}
	},

	/**
	 * 本地有配置或者获取到配置后 刷新切页
	 * switch money game mode
	 */
	checkPage:function(obj){
		var tMoneyConfig = [];
		var curPage = obj.btnTag;

		cc.log("checkPage===="+curPage);
		if(curPage == 1){
			tMoneyConfig = MatchCfgModel.getDtzConfig();
		}else if(curPage == 2){
			tMoneyConfig = MatchCfgModel.getPdkConfig();
		}else if(curPage == 3){
			tMoneyConfig = MatchCfgModel.getPhzConfig();
		}
		//本地有玩法配置的情况
		if(tMoneyConfig.length > 0){
			this.loadConfig(tMoneyConfig);
			this.btn_dtz.setBright(curPage == 1);
			this.btn_pdk.setBright(curPage == 2);
			this.btn_phz.setBright(curPage == 3);
		}
	},


	/**
	 * 加载比赛场配置
	 */
	loadConfig:function(tMatchConfig){
		cc.log("加载比赛场配置loadConfig.................");
		var tAllConfig = tMatchConfig;
		if(tAllConfig.length == 0){
			FloatLabelUtil.comText("比赛场配置异常");
			LayerManager.showLayer(LayerFactory.HOME);
			return;
		}

		this.matchListView.removeAllItems();
		for(var index = 0 ; index < tAllConfig.length; index++){
			var matchItem = new MatchItem(tAllConfig[index] , this);
			this.matchListView.pushBackCustomItem(matchItem);
		}
	},

	onPlayerUpdate:function(){
		this.rcard.setString(PlayerModel.cards);
		this.coinNum.setString(DTZRoomModel.moneyToStr(PlayerModel.getCoin()));
	},

	getWanfa:function(){
		if(this.curWafa == 1){
			return "dtz";
		}else if(this.curWafa == 2){
			return "pdk";
		}else if(this.curWafa == 3){
			return "phz";
		}else{
			return "error";
		}
	},

	onJoinMoneyRoom:function(obj , ignoreLimit){
		var touchIndex = obj.clickTag;

		//第一个按钮特殊处理
		if(touchIndex == 0){

		}else{//not first button click to money room

		}

	},

	tryToJoinMoneyRoomLevel1:function(obj , ignoreLimit){
		var curCoin = PlayerModel.getCoin();
		var ignoreLimit = ignoreLimit || false;
		cc.log("PlayerModel.sex..." , PlayerModel.sex);
		if(this.hasPlayCoinRoom() == false && ignoreLimit == false && curCoin > 20000 && curCoin < 50000){
			var tDate = new Date();//记录这次弹框时间 用以判断当天是否已经已经弹出过
			cc.sys.localStorage.setItem("sy_lastMoneyTime" , tDate);
			cc.log("记录本次打金币场的时间：：",tDate);

			var self = this;
			var desc = "你的金币好多啊，去体验一把更刺激的中级场吧？（每天仅提示一次）";
			if(PlayerModel.sex == 1){
				desc = "小哥哥，你的金币好多啊，去体验一把更刺激的中级场吧？（每天仅提示一次）"
			}else{
				desc = "小姐姐，你的金币好多啊，去体验一把更刺激的中级场吧？（每天仅提示一次）"
			}

			AlertPop.show(desc,
				function(){
					self.tryToJoinMoneyRoomLevel2(self.getWidget("btn_level2") , true);
				},
				function(){
					self.tryToJoinMoneyRoomLevel1(self.getWidget("btn_level1") , true);
				});
			return;
		}else{
			if(curCoin >= 50000){
				//弹框提示
				var self = this;
				AlertPop.show("土豪，您的积分太多了，赶紧进入中级场挑战吧！", function(){
					self.tryToJoinMoneyRoomLevel2(self.getWidget("btn_level2"));
				});
			}else{
				this.curModeId = obj.modeId;

				this.moneyRoomLevel = 1;
				this.askCheckServer();
			}
		}
	},

	tryToJoinMoneyRoomLevel2:function(obj){
		this.curModeId = obj.modeId;
		this.moneyRoomLevel = 2;
		this.askCheckServer();
	},

	tryToJoinMoneyRoomLevel3:function(obj){
		this.curModeId = obj.modeId;
		this.moneyRoomLevel = 3;
		this.askCheckServer();
	},

	askCheckServer:function(){
		if(this.isChangingSrv){
			return;
		}
		this.isChangingSrv = true;
		var strparams = [];
		var moneyWanfa = 115;
		if(this.curWafa == 2){
			moneyWanfa = 16;
		}else if(this.curWafa == 3){
			moneyWanfa = 33;
		}
		//var modeId = moneyWanfa * 10 + this.moneyRoomLevel;
		var modeId = this.curModeId;
		strparams.push("1");
		strparams.push(modeId+"");
		cc.log("金币场请求切服..." , strparams );
		//sy.scene.showLoading("正在匹配玩家...");
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
		cc.log("选服完毕 请求后台加入房间消息 MatchHomeLayer"  , this.isChangingSrv);
		if(this.isChangingSrv){//由切服出发的重连成功才继续进入金币场
			this.doJoinMoneyRoom();
		}
	},

	onChooseCallBack:function(event){
		var status = event.getUserData();
		if(status==ServerUtil.GET_SERVER_ERROR){
			sy.scene.hideLoading();
			SyEventManager.dispatchEvent(SyEvent.REMOVE_MONEY_LOADING,{});
			this.isChangingSrv = false;
			//FloatLabelUtil.comText("加入金币场失败");
		}else if(status==ServerUtil.NO_NEED_CHANGE_SOCKET){
			this.onSuc();
		}
	},

	doJoinMoneyRoom:function(){
		this.isChangingSrv = false;
		var moneyWanfa = 115;
		if(this.curWafa == 2){
			moneyWanfa = 16;
		}else if(this.curWafa == 3){
			moneyWanfa = 33;
		}
		var roomTypeValue = moneyWanfa;
		var roomTypeAndLevel = this.curModeId;//moneyWanfa * 10 + this.moneyRoomLevel;
		sySocket.sendComReqMsg(2,[parseInt(1) , roomTypeValue],String(roomTypeAndLevel));
	},

	onShow:function() {
		cc.log("DTZMoneyHomeLayer::onShow...");

		var bgMusic = 1;
		AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,bgMusic);
		//if(this.waterAnimate){
		//	this.waterAnimate.play();
		//}else{
		//	this.initWaterAnimat()
		//}
		//this.schedule(this.showFish , 3);
	},

	onHide:function() {
		//this.unschedule(this.showFish);
		if(this.waterAnimate){
			//this.waterAnimate.stop();
		}
	},

	initWaterAnimat:function(){
		this.waterAnimate = new AnimateSprite(10 , "res/plist/waterAnm" , 1/15 , 2 , cc.rect(0 , 0 , 763 , 330));
		this.waterAnimate.x = 731.0; //720
		this.waterAnimate.y = 0; //166
		this.waterAnimate.anchorX = this.waterAnimate.anchorY = 0.5;
		this.waterAnimate.anchorY = 0;
		this.waterAnimate.setLocalZOrder(0);
		if(this.waterAnimate){
			this.waterAnimate.play();
		}
		this.root.addChild(this.waterAnimate , 0);
		//this.getWidget("Panel_8").addChild(this.waterAnimate , 0);
	},

	createHomeAm:function(armatureName,x,y,zOrder,parentNode) {
		var zOrder = zOrder  || 1;
		var tparentNode = parentNode || this.root;
		var armatureJson = "res/plist/"+armatureName+".ExportJson";
		ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
		var armature = new ccs.Armature(armatureName);
		armature.x = x;
		armature.y = y;
		armature.anchorX = armature.anchorY = 0.5;
		tparentNode.addChild(armature , zOrder);
		armature.getAnimation().play(armatureName, -1, 1);
		return armature;
	},

	showFish:function(){
		var fishType = 1;
		var initx = 800;
		var inity = 80;
		var offx = 100;
		var offy = 10;
		var x , y = 0;
		var scale = 1;
		fishType = parseInt(Math.random() * (3) + 1); //1 2 3
		if(fishType == 1){
			x = initx;
			y = inity;
			scale = 1;
		}else if(fishType == 2){
			x = initx - (fishType - 1) * offx;
			y = inity + (fishType - 1) * offy;
			scale = 0.9;
		}else if(fishType == 3){
			x = initx - (fishType - 1) * offx;
			y = inity + (fishType - 1) * offy;
			scale = 0.8;
		}

		//创建鱼动画
		if(this.fishAnimation == null){
			var plist = "res/plist/hallAM7.plist";
			var fileName = "hallAM7";
			var unit = 1/16;
			this.fishAnimation = new AnimateSprite(plist , fileName ,unit);
			this.root.addChild(this.fishAnimation , 1);
		}
		this.fishAnimation.stop();
		this.fishAnimation.x = x;
		this.fishAnimation.y = y;
		this.fishAnimation.scale = scale;
		this.fishAnimation.play();

	},

	/**
	 * 返回普通场
	 */
	onGotoNormolPanel:function(){
		cc.log("点击返回普通场次...");
		//PopupManager.remove(this);
		LayerManager.showLayer(LayerFactory.HOME);
	},


	/**
	 * 打开金币场规则
	 */
	onRule:function(){
		PopupManager.addPopup(new MatchRulePop());
	},

	onInvite:function(){
		var obj={};
		obj.tableId = 0;
		obj.userName=PlayerModel.username;
		obj.callURL=SdkUtil.SHARE_URL+'?userId='+encodeURIComponent(PlayerModel.userId);
		var content = "暂时不知道分享内容写什么";
		obj.title=content;
		obj.pyq=content;
		obj.description=content;
		obj.shareType=1;
		if (content== "" && SyConfig.hasOwnProperty("HAS_PNG_SHARE")) {
			obj.shareType=0;
			obj.png = "res/feed/feed.jpg";
		}
		obj.session = 1;
		SdkUtil.sdkFeed(obj,false);
	},

	onDiamondBtn:function(){
		PayPop.show();
	},

	onMoneyCharget:function(){
		PayPop.show(2);
	},

	/**
	 * 判断当天是否打过金币场了
	 */

	hasPlayCoinRoom:function(){
		var tData = this.getLocalItem("sy_lastMoneyTime");
		cc.log("tData::" , tData);
		if(tData){
			return UITools.checkIsSameDay(tData);
		}else{
			return false;
		}
	},

	getLocalItem:function(key){
		var val = cc.sys.localStorage.getItem(key);
		return val || 0;
	},

	onRecord:function(){
		ComReq.comReqMatchRecord([0,1,10]);
	}

})