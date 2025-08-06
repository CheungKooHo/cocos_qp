/**
 * Created by kfc on 2019/11/23.
 */

var DuiHuanShop_Tool = {
    DuihuanShop_signKey:"dfc2c2d62dde2c104203cf71c6e15580",
    Tip_Type:{
        TIP : 1,
        USERINFO : 2,
    },
    
    getUrl:function(_url){
        var time = Math.round(new Date().getTime()/1000).toString();
        var char_id = PlayerModel.userId;
        var random_num = Math.floor(Math.random()*1000000);
        var params = {
            "char_id" : char_id,
            "rand" : random_num,
            "t" : time
        };
        var sortedParams = ObjectUtil.sortByDict(params);
        var paramFinalStr = "";
        for(var key in sortedParams){
            var paramStr = key+"="+sortedParams[key];
            if (paramFinalStr.length < 1){
                paramFinalStr += paramStr;
            }else{
                paramFinalStr += "&"+paramStr;
            }
        }
        cc.log("paramFinalStr =",JSON.stringify(paramFinalStr + this.DuihuanShop_signKey));
        var sign = md5(paramFinalStr + this.DuihuanShop_signKey).toUpperCase();
        // cc.log("sign =",JSON.stringify(sign));
        var url = _url;
        url += ("?char_id=" + char_id);
        url += ("&t=" + time);
        url += ("&rand=" + random_num);
        url += ("&sign=" + sign);
        cc.log("url =",JSON.stringify(url));
        return url
    },
};

var BjdDuiHuanTipPop = ccui.Widget.extend({
    ctor:function(data,type){
        // cc.log("data =",JSON.stringify(data));

        this._super();
        this.root = ccs.uiReader.widgetFromJsonFile("res/duihuanTipPop.json");
        this.addChild(this.root);

        this.getWidget("Image_1").visible = type == DuiHuanShop_Tool.Tip_Type.TIP;
        this.getWidget("Image_2").visible = type == DuiHuanShop_Tool.Tip_Type.USERINFO;
        if(type == DuiHuanShop_Tool.Tip_Type.TIP){
            this.id = data.id;
            var label_tip = this.getWidget("label_tip");
            var tip_string = "确定花费"+data.price+"用来兑换"+data.goodsName+"吗";
            label_tip.setString(tip_string);

            var btn_cancel = this.getWidget("btn_cancel")
            UITools.addClickEvent(btn_cancel,this,this.onCancel);

            var btn_confirm = this.getWidget("btn_confirm")
            UITools.addClickEvent(btn_confirm,this,this.onConfirm);
        }else{
            // FloatLabelUtil.comText("信息只能填写一")
            // FloatLabelUtil.comText("信息只能填写一")
            var btn_cancel_1 = this.getWidget("btn_cancel_1")
            UITools.addClickEvent(btn_cancel_1,this,this.onCancel);

            this.TextField_name = this.getWidget("TextField_name")

            this.TextField_phoneNum = this.getWidget("TextField_phoneNum")

            this.TextField_address = this.getWidget("TextField_address")
            this.TextField_name.setPlaceHolder("");
            this.TextField_phoneNum.setPlaceHolder("");
            this.TextField_address.setPlaceHolder("");

            var btn_modify = this.getWidget("btn_modify")
            UITools.addClickEvent(btn_modify,this,this.onModify);

            this.getUserExchangeInfo();
        }
    },
    getUserExchangeInfo:function(){
        var self = this;
        var url = DuiHuanShop_Tool.getUrl("http://bjdqp.firstmjq.club/agent/exchange/setUserExchangeInfo/wx_plat/mjqz");
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getUserExchangeInfo========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========getUserExchangeInfo============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0){//成功
                        // BjdDuiHuanShopPop.isLoadShopRecord = false;
                        // cc.log("data.data.length =",data.data.length);
                        if  (data.data.id){
                            self.TextField_name.setString(data.data.lnktruename);
                            self.TextField_name.setTouchEnabled(false);
                            self.TextField_phoneNum.setString(data.data.lnktel);
                            self.TextField_phoneNum.setTouchEnabled(false);
                            self.TextField_address.setString(data.data.address);
                            self.TextField_address.setTouchEnabled(false);
                        }
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },

    onCancel:function(){
        // cc.log("onCancel =======> BjdDuiHuanTipPop")
        this.removeFromParent(true);
    },

    onModify:function(){
        var self = this;
        var url = DuiHuanShop_Tool.getUrl("http://bjdqp.firstmjq.club/agent/exchange/setUserExchangeInfo/wx_plat/mjqz");
        url += ("&name=" + this.TextField_name.getString());
        url += ("&phone=" + this.TextField_phoneNum.getString());
        url += ("&address=" + this.TextField_address.getString());
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========setUserExchangeInfo========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========setUserExchangeInfo============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0){//成功
                        FloatLabelUtil.comText(data.msg)
                    }else if(data.code == 1){
                        FloatLabelUtil.comText(data.msg)
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },

    onConfirm:function(){
        var self = this;
        var url = DuiHuanShop_Tool.getUrl("http://bjdqp.firstmjq.club/agent/exchange/createExchangeOrder/wx_plat/mjqz");
        url += ("&goods_id=" + this.id);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========createExchangeOrder========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========createExchangeOrder============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0){//成功
                        FloatLabelUtil.comText(data.msg);
                        BjdDuiHuanShopPop.isLoadShopRecord = false;
                        BjdDuiHuanShopPop.getBeansNum();
                    }else{
                        FloatLabelUtil.comText(data.msg);
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },
    /**
     * 获取内部元素
     * @param name  部件名
     */ 
    getWidget : function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },
});

