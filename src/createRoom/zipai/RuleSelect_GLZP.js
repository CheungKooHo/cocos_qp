/**
 * Created by Administrator on 2019/9/30.
 */

var RuleSelect_GLZP = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        cc.log("RuleSelect_GLZP::::::::::::::::::::::::::::::::::::::::", "桂林字牌!!!");
        this.createNumBox(13);
        this.createChangeScoreBox(15);//创建低于xx分加xx分
        this.getItemByIdx(15,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["5局","10局","20局","30局"]},//1
            {title:"人数",type:1,content:["2人","3人","4人"]},//2
            {title:"抽牌",type:1,content:["不抽底牌","抽牌10张","抽牌20张"]},//3
            {title:"起胡",type:1,content:["10息起胡","15息起胡"]},//4
            {title:"算子",type:1,content:["5胡1子","3胡1子"]},//5
            {title:"自摸",type:1,content:["自摸2倍","自摸4倍","自摸加1"]},//6
            {title:"放炮",type:1,content:["放炮2倍","放炮4倍","放炮8倍"]},//7
            {title:"鬼牌",type:1,content:["无鬼","有鬼"]},//8
            {title:"翻醒",type:1,content:["跟醒","翻醒"]},//9
            {title:" ",type:2,content:["重醒","上醒","中醒","下醒"]},//10
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//11
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//12
            {title:"加倍",type:1,content:["不加倍","加倍"]},//13
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//14
            {title:"加分",type:2,content:["低于"]},//15
        ];

        this.defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1,3],[0],[1],[0],[0],[]];
        this.glzpDScore = parseInt(cc.sys.localStorage.getItem("GLZP_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("GLZP_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("GLZP_allowBoxScore")) || 10;/** 低于xx分 **/

        if(this.createRoomLayer.clubData){
            if(ClickClubModel.getClubIsOpenLeaderPay()){
                this.ruleConfig[0].content = ["群主支付"];
                this.defaultConfig[0][0] = 0;
            }
            var params = this.createRoomLayer.clubData.wanfaList;
            if(params[1] == PHZGameTypeModel.GLZP){
                this.readSelectData(params);
            }
        }
        return true;
    },

    onShow:function(){
        this.updateZsNum();
    },

    createChangeScoreBox:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        this.addNumBox = new changeEditBox(["",10,"分"],1);
        //参数1 显示文字（分三段，第二个参数必须是值）参数2 点击按钮每次改变值 （参数3 最小值默认1，参数4 最大值默认100）
        this.addNumBox.setWidgetPosition(540,0);//设置位置
        this.addNumBox.setScoreLabel(this.addScore);//设置初始值
        this.layoutArr[row].addChild(this.addNumBox);

        this.addLabel = UICtor.cLabel("加",24,null,cc.color(126,49,2));
        this.addLabel.setAnchorPoint(0.5,0.5);
        this.addLabel.setPosition(490,0);
        this.layoutArr[row].addChild(this.addLabel);

        this.allowNumBox = new changeEditBox(["",10,"分"],1);
        this.allowNumBox.setWidgetPosition(240,0);
        this.allowNumBox.setScoreLabel(this.allowScore);
        this.layoutArr[row].addChild(this.allowNumBox);
    },

    //row 第几列
    createNumBox:function (row) {
        if (!this.layoutArr[row]){
            return null
        }

        var BoxBg = new cc.Sprite("#"+this.textureNumBox[0]);
        this.layoutArr[row].addChild(BoxBg, 2);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 180 + (720/(this.layoutArr[row].itemArr.length));
        //加;
        var addBtn = new ccui.Button();
        addBtn.loadTextureNormal(this.textureNumBox[1], ccui.Widget.PLIST_TEXTURE);
        addBtn.setAnchorPoint(0.5,0.5);
        addBtn.setPosition(BoxBg.width,BoxBg.height/2);
        addBtn.temp = 2;
        BoxBg.addChild(addBtn,1);
        //减;
        var reduceBtn = new ccui.Button();
        reduceBtn.loadTextureNormal(this.textureNumBox[2], ccui.Widget.PLIST_TEXTURE);
        reduceBtn.setAnchorPoint(0.5,0.5);
        reduceBtn.setPosition(0,BoxBg.height/2);
        reduceBtn.temp = 1;
        BoxBg.addChild(reduceBtn,1);

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.glzpDScore+"分",24,null,cc.color(126,49,2));
        scoreLabel.setAnchorPoint(0.5,0.5);
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },
    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.glzpDScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.glzpDScore = num;
        }
        this.scoreLabel.setString("小于"+ this.glzpDScore + "分");
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        if(this.getItemByIdx(2,0).isSelected()){
            this.layoutArr[13].setVisible(true);
            if(this.getItemByIdx(13,0).isSelected()){
                this.layoutArr[14].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[14].setVisible(true);
                this.numBox.setVisible(true);
            }
            this.layoutArr[3].setVisible(true);
            this.layoutArr[15].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(15,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        }else{
            this.layoutArr[3].setVisible(false);
            this.layoutArr[13].setVisible(false);
            this.layoutArr[14].setVisible(false);
            this.layoutArr[15].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }
        if(this.getItemByIdx(11,0).isSelected()){
            this.layoutArr[12].setVisible(false);
        }else{
            this.layoutArr[12].setVisible(true);
        }
    },

    updateZsNum:function(){
        var zsNum = 4;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = 0;
        }else{
            if(this.getItemByIdx(0,0).isSelected()){
                zsNum = 0;
            }else{
                zsNum = 0;
            }
        }
        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        var jushu = 5;
        var jushuArr = [5,10,20,30];
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 2 + i;
                break;
            }
        }

        var choupai = 0;
        if(renshu == 2){
            if(this.getItemByIdx(3,1).isSelected()){
                choupai = 10;
            }else if(this.getItemByIdx(3,2).isSelected()){
                choupai = 20;
            }
        }

        var qihu = 10;
        if(this.getItemByIdx(4,1).isSelected()){
            qihu = 15;
        }

        var suanzi = 5;//算子
        if(this.getItemByIdx(5,1).isSelected()){
            suanzi = 3;
        }

        var zimo = 2;//自摸
        if(this.getItemByIdx(6,1).isSelected()){
            zimo = 4;
        }else if(this.getItemByIdx(6,2).isSelected()){
            zimo = 1;
        }

        var fangpao = 2;//放炮
        if(this.getItemByIdx(7,1).isSelected()){
            fangpao = 4;
        }else if(this.getItemByIdx(7,2).isSelected()){
            fangpao = 8;
        }

        var guipai = this.getItemByIdx(8,1).isSelected() ? 1 : 0;//鬼牌

        var fanxing = 1;//跟醒
        if(this.getItemByIdx(9,1).isSelected()){
            fanxing = 2;
        }

        var chongxing = this.getItemByIdx(10,0).isSelected() ? 1 : 0;
        var shangxing = this.getItemByIdx(10,1).isSelected() ? 1 : 0;
        var zhongxing = this.getItemByIdx(10,2).isSelected() ? 1 : 0;
        var xiaxing = this.getItemByIdx(10,3).isSelected() ? 1 : 0;

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(11,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(11,4).isSelected()){
            autoPlay = 300;
        }

        var djtg = 2;
        if (this.getItemByIdx(12,0).isSelected()){
            djtg = 1;
        }else if (this.getItemByIdx(12,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(13,1).isSelected())isDouble = 1;

        var dScore = this.glzpDScore;
        cc.sys.localStorage.setItem("GLZP_diScore",dScore);

        var doubleNum = 0;
        if(this.getItemByIdx(2,0).isSelected()){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(14,i).isSelected()){
                    doubleNum = 2 + i;
                }
            }
        }

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(15,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("GLZP_addBoxScore",morefen);
        cc.sys.localStorage.setItem("GLZP_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            PHZGameTypeModel.GLZP,//玩法ID 1
            0,0,0,0,0,//*****无用占位
            renshu,//人数 7
            200,
            costWay,//支付方式 9
            fanxing,// 10 跟醒/翻醒 1 2
            0,// 11 *****无用占位
            fangpao,//放炮 2 4 倍 12
            0,// 13 *****无用占位
            0,// 14 *****无用占位
            0,// 15 *****无用占位
            0,// 16 *****无用占位
            0,// 17 *****无用占位
            0,// 18 *****无用占位
            zimo,// 19 自摸2|4倍
            0,// 20 *****无用占位
            0,// 21 *****无用占位
            0,// 22 *****无用占位
            choupai,// 23 抽牌
            0,// 24 *****无用占位
            0,// 25 *****无用占位
            guipai,// 26 鬼牌
            autoPlay,// 托管 27
            djtg,// 1 单局托管 2整局托管 28
            isDouble,//加倍  29
            dScore,//低于多少分加倍 30
            doubleNum,//加倍倍数 31
            0,// 32 *****无用占位
            morefen,//加xx分 33
            0,// 34 *****无用占位
            allowScore, //低于xx分  35
            0,// 36 *****无用占位
            chongxing,//37  重醒
            shangxing,//38  上醒
            zhongxing,//39  中醒
            xiaxing,  //40  下醒
            qihu,     //41  起胡
            suanzi,   //42  算子
        ];

        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 5;
        var jushuArr = [5,10,20,30];
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 2 + i;
                break;
            }
        }
        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        return [PHZGameTypeModel.GLZP,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);

        var defaultConfig = [[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1,3],[0],[1],[0],[0],[]];

        var inning = [5,10,20,30];
        var index = inning.indexOf(parseInt(params[0]));
        defaultConfig[0][0] = params[9] == 3?0:parseInt(params[9]) - 1;//房费
        defaultConfig[1][0] = index !== -1 ? index : 0;//局数
        defaultConfig[2][0] = params[7] == 2 ? 0 : (params[7] == 3 ? 1 : 2);//人数
        defaultConfig[3][0] = params[23] == 10 ? 1 : (params[23] == 20 ? 2 : 0);//抽牌
        defaultConfig[4][0] = params[41] == 10 ? 0 : 1;//起胡 10 | 15
        defaultConfig[5][0] = params[42] == 5 ? 0 : 1; // 5胡1字|3胡1子
        defaultConfig[6][0] = params[19] == 2 ? 0 : params[19] == 4 ? 1 : 2;//自摸 2 | 4 倍 | 加1
        defaultConfig[7][0] = params[12] == 2 ? 0 :  params[12] == 4 ? 1 : 2;//放炮 2 | 4 倍 | 8倍
        defaultConfig[8][0] = params[26] == 0 ? 0 : 1;//鬼牌
        defaultConfig[9][0] = params[10] == 1 ? 0 : 1;//跟醒 | 翻醒
        defaultConfig[11][0] = params[27] == 300?4:params[27]/60;//托管时间
        defaultConfig[12][0] = params[28]== 1 ? 0:params[28]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[13][0] = params[29]== 1 ? 1:0;//是否翻倍
        defaultConfig[14][0] = parseInt(params[31]) - 2 >= 0 ? parseInt(params[31]) - 2 : 0;//翻倍数
        if(params[33] && parseInt(params[33]) > 0){
            defaultConfig[15].push(0);
        }
        this.addScore = parseInt(params[33])||10;
        this.allowScore = parseInt(params[35])||10;
        this.glzpDScore = params[30]?parseInt(params[30]):10;//多少分翻倍

        if(params[37] == "1")defaultConfig[10].push(0);//重醒
        if(params[38] == "1")defaultConfig[10].push(1);//上醒
        if(params[39] == "1")defaultConfig[10].push(2);//中醒
        if(params[40] == "1")defaultConfig[10].push(3);//下醒

        this.defaultConfig = defaultConfig;
    },
});