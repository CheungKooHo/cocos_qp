/**
 * Created by zhoufan on 2015/8/15.
 */
var Room = BaseLayer.extend({
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

	ctor:function(){
		this._letOutButtonTouchable = true;
		this._cards = [];
		this._allCards = [];
		this._touchedCards = [];
		this._players = {};
		this.seatSeq = DTZRoomModel.seatSeq;
		this._super(LayerFactory.PDK_ROOM);
	},

	isForceRemove:function(){
		return true;
	},

	selfRender:function(){
		for(var i=1;i<=3;i++){
			if(i>1)
				this.getWidget("bt"+i).visible = false;
			this.getWidget("ybq"+i).visible = false;
			UITools.addClickEvent(this.getWidget("player"+i),this,this.onPlayerInfo);
			UITools.addClickEvent(this.getWidget("icon"+i),this,this.onPlayerInfo);
		}
		this.yuyin = this.getWidget("yuyin");//语音
		this.yuyin.visible = false;
		this.Image_40 = this.getWidget("Image_40");//闹钟
		this.Label_56 = this.getWidget("Label_56");//第几局

		this.Button_6 = this.getWidget("Button_6")//出牌;
		this.Button_4 = this.getWidget("Button_4")//提示;
		this.Button_30 = this.getWidget("Button_30");//准备
		//this.Button_20 = this.getWidget("Button_20");//退出房间
		//this.Button_25 = this.getWidget("Button_25");//解散房间
		//this.Image_set = this.getWidget("Image_set");
		this.Button_sset = this.getWidget("Button_sset");
		UITools.addClickEvent(this.Button_sset,this,this.onZhanKai)
		this.Button_6.visible = this.Button_4.visible = false;
		this.Button_17 = this.getWidget("Button_17");//邀请微信好友
		this.Button_17.visible = false;
		this.Label_27 = this.getWidget("Label_27");
		this.Label_39 = this.getWidget("Panel_time");//时间
		this.Button_40 =this.getWidget("Button_40");//语音按钮
		this.Button_42 =this.getWidget("Button_42");//快捷聊天
		//this.Button_23 =this.getWidget("Button_23");//设置
		//if(SyConfig.isIos())
		//	this.Button_40.visible = false;
		UITools.addClickEvent(this.Button_42,this,this.onChat);
		//UITools.addClickEvent(this.Button_23,this,this.onSetUp);
		var cardPanel = this._cardPanel = ccui.helper.seekWidgetByName(this.root,"cardPanel");
		this._touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan.bind(this),
			onTouchMoved: this.onTouchMoved.bind(this),
			onTouchEnded: this.onTouchEnded.bind(this)
		});
		cc.eventManager.addListener(this._touchListener, cardPanel);
	},

	onZhanKai:function(){
		//this.Image_set.visible = !this.Image_set.visible;
		var mc = new pdkRoomSetPop();
		PopupManager.addPopup(mc);
	},

	onPlayerInfo:function(obj){
		this._players[obj.temp].showInfo();
	},

	onSetUp:function(){
		var mc = new SetUpPop();
		PopupManager.addPopup(mc);
	},

	onChat:function(){
		var mc = new ChatPop();
		PopupManager.addPopup(mc);
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

	onTouchBegan: function (touch, event) {
		var touchPoint = touch.getLocation();
		this._touchBeganX = touchPoint.x;
		this._startX = touchPoint.x;
		var length = this._cards.length;
		this._startId = -1;
		this._currentlyMoveId = -1;
		for(var i=0;i<length;i++){
			var card = this._cards[i];
			if(card.hitTest(touchPoint)){
				if(card.cardId>this._startId){
					this._startId = card.cardId;
					this._currentlyMoveId = card.cardId;
				}
			}
		}
		if(this._startId>=0){
			this._cards[this._startId].touched();
			return true;
		}
		return false;
	},

	onTouchMoved: function (touch, event) {
		var touchPoint = touch.getLocation();
		this._isLeft2Right = (touchPoint.x>this._startX);
		this._isLeft2RightWithBegan = (touchPoint.x>this._touchBeganX);
		this._startX = touchPoint.x;
		var length = this._cards.length;
		var endedId = -1;
		for(var i=0;i<length;i++){
			var card = this._cards[i];
			if(card.hitTest(touchPoint)){
				if(card.cardId > endedId)
					endedId = card.cardId;
			}
		}
		if(endedId < 0){
			if(this._isLeft2Right){
				if(touchPoint.x>(this._cards[length-1].x+100))//过滤掉边缘
					endedId = AI.MAX_CARD-1;
			}else{
				if(touchPoint.x<this._cards[0].x)
					endedId = 0;
			}
			if(endedId<0)
				return;
		}
		for(var i=0;i<length;i++){
			var card = this._cards[i];
			if(this._isLeft2Right){
				if(card.cardId>=this._currentlyMoveId && card.cardId<=endedId){
					if(card.cardId==this._startId && card.hitTest(touchPoint) && card.isEnable()){
						//noting to do
					}else{
						this._currentlyMoveId = card.cardId;
						card.onTouchMove(this._isLeft2Right);
					}
				}
			}else{
				if(card.cardId>=endedId && card.cardId<=this._currentlyMoveId){
					if(card.cardId==endedId && card.hitTest(touchPoint) && card.isEnable()){
						//noting to do
					}else{
						this._currentlyMoveId = card.cardId;
						card.onTouchMove(this._isLeft2Right);
					}
				}
			}
		}
	},

	onTouchEnded: function (touch, event) {
		this._allCards.length = 0;
		var touchPoint = touch.getLocation();
		var length = this._cards.length;
		var endedId = -1;
		for(var i=0;i<length;i++){
			var card = this._cards[i];
			if(card.hitTest(touchPoint)){
				if(card.cardId > endedId)
					endedId = card.cardId;
			}
		}
		if(endedId < 0){
			endedId = this._isLeft2RightWithBegan ? AI.MAX_CARD-1 : 0;
		}
		for(var i=0;i<length;i++){
			var card = this._cards[i];
			if(this._isLeft2RightWithBegan){
				if(card.cardId>=this._startId && card.cardId<=endedId)
					card.touched();
			}else{
				if(card.cardId>=endedId && card.cardId<=this._startId)
					card.touched();
			}
		}
		var allCards = [];
		for (var i = 0; i < this._cards.length; i++) {
			var card = this._cards[i];
			card.clearDirect();
			if(card.isTouched()){
				card.selectAction();
			}
			card.untouched();
			if(card.isSelected())
				allCards.push(card.getData());
		}
		this._allCards = allCards;
		this.isCanLetOut();
		AudioManager.play("res/audio/common/audio_card_click.mp3");
	},

	changeLetOutButton:function(isTouch){
		if(isTouch == this._letOutButtonTouchable)
			return;
		this._letOutButtonTouchable = isTouch;
		if(isTouch){
			this.Button_6.setTouchEnabled(true);
			this.Button_6.loadTextureNormal("res/ui/pdk/pdkRoom/btn_2.png");
		}else{
			this.Button_6.setTouchEnabled(false);
			this.Button_6.loadTextureNormal("res/ui/pdk/pdkRoom/btn_5.png");
		}
	},

	isCanLetOut:function(){
		//cc.log("isCanLetOut1::"+JSON.stringify(this._lastCardPattern));
		this._cCardPattern = AI.filterCards(this._allCards,this.getCardsOnHand(),this._lastCardPattern);
		//cc.log("isCanLetOut2::"+JSON.stringify(this._cCardPattern));
		if(this._lastCardPattern && this._cCardPattern && this._cCardPattern.type != this._lastCardPattern.type && this._cCardPattern.type != AI.BOMB)
			this._cCardPattern = null;
		//cc.log("isCanLetOut3::"+JSON.stringify(this._cCardPattern));
		this.changeLetOutButton((this._cCardPattern!=null));
		if(this._allCards.length<=0)//把选中的牌全部取消了,提示的数据也需要清掉
			DTZRoomModel.prompt(null);
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
		if(this._cards.length == 0){
			var winSize = cc.director.getWinSize();
			var centerX = (winSize.width - this._cardW)/2;
			var initX = (winSize.width - (this._cardW+this._cardG*(cards.length-1)))/2;
			for(var i=0;i<cards.length;i++){
				var card = new PDKBigCard(cards[i]);
				card.cardId = i;
				card.anchorX=card.anchorY=0;
				var realX = initX+i*this._cardG;
				card.x = centerX;
				card.y = 0;
				this._cardPanel.addChild(card);
				this._cards.push(card);
				card.letOutAnimate(realX);
			}
		}
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
			var nextSeq = this.getPlayerSeq(-1,DTZRoomModel.mySeat,this.seatSeq[seat][1]);
			this.getWidget("small"+nextSeq).removeAllChildren(true);
		}else{
			if(cardIds.length>0){
				var overSeq = this.getPlayerSeq(-1,DTZRoomModel.mySeat,seat);
				this.getWidget("small"+overSeq).removeAllChildren(true);
			}
		}
		if(cardIds.length==0)
			return;
		AudioManager.play("res/audio/common/audio_card_out.mp3");
		var seq = 1;
		if(seat == DTZRoomModel.mySeat){//自己出牌
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
			var initX = (winSize.width - (this._cardW+this._cardG*(length-1)))/2;
			for(var i=0;i<length;i++){
				this._cards[i].x = initX+i*this._cardG;
				this._cards[i].cardId = i;
			}
		}else{
			seq = this.getPlayerSeq(-1,DTZRoomModel.mySeat,seat);

			var playerVo=DTZRoomModel.getPlayerVoBySeat(seat);
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
	}
});
