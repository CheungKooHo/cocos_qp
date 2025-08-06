/**
 * Created by leiwenwen on 2018/10/15.
 */
var MJRecordItem = ccui.Widget.extend({
    id: null,
    wanfa: null,
    renLength: null,
    ctor: function (renLength,isDaiKai,tableLogs) {
        this.isDaiKai = isDaiKai;
        this.tableLogs = tableLogs || false;
        cc.log("创建麻将战绩条目...");
        this.renLength = renLength;
        this._super();
        this.setContentSize(1140, 265);

        var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(1140,255),cc.color(150,200,255),0);
        Panel_16.setAnchorPoint(cc.p(0,0));
        Panel_16.setPosition(0,0);
        var Image_record=this.Image_record= UICtor.cS9Img("res/ui/dtz/dtzCom/scale9bg1.png", cc.rect(10,10,1,1),cc.size(1140,255));
        Image_record.setPosition(570,127);
        Panel_16.addChild(Image_record);
        var Image_infoBg1=this.Image_infoBg1= UICtor.cImg("res/ui/mj/mjRecord/mjRecord_5.png");
        Image_infoBg1.setPosition(cc.p(-422+Image_record.getAnchorPointInPoints().x, -35+Image_record.getAnchorPointInPoints().y));
        Image_record.addChild(Image_infoBg1);
        var Label_score1=this.Label_score1= UICtor.cLabel("总积分：",24,cc.size(0,0),cc.color(126,49,2),0,0);
        Label_score1.setPosition(cc.p(-67+Image_infoBg1.getAnchorPointInPoints().x, -53+Image_infoBg1.getAnchorPointInPoints().y));
        Image_infoBg1.addChild(Label_score1);
        var Panel_point1=this.Panel_point1= UICtor.cPanel(cc.size(140,55),cc.color(150,200,255),0);
        Panel_point1.setAnchorPoint(cc.p(0,0));
        Panel_point1.setPosition(cc.p(-14+Image_infoBg1.getAnchorPointInPoints().x, -81+Image_infoBg1.getAnchorPointInPoints().y));
        Image_infoBg1.addChild(Panel_point1);
        var Image_head1=this.Image_head1= UICtor.cImg("res/ui/dtz/dtzHome/testIcon.png");
        Image_head1.setPosition(cc.p(-78+Image_infoBg1.getAnchorPointInPoints().x, 28+Image_infoBg1.getAnchorPointInPoints().y));
        Image_infoBg1.addChild(Image_head1);
        var Label_name1=this.Label_name1= UICtor.cLabel("名字呀",22,cc.size(115,27),cc.color(131,88,45),0,0);
        Label_name1.setPosition(cc.p(28+Image_infoBg1.getAnchorPointInPoints().x, 49+Image_infoBg1.getAnchorPointInPoints().y));
        Image_infoBg1.addChild(Label_name1);
        var Label_id1=this.Label_id1= UICtor.cLabel("ID:104234",22,cc.size(115,27),cc.color(131,88,45),0,0);
        Label_id1.setPosition(cc.p(28+Image_infoBg1.getAnchorPointInPoints().x, 5+Image_infoBg1.getAnchorPointInPoints().y));
        Image_infoBg1.addChild(Label_id1);
        var Image_dyj1=this.Image_dyj1= UICtor.cImg("res/ui/mj/mjSmallResult/mjSmallResult_11.png");
        Image_dyj1.setPosition(cc.p(110+Image_infoBg1.getAnchorPointInPoints().x, 44+Image_infoBg1.getAnchorPointInPoints().y));
        Image_infoBg1.addChild(Image_dyj1);
        var Image_fh1=this.Image_fh1= UICtor.cImg("res/ui/mj/mjSmallResult/mjSmallResult_13.png");
        Image_fh1.setPosition(cc.p(110+Image_infoBg1.getAnchorPointInPoints().x, 44+Image_infoBg1.getAnchorPointInPoints().y));
        Image_infoBg1.addChild(Image_fh1);
        var Image_zhuang1=this.Image_zhuang1= UICtor.cImg("res/ui/mj/mjSmallResult/mjSmallResult_21.png");
        Image_zhuang1.setPosition(cc.p(-105+Image_infoBg1.getAnchorPointInPoints().x, 51+Image_infoBg1.getAnchorPointInPoints().y));
        Image_infoBg1.addChild(Image_zhuang1);
        var Image_infoBg2=this.Image_infoBg2= UICtor.cImg("res/ui/mj/mjRecord/mjRecord_5.png");
        Image_infoBg2.setPosition(cc.p(-141+Image_record.getAnchorPointInPoints().x, -35+Image_record.getAnchorPointInPoints().y));
        Image_record.addChild(Image_infoBg2);
        var Label_score2=this.Label_score2= UICtor.cLabel("总积分：",24,cc.size(0,0),cc.color(126,49,2),0,0);
        Label_score2.setPosition(cc.p(-67+Image_infoBg2.getAnchorPointInPoints().x, -53+Image_infoBg2.getAnchorPointInPoints().y));
        Image_infoBg2.addChild(Label_score2);
        var Panel_point2=this.Panel_point2= UICtor.cPanel(cc.size(140,55),cc.color(150,200,255),0);
        Panel_point2.setAnchorPoint(cc.p(0,0));
        Panel_point2.setPosition(cc.p(-14+Image_infoBg2.getAnchorPointInPoints().x, -81+Image_infoBg2.getAnchorPointInPoints().y));
        Image_infoBg2.addChild(Panel_point2);
        var Image_head2=this.Image_head2= UICtor.cImg("res/ui/dtz/dtzHome/testIcon.png");
        Image_head2.setPosition(cc.p(-78+Image_infoBg2.getAnchorPointInPoints().x, 28+Image_infoBg2.getAnchorPointInPoints().y));
        Image_infoBg2.addChild(Image_head2);
        var Label_name2=this.Label_name2= UICtor.cLabel("名字呀",22,cc.size(115,27),cc.color(131,88,45),0,0);
        Label_name2.setPosition(cc.p(28+Image_infoBg2.getAnchorPointInPoints().x, 49+Image_infoBg2.getAnchorPointInPoints().y));
        Image_infoBg2.addChild(Label_name2);
        var Label_id2=this.Label_id2= UICtor.cLabel("ID:104234",22,cc.size(115,27),cc.color(131,88,45),0,0);
        Label_id2.setPosition(cc.p(28+Image_infoBg2.getAnchorPointInPoints().x, 5+Image_infoBg2.getAnchorPointInPoints().y));
        Image_infoBg2.addChild(Label_id2);
        var Image_dyj2=this.Image_dyj2= UICtor.cImg("res/ui/mj/mjSmallResult/mjSmallResult_11.png");
        Image_dyj2.setPosition(cc.p(110+Image_infoBg2.getAnchorPointInPoints().x, 44+Image_infoBg2.getAnchorPointInPoints().y));
        Image_infoBg2.addChild(Image_dyj2);
        var Image_fh2=this.Image_fh2= UICtor.cImg("res/ui/mj/mjSmallResult/mjSmallResult_13.png");
        Image_fh2.setPosition(cc.p(110+Image_infoBg2.getAnchorPointInPoints().x, 44+Image_infoBg2.getAnchorPointInPoints().y));
        Image_infoBg2.addChild(Image_fh2);
        var Image_zhuang2=this.Image_zhuang2= UICtor.cImg("res/ui/mj/mjSmallResult/mjSmallResult_21.png");
        Image_zhuang2.setPosition(cc.p(-105+Image_infoBg2.getAnchorPointInPoints().x, 51+Image_infoBg2.getAnchorPointInPoints().y));
        Image_infoBg2.addChild(Image_zhuang2);
        var Image_infoBg3=this.Image_infoBg3= UICtor.cImg("res/ui/mj/mjRecord/mjRecord_5.png");
        Image_infoBg3.setPosition(cc.p(139+Image_record.getAnchorPointInPoints().x, -35+Image_record.getAnchorPointInPoints().y));
        Image_record.addChild(Image_infoBg3);
        var Label_score3=this.Label_score3= UICtor.cLabel("总积分：",24,cc.size(0,0),cc.color(126,49,2),0,0);
        Label_score3.setPosition(cc.p(-67+Image_infoBg3.getAnchorPointInPoints().x, -53+Image_infoBg3.getAnchorPointInPoints().y));
        Image_infoBg3.addChild(Label_score3);
        var Panel_point3=this.Panel_point3= UICtor.cPanel(cc.size(140,55),cc.color(150,200,255),0);
        Panel_point3.setAnchorPoint(cc.p(0,0));
        Panel_point3.setPosition(cc.p(-14+Image_infoBg3.getAnchorPointInPoints().x, -81+Image_infoBg3.getAnchorPointInPoints().y));
        Image_infoBg3.addChild(Panel_point3);
        var Image_head3=this.Image_head3= UICtor.cImg("res/ui/dtz/dtzHome/testIcon.png");
        Image_head3.setPosition(cc.p(-78+Image_infoBg3.getAnchorPointInPoints().x, 28+Image_infoBg3.getAnchorPointInPoints().y));
        Image_infoBg3.addChild(Image_head3);
        var Label_name3=this.Label_name3= UICtor.cLabel("名字呀",22,cc.size(115,27),cc.color(131,88,45),0,0);
        Label_name3.setPosition(cc.p(28+Image_infoBg3.getAnchorPointInPoints().x, 49+Image_infoBg3.getAnchorPointInPoints().y));
        Image_infoBg3.addChild(Label_name3);
        var Label_id3=this.Label_id3= UICtor.cLabel("ID:104234",22,cc.size(115,27),cc.color(131,88,45),0,0);
        Label_id3.setPosition(cc.p(28+Image_infoBg3.getAnchorPointInPoints().x, 5+Image_infoBg3.getAnchorPointInPoints().y));
        Image_infoBg3.addChild(Label_id3);
        var Image_dyj3=this.Image_dyj3= UICtor.cImg("res/ui/mj/mjSmallResult/mjSmallResult_11.png");
        Image_dyj3.setPosition(cc.p(110+Image_infoBg3.getAnchorPointInPoints().x, 44+Image_infoBg3.getAnchorPointInPoints().y));
        Image_infoBg3.addChild(Image_dyj3);
        var Image_fh3=this.Image_fh3= UICtor.cImg("res/ui/mj/mjSmallResult/mjSmallResult_13.png");
        Image_fh3.setPosition(cc.p(110+Image_infoBg3.getAnchorPointInPoints().x, 44+Image_infoBg3.getAnchorPointInPoints().y));
        Image_infoBg3.addChild(Image_fh3);
        var Image_zhuang3=this.Image_zhuang3= UICtor.cImg("res/ui/mj/mjSmallResult/mjSmallResult_21.png");
        Image_zhuang3.setPosition(cc.p(-105+Image_infoBg3.getAnchorPointInPoints().x, 51+Image_infoBg3.getAnchorPointInPoints().y));
        Image_infoBg3.addChild(Image_zhuang3);
        var Image_infoBg4=this.Image_infoBg4= UICtor.cImg("res/ui/mj/mjRecord/mjRecord_5.png");
        Image_infoBg4.setPosition(cc.p(420+Image_record.getAnchorPointInPoints().x, -35+Image_record.getAnchorPointInPoints().y));
        Image_record.addChild(Image_infoBg4);
        var Label_score4=this.Label_score4= UICtor.cLabel("总积分：",24,cc.size(0,0),cc.color(126,49,2),0,0);
        Label_score4.setPosition(cc.p(-67+Image_infoBg4.getAnchorPointInPoints().x, -53+Image_infoBg4.getAnchorPointInPoints().y));
        Image_infoBg4.addChild(Label_score4);
        var Panel_point4=this.Panel_point4= UICtor.cPanel(cc.size(140,55),cc.color(150,200,255),0);
        Panel_point4.setAnchorPoint(cc.p(0,0));
        Panel_point4.setPosition(cc.p(-14+Image_infoBg4.getAnchorPointInPoints().x, -81+Image_infoBg4.getAnchorPointInPoints().y));
        Image_infoBg4.addChild(Panel_point4);
        var Image_head4=this.Image_head4= UICtor.cImg("res/ui/dtz/dtzHome/testIcon.png");
        Image_head4.setPosition(cc.p(-78+Image_infoBg4.getAnchorPointInPoints().x, 28+Image_infoBg4.getAnchorPointInPoints().y));
        Image_infoBg4.addChild(Image_head4);
        var Label_name4=this.Label_name4= UICtor.cLabel("名字呀",22,cc.size(115,27),cc.color(131,88,45),0,0);
        Label_name4.setPosition(cc.p(28+Image_infoBg4.getAnchorPointInPoints().x, 49+Image_infoBg4.getAnchorPointInPoints().y));
        Image_infoBg4.addChild(Label_name4);
        var Label_id4=this.Label_id4= UICtor.cLabel("ID:104234",22,cc.size(115,27),cc.color(131,88,45),0,0);
        Label_id4.setPosition(cc.p(28+Image_infoBg4.getAnchorPointInPoints().x, 5+Image_infoBg4.getAnchorPointInPoints().y));
        Image_infoBg4.addChild(Label_id4);
        var Image_dyj4=this.Image_dyj4= UICtor.cImg("res/ui/mj/mjSmallResult/mjSmallResult_11.png");
        Image_dyj4.setPosition(cc.p(110+Image_infoBg4.getAnchorPointInPoints().x, 44+Image_infoBg4.getAnchorPointInPoints().y));
        Image_infoBg4.addChild(Image_dyj4);
        var Image_fh4=this.Image_fh4= UICtor.cImg("res/ui/mj/mjSmallResult/mjSmallResult_13.png");
        Image_fh4.setPosition(cc.p(110+Image_infoBg4.getAnchorPointInPoints().x, 44+Image_infoBg4.getAnchorPointInPoints().y));
        Image_infoBg4.addChild(Image_fh4);
        var Image_zhuang4=this.Image_zhuang4= UICtor.cImg("res/ui/mj/mjSmallResult/mjSmallResult_21.png");
        Image_zhuang4.setPosition(cc.p(-105+Image_infoBg4.getAnchorPointInPoints().x, 51+Image_infoBg4.getAnchorPointInPoints().y));
        Image_infoBg4.addChild(Image_zhuang4);
        var Label_room=this.Label_room= UICtor.cLabel("房号：245252",25,cc.size(0,0),cc.color(126,49,2),0,0);
        Label_room.setAnchorPoint(cc.p(0,0.5));
        Label_room.setPosition(cc.p(-554+Image_record.getAnchorPointInPoints().x, 79+Image_record.getAnchorPointInPoints().y));
        Image_record.addChild(Label_room);
        var Label_wanfa=this.Label_wanfa= UICtor.cLabel("红中麻将",25,cc.size(0,0),cc.color(126,49,2),0,0);
        Label_wanfa.setAnchorPoint(cc.p(0,0.5));
        Label_wanfa.setPosition(cc.p(-350+Image_record.getAnchorPointInPoints().x, 79+Image_record.getAnchorPointInPoints().y));
        Image_record.addChild(Label_wanfa);
        var Label_jushu=this.Label_jushu= UICtor.cLabel("局数2/3",25,cc.size(0,0),cc.color(126,49,2),0,0);
        Label_jushu.setAnchorPoint(cc.p(0,0.5));
        Label_jushu.setPosition(cc.p(-206+Image_record.getAnchorPointInPoints().x, 79+Image_record.getAnchorPointInPoints().y));
        Image_record.addChild(Label_jushu);
        var Label_time=this.Label_time= UICtor.cLabel("2019/02/15",25,cc.size(0,0),cc.color(126,49,2),0,0);
        Label_time.setAnchorPoint(cc.p(0,0.5));
        Label_time.setPosition(cc.p(-75+Image_record.getAnchorPointInPoints().x, 79+Image_record.getAnchorPointInPoints().y));
        Image_record.addChild(Label_time);
        var Button_xq=this.Button_xq= UICtor.cBtn("res/ui/mj/mjRecord/mjRecord_4.png");
        Button_xq.setPosition(cc.p(337+Image_record.getAnchorPointInPoints().x, 87+Image_record.getAnchorPointInPoints().y));
        Image_record.addChild(Button_xq);
        var Button_share=this.Button_share= UICtor.cBtn("res/ui/mj/mjRecord/mjRecord_1.png");
        Button_share.setPosition(cc.p(486+Image_record.getAnchorPointInPoints().x, 87+Image_record.getAnchorPointInPoints().y));
        Image_record.addChild(Button_share);

        this.addChild(this.Panel_16);


        ////俱乐部房间标识
        //var Image_jlbRoom=this.Image_jlbRoom= UICtor.cImg("res/ui/dtz/images/jlbroom.png");
        //Image_jlbRoom.setPosition(158,140);
        //Panel_16.addChild(Image_jlbRoom);
        //Image_jlbRoom.visible = false;


        //设置按钮事件
        UITools.addClickEvent(this.Button_xq, this, this.onDetailRecord);
        UITools.addClickEvent(this.Button_share, this, this.onShare);


        this.Panel_16.setTouchEnabled(true);
        //this.selfRender();
    },

    setData: function (des, index, id) {
        this.shareObject = {des: des, index: index, id: id, renLength: this.renLength};
        this.wanfa = des.playType;
        this.id = id;
        this.des = des;
        this.index = index;
        this.ateamPaiMianScore = des.groupScoreA;
        this.bteamPaiMianScore = des.groupScoreB;
        cc.log("des.groupScoreA . des.groupScoreB..." , des.groupScoreA , des.groupScoreB);
        cc.log("des mgs ..." , JSON.stringify(this.des));

        //俱乐部房间标识
        var tableType = 0;
        var closingMsg = JSON.parse(des.closingMsg);
        tableType = closingMsg.isGroupRoom;
        cc.log("tableType" , tableType)
        if (tableType == 1){
            this.Image_jlbRoom.visible = true;
        }

        //this.playerData = des.playerMsg;
        var label1 = new cc.LabelBMFont(index + "", "res/font/font_res_huang1.fnt");

        cc.log("应该获得奖励分的组为：", des.playerMsg[0].winGroup);
        var addExScoreGroup = des.playerMsg[0].winGroup;//如果是中途解散 -1 牌面分相同 0
        this.addExScoreTeam = addExScoreGroup;

        var myTeamScore = 0;
        var otherTeamScore = 0;
        var myWinTeam = 0;
        var myTeamPaimianScore = 0;
        var otherTeamPaimianScore = 0;

        var winTeam = des.playerMsg[0].group;
        var winPlayer = [];
        var lossPlayer = [];
        var sortedPalyer = [];
        //对后台下发的玩家数据进行排序处理 第一个玩家为我自身
        for (var index = 0; index < this.renLength; index++) {
            var tPlayer = des.playerMsg[index];

            if (tPlayer.group == winTeam) {
                winPlayer.push(tPlayer);
            } else {
                lossPlayer.push(tPlayer);
            }

        }
        sortedPalyer = winPlayer.concat(lossPlayer);
        this.playerData = sortedPalyer;

        for (var i = 1; i <= sortedPalyer.length; i++) {
            var tPlayerData = sortedPalyer[i - 1];
            //cc.log("tPlayer..." , tPlayerData.totalPoint , tPlayerData.group , tPlayerData.sex);

            var realName = this.getPalyerCanSeeName(tPlayerData.name, 100, 25);
            this["name_" + i].setString(realName);
            this["id_" + i].setString("ID:"+tPlayerData.userId);

            if (i == 1) {//要求后台传我自身作为第一个玩家
                myWinTeam = tPlayerData.group;
            }
            if (tPlayerData.group == myWinTeam) {
                myTeamScore += tPlayerData.totalPoint;
            } else {
                otherTeamScore += tPlayerData.totalPoint;
            }

            //this["point_" + i].setString(tPlayerData.totalPoint);
            //显示分组
            if (tPlayerData.group == 1) {
                this["ateam_" + i].visible = true;
            } else {
                this["bteam_" + i].visible = true;
            }
            //加载头像
            this.showIcon(tPlayerData.url, i, tPlayerData.sex);
        }

        //记录两组的牌面分 判断我是A组还是B组
        if(myWinTeam == 1){
            myTeamPaimianScore = this.ateamPaiMianScore;
            otherTeamPaimianScore = this.bteamPaiMianScore;
        }else{
            myTeamPaimianScore = this.bteamPaiMianScore;
            otherTeamPaimianScore = this.ateamPaiMianScore;
        }

        //判断胜负 改为使用后台下发的两组牌面分大小比较
        /*        this.winOrLoss = (myTeamPaimianScore >= otherTeamPaimianScore);
         if(myTeamPaimianScore != otherTeamPaimianScore){
         this.winOrLoss = (myTeamPaimianScore >= otherTeamPaimianScore);
         }else{//牌面分相同的情况 比较总分的大小 如果还相同 显示A组胜 B组负
         this.winOrLoss = (myTeamScore >= otherTeamScore);
         }*/


        this.scoreLable1.setString(myTeamScore);
        this.scoreLable2.setString(otherTeamScore);

        //计算终局奖励分 只体现在最终的分差上

        var exScore = 0;
        if (des.playerMsg[0]) {
            exScore = des.playerMsg[0].jiangli;
        }

        if(addExScoreGroup != null && (addExScoreGroup == 1 || addExScoreGroup == 2)){
            //计算附加分
            if (myWinTeam == addExScoreGroup) {
                myTeamScore += exScore;
            } else {
                otherTeamScore += exScore;
            }
        }

        //胜负再次改为使用总分判断 改为依赖计算了附加分以后的总分来显示胜负
        this.winOrLoss = (myTeamScore >= otherTeamScore);
        if(myTeamScore != otherTeamScore){
            this.winOrLoss = (myTeamScore >= otherTeamScore);
        }else{//牌面分相同的情况 比较总分的大小 如果还相同 显示A组胜 B组负
            this.winOrLoss = (myTeamPaimianScore >= otherTeamPaimianScore);
        }

        //this.winOrLoss = (addExScoreGroup == myWinTeam);
        var lableFnt = this.winOrLoss == true ? "res/font/dn_bigResult_font_1.fnt" : "res/font/greeNum_0.fnt";

        if (this.winOrLoss) { //胜利
            this.ImageWin.visible = true;
            this.scoreLable1.setColor(cc.color(255, 111, 24));
            this.scoreLable2.setColor(cc.color(65, 167, 31));
        } else {        //失
            this.ImageLoss.visible = true;
            this.scoreLable2.setColor(cc.color(255, 111, 24));
            this.scoreLable1.setColor(cc.color(65, 167, 31));
        }

        //实际获得总分 要在房间奖励分计算完成之后再计算
        //var offScore = Math.abs(myTeamScore - otherTeamScore);
        //this.offScore = (myTeamScore - otherTeamScore);
        //改为四舍五入的方法
        var offScore = Math.abs(DTZRoomModel.dealScore(myTeamScore) - DTZRoomModel.dealScore(otherTeamScore));
        this.offScore = (DTZRoomModel.dealScore(myTeamScore) - DTZRoomModel.dealScore(otherTeamScore));

        var sign = "+";
        if (myTeamScore >= otherTeamScore) {
            sign = "+";
            lableFnt = "res/font/dn_bigResult_font_1.fnt";
        } else {
            sign = "-";
            lableFnt = "res/font/greeNum_0.fnt";
        }

        //显示分差
        var label = new cc.LabelBMFont(sign + offScore + "", lableFnt);
        label.x = this.winScoreLable.width / 2;
        label.y = this.winScoreLable.height / 2;
        label.scale = 0.8;
        this.winScoreLable.addChild(label);

        //显示房间附加分
        if (exScore != null && exScore != 0 && addExScoreGroup != null && (addExScoreGroup == 1 || addExScoreGroup == 2)) {
            var label = new cc.LabelBMFont(exScore + "", "res/font/dn_bigResult_font_1.fnt");
            label.x = this.roomExScore.width / 2;
            label.y = this.roomExScore.height / 2;
            label.scale = 0.6;
            this.roomExScoreValue = exScore;
            this.roomExScore.addChild(label);

            if(addExScoreGroup == myWinTeam){
                label.x = label.x - 40;
            }else{
                label.x = label.x + 40;
            }
        }

        this.Label_8.setString("" + des.tableId);
        this.Label_5.setString("" + des.time.substr(0, 16));
        UITools.addClickEvent(this.Panel_16, this, this.onDetailRecord);
        //UITools.addClickEvent(this.srcollView,this,this.onDetailRecord);
    },

    onDetailRecord: function () {
        cc.log("onDetailRecord::calling...");
        var curData = {
            roomId: 0,
            tims: 0,
            playData: [],
            winorLoss: 0,
            team1Score: 0,
            team2Score: 0,
            offScore: 0,
            roomExScore: 0,
            addExScoreTeam : 0,
        }
        curData.roomId = this.Label_8.getString();
        curData.times = this.Label_5.getString();
        curData.winorLoss = this.winOrLoss;
        curData.team1Score = this.scoreLable1.getString();
        curData.team2Score = this.scoreLable2.getString();
        curData.playData = this.playerData;
        curData.roomExScore = this.roomExScoreValue;
        curData.offScore = this.offScore;
        curData.addExScoreTeam = this.addExScoreTeam;

        DTZClickRecordModel.init(curData);
        //MatchWaitModel.init(curData);

        sy.scene.hideLoading();
        if (this.isDaiKai){
            //wanfaType，服务端要求加的
            Network.loginReq("qipai","exec",{actionType:6,funcType:2,logType:0,logId:this.id,userId:PlayerModel.userId,wanfaType:8}, function(data){
                cc.log("DTZRecordPop"+JSON.stringify(data));
                var mc = new DTZRecordPop(data.playLogMap,true);
                RecordModel.init(data.playLogMap);
                PopupManager.open(mc,true);
            });
        }else{
            if (this.tableLogs){
                var tableNo = 0;
                for (var index = 0; index < this.tableLogs.length; index++) {
                    if (this.id == this.tableLogs[index].logId){
                        tableNo = this.tableLogs[index].tableNo;
                    }
                }
                cc.log("tableNo::::::::"+tableNo);
                NetworkJT.loginReq("groupAction", "loadTableRecord", {
                    tableNo:tableNo,
                    oUserId:PlayerModel.userId ,
                    isClub:1,
                    recordTag:3
                }, function (data) {
                    if (data) {
                        cc.log("loadTableRecord"+JSON.stringify(data));
                        var mc = new DTZRecordPop(data);
                        RecordModel.init(data);
                        PopupManager.open(mc);
                    }
                }, function (data) {
                    cc.log("getUserPlayLog::"+JSON.stringify(data));
                    FloatLabelUtil.comText(data.message);
                });
            }else {
                Network.loginReq("qipai","getUserPlayLog",{logType:8, logId:this.id , userId:PlayerModel.userId}, function(data){
                    if(data){
                        var mc = new DTZRecordPop(data);
                        RecordModel.init(data);
                        PopupManager.addPopup(mc);
                    }
                },function(data){
                    FloatLabelUtil.comText("获取数据失败");
                });

                //sySocket.sendComReqMsg(127, [0], this.id + "");
            }
        }
    },

    showIcon: function (iconUrl, index, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        //cc.log("战绩 显示第"+ index +"个玩家的头像" + " url:" + JSON.stringify(iconUrl));
        var url = iconUrl;
        //var icon = this.getWidget("icon_" + index);
        var icon = this["icon_" + index];

        var defaultimg = (sex == 1) ? "res/ui/dtz/images/default_m.png" : "res/ui/dtz/images/default_w.png";

        if (icon.getChildByTag(345)) {
            icon.removeChildByTag(345);
        }

        var sprite = new cc.Sprite(defaultimg);
        sprite.x = 0;
        sprite.y = 0;
        sprite.setScale(0.6);
        icon.addChild(sprite, 5, 345);
        if (iconUrl) {
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.scale = 0.6;
                }
            });
        }
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
                //cc.log("实际显示的文字为:" + showName);
                break;
            }
        }
        return showName;
    },

    //战绩分享按钮点击事件
    onShare: function () {
        cc.log("点击触发截图消息...");
        SyEventManager.dispatchEvent(SyEvent.RECORD_SHARE, this.shareObject);
    },


});
