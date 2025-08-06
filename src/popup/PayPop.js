/**
 * Created by Administrator on 2016/6/27.
 */
var PayPop = BasePopup.extend({
	panelMa:null,
	panelChoose:null,
	data:{},
	ctor: function (data,agencyUserId,agencyName,defaultView,isShowIosPay) {
		this.data=data;
		this.agencyUserId = agencyUserId || 0;
		this.agencyName = agencyName || "";
		this.daichongIng = false;
		this.hasDTMConfig = false;
		this.hasMTDConfig = false;
		this.showIosPay = isShowIosPay || false;
		this.defaultView = defaultView || 1;
		//this._super("res/pay.json");
		this._super("res/marketPop.json");
	},

	selfRender: function () {
		//充值选项
		this.item=[];
		this.btn=[];
		this.addCustomEvent(SyEvent.GET_MONEYTODIAMOND_ITEMS , this , this.respShowMoneyToDiamondItems);
		this.addCustomEvent(SyEvent.GET_DIAMONDTOMONEY_ITEMS , this , this.respShowDiamondToMoneyItems);
		this.addCustomEvent(SyEvent.BUY_MONEY_ITEMS , this , this.respPayDaimondForMoney);
		this.addCustomEvent(SyEvent.BUY_DIAMOND_ITEM , this , this.respPayMoneyForDaimond);
		this.addCustomEvent(SyEvent.BIND_INVITECODE_SUC , this , this.bindSuc);
		for(var i=1;i<=6;i+=1){
			var index = 6-i;
			this.btn[i]=this.getWidget("btn"+i);
			this.item[i]=this.getWidget("item"+i);
			var obj=this.getData(index);
			this.getWidget("zs"+i).setString(obj.name);
			//this.getWidget("yuan"+i).setString("¥"+obj.amount);
			var str2 = parseFloat(obj.roomCards / obj.amount);
			str2 = Math.round(str2*10)/10;

			this.getWidget("exc"+i).setString("1元="+str2+"钻石");
			this.btn[i].temp = index;
			UITools.addClickEvent(this.btn[i],this,this.onChoose);
			this.getWidget("price_" + i).setString(obj.amount + "");
		}

		var but_gotoAct = this.getWidget("btn_GoActivity");
		this.Image_11 = this.getWidget("Image_11");
		this.Image_12 = this.getWidget("Image_12");
		this.Image_13 = this.getWidget("Image_13");
		this.Button_8 = this.getWidget("Button_8");
		//this.Button_8.temp = 1;
		this.Button_9 = this.getWidget("Button_9");
		//this.Button_9.temp = 2;
		this.Button_81 = this.getWidget("Button_81");
		if(but_gotoAct){
			UITools.addClickEvent(but_gotoAct , this , this.gotoAct);
		}
		//UITools.addClickEvent(this.Button_81,this,this.onCheckID);
		//UITools.addClickEvent(this.Button_8,this,this.onChongzhi);
		//UITools.addClickEvent(this.Button_9,this,this.onChongzhi);

		//关闭按钮
		var Button_close = this.getWidget("Button_close");
		var closePop = this.getWidget("close_btn");
		if(Button_close && closePop){
			UITools.addClickEvent(Button_close , this , this.onCloseHandler);
			UITools.addClickEvent(closePop , this , this.onCancelDaichong);
		}

		//金币兑换额度和上线
		this.lbCurCoin = this.getWidget("exDesc");
		this.lbCurCoin.setString("今日兑换额度：0/10000000");

		//钻石兑换额度和上限
		this.lbCurDia = this.getWidget("exMtdDesc");
		this.lbCurDia.setString("今日兑换额度：0/50000" + "  (兑换后剩余积分不能低于5000)");

		//代充界面相关
		this.btnDcSure = this.getWidget("btnDcSure");
		this.btnSearch = this.getWidget("btnSearch");
		this.playerIcon = this.getWidget("icon");
		this.playerName = this.getWidget("lbName");

		UITools.addClickEvent(this.btnDcSure, this , this.onSureDaiChong);
		UITools.addClickEvent(this.btnSearch, this , this.onSearch);
		var inputIdImg = this.getWidget("inputBg");
		this.inputId = new cc.EditBox(cc.size(263, 71),new cc.Scale9Sprite("res/ui/dtzjulebu/julebu/inputIdBg.png"));
		this.inputId.setString("");
		this.inputId.x = inputIdImg.width/2;
		this.inputId.y = inputIdImg.height/2;
		this.inputId.setFontColor(cc.color("7D2E00"));
		this.inputId.setDelegate(this);
		this.inputId.setFont("Arial",26);
		this.inputId.setMaxLength(30);
		this.inputId.setPlaceHolder("输入玩家ID");
		this.inputId.setPlaceholderFont("Arial" , 26);
		inputIdImg.addChild(this.inputId,0);
		this.playerIcon.visible = false;

		//界面选择
		var popList = {"Button_payPop1":1,"Button_payPop2":2,"Button_payPop3":3};
		this.addDtzClickEvent(popList , this.onPopSelect);
		if(this.showIosPay == false && SyConfig.isIos() && !SdkUtil.isReview()){
			this.getWidget("Button_payPop1").visible = false;
			this.getWidget("Button_payPop3").y = this.getWidget("Button_payPop2").y;
			this.getWidget("Button_payPop2").y = this.getWidget("Button_payPop1").y;
		}

		if(SdkUtil.isReview()){
			this.getWidget("Button_payPop3").visible = false ;
			this.getWidget("Button_payPop2").visible = false ;
		}

		//充值界面
		this.diamondView = this.getWidget("diamondMain");
		this.dtmView = this.getWidget("dtmMain");
		this.mtdView = this.getWidget("mtdMain");
		this.serachView = this.getWidget("serachPop");

		//勾选代充
		this.btnDaichong = this.getWidget("btnDaiChong");
		if(this.btnDaichong){
			this.daichongIng = false;
			this.btnDaichong.setBright(this.daichongIng);
			UITools.addClickEvent(this.btnDaichong , this, this.onClickDaikai);
		}

		//当前金币和钻石
		this.lbDiamond = this.getWidget("lbdiamond");
		this.lbMoney = this.getWidget("lbmoney");
		this.lbDiamond.setString(PlayerModel.getDiamond());
		this.lbMoney.setString(DTZRoomModel.moneyToStr(PlayerModel.getCoin()));
		this.addCustomEvent(SyEvent.PLAYER_PRO_UPDATE,this,this.onPlayerUpdate);

		if(SdkUtil.isReview()){
			this.btnDaichong.visible = false;
			this.getWidget("lbDesc").visible = false;
		}else{
			if(this.agencyUserId>0){
				this.getWidget("Label_12").setString("代充ID："+this.agencyUserId);
				this.getWidget("Label_12_0").setString("代充昵称："+this.agencyName);
				//this.Button_8.setBright(false);
				this.Image_12.visible = this.Image_11.visible = false;
				this.Image_13.visible = true;
				var btn = [];
				for(var i=1;i<=6;i+=1){
					var index = 6-i;
					btn[i] =this.getWidget("dcBtn"+i);
					var item=this.getWidget("item"+i);
					var obj = this.getData(index);
					this.getWidget("dcZs"+i).setString(obj.name);
					this.getWidget("dcPrice_"+i).setString("" + obj.amount);
					var str2 = parseFloat(obj.roomCards / obj.amount);
					str2 = Math.round(str2*10)/10;
					this.getWidget("dcExc"+i).setString("1元="+str2+"钻石");
					btn[i].temp = index;
					UITools.addClickEvent(btn[i],this,this.onChoose);
				}
			}else{
				//this.Button_9.setBright(false);
				//this.getWidget("Label_12").visible =false;
				//this.getWidget("Label_12_0").visible =false;
			}
		}
		this.onPopSelect(this["Button_payPop" + this.defaultView]);
	},

	gotoAct:function(){
		ActivityModel.sendOpenActivityMsg();
	},

	onPlayerUpdate:function(){
		this.lbDiamond.setString(PlayerModel.getDiamond());
		this.lbMoney.setString(DTZRoomModel.moneyToStr(PlayerModel.getCoin()));
	},

	bindSuc:function(){
		this.onPopSelect((this["Button_payPop1"]));
	},

	/**
	 * 1 充值界面 2 钻石换金币 3 金币换钻石
	 * @param defaultView
	 */
	loadDefaultView:function(defaultView){
		if(1 <= defaultView && defaultView <= 3){
			cc.log("PayPop 加载页面 defaultView:" , defaultView);
			this.onPopSelect(this["Button_payPop"+defaultView]);
		}

	},

	lightOneBtn:function(index){
		if(this.showIosPay == false && SyConfig.isIos() && index == 1 && !SdkUtil.isReview()){ //IOS屏蔽第一个按钮
			return;
		}

		for(var i=1;i<=3;i++){
			this["Button_payPop" + i].setBright(false);
		}
		this["Button_payPop" + index].setBright(true);
	},

	onPopSelect:function(obj){
		var clickId = parseInt(obj.temp);
		cc.log("onPopSelect..." , clickId);

		if(clickId == 1){
			if(PlayerModel.payBindId == ""){//未绑定邀请码 不显示实际内容 弹出提示绑定的弹出框
				return PopupManager.addPopup(new InvitationCodePop());
			}
			this.lightOneBtn(1);
			this.diamondView.visible = true;
			this.dtmView.visible = false;
			this.mtdView.visible = false;
		}else if(clickId == 2){
			//请求获取金币场商品
			if(this.hasDTMConfig){
				this.lightOneBtn(2);
				this.diamondView.visible = false;
				this.dtmView.visible = true;
				this.mtdView.visible = false;
			}else{
				this.reqDiamondToMoneyItemList();
			}
		}else if(clickId == 3){
			if(this.hasMTDConfig){
				this.lightOneBtn(3);
				this.diamondView.visible = false;
				this.dtmView.visible = false;
				this.mtdView.visible = true;
			}else{
				this.reqMoneyToDiamondItemList();
			}
		}
	},


	/**
	 * 获取金币场 钻石换金币商品列表
	 */
	reqDiamondToMoneyItemList:function(){
		//后台返回 1907
		sySocket.sendComReqMsg(906 , [0,0]);
		//sy.scene.showLoading("商品数据获取中");
	},

	respShowDiamondToMoneyItems:function(event){
		//sy.scene.hideLoading();
		this.lightOneBtn(2);

		//for(var i=1;i<=3;i++){
		//	this["Button_payPop" + i].setBright(false);
		//}
		//this["Button_payPop2"].setBright(true);
		cc.log("get money items config ..." , event.getUserData());

		var allData = event.getUserData();
		var curValue = parseInt(allData[0]);
		var totalValue = parseInt(allData[1]);
		this.lbCurCoin.setString("今日兑换额度："+curValue+"/"+totalValue);
		var itemConfig = JSON.parse(allData[2]);
		cc.log("itemConfigs ..." , itemConfig);


		this.diamondView.visible = false;
		this.mtdView.visible = false;
		this.dtmView.visible = true;

		for(var index = 5, itemIndex = 1 ; index >= 0 ; index -- , itemIndex ++){
			//cc.log("itemConfig[index]" , itemConfig[index]);
			var tCurConfig = (itemConfig[itemIndex-1]);

			var itemName = this.getWidget("moneyzs"+(itemIndex)) ;
			var itemPrice = this.getWidget("moneyprice_"+(itemIndex)) ;
			var itemDesc = this.getWidget("moneyexc"+(itemIndex));
			var itemBtn = this.getWidget("moneybtn"+itemIndex);
			itemName.setString(tCurConfig["name"]);
			itemPrice.setString(tCurConfig["amount"]);
			itemDesc.setString(tCurConfig["desc"])
			if(itemBtn){
				itemBtn.itemId = tCurConfig["id"];
				itemBtn.ItemBuydesc = "确定使用"+itemPrice.getString()+"钻石兑换"+itemName.getString()+"吗?";
				UITools.addClickEvent(itemBtn , this , this.onChoiceDtoMItem);
			}
		}
		this.hasDTMConfig = true;
	},


	/**
	 * 获取金币场 金币换钻石商品列表
	 */
	reqMoneyToDiamondItemList:function(){
		//后台返回 1907
		sySocket.sendComReqMsg(906 , [0,1]);
		//sy.scene.showLoading("商品数据获取中");
	},

	respShowMoneyToDiamondItems:function(event){
		//sy.scene.hideLoading();
		//cc.log("respShowMoneyToDiamondItems get money items config ..." , event.getUserData());
		this.lightOneBtn(3);
		//for(var i=1;i<=3;i++){
		//	this["Button_payPop" + i].setBright(false);
		//}
		//this["Button_payPop3"].setBright(true);
		var allData = event.getUserData();
		var curValue = parseInt(allData[0]);
		var totalValue = parseInt(allData[1]);
		this.lbCurDia.setString("今日兑换额度：" + Math.min(curValue , totalValue)+"/"+totalValue + "  (兑换后剩余积分不能低于5000)");
		var itemConfig = JSON.parse(allData[2]);
		cc.log("itemConfigs ..." , itemConfig);

		this.curViewId = 2;
		this.diamondView.visible = false;
		this.dtmView.visible = false;
		this.mtdView.visible = true;

		for(var index = 0,itemIndex = 6 ; index < 6 ; index ++ , itemIndex --) {
			var tItemNode = this.getWidget("mtditem"+itemIndex);
			tItemNode.visible = false;
			if(index < itemConfig.length){
				tItemNode.visible = true;
				//var tCurConfig = itemConfig[index]; 配置反过来显示
				var tCurConfig = itemConfig[itemConfig.length - index - 1];
				var itemName = this.getWidget("mtdzs" + (itemIndex));
				var itemPrice = this.getWidget("mtdprice_" + (itemIndex));
				var itemBtn = this.getWidget("mtdbtn" + (itemIndex));
				itemName.setString(tCurConfig["name"]);
				itemPrice.setString(tCurConfig["amount"]);
				if(itemBtn){
					itemBtn.itemId = tCurConfig["id"];
					itemBtn.ItemBuydesc = "确定使用"+itemPrice.getString()+"积分兑换"+itemName.getString()+"吗?";
					UITools.addClickEvent(itemBtn , this , this.onChoiceMtoDItem);
				}
			}
		}
		this.hasMTDConfig = true;
	},


	onChoiceDtoMItem:function(obj){
		var moneyItemId = obj.itemId;
		var desc = obj.ItemBuydesc;
		var self = this;
		AlertPop.show(desc,function() {
			self.reqPayDaimondForMoney(moneyItemId)
		});

		//var moneyItemId = obj.itemId;
		//this.reqPayDaimondForMoney(moneyItemId)
	},

	onChoiceMtoDItem:function(obj){
		var moneyItemId = obj.itemId;
		var desc = obj.ItemBuydesc;
		var self = this;
		AlertPop.show(desc,function() {
			self.reqPayMoneyForDiamond(moneyItemId)
		});

		//var moneyItemId = obj.itemId;
		//this.reqPayMoneyForDiamond(moneyItemId)
	},

	reqPayDaimondForMoney:function(moneyItemId){
		sySocket.sendComReqMsg(906 , [1,0, moneyItemId]);
	},

	reqPayMoneyForDiamond:function(moneyItemId){
		sySocket.sendComReqMsg(906 , [1,1, moneyItemId]);
	},

	respPayDaimondForMoney:function(event){
		cc.log("respPayDaimondForMoney ..." , event.getUserData());
		FloatLabelUtil.comText("兑换成功");
		var allData = event.getUserData();
		var curValue = parseInt(allData[0]);
		var totalValue = parseInt(allData[1]);
		this.lbCurCoin.setString("今日兑换额度："+ Math.min(curValue , totalValue)+"/"+totalValue);
	},

	respPayMoneyForDaimond:function(event){
		cc.log("respPayMoneyForDaimond ..." , event.getUserData());
		FloatLabelUtil.comText("兑换成功");
		var allData = event.getUserData();
		var curValue = parseInt(allData[0]);
		var totalValue = parseInt(allData[1]);
		this.lbCurDia.setString("今日兑换额度："+ Math.min(curValue , totalValue)+"/"+totalValue + "  (兑换后剩余积分不能低于5000)");
	},

	onClickDaikai:function(){
		this.daichongIng = !this.daichongIng;
		this.btnDaichong.setBright(this.daichongIng);
	},

	openDaichongView:function(){
		if(this.serachView){
			this.serachView.visible = true;
		}

	},

	onCancelDaichong:function(){
		//还原之前的查询显示
		//然后影藏查询框
		if(this.playerIcon.getChildByTag(345)){
			this.playerIcon.removeChildByTag(345);
			this.playerIcon.visible = false;
		}

		if(this.playerName){
			this.playerName.setString("");
			this.playerName.visible = false;
		}

		if(this.inputId){
			this.inputId.setString("");
		}

		if(this.serachView){
			this.serachView.visible = false;
		}
	},

	checkIsUserId:function(str){
		return true;//算了 前端还是不做保护吧 str.length == 6
	},

	onSureDaiChong:function(){
		var curDaichongId = this.inputId.getString();
		if(this.checkIsUserId(curDaichongId)){
			var index = this.clickItemIndex;
			this.agencyUserId = curDaichongId;
			var obj=this.getData(index);
			SdkUtil.sdkPay(obj.amount * 100 , index + 1 , this.agencyUserId);
		}else{
			FloatLabelUtil.comText("请输入正确的玩家ID");
		}

	},

	onCheckID:function(){
		var ID=parseInt(this.currentlyText.getString());
		var pattern = /^[\+\-]?\d*?\.?\d*?$/;
		var arr = this.currentlyText.getString().match(pattern);
		if(!arr || (this.currentlyText.getString()).length!=6 || !ID){
			return FloatLabelUtil.comText("ID错误,请重新输入!");
		}
		if(ID==PlayerModel.userId){
			return FloatLabelUtil.comText("不能给自己代充!");
		}
		var self = this;
		sy.scene.showLoading("正在检测");
		var url = csvhelper.strFormat(SyConfig.REQ_URL , "qipai" , "ovaliReplacedPay");

		Network.sypost(url,"ovaliReplacedPay",{fid:ID},
			function(data){
				if(data.code==0) {
					sy.scene.hideLoading();
					PopupManager.remove(self);
					PopupManager.addPopup(new PayPop(self.data,data.userId,data.userName));
				}
			},function(data){
				sy.scene.hideLoading();
				if(data.msg){
					FloatLabelUtil.comText(data.msg);
				}else{
					FloatLabelUtil.comText("检测失败");
				}
			}
		);
	},

	addDtzClickEvent:function(widgets , selector){
		for(var key in widgets){
			var widget = this[key] = this.getWidget(key);
			cc.log("key ..." , widgets , key)
			widget.temp = parseInt(widgets[key]);
			UITools.addClickEvent(widget,this,selector);
		}
	},

	onChongzhi:function(obj){
		var temp = obj.temp;
		if(temp==1) {
			this.Button_8.setBright(true);
			this.Button_9.setBright(false);
			this.Image_11.visible = true;
			this.Image_12.visible = false;
			this.Image_13.visible = false;
			this.agencyUserId = 0;
		}else{
			this.Button_9.setBright(true);
			this.Button_8.setBright(false);
			this.Image_11.visible = false;
			this.Image_12.visible = true;
			this.Image_13.visible = false;
			this.currentlyText = new cc.EditBox(cc.size(320, 71), new cc.Scale9Sprite("res/ui/dtz/dtzCom/scale9bg2.png"));
			this.currentlyText.setString("");
			this.currentlyText.x = 450;
			this.currentlyText.y = 100;
			this.currentlyText.setFontColor(cc.color("#7D2E00"));
			this.currentlyText.setDelegate(this);
			this.Image_12.addChild(this.currentlyText);
			this.currentlyText.setFont("Arial",30);
		}
	},

	onChoose:function(target){
		//判断是否勾选了帮人充
		this.clickItemIndex = target.temp;
		if(this.daichongIng){
			this.openDaichongView();
		}else{
			var index = this.clickItemIndex;
			var obj=this.getData(index);
			SdkUtil.sdkPay(obj.amount*100,obj.id,this.agencyUserId);
		}
	},

	/**
	 * 获取csv数据
	 * @param {Object} source
	 * @param {Integer} id
	 * @returns {Object}
	 */
	getData:function(id){
		id+=1;
		if(SdkUtil.isReview()){
			id+=10;
		}
		var array = this.data.payItem;
		if(!array){
			cc.log("csv not found:"+id);
			return null;
		}
		var result = {};
		for(var i=0,len=array.length;i<len;i+=1){
			if(array[i].id==id){
				result=array[i];
				break;
			}
		}
		return result;
	},

	buildId:function(id){
		return "id"+id;
	},

	showIcon: function (iconUrl) {
		var icon = this.playerIcon;
		var defaultimg ="res/ui/dtz/images/default_m.png";
		if(icon.getChildByTag(345))
			icon.removeChildByTag(345);

		var sprite = new cc.Sprite(defaultimg);

		if(iconUrl){
			try{
				var sten = new cc.Sprite("res/ui/dtzjulebu/julebu/iconBg.png");
				var clipnode = new cc.ClippingNode();
				clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 36, y: 36, alphaThreshold: 0.8});
				clipnode.addChild(sprite);
				icon.addChild(clipnode,5,345);
				var self = this;
				cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
					if (!error) {
						sprite.setTexture(img);
					}
				});
			}catch(e){}
		}else{
			sprite.x = 36;
			sprite.y = 36;
			icon.addChild(sprite,5,345);
		}
	},

	onSearch:function(){
		var userId = this.inputId.getString();
		var self =  this;
		if( parseInt(userId) > 0 ){//&& userId.length == 6
			NetworkJT.loginReq("groupAction", "loadUserBase", {userIds:userId}, function (data) {
				cc.log("loadUserBase..." , JSON.stringify(data));
				if (data && data.message.length > 0) {
					self.onShowPlayer(data.message[0]);
				}else{
					FloatLabelUtil.comText("玩家不存在");
				}
			}, function (data) {
				FloatLabelUtil.comText(data.message);
			});
		}
	},


	onShowPlayer:function(playData){
		if(playData == null){
			return;
		}
		var tplayData = playData;
		if(this.playerIcon){
			this.playerIcon.visible = true;
			this.playerName.setString(tplayData.userName);
			this.showIcon(tplayData.headimgurl);

			this.btnSearch.visible = false;
			if (!SdkUtil.isReview()) {
				this.btnDcSure.visible = true;
			}
		}
	},

});

