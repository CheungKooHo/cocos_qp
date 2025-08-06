/**
 * Created by Administrator on 2017/2/28.
 */

var MjCreateRoom = BasePopup.extend({
    clubData:null,
    ctor:function(clubData){
        this.clubData = clubData || null;
        this.itemConfigArr = [
            ["HZMJ","BSMJ","ZZMJ","CSMJ","TDH","SYMJ","YZWDMJ","AHMJ","TJMJ","CXMJ", "GDCSMJ","YJMJ","NXMJ","TCMJ","DHMJ","KWMJ","TCPFMJ","NYMJ","TCDPMJ","DZMJ"],
            ["PDK","DTZ","XTSDH","DT","QF","NSB","XTBP","YYBS","TCGD","HSTH"],
            ["LDFPF","SYBP","SYZP","CZZP","LYZP","ZHZ","WHZ","HYLHQ","LDS","HYSHK","YZCHZ","XXGHZ","XXPHZ","XTPHZ", "AHPHZ","GLZP","LSZP","NXPHZ","ZZPH","YJGHZ","HBGZP","SMPHZ","HSPHZ","CDPHZ","XXEQS","NXGHZ","YZLC"]
        ];
        //ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/xilieanniu/xilieanniu.ExportJson");
        this._super("res/alertPopCreateRoom.json");
    },

    selfRender:function(){

        this.grayLayer.setOpacity(180);
        this.itemScroll = this.getWidget("item_scroll");
        this.btnItem = this.getWidget("btn_item");
        this.btnItem.loadTextureNormal("common_btn_anniu3.png",ccui.Widget.PLIST_TEXTURE);
        var image_jt = this.btnItem.getChildByName("jiantou");
        image_jt.setVisible(false);
        this.btnItem.retain();
        this.money_need = this.getWidget("money_need");
        this.money_have = this.getWidget("money_have");
        this.money_have.setString(PlayerModel.cards);
        this.image_nameBg = this.getWidget("Image_nameBg");
        this.image_nameBg.setVisible(false);
        this.btn_mj = this.getWidget("btn_mj");
        this.btn_pk = this.getWidget("btn_pk");
        this.btn_zp = this.getWidget("btn_zp");
        this.btn_mj.tempType = 1;
        this.btn_pk.tempType = 2;
        this.btn_zp.tempType = 3;

        UITools.addClickEvent(this.btnItem,this,this.onClickItem);
        UITools.addClickEvent(this.getWidget("btn_wanfa"),this,this.onClickWanfa);
        UITools.addClickEvent(this.getWidget("btn_create"),this,this.onClickCreate);
        UITools.addClickEvent(this.btn_mj,this,this.onSelectWanfaType);
        UITools.addClickEvent(this.btn_pk,this,this.onSelectWanfaType);
        UITools.addClickEvent(this.btn_zp,this,this.onSelectWanfaType);
        this.setTypeSelect(1);
        var saveWanfa = cc.sys.localStorage.getItem("sy_wanfa_create_room_id");
        if(!this.clubData && saveWanfa){
            this.showLayerById(saveWanfa);
        }
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);
        if(this.clubData){
            var tempSize = cc.size(this.image_nameBg.width, this.image_nameBg.height);
            var fontName = "res/font/font_res_at2.ttf";
            var bgSpr = new cc.Scale9Sprite("#popup_create_inputBg1.png");
            bgSpr.setContentSize(tempSize);
            this.image_nameBg.setVisible(true);
            this.inputName = new cc.EditBox(tempSize,bgSpr);
            this.inputName.x = 466.0;
            this.inputName.y = 79.0;
            this.inputName.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
            this.inputName.setPlaceholderFont(""+fontName,30);
            this.inputName.setPlaceholderFontColor(cc.color("#B4B0A2"));
            this.inputName.setPlaceHolder("输入包厢名称");
            this.inputName.setMaxLength(16);
            this.inputName.setFontColor(cc.color("#6A3C11"));
            this.inputName.setDelegate(this);
            this.addChild(this.inputName,10);
            this.inputName.setFont("Arial",30);
            if(this.clubData.bagName){
                //名字原来比较长，在安卓模拟器上跑会崩溃？
                //没试过，先这样处理
                var tempStr = this.clubData.bagName;
                if(tempStr.length > 8)tempStr = tempStr.substr(0,8);
                this.inputName.setString(tempStr);
            }
            if(this.clubData.wanfaList && this.clubData.wanfaList[1]){
                this.showLayerById(this.clubData.wanfaList[1]);
            }
            this.creditParms = [];
            if(ClickClubModel.getClubIsOpenCredit()){
                this.creditParms = [0,100,1,1,0,1,1,0,0,0];
                if(this.clubData.creditMsg && this.clubData.creditMsg.length > 1){
                    this.creditParms = this.clubData.creditMsg;
                    //cc.log("this.creditParms==========",this.creditParms)
                    if (this.creditParms && this.creditParms[8]){
                        var creditParms = [];
                        for(var i = 0;i< this.creditParms.length;i++){
                            var credit = this.creditParms[i];
                            if ((i >= 1 && i <= 4) || i == 7 || i == 9){
                                credit = MathUtil.toDecimal(credit/100);
                            }
                            creditParms.push(credit);
                        }
                        this.creditParms = creditParms;
                    }
                    //cc.log("this.creditParms==========",this.creditParms)
                }
                this.showBisaiSelect();
                this.addCustomEvent(SyEvent.UPDATA_CREDIT_PARMS,this,this.upDateCreditParms);
            }
        }
    },

    /**
     * This method is called when an edit box loses focus after keyboard is hidden.
     * @param {cc.EditBox} sender
     */
    editBoxEditingDidEnd: function (sender) {
        var str = this.inputName.getString();
        if(str.length > 8){
            this.inputName.setString(str.substr(0,8));
        }
    },

    upDateCreditParms:function(event){
        this.bisaiSelect && this.bisaiSelect.setSelected(true);
        this.creditParms[0] = 1;
        var parms = event.getUserData();
        for(var i = 0;i<parms.length;++i){
            this.creditParms[i+1] = parms[i];
        }
    },

    onClickCreate:function(sender){

        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        this.isClickCreate = true;

        if(this.clubData){
            this.clubBagCreate();
            return;
        }

        sy.scene.showLoading("正在创建房间");
        var data = this.curSelectLayer.getSocketRuleData();
        sySocket.sendComReqMsg(29,[data.params[1]],"0");
    },

    //俱乐部包厢玩法创建
    clubBagCreate:function(){
        var bagName = this.inputName.getString();
        if(bagName == ""){
            FloatLabelUtil.comText("请输入包厢名字");
            return;
        }

        if (ClickClubModel.getClubIsOpenCredit() && !this.bisaiSelect.isSelected()){
            FloatLabelUtil.comText("已开启比赛配置,必须勾选比赛房选项");
            return;
        }

        if(this.clubData.bagName != bagName && this.clubData.modeId){
            this.changeBagName(bagName);
        }

        cc.log("===========clubBagCreate==========",ClickClubModel.clickClubId,this.clubData.subId);
        var self = this;
        if (this.clubData.modeId) {
            self.onSaveChoose();
        }else{
            self.onSaveChoose();
            //1创建俱包间，0非创建包间
            //NetworkJT.loginReq("groupAction", "createGroup", {groupName: bagName,groupLevel:1,
            //    groupId:ClickClubModel.clickClubId,
            //    userId:PlayerModel.userId,subId:this.clubData.subId,
            //    createRoom:""+1}, function (data) {
            //    if (data) {
            //        //cc.log("===========onCreateBag==============="+JSON.stringify(data));
            //        self.clubData.subId = data.subId || 0;
            //        self.onSaveChoose();
            //    }
            //}, function (data) {
            //    cc.log("onCreate::"+JSON.stringify(data));
            //    FloatLabelUtil.comText(data.message);
            //});
        }
    },

    changeBagName:function(name){
        cc.log("==============changeBagName================");
        NetworkJT.loginReq("groupAction", "updateGroupInfo", {groupName: name,groupMode:0,
            keyId:this.clubData.keyId,groupId:ClickClubModel.clickClubId,
            userId:PlayerModel.userId,subId:this.clubData.subId,sessCode:PlayerModel.sessCode}, function (data) {
            if (data) {
                FloatLabelUtil.comText("修改包厢名称成功");
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    onSaveChoose:function(){
        cc.log("============onSaveChoose===========" + this.clubData.modeId);
        var wanfaList = this.curSelectLayer.getSocketRuleData().params;
        var wanfas = this.curSelectLayer.getWanfas();
        var that = this;

        var creditParams = [];
        if(this.bisaiSelect && this.bisaiSelect.isSelected()){

            //creditParams = this.creditParms;
            //增加保留小数点两位
            if (this.creditParms){
                this.creditParms[8] = 1;
                for(var i = 0;i< this.creditParms.length;++i){
                    var credit = this.creditParms[i];
                    if ((i >= 1 && i <= 4) || i == 7 || i == 9){
                        credit = Math.round(credit * 100);
                    }
                    creditParams.push(credit);
                }
            }

            cc.log("creditParams==========",creditParams)
        }

        var params = {
            gameType:wanfas[0],
            payType:wanfas[1],
            gameCount:wanfas[2],
            playerCount:wanfas[3],
            modeMsg:wanfaList,
            tableName:this.inputName.getString(),
            descMsg:wanfaList,
            tableMode:wanfaList,
            tableOrder:1,
            userId:PlayerModel.userId,
            subId:that.clubData.subId,
            groupId:that.clubData.clubId,
            creditMsg:creditParams
        };
        if (this.clubData.modeId) {
            params.keyId = this.clubData.modeId;
            params.room = this.clubData.subId;
            NetworkJT.loginReq("groupAction", "updateTableConfig", params, function (data) {
                if (data) {
                    FloatLabelUtil.comText("配置修改成功");
                    var num = data.message || 0;
                    //if (Number(num)){
                        //that.onReleaseBagRoom(num);
                    //}else{
                        SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ALLBAGS);
                    //}
                    SyEventManager.dispatchEvent(SyEvent.CLOSE_CLUB_BAGS);
                    //cc.log("createPJ::"+JSON.stringify(data));
                    PopupManager.remove(that);
                }
            }, function (data) {
                cc.log("createPJ::"+JSON.stringify(data));
                FloatLabelUtil.comText(data.message);
            });
        }else{
            params.groupName = this.inputName.getString();
            NetworkJT.loginReq("groupAction", "createGroupRoom", params, function (data) {
                if (data) {
                    SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ALLBAGS);
                    SyEventManager.dispatchEvent(SyEvent.CLOSE_CLUB_BAGS);
                    //cc.log("createPJ::"+JSON.stringify(data));
                    FloatLabelUtil.comText("配置玩法成功");
                    PopupManager.remove(that);
                }
            }, function (data) {
                FloatLabelUtil.comText(data.message);
            });
        }
    },

    showBisaiSelect:function(){
        var contentNode = new cc.Node();
        contentNode.setPosition(cc.winSize.width/2 + 460,100);
        this.addChild(contentNode, 100);

        this.bisaiSelect = new SelectBox(2,"比赛房");
        this.bisaiSelect.addChangeCb(this,function(){
            if(this.bisaiSelect.isSelected()){
                var mc = new ClubCreditCreatePop(this.creditParms.slice(1),1);
                PopupManager.addPopup(mc);
            }
            this.creditParms[0] = this.bisaiSelect.isSelected()?1:0;
        });
        this.bisaiSelect.setSelected(this.creditParms[0] == 1);
        contentNode.addChild(this.bisaiSelect, 3);

        var tipBg = UICtor.cS9Img("popup_alert_bg5.png", cc.rect(120,100,1,1), cc.size(650,370), ccui.Widget.PLIST_TEXTURE);
        tipBg.setContentSize(cc.size(650,370));
        tipBg.setPosition(-300,250);
        tipBg.setVisible(false);
        contentNode.addChild(tipBg, 2);

        var str = "1、比赛房勾选后开始设定比赛房限制；\n" +
            "2、参与最低比赛分：玩家比赛分低于设定值时不可进入房间；\n" +
            "3、踢出最低比赛分：牌局中当任意玩家比赛分低于设定值时将提前解散房间；\n" +
            "4、赠送群主比赛分：固定赠送，牌局结算后大赢家或所有赢家自动赠送群主设定的比赛分；" +
            "比例赠送，牌局结算后打赢大赢家或所有赢家自动赠送群主赢分的设定比例的比赛分；\n" +
            "5、底分：牌局中获得的输赢积分*底分=输赢比赛分；\n" +
            "6、参与最低比赛分必须大于踢出最低比赛分；";

        var tipLabel = UICtor.cLabel(str,24,cc.size(tipBg.width-40,tipBg.height-20),cc.color(182,122,104),0,1);
        tipLabel.setPosition(tipBg.width/2,tipBg.height/2);
        tipBg.addChild(tipLabel, 1);

        var tipBtn = UICtor.cBtn("popup_create_wenhao.png", ccui.Widget.PLIST_TEXTURE);
        tipBtn.setPosition(130,0);
        contentNode.addChild(tipBtn, 3);
        tipBtn.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_BEGAN){
                tipBg.setVisible(true);
            }else if(type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED){
                tipBg.setVisible(false);
            }
        },this);

        var changeBtn = UICtor.cBtn("popup_create_btn_xiuggai.png", ccui.Widget.PLIST_TEXTURE);
        changeBtn.loadTexturePressed("popup_create_btn_xiuggai.png", ccui.Widget.PLIST_TEXTURE);
        UITools.addClickEvent(changeBtn,this,function(){
            var mc = new ClubCreditCreatePop(this.creditParms.slice(1),1);
            PopupManager.addPopup(mc);
        });
        changeBtn.setScale(0.9);
        changeBtn.setPosition(50,-50);
        contentNode.addChild(changeBtn, 1);
    },

    onReleaseBagRoom:function(num){
        var lastScene = UITools.getLocalItem("sy_lastClick_scene") || -1;
        var self = this;
        AlertPop.show("当前包厢有"+num+"间未开局房间,是否将其解散吗？",function(){
            NetworkJT.loginReq("groupAction", "dissTable", {
                groupId:ClickClubModel.getCurClubId() ,
                oUserId:PlayerModel.userId,
                room:self.clubData.subId,
                needAdd:1
            }, function (data) {
                if (data) {
                    //cc.log("dissTable::"+JSON.stringify(data));
                    if(data.count != 0){
                        SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ALLBAGS,lastScene);
                    }
                    FloatLabelUtil.comText(data.message);
                }
            }, function (data) {
                //cc.log("dissTable::"+JSON.stringify(data));
                FloatLabelUtil.comText(data.message);
            });
        }, function(){
            SyEventManager.dispatchEvent(SyEvent.GET_CLUB_ALLBAGS, lastScene);
        });
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        if(status==ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            FloatLabelUtil.comText("创建房间失败");
        }else if(status==ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    onSuc:function(){
        if(!this.isClickCreate){//必须点击了创建房间才创建房间,否则在这个界面，socket断开重连了后会自动创建房间
            return;
        }
        this.curSelectLayer.saveRuleDataToLocal();
        this.isClickCreate = false;
        var data = this.curSelectLayer.getSocketRuleData();
        sySocket.sendComReqMsg(1,data.params,data.strParams);
        cc.sys.localStorage.setItem("sy_wanfa_create_room_id",data.params[1] || "");
    },

    updateZsNum:function(num){
        this.money_need.setString(num);
    },

    onClickItem:function(sender){
        this.setItemSelect(sender);
    },

    openAllWf:function(type){
        var curItemArr = this.itemConfigArr[type-1];
        var contentH = Math.max(this.itemScroll.height, 105*curItemArr.length);
        this.itemScroll.setInnerContainerSize(cc.size(this.itemScroll.width,contentH));
        this.itemScroll.setBounceEnabled(contentH > this.itemScroll.height);
        this.itemArr = [];
        for(var i = 0;i< curItemArr.length;++i){
            var item = this.btnItem.clone();
            item.y = contentH - 106 *(i + 0.5);
            item.tempData = curItemArr[i];
            //item.loadTextures("common_btn_anniu3.png","common_btn_anniu3.png","common_btn_anniu3.png",ccui.Widget.PLIST_TEXTURE);
            item.loadTextureNormal("common_btn_anniu3.png",ccui.Widget.PLIST_TEXTURE);
            item.setTitleFontName("res/font/font_res_at1.ttf");
            item.setTitleText(wfNameConfig[curItemArr[i]]);
            item.setTitleColor(cc.color("#5c3529"));
            var image_jt = item.getChildByName("jiantou");
            image_jt.setVisible(false);
            this.itemScroll.addChild(item);
            this.itemArr.push(item);
            //var ceishiArr = ["SYMJ","XXGHZ","XXPHZ","XTPHZ","GLZP","GDCSMJ","NXPHZ","CXMJ","HBGZP","ZZPH", "NSB","TCMJ","NXMJ","XTBP","KWMJ","SMPHZ","HSPHZ","YYBS","CDPHZ","YYNXMJ", "XXEQS","NYMJ","DZMJ","NXGHZ"];
            //if (ArrayUtil.indexOf(ceishiArr,curItemArr[i]) >= 0){
            //    var ceshi = new cc.Sprite("#popup_create_ceshi.png");
            //    ceshi.x = 41;
            //    ceshi.y = 40;
            //    item.addChild(ceshi,10);
            //}
        }
        this.curItem = null;
        this.setItemSelect();
    },

    openDataWf:function(type){
        var curItemArr = this.itemConfigArr[type-1];
        var curOpenWf = sy.gameKf[type-1].split(",");
        var maxHightidx = 0;
        for(var i = 0;i< curOpenWf.length;++i){
            if(curOpenWf[i] == 1 ){
                maxHightidx++;
            }
        }
        var contentH = Math.max(this.itemScroll.height,110*maxHightidx);
        this.itemScroll.setInnerContainerSize(cc.size(this.itemScroll.width,contentH));
        this.itemScroll.setBounceEnabled(contentH > this.itemScroll.height);
        this.itemArr = [];
        var contHightIndex = 0;
        for(var i = 0;i< curItemArr.length;++i){
            if(curOpenWf[i] == 1 ){
                var item = this.btnItem.clone();
                item.y = contentH - 106 *(contHightIndex + 0.5);
                item.tempData = curItemArr[i];
                item.loadTextureNormal("common_btn_anniu3.png",ccui.Widget.PLIST_TEXTURE);
                item.setTitleFontName("res/font/font_res_at1.ttf");
                item.setTitleText(wfNameConfig[curItemArr[i]]);
                item.setTitleColor(cc.color("#5c3529"));
                var image_jt = item.getChildByName("jiantou");
                image_jt.setVisible(false);
                this.itemScroll.addChild(item);
                this.itemArr.push(item);
                contHightIndex++;
                ////var ceishiArr = ["SYMJ","XXGHZ","XXPHZ","XTPHZ","GLZP","GDCSMJ","NXPHZ","CXMJ","HBGZP","ZZPH", "NSB","TCMJ","NXMJ","XTBP","KWMJ","SMPHZ","HSPHZ","YYBS","CDPHZ","YYNXMJ", "XXEQS","NYMJ","DZMJ","NXGHZ"];
                //var ceishiArr = [];
                //if (ArrayUtil.indexOf(ceishiArr,curItemArr[i]) >= 0){
                //    var ceshi = new cc.Sprite("#popup_create_ceshi.png");
                //    ceshi.x = 41;
                //    ceshi.y = 40;
                //    item.addChild(ceshi,10);
                //}
            }
        }
        this.curItem = null;
        this.setItemSelect();
    },

    setScrollItem:function(type){
        this.itemScroll.removeAllChildren();
        if(sy.gameKf){
            this.openDataWf(type);
        }else{
            this.openAllWf(type);
        }
    },

    showLayerById:function(id){
        var idConfig = {
            15:[2,"PDK"],
            16:[2,"PDK"],
            225:[1,"BSMJ"],
            221:[1,"HZMJ"],
            220:[1,"ZZMJ"],
            222:[1,"CSMJ"],
            227:[1,"TDH"],
            32:[3,"SYZP"],
            33:[3,"SYBP"],
            196:[3,"ZHZ"],
            197:[3,"LYZP"],
            198:[3,"CZZP"],
            199:[3,"LDFPF"],
            228:[3,"WHZ"],
            229:[3,"LDS"],
            230:[3,"YZCHZ"],
            231:[2,"XTSDH"],
            232:[2,"DT"],
            255:[2,"NSB"],
            256:[2,"XTBP"],
            257:[2,"YYBS"],
            258:[2,"TCGD"],
            259:[2,"HSTH"],
            190:[2,"QF"],
            226:[3,"HYLHQ"],
            194:[3,"HYSHK"],
            235:[3,"XTPHZ"],
            236:[3,"XXGHZ"],
            237:[3,"XXPHZ"],
            238:[3,"AHPHZ"],
            250:[3,"ZZPH"],
            246:[3,"NXPHZ"],
            245:[3,"GLZP"],
            192:[3,"LSZP"],
            247:[3,"HBGZP"],
            249:[3,"HSPHZ"],
            800:[3,"XXEQS"],
            801:[3,"NXGHZ"],
            113:[2,"DTZ"],
            114:[2,"DTZ"],
            115:[2,"DTZ"],
            116:[2,"DTZ"],
            117:[2,"DTZ"],
            118:[2,"DTZ"],
            210:[2,"DTZ"],
            211:[2,"DTZ"],
            212:[2,"DTZ"],
            223:[1,"SYMJ"],
            193:[1,"YZWDMJ"],
			4:[1,"AHMJ"],
            6:[1,"YJMJ"],
            39:[3,"YJGHZ"],
            260:[1,"TJMJ"],
            191:[1,"CXMJ"],
            261:[1,"GDCSMJ"],
            248:[1,"NXMJ"],
            189:[1,"KWMJ"],
            262:[1,"TCMJ"],
            188:[1,"TCPFMJ"],
            187:[1,"TCDPMJ"],
            186:[1,"YYNXMJ"],
            263:[1,"NYMJ"],
            251:[1,"DZMJ"],
            300:[3,"SMPHZ"],
            53:[3,"CDPHZ"],
            301:[3,"YZLC"],
        };

        if(idConfig[id]){
            this.setTypeSelect(idConfig[id][0]);
            var selectIdx = 0;
            for(var i = 0;i<this.itemArr.length;++i){
                if(this.itemArr[i].tempData == idConfig[id][1]){
                    this.setItemSelect(this.itemArr[i]);
                    selectIdx = i;
                    break;
                }
            }

            var percent = 0;
            if(selectIdx){
                percent = selectIdx/(this.itemArr.length - 1)*100;
            }
            this.itemScroll.jumpToPercentVertical(percent);
        }
    },

    setItemSelect:function(item){
        item = item || this.itemArr[0];
        if(this.curItem == item){
            return;
        }
        var image_jt = item.getChildByName("jiantou");
        image_jt.setVisible(true);
        item.setTouchEnabled(false);
        item.loadTextureNormal("common_btn_anniu4.png", ccui.Widget.PLIST_TEXTURE);// + BjdWanfaTexConfig[item.tempData] +
        item.setTitleColor(cc.color("#be512e"));
        if(this.curItem){
            var image_jt2 = this.curItem.getChildByName("jiantou");
            image_jt2.setVisible(false);
            this.curItem.setTouchEnabled(true);
            this.curItem.loadTextureNormal("common_btn_anniu3.png", ccui.Widget.PLIST_TEXTURE);
            this.curItem.setTitleColor(cc.color("#5c3529"));
        }
        //this.addBtnAni(item.getPosition());
        this.curItem = item;
        this.showSelectLayer(this.curItem.tempData);
    },

    addBtnAni:function(pos){
        //var itemAni = this.itemScroll.getChildByName("itemAni");
        //if(!itemAni){
        //    var itemAni = new ccs.Armature("xilieanniu");
        //    itemAni.setAnchorPoint(0.5,0.5);
        //    itemAni.getAnimation().play("Animation4",-1,1);
        //    itemAni.setName("itemAni");
        //    this.itemScroll.addChild(itemAni);
        //}
        //itemAni.setPosition(pos);
    },

    onExit:function(){
        this.btnItem && this.btnItem.release();
        //ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/xilieanniu/xilieanniu.ExportJson");
        this._super();
    },

    onSelectWanfaType:function(sender){
        if(this.selectType == sender.tempType){
            return;
        }
        this.setTypeSelect(sender.tempType);
    },

    setTypeSelect:function(type){
        this.selectType = type;
        var resMj = "popup_create_btn_majiang2.png";
        var resPk = "popup_create_btn_puke2.png";
        var resZp = "popup_create_btn_zipai2.png";
        (type == 1) && (resMj = resMj.replace(/2/,"1"));
        (type == 2) && (resPk = resPk.replace(/2/,"1"));
        (type == 3) && (resZp = resZp.replace(/2/,"1"));
        this.btn_mj.loadTextures(resMj,resMj,"", ccui.Widget.PLIST_TEXTURE);
        this.btn_pk.loadTextures(resPk,resPk,"", ccui.Widget.PLIST_TEXTURE);
        this.btn_zp.loadTextures(resZp,resZp,"", ccui.Widget.PLIST_TEXTURE);
        this.setScrollItem(type);
    },

    onClickWanfa:function(){
        var pop = new BjdWanfaPop(this.curItem.tempData);
        PopupManager.addPopup(pop);
    },

    showSelectLayer:function(wanfa) {
        cc.log("wanfa =" + wanfa);
        if (this.curSelectLayer)this.curSelectLayer.setVisible(false);
        this.curSelectLayer = this.getChildByName("selectLayer_" + wanfa);
        if (this.curSelectLayer) {
            this.curSelectLayer.setVisible(true);
            this.curSelectLayer.onShow();
            return;
        }
        var evalStr = "this.curSelectLayer = new RuleSelect_" + wanfa + "(wanfa,this);";
        eval(evalStr);
        if (!this.curSelectLayer) {
            cc.log("========showSelectLayer=======error===", wanfa);
            return;
        }
        this.curSelectLayer.setName("selectLayer_" + wanfa);
        this.addChild(this.curSelectLayer, 3);
        this.curSelectLayer.onShow();
    },
});


