/**
 *  显示弹框基类
 * 	子类需实现selfRender方法
 * 
 */	
var BasePopup = cc.Layer.extend({

	_customEvents:null,

	ctor : function(json){
		cc.log("json",json);
		this._super();
		this.json = json;
		this._customEvents = {};
		this.loadComplete();
	},
	
	/**
	 * 加载完成后初始化UI
	 * 
	 */	
	loadComplete : function(){

		var grayLayer = this.grayLayer = new cc.LayerColor(cc.color(0,0,0,120),cc.winSize.width,cc.winSize.height);
		this.addChild(grayLayer);

		//全屏适配后，宽屏手机弹窗边上的地方点击会透传，用这个屏蔽下
		cc.eventManager.addListener(cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(){
				if(this.isVisible()){return true;}
				return false;
			}.bind(this)
		}),grayLayer);

		this.root = ccs.uiReader.widgetFromJsonFile(this.json);
		this.root.setPosition((cc.winSize.width - this.root.width)/2,(cc.winSize.height - this.root.height)/2);
		this.root.setBackGroundColorOpacity(0);
		this.addChild(this.root);

		this.txt_title = this.getWidget("Label_title");
		if(this.txt_title){
			this.txt_title.setFontSize(45);
			this.txt_title.enableOutline(cc.color("#9b520f"), 3);
		}

		var closeBtn = this.getWidget("close_btn");  // 关闭按钮
		if(closeBtn){
			UITools.addClickEvent(closeBtn,this,this.onCloseHandler);
		}
		var closeBtn1 = this.getWidget("close_btn1");// 关闭按钮1
		if(closeBtn1){
			UITools.addClickEvent(closeBtn1,this,this.onCloseHandler);
		}
		var mainmask = this.mainmask = this.getWidget("mainMask");
		this.mainpopup = this.getWidget("mainPopup");
		if(this.mainpopup){
			this.mainpopup.setTouchEnabled(true);
		}
		if(mainmask){
			UITools.addClickEvent(mainmask,this,this.onCloseHandler);
		}
		if(this["constructor"] != BasePopup){  // 如果构造类不是BasePopup
			this.selfRender();
		}
	},
	
	/**
	 * 基本UI初始化完成 子类继续
	 * 
	 */	
	selfRender : function(){
		throw new Error("Please implement selfRender method");
	},
	
	/**
	 * 获取内部元素
	 * @param name  部件名
	 */	
	getWidget : function(name){
		return ccui.helper.seekWidgetByName(this.root,name);
	},
	
	/**
	 * 关闭后调用 （子类重写）
	 * 
	 */	
	onClose : function(){
	},
	
	/**
	 * 打开后调用 （子类重写）
	 * 
	 */	
	onOpen : function(){
		
	},

	addCustomEvent:function(eventType,target,cb){
		if(!this._customEvents[eventType]){
			var listener = SyEventManager.addEventListener(eventType, target, cb);
			this._customEvents[eventType] = listener;
		}
	},

	removeEvents:function(events){
		var types = TypeUtil.isArray(events) ? events : [events];
		for (var i = 0; i < types.length; i++) {
			var et = types[i];
			var listener = this._customEvents[et];
			if(listener){
				SyEventManager.removeListener(listener);
				this._customEvents[et] = null;
			}
		}
	},

	onDealClose:function(){
		var events = [];
		for(var key in this._customEvents){
			events.push(key);
		}
		this.removeEvents(events);
	},
	
	onCloseHandler : function(){
		cc.log("onCloseHandler")
		PopupManager.remove(this);
	},
	shareCard:function(RoomModel,PlayerModel,shareID){
		var obj={};
		obj.tableId=RoomModel.tableId;
		obj.userName=PlayerModel.username;
		//obj.callURL=SdkUtil.SHARE_URL+'?num='+RoomModel.tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
		var jtf = RoomModel.tableType==1?"   亲友圈房间":"";
		var wanfaStr= "麻将";
		cc.log("11111111RoomModel.wanfa::",RoomModel.wanfa);
		switch (RoomModel.wanfa){
			case 113:
			case 114://打筒子
			case 115:
			case 116:
			case 117:
			case 118:
			case 210:
			case 211:
			case 212:
				wanfaStr= "打筒子";
				break;
			case 15:
			case 16:
				wanfaStr= "跑得快";
				break;
			case PHZGameTypeModel.SYZP://邵阳字牌
				wanfaStr= "邵阳字牌";
				break;
			case PHZGameTypeModel.SYBP://邵阳剥皮
				wanfaStr= "邵阳剥皮";
				break;
			case PHZGameTypeModel.LDFPF://放炮罚
				wanfaStr= "娄底放炮罚";
				break;
			case PHZGameTypeModel.CZZP://郴州字牌
				wanfaStr= "郴州字牌";
				break;
			case PHZGameTypeModel.LYZP://耒阳字牌
				wanfaStr= "耒阳字牌";
				break;
			case PHZGameTypeModel.ZHZ://捉红字
				wanfaStr= "捉红字";
				break;
			case PHZGameTypeModel.WHZ://岳阳歪胡子
				wanfaStr= "岳阳歪胡子";
				break;
			case PHZGameTypeModel.HYLHQ://衡阳六胡抢
				wanfaStr= "衡阳六胡抢";
				break;
			case PHZGameTypeModel.HYSHK://衡阳十胡卡
				wanfaStr= "衡阳十胡卡";
				break;
			case PHZGameTypeModel.LDS://落地扫
				wanfaStr= "落地扫";
				break;
			case PHZGameTypeModel.YZCHZ://永州扯胡子
				wanfaStr= "永州扯胡子";
				break;
			case PHZGameTypeModel.XTPHZ://湘潭跑胡子
				wanfaStr= "湘潭跑胡子";
				break;
			case PHZGameTypeModel.XXGHZ://湘乡告胡子
				wanfaStr= "湘乡告胡子";
				break;
			case PHZGameTypeModel.XXPHZ://湘乡跑胡子
				wanfaStr= "湘乡跑胡子";
				break;
			case PHZGameTypeModel.GLZP://桂林字牌
				wanfaStr= "桂林字牌";
				break;
			case PHZGameTypeModel.AHPHZ://安化跑胡子
				wanfaStr= "安化跑胡子";
				break;
			case PHZGameTypeModel.ZZPH://株洲碰胡
				wanfaStr= "株洲碰胡";
				break;
			case PHZGameTypeModel.NXPHZ://宁乡跑胡子
				wanfaStr= "宁乡跑胡子";
				break;
			case PHZGameTypeModel.HBGZP://湖北个子牌
				wanfaStr= "湖北个子牌";
				break;
			case PHZGameTypeModel.SMPHZ://石门跑胡子
				wanfaStr= "石门跑胡子";
				break;
			case PHZGameTypeModel.CDPHZ://常德跑胡子
				wanfaStr= "常德跑胡子";
				break;
			case PHZGameTypeModel.HSPHZ://汉寿跑胡子
				wanfaStr= "汉寿跑胡子";
				break;
			case PHZGameTypeModel.XXEQS://湘西2710
				wanfaStr= "湘西2710";
				break;
			case PHZGameTypeModel.NXGHZ://南县鬼胡子
				wanfaStr= "南县鬼胡子";
				break;
			case 131:
				wanfaStr= "半边天炸";
				break;
			case PHZGameTypeModel.YZLC://永州老戳
				wanfaStr= "永州老戳";
				break;
		}
		obj.title=wanfaStr+'战绩   房号：'+RoomModel.tableId +jtf;
		obj.description="本局玩家 ";
		obj.callURL=SdkUtil.SHARE_CAED_URL+shareID;
		for(var i=0;i<this.data.length;i++){
			var d = this.data[i];
			obj.description=obj.description+ d.name+" ";
		}
		cc.log(obj.callURL);
		obj.shareType=1;
		obj.session = 0;
		cc.log(JSON.stringify(obj));
		SdkUtil.sdkFeed(obj,true);
	},
})