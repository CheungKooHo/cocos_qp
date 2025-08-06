/**
 * Created by Administrator on 2019/10/9.
 */
var RuleSelect_HSPHZ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        cc.log("RuleSelect_HSPHZ::::::::::::::::::::::::::::::::::::::::", "汉寿跑胡子!!!");
        this.createNumBox(9);
        this.createChangeScoreBox(11);//创建低于xx分加xx分
        this.getItemByIdx(11,0).itemBtn.setContentSize(80,40);
        this.createMultipleBox(3)
        this.createDaoBox(4)
        this.updateItemShow();
        SyEventManager.addEventListener(SyEvent.UPDATA_CREDIT_NUM,this,this.updateMutipleNum);
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"房费",type:1,content:["AA支付","房主支付"]},//0
            {title:"局数",type:1,content:["8局","16局"]},//1
            {title:"人数",type:1,content:["2人"]},//2
            {title:"倍数",type:1,content:[]},//3
            {title:"玩法",type:2,content:[]},//4
            {title:"",type:1,content:["无封顶","单局封顶20分"]},//5
            {title:"底牌",type:1,content:["19张","24张","39张"]},//6
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//7
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"]},//8
            {title:"加倍",type:1,content:["不加倍","加倍"]},//9
            {title:"倍数",type:1,content:["翻2倍","翻3倍","翻4倍"]},//10
            {title:"加分",type:2,content:["低于"]},//11
        ];

        this.defaultConfig = [[1],[0],[0],[],[],[0],[0],[0],[1],[0],[0],[]];
        this.hsphzDScore = parseInt(cc.sys.localStorage.getItem("HSPHZ_diScore")) || 10;
        this.addScore = parseInt(cc.sys.localStorage.getItem("HSPHZ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("HSPHZ_allowBoxScore")) || 10;/** 低于xx分 **/
        this.daoNum = parseInt(cc.sys.localStorage.getItem("HSPHZ_daoBoxScore")) || 1;/** 倒 **/
        this.mutipleNum = parseInt(cc.sys.localStorage.getItem("HSPHZ_mutipleBoxScore")) || 1;/** 倍数 **/

        if(this.createRoomLayer.clubData){
            if(ClickClubModel.getClubIsOpenLeaderPay()){
                this.ruleConfig[0].content = ["群主支付"];
                this.defaultConfig[0][0] = 0;
            }
            var params = this.createRoomLayer.clubData.wanfaList;
            if(params[1] == PHZGameTypeModel.HSPHZ){
                this.readSelectData(params);
            }
        }
        return true;
    },

    createTipLabel:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        var str = "注：两人模式，不管多少胡息起胡，都是从"+ '\n' +"9胡息开始算分";
        var scoreLabel = this.showLabel = UICtor.cLabel(str,22,null,cc.color(189,32,26));
        scoreLabel.setAnchorPoint(0,0.5);
        scoreLabel.x = (20 + 788/(this.layoutArr[row].itemArr.length));
        this.layoutArr[row].addChild(scoreLabel,0);
    },

    createMultipleBox:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        this.multipleBox = new changeEditBox(["",10,""],1,1,500);
        //参数1 显示文字（分三段，第二个参数必须是值）参数2 点击按钮每次改变值 （参数3 最小值默认1，参数4 最大值默认100）
        this.multipleBox.setWidgetPosition(100,0);//设置位置
        this.multipleBox.setScoreLabel(this.mutipleNum);//设置初始值
        this.layoutArr[row].addChild(this.multipleBox);

        var multipleBtn = new ccui.Button();
        multipleBtn.loadTextureNormal("popup_create_btn_shoudongshuru.png", ccui.Widget.PLIST_TEXTURE);
        multipleBtn.setPosition(380,0);
        this.layoutArr[row].addChild(multipleBtn);
        UITools.addClickEvent(multipleBtn,this,this.onMultipleClick);
    },

    onMultipleClick:function(){
        var mc = new ClubCreditInputPop(8);
        PopupManager.addPopup(mc);
    },

    updateMutipleNum:function(event){
        var data = event.getUserData();
        var num = Number(data.num);
        if(num > 500){
            this.mutipleNum = 500
        }else if(num < 1){
            this.mutipleNum = 1
        }else{
            this.mutipleNum = num;
        }
        this.multipleBox.setScoreLabel(this.mutipleNum);
    },

    createDaoBox:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        this.daoBox = new changeEditBox(["倒",10,""],1,1,10);
        //参数1 显示文字（分三段，第二个参数必须是值）参数2 点击按钮每次改变值 （参数3 最小值默认1，参数4 最大值默认100）
        this.daoBox.setWidgetPosition(100,0);//设置位置
        this.daoBox.setScoreLabel(this.daoNum);//设置初始值
        this.layoutArr[row].addChild(this.daoBox);

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

    onShow:function(){
        this.updateZsNum();
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

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.hsphzDScore+"分",24,null,cc.color(126,49,2));
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
        var num = this.hsphzDScore;

        if (temp == 1){
            num = num - 5;
        }else{
            num = num + 5;
        }

        if (num && num >= 5 && num <= 100){
            this.hsphzDScore = num;
        }
        this.scoreLabel.setString("小于"+ this.hsphzDScore + "分");
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        //if(this.getItemByIdx(2,1).isSelected()){
            this.layoutArr[9].setVisible(true);
            if(this.getItemByIdx(9,0).isSelected()){
                this.layoutArr[10].setVisible(false);
                this.numBox.setVisible(false);
            }else{
                this.layoutArr[10].setVisible(true);
                this.numBox.setVisible(true);
            }
            this.layoutArr[11].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(11,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
        //}else{
        //    this.layoutArr[10].setVisible(false);
        //    this.layoutArr[11].setVisible(false);
        //    this.layoutArr[12].setVisible(false);
        //    this.addNumBox.itemBox.visible = false;
        //    this.allowNumBox.itemBox.visible = false;
        //}
        if(this.getItemByIdx(7,0).isSelected()){
            this.layoutArr[8].setVisible(false);
        }else{
            this.layoutArr[8].setVisible(true);
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
        var jushu = 8;
        var jushuArr = [8,16];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 2;
        //for(var i = 0;i<2;++i){
        //    if(this.getItemByIdx(2,i).isSelected()){
        //        renshu = 3-i;
        //        break;
        //    }
        //}

        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        var dipai = 0;//底牌
        var choupaiArr = [19,24,39];
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                dipai = choupaiArr[i];
                break;
            }
        }

        //var qihu = this.getItemByIdx(4,0).isSelected() ? 9 : 15;

        //var hdh = this.getItemByIdx(5,0).isSelected() ? 1 : 0;//海底胡
        //var slx = this.getItemByIdx(5,1).isSelected() ? 1 : 0;//十六小
        //var sbd = this.getItemByIdx(5,2).isSelected() ? 1 : 0;//十八大
        //var jjj = this.getItemByIdx(5,3).isSelected() ? 1 : 0;//加红加小加大
        //var yhbh = this.getItemByIdx(5,4).isSelected() ? 1 : 0;//有胡必胡


        //var zimo = 0;
        //var zimiArr = [0,1,2,-1];
        //for(var i = 0;i<4;++i){
        //    if(this.getItemByIdx(6,i).isSelected()){
        //        zimo = zimiArr[i];
        //        break;
        //    }
        //}

        //var zhaniao = 0;
        //var niaoshu = [0,2,3,4];
        //for(var i = 0;i<4;++i){
        //    if(this.getItemByIdx(7,i).isSelected()){
        //        zhaniao = niaoshu[i];
        //        break;
        //    }
        //}

        //var zhuang = 0;//坐庄
        //if(this.getItemByIdx(8,1).isSelected()){
        //    zhuang = 1;
        //}

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(7,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }
        if(this.getItemByIdx(7,4).isSelected()){
            autoPlay = 300;
        }

        var djtg = 2;
        if (this.getItemByIdx(8,0).isSelected()){
            djtg = 1;
        }else if (this.getItemByIdx(8,2).isSelected()){
            djtg = 3;
        }

        var isDouble = 0;
        if(this.getItemByIdx(9,1).isSelected())isDouble = 1;

        var dScore = this.hsphzDScore;
        cc.sys.localStorage.setItem("HSPHZ_diScore",dScore);

        var doubleNum = 0;
        //if(this.getItemByIdx(2,1).isSelected()){
            for(var i = 0;i<3;++i){
                if(this.getItemByIdx(10,i).isSelected()){
                    doubleNum = 2 + i;
                }
            }
        //}

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(11,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("HSPHZ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("HSPHZ_allowBoxScore",allowScore);

        var beishu = this.multipleBox.localScore || 0;
        var daofen = this.daoBox.localScore || 0;
        cc.sys.localStorage.setItem("HSPHZ_mutipleBoxScore",beishu);
        cc.sys.localStorage.setItem("HSPHZ_daoBoxScore",daofen);

        var fengding = 0;
        if(this.getItemByIdx(5,1).isSelected()) {//如果勾选
            fengding = 1;
        }

        data.params = [
            jushu,//局数 0
            PHZGameTypeModel.HSPHZ,//玩法ID 1
            0,// 2 *****无用占位
            0,// 3 *****无用占位
            0,// 4 *****无用占位
            0,// 5 *****无用占位
            0,// 6 *****无用占位
            renshu,//人数 7
            0,// 8 *****无用占位
            costWay,//支付方式 9
            0,// 10 *****无用占位
            0,// 12 *****无用占位
            0,// 12 *****无用占位
            0,// 13 *****无用占位
            dipai,//底牌 14
            0,// 15 *****无用占位
            0,//16 *****无用占位
            0,// 17 *****无用占位
            0,// 18 *****无用占位
            0,// 19 *****无用占位
            0,// 20 *****无用占位
            0,// 21 *****无用占位
            0,// 22 *****无用占位
            autoPlay,//托管时间 23
            isDouble,//是否翻倍 24
            dScore,//翻倍上限 25
            doubleNum,//翻倍倍数 26
            djtg,//单局托管 27
            0,// 28 无用占位
            0,// 29  *****无用占位
            0,// 30 *****无用占位
            0,// 31  自摸加分 0：不加，1：+1，2：+2，-1：翻倍
            0,// 32  海底胡
            0,// 33  有胡必胡
            0,// 34  扎鸟 2，3，4
            0,// 35  *****无用占位
            0,// 36  *****无用占位
            0,// 37  16小  0 | 1
            0,// 38  加红加小加大
            0,// 39  18大  0 | 1
            0,// 40  *****无用占位
            0,// 41  *****无用占位
            0,// 42  *****无用占位
            0,// 43  *****无用占位
            0,// 44  *****无用占位
            0,// 45  *****无用占位
            allowScore, //46 低于xx分
            morefen,//47 加xx分
            beishu,//48 倍数
            daofen,//49 倒分
            fengding,//50 封顶
        ];
        cc.log("getWanfas",JSON.stringify(data))

        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 8;
        var jushuArr = [8,16];
        for(var i = 0;i<jushuArr.length;++i){
            if(this.getItemByIdx(1,i).isSelected()){
                jushu = jushuArr[i];
                break;
            }
        }

        var renshu = 2;
        //for(var i = 0;i<2;++i){
        //    if(this.getItemByIdx(2,i).isSelected()){
        //        renshu = 3-i;
        //        break;
        //    }
        //}
        var costWay = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costWay = 3;
        }else{
            if(this.getItemByIdx(0,1).isSelected())costWay = 2;
        }

        return [PHZGameTypeModel.HSPHZ,costWay,jushu,renshu];

    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        cc.log("===========readSelectData============" + params);

        var defaultConfig = [[1],[0],[0],[],[],[0],[0],[0],[0],[1],[0],[0],[]];

        defaultConfig[0][0] = params[9] == 3?0:parseInt(params[9]) - 1;//房费
        defaultConfig[1][0] = params[0] == 8 ? 0 : 1;//局数
        defaultConfig[2][0] = 0;//人数
        //defaultConfig[3][0] = params[14] == 0 ? 0:(params[14] == 10 ? 1 : 2);//抽牌
        //defaultConfig[4][0] = params[30] == 9? 0:1;//单局最低胡息起胡 9/15

        //if(params[32] == "1")defaultConfig[5].push(0);//海底胡
        //if(params[37] == "1")defaultConfig[5].push(1);//十六小
        //if(params[39] == "1")defaultConfig[5].push(2);//十八大
        //if(params[38] == "1")defaultConfig[5].push(3);//加红加小加大
        //if(params[33] == "1")defaultConfig[5].push(4);//有胡必胡

        //var ziMoArr = [0,1,2,-1];
        //defaultConfig[6][0] = ziMoArr.indexOf(parseInt(params[31]));//自摸
        //defaultConfig[7][0] = params[34] == 0 ? 0 : (parseInt(params[34]) - 1);//扎鸟
        //defaultConfig[8][0] = params[15] == 0 ? 0 : 1;//随机坐庄|先进房当庄

        defaultConfig[5][0] = params[50]== 1 ? 1:0;//封顶
        defaultConfig[6][0] = params[14]== 19 ? 0:params[14]== 24 ? 1 : 2;//底牌

        defaultConfig[7][0] = params[23] == 300?4:params[23]/60;//托管时间
        defaultConfig[8][0] = params[27]== 1 ? 0:params[27]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[9][0] = params[24]== 1 ? 1:0;//是否翻倍
        defaultConfig[10][0] = parseInt(params[26]) - 2 >= 0 ? parseInt(params[26]) - 2 : 0;//翻倍数
        if(params[46] && params[46] != 0 && params[47] && params[47] != 0){
            defaultConfig[11].push(0);
        }
        this.hsphzDScore = params[25]?parseInt(params[25]):10;//多少分翻倍

        this.allowScore = parseInt(params[46])||10;
        this.addScore = parseInt(params[47])||10;
        this.mutipleNum = parseInt(params[48])||10;
        this.daoNum = parseInt(params[49])||10;


        this.defaultConfig = defaultConfig;
    },
});