var BjdDuiHuanOrderItem = ccui.Widget.extend({
    ctor:function(data){
        // cc.log("BjdDuiHuanOrderItem data =",JSON.stringify(data));
        this._super();
        this.root = ccs.uiReader.widgetFromJsonFile("res/duihuanOrderItem.json");
        this.addChild(this.root);


        var label_name = this.getWidget("label_name");
        label_name.setString(data.exchange_goods_name);
        var label_time = this.getWidget("label_time");
        label_time.setString("兑换时间:"+data.create_time);
        var label_price = this.getWidget("label_price");
        label_price.setString("消费:"+data.number);
        this.label_status = this.getWidget("label_status");

        var label_statusTip = this.getWidget("label_statusTip");
        label_statusTip.setString(data.remark);

        var sprite = new cc.Sprite("res/ui/bjdmj/popup/duihuanShop/100.png");
        this.getWidget("Image_1").addChild(sprite);
        sprite.setPosition(40,49);

        var self = this;
        var goods_img = data.goods_img.replace("https:","http:");
        cc.loader.loadImg(goods_img, {width: 80, height: 90}, function (error, img) {
            if (!error) {
                sprite.setTexture(img);
            }
        });

        this.refreshOrderItem(data)
    },

    refreshOrderItem:function(data){
        var status = data.status;
        if(status == 0){//未审核
            this.label_status.setColor(cc.color(5,16,220));
            this.label_status.setString("审核中")
        }else if(status == 1){//审核未通过
            this.label_status.setColor(cc.color(237,26,21));
            this.label_status.setString("审核未通过")
            if(data.return_status == 1)
                this.label_status.setString("审核未通过,金豆退还")
        }else if(status == 2){//审核未通过
            this.label_status.setColor(cc.color(5,16,220));
            this.label_status.setString("审核通过(未发货)")
        }else if(status == 3){//已发货
            this.label_status.setColor(cc.color(99,167,0));
            this.label_status.setString("已发货")
        }else if(status == 4){//已收到
            this.label_status.setColor(cc.color(99,167,0));
            this.label_status.setString("已收到")
        }
    },

    /**
     * 获取内部元素
     * @param name  部件名
     */ 
    getWidget : function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },
});

