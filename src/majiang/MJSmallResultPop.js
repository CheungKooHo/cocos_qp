/**
 * Created by zhoufan on 2016/7/27.
 */
var MJSmallResultCell = ccui.Widget.extend({

    ctor:function(huUser,paoUser,record){
        this._super();
        var bg = new cc.Sprite("res/ui/gansu_mj/mjSmallResult/mjSmallResult_2.png");
        bg.anchorX=bg.anchorY=0;
        this.addChild(bg);
        var name = UICtor.cLabel(huUser.name, 24, cc.size(200,32), cc.color(109,70,47), 1, 1);
        name.anchorX=name.anchorY=0;
        name.x = 0;
        name.y = (bg.height-name.height)/2;
        bg.addChild(name);

        var fanStr = "";
        var score = record[2];
        if(paoUser) {
            name = UICtor.cLabel(paoUser.name, 24, cc.size(200,32), cc.color(109,70,47), 0, 1);
            name.anchorX=name.anchorY=0;
            name.x = 275;
            name.y = (bg.height-name.height)/2;
            bg.addChild(name);
            fanStr += "点炮没听牌 包3家";

            var scoreLabel = new cc.LabelBMFont("-"+score,"res/font/font_mj1.fnt");
            scoreLabel.anchorX=scoreLabel.anchorY=0;
            scoreLabel.x = 385;
            scoreLabel.y = (bg.height-scoreLabel.height)/2;
            bg.addChild(scoreLabel);
        } else {
            fanStr += "自摸吃3家";
            score = score*3;
        }
        //门清
        if (record[4] > 0) {
            fanStr += " 门清";
        }
        //硬将
        if (record[5] > 0) {
            fanStr += " 硬将";
        }
        //杠
        if (record[6] > 0) {
            fanStr += " 杠";
        }

        var scoreLabel = new cc.LabelBMFont("+"+score,"res/font/font_mj2.fnt");
        scoreLabel.anchorX=scoreLabel.anchorY=0;
        scoreLabel.x = 170;
        scoreLabel.y = (bg.height-scoreLabel.height)/2;
        bg.addChild(scoreLabel);

        fanStr +="（"+record[3]+"番）";
        name = UICtor.cLabel(fanStr, 24, cc.size(350,0), cc.color(114,92,68), 0, 0);
        name.anchorX=name.anchorY=0;
        name.x = 460;
        name.y = (bg.height-name.height)/2;
        bg.addChild(name);

        this.setContentSize(bg.width,bg.height);
    }

})
var MJSmallResultPop = BasePopup.extend({

    ctor: function (data,isReplay) {
        this.data = data;
        this.isHu = false;
        this.isReplay = isReplay || false;
        this.huSeat = 0;
        this._super("res/mjSmallResult.json");
    },

    createMoldPais: function(widget,user) {
        var moldPais = user.moldPais;
        var count = 0;
        this.moldInitX = 100;
        var lastX = 0;
        for (var i=0;i<moldPais.length;i++) {
            var innerObject = moldPais[i];
            var innerAction = innerObject.action;
            var tempCards = innerObject.cards;
            var innerArray = [];
            for (var ia=0;ia<tempCards.length;ia++) {
                innerArray.push(MJAI.getMJDef(tempCards[ia]));
            }
            var gangVo = null;
            if((innerAction==MJAction.AN_GANG||innerAction==MJAction.GANG) && (innerArray.length>3 || innerObject.gangVo)){
                gangVo = innerArray.pop();
            }
            for(var j=0;j<innerArray.length;j++){
                var innerVo = innerArray[j];
                if (innerAction==MJAction.AN_GANG) {
                    innerVo.a = 1;
                }
                var card = new Mahjong(MJAI.getDisplayVo(1,2),innerVo);
                card.scale = 0.5;
                card.x = this.moldInitX+count*30.5;
                card.y = 3;
                lastX = card.x;
                widget.addChild(card);

                //杠的牌需要放一张牌到上面去
                if(gangVo && j==1){
                    if(!card.getChildByTag(333)){
                        var gang = new Mahjong(MJAI.getDisplayVo(1,2),gangVo);
                        gang.y += 12;
                        gang.scale = 1;
                        card.addChild(gang,1,333);
                    }
                }
                count++;
            }
        }
        this.moldInitX = lastX > 0 ? lastX+60 : this.moldInitX;
    },

    createHandPais: function(widget,user) {
        var handPais = user.handPais;
        var voArray = [];
        for (var i=0;i<handPais.length;i++) {
            voArray.push(MJAI.getMJDef(handPais[i]));
        }
        voArray.sort(MJAI.sortMJ);
        for (var i=0;i<voArray.length;i++) {
            voArray[i].isJs = 1;
            var card = new Mahjong(MJAI.getDisplayVo(1,1),voArray[i]);
            card.scale = 0.5;
            card.x = this.moldInitX+44.5*i;
            card.y = 3;
            widget.addChild(card);
        }
    },

    createHuedPais: function(widget,user) {
        var huList = this.huList[user.seat];
        var fanStr = "";
        var hutxt = ccui.helper.seekWidgetByName(widget,"hutxt");
        if (huList) {
            var maxFan = 0;
            var maxIndex = 0;
            var initY = huList.length > 8 ? 50 : 32;
            var panel = ccui.helper.seekWidgetByName(widget,"Panel_hu");
            for (var i=0;i<huList.length;i++) {
                var hu = huList[i];
                var id = hu.ext[2];
                var fan = hu.ext[4];
                var vo = MJAI.getMJDef(id);
                vo.mjScale = 0.3;
                vo.isJs = 1;
                vo.ishu = 1;
                if(hu.ext[1] > 0 && !this.isReplay) {
                    var paoSeq = MJRoomModel.getPlayerSeq("", MJRoomModel.mySeat, hu.ext[1]);
                    vo.jt = MJRoomModel.getPaoJianTou(paoSeq);
                }
                var card = new Mahjong(MJAI.getDisplayVo(1,1),vo);
                //card.scale = 0.3;
                card.x = 27*(i%8);
                if (huList.length > 8) {
                    card.y = i > 7 ? initY : initY-45;
                    if(i < 7) {
                        card.setLocalZOrder(100);
                    }
                } else {
                    card.y = initY;
                }
                panel.addChild(card);
                if (fan > maxFan) {
                    maxFan = fan;
                    maxIndex = i;
                }
            }

            var ext = huList[maxIndex].ext;
            var fan = ext[4];
            //副牌加番
            if (fan > 0) {
                fan -= ext[5];
                fan -= ext[6];
                fan -= 1;
                if(fan > 0) {
                    fanStr += this.fuTypeName+(fan*2);
                }
            }
            //门清
            if (ext[5] > 0) {
                fanStr += " 门清x2";
            }
            //硬将
            if (ext[6] > 0) {
                fanStr += " 硬将x2";
            }
        }
        hutxt.setString(fanStr);
    },

    refreshSingle: function(widget,user){
        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        ccui.helper.seekWidgetByName(widget,"id").setString("ID:"+user.userId);
        var pointPanel = ccui.helper.seekWidgetByName(widget,"point");
        var fnt = user.point>0 ? "res/font/font_mj2.fnt" : "res/font/font_mj1.fnt";
        var point = user.point>0 ? "+"+user.point : ""+user.point;
        var scoreLabel = new cc.LabelBMFont(point,fnt);
        scoreLabel.x = pointPanel.width/2-3;
        scoreLabel.y = pointPanel.height/2-3;
        pointPanel.addChild(scoreLabel);
        ccui.helper.seekWidgetByName(widget,"zhuang").visible = (user.seat==this.data.ext[8]);
        this.createMoldPais(widget, user);
        this.createHandPais(widget, user);
        this.createHuedPais(widget, user);
    },

    getUserData: function(seat) {
        var user = null;
        for (var i=0;i<this.closingPlayers.length;i++) {
            if (this.closingPlayers[i].seat == seat) {
                user = this.closingPlayers[i];
                break;
            }
        }
        return user;
    },

    createHuCell: function(huRecord) {
        var ext = huRecord.ext;
        var huUser = this.getUserData(ext[0]);
        var paoUser = ext[1] > 0 ? this.getUserData(ext[1]) : null;
        return new MJSmallResultCell(huUser, paoUser, ext);
    },

    selfRender: function () {
        var btnok = this.getWidget("btnok");
        UITools.addClickEvent(btnok,this,this.onOk);
        var Button_11 = this.getWidget("Button_11");
        UITools.addClickEvent(Button_11,this,this.onCheckDesktop);
        this.closingPlayers = this.data.closingPlayers;
        this.fuTypeName = this.getFuTypeName();
        this.huList = {};
        var huList = this.data.huList;
        if(huList) {
            for (var i = 0; i < huList.length; i++) {
                var huRecord = huList[i];
                var huUser = this.getUserData(huRecord.ext[0]);
                if (!this.huList[huUser.seat]) {
                    this.huList[huUser.seat] = [];
                }
                this.huList[huUser.seat].push(huRecord);
            }
        }
        for(var j=1;j<=4;j++) {
            for(var i=0;i<this.closingPlayers.length;i++){
                var user = this.closingPlayers[i];
                if(user.seat == j) {
                    this.refreshSingle(this.getWidget("user"+j),user);
                    break;
                }
            }
        }
        var zuizi = MJRoomModel.getZuiZiName(this.data.ext[10]);
        var wa = MJRoomModel.getHuCountName(this.data.ext[15]);
        var cp = MJRoomModel.getChiPengName(this.data.ext[11]);
        var ting = MJRoomModel.getTingHuName(this.data.ext[13]);
        var jianglei = MJRoomModel.getJiangLeiName(this.data.ext[18]);
        var gangjiafan = MJRoomModel.getGJFName(this.data.ext[16]);
        this.getWidget("info").setString(csvhelper.strFormat("{0} {1} {2} {3} {4} {5}",zuizi,wa,cp,ting,jianglei,gangjiafan));
    },

    getFuTypeName: function() {
        var name = "";
        var type = parseInt(this.data.ext[10]);
        switch (type) {
            case MJFuPaiType.ZFB_JDF:
            case MJFuPaiType.SAN_YAO_ZFB:
            case MJFuPaiType.ZFB_XJF:
                name = "中发白x";
                break;
            case MJFuPaiType.SAN_JIU_ZFBJ:
                name = "中发白鸡x";
                break;
            case MJFuPaiType.HZD_3938:
                name = "38红中带x";
                break;
            case MJFuPaiType.BBD_3231:
                name = "32白板带x";
                break;
            default :
                name = "黑三风x";
                break;
        }
        return name;
    },

    onCheckDesktop:function(){
        PopupManager.remove(this);
    },

    onOk:function(){
        if(ClosingInfoModel.isReplay || !LayerManager.isInRoom()){
            PopupManager.remove(this);
            return;
        }
        var data = this.data;
        if(MJRoomModel.nowBurCount == MJRoomModel.totalBurCount){//最后的结算
            PopupManager.remove(this);
            var mc = new MJBigResultPop(data);
            PopupManager.addPopup(mc);
        }else{
            this.issent = true;
            sySocket.sendComReqMsg(3);
        }
    }
});

