/**
 * Created by zhoufan on 2016/7/27.
 */
var CSMJSmallResultCell = ccui.Widget.extend({

    ctor:function(huUser,paoUser,record){
        this._super();
        var bg = new cc.Sprite("res/ui/mj/mjSmallResult/mjSmallResult_2.png");
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
var CSMJSmallResultPop = BasePopup.extend({

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
        this.moldInitX = 115;
        var lastX = 0;
        var height = 50;
        for (var i=0;i<moldPais.length;i++) {
            var innerObject = moldPais[i];
            var innerAction = innerObject.action;
            var tempCards = innerObject.cards;
            var innerArray = [];
            for (var ia=0;ia<tempCards.length;ia++) {
                innerArray.push(MJAI.getMJDef(tempCards[ia]));
            }
            var gangVo = null;
            if((innerAction==MJAction.AN_GANG || innerAction==MJAction.GANG) && (innerArray.length>3 || innerObject.gangVo)){
                gangVo = innerArray.pop();
            }
            var angangOffx = 0;
            if(innerAction==MJAction.AN_GANG){
                angangOffx = 15;
            }
            var actionDiffX = 5;
            for(var j=0;j<innerArray.length;j++){
                var innerVo = innerArray[j];
                if (innerAction==MJAction.AN_GANG) {
                    innerVo.a = 1;
                }
                var card = new CSMahjong(MJAI.getDisplayVo(1,2),innerVo);
                var size = card.getContentSize();
                var _scale = 0.6;
                card.scale = _scale;
                card.x = this.moldInitX + (size.width * _scale - 0.5) * count;
                card.y = height;
                lastX = card.x;
                widget.addChild(card);

                //杠的牌需要放一张牌到上面去
                if(gangVo && j==1){
                    if(!card.getChildByTag(333)){
                        var gang = new CSMahjong(MJAI.getDisplayVo(1,2),gangVo);
                        gang.y += 12;
                        gang.scale = 1;
                        card.addChild(gang,1,333);
                    }
                }
                count++;
            }
            this.moldInitX = this.moldInitX + actionDiffX + angangOffx;
        }
        this.moldInitX = lastX > 0 ? lastX+60 : this.moldInitX;
    },

    createHandPais: function(widget,user) {
        var handPais = user.handPais;
        var voArray = [];
        var tjmjHuPai = null;
        for (var i=0;i<handPais.length;i++) {
            var vo = MJAI.getMJDef(handPais[i]);
            if(MJRoomModel.wanfa == MJWanfaType.TJMJ){
                if(user.isHu == vo.c){//如果是胡的那张牌
                    tjmjHuPai = vo;
                    continue;
                }
            }
            voArray.push(vo);
        }
        voArray.sort(MJAI.sortMJ);
        var first_wang = 0;
        var second_wang = 0;
        if(MJRoomModel.wanfa == MJWanfaType.TJMJ){
            if (MJRoomModel.tjmj_dipaiID && MJRoomModel.tjmj_tianpaiID){
                var cardVo = MJAI.getMJDef(MJRoomModel.tjmj_tianpaiID);
                first_wang = (cardVo.n )>9?(cardVo.n )%9:cardVo.n ;
                if (MJRoomModel.intParams[25] == 1){//八王
                    cardVo = MJAI.getMJDef(MJRoomModel.tjmj_tianpaiIDTwo);
                    second_wang = (cardVo.n )>9?(cardVo.n )%9:cardVo.n ;
                }
            }
        }else if(MJRoomModel.wanfa == MJWanfaType.GDCSMJ){
            if (MJRoomModel.gdcsmj_dipaiID && MJRoomModel.gdcsmj_tianpaiID){
                var cardVo = MJAI.getMJDef(MJRoomModel.gdcsmj_tianpaiID);
                first_wang = cardVo;
            }
        }else if(MJRoomModel.wanfa == MJWanfaType.NYMJ){
            if (MJRoomModel.nymj_tianpaiID){
                var cardVo = MJAI.getMJDef(MJRoomModel.nymj_tianpaiID);
                first_wang = cardVo;
            }
        }
        var height = 50;
        for (var i=0;i<voArray.length;i++) {
            voArray[i].isJs = 1;
            if (MJRoomModel.wanfa == MJWanfaType.TJMJ){
                if (MJRoomModel.tjmj_dipaiID && MJRoomModel.tjmj_tianpaiID){
                    if (voArray[i].t ==  MJAI.getMJDef(MJRoomModel.tjmj_tianpaiID).t && (voArray[i].n == first_wang || voArray[i].n == second_wang)){
                        voArray[i].wang = 1;
                    }
                }
            }else if (MJRoomModel.wanfa == MJWanfaType.GDCSMJ){
                if (MJRoomModel.gdcsmj_dipaiID && MJRoomModel.gdcsmj_tianpaiID){
                    if (voArray[i].t ==  MJAI.getMJDef(MJRoomModel.gdcsmj_tianpaiID).t && (voArray[i].i == first_wang.i)){
                        voArray[i].wang = 1;
                    }
                }
            }else if (MJRoomModel.wanfa == MJWanfaType.NYMJ){
                if (MJRoomModel.nymj_tianpaiID){
                    if (voArray[i].t ==  MJAI.getMJDef(MJRoomModel.nymj_tianpaiID).t && (voArray[i].i == first_wang.i)){
                        voArray[i].wang = 1;
                    }
                }
            }
            var card = new CSMahjong(MJAI.getDisplayVo(1,1),voArray[i]);
            var size = card.getContentSize();
            var _scale = 0.6;
            card.scale = _scale;
            card.x = this.moldInitX + (size.width * _scale - 0.5) * i;
            card.y = height;
            widget.addChild(card);

            var id1 = -1;
            var id2 = -1;
            if(user.isHu > 1000){//长沙麻将胡两张的胡牌
                id1 = parseInt(user.isHu/1000);
                id2 = user.isHu % 1000;
            }else{
                id1 = user.isHu;
            }

            var id3 = -1;var id4 = -1;
            if(user.totalFan > 1000){//长沙麻将开4杠可以胡4张牌，借用这个字段传另外两张胡牌
                id3 = parseInt(user.totalFan/1000);
                id4 = user.totalFan % 1000;
            }else{
                id3 = user.totalFan;
            }

            //cc.log("=======ttttttttttttttt======111===",user.isHu,user.totalFan,id1,id2,id3,id4);

            if (voArray[i].c == id1 || voArray[i].c == id2 || voArray[i].c == id3 || voArray[i].c == id4){
                var huImg = new cc.Sprite("res/ui/mj/mjSmallResult/mjSmallResult_15.png");
                huImg.x = size.width*0.80;
                huImg.y = size.height*0.17;
                card.addChild(huImg,1,5);
            }
        }

        if(MJRoomModel.wanfa == MJWanfaType.TJMJ){
            if(tjmjHuPai){
                var card = new CSMahjong(MJAI.getDisplayVo(1,1),tjmjHuPai);
                var size = card.getContentSize();
                var _scale = 0.6;
                card.scale = _scale;
                card.x = this.moldInitX + (size.width * _scale - 0.5) * voArray.length + 30;
                card.y = height;
                widget.addChild(card);

                var huImg = new cc.Sprite("res/ui/mj/mjSmallResult/mjSmallResult_15.png");
                huImg.x = size.width*0.80;
                huImg.y = size.height*0.17;
                card.addChild(huImg,1,5);
            }
        }
    },

    createHuedPais: function(widget,user) {

        var hutxt = ccui.helper.seekWidgetByName(widget,"hutxt");
        hutxt.setString("");

        var huStrArr = [];

        var dahuConfig = {0:"碰碰胡",1:"将将胡",2:"清一色",3:"海底捞月",4:"海底炮",5:"七小对",
            6:"豪华七小对",7:"杠上开花",8:"抢杠胡",9:"杠上炮",10:"全求人",11:"双豪华七小对",12:"天胡",13:"地胡",14:"门清"};
        var dahus = user.dahus || [];

        if(MJRoomModel.wanfa == MJWanfaType.TJMJ){
            dahuConfig = {0:"碰碰胡",1:"将将胡",2:"七小对",3:"清一色",4:"豪华七小对", 5:"超豪华七小对",
             6:"杠上开花",7:"杠上炮",8:"报听",9:"抢杠胡",10:"黑天胡",11:"地胡",12:"倒底胡", 13:"天胡",
                14:"天天胡",15:"地地胡",16:"平胡",17:"硬庄",18:"天天天胡"};
        }else if(MJRoomModel.wanfa == MJWanfaType.GDCSMJ){
            dahuConfig = {0:"碰碰胡",2:"七小对",3:"清一色",4:"豪华七小对", 5:"双豪华七小对",
                6:"杠爆",9:"抢杠胡",11:"地胡", 13:"天胡",16:"鸡胡",17:"无鬼翻倍",
                18:"跟庄+1",19:"十三幺",20:"三豪华七对",21:"混一色",22:"字一色",
                23:"十八罗汉",24:"一九胡",25:"清一九",26:"海底捞",27:"吃杠杠爆全包",
                28:"十倍不计分",32:"连庄"};
        }else if(MJRoomModel.wanfa == MJWanfaType.TCMJ){
            dahuConfig = {1:"将一色",2:"七对",3:"清一色",6:"杠上开花",16:"屁胡"};
        }else if(MJRoomModel.wanfa == MJWanfaType.NYMJ){
            dahuConfig = {0:"碰碰胡",2:"七小对",3:"清一色",16:"平胡",17:"硬胡",33:"金马翻倍"};
        }

        if(MJRoomModel.wanfa != MJWanfaType.NYMJ) {
            for (var i = 0; i < dahus.length; ++i) {
                if (dahuConfig[dahus[i]]) {
                    if (dahus[i] == 32) {
                        huStrArr.push(dahuConfig[dahus[i]] + "+" + (user.ext[2] || 1));
                    } else {
                        huStrArr.push(dahuConfig[dahus[i]]);
                    }
                }
            }
        }

        var xiaohuConfig = {6:"缺一色",7:"板板胡",8:"一枝花",9:"六六顺",10:"四喜",11:"金童玉女",
            12:"节节高",13:"三同",14:"中途四喜",15:"中途六六顺"};
        var xiaohuNum = {};
        var xiaohus = user.xiaohus || [];
        for(var i = 0;i<xiaohus.length;++i){
            if(xiaohuNum[xiaohus[i]]){
                xiaohuNum[xiaohus[i]]++;
            }else{
                xiaohuNum[xiaohus[i]] = 1;
            }
        }
        for(var key in xiaohuNum){
            if(xiaohuConfig[key]){
                if(xiaohuNum[key] > 1){
                    huStrArr.push(xiaohuConfig[key] + "x" + xiaohuNum[key]);
                }else{
                    huStrArr.push(xiaohuConfig[key]);
                }
            }
        }

        if(MJRoomModel.wanfa == MJWanfaType.NYMJ){
            if (user.ext[0] > 0){
                huStrArr.push("飘 +" + user.ext[0]);
            }else if(user.ext[0] < 0){
                huStrArr.push("飘 " + user.ext[0]);
            }

            for (var i = 0; i < dahus.length; ++i) {
                if (dahuConfig[dahus[i]]) {
                    if (dahus[i] == 33) {//单独把金马翻倍拿出来
                        huStrArr.push(dahuConfig[33]);
                    }
                }
            }
        }

        if(MJRoomModel.wanfa == MJWanfaType.NYMJ){
            if(user.birdPoint > 0){
                huStrArr.push("中马 +" + user.birdPoint);
            }else{
                huStrArr.push("中马 " + user.birdPoint);
            }
        }else{
            if(user.birdPoint > 0 && ArrayUtil.indexOf(this.showNiaoSeatArr,user.seat) >= 0){
                if(MJRoomModel.wanfa == MJWanfaType.GDCSMJ){
                    huStrArr.push("中" + user.birdPoint + "马");
                }else{
                    huStrArr.push("中" + user.birdPoint + "鸟");
                }

            }
        }

        if(MJRoomModel.wanfa != MJWanfaType.NYMJ){
            if (user.ext[0] > 0){
                huStrArr.push("飘" + user.ext[0] + "分");
            }
        }

        if(MJRoomModel.wanfa == MJWanfaType.CSMJ){
            if(user.ext[1] > 0){
                huStrArr.push("杠分+" + user.ext[1]);
            }else if(user.ext[1] < 0){
                huStrArr.push("杠分" + user.ext[1]);
            }
        }

        if(MJRoomModel.wanfa == MJWanfaType.GDCSMJ){
            if(user.ext[7] > 0){
                huStrArr.push("明杠+" + user.ext[7]);
            }else if(user.ext[7] < 0){
                huStrArr.push("明杠" + user.ext[7]);
            }

            if(user.ext[8] > 0){
                huStrArr.push("暗杠+" + user.ext[8]);
            }else if(user.ext[8] < 0){
                huStrArr.push("暗杠" + user.ext[8]);
            }

            if(user.ext[9] > 0){
                huStrArr.push("被放杠+" + user.ext[9]);
            }else if(user.ext[9] < 0){
                huStrArr.push("放杠" + user.ext[9]);
            }

            if(user.ext[6] > 0){
                huStrArr.push("马跟杠+" + user.ext[6]);
            }else if(user.ext[6] < 0){
                huStrArr.push("马跟杠" + user.ext[6]);
            }
        }

        if(MJRoomModel.wanfa == MJWanfaType.TCMJ){
            if(user.ext[1] > 0){
                huStrArr.push("杠分+" + user.ext[1]);
            }else if(user.ext[1] < 0){
                huStrArr.push("杠分" + user.ext[1]);
            }
        }

        if(MJRoomModel.wanfa == MJWanfaType.NYMJ){
            if(user.ext[3]){
                huStrArr.push("明杠+" + user.ext[3]);
            }

            if(user.ext[4]){
                huStrArr.push("暗杠+" + user.ext[4]);
            }

            if(user.ext[5]){
                huStrArr.push("点杠+" + user.ext[5]);
            }

            if(user.ext[10]){
                huStrArr.push("明杠" + user.ext[10]);
            }

            if(user.ext[11]){
                huStrArr.push("暗杠" + user.ext[11]);
            }

            if(user.ext[12]){
                huStrArr.push("点杠" + user.ext[12]);
            }

            for (var i = 0; i < dahus.length;++i) {
                if (dahuConfig[dahus[i]]) {
                    if(dahus[i] != 33){
                        huStrArr.push(dahuConfig[dahus[i]]);
                    }
                }
            }

            if(user.ext[13] > 0){
                huStrArr.push("+" + user.ext[13]);
            }else if(user.ext[13] < 0){
                huStrArr.push("" + user.ext[13]);
            }
        }

        if((this.isReplay && MJReplayModel.wanfa == MJWanfaType.TDH)
            || (!this.isReplay && MJRoomModel.wanfa == MJWanfaType.TDH)){
            if(user.pointArr){
                if(user.pointArr[2] > 0) huStrArr.push("杠分+" + user.pointArr[2]);
                else if(user.pointArr[2] < 0)huStrArr.push("杠分" + user.pointArr[2]);
            }
        }

        if(huStrArr.length > 9){
            huStrArr.splice(9,0,"\n");
            hutxt.y -= 10;
        }
        hutxt.setString(huStrArr.join(" "));
    },

    refreshSingle: function(widget,user){
        widget.visible = true;

        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);

        ccui.helper.seekWidgetByName(widget,"uid").setString("ID:"+user.userId);
        //分数
        var pointLabel = ccui.helper.seekWidgetByName(widget,"point");
        var color = "67d4fc";
        if (user.point>0){
            color = "ff6648";
        }
        var point = user.point>0 ? "+"+user.point : ""+user.point;
        pointLabel.setString(""+point);
        pointLabel.setColor(cc.color(color+""));

        //庄家
        ccui.helper.seekWidgetByName(widget,"zhuang").visible = (user.seat==this.data.ext[7]);

        //头像
        var spritePanel = ccui.helper.seekWidgetByName(widget,"Image_icon");
        this.showIcon(spritePanel,user.icon);


        var isHu = false;
        if (user.isHu){
            isHu = true;
        }
        //胡牌
        ccui.helper.seekWidgetByName(widget,"Image_hu").visible = isHu;

        var isFanPao = false;
        if (user.fanPao){
            isFanPao = true;
        }
        //点炮
        ccui.helper.seekWidgetByName(widget,"Image_dianpao").visible = isFanPao;

        this.createMoldPais(widget, user);
        this.createHandPais(widget, user);
        this.createHuedPais(widget, user);

        if(MJRoomModel.wanfa == MJWanfaType.GDCSMJ){
            this.showMaima(widget,user);
        }

        var birdSeat = this.data.birdSeat || [];
        var bird = this.data.bird || [];

        if(MJRoomModel.wanfa == MJWanfaType.TDH){
            var myBirdArr = [];
            for(var i = 0;i<birdSeat.length;++i){
                if(birdSeat[i] == user.seat){
                    myBirdArr.push(bird[i]);
                }
            }

            if(myBirdArr.length > 0){

                var img_spr = new cc.Sprite("res/ui/mj/zzmjRoom/icon_zn.png");
                img_spr.setAnchorPoint(0,0.5);
                img_spr.setPosition(980,90);
                widget.addChild(img_spr);

                var startX = img_spr.x + 15 - (myBirdArr.length - 1)/2*35;
                for(var t = 0;t<myBirdArr.length;++t){
                    var mj = MJAI.getMJDef(myBirdArr[t]);
                    var card = new HZMahjong(MJAI.getDisplayVo(1, 2), mj);
                    card.setScale(0.5);
                    card.setPosition(startX + t*35,img_spr.y - 65);
                    widget.addChild(card);
                }

            }

        }

    },

    showIcon: function(icon,url) {
        //url = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if (!url){
            return;
        }

        var defaultimg = "res/ui/dtz/dtzCom/default_m.png";

        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);

        var size = icon.getContentSize();
        var sprite = new cc.Sprite(defaultimg);
        var scale = 0.9;
        sprite.setScale(scale);
        sprite.x = size.width*0.5;
        sprite.y = size.height*0.5;
        icon.addChild(sprite,5,345);

        cc.loader.loadImg(url,{width: 75, height:75},function(error, texture){
            if(error==null){
                sprite.setTexture(texture);
            }
        });
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
        return new CSMJSmallResultCell(huUser, paoUser, ext);
    },

    selfRender: function () {
        var btnok = this.getWidget("btnok");
        UITools.addClickEvent(btnok,this,this.onOk);
        var Button_11 = this.getWidget("Button_11");
        UITools.addClickEvent(Button_11,this,this.onCheckDesktop);
        var Button_yupai = this.getWidget("Button_yupai");
        UITools.addClickEvent(Button_yupai,this,this.onShowMoreResult);
        Button_yupai.visible = false;
        this.closingPlayers = this.data.closingPlayers;
        this.label_rule = this.getWidget("label_rule");
        var wanfaStr = "";
        if(this.isReplay){

        }else{
            if(MJRoomModel.wanfa == MJWanfaType.TDH){
                wanfaStr = ClubRecallDetailModel.getTDHWanfa(MJRoomModel.intParams);
            }else if(MJRoomModel.wanfa == MJWanfaType.TJMJ){
                wanfaStr = ClubRecallDetailModel.getTJMJWanfa(MJRoomModel.intParams);
            }else if(MJRoomModel.wanfa == MJWanfaType.GDCSMJ){
                wanfaStr = ClubRecallDetailModel.getGDCSMJWanfa(MJRoomModel.intParams);
            }else if(MJRoomModel.wanfa == MJWanfaType.TCMJ){
                wanfaStr = ClubRecallDetailModel.getTCMJWanfa(MJRoomModel.intParams);
            }else if(MJRoomModel.wanfa == MJWanfaType.NYMJ){
                wanfaStr = ClubRecallDetailModel.getNYMJWanfa(MJRoomModel.intParams);
            }else{
                wanfaStr = ClubRecallDetailModel.getCSMJWanfa(MJRoomModel.intParams);
            }
        }
        this.label_rule.setString(wanfaStr);

         if(this.label_rule.getAutoRenderSize().height < 80){
            this.label_rule.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.label_rule.setPositionY(this.label_rule.y + 10);
        }

        var iszimo = true;
        var hasXiaohu = false;
        for(var i = 0;i<this.closingPlayers.length;++i){
            if(this.closingPlayers[i].fanPao)iszimo = false;
            if(this.closingPlayers[i].xiaohus && this.closingPlayers[i].xiaohus.length > 0)hasXiaohu = true;
        }
        if(hasXiaohu)iszimo = true;

        this.gdcsMjHuSeat = 0;

        var showSeatArr = [];
        for(var i = 0;i<this.closingPlayers.length;++i){
            if(iszimo || this.closingPlayers[i].fanPao || this.closingPlayers[i].isHu){
                showSeatArr.push(this.closingPlayers[i].seat);
            }
            if(this.closingPlayers[i].isHu){
                this.gdcsMjHuSeat = this.closingPlayers[i].seat;
            }
        }
        this.showNiaoSeatArr = showSeatArr;

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
        var isNeedClose = false;
        for(var j=1;j<=4;j++) {
            this.getWidget("user"+j).visible = false;
            for(var i=0;i<this.closingPlayers.length;i++){
                var user = this.closingPlayers[i];
                if(user.seat == j) {
                    this.refreshSingle(this.getWidget("user"+j),user);
                    if(MJRoomModel.wanfa == MJWanfaType.TJMJ){
                        var dahus = user.dahus || [];
                        if(dahus.indexOf(7) !== -1 || dahus.indexOf(9) !== -1){
                            isNeedClose = true;
                        }
                    }
                    break;
                }
            }
        }
        if(isNeedClose){
            for(var j=1;j<=4;j++) {
                var widget = this.getWidget("user"+j);
                ccui.helper.seekWidgetByName(widget,"Image_hu").visible = false;//胡牌
                ccui.helper.seekWidgetByName(widget,"Image_dianpao").visible = false;//点炮
            }
        }

        var zuizi = MJRoomModel.getZuiZiName(this.data.ext[10]);
        var wa = MJRoomModel.getHuCountName(this.data.ext[15]);
        var cp = MJRoomModel.getChiPengName(this.data.ext[11]);
        var ting = MJRoomModel.getTingHuName(this.data.ext[13]);
        var jianglei = MJRoomModel.getJiangLeiName(this.data.ext[18]);
        var gangjiafan = MJRoomModel.getGJFName(this.data.ext[16]);
        //this.getWidget("info").setString(csvhelper.strFormat("{0} {1} {2} {3} {4} {5}",zuizi,wa,cp,ting,jianglei,gangjiafan));

        var qyqID = "";
        if(ClosingInfoModel.ext[0] && ClosingInfoModel.ext[0] != 0){
            qyqID = "亲友圈ID：" + ClosingInfoModel.ext[0] + "  ";
        }

        var jushuStr = "第" + MJRoomModel.nowBurCount + "/" + MJRoomModel.totalBurCount + "局";
        var roomIdStr = "房间号：" + MJRoomModel.tableId;
        this.getWidget("info").setString(qyqID + jushuStr + "   " + roomIdStr);

        if (ClosingInfoModel.isReplay){
            var jushuStr = "第" + MJReplayModel.nowBurCount + "/" + MJReplayModel.totalBurCount + "局";
            var roomIdStr = "房间号：" + ClosingInfoModel.ext[1];
            this.getWidget("info").setString(qyqID + jushuStr + "   " + roomIdStr);
        }

        //版本号
        if(this.getWidget("Label_version")){
        	this.getWidget("Label_version").setString(SyVersion.v);
        }

        this.Panel_niao = this.getWidget("Panel_niao");

        if(MJRoomModel.wanfa == MJWanfaType.GDCSMJ){
            this.getWidget("Label_niao").setString("马牌");
        }

        if(MJRoomModel.wanfa == MJWanfaType.NYMJ){
            this.getWidget("Label_niao").setString("抓马");
            this.showNYMJBirds();
        }

        if(MJRoomModel.wanfa == MJWanfaType.TDH){
            this.showLeftCards(this.data.leftCards || []);
        }else{
            if(MJRoomModel.wanfa != MJWanfaType.NYMJ){
                //显示鸟牌
                this.showBirds();
            }
        }

        if(MJRoomModel.wanfa == MJWanfaType.TJMJ){
            this.TJMJShowBirds();
        }else if(MJRoomModel.wanfa == MJWanfaType.GDCSMJ){
            Button_yupai.visible = true;
            this.showJiangma();
        }
    },

    showLeftCards:function(data){
        var txt = this.getWidget("Label_niao");
        txt.x += 15;
        txt.setString("剩余牌:");

        var list = new ccui.ListView();
        list.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        list.setContentSize(530,70);
        list.setPosition(30,-15);
        this.Panel_niao.addChild(list,1);

        var tip_spr = new cc.Sprite("res/ui/mj/zzmjRoom/jt_next.png");
        tip_spr.setPosition(list.x + list.width + 20,list.y + list.height/2);
        this.Panel_niao.addChild(tip_spr);

        for (var j = 0; j < data.length; j++) {

            var item = new ccui.Widget();
            item.setAnchorPoint(0,0);
            item.setContentSize(45,60);

            var vo = MJAI.getMJDef(data[j]);
            var card = new HZMahjong(MJAI.getDisplayVo(1, 2), vo);
            card.scale = 0.7;
            item.addChild(card);

            list.pushBackCustomItem(item);
        }
    },

    onShowMoreResult:function(){
        var mc = new CSMJSmallResultOtherPop(this.data);
        PopupManager.addPopup(mc);
    },

    showJiangma:function(){//奖马
        var isQGH = false;//是不是抢杠胡
        var YPDXCount = 0;//胡牌人数
        var shuSeat = 0;
        var huSeat = 0;
        for(var i=0;i<this.closingPlayers.length;i++){
            var user = this.closingPlayers[i];
            var dahus = user.dahus || [];
            if(user.point > 0){
                ++YPDXCount;
            }
            if(dahus.indexOf(9) !== -1){
                isQGH = true;
            }
            if(user.point < 0){
                shuSeat = user.seat;
            }
            if(user.isHu){
                huSeat = user.seat;
            }
        }

        var mapai = [];
        var birdAttr = this.data.birdAttr || [];
        for(var i = 0;i < birdAttr.length;++i){
            if(birdAttr[i].belongSeat == 0){
                mapai.push(birdAttr[i]);
            }
        }

        //1.抢杠胡 2.一炮多响 3.正常胡
        var reasonA = (isQGH);//抢杠胡、放炮玩家
        var reasonB = (!isQGH && YPDXCount > 1);//不是抢杠胡、一炮多响、放炮玩家
        var reasonC = (!isQGH && YPDXCount == 1);//不是抢杠胡、只有一个炮、胡牌玩家

        if(reasonA || reasonB || reasonC){
            var localSeat = huSeat;
            var widget = this.getWidget("user"+huSeat);
            if(reasonA || reasonB){
                widget = this.getWidget("user"+shuSeat);
                localSeat = shuSeat;
            }

            for(var i = 0;i < mapai.length;++i){
                var id = mapai[i].mjId;
                var mj = MJAI.getMJDef(id);
                if(mapai[i].awardSeat != 0){
                    if(this.gdcsMjHuSeat != 0){
                        mj.zhongma = localSeat == mapai[i].awardSeat ? 2 : 1;
                    }
                }
                var card = new CSMahjong(MJAI.getDisplayVo(1, 3), mj);
                card.scale = 0.6;
                card.x = 1080 - 30 * i;
                card.y = 15;
                widget.addChild(card);
            }
        }
    },

    showMaima:function(widget,user){
        var birdAttr = this.data.birdAttr || [];
        var selfCount = 0;

        for(var i = 0;i < birdAttr.length;++i){
            if(birdAttr[i].belongSeat == user.seat){
                var id = birdAttr[i].mjId;
                var mj = MJAI.getMJDef(id);
                if(birdAttr[i].awardSeat != 0){
                    if(this.gdcsMjHuSeat != 0){
                        if(this.gdcsMjHuSeat == user.seat){//中了庄家
                            mj.zhongma = 2;
                        }else if(user.seat == birdAttr[i].awardSeat){//中自己
                            mj.zhongma = 1;
                        }
                    }
                }
                var card = new CSMahjong(MJAI.getDisplayVo(1, 3), mj);
                card.scale = 0.6;
                card.x = 1080 - 30 * selfCount;
                card.y = 75;
                widget.addChild(card);
                ++selfCount;
            }
        }
    },

    showNYMJBirds: function() {
        var birdList = this.data.birdAttr || [];
        if (birdList){
            for(var j=0;j<birdList.length;j++) {
                var id = birdList[j].mjId;
                var mj = MJAI.getMJDef(id);
                var card = new CSMahjong(MJAI.getDisplayVo(1, 2), mj);
                var size = card.getContentSize();
                var _scale = 0.7;
                card.scale = _scale;
                card.x = (size.width * _scale - 1.5) * j;
                card.y = -15;
                this.Panel_niao.addChild(card);
            }
        }
    },

    showBirds: function() {
        var showSeatArr = this.showNiaoSeatArr || [];
        var birdList = this.data.bird;
        var birdSeat = this.data.birdSeat;
        if (birdList){
            for(var j=0;j<birdList.length;j++) {
                var id = birdList[j];
                var mj = MJAI.getMJDef(id);
                var card = new CSMahjong(MJAI.getDisplayVo(1, 2), mj);
                var size = card.getContentSize();
                var _scale = 0.7;
                card.scale = _scale;
                card.x = (size.width * _scale - 1.5) * j;
                card.y = -15;
                this.Panel_niao.addChild(card);

                if(ArrayUtil.indexOf(showSeatArr,birdSeat[j]) < 0){
                    card._bg.setColor(cc.color.GRAY);
                }
            }
        }
    },

    TJMJShowBirds: function(){
        var birdList = this.data.bird;
        var birdSeat = this.data.birdSeat;

        var birdData = [[],[],[],[]];
        for(var i = 0;i<birdList.length;++i){
            var seat = birdSeat[i] || 0;

            var dir = 1;
            if(seat == 0){
                if(MJRoomModel.renshu == 3)dir = 3;
                if(MJRoomModel.renshu == 2)dir = 4;
            }else{
                var seq = MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,seat);
                var dirArr = [1,2,3,4];
                if(MJRoomModel.renshu == 3)dirArr = [1,2,4];
                if(MJRoomModel.renshu == 2)dirArr = [1,3];
                dir = dirArr[seq - 1];
            }
            if(dir >= 1 && dir <= 4){
                birdData[dir-1].push({id:birdList[i],seat:seat});
            }
        }

        var _scale = 0.6;
        for(var i = 0;i<birdData.length;++i) {
            var dirBird = birdData[i];
            for (var j = 0; j < dirBird.length; ++j) {
                var vo = MJAI.getMJDef(dirBird[j].id);
                var card = new CSMahjong(MJAI.getDisplayVo(1, 1), vo);
                var size = card.getContentSize();
                card.scale = _scale;
                card.x = 1100 - (j + 1) * 60;
                card.y = 50;
                var niao = cc.Sprite("res/ui/mj/mjSmallResult/mjSmallResult_25.png");
                niao.setAnchorPoint(0,0.5);
                niao.x = 0;
                niao.y = size.height - 8;
                card.addChild(niao);
                var userWidget = this.getWidget("user"+dirBird[j].seat);
                if(userWidget){
                   userWidget.addChild(card);
                }
            }
        }
    },

    onCheckDesktop:function(){
        PopupManager.remove(this);
        SyEventManager.dispatchEvent(SyEvent.MJ_SHOW_NEXTGAME_BUTTON,[0]);
    },

    onOk:function(){
        if(ClosingInfoModel.isReplay){
            if (ClosingInfoModel.isReplay){
                LayerManager.showLayer(LayerFactory.HOME);
            }
            PopupManager.remove(this);
            return;
        }
        var data = this.data;
        // cc.log("data.ext[24] =",data.ext[24]);
        if(MJRoomModel.nowBurCount == MJRoomModel.totalBurCount
            || (MJRoomModel.wanfa == MJWanfaType.CSMJ && data.ext[24] == 1)
            || (MJRoomModel.wanfa == MJWanfaType.TJMJ && data.ext[24] == 1)
            || (MJRoomModel.wanfa == MJWanfaType.GDCSMJ && data.ext[24] == 1)
            || (MJRoomModel.wanfa == MJWanfaType.TDH && data.ext[17] == 1)
            || data.isBreak){//最后的结算
            PopupManager.remove(this);
            var mc = new CSMJBigResultPop(data);
            PopupManager.addPopup(mc);
        }else{
            this.issent = true;
            sySocket.sendComReqMsg(3);
        }
    }
});

