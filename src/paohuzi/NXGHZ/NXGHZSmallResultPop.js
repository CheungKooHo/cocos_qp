/**
 * Created by zhoufan on 2016/11/29.
 */
var NXGHZSmallResultCell = ccui.Widget.extend({
	ctor:function(data,wanfa){
		this._super();
		var action = data.action;
		var cards = data.cards;
		var huxi = data.huxi || "";
		this.anchorX=0;
		this.anchorY=0;
		this.setContentSize(32,260);
		/*action
		* 5 碰
		* 6 吃
		* 14 坎
		* 3 歪
		* */
		if(action>=0){
			var imgName = ""
			if(cards.length >2){
				if(action == 3)imgName = "act3_1.png";
				if(action == 5)imgName = "act2.png";
				if(action == 6)imgName = "act6.png";
				if(action == 14)imgName = "act8.png";
			}

			var resStr = "res/ui/phz/" + imgName;

			var header = new cc.Sprite(resStr);

			header.x = 21;
			header.y = 240;
			if(PHZRoomModel.is2Ren()&& PHZRoomModel.isSpecialWanfa()){
				header.y = 195;
			}
			this.addChild(header);
		}
		var zorder = cards.length;
		for(var i=0;i<cards.length;i++){
			zorder--;
			var vo = PHZAI.getPHZDef(cards[i]);
			if(action==11 && i>0)
				vo.a = 1;
			if(action==3 && i>0)
				vo.a = 1;

			var ishu = false;
			if(cards[i]==ClosingInfoModel.huCard){
				ishu = true;
			}
			vo.ishu = ishu;
			var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
			card.x = 6;
			card.y = 40 + i * 39;
			this.addChild(card,zorder);
		}
		var label = UICtor.cLabel(huxi+"",24,cc.size(32,30),cc.color(128,51,6),1,1);//cc.color(129,49,0) ColorUtil.WHITE
		label.x = 21;
		label.y = 15;
		this.addChild(label);
	}
});

var onCardCell = ccui.Widget.extend({
	ctor:function(data){
		this._super();
		this.anchorX=0;
		this.anchorY=0;
		this.scale = 0.75;
		this.setContentSize(30,260);
		var tempY = 50;
		if(PHZRoomModel.is2Ren() && PHZRoomModel.isSpecialWanfa()){
			tempY = 40;
			this.scale = 1;
		}
		for(var i=0;i<data.length;i++){
			var ishu = false;
			if(data[i].c==ClosingInfoModel.huCard){
				ishu = true;
			}
			data[i].ishu = ishu;
			var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),data[i]);
			card.x = 8;
			card.y = tempY+i*40;
			this.addChild(card,data.length-i);
		}
	}
});