PayPop.checkMa=function(num){
	sy.scene.showLoading("正在检测");
	var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","bindPayAgencyId");
	Network.sypost(url,"bindPayAgencyId",{userId:PlayerModel.username,flatId:PlayerModel.username,payBindId:num,pf:PlayerModel.pf},
		function(){
			sy.scene.hideLoading();
			PlayerModel.payBindId=num+"";
			PayPop.show();
		},function(){
			PayPop.checkMa(num);
		}
	);
},

PayPop.show=function(defaultView){
	defaultView = defaultView || 1;

	if(PlayerModel.payBindId == ""){
		if(SdkUtil.isReview()){
			return this.checkMa("220000");
		}else{
			defaultView = 2;
		}
	}

	sy.scene.showLoading("商品数据获取中");
	var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","getPayItems");
	cc.log("pay http : " , url);
	Network.sypost(url,"getPayItems",{gameCode:"dtz",userId:PlayerModel.username,flatId:PlayerModel.username,os:SyConfig.isIos()?1:0,pay:SdkUtil.isReview()?1:0},
		function(data){
			cc.log("getPayItems : " , JSON.stringify(data));
			SdkUtil.payType = data.payType || "webchanyoudtz";
			sy.scene.hideLoading();
			var isShowIosPay = (parseInt(data.iosState) == 1);//等于1是开启 否则IOS充值钻石影藏
			//
			if(isShowIosPay == false && SyConfig.isIos() && defaultView == 1 && !SdkUtil.isReview()){// && (SyConfig.VERSION_CODE!="1.0.5")移除版本审核的条件
				AlertPop.showOnlyOk("购买钻石请联系群主或者代理");
				return;
			}

			var mc = new PayPop(data, 0 , "" ,defaultView , isShowIosPay);
			PopupManager.addPopup(mc);

		},function(data){
			sy.scene.hideLoading();
			if(data.msg){
				FloatLabelUtil.comText(data.msg);
			}else{
				FloatLabelUtil.comText("商品数据获取失败");
			}
		}
	);
};