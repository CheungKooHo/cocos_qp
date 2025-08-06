/**
 * Created by zhoufan on 2016/6/30.
 */
var MatchDtzResultPop = BasePopup.extend({
    user: null,
    ctor: function (data,isDaiKai) {
        this.data = data;
        this.isDaiKai = isDaiKai || false;
        var json = "res/DTZMatchResultPop.json";
        this._super(json);
    },

    selfRender: function () {
        cc.log("bigResult selfRender...");

        this.dt = 1;
        this.start = 0;

        //if(this.isMoneyRoom){
        //    //金币场事件
        //    this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.changeSrvOver);
        //    this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        //    this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);
        //}
        for (var i = 0; i < this.data.length; i++) {
            this.loadExtData(this.data[i])
        }
        if (this.is2Ren()) {
            this.getWidget("CteamBg").visible = false;
        }
        //按照队伍排序
        this.data.sort(function (user1, user2) {
            return user1.group > user2.group;
        });

        if (this.data.match) {
            cc.log("send 15 comder...");
            sySocket.sendComReqMsg(15, [], "");
        } else {
            this.titleImgBg = this.getWidget("titleBg");
            if (DTZRoomModel.is4Ren()) {
                if (DTZRoomModel.wanfa == DTZRoomModel.wanfa4) {
                    //修改大结算界面分数标题背景图...
                    this.titleImgBg.loadTexture("res/ui/dtz/dtzBigResult/newTitle.png");
                }
            } else {
                if (DTZRoomModel.is4FuPai()) {
                    this.titleImgBg.loadTexture("res/ui/dtz/dtz3RenBigResult/dtz3RenBigResult_3.png");
                }
            }

            var max = 0;
            for (var i = 0; i < this.data.length; i++) {
                var d = this.data[i];
                if (d.totalPoint >= max)
                    max = d.totalPoint;
            }

            var aTeamData = {paimian: 0, tzK: 0, tzA: 0, tz2: 0, tzsKing:0, tzbKing:0, point: 0, xi: 0, xiKingS: 0, xiKingB: 0, superBoom: 0 , mingciScore:0, isPochan:0};
            var bTeamData = {paimian: 0, tzK: 0, tzA: 0, tz2: 0, tzsKing:0, tzbKing:0, point: 0, xi: 0, xiKingS: 0, xiKingB: 0, superBoom: 0 , mingciScore:0, isPochan:0};
            var cTeamData = {paimian: 0, tzK: 0, tzA: 0, tz2: 0, tzsKing:0, tzbKing:0, point: 0, xi: 0, xiKingS: 0, xiKingB: 0, superBoom: 0 , mingciScore:0, isPochan:0};
            var aScore = 0;
            var bScore = 0;
            var cScore = 0;
            var offTeamScore = 0;

            //记录各组分数详情
            for (var i = 0; i < this.data.length; i++) {

                cc.log("玩家信息...", JSON.stringify(this.data[i]));
                var teamId = this.data[i].group;
                cc.log("teamId....", this.data[i].group);
                if (teamId == 1) {
                    aScore += this.data[i].totalPoint;
                    this.loadData(aTeamData  , this.data[i]);
                } else if (teamId == 3) {
                    cScore += this.data[i].totalPoint;
                    this.loadData(cTeamData  , this.data[i]);
                } else {
                    bScore += this.data[i].totalPoint;
                    this.loadData(bTeamData  , this.data[i]);
                }
                cc.log("aScore , bSocre , cScore.." , aScore , bScore , cScore);
                //显示头像
                //var icon = ccui.helper.seekWidgetByName(widget,"icon");
                var user = this.data[i];
                //user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
                var icon = this.getWidget("playerIcon" + (i + 1));
                var defaultimg = (user.sex == 1) ? "res/ui/dtz/images/default_m.png" : "res/ui/dtz/images/default_w.png";
                if (icon.getChildByTag(345))
                    icon.removeChildByTag(345);
                var sprite = new cc.Sprite(defaultimg);
                sprite.x = 40;
                sprite.y = 40;
                sprite.setScale(0.7);
                icon.addChild(sprite, 5, 345);
                if (user.icon) {
                    cc.loader.loadImg(user.icon, {width: 252, height: 252}, function (error, img) {
                        if (!error) {
                            sprite.setTexture(img);
                            sprite.scale = 0.8;
                        }
                    });
                }
            }

            this.refreshTeamData(this.getWidget("AteamBg"), aTeamData, 1);
            this.refreshTeamData(this.getWidget("BteamBg"), bTeamData, 2);
            if (this.is3Ren()) {
                this.refreshTeamData(this.getWidget("CteamBg"), cTeamData, 3);
            }
            //改为使用牌面分判断输赢
            cc.log("aTeamData.paimian , bTeamData.paimian", aTeamData.paimian, bTeamData.paimian + "获得奖励分的组为：" + ClosingInfoModel.gotoBigResult);
            /*          var winTeam = 0;
             var addExScoreTeam = ClosingInfoModel.gotoBigResult;
             if(aTeamData.paimian != bTeamData.paimian){
             winTeam = aTeamData.paimian > bTeamData.paimian ? 1 : 2;
             }else{//牌面分数相同的极端情况 胜负根据总分的大小判断 如果总分也他喵的相同，那就A组胜B组负 两组都不加附加分
             winTeam = aTeamData.point >= bTeamData.point ? 1 : 2;
             }*/

            //改为使用总分判断胜负
            var winTeam = 0;
            var addExScoreTeam = ClosingInfoModel.gotoBigResult;
            if(aTeamData.point != bTeamData.point){
                winTeam = aTeamData.point >= bTeamData.point ? 1 : 2;
            }else{//牌面分数相同的极端情况 胜负根据总分的大小判断 如果总分也他喵的相同，那就A组胜B组负 两组都不加附加分
                winTeam = aTeamData.paimian > bTeamData.paimian ? 1 : 2;
            }

            //计算附加分应该加载哪一组上
            var teamNode = null;
            var exScoreNode = null;
            var totalScoreNode = null;
            var teamNode1 = null;
            var exScoreNode1 = null;
            var totalScoreNode1 = null;
            var exScore = DTZRoomModel.exScore;
            if (DTZRoomModel.is4Ren()) {
                if (addExScoreTeam == 1 && DTZRoomModel.exScore != 0) {
                    teamNode = this.getWidget("AteamBg");
                    exScoreNode = ccui.helper.seekWidgetByName(teamNode, "exRoomScore");
                    totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "teamScore");
                    aScore += DTZRoomModel.exScore;

                } else if (addExScoreTeam == 2 && DTZRoomModel.exScore != 0) {
                    teamNode = this.getWidget("BteamBg");
                    exScoreNode = ccui.helper.seekWidgetByName(teamNode, "exRoomScore");
                    totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "teamScore");
                    bScore += DTZRoomModel.exScore;
                }
            } else {
                cc.log("addExScoreTeam::"+addExScoreTeam);
                switch (parseInt(addExScoreTeam)) {
                    case 1:
                        teamNode = this.getWidget("AteamBg");
                        totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "totalScore1");
                        break;
                    case 2:
                        teamNode = this.getWidget("BteamBg");
                        totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "totalScore2");
                        break;
                    case 3:
                        teamNode = this.getWidget("CteamBg");
                        totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "totalScore3");
                        break;
                    case 12:
                        teamNode = this.getWidget("AteamBg");
                        teamNode1 = this.getWidget("BteamBg");
                        totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "totalScore1");
                        totalScoreNode1 = ccui.helper.seekWidgetByName(teamNode1, "totalScore2");
                        exScore = exScore/2;
                        if(DTZRoomModel.is2Ren()){
                            exScore = 0;
                        }
                        break;
                    case 13:
                        teamNode = this.getWidget("AteamBg");
                        teamNode1 = this.getWidget("CteamBg");
                        totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "totalScore1");
                        totalScoreNode1 = ccui.helper.seekWidgetByName(teamNode1, "totalScore3");
                        exScore = exScore/2;
                        if(DTZRoomModel.is2Ren()){
                            exScore = 0;
                        }
                        break;
                    case 23:
                        teamNode = this.getWidget("BteamBg");
                        teamNode1 = this.getWidget("CteamBg");
                        totalScoreNode = ccui.helper.seekWidgetByName(teamNode, "totalScore2");
                        totalScoreNode1 = ccui.helper.seekWidgetByName(teamNode1, "totalScore3");
                        exScore = exScore/2;
                        if(DTZRoomModel.is2Ren()){
                            exScore = 0;
                        }
                        break;
                    case 123:
                        exScoreNode = totalScoreNode =null;
                        break;
                }
                if (teamNode) {
                    exScoreNode = ccui.helper.seekWidgetByName(teamNode, "exRoomScore");
                }
                if (teamNode1) {
                    exScoreNode1 = ccui.helper.seekWidgetByName(teamNode1, "exRoomScore");
                }
            }
            if(exScoreNode != null && totalScoreNode != null && exScore > 0){
                cc.log("显示附加分数...1");
                var label = new cc.LabelBMFont("+" + exScore, "res/font/dn_bigResult_font_1.fnt");
                label.scale = 0.5;
                label.x = exScoreNode.width / 2;
                label.y = exScoreNode.height / 2;
                exScoreNode.addChild(label);
                if(!DTZRoomModel.is4Ren()) {
                    totalScoreNode.y += 12;
                }
                totalScoreNode.y += 0;
            }

            if(exScoreNode1 != null && totalScoreNode1 != null  && exScore > 0){
                cc.log("显示附加分数...2");
                var label = new cc.LabelBMFont("+" + exScore, "res/font/dn_bigResult_font_1.fnt");
                label.scale = 0.5;
                label.x = exScoreNode1.width / 2;
                label.y = exScoreNode1.height / 2;
                exScoreNode1.addChild(label);
                if(!DTZRoomModel.is4Ren()) {
                    totalScoreNode1.y += 12;
                }
                totalScoreNode1.y += 0;
            }


            if (this.is4Ren()) {
                //加入四舍五入
                var tNewAscore = DTZRoomModel.dealScore(aScore);
                var tNewBscore = DTZRoomModel.dealScore(bScore);
                offTeamScore = Math.abs(tNewAscore - tNewBscore);
                var tDesc = (aScore >= bScore) ? "A组赢总分:" : "B组赢总分:";
                this.getWidget("LabelDescWin").setString(tDesc);
            }else{
                offTeamScore = Math.abs(aScore - bScore);
            }

            this.getWidget("winScore").setString("赢：" + offTeamScore + "分");

            var aTeamNode = this.getWidget("AteamTitle");
            var bTeamNode = this.getWidget("BteamTitle");
            if(aTeamNode){
                aTeamNode.loadTexture("res/ui/dtz/dtzSmallResult/a.png");
                aTeamNode.y = aTeamNode.y - aTeamNode.height * 0.5;
            }
            if(bTeamNode){
                bTeamNode.loadTexture("res/ui/dtz/dtzSmallResult/b.png");
                bTeamNode.y = bTeamNode.y - bTeamNode.height * 0.5
            }
            if (this.is4Ren()) {
                this.getWidget("AteamState").visible = false;
                this.getWidget("BTeamState").visible = false;
                //修正AB分组标签的位置
                this.getWidget("aTeamIcon1").x += 40;
                this.getWidget("aTeamIcon1").y += 40;
                this.getWidget("aTeamIcon2").x += 40;
                this.getWidget("aTeamIcon2").y += 40;
                this.getWidget("bTeamIcon1").x += 40;
                this.getWidget("bTeamIcon1").y += 40;
                this.getWidget("bTeamIcon2").x += 40;
                this.getWidget("bTeamIcon2").y += 40;
                var fnt = "res/font/font_res_huang.fnt";
                var tNode = this.getWidget("lableWinScore");
                var label = new cc.LabelBMFont("+" + offTeamScore, "res/font/font_res_huang.fnt");
                label.scale = 0.8;
                label.x = tNode.width / 2;
                label.y = tNode.height / 2;
                tNode.addChild(label);

                var updownLevelLable = this.getWidget("updownLevel");
                var level  =  Math.floor(offTeamScore/100);
                var levelStr = "";
                if (level > 0){
                    levelStr = "（正"+level+"级）";
                }else if (level < 0){
                    levelStr = "（负"+Math.abs(level)+"级）";
                }
                updownLevelLable.setString(levelStr);
            }
            //a组赢
            //b组输

            var Button_20 = this.getWidget("Button_20");
            Button_20.visible = false;
            if (Button_20) {
                UITools.addClickEvent(Button_20, this, this.onShare);
            }
            var Buton_Out = this.getWidget("close_btn");
            UITools.addClickEvent(Buton_Out, this, this.onToHome);
            var btnContinue = this.getWidget("btn_Continue");
            btnContinue.visible = false;
            //UITools.addClickEvent(btnContinue, this, this.onContinue);

            //显示房间信息
            var tableIdDesc = "";
            var wanfaDesc = "";
            var zhifuDesc = "";
            var timeDesc = "";
            var endScoreDesc = "";
            var exScoreDesc = "";
            if (this.isDaiKai){

                var createPara = dkResultModel.data.createPara.split(",");
                cc.log("createPara(((((",createPara);
                if (createPara[1] == 113 || createPara[1] == 115 || createPara[1] == 117){
                    wanfaDesc = "三副牌 ";
                }else if (DTZRoomModel.is4FuPai(createPara[1])){
                    wanfaDesc = "四副牌 ";
                }
                endScoreDesc = createPara[3] + "分";
                exScoreDesc = createPara[4] + "分";
                tableIdDesc = dkResultModel.data.tableId;
                timeDesc = dkResultModel.data.time;
                zhifuDesc = "AA支付";
                if (createPara[2] == 2){
                    zhifuDesc = "房主支付";
                }else if (createPara[2] == 3) {
                    zhifuDesc = "群主支付";
                }
            }else{
                tableIdDesc = DTZRoomModel.tableId;
                wanfaDesc = DTZRoomModel.is3FuPai() ? "三副牌" : "四副牌";
                zhifuDesc = "房主支付";
                if (DTZRoomModel.getCostFangShi() == 1){
                    zhifuDesc = "AA支付";
                }else if (DTZRoomModel.getCostFangShi() == 3) {
                    zhifuDesc = "群主支付";
                }
                //zhifuDesc = DTZRoomModel.costFangFei <= 20 ? "AA支付" : "房主支付";
                //if (this.is2Ren()) {
                //    zhifuDesc = DTZRoomModel.costFangFei <= 30 ? "AA支付":"房主支付";
                //}
                timeDesc = ClosingInfoModel.ext[2];
                endScoreDesc = DTZRoomModel.endScore + "分";
                exScoreDesc = DTZRoomModel.exScore + "分";
            }
            this.getWidget("Label_EndAddScore").setString(exScoreDesc);
            this.getWidget("Label_time").setString(timeDesc);
            this.getWidget("Label_version").setString(SyVersion.v);
            //if(!this.isMoneyRoom){
            //    this.getWidget("Label_RoomId").setString(tableIdDesc);
            //    this.getWidget("Label_wanfa").setString(wanfaDesc);
            //    this.getWidget("Label_endScore").setString(endScoreDesc);
            //    this.getWidget("Label_pay").setString(zhifuDesc);
            //}

            //俱乐部房间图片标识
            var tableType = 0;
            tableType = ClosingInfoModel.ext[8];
            if (this.is3Ren()){
                tableType = ClosingInfoModel.ext[9];
            }
            this.Image_jlbRoom = this.getWidget("Image_jlbRoom");
            this.Image_jlbRoom.visible = false;
            if (DTZRoomModel.isClubRoom(tableType)){
                this.Image_jlbRoom.visible = true;
            }

            this.dealMoneyView();
        }
        var countDown = this.countDown = this.getWidget("Label_RoomId");
        countDown.setString("");
        this.scheduleUpdate();
    },

    update:function(dt){
        this.dt += dt;
        if(this.dt >= 1){
            this.dt = 0;
            this.start++;
            if(this.start < 5){
                this.countDown.setString(this.start + "s");
                if (parseInt(this.start) >= 4){
                    this.onToHome();
                }
            }
        }
    },

    dealMoneyView:function(){
        var message = MatchModel.getResultRank();
        var curRank = message[2];
        var totalRenshu = message[3];
        var bv = DTZRoomModel.getMoneyRoomBeilv();
        var str = "排名："+curRank+"/"+totalRenshu + "  倍率：" + bv;
        this.getWidget("LabelRoomCard").setString("比赛场   " + str);
        this.getWidget("Label_Desc").setString("");

        //this.updateRank();
    },

    updateRank:function(){
    },

    getMoneyCost:function(){
        return ClosingInfoModel.ext[12];
    },

    getMoneyModeId:function(){
        return ClosingInfoModel.ext[10];
    },

    getMoneyBeilv:function(){
        return ClosingInfoModel.ext[11];
    },

    /**
     * 金币场大结算需要显示上下游分数
     */
    getMingciScore:function(mingci){
        var changeScoreDef = [100,-40,-60];
        cc.log("金币场大结算奖励分..." , changeScoreDef[mingci]);
        return changeScoreDef[mingci-1];
    },

    is2Ren: function() {
        return (this.data.length==2);
    },

    is3Ren: function() {
        return (this.data.length==3);
    },

    is4Ren: function() {
        return (this.data.length==4);
    },

    //设置名字的方法 (限制长度)

    getPalyerCanSeeName: function (nameString, width, fontSize) {
        //nameString = "我1想lm试试中文";
        var length = nameString.length;
        var tlableForSize = null;
        var showName = nameString;
        var tName = null;
        var tWidth = 0;

        for (var curLenght = 2; curLenght <= length; curLenght++) {
            tName = nameString.substring(0, curLenght);
            tlableForSize = new cc.LabelTTF(tName, "Arial", fontSize);
            tWidth = tlableForSize.width;
            //cc.log("当前显示的文字为 " + tName + "宽度为:" + tWidth + "");
            if (tWidth >= width) {
                showName = nameString.substring(0, curLenght - 1);
                cc.log("实际显示的文字为:" + showName);
                break;
            }
        }
        return showName;
    },

    refreshTeamData: function (widget, user, teamId) {
        cc.log("refreshTeamData...", JSON.stringify(user));
        var specielScore = 0; //三副牌是地炸分 四副牌是喜分
        var tAllTongziScore = 0; //记算筒子的总分
        this.user = user;
        var nameWidth = this.is4Ren() ? 75 : 135;
        var realName1 = this.getPalyerCanSeeName(user.name1, nameWidth, 20);
        ccui.helper.seekWidgetByName(widget, "name_1").setString(realName1);
        if (this.is4Ren()) {
            var realName2 = this.getPalyerCanSeeName(user.name2, nameWidth, 20);
            ccui.helper.seekWidgetByName(widget, "name_2").setString(realName2);
        }
        //ccui.helper.seekWidgetByName(widget,"uid").setString("UID:"+user.userId);

        var superBoomScore = 400;
        if(DTZRoomModel.isWTZ()){
            superBoomScore = 500;
        }

        //显示牌局 筒子详情
        if (DTZRoomModel.is3FuPai()) {
            tAllTongziScore += user.tzK * 100;
            tAllTongziScore += user.tzA * 200;
            tAllTongziScore += user.tz2 * 300;
            if(DTZRoomModel.isWTZ()){//如果开启了王筒子玩法
                tAllTongziScore += (user.tzsKing + user.tzbKing) * 400;
            }
            if (user.superBoom != null && user.superBoom > 0) {
                specielScore += user.superBoom * superBoomScore;
            }
        } else {
            specielScore += user.xi * 100;
            specielScore += user.xiKingS * 200;
            specielScore += user.xiKingB * 200;
        }

        //各种 总分
        ccui.helper.seekWidgetByName(widget, "tongziScore" + teamId).setString(specielScore + "分");
        if(DTZRoomModel.isMatchRoom){//金币场的牌面分要额外减去上下游分数
            ccui.helper.seekWidgetByName(widget, "cardScore" + teamId).setString(user.point - specielScore - tAllTongziScore - user.mcScoreValue + "分");
        }else{
            ccui.helper.seekWidgetByName(widget, "cardScore" + teamId).setString(user.point - specielScore - tAllTongziScore + "分");
        }
        if (this.is4Ren()) {
            ccui.helper.seekWidgetByName(widget, "totalScore" + teamId).setString(user.point + "分");
        } else {
            var point = user.point > 0 ? "+"+user.point : ""+user.point;
            var totalScoreLabel = ccui.helper.seekWidgetByName(widget, "totalScore" + teamId);
            if (user.point < 0) {
                totalScoreLabel.setFntFile("res/font/font_dtz_2.fnt");
            }
            totalScoreLabel.setString(point);
            var winlosePoint = user.winlosePoint > 0 ? "+"+user.winlosePoint : ""+user.winlosePoint;
            var winloseScoreLabel = ccui.helper.seekWidgetByName(widget, "winloseScore" + teamId);
            if (user.winlosePoint < 0) {
                winloseScoreLabel.setFntFile("res/font/font_dtz_2.fnt");
            }
            winloseScoreLabel.setString(winlosePoint);

            var level  =  Math.floor(user.winlosePoint/100);
            var levelStr = "";
            var updownLevelLable = ccui.helper.seekWidgetByName(widget, "updownLevel" + teamId);
            if (level > 0){
                levelStr = "（正"+level+"级）";
            }else if (level < 0){
                levelStr = "（负"+Math.abs(level)+"级）";
            }
            updownLevelLable.setString(levelStr);
        }
        user.paimian = user.point - specielScore - tAllTongziScore;

        //轮次
        if(!DTZRoomModel.isMatchRoom){
            this.getWidget("roundNum" + teamId).setString(ClosingInfoModel.round + "局");
        }


        /*
         var superBoom = user.totalSuperBoom;
         cc.log("superBoom" + user.totalSuperBoom);
         if(superBoom != null){
         tongziScore += superBoom * 400
         }
         */

        //筒子 或者 喜 详情
        if (DTZRoomModel.is3FuPai()) {
            ccui.helper.seekWidgetByName(widget, "KTongziNum" + teamId).setString((user.tzK) + "");
            ccui.helper.seekWidgetByName(widget, "ATongziNum" + teamId).setString((user.tzA) + "");
            ccui.helper.seekWidgetByName(widget, "2TongziNum" + teamId).setString((user.tz2) + "");
            if(DTZRoomModel.isWTZ()){
                ccui.helper.seekWidgetByName(widget, "WTongziNum" + teamId).setString((user.tzsKing + user.tzbKing) + "");
            }

            ccui.helper.seekWidgetByName(widget, "KScore" + teamId).setString((user.tzK * 100) + "分");
            ccui.helper.seekWidgetByName(widget, "AScore" + teamId).setString((user.tzA * 200) + "分");
            ccui.helper.seekWidgetByName(widget, "2Score" + teamId).setString((user.tz2 * 300) + "分");
            if(DTZRoomModel.isWTZ()){
                ccui.helper.seekWidgetByName(widget, "WScore" + teamId).setString(((user.tzsKing + user.tzbKing) * 400) + "分");
            }

        } else {
            ccui.helper.seekWidgetByName(widget, "KTongziNum" + teamId).setString((user.xi) + "");
            ccui.helper.seekWidgetByName(widget, "ATongziNum" + teamId).setString((user.xiKingS) + "");
            ccui.helper.seekWidgetByName(widget, "2TongziNum" + teamId).setString((user.xiKingB) + "");

            ccui.helper.seekWidgetByName(widget, "KScore" + teamId).setString((user.xi * 100) + "分");
            ccui.helper.seekWidgetByName(widget, "AScore" + teamId).setString((user.xiKingS * 200) + "分");
            ccui.helper.seekWidgetByName(widget, "2Score" + teamId).setString((user.xiKingB * 200) + "分");
        }

        //金币场额外的上下游分数显示
        if(DTZRoomModel.isMatchRoom()){
            ccui.helper.seekWidgetByName(widget , "mingciScore" + teamId).setString(user.mcScoreValue);
        }

        //显示分数
        if (this.is4Ren()) {
            var pointMax = ccui.helper.seekWidgetByName(widget, "teamScore");
            var font = user.point >= 0 ? "res/font/dn_bigResult_font_1.fnt" : "res/font/greeNum_0.fnt";
            var label = new cc.LabelBMFont(user.point + "", font);
            label.x = pointMax.width / 2;
            label.y = pointMax.height / 2 + 7;
            label.scale = 0.7;
            pointMax.addChild(label);

            //打了几轮
            var roundNum = ccui.helper.seekWidgetByName(widget, "roundNum" + teamId);
            label = new cc.LabelBMFont(ClosingInfoModel.round + "", "res/font/font_res_huang.fnt");
            label.x = roundNum.width / 2;
            label.y = roundNum.height / 2 + 12;
        }

        //增加破产标记显示
        if(user.isPochan != null){
            //ccui.helper.seekWidgetByName(widget, "pochanSign" + teamId).visible = (user.isPochan <= 0);
            ccui.helper.seekWidgetByName(widget, "pochanSign" + teamId).visible = false;
        }
        //roundNum.addChild(label);
    },

    loadExtData: function (userData) {
        cc.log("userData.ext..." , userData.ext);
        var index = 0;
        userData.totalFive = parseInt(userData.ext[index]);
        userData.totalTen = parseInt(userData.ext[++index]);
        userData.totalK = parseInt(userData.ext[++index]);
        userData.totalTongzi = parseInt(userData.ext[++index]);
        userData.totalXi = parseInt(userData.ext[++index]);
        userData.totalxiJacks = parseInt(userData.ext[++index]);
        userData.totalxiJackb = parseInt(userData.ext[++index]);
        userData.totalSuperBoom = parseInt(userData.ext[++index]);
        userData.isGuan = parseInt(userData.ext[++index]);
        userData.tzA = parseInt(userData.ext[++index]);
        userData.tzK = parseInt(userData.ext[++index]);
        userData.tz2 = parseInt(userData.ext[++index]);
        userData.group = parseInt(userData.ext[++index]);
        userData.mingci = parseInt(userData.ext[++index]);
        ++index;//这位暂时没用到
        ++index;//这位暂时没用到
        userData.tzsKing = parseInt(userData.ext[++index]);
        userData.tzbKing = parseInt(userData.ext[++index]);
        userData.isPochan = parseInt(userData.ext[++index]);
        cc.log("当前玩家的破产状态",userData.ext , ":" + userData.ext[index])

    },

    loadData:function(teamDataStruct  , dateSource){
        if (teamDataStruct.name1 == null) {
            teamDataStruct.name1 = dateSource.name;
        } else {
            teamDataStruct.name2 = dateSource.name;
        }
        teamDataStruct.tzK += dateSource.tzK;
        teamDataStruct.tzA += dateSource.tzA;
        teamDataStruct.tz2 += dateSource.tz2;
        teamDataStruct.tzsKing += dateSource.tzsKing;
        teamDataStruct.tzbKing += dateSource.tzbKing;
        teamDataStruct.xi += dateSource.totalXi;
        teamDataStruct.xiKingS += dateSource.totalxiJacks;
        teamDataStruct.xiKingB += dateSource.totalxiJackb;
        teamDataStruct.point += dateSource.totalPoint;
        teamDataStruct.superBoom += dateSource.totalSuperBoom;
        teamDataStruct.winlosePoint = dateSource.boom;
        teamDataStruct.mingci = dateSource.mingci;
        teamDataStruct.mcScoreValue = this.getMingciScore(dateSource.mingci);
        teamDataStruct.isPochan = dateSource.isPochan;

    },

    /**
     * 分享战报
     */
    onShare: function () {
        var winSize = cc.director.getWinSize();
        var texture = new cc.RenderTexture(winSize.width, winSize.height);
        if (!texture)
            return;
        texture.anchorX = 0;
        texture.anchorY = 0;
        texture.begin();
        this.visit();
        texture.end();
        texture.saveToFile("share_pdk.jpg", cc.IMAGE_FORMAT_JPEG, false);

        var obj = {};
        obj.tableId = DTZRoomModel.tableId;
        obj.userName = PlayerModel.username;
        obj.callURL = SdkUtil.SHARE_URL + '?userName=' + encodeURIComponent(PlayerModel.name);
        obj.title = "打筒子   房号:" + DTZRoomModel.tableId;
        obj.description = "我已在快乐打筒子开好房间,纯技术实力的对决,一起打筒子！";
        obj.shareType = 0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function () {
            sy.scene.hideLoading();
            //SharePop.show(obj);
            ShareDTPop.show(obj);
        }, 500);
    },


    askCheckServer:function(){
        this.isChangingSrv = true;
        var strparams = [];
        var moneyWanfa = 115;
        var modeId = this.getMoneyModeId();//moneyWanfa * 10 + this.moneyRoomLevel;
        strparams.push("1");
        strparams.push(modeId+"");
        cc.log("金币场请求切服..." , strparams );
        //LayerManager.showLayer(LayerFactory.DTZ_MONEY_LOADING);
        PopupManager.addPopup(new DTZMoneyLoadingPopup(moneyWanfa));
        var self = this;
        setTimeout(function(){
            self.isChangingSrv = false;
            SyEventManager.dispatchEvent(SyEvent.REMOVE_MONEY_LOADING,{});
            sy.scene.hideLoading();
        } , 5000);
        sySocket.sendComReqMsg(29 , [moneyWanfa] , strparams);//先请求后台分配服务器
    },

    onSuc:function(){
        if(this.isChangingSrv){//由切服出发的重连成功才继续进入金币场
            this.doJoinMoneyRoom()
        }
    },

    changeSrvOver:function(){
        cc.log("选服完毕 请求后台加入房间消息 "  , this.isChangingSrv);
        if(this.isChangingSrv){//由切服出发的重连成功才继续进入金币场
            this.doJoinMoneyRoom();
        }
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        if(status==ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            SyEventManager.dispatchEvent(SyEvent.REMOVE_MONEY_LOADING,{});
            FloatLabelUtil.comText("加入金币场失败");
        }else if(status==ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    doJoinMoneyRoom:function(){
        var moneyWanfa = 115;
        var roomTypeValue = moneyWanfa;
        var roomTypeAndLevel = this.getMoneyModeId();// moneyWanfa * 10 + this.moneyRoomLevel;
        //cc.log("roomTypeValue roomTypeAndLevel" , roomTypeValue,String(roomTypeAndLevel));
        sySocket.sendComReqMsg(2,[parseInt(1) , roomTypeValue],String(roomTypeAndLevel));
        this.isChangingSrv = false;
        LayerManager.showLayer(LayerFactory.HOME);
        PopupManager.remove(this);
        //PopupManager.removeAll();
        //这里不再移除结算页面 一旦请求成功收到Createtable消息会移除所有弹框
    },

    /**
     * 金币场开始下一局
     */
    onContinue:function(){
        this.askCheckServer();
    },

    /**
     * 返回大厅
     */
    onToHome: function () {
        this.unscheduleUpdate();
        PopupManager.remove(this);
        if (MatchAwardModel.getData() && !PopupManager.hasClassByPopup(MatchAwardPop)){
            var message = MatchAwardModel.getData();
            PopupManager.addPopup(new MatchAwardPop(message));
        }else if (MatchResultModel.getData() && !PopupManager.hasClassByPopup(MatchAlertPop)){
            var message = MatchResultModel.getData();
            var params = message.params;
            var strParams  = message.strParams;
            var childCode = params[0];
            if(childCode == 0){//淘汰消息
                //PopupManager.removeAll();
                if(strParams.length > 0 &&strParams[0]!= ""){

                }else{
                    MatchAlertPop.showOnlyOk(params[2]);
                }
            }else if(childCode == 7) {//被淘汰了，且可以复活的状态
                MatchAlertPop.show(params[1]);
            }
        }else{
            SyEventManager.dispatchEvent(SyEvent.MATCH_SHOW_TIP);
        }

    }
});