var BjdDuiHuanGoodsItem = ccui.Widget.extend({
    id : -1,
    price:-1,
    goodsName:"",
    ctor:function(data,baseRoot){
        // cc.log(" BjdDuiHuanGoodsItem data =",JSON.stringify(data));
        this.shopBaseRoot = baseRoot;
        this.goodsName = data.exchange_goods_name;
        this._super();
        this.root = ccs.uiReader.widgetFromJsonFile("res/duihuanGoodsItem.json");
        this.addChild(this.root);

        var label_price = this.getWidget("label_price");
        label_price.setString(data.consume_gold_value);

        this.id = data.id;
        this.price = data.consume_gold_value;

        this.btn_goods = this.getWidget("btn_goods");
        UITools.addClickEvent(this.btn_goods,this,this.onGoods);
        var sprite = new cc.Sprite("res/ui/bjdmj/popup/duihuanShop/100.png");
        this.getWidget("Image_1").addChild(sprite);
        sprite.setPosition(this.btn_goods.x,this.btn_goods.y);
        var self = this;
        var goods_img = data.goods_img.replace("https:","http:");
        cc.loader.loadImg(goods_img, {width: 113, height: 79}, function (error, img) {
            if (!error) {
                sprite.setTexture(img);
            }
        });
    },

    onGoods:function(){
        var data = [];
        data.goodsName = this.goodsName;
        data.price = this.price;
        data.id = this.id;
        this.shopBaseRoot.addChild(new BjdDuiHuanTipPop(data,DuiHuanShop_Tool.Tip_Type.TIP),9999999);
    },
    /**
     * 获取内部元素
     * @param name  部件名
     */ 
    getWidget : function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },
});

var BjdDuiHuanTaskItem = ccui.Widget.extend({
    id:-1,
    ctor:function(data){
        // cc.log(" BjdDuiHuanTaskItem data =",JSON.stringify(data));
        this._super();
        this.root = ccs.uiReader.widgetFromJsonFile("res/duihuanTaskItem.json");
        this.addChild(this.root);
        this.id = data.id;
        var label_taskName = this.getWidget("label_taskName");//任务名称
        label_taskName.setString(data.desc);

        this.label_progress = this.getWidget("label_progress");//任务进度
        this.label_progress.setString(data.progress+"/"+data.num);
        this.label_finish = this.getWidget("label_finish");//已完成
        this.label_finish.visible = data.status == 1;
        
        var label_reward = this.getWidget("label_reward");//任务奖励
        label_reward.setString(data.award_amount);

        this.btn_receive  = this.getWidget("btn_receive");//领取按钮
        this.btn_receive.visible = data.is_get == 1;
        UITools.addClickEvent(this.btn_receive,this,this.onReceive);

        this.btn_share = this.getWidget("btn_share");//分享按钮
        UITools.addClickEvent(this.btn_share,this,this.onShare);

        this.btn_share.visible = data.task_type == 1 && data.is_get != 1;

        this.label_progress.visible = !this.btn_share.visible && !this.btn_receive.visible && !this.label_finish.visible;

    },

    refreshTaskState:function(){
        this.btn_receive.visible = this.btn_share.visible = this.label_progress.visible =  false;
        this.label_finish.visible = true;
    },

    onShare:function(){
        var pop = new BjdShareGiftPop();
        PopupManager.addPopup(pop);
    },
    
    onReceive:function(){
        var self = this;
        var url = DuiHuanShop_Tool.getUrl("http://bjdqp.firstmjq.club/agent/exchange/getTaskGift/wx_plat/mjqz")
        url += ("&task_id=" + this.id);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getTaskGift========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========getTaskGift============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0){//成功
                        BjdDuiHuanShopPop.label_beansNum.setString(data.golden_beans);
                        self.refreshTaskState();
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },
    /**
     * 获取内部元素
     * @param name  部件名
     */ 
    getWidget : function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },
});

