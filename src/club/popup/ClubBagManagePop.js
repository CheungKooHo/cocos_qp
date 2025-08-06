/**
 * Created by leiwenwen on 2018/10/15.
 */


var ClubBagCell = ccui.Widget.extend({
    ctor:function(data,root,idx){
        this._super();

        this.data = data;
        this.keyID = 0;
        this.bagKeyID = 0;
        var temp  = this.temp = data.groupId;
        this.root = root;
        this.groupState = 1;

        this.setContentSize(1242, 142);


        var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(1242,142),cc.color(150,200,255),0);
        Panel_16.setAnchorPoint(cc.p(0,0));
        Panel_16.setPosition(0,0);
        var Button_roombg=this.Button_roombg= UICtor.cS9Img("res/ui/bjdmj/popup/pyq/wanfa/tiao.png",cc.rect(625,0,100,110),cc.size(1242,142));
        Button_roombg.setPosition(621,71);
        Panel_16.addChild(Button_roombg);

        var infoScroll = new ccui.ScrollView();
        infoScroll.setDirection(ccui.ScrollView.DIR_VERTICAL);
        infoScroll.setTouchEnabled(false);
        infoScroll.setContentSize(570,96);
        infoScroll.setPosition(cc.p(-460+Button_roombg.getAnchorPointInPoints().x,-70 + Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(infoScroll);
        this.infoScroll = infoScroll;

        var Label_detail=this.Label_detail= UICtor.cLabel("",27,cc.size(570,0),cc.color("#ba3d33"),0,0);
        Label_detail.setAnchorPoint(cc.p(0,0.5));
        Label_detail.setPosition(cc.p(0,infoScroll.height/2));
        infoScroll.addChild(Label_detail);

        var openBtn=this.openBtn= UICtor.cBtn("res/ui/bjdmj/popup/pyq/wanfa/guanbi.png");
        openBtn.setPosition(cc.p(230+Button_roombg.getAnchorPointInPoints().x, 0+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(openBtn);

        this.delBtn= UICtor.cBtn("res/ui/bjdmj/popup/pyq/wanfa/shanchu.png");
        this.delBtn.setPosition(cc.p(380+Button_roombg.getAnchorPointInPoints().x, 0+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(this.delBtn);

        var changeBtn=this.changeBtn= UICtor.cBtn("res/ui/bjdmj/popup/pyq/wanfa/xiugai.png");
        changeBtn.setPosition(cc.p(530+Button_roombg.getAnchorPointInPoints().x, 0+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(changeBtn);

        var BitmapLabel_order = this.BitmapLabel_order = UICtor.cLabel("1",48,cc.size(0,0),cc.color("#886032"),0,1);
        BitmapLabel_order.setPosition(70,Button_roombg.height/2);
        Button_roombg.addChild(BitmapLabel_order);

        var Label_bagName=this.Label_bagName= UICtor.cLabel("打筒子包厢名字啊",27,cc.size(270,31),cc.color("#6f1816"),0,1);
        Label_bagName.setAnchorPoint(cc.p(0,0.5));
        Label_bagName.setPosition(cc.p(-460+Button_roombg.getAnchorPointInPoints().x, 50+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(Label_bagName);
        var Label_wanfaType=this.Label_wanfaType= UICtor.cLabel("跑胡子啊",27,cc.size(0,0),cc.color("#6f1816"),0,1);
        Label_wanfaType.setAnchorPoint(cc.p(0,0.5));
        Label_wanfaType.setPosition(cc.p(-160+Button_roombg.getAnchorPointInPoints().x, 50+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(Label_wanfaType);
        //var Label_wanfaDetail=this.Label_wanfaDetail= UICtor.cLabel("玩法:",27,cc.size(0,0),cc.color("#ba3d33"),0,1);
        //Label_wanfaDetail.setAnchorPoint(cc.p(0,1));
        //Label_wanfaDetail.setPosition(cc.p(-450+Button_roombg.getAnchorPointInPoints().x, 15+Button_roombg.getAnchorPointInPoints().y));
        //Button_roombg.addChild(Label_wanfaDetail);

        this.addChild(Panel_16);

        openBtn.temp = temp;
        changeBtn.temp = temp;

        UITools.addClickEvent(openBtn,this,this.onSwitch);
        UITools.addClickEvent(changeBtn,this,this.onChange);
        UITools.addClickEvent(this.delBtn,this,this.onDeleteBag);


        cc.log("data =",JSON.stringify(data));
        if (data){
            this.keyID = data.keyId;
            this.groupState = data.groupState;
            this.bagKeyID = data.config.keyId;
        }

        this.setData(data,idx);


    },

    //显示数据
    setData:function(data,idx){

        this.BitmapLabel_order.setString(idx + 1);

        //显示游戏和房间
        var createPara = data.config.modeMsg.split(",");
        var gameStr = ClubRecallDetailModel.getGameName(createPara) || "";
        var wanfaStr = ClubRecallDetailModel.getWanfaStr(data.config.modeMsg,true) || "";

        var creditStr = "";
        if (data.config.creditMsg && data.config.creditMsg[0]){
            creditStr = " 比赛房";
        }

        this.Label_wanfaType.setString("玩法类型:" +gameStr);
        this.Label_bagName.setString(""+data.groupName);
        this.Label_detail.setString(wanfaStr + creditStr);

        var contentH = Math.max(this.infoScroll.height,this.Label_detail.height);
        this.infoScroll.setInnerContainerSize(cc.size(this.infoScroll.width,contentH));
        this.Label_detail.setPosition(0,contentH/2);

        if(contentH > this.infoScroll.height){
            var moveH = contentH-this.infoScroll.height;
            var action1 = cc.moveBy(moveH/20,cc.p(0,moveH));
            var action = cc.sequence(action1,action1.reverse()).repeatForever();
            this.Label_detail.runAction(action);
        }

        this.showSwitch()
    },

    showSwitch: function(){
        if (this.groupState == 1){
            this.openBtn.loadTextureNormal("res/ui/bjdmj/popup/pyq/wanfa/guanbi.png",ccui.Widget.LOCAL_TEXTURE);
        }else{
            this.openBtn.loadTextureNormal("res/ui/bjdmj/popup/pyq/wanfa/kaiqi.png",ccui.Widget.LOCAL_TEXTURE);
        }
    },

    /**
     * 入口开关
     */
    onSwitch: function(obj){
        var temp = obj.temp;
        var groupState = this.groupState;
        var desc = "";
        if (this.groupState == 0){
            groupState = 1;
            desc = "开启入口，确定开启吗？";
        }else{
            groupState = 0;
            desc = "关闭入口，确定关闭吗？";
        }
        var self = this;
        AlertPop.show(desc,function() {
            NetworkJT.loginReq("groupAction", "updateGroupInfo", {
                groupName: self.data.groupName, groupMode: 0,
                keyId: self.keyID, groupId: ClickClubModel.clickClubId, groupState: groupState,
                userId: PlayerModel.userId, subId: temp,sessCode:PlayerModel.sessCode
            }, function (data) {
                if (data) {
                    self.groupState = groupState;
                    self.showSwitch();
                    //PopupManager.remove(self.root);
                    SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ALLBAGS);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        })
    },


    /**
     * 修改包厢内容
     */
    onChange: function(obj){
        var wanfa = this.data.config.modeMsg.split(",") || [];
        var creditMsg = this.data.config.creditMsg.split(",") || [];
        var clubData = {modeId:this.bagKeyID,
            clubId:ClickClubModel.getCurClubId(),
            clubRole:ClickClubModel.getCurClubRole(),
            wanfaList:wanfa,
            isLeaderPay:ClickClubModel.getClubIsOpenLeaderPay(),
            subId:obj.temp,
            bagName:this.data.groupName,
            keyId:this.keyID,
            creditMsg:creditMsg};

        var mc = new MjCreateRoom(clubData);
        PopupManager.addPopup(mc);
    },

    /**
     * 进入某个包厢
     */
    onJoinBag: function(obj){
        var temp  = obj.temp;
        if (this.data){
            cc.log("进入包厢"+temp);
            var index = temp;
            ComReq.comReqGetClubRoomsData([ClickClubModel.getCurClubId(), 1, 100, 1, 1],["" + index ]);
        }
        PopupManager.remove(this.root);
    },

    /**
     * 删除某个包厢
     * userId	玩家id（必填）
     * keyId	记录id（必填）
     * groupId 包厢IDid（必填）
     */

    onDeleteBag:function(obj){
        var temp = obj.temp;
        var that = this;
        cc.log("this.bagKeyID=="+this.bagKeyID);
        var desc = "删除包厢，确认删除吗？";
        AlertPop.show(desc,function() {
            NetworkJT.loginReq("groupAction", "deleteTableConfig", {userId:PlayerModel.userId,keyId:that.bagKeyID,
                groupId:ClickClubModel.getCurClubId()}, function (data) {
                if (data) {
                    cc.log("deleteBag::"+JSON.stringify(data));
                    FloatLabelUtil.comText("删除成功");
                    SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ALLBAGS);
                }
            }, function (data) {
                cc.log("deleteBag::"+JSON.stringify(data));
                FloatLabelUtil.comText(data.message);
            });
        })

    },

})

var ClubBagManagePop = BasePopup.extend({
    show_version:true,
    ctor:function(data){
        this.data = data;
        //cc.log("ClubBagManagePop",JSON.stringify(this.data));
        this._super("res/clubBagManagePop.json");
    },

    selfRender:function(){

        var closeBtn = this.getWidget("close_btn");  // 前往大厅
        if(closeBtn){
            UITools.addClickEvent(closeBtn,this,this.onClose);
        }

        var Button_add = this.getWidget("Button_add");  // 前往大厅
        if(Button_add){
            UITools.addClickEvent(Button_add,this,this.onAdd);
        }

        this.ListView_rule = this.getWidget("ListView_rule");

        this.addCustomEvent(SyEvent.UPDATE_CLUB_BAGS,this,this.onRefreshBagsData);
        this.addCustomEvent(SyEvent.CLOSE_CLUB_BAGS,this,this.onClose);
        this.onShowBagItem();

        var qyqid = this.getWidget("label_qyq_id");
        qyqid.setString("亲友圈ID:" + ClickClubModel.getCurClubId());

        if(ClickClubModel.isClubCreaterOrLeader()){
            Button_add.x -= 250;
            var btn = new ccui.Button("res/ui/bjdmj/popup/pyq/btn_bag_order.png");
            btn.setPosition(Button_add.x + 500,Button_add.y);
            Button_add.getParent().addChild(btn,1);
            UITools.addClickEvent(btn,this,this.onClickOrder);
        }
    },

    onClickOrder:function(){
        var pop = new PyqSetOrderLayer(this.data);
        PopupManager.addPopup(pop);
    },

    onRefreshBagsData: function(event){
        var tData = event.getUserData();
        this.data = tData;
        this.onShowBagItem();
    },

    /**
     * 添加玩法
     */
    onAdd: function(obj){
        var clubData = {modeId:0,
            clubId:ClickClubModel.getCurClubId(),
            clubRole:ClickClubModel.getCurClubRole(),
            wanfaList:[],
            isLeaderPay:ClickClubModel.getClubIsOpenLeaderPay(),
            subId:0,
            bagName:""};

        var mc = new MjCreateRoom(clubData);
        PopupManager.addPopup(mc);
    },

    //显示所有的包厢
    onShowBagItem : function(){
        if (this.data){
            this.ListView_rule.removeAllItems();
            for (var i = 0; i < this.data.length ;i++) {
                var bagItem = new ClubBagCell(this.data[i], this,i);
                this.ListView_rule.pushBackCustomItem(bagItem);
            }
        }
    },

    onClose : function(){
        PopupManager.remove(this);
    }

})