var NXGHZSmallResultPop=BasePopup.extend({
	pointInfo:null,
	isRePlay:null,
	ctor: function (data,isRePlay) {
		this.totalData = data
		if(isRePlay){
			this.data = data;
		}else{
			this.data = data.closingPlayers;
		}
		this.isRePlay = isRePlay;
		var path = "res/phzSmallResult.json";
		if(PHZRoomModel.is2Ren()&& PHZRoomModel.isSpecialWanfa()){
			path = "res/phzSmallResultTwo.json";
		}
		this._super(path);
	},

	showXingPai:function(){
		var xingId = ClosingInfoModel.ext[11];
		// cc.log("==========showXingPai============",xingId);
		if(xingId){
			var parent = this.getWidget("resultView");

			var labeltip = new cc.LabelTTF("醒牌","Arial",30);
			labeltip.setColor(cc.color.RED);
			labeltip.setPosition(900,450);
			parent.addChild(labeltip,10);

			var vo = PHZAI.getPHZDef(xingId);
			var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
			card.x = labeltip.x - 17;
			card.y = labeltip.y - 80;
			parent.addChild(card,10);
		}
	},

	showWangReplace:function(){
		var data = ClosingInfoModel.ext[8];
		//cc.log("==========showWangReplace============",data);
		if(data){
			var parent = this.getWidget("resultView");
			var ids = data.split(";");

			for(var i = 0;i<ids.length;++i){
				var vo1 = PHZAI.getPHZDef(81);
				var card1 = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo1);
				card1.x = 883 + i*50;
				card1.y = 510;
				parent.addChild(card1,10);

				var vo = PHZAI.getPHZDef(ids[i]);
				var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
				card.x = card1.x;
				card.y = card1.y - 40;
				parent.addChild(card,11);
			}
		}
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
		// cc.log("this.data=",JSON.stringify(this.data));
		for(var i=0;i<this.data.length;i++){
			if(this.data[i].seat == PHZRoomModel.mySeat){
				myPoint = this.data[i].point;
			}
		}
		var Image_84 = this.getWidget("Image_84");
		var imgUrl = myPoint > 0 ? "res/ui/phz/phzSmallResult/image_win.png" : "res/ui/phz/phzSmallResult/image_lose.png";
		Image_84.loadTexture(imgUrl);

		if(PHZRoomModel.wanfa == PHZGameTypeModel.SYBP  || PHZRoomModel.wanfa == PHZGameTypeModel.LDS
			|| PHZRoomModel.wanfa == PHZGameTypeModel.YZCHZ){
			if(ClosingInfoModel.huSeat){/**/

			}else{
				isHuang = true;
			}
		}else if(PHZRoomModel.wanfa == PHZGameTypeModel.LYZP){
			if (ClosingInfoModel.tun == 0){
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
		}else if(this.data.length==2){
			this.getWidget("user4").visible = false;
			this.getWidget("user3").visible = false;
		}

		if(PHZRoomModel.wanfa == PHZGameTypeModel.LDS || PHZRoomModel.wanfa == PHZGameTypeModel.YZCHZ){
			this.showXingPai();
			this.showWangReplace();
		}

		//大卓版
		var mingtangList = ["行行息：100息","多息：30息","对子息：200息","全黑胡：150息","乌对胡：300息",
			"一点红：100息", "十三红：150息","", "全求人：100息","十对：300息","大字胡：300息","小字胡：300息",
			"海底胡：50息","天胡：100息","报听：100息","背靠背：50息","手牵手：50息"];

		if(ClosingInfoModel.ext[14] == 0){
			mingtangList = ["行行息：60息","多息：15息","对子息：100息","全黑胡：80息","乌对胡：120息",
				"一点红：60息", "十三红：80息","", "全求人：60息","十对：120息","大字胡：120息","小字胡：120息",
				"海底胡：30息","天胡：60息","报听：60息","背靠背：30息","手牵手：30息"];
		}
		var str = "";
		var tunStr = ""
		var strArr = []

		var xingSeat = -1;
		var huSeat = -1;
		for(var i=0;i<this.data.length;i++){
			if(this.isSpecialPHZ()){
				this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i],this.pointInfo[i] , i);
			}else {
				this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i] , "" , i);
			}
			if(this.data[i].seat == this.data[i].isShuXing){
				xingSeat = i;
			}
			if(ClosingInfoModel.huSeat == this.data[i].seat){
				huSeat = i;
			}
			if(i>0){
				//俺也不知道这里为什么要重新设置位置 暂时注释掉
				/*if(ClosingInfoModel.ext[3]==32 || (ClosingInfoModel.ext[3]==38 && ClosingInfoModel.ext[7]==3)){
				 ccui.helper.seekWidgetByName(this.getWidget("user"+(i+1)),"name").setPosition(172,35);
				 ccui.helper.seekWidgetByName(this.getWidget("user"+(i+1)),"point").setPosition(256,28);
				 }else{
				 ccui.helper.seekWidgetByName(this.getWidget("user"+(i+1)),"name").setPosition(172,51);
				 ccui.helper.seekWidgetByName(this.getWidget("user"+(i+1)),"point").setPosition(256,35);
				 }*/
			}
			if(this.data[i].point > 0){
				if(this.data[i].qingHao>0){
					str += "基础分："+this.data[i].qingHao +"息\n"
				}
				if(this.data[i].waiHao>0){
					str += "坎歪溜："+this.data[i].waiHao +"息\n"
				}
				if(this.data[i].neiYuanNum>0){
					str += "内豪："+this.data[i].neiYuanNum +"息\n"
				}
				if(this.data[i].waiYuanNum>0){
					str += "外豪："+this.data[i].waiYuanNum +"息\n"
				}
				var dahus = this.data[i].dahus
				if (dahus){
					for(var j=0;j<dahus.length;j++) {
						if(dahus[j] == 6){
							var hongCount = 0
							for(var k = 0;k<this.data[i].mcards.length;k++){
								var cards = this.data[i].mcards[k].cards
								for(var t = 0;t<cards.length;t++){
									var voArray = PHZAI.getPHZDef(cards[t])
									if(voArray.n == 2 || voArray.n == 7 || voArray.n == 10){
										hongCount++;
									}
								}
							}
							mingtangList[6] = "十三红："+(150 + (hongCount - 13)*30) +"息"
							if(ClosingInfoModel.ext[14] == 0){
								mingtangList[6] = "十三红："+(80 + (hongCount - 13)*10) +"息"
							}
						}
						if(mingtangList[dahus[j]]){
							str = str + mingtangList[dahus[j]] + "\n"
						}
					}
				}
				str = str + "共计:" + this.data[i].point
			}
		}

		str = str + tunStr;

		var zimo = this.getWidget("zimo"); //自摸文本
		zimo.y += 55;

		zimo.setString("" + str);

		this.list = this.getWidget("ListView_6");
		if(PHZRoomModel.is2Ren()&& PHZRoomModel.isSpecialWanfa()){
			this.list_two = this.getWidget("ListView_6_0");
			this.list_two.visible = true;
		}

		if(PHZRoomModel.is2Ren()&& PHZRoomModel.isSpecialWanfa()) {
			for (var i = 0; i < this.data.length; i++) {
				var mcards = this.data[i].mcards
				//cc.log("cards",i, JSON.stringify(mcards))
				for (var j = 0; j < mcards.length; ++j) {

					if(mcards[j].action>=0) {
						var cell = new NXGHZSmallResultCell(mcards[j], PHZRoomModel.wanfa);
						if (i == 0) {
							this.list.pushBackCustomItem(cell);
						} else {
							this.list_two.pushBackCustomItem(cell);
						}
					}else{

						var otherCards = mcards[j].cards || [];
						var cardVo = PHZAI.getVoArray(otherCards);//剩余的牌
						var result = PHZAI.sortHandsVo(cardVo);
						for(var k=0;k<result.length;k++){
							var cell = new onCardCell(result[k]);
							if (i == 0) {
								this.list.pushBackCustomItem(cell);
							} else {
								this.list_two.pushBackCustomItem(cell);
							}
						}
					}
				}
			}
		}else{
			for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].point > 0) {
					var mcards = this.data[i].mcards
					for (var j = 0; j < mcards.length; ++j) {

						if (mcards[j].action >= 0) {
							var cell = new NXGHZSmallResultCell(mcards[j], PHZRoomModel.wanfa);
							this.list.pushBackCustomItem(cell);
						} else {
							var otherCards = mcards[j].cards || [];
							var cardVo = PHZAI.getVoArray(otherCards);//剩余的牌
							var result = PHZAI.sortHandsVo(cardVo);
							for (var k = 0; k < result.length; k++) {
								var cell = new onCardCell(result[k]);
								this.list.pushBackCustomItem(cell);
							}
						}
					}
				}
			}
		}
		//}
		var offX = 39;
		var Image_1 = this.getWidget("resultView");
		var leftCards = ClosingInfoModel.leftCards;
		var allLeftCards = ClosingInfoModel.startLeftCards;
		var dipaiHeight = 570;

		var dipaiPanel = this.getWidget("Panel_dipai");
		//
		//var dipai = new cc.Sprite("res/ui/phz/enddipai.png");
		//dipai.anchorX=dipai.anchorY=0;
		//dipai.x = initX;
		//dipai.y = dipaiHeight;
		//Image_1.addChild(dipai);

		var cpNum = 0;
		if (ClosingInfoModel.ext[14]){
			cpNum = parseInt(ClosingInfoModel.ext[14]);
		}

		var indexY = 20;
		if(PHZRoomModel.wanfa == PHZGameTypeModel.ZHZ){
			indexY = 18;
		}

		var otherDipai = [];
		if(PHZRoomModel.wanfa == PHZGameTypeModel.GLZP) {
			otherDipai.push(parseInt(ClosingInfoModel.ext[25]));
			var valArr = PHZRoomModel.getCardsByString(ClosingInfoModel.ext[27]);
			if(valArr.length > 0){
				ArrayUtil.merge(valArr,otherDipai);
			}
			ArrayUtil.merge(leftCards,otherDipai);
			var temp = leftCards;
			leftCards = otherDipai;
			otherCards = temp;
		}
		var scaleNum = 1;
		if(PHZRoomModel.is2Ren()&& PHZRoomModel.isSpecialWanfa()){
			indexY = 39;
			scaleNum = 1;
			if(leftCards.length > 30){
				scaleNum = 0.75;
				if(leftCards.length >= 35) {
					scaleNum = 0.65;
				}else if(leftCards.length >= 40){
					scaleNum = 0.55;
				}
			}
		}

		for(var i=0;i<leftCards.length;i++){ //leftCards
			// if (i >= cpNum){
			var index = i;
			var vo = PHZAI.getPHZDef(leftCards[i]);
			if(PHZRoomModel.wanfa == PHZGameTypeModel.GLZP){
				if(otherCards.indexOf(leftCards[i]) === -1){
					vo.zhe = 1;
				}
				if (i == leftCards.length - otherDipai.length){
					vo.ishu = true;
				}
			}else{
				if (i == 0){
					vo.ishu = true;
				}
			}
			var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
			// if(ArrayUtil.indexOf(leftCards , allLeftCards[i]) >= 0){
			// }else{
			// 	card.graySmallCard();
			// }
			var diffY = card.getContentSize().height *0.5;
			if(PHZRoomModel.is2Ren()&& PHZRoomModel.isSpecialWanfa()){
				card.scale = scaleNum;
			}
			var numY = Math.floor(index/indexY);
			var numX = index%indexY;
			card.x = 110 + numX * offX * scaleNum;
			card.y = card.y - diffY * numY;
			dipaiPanel.addChild(card);
			// }
		}
		var maipaiPanel = this.getWidget("Panel_maipai");
		var maiPaiCards = ClosingInfoModel.chouCards;
		if (maiPaiCards && maiPaiCards.length > 0){
			for(var i=0;i<maiPaiCards.length;i++){
				var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),PHZAI.getPHZDef(maiPaiCards[i]));
				var diffY = card.getContentSize().height *0.5;
				var numY = Math.floor(i/indexY);
				var numX = i%indexY;
				card.x = 60 + numX * offX;
				card.y = card.y - diffY * numY;
				maipaiPanel.addChild(card);
			}
		}else{
			maipaiPanel.visible=false;
		}
		if(PHZRoomModel.is2Ren()&& PHZRoomModel.isSpecialWanfa()){
			maipaiPanel.visible=false;
		}

		this.getWidget("huxi").visible = false;

		/*天胡 +10,地胡 +10,自摸 +10,
		 胡牌时只有一张红字，一点朱  翻倍,
		 胡牌时有10-12张红字，小红胡  翻倍,
		 胡牌时有13张红字或以上,大红胡 +60,
		 胡牌时全是黑字，乌胡 +60*/
		//ClosingInfoModel.fanTypes = [1,2,3,4,5,6,7];

		var intParams = this.isRePlay?PHZRePlayModel.intParams:PHZRoomModel.intParams;
		var exHaoFen = 0;
		var exMingTangFen = 0;
		if(intParams && intParams[10] == 2){//豪分加10
			exHaoFen = 10;
		}
		if(intParams && intParams[11] == 2){//名堂分加20
			exMingTangFen = 20;
		}

		this.resultView = this.getWidget("resultView");
		this.roomView = this.getWidget("roomView");

		var renshu = ClosingInfoModel.ext[7];

		this.Button_2 = this.getWidget("Button_2");
		this.Button_Ready = this.getWidget("btnReady");
		UITools.addClickEvent(this.Button_2,this,this.onOk);
		UITools.addClickEvent(this.Button_Ready,this,this.onOk);
		//this.Button_hand = this.getWidget("Button_hand");
		//UITools.addClickEvent(this.Button_hand,this,this.onHandCard);
		//this.Button_js = this.getWidget("Button_14");
		this.Button_zm = this.getWidget("Button_15");
		this.Button_toResultView = this.getWidget("btnToResultView");


		//UITools.addClickEvent(this.Button_js,this,this.onJieSuan);
		UITools.addClickEvent(this.Button_zm,this,this.onZhuoMian);
		UITools.addClickEvent(this.Button_toResultView , this, this.onJieSuan);
		this.onJieSuan();
		var btn_jiesan = this.getWidget("btn_jiesan");
		var btn_share = this.getWidget("btn_share");
		btn_share.visible = false;
		UITools.addClickEvent(btn_share,this,this.onShare);
		UITools.addClickEvent(btn_jiesan,this,this.onBreak);


		var btn_handXq = this.getWidget("btn_handXq");
		UITools.addClickEvent(btn_handXq,this,this.onHandCard);

		var Image_40 = this.getWidget("Image_40"); //自摸图片
		Image_40.visible = false;

		//版本号
		if(this.getWidget("Label_version")){
			this.getWidget("Label_version").setString(SyVersion.v);
		}
		var date = new Date();
		var hours = date.getHours().toString();
		hours = hours.length < 2 ? "0"+hours : hours;
		var minutes = date.getMinutes().toString();
		minutes = minutes.length < 2 ? "0"+minutes : minutes;
		if(this.getWidget("Label_time")){
			this.getWidget("Label_time").setString(hours+":"+minutes);
		}

		this.getWidget("Label_roomnum").setString("房间号:"+ClosingInfoModel.ext[0]);
		var jushuStr = "第" + PHZRoomModel.nowBurCount + "局";
		if (PHZRoomModel.wanfa == PHZGameTypeModel.SYZP || PHZRoomModel.wanfa == PHZGameTypeModel.CZZP
			|| PHZRoomModel.wanfa == PHZGameTypeModel.LYZP || PHZRoomModel.wanfa == PHZGameTypeModel.WHZ){
			jushuStr = "第" + PHZRoomModel.nowBurCount + "/" + PHZRoomModel.totalBurCount + "局 ";
		}
		this.getWidget("Label_jushu").setString(jushuStr);
		//玩法显示
		var wanfaStr = "";
		if (PHZRoomModel.wanfa == PHZGameTypeModel.CZZP && !this.isRePlay){
			var intParams = this.isRePlay?PHZRePlayModel.intParams:PHZRoomModel.intParams;
			var huxi = intParams[11]==2?6:intParams[11]==3?3:9;
			var tunStr = " 3息一囤";
			if (intParams[10] == 2){
				tunStr = " 1息一囤";
			}
			var zhuanhuanStr = huxi + "息1囤起";
			if (intParams[12] == 2){
				zhuanhuanStr = huxi + "息" + huxi/3 + "囤起";
			}
			wanfaStr = wanfaStr + " " + zhuanhuanStr + tunStr;
			if (intParams[14] == 2){
				wanfaStr = wanfaStr + " 红黑点";
			}
			if (intParams[14] == 3){
				wanfaStr = wanfaStr + " 红黑点2倍";
			}
		}
		this.getWidget("Label_wanfa").setString(wanfaStr);
		if(this.isRePlay){
			this.getWidget("Label_jushu").setString("第" + PHZRePlayModel.playCount + "局");
		}

		// cc.log("ClosingInfoModel.ext[25] ="+ClosingInfoModel.ext[25]+" ClosingInfoModel.ext[26] ="+ClosingInfoModel.ext[26]);
		if ((PHZRoomModel.wanfa == PHZGameTypeModel.HYLHQ || PHZRoomModel.wanfa == PHZGameTypeModel.HYSHK) && !this.isRePlay){
			if (PHZRoomModel.intParams[10] > 0  && ClosingInfoModel.ext[25] > 0 ){
				var vo = PHZAI.getPHZDef(parseInt(ClosingInfoModel.ext[25]));
				var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
				card.x = 900;
				card.y = 375;
				this.resultView.addChild(card);
				var string = PHZRoomModel.intParams[10] == 1?"跟醒":"翻醒";
				var label = UICtor.cLabel(string,24,cc.size(80,30),cc.color(128,51,6),1,1);
				label.x = 21;
				label.y = 65;
				card.addChild(label);
			}
		}

		if (this.isRePlay){
			this.getWidget("replay_tip").visible =  true;
		}
	},

	isSpecialPHZ:function(){
		return (ClosingInfoModel.ext[3] == 38 && ClosingInfoModel.ext[7] == 4)
	},

	refreshSingle:function(widget,user,pointInfo , index){
		// cc.log("index..." , index);
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

		if(PHZRoomModel.wanfa == PHZGameTypeModel.XXEQS){
			if(PHZRoomModel.bankerSeat == user.seat){
				var zhuang = new cc.Sprite("res/ui/phz/pp/Z_zhuang.png");
				zhuang.x = zhuang.width/2;
				zhuang.y = zhuang.height/2;
				sprite.addChild(zhuang);
			}
		}

		var point = ccui.helper.seekWidgetByName(widget,"point");

		var pointStr = "";
		var totalPointStr = "";
		if (parseInt(user.point) > 0 ){
			pointStr = "+" + user.point;
		}else{
			pointStr = "" + user.point;
		}
		if (PHZRoomModel.wanfa == PHZGameTypeModel.LYZP){
			if (user.bopiPoint!=0){
				if (parseInt(user.bopiPoint) > 0 ){
					pointStr = pointStr + " 提龙 +" + user.bopiPoint;
				}else{
					pointStr = pointStr + " 提龙 " + user.bopiPoint;
				}
			}
		}

		var label = new cc.LabelTTF(pointStr, "Arial", 24);
		label.setColor(cc.color(128,21,6));
		//var label = new cc.LabelBMFont(user.point+"",fnt);
		label.anchorX = 0;
		label.x = 0;
		label.y = 15;
		point.addChild(label,6);

		//cc.log("pointStr==="+pointStr);

		if (user.totalPoint != null ){
			if (PHZRoomModel.wanfa == PHZGameTypeModel.LDFPF){
				totalPointStr = "" + user.allHuxi;
			}else{
				totalPointStr = "" + user.totalPoint;
			}


			//}
			var str = ""
			if(PHZRoomModel.wanfa == PHZGameTypeModel.XXEQS){
				var chongfen = 0
				if(user.strExt[2] >= 0) {
					if (parseInt(user.point) > 0) {
						chongfen = "+"+ClosingInfoModel.fanTypes[3]
					}else{
						for(var i = 0;i<this.data.length;i++){
							if(this.data[i].point > 0){
								chongfen = -(parseInt(this.data[i].strExt[2])+ parseInt(user.strExt[2]))
								break;
							}
						}
					}
					str = "充"+chongfen +"\n"
				}
				str += "累计:" + totalPointStr;
			}else{
				str = "累计:" + totalPointStr;
			}

			var totalPoint = ccui.helper.seekWidgetByName(widget,"totalPoint");
			var label1 = new cc.LabelTTF(str, "Arial", 24);
			label1.setColor(cc.color(128,21,6));
			//var label = new cc.LabelBMFont(user.totalPoint+"","res/font/font_res_phz1.fnt");
			label1.anchorX = 0;
			//label1.anchorY = 0;
			label1.x = 0;
			label1.y = 15;
			totalPoint.addChild(label1,6);
		}

		//增加房主的显示
		if(user.userId == ClosingInfoModel.ext[1]){
			var fangzhu = new cc.Sprite("res/ui/phz/fangzhu.png");
			fangzhu.anchorX = fangzhu.anchorY = 0;
			fangzhu.x = 32;
			fangzhu.y = 30;
			widget.addChild(fangzhu,10);
		}
		if (index == 0){
			var nowPoint = this.getWidget("nowPoint");
			nowPoint.y -= 20
			nowPoint.setString("");
		}
		if(PHZRoomModel.wanfa == PHZGameTypeModel.CZZP || PHZRoomModel.wanfa == PHZGameTypeModel.WHZ || PHZRoomModel.wanfa == PHZGameTypeModel.LSZP){
			var piaoNum = user.strExt[10];
			if(PHZRoomModel.wanfa == PHZGameTypeModel.WHZ)piaoNum = user.finalPoint || -1;
			if (piaoNum!=-1){
				var pngUrl ="res/ui/phz/phzRoom/biao_piao"+piaoNum+".png";
				var piaofen = new cc.Sprite(pngUrl);
				// piaofen.anchorX = piaofen.anchorY = 0;
				piaofen.x = 75;
				piaofen.y = 15;
				widget.addChild(piaofen,10);
			}
		}else if(PHZRoomModel.wanfa == PHZGameTypeModel.XXEQS){
			var piaoNum = user.strExt[2];
			if (piaoNum!=-1){
				var pngUrl ="res/ui/phz/xxeqs/img_chongfen_"+piaoNum+".png";
				var piaofen = new cc.Sprite(pngUrl);
				piaofen.x = 75;
				piaofen.y = 15;
				widget.addChild(piaofen,10);
			}
		}
	},

	onOk:function(){
		if(ClosingInfoModel.isReplay || !LayerManager.isInRoom()){
			PopupManager.remove(this);
			return;
		}
		var data = this.data;

		if (ClosingInfoModel.ext[6] == 1) {//最后的结算
			PopupManager.remove(this);
			var mc = new YJGHZBigResultPop(this.totalData);
			PopupManager.addPopup(mc);
			var obj = HongBaoModel.getOneMsg();
			if (obj) {
				var mc = new HongBaoPop(obj.type, obj.data);
				PopupManager.addPopup(mc);
			}
		} else {
			if (PHZRoomModel.isStart) {
				PHZRoomModel.cleanSPanel();
				PopupManager.remove(this);
				sySocket.sendComReqMsg(3);
			} else {
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
		//cc.log("onHandCard ClosingInfoModel.huSeat..." , ClosingInfoModel.huSeat);
		var mc = new PHZHandCardPop(this.data,ClosingInfoModel.ext[1] , this.winUserId);
		PopupManager.open(mc,true);
	},

	onJieSuan:function(){
		/*    	this.Button_js.setBright(true);
		 this.Button_zm.setBright(false);
		 this.panel_16.visible = true;
		 this.panel_17.visible = false;*/

		this.resultView.visible = true;
		this.roomView.visible = false;
	},

	onZhuoMian:function(){
		/*    	this.Button_js.setBright(false);
		 this.Button_zm.setBright(true);
		 this.panel_16.visible = false;
		 this.panel_17.visible = true;*/

		this.resultView.visible = false;
		this.roomView.visible = true;

	}
});