var BjdDuiHuanShopPop = BasePopup.extend({
    isLoadShopRecord : false,
    ctor:function(){
        this._super("res/duihuanShop.json");
    },

    selfRender:function(){
        this.ScrollView_shop = this.getWidget("ScrollView_shop");
        this.ScrollView_shop.setScrollBarEnabled(false);


        this.ScrollView_task = this.getWidget("ScrollView_task");
        this.ScrollView_task.setScrollBarEnabled(false);

        this.ScrollView_order = this.getWidget("ScrollView_order")
        this.ScrollView_order.setScrollBarEnabled(false);

        this.btn_dhsc = this.getWidget("btn_dhsc");
        this.btn_dhsc.temp = 1;
        this.btn_dhjl = this.getWidget("btn_dhjl");
        this.btn_dhjl.temp = 2;
        UITools.addClickEvent(this.btn_dhsc,this,this.onChangeShop);
        UITools.addClickEvent(this.btn_dhjl,this,this.onChangeShop);

        this.label_beansNum = this.getWidget("label_beansNum");

        var btn_close = this.getWidget("btn_close");
        UITools.addClickEvent(btn_close,this,this.onCloseHandler);

        var btn_exchangeInfo = this.getWidget("btn_exchangeInfo");
        UITools.addClickEvent(btn_exchangeInfo,this,this.onExchangeInfo);


        this.getExchangeGoodsList();
        this.getDayliTaskList();
        this.getBeansNum();
    },

    onExchangeInfo:function(){
        this.root.addChild(new BjdDuiHuanTipPop([],DuiHuanShop_Tool.Tip_Type.USERINFO),9999999);
    },

    onChangeShop:function(obj){
        this.getWidget("Image_dhsc").visible = this.ScrollView_shop.visible = obj.temp == 1;
        this.getWidget("Image_dhjl").visible = this.ScrollView_order.visible = obj.temp == 2;
        if (obj.temp == 2 && !this.isLoadShopRecord){
            this.getExchangeOrderList();
        }
    },
    //获取兑换记录
    getExchangeOrderList:function(){
        var self = this;
        var url = DuiHuanShop_Tool.getUrl("http://bjdqp.firstmjq.club/agent/exchange/getExchangeOrderList/wx_plat/mjqz")
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getExchangeOrderList========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    // cc.log("===========getExchangeOrderList============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0){//成功
                        self.showOrderList(data.data.list);
                        self.isLoadShopRecord = true;
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },
    showOrderList:function(orderData){
        // cc.log("orderData =",JSON.stringify(orderData));
        var orderList = orderData;
        this.ScrollView_order.setInnerContainerSize(cc.size(460,(orderList.length-1) * 150))

        for (var i = 0; i < orderList.length; i++) {
            var orderItem = new BjdDuiHuanOrderItem(orderList[i]);
            orderItem.setPosition(0,(orderList.length-1) * 150 -(i*110) - 100);
            this.ScrollView_order.addChild(orderItem,999);
        }
    },
    //金豆数量
    getBeansNum:function(){
        var self = this;
        var url = DuiHuanShop_Tool.getUrl("http://bjdqp.firstmjq.club/agent/exchange/getUserGoldenBeans/wx_plat/mjqz")
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getBeansNum========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========getBeansNum============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0){//成功
                        self.label_beansNum.setString(data.data);
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },
    //商城任务列表
    getDayliTaskList:function(){
        var url = DuiHuanShop_Tool.getUrl("http://bjdqp.firstmjq.club/agent/exchange/getUserTaskInfo/wx_plat/mjqz")
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getDayliTaskList========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    // cc.log("===========getDayliTaskList============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0){//成功
                        self.showTaskList(data.data)
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },
    showTaskList:function(taskData){
        // cc.log("taskList =",JSON.stringify(taskData));
        // cc.log("taskList =",JSON.stringify(taskData.length));
        // this.ScrollView_task.setInnerContainerSize(cc.size(this.ScrollView_task.width,taskData.list*80))
        var taskList = taskData;
        for (var i = 0; i < taskList.length; i++) {
            var taskItem = new BjdDuiHuanTaskItem(taskList[i]);
            taskItem.setPosition(0,(5 - i ) * 70);
            this.ScrollView_task.addChild(taskItem,999);
        }
    },
    //商城商品列表
    getExchangeGoodsList:function(){
        var url = DuiHuanShop_Tool.getUrl("http://bjdqp.firstmjq.club/agent/exchange/getExchangeGoodsList/wx_plat/mjqz")
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getExchangeGoodsList========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    // cc.log("===========getExchangeGoodsList============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0){//成功
                        self.showGoodsList(data.data)
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },

    showGoodsList:function(goodsData){
        cc.log("goodsList =",JSON.stringify(goodsData));
        this.ScrollView_shop.setInnerContainerSize(cc.size(900,this.ScrollView_shop.height))
        var goodsList = goodsData.list;
        for (var i = 0; i < goodsList.length; i++) {
            var goodsItem = new BjdDuiHuanGoodsItem(goodsList[i],this.root);
            goodsItem.setPosition(i%6*150, (1 - Math.floor(i/6)) * 180);
            this.ScrollView_shop.addChild(goodsItem,999);
        }
    },
});
