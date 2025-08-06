/**
 * Created by Administrator on 2016/6/27.
 */
var DTZTaskCell = ccui.Widget.extend({

    ctor:function(data,root){

        this.taskId = 0;
        this.taskType = null;
        this.root = root || null;
        this._super();

        this.setContentSize(cc.size(580,60));

        var Panel_107=this.Panel_107= UICtor.cPanel(cc.size(580,60),cc.color(150,200,255),0);
        Panel_107.setAnchorPoint(cc.p(0,0));
        Panel_107.setPosition(0,0);
        var Panel_taskCell=this.Panel_taskCell= UICtor.cPanel(cc.size(580,60),cc.color(150,200,255),0);
        Panel_taskCell.setAnchorPoint(cc.p(0,0));
        Panel_taskCell.setPosition(0,0);
        Panel_107.addChild(Panel_taskCell);
        var Image_dian=this.Image_dian= UICtor.cImg("res/ui/dtz/giftExChangePop/img_30.png");
        Image_dian.setPosition(16,30);
        Panel_taskCell.addChild(Image_dian);
        var Label_task=this.Label_task= UICtor.cLabel("完成10场牌局",24,cc.size(0,0),cc.color(166,94,71),0,0);
        Label_task.setAnchorPoint(cc.p(0,0.5));
        Label_task.setPosition(30,30);
        Panel_taskCell.addChild(Label_task);
        var Image_numberbg=this.Image_numberbg= UICtor.cImg("res/ui/dtz/giftExChangePop/img_2.png");
        Image_numberbg.setPosition(267,30);
        Panel_taskCell.addChild(Image_numberbg);
        var Label_number=this.Label_number= UICtor.cLabel("10/10",22,cc.size(0,0),cc.color(255,255,255),0,0);
        Label_number.setPosition(cc.p(0+Image_numberbg.getAnchorPointInPoints().x, 0+Image_numberbg.getAnchorPointInPoints().y));
        Image_numberbg.addChild(Label_number);
        var Image_couponbg=this.Image_couponbg= UICtor.cImg("res/ui/dtz/giftExChangePop/img_3.png");
        Image_couponbg.setPosition(384,30);
        Panel_taskCell.addChild(Image_couponbg);
        var Label_coupon=this.Label_coupon= UICtor.cLabel("258",22,cc.size(0,0),cc.color(255,255,255),0,0);
        Label_coupon.setPosition(cc.p(10+Image_couponbg.getAnchorPointInPoints().x, 0+Image_couponbg.getAnchorPointInPoints().y));
        Image_couponbg.addChild(Label_coupon);
        var Image_coupon=this.Image_coupon= UICtor.cImg("res/ui/dtz/giftExChangePop/img_15.png");
        Image_coupon.setPosition(cc.p(-38+Image_couponbg.getAnchorPointInPoints().x, 0+Image_couponbg.getAnchorPointInPoints().y));
        Image_couponbg.addChild(Image_coupon);
        var Button_state=this.Button_state= UICtor.cBtn("res/ui/dtz/giftExChangePop/img_20.png");
        Button_state.setPosition(507,30);
        Panel_taskCell.addChild(Button_state);
        Button_state.temp = 0;

        this.addChild(Panel_107);

        UITools.addClickEvent(Button_state, this, this.onState);

        this.setData(data);
    },

    setData:function(data){
        if (data){
            this.Label_task.setString(""+data.name);
            this.Label_number.setString(""+data.currentCount+"/"+data.totalCount);
            this.Label_coupon.setString(""+data.count);
            this.showBtnState(data.state);
            this.taskId = data.id || 0;
            this.taskType = data.type || null;
            if (data.type == "0"){
                this.Image_numberbg.visible = false;
                this.Image_couponbg.visible = false;
            }
        }
    },

    showBtnState:function(_state){
        //state：0未完成1已完成2已领奖
        var stateUrl = "res/ui/dtz/giftExChangePop/img_20.png";
        if (_state == 1){
            this.Button_state.temp = 1;
            stateUrl = "res/ui/dtz/giftExChangePop/img_16.png";
        }else if (_state == 2){
            this.Button_state.temp = 2;
            stateUrl = "res/ui/dtz/giftExChangePop/img_27.png";
        }
        this.Button_state.loadTextureNormal(stateUrl);
    },

    getTaskId:function(){
        return this.taskId;
    },

    onState:function(){
        var state = this.Button_state.temp;
        if (state == 1){
            //com消息code300
            //int数组
            //0:4
            //str数组
            //0：任务ID
             ComReq.comReqTaskGift([4],[""+this.taskId]);
        }else if (state == 2){

        }else{
            if (this.root){
                this.root.onClose();
            }
            //DTZMoneyCfgModel.cleanConfig();//重新进入金币场清空配置 重新获取
            //ComReq.comReqMoneyConfig([],["dtz,pdk,phz"]);
        }
        cc.log("onState======",this.Button_state.temp,this.taskId);
    }
});

