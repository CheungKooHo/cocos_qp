/**
 * Created by zhoufan on 2016/11/22.
 */
var MJWanfaEdit = BasePopup.extend({

    ctor:function(){
        this._super("res/wfbjCreateRoom.json");
    },

    selfRender:function(){
        var defaultWanfaLists = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        var wanfaLists = null;
        if(cc.sys.localStorage.getItem("sy_mj_wanfaLists")) {
            wanfaLists = cc.sys.localStorage.getItem("sy_mj_wanfaLists").split(",");
            for (var i = 0; i < wanfaLists.length; i++) {
                wanfaLists[i] = parseInt(wanfaLists[i]);
            }
        }
        if(wanfaLists && wanfaLists.length > defaultWanfaLists.length){
            this.wanfaLists = defaultWanfaLists;
        }else {
            this.wanfaLists = wanfaLists || defaultWanfaLists;
        }
        for(var i=1;i<=15;i++){
            this["Image_wf_"+i] = this.getWidget("Image_wf_"+i);
            this["btn_add_"+i] = this.getWidget("btn_add_"+i);
            this["Image_di_"+i] = this.getWidget("Image_di_"+i);
        }
        var widgets = {"btn_del_1":1,"btn_del_2":2,"btn_del_3":3,"btn_del_4":4,"btn_del_5":5,"btn_del_6":6,"btn_del_7":7,"btn_del_8":8,"btn_del_9":9,"btn_del_10":10,"btn_del_11":11,"btn_del_12":12,"btn_del_13":13,"btn_del_14":14,"btn_del_15":15};
        this.addClickEvent(widgets,this.onDelWanfaClick);
        var widgets_1 = {"btn_wf_add_1":1,"btn_wf_add_2":2,"btn_wf_add_3":3,"btn_wf_add_4":4,"btn_wf_add_5":5,"btn_wf_add_6":6,"btn_wf_add_7":7,"btn_wf_add_8":8,"btn_wf_add_9":9,"btn_wf_add_10":10,"btn_wf_add_11":11,"btn_wf_add_12":12,"btn_wf_add_13":13,"btn_wf_add_14":14,"btn_wf_add_15":15,
            "btn_add_1":1,"btn_add_2":2,"btn_add_3":3,"btn_add_4":4,"btn_add_5":5,"btn_add_6":6,"btn_add_7":7,"btn_add_8":8,"btn_add_9":9,"btn_add_10":10,"btn_add_11":11,"btn_add_12":12,"btn_add_13":13,"btn_add_14":14,"btn_add_15":15};
        this.addClickEvent(widgets_1,this.onAddWanfaClick);
        this.ListView_132 = this.getWidget("ListView_132");
        this.ListView_132.removeAllItems();
        var sortList = this.wanfaLists;
        for(var j=0;j<sortList.length;j++){
            var i = sortList[j];
            var btn = this["Image_wf_"+i];
            btn.temp = i;
            this.ListView_132.pushBackCustomItem(btn);
        }
        this.refreshWanfaBtn();
        this.Button_bcbj = this.getWidget("Button_bcbj");
        UITools.addClickEvent(this.Button_bcbj,this,this.onBaoCunWfBj);
        var closeBtn = this.getWidget("close_btn");
        UITools.addClickEvent(closeBtn,this,this.onClose);

    },

    onClose:function(){
        this.removeFromParent(true);
    },

    onAddWanfaClick:function(obj){
        var temp = obj.temp;
        var url = "";
        switch (temp) {
            case 1:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_baijiaog.png";
                break;
            case 2:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_lanzhoug.png";
                break;
            case 3:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_huipaig.png";
                break;
            case 4:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_zhangyeg.png";
                break;
            case 5:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_gucangg.png";
                break;
            case 6:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_guangguangg.png";
                break;
            case 7:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_huashuig.png";
                break;
            case 8:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_qinang.png";
                break;
            case 9:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_pingliangg.png";
                break;
            case 10:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_tianshuig.png";
                break;
            case 11:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_longxig.png";
                break;
            case 12:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_wuweig.png";
                break;
            case 13:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_jiuquang.png";
                break;
            case 14:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_lzebg.png";
                break;
            case 15:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_lzfjg.png";
                break;
        }
        var Image = this["Image_wf_"+temp] = UICtor.cImg(url);
        var btn = this["btn_del_"+temp] = UICtor.cBtn("res/ui/gansu_mj/mjCreateRoom/btn_del.png");
        btn.setPosition(Image.width-btn.width,Image.height-btn.height/2);
        btn.temp = temp;
        Image.temp = temp;
        Image.addChild(btn);
        UITools.addClickEvent(btn,this,this.onDelWanfaClick);
        this.ListView_132.pushBackCustomItem(Image);
        this.wanfaLists.push(temp);
        this.refreshWanfaBtn();
    },

    onBaoCunWfBj:function(){
        this.removeFromParent(true);
        cc.sys.localStorage.setItem("sy_mj_wanfaLists",this.wanfaLists);
        cc.sys.localStorage.setItem("sy_mj_wanfaTag",-1);
        SyEventManager.dispatchEvent(SyEvent.CREATEROOM_TAG,-1);
        SyEventManager.dispatchEvent(SyEvent.CREATEROOM_WANFALIST,this.wanfaLists);
    },

    onDelWanfaClick:function(obj){
        var temp = obj.temp;
        if(this.wanfaLists.length > 1) {
            var allItems = this.ListView_132.getItems();
            for (var i = 0; i < allItems.length; i++) {
                if (allItems[i].temp == temp) {
                    this.ListView_132.removeItem(i);
                    break;
                }
            }
            for (var i = 0; i < this.wanfaLists.length; i++) {
                if (this.wanfaLists[i] == temp) {
                    this.wanfaLists.splice(i, 1);
                    break;
                }
            }
            this.refreshWanfaBtn();
        }
    },


    refreshWanfaBtn:function(){
        var list = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        for(var i=0;i<list.length;i++){
            var index = list[i];
            if(ArrayUtil.indexOf(this.wanfaLists,index) < 0){
                this["btn_add_"+index].visible = true;
                this["Image_di_"+index].visible = true;
            }else {
                this["btn_add_"+index].visible = false;
                this["Image_di_"+index].visible = false;
            }
            this["btn_wf_add_"+index].setTouchEnabled(this["btn_add_"+index].visible);
        }
    },


    addClickEvent:function(widgets,selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector,true);
        }
    },



});


