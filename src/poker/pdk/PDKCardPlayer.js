/**
 * Created by zhoufan on 2015/8/15.
 * @class
 * @extend {cc.Class}
 */
var PDKCardPlayer = cc.Class.extend({
	/** @lends CardPlayer.prototype */
	_cards:null,

	/**
	 * {RoomPlayerVo}
	 */
	_playerVo:null,

	_isBt:false,
	_iconUrl:"",
	/**
	 *
	 * @param name {RoomPlayerVo}
	 * @param root {Object}
	 */
	ctor:function(vo,root,seq){
		this._isBt = false;
		this._iconUrl = "";
		this._playerVo = vo;
		this.isTuoguan = false;
		if(PDKRoomModel.isMoneyRoom()){
			this.coinNum = vo.ext[3];
		}else{
			this.coinNum = 0;
		}

		this.seq = seq;
		cc.log("seq..." , seq);
		this.iconbg = ccui.helper.seekWidgetByName(root,"player"+seq);
		this.iconbg.temp = vo.seat;
		this.iconbg.visible = true;
		this.name = ccui.helper.seekWidgetByName(root,"name"+seq);
		var nameStr = vo.name;
		nameStr = UITools.truncateLabel(nameStr,3);
		this.name.setString(nameStr);
		this.statusImg = ccui.helper.seekWidgetByName(root,"ybq"+seq);
		this.statusTexture = "";
		this.bt = ccui.helper.seekWidgetByName(root,"bt"+seq);
		this.point = ccui.helper.seekWidgetByName(root,"point"+seq);
		this.leave = ccui.helper.seekWidgetByName(root,"zl"+seq);
		this.leave.visible = false;
		this.yybg = ccui.helper.seekWidgetByName(root,"yy"+seq);
		this.yyts = ccui.helper.seekWidgetByName(root,"yyts"+seq);
		this.yybg.visible = false;
		this.cardBg = ccui.helper.seekWidgetByName(root,"cardBg"+seq);
		if(this.cardBg){
			this.cardN=ccui.helper.seekWidgetByName(root,"cardN"+seq);
			this.cardBg.visible=false;
		}
		this.heitao = ccui.helper.seekWidgetByName(root,"heitao"+seq);
		if(this.heitao){
			this.heitao.visible = false;
		}
		this.icon = ccui.helper.seekWidgetByName(root,"icon"+seq);
		this.icon.temp = vo.seat;
		this.fangzhu = ccui.helper.seekWidgetByName(root,"fangzhu"+seq);
		this.fangzhu.visible = false;
		if(PDKRoomModel.isMoneyRoom()){
			this.updatePoint(this.coinNum);
		}else if(PDKRoomModel.isMatchRoom()){
			this.updatePoint(vo.ext[9]);
		}else{
			this.updatePoint(vo.point);
		}
		if(this.bt){
			var animate = this.bt.getChildByTag(123);
			if(!animate){
				animate = new AnimateSprite("res/plist/baodan.plist","baodan",1/10);
				animate.anchorX=animate.anchorY=0;
				animate.x=animate.y=0;
				this.bt.addChild(animate,1,123);
			}else{
				animate.stop();
			}
		}
		this._cards = [];
		this.showIcon();

		var isFangzhu = PDKRoomModel.isPdkFangzhu(this._playerVo);
		if(PDKRoomModel.isMoneyRoom()){
			isFangzhu = (PDKRoomModel.getFirstOutSeat() == this._playerVo.seat);
		}
		this.fangzhuSign = ccui.helper.seekWidgetByName(root,"fangzhu"+seq);
		this.fangzhuSign.visible = isFangzhu;


		//ip相同提示
		this.ipSame = ccui.helper.seekWidgetByName(root,"ipSame"+seq);
		this.ipSame.visible = false;

		this.tuoguanSp = ccui.helper.seekWidgetByName(this.iconbg , "tuoguanSp");
		if(this.tuoguanSp){
			this.tuoguanSp.visible = false;
		}

		if(PDKRoomModel.isMoneyRoom()){
			//跑得快中是先手的标记
			//this.fangzhuSign.visible = false;
		}

		this.creditScore = ccui.helper.seekWidgetByName(root,"lableCreditScore"+seq);
		if (this.creditScore){
			this.creditScore.setString("");
		}
		var isCredit = PDKRoomModel.isCreditRoom();
		if (isCredit){
			if(PDKRoomModel.getIsSwitchCoin()){
				this.showHeadFrame()
			}else{
				var creditNum = PDKRoomModel.getCreditNum(this._playerVo);
				this.creditScore.setString("赛:"+creditNum);
			}
		}

		this.piaofen_img = this.icon.getChildByName("piaofen_img");
        if (!this.piaofen_img){
            this.piaofen_img = new cc.Sprite("res/ui/pdk/pdkRoom/biao_piao0.png");
            this.icon.addChild(this.piaofen_img,99999);
            this.piaofen_img.setName("piaofen_img");
            this.piaofen_img.x = 75;
            this.piaofen_img.y = 15;
            this.piaofen_img.visible = false;
        }
	},
	
	showPiaoFenImg:function(type){
        var pngUrl ="res/ui/pdk/pdkRoom/biao_piao"+type+".png";
        this.piaofen_img.setTexture(pngUrl);
        this.piaofen_img.visible =true;
    },
    hidePiaoFenImg:function(){
        this.piaofen_img.visible =false;
    },
	showDaNiaoImg:function(isShow){
		var img = this.icon.getChildByName("niao_img");
		if(isShow){
			if(!img){
				img = new cc.Sprite("res/ui/phz/phz_niao.png");
				this.icon.addChild(img,20);
				img.setName("niao_img");
				img.setPosition(this.icon.width - 10,10);
			}
			img.setVisible(true);
		}else{
			img && img.setVisible(false);
		}
	},

	showIsFirstOut:function(){
		var isFirstOut = 0;
		if(PDKRoomModel.isMoneyRoom()){
			isFirstOut = (PDKRoomModel.getFirstOutSeat() == this._playerVo.seat);
		}
		this.fangzhuSign.visible = isFirstOut;
	},

	//IP相同显示
	isIpSame:function(visible){
		if(!PDKRoomModel.isMoneyRoom() && PDKRoomModel.renshu != 2){
			this.ipSame.visible = visible;
		}else{
			this.ipSame.visible = false;
		}
	},

	updateTuoguan:function(isTuoguan){
		if(this.tuoguanSp && isTuoguan != null){
			cc.log("刷新托管状态的显示" , isTuoguan);
			this.tuoguanSp.visible = isTuoguan;
			this.isTuoguan = isTuoguan;
		}
	},

	showInfo:function(){
		var mc = new PlayerInfoPop(this._playerVo);
		PopupManager.addPopup(mc);
	},

	/**
	 * @returns {RoomPlayerVo}
	 */
	getPlayerVo:function(){
		return this._playerVo;
	},

	getPlayLastCardsNum:function(){
		return this._playerVo.ext[1];
	},

	getAnimationPos:function(direct , animationName){
		cc.log("direct , animationName"  , direct , animationName);
		var renshu = PDKRoomModel.renshu;

		var posx = 55;
		var posy = 65;


		if(animationName == "socialAM7"){//monkey
			posx = 45;
			posy = 50;
		}
		if(animationName == "socialAM4"){//boom
			posx = 40;
			posy = 80;
		}
		if(animationName == "socialAM3"){//ji
			posx = 55;
			posy = 65;
		}
		if(animationName == "socialAM6"){//ice
			posx = 45;
			posy = 85;
		}
		if(animationName == "socialAM5"){//beer
			posx = 50;
			posy = 80;
		}
		if(animationName == "socialAM2"){//fanqie
			posx = 55;
			posy = 80;
		}
		if(animationName == "socialAM1"){//kiss
			posx = 50;
			posy = 70;
		}
		
		return {x :posx , y:posy};
	},

	playPropArmature:function(temp){
		var armatureName = "socialAM"+temp;
		var armatureJson = "res/plist/"+armatureName+".ExportJson";
		ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
		var propArmature = new ccs.Armature(armatureName);

		cc.log("this.seq..." ,this.seq);
		var posMsg = this.getAnimationPos(this.seq , armatureName);
		propArmature.x = posMsg.x;
		propArmature.y = posMsg.y;
/*		if(this.seq == 2) {
			propArmature.x = 140;
		}else if(this.seq == 3){
			propArmature.x = 20;
		}*/

		propArmature.anchorX = propArmature.anchorY = 0.5;
		if(temp == 7){
			propArmature.setScale(0.7);
		}
		this.iconbg.addChild(propArmature,20);
		propArmature.getAnimation().setFrameEventCallFunc(function (bone, evt) {
			if (evt == "finish") {
				propArmature.getAnimation().stop();
				propArmature.removeFromParent(true);
			}
		});
		var musicName = "res/audio/fixMsg/prop"+temp+".mp3";
		AudioManager.play(musicName);
		propArmature.getAnimation().play(armatureName, -1, 0);
	},

	updateClubTableCoin:function(coin){
		if(this.Label_coin){
			this.Label_coin.setString(coin ||0)
		}
	},

	showHeadFrame:function(){
		if(this._playerVo.frameId > 0){
			var img = "res/ui/bjdmj/popup/pyq/playerinfo/img_vip_head_frame_"+this._playerVo.frameId+".png"
			this.headFrame = this.icon.getChildByName("headFrame")
			if(!this.headFrame){
				this.headFrame = new cc.Sprite();
				this.icon.addChild(this.headFrame,10)
				this.headFrame.setPosition(cc.p(this.icon.width/2,this.icon.height/2))
				this.headFrame.setName("headFrame")
			}
			this.headFrame.setTexture(img)
		}

		this.Label_coin = this.creditScore.getChildByName("Label_coin")
		if(!this.Label_coin){
			this.Label_coin = UICtor.cLabel("",20,cc.size(0,0),cc.color("#FFDF2D"),0,0);
			this.creditScore.addChild(this.Label_coin);
			this.Label_coin.setName("Label_coin")
			this.Label_coin.setPosition(15,0)
			this.Label_coin.setAnchorPoint(0,0.5)
			var coinImg = new cc.Sprite("res/ui/bjdmj/popup/pyq/img_jinbi.png");
			this.Label_coin.addChild(coinImg)
			coinImg.setPosition(-15,10)
		}
		this.Label_coin.setString(""+this._playerVo.coin)
	},

	showIcon:function(){
		//this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
		var url = this._playerVo.icon;
		var defaultimg = "res/ui/dtz/dtzCom/default_m.png" ;
		if(!url)
			url = defaultimg;
		if(this._iconUrl == url)
			return;
		if(this.iconbg.getChildByTag(345))
			this.iconbg.removeChildByTag(345);
		this._iconUrl = url;
		var sprite = new cc.Sprite(defaultimg);
		sprite.setScale(0.95);
		var sten = new cc.Sprite("res/ui/dtz/images/img_14_c.png");
		var clipnode = new cc.ClippingNode();
		clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: this.icon.width/2, y: this.icon.height/2,alphaThreshold: 0.8});
		clipnode.addChild(sprite);
		this.icon.addChild(clipnode,5,345);
		if(this._playerVo.icon){
			cc.log("加载网络头像")
			sprite.x = sprite.y = 0;
			try{
				var self = this;
				cc.loader.loadImg(this._playerVo.icon, {width: 252, height: 252}, function (error, img) {
					if (!error && (LayerManager.isInPDK())) {
						sprite.setTexture(img);
						sprite.x = 0;
						sprite.y = 0;
						SyEventManager.dispatchEvent(SyEvent.ROOM_ROLD_ICON,self._playerVo.seat);
					}else{
						self._iconUrl = "";
					}
				});
			}catch(e){}
		}else{
			SyEventManager.dispatchEvent(SyEvent.ROOM_ROLD_ICON,this._playerVo.seat);
			//sprite.x = this.icon.width/2;
			//sprite.y = this.icon.height/2;
			//this.icon.addChild(sprite,5,345);
		}
	},
	/**
	 * 显示剩余牌数
	 */
	showLastCard:function(){
		if(this.cardBg){
			//if(bo==false){
			//this.cardBg.visible=false;
			//return;
			//}
			if(this.cardN){
				this.cardN.setString(this._playerVo.ext[1]);
			}
			this.cardBg.visible = PDKRoomModel.isShowCardNumber();
		}
	},

	fastChat:function(data){
		var id = data.id;
		var sprite = null;
		var label = null;
		var content = "";
		if(id>0){//快捷聊天
			var array = ChatData.pdk_fix_msg;
			content = array[parseInt(id)-1];
		}else {
			if (id < 0) {//表情
				var armatureJson = "res/plist/faceAM" + data.content + ".ExportJson";
				var armatureName = "faceAM" + data.content;
				ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
				var chatArmature = new ccs.Armature(armatureName);
				chatArmature.x = 70;
				chatArmature.y = 50;
				if(this.seq == 2){//最后边的玩家 头像稍微往左边移动些
					chatArmature.x = 30;
				}
				this.iconbg.addChild(chatArmature, 22);
				var musicName = "res/audio/fixMsg/emoticon_" + data.content + ".mp3";
				AudioManager.play(musicName);
				chatArmature.getAnimation().setFrameEventCallFunc(function (bone, evt) {
					if (evt == "finish") {
						chatArmature.getAnimation().stop();
						chatArmature.removeFromParent(true);
						//ccs.armatureDataManager.removeArmatureFileInfo(armatureJson);
					}
				});
				chatArmature.getAnimation().play(armatureName, -1, 0);
			} else {
				content = data.content;
			}
		}
		if(content){
			var coords = {1:{x:-50,y:-20},2:{x:50,y:-20},3:{x:-50,y:-20},4:{x:-50,y:-20}};
			var coord = coords[this.seq];
			label = UICtor.cLabel(content,32,null,cc.color("FF361e06"),0,1);
			sprite = new cc.Scale9Sprite("res/ui/dtz/images/img_chat_4.png",null,cc.rect(30,0,10,64));
			if(this.seq==2){
				sprite.anchorX=1;sprite.anchorY=0;
			}else{
				sprite.anchorX=sprite.anchorY=0;
			}
			sprite.addChild(label);
			var height = (label.height+30)<64 ? 64 : (label.height+30);
			sprite.setContentSize(label.width+30,height);
			label.x = sprite.width/2;label.y = sprite.height/2;
			this.iconbg.addChild(sprite,20);
			sprite.opacity=0;sprite.x = this.yybg.x+coord.x;sprite.y=this.yybg.y+coord.y;
		}
		if(sprite){
			var self = this;
			if(label){
				label.runAction(cc.sequence(cc.fadeTo(0.3,255),cc.delayTime(2.5),cc.fadeTo(0.8,0)));
			}
			var action = cc.sequence(cc.fadeTo(0.3,255),cc.delayTime(2.5),cc.fadeTo(0.8,0),cc.callFunc(function(){
				self.iconbg.removeChild(sprite);
			}))
			sprite.runAction(action);
		}
	},

	startSpeak:function(){
		if(this.yybg.visible)
			return;
		this.yybg.visible = true;
		this.yybg.setOpacity(0);
		this.yyts.runAction(cc.fadeTo(0.8,255));
		this.yybg.runAction(cc.fadeTo(0.8,255));
	},

	stopSpeak:function(){
		var self = this;
		var action = cc.sequence(cc.fadeTo(0.8,0),cc.callFunc(function(){
			self.yybg.visible = false;
		}))
		this.yyts.runAction(cc.fadeTo(0.8,0));
		this.yybg.runAction(action);
	},

	/**
	 * 显示player的状态 准备、要不起
	 */
	showStatus:function(status){
		cc.log("pdk 刷新玩家状态显示" , status);
		if (status == 0){
			this.statusImg.visible = false;
			return;
		}
		this.statusImg.visible = true;
		var tMap ={"-1":"res/ui/pdk/pdkRoom/img_35.png","1":"res/ui/dtz/images/img_34.png"};
		var texture = tMap[status];
		var old = this.statusTexture;
		if(status==-1)
			RoomSound.yaobuqi(this._playerVo.userId);
		if(old && old == texture)
			return;
		this.statusTexture = texture;
		this.statusImg.loadTexture(texture);
	},

	leaveOrOnLine:function(status){
		if(status == 2){
			this.leave.visible = false;
		}else{
			this.leave.visible = true;
			var texture = (status==1) ? "res/ui/dtz/images/img_dx.png" : "res/ui/dtz/images/img_zl.png";
			this.leave.loadTexture(texture);
		}
	},

	hideLeaveSp:function(){
		if(this.leave && this.leave.visible && !this.isTuoguan){
			this.leave.visible = false
		}
	},


	setTrusteeship:function(status){
		if(status == 1){//比赛场托管
			this.leave.visible = true;
			var texture = "res/ui/images/match58.png";
			this.leave.loadTexture(texture);
		}else{
			this.leave.visible = false;
		}
	},

	/**
	 * 报停
	 */
	baoting:function(){
		if(this._isBt)
			return;
		if(this.seq != 1){
			var animate = this.bt.getChildByTag(123);
			animate.stop();
			animate.play();
			this.bt.visible = true;
		}
		this._isBt = true;
		PDKRoomModel.baoting(this._playerVo.seat);
		var self = this;
		setTimeout(function(){RoomSound.baoting(self._playerVo.userId)},1000);
	},

	exitRoom:function(){
		this.iconbg.visible = false;
		this.statusImg.visible = false;
	},

	updatePoint:function(point){
		if(PDKRoomModel.isMoneyRoom()){
			cc.log("显示玩家金币：" , point);
			if(point>= 0 && point < 1000000){
				this.point.setString(point);
			}else if(point < 0){
				this.point.setString("-" + Math.abs(point));
			}else{
				this.point.setString(DTZRoomModel.moneyToStr(point));
			}
		}else if(PDKRoomModel.isMatchRoom()){
			this.point.setString(point);
		}else{
			this.point.setString(point);
		}
	},

	updatePointByBomb:function(value){
		//cc.log("updatePointByBomb:::"+value);
		//if(PDKRoomModel.isMoneyRoom()){
		//	return;
		//}
		if(PDKRoomModel.isMatchRoom()){
			//cc.log("value:::"+value);
			this._playerVo.ext[9] = Number(this._playerVo.ext[9])+Number(value);
			this.point.setString(this._playerVo.ext[9]);
			//cc.log("比赛场this._playerVo.point:::"+this._playerVo.point);
		}else {
			if(PDKRoomModel.isMoneyRoom()){
				return;
			}
			this._playerVo.point += value;
			this.point.setString(this._playerVo.point);
		}
	},

	/**
	 * 拥有的牌
	 * @returns {null}
	 */
	getCards:function(){
		return this._cards;
	},

	deal:function(cards){
		this._cards = cards;
		this.sort();
	},

	sort:function(){
		//var length = this._cards.length;
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
		this._cards.sort(s1);
	},

	getContainer:function(){
		return this.iconbg;
	},



});