var DTZGiftCell = ccui.Widget.extend({

    ctor:function(data){
        this.giftId1= null;
        this.giftId2= null;
        this.giftId3= null;
        this._super();

        this.setContentSize(cc.size(570,270));

        var Panel_107=this.Panel_107= UICtor.cPanel(cc.size(570,270),cc.color(150,200,255),0);
        Panel_107.setAnchorPoint(cc.p(0,0));
        Panel_107.setPosition(0,0);
        var Panel_taskCell=this.Panel_taskCell= UICtor.cPanel(cc.size(570,270),cc.color(150,200,255),0);
        Panel_taskCell.setAnchorPoint(cc.p(0,0));
        Panel_taskCell.setPosition(0,0);
        Panel_107.addChild(Panel_taskCell);
        var Image_giftbg1=this.Image_giftbg1= UICtor.cImg("res/ui/dtz/giftExChangePop/img_22.png");
        Image_giftbg1.setPosition(93,137);
        Panel_taskCell.addChild(Image_giftbg1);
        var Label_giftName1=this.Label_giftName1= UICtor.cLabel("iphone xs",24,cc.size(0,0),cc.color(80,27,0),1,0);
        Label_giftName1.setPosition(cc.p(0+Image_giftbg1.getAnchorPointInPoints().x, 112+Image_giftbg1.getAnchorPointInPoints().y));
        Image_giftbg1.addChild(Label_giftName1);
        var Image_gift1=this.Image_gift1= cc.Sprite("res/ui/dtz/giftExChangePop/img_9.png");
        Image_gift1.setPosition(cc.p(0+Image_giftbg1.getAnchorPointInPoints().x, 30+Image_giftbg1.getAnchorPointInPoints().y));
        Image_giftbg1.addChild(Image_gift1);
        var Label_coupon1=this.Label_coupon1= UICtor.cLabel("1000000",24,cc.size(0,0),cc.color(80,27,0),0,0);
        Label_coupon1.setPosition(cc.p(8+Image_giftbg1.getAnchorPointInPoints().x, -57+Image_giftbg1.getAnchorPointInPoints().y));
        Image_giftbg1.addChild(Label_coupon1);
        var Image_coupon1=this.Image_coupon1= UICtor.cImg("res/ui/dtz/giftExChangePop/img_14.png");
        Image_coupon1.setPosition(cc.p(-63+Image_giftbg1.getAnchorPointInPoints().x, -55+Image_giftbg1.getAnchorPointInPoints().y));
        Image_giftbg1.addChild(Image_coupon1);
        var Button_change1=this.Button_change1= UICtor.cBtn("res/ui/dtz/giftExChangePop/img_4.png");
        Button_change1.setPosition(cc.p(0+Image_giftbg1.getAnchorPointInPoints().x, -106+Image_giftbg1.getAnchorPointInPoints().y));
        Image_giftbg1.addChild(Button_change1);
        var Image_giftbg2=this.Image_giftbg2= UICtor.cImg("res/ui/dtz/giftExChangePop/img_22.png");
        Image_giftbg2.setPosition(286,137);
        Panel_taskCell.addChild(Image_giftbg2);
        var Label_giftName2=this.Label_giftName2= UICtor.cLabel("iphone xs",24,cc.size(0,0),cc.color(80,27,0),1,0);
        Label_giftName2.setPosition(cc.p(0+Image_giftbg2.getAnchorPointInPoints().x, 112+Image_giftbg2.getAnchorPointInPoints().y));
        Image_giftbg2.addChild(Label_giftName2);
        var Image_gift2=this.Image_gift2= cc.Sprite("res/ui/dtz/giftExChangePop/img_9.png");
        Image_gift2.setPosition(cc.p(0+Image_giftbg2.getAnchorPointInPoints().x, 30+Image_giftbg2.getAnchorPointInPoints().y));
        Image_giftbg2.addChild(Image_gift2);
        var Label_coupon2=this.Label_coupon2= UICtor.cLabel("2580",24,cc.size(0,0),cc.color(80,27,0),0,0);
        Label_coupon2.setPosition(cc.p(8+Image_giftbg2.getAnchorPointInPoints().x, -57+Image_giftbg2.getAnchorPointInPoints().y));
        Image_giftbg2.addChild(Label_coupon2);
        var Image_coupon2=this.Image_coupon2= UICtor.cImg("res/ui/dtz/giftExChangePop/img_14.png");
        Image_coupon2.setPosition(cc.p(-63+Image_giftbg2.getAnchorPointInPoints().x, -55+Image_giftbg2.getAnchorPointInPoints().y));
        Image_giftbg2.addChild(Image_coupon2);
        var Button_change2=this.Button_change2= UICtor.cBtn("res/ui/dtz/giftExChangePop/img_4.png");
        Button_change2.setPosition(cc.p(0+Image_giftbg2.getAnchorPointInPoints().x, -106+Image_giftbg2.getAnchorPointInPoints().y));
        Image_giftbg2.addChild(Button_change2);
        var Image_giftbg3=this.Image_giftbg3= UICtor.cImg("res/ui/dtz/giftExChangePop/img_22.png");
        Image_giftbg3.setPosition(476,137);
        Panel_taskCell.addChild(Image_giftbg3);
        var Label_giftName3=this.Label_giftName3= UICtor.cLabel("iphone xs",24,cc.size(0,0),cc.color(80,27,0),1,0);
        Label_giftName3.setPosition(cc.p(0+Image_giftbg3.getAnchorPointInPoints().x, 112+Image_giftbg3.getAnchorPointInPoints().y));
        Image_giftbg3.addChild(Label_giftName3);
        var Image_gift3=this.Image_gift3= cc.Sprite("res/ui/dtz/giftExChangePop/img_9.png");
        Image_gift3.setPosition(cc.p(0+Image_giftbg3.getAnchorPointInPoints().x, 30+Image_giftbg3.getAnchorPointInPoints().y));
        Image_giftbg3.addChild(Image_gift3);
        var Label_coupon3=this.Label_coupon3= UICtor.cLabel("2580",24,cc.size(0,0),cc.color(80,27,0),0,0);
        Label_coupon3.setPosition(cc.p(8+Image_giftbg3.getAnchorPointInPoints().x, -57+Image_giftbg3.getAnchorPointInPoints().y));
        Image_giftbg3.addChild(Label_coupon3);
        var Image_coupon3=this.Image_coupon3= UICtor.cImg("res/ui/dtz/giftExChangePop/img_14.png");
        Image_coupon3.setPosition(cc.p(-63+Image_giftbg3.getAnchorPointInPoints().x, -55+Image_giftbg3.getAnchorPointInPoints().y));
        Image_giftbg3.addChild(Image_coupon3);
        var Button_change3=this.Button_change3= UICtor.cBtn("res/ui/dtz/giftExChangePop/img_4.png");
        Button_change3.setPosition(cc.p(0+Image_giftbg3.getAnchorPointInPoints().x, -106+Image_giftbg3.getAnchorPointInPoints().y));
        Image_giftbg3.addChild(Button_change3);

        this.addChild(Panel_107);



        this.setData(data);

        Button_change1.temp = 1;
        Button_change2.temp = 2;
        Button_change3.temp = 3;
        UITools.addClickEvent(Button_change1, this, this.onExchange);
        UITools.addClickEvent(Button_change2, this, this.onExchange);
        UITools.addClickEvent(Button_change3, this, this.onExchange);
    },

    setData:function(data){

        for(var index = 1 ; index <= 3 ; index++){
            this["Image_giftbg"+index].visible = false;
            this["Image_gift"+index].visible = false;
        }

        for(var i = 0 ; i < data.length ; i++){
            var index = i + 1;
            var msgValue = JSON.parse(data[i].msgValue);
            this["Image_giftbg"+index].visible = true;
            this["Label_giftName"+index].setString(msgValue.goodsName);
            this["Label_coupon"+index].setString(msgValue.ticketCount);
            this["giftId"+index] = msgValue.id;
            var url = msgValue.goodsIcon;
            this.showGiftImg(this["Image_gift"+index],url);

        }

    },

    //显示奖品图片
    showGiftImg:function(obj,url){
        cc.loader.loadImg(url, {width: 252, height: 252}, function (error, img) {
            if (!error) {
                obj.visible = true;
                obj.setTexture(img);
            }else{

            }
        });

    },

    onExchange:function(obj){
        var self = this;
        AlertPop.show("         确定要兑换吗？",function(){
            if (self["giftId"+obj.temp]){
                ComReq.comReqTaskGift([5],[""+self["giftId"+obj.temp]]);
            }
        })
    }
});