var MJJLBWanfaEdit = BasePopup.extend({

    ctor:function(){
        this._super("res/wfbjJLBCreateRoom.json");
    },

    selfRender:function(){
        var defaultWanfaLists = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        var wanfaLists = null;
        if(cc.sys.localStorage.getItem("sy_jlbmj_wanfaLists")) {
            wanfaLists = cc.sys.localStorage.getItem("sy_jlbmj_wanfaLists").split(",");
            for (var i = 0; i < wanfaLists.length; i++) {
                wanfaLists[i] = parseInt(wanfaLists[i]);
            }
        }
        if(wanfaLists && wanfaLists.length > defaultWanfaLists.length){
            this.wanfaLists = defaultWanfaLists;
        }else {
            this.wanfaLists = wanfaLists || defaultWanfaLists;
        }
        for(var i=1;i<=13;i++){
            this["Image_wf_"+i] = this.getWidget("Image_wf_"+i);
            this["btn_add_"+i] = this.getWidget("btn_add_"+i);
            this["Image_di_"+i] = this.getWidget("Image_di_"+i);
        }
        var widgets = {"btn_del_1":1,"btn_del_2":2,"btn_del_3":3,"btn_del_4":4,"btn_del_5":5,"btn_del_6":6,"btn_del_7":7,"btn_del_8":8,"btn_del_9":9,"btn_del_10":10,"btn_del_11":11,"btn_del_12":12,"btn_del_13":13};
        this.addClickEvent(widgets,this.onDelWanfaClick);
        var widgets_1 = {"btn_wf_add_1":1,"btn_wf_add_2":2,"btn_wf_add_3":3,"btn_wf_add_4":4,"btn_wf_add_5":5,"btn_wf_add_6":6,"btn_wf_add_7":7,"btn_wf_add_8":8,"btn_wf_add_9":9,"btn_wf_add_10":10,"btn_wf_add_11":11,"btn_wf_add_12":12,"btn_wf_add_13":13,
            "btn_add_1":1,"btn_add_2":2,"btn_add_3":3,"btn_add_4":4,"btn_add_5":5,"btn_add_6":6,"btn_add_7":7,"btn_add_8":8,"btn_add_9":9,"btn_add_10":10,"btn_add_11":11,"btn_add_12":12,"btn_add_13":13};
        this.addClickEvent(widgets_1,this.onAddWanfaClick);
        this.ListView_132 = this.getWidget("ListView_132");
        this.ListView_132.removeAllItems();
        var sortList = this.wanfaLists;
        for(var j=0;j<sortList.length;j++){
            var i = sortList[j];
            var btn = this["Image_wf_"+i];
            btn.temp = i;
            this.ListView_132.pushBackCustomItem(btn);
        }
        this.refreshWanfaBtn();
        this.Button_bcbj = this.getWidget("Button_bcbj");
        UITools.addClickEvent(this.Button_bcbj,this,this.onBaoCunWfBj);
        var closeBtn = this.getWidget("close_btn");
        UITools.addClickEvent(closeBtn,this,this.onClose);

    },

    onClose:function(){
        this.removeFromParent(true);
    },

    onAddWanfaClick:function(obj){
        var temp = obj.temp;
        var url = "";
        switch (temp) {
            case 1:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_baijiaog.png";
                break;
            case 2:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_lanzhoug.png";
                break;
            case 3:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_huipaig.png";
                break;
            case 4:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_zhangyeg.png";
                break;
            case 5:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_gucangg.png";
                break;
            case 6:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_guangguangg.png";
                break;
            case 7:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_huashuig.png";
                break;
            case 8:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_qinang.png";
                break;
            case 9:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_pingliangg.png";
                break;
            case 10:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_longxig.png";
                break;
            case 11:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_jiuquang.png";
                break;
            case 12:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_lzebg.png";
                break;
            case 13:
                url = "res/ui/gansu_mj/mjCreateRoom/btn_lzfjg.png";
                break;
        }
        var Image = this["Image_wf_"+temp] = UICtor.cImg(url);
        var btn = this["btn_del_"+temp] = UICtor.cBtn("res/ui/gansu_mj/mjCreateRoom/btn_del.png");
        btn.setPosition(Image.width-btn.width,Image.height-btn.height/2);
        btn.temp = temp;
        Image.temp = temp;
        Image.addChild(btn);
        UITools.addClickEvent(btn,this,this.onDelWanfaClick);
        this.ListView_132.pushBackCustomItem(Image);
        this.wanfaLists.push(temp);
        this.refreshWanfaBtn();
    },

    onBaoCunWfBj:function(){
        this.removeFromParent(true);
        cc.sys.localStorage.setItem("sy_jlbmj_wanfaTag",-1);
        SyEventManager.dispatchEvent(SyEvent.CREATEROOM_TAG_JLB,-1);
        cc.sys.localStorage.setItem("sy_jlbmj_wanfaLists",this.wanfaLists);
        SyEventManager.dispatchEvent(SyEvent.CREATEROOM_WANFALIST_JLB,this.wanfaLists);
    },

    onDelWanfaClick:function(obj){
        var temp = obj.temp;
        if(this.wanfaLists.length > 1) {
            var allItems = this.ListView_132.getItems();
            for (var i = 0; i < allItems.length; i++) {
                if (allItems[i].temp == temp) {
                    this.ListView_132.removeItem(i);
                    break;
                }
            }
            for (var i = 0; i < this.wanfaLists.length; i++) {
                if (this.wanfaLists[i] == temp) {
                    this.wanfaLists.splice(i, 1);
                    break;
                }
            }
            this.refreshWanfaBtn();
        }
    },


    refreshWanfaBtn:function(){
        var list = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        for(var i=0;i<list.length;i++){
            var index = list[i];
            if(ArrayUtil.indexOf(this.wanfaLists,index) < 0){
                this["btn_add_"+index].visible = true;
                this["Image_di_"+index].visible = true;
            }else {
                this["btn_add_"+index].visible = false;
                this["Image_di_"+index].visible = false;
            }
            this["btn_wf_add_"+index].setTouchEnabled(this["btn_add_"+index].visible);
        }
    },


    addClickEvent:function(widgets,selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector,true);
        }
    },



});