var DTZGiftExchangePop = BasePopup.extend({

    ctor: function (data) {
        this.taskData = null;
        this.giftData = null;
        if (data){
            this.taskData = JSON.parse(data.strParams[0]);
            this.giftData = JSON.parse(data.strParams[1]);
        }
        this.giftNum = data.params[1] || 0;
        this._super("res/DTZGiftExchangePop.json");
    },

    selfRender: function () {

        var close_btn = this.getWidget("close_btn");
        UITools.addClickEvent(close_btn, this, this.onClose);

        var rule_btn = this.getWidget("rule_btn");
        UITools.addClickEvent(rule_btn, this, this.onRule);

        var record_btn = this.getWidget("record_btn");
        UITools.addClickEvent(record_btn, this, this.onRecord);


        //兑换券的总数
        this.giftnumLabel = this.getWidget("Label_giftnum");
        this.showGiftNum(this.giftNum);


        //任务滑动列表
        this.taskList = this.getWidget("ListView_task");

        //礼品滑动列表
        this.giftList = this.getWidget("ListView_gift");


        this.setTaskData(this.taskData);
        this.setGiftData(this.giftData);

        this.addCustomEvent(SyEvent.REFRESH_TASKGIFT_LIST,this,this.onRefreshData);
        this.addCustomEvent(SyEvent.REFRESH_ALLGIFT_NUM,this,this.onRefreshGiftNum);

    },

    onRefreshGiftNum: function (event) {
        var message = event.getUserData();
        var params = message.params;
        var strParams  = message.strParams;
        var Id = strParams[0];

        this.giftNum = params[1];
        var gifttype = params[2];//1是虚礼物品2是实物
        //显示已领取
        if (params[0] == 4){
            var items = this.taskList.getChildren();
            for(var index = 0 ; index < items.length ; index++){
                if(Id == items[index].getTaskId()){
                    items[index].showBtnState(2);
                }
            }
        }else if (params[0] == 5){
            if (gifttype == 2){
                var imgUrl = null;
                var giftName = "";
                var tipStr = "兑换成功，请联系客服微信kuailewan666进行领奖";
                for(var index = 0 ; index < this.giftData.length ; index++) {
                    var msgValue = JSON.parse(this.giftData[index].msgValue);
                    if(Id == msgValue.id){
                        imgUrl = msgValue.goodsIcon;
                        giftName = msgValue.goodsName;
                    }
                }
                var mc = new DTZGiftAlertPop(giftName,null,null,imgUrl,tipStr);
                PopupManager.addPopup(mc);
            }else{
                FloatLabelUtil.comText("兑换成功");
            }
        }
        this.showGiftNum(this.giftNum);
    },

    showGiftNum: function (num) {
        this.giftnumLabel.setString(""+num);
    },

    onRefreshData: function (event) {
        var data = event.getUserData();
        this.taskData = JSON.parse(data.strParams[0]);
        this.giftData = JSON.parse(data.strParams[1]);
        this.setTaskData(this.taskData);
        this.setGiftData(this.giftData);
    },
    setTaskData: function (data) {
        if (data){
            this.taskList.removeAllItems();
            if (data){
                for(var i = 0; i < data.length; i ++){
                    this.taskList.pushBackCustomItem(new DTZTaskCell(data[i],this));
                }
            }
        }
    },

    setGiftData: function (data) {
        if (data){
            this.giftList.removeAllItems();
            var giftData = [];
            var j = -1;
            for(var i = 0; i < data.length; i ++){
                if (i%3 == 0){
                    j = j + 1;
                    giftData[j] = [];
                }
                giftData[j].push(data[i]);
            }
            if (giftData){
                for(var i = 0; i < giftData.length; i ++){
                    this.giftList.pushBackCustomItem(new DTZGiftCell(giftData[i],i));
                }
            }
        }
    },

    onRule: function () {
        cc.log("打开规则界面");
        PopupManager.addPopup(new DTZGiftRulePop());
    },

    onRecord: function () {
        cc.log("打开兑换记录");
        ComReq.comReqTaskGift([8]);
    },

    onClose: function () {
        PopupManager.remove(this);
    }
});