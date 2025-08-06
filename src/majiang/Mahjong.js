/**
 * Created by zhoufan on 2016/7/22.
 */
var Mahjong = ccui.Widget.extend({
    /** @lends Card.prototype */
    _cardVo:null,
    _displayVo:null,
    _bg:null,
    _bgPng:null,
    /**
     * @construct
     * @param displayVo {MJDisplayVo}
     * @param cardVo {MJVo}
     */
    ctor:function(displayVo,cardVo){
        this._super();
        this.touchLayer=null;
        this.selected = false;
        this.mjTouchMoved = false;
        this.isTing = false;
        this.refresh(displayVo,cardVo);
    },

    /**
     * 出牌
     */
    pushOut:function(){
        this.removeFromParent(true);
    },

    getSprite:function(texture){
        var frame = cc.spriteFrameCache.getSpriteFrame(texture);
        if(!frame){
            cc.log("Mahjong texture::"+texture+" is not exist!!!");
            texture = "mjbg_d3p2_an_1.png";
            FloatLabelUtil.comText("Mahjong texture::"+texture+" is not exist!!!");
        }
        return new cc.Sprite("#"+texture);
    },

    /**
     * @param displayVo {MJDisplayVo}
     * @param cardVo {MJVo}
     */
    refresh:function(displayVo,cardVo){
        if(this._displayVo){
            if(displayVo.direct==this._displayVo.direct&&displayVo.place==this._displayVo.place){
                if(this._cardVo && this._cardVo.hasOwnProperty("c")){
                    if(cardVo&&cardVo.hasOwnProperty("c") && cardVo.c==this._cardVo.c){
                        var localDan = cardVo.dan || 0;
                        var curDan = this._cardVo.dan || 0;
                        if(localDan==curDan)
                            return;
                    }
                }
            }
        }
        this._displayVo = displayVo;
        this._cardVo = cardVo;
        this.diplay();
    },

    onEnter:function(){
        this._super();
        if(this._cardVo.hasOwnProperty("m"))
            delete this._cardVo.m;
    },

    initCoord:function(){
        if(this._displayVo.direct==1&&this._displayVo.place==1) {
            this.initX = this.x;
            this.initY = this.y;
        }
    },

    unselected:function(){
        if (MJRoomModel.isTingSelecting || (MJRoomModel.selfAct.length>0 && MJRoomModel.selfAct[7]==1)) {
            return;
        }
        this.x = this.initX;
        this.y = this.initY;
        this.selected = false;
        SyEventManager.dispatchEvent(SyEvent.CANCEL_SHOW_DESKTTOP_CARDS);
    },

    onDisplayByTingPai: function(isTingSelected) {
        if(isTingSelected) {
            this.y = this.initY + 30;
        }
        this.isTing = isTingSelected;
    },

    cancelTingPai: function() {
        this.y = this.initY;
    },

    csGang:function(){
        if(!this.touchLayer){
            this.touchLayer = UICtor.cS9Img("res/ui/mj/img_43.png",cc.rect(10,10,5,5),cc.size(87,127));
            this.touchLayer.anchorX=this.touchLayer.anchorY=0;
            this.touchLayer.x = 1;
            this.touchLayer.y = 4;
            this.addChild(this.touchLayer);
        }
    },

    //onTouchHandlerMove:function(obj,type){
    //    if(type == ccui.Widget.TOUCH_BEGAN){
    //        this.setLocalZOrder(999);
    //        this.mjTouchMoved = false;
    //    }else if(type == ccui.Widget.TOUCH_MOVED){
    //        var touchPoint = this.getTouchMovePosition();
    //        var targetX = touchPoint.x-this.width/2;;
    //        var targetY = touchPoint.y-this.height/2;
    //        if(this.mjTouchMoved || Math.abs(targetX-this.initX)>=20 || (targetY-this.initY)>=20){
    //            this.mjTouchMoved = true;
    //            this.x = targetX;
    //            this.y = targetY;
    //        }
    //        if(this.y>this.maxY)
    //            this.maxY = this.y;
    //    }else if(type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED){
    //        if(this.selected&&Math.abs(this.x-this.initX)<45&&Math.abs(this.maxY-this.initY)<45){
    //            if(this.mjTouchMoved){
    //                this.mjTouchMoved = false;
    //                this.selected = false;
    //                this.x = this.initX;
    //                this.y = this.initY;
    //            }
    //            return;
    //        }
    //        this.mjTouchMoved = false;
    //        if(this.y>=100){//拖出去了松开，并且超过出牌线，直接出牌
    //            //MJRoomModel.sendPlayCardMsg(0,[this._cardVo.c]);
    //            this.x = this.initX;
    //            this.y = this.initY;
    //        }else{//插牌处理
    //            this.selected = false;
    //            var mahjongs = MJRoomModel.mineLayout.mahjongs1;
    //            var place1Data = MJRoomModel.mineLayout.data1;
    //            var arrivedIndex = -1;
    //            var curIndex = -1;
    //            for(var i=0;i<mahjongs.length;i++){
    //                var mj = mahjongs[i];
    //                if(mj.getData().c==this._cardVo.c){
    //                    curIndex = i;
    //                }else{
    //                    if(Math.abs(this.x-mj.x)<70 && Math.abs(this.y-mj.y)<100 && arrivedIndex<0){
    //                        if(this.initX<this.x){//从左往右拖
    //                            if(this.x>mj.x){
    //                                arrivedIndex = i;
    //                            }
    //                        }else{
    //                            if(this.x<mj.x){
    //                                arrivedIndex = i;
    //                            }
    //                        }
    //                    }
    //                }
    //            }
    //            if(arrivedIndex>=0){
    //                if(arrivedIndex>curIndex){
    //                    place1Data.splice(arrivedIndex+1,0,this._cardVo);
    //                    place1Data.splice(curIndex,1);
    //                }else{
    //                    place1Data.splice(curIndex,1);
    //                    place1Data.splice(arrivedIndex,0,this._cardVo);
    //                }
    //                MJRoomModel.mineLayout.refreshP1(place1Data);
    //            }else{
    //                this.x = this.initX;
    //                this.y = this.initY;
    //            }
    //        }
    //        this.setLocalZOrder(1);
    //    }
    //},

    changeSkin:function(){
        var png = SetUpModel.getMahjongRes(this._bgPng);
        var frame = cc.spriteFrameCache.getSpriteFrame(png);
        this._bg.setSpriteFrame(frame);
    },

    isForSelect:function(){
        return (this._cardVo.se && this._cardVo.se>0);
    },

    onChuMahjong:function(){
        MJRoomModel.chuMahjong(this._cardVo.c);
    },

    onTingMahjong: function() {
        var tingIds = [];
        if(MJRoomModel.wanfa != MJWanfaType.LZMJ){
            var tingResult = MJRoomModel.getTingWithMahjong(this._cardVo);
            tingIds = [];
            for (var i=0;i<tingResult.length;i++) {
                tingIds.push(tingResult[i].c);
            }
        }
        var tingParam = [this._cardVo.c];
        ArrayUtil.merge(tingIds, tingParam);
        MJRoomModel.sendPlayCardMsg(21,tingParam);
    },

    onTouchHandler:function(obj,type){
        if(this.isForSelect()){
            if(type == ccui.Widget.TOUCH_ENDED)
                SyEventManager.dispatchEvent(SyEvent.SELECT_MAJIANG,{action:this._cardVo.se,ids:this._cardVo.ids});
            return false;
        }
        if (MJRoomModel.isTingSelecting && !this.isTing) {//点了听之后，选牌的状态
            return false;
        }
        
        if(MJRoomModel.nextSeat!=MJRoomModel.mySeat || MJRoomModel.selfAct.length>0)
            return false;
        if(MJRoomModel.isTing() || MJRoomModel.isHued())//长沙麻将杠了不能换牌
            return false;
        var mjs = MJRoomModel.mineLayout.getMahjongs1();
        if(mjs && mjs.length%3!=2){//过滤掉多出牌的问题
            return false;
        }
        if(type == ccui.Widget.TOUCH_BEGAN){
            if(!this.selected){
                this.maxY = this.y;
                for(var i=0;i<mjs.length;i++){
                    mjs[i].unselected();
                }
                if (this.y == this.initY) {
                    this.y += 30;
                }
                this.selected = true;
                if(MJRoomModel.isTingSelecting){
                    SyEventManager.dispatchEvent(SyEvent.FIND_HU_BY_PUTOUT,this._cardVo);
                }
                SyEventManager.dispatchEvent(SyEvent.SHOW_DESKTTOP_CARDS,this._cardVo);
            }else{//第二次点击，直接出牌
                SyEventManager.dispatchEvent(SyEvent.CANCEL_SHOW_DESKTTOP_CARDS);
                if(MJRoomModel.isTingSelecting){
                    this.onTingMahjong();
                }else{
                    this.onChuMahjong();
                    //MJRoomModel.sendPlayCardMsg(0,[this._cardVo.c]);
                }
            }
            this.mjTouchMoved = false;
        }else if(type == ccui.Widget.TOUCH_MOVED){
            var touchPoint = this.getTouchMovePosition();
            var targetX = touchPoint.x-this.width/2;;
            var targetY = touchPoint.y-this.height/2;
            if(this.mjTouchMoved || Math.abs(targetX-this.initX)>=40 || (targetY-this.initY)>=40){
                this.mjTouchMoved = true;
                this.x = targetX;
                this.y = targetY;
            }
            if(this.y>this.maxY)
                this.maxY = this.y;
        }else if(type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED){
            if(this.selected&&Math.abs(this.x-this.initX)<45&&Math.abs(this.maxY-this.initY)<45){
                if(this.mjTouchMoved){
                    this.mjTouchMoved = false;
                    this.selected = false;
                    this.x = this.initX;
                    this.y = this.initY;
                }
                return;
            }
            this.mjTouchMoved = false;
            if(Math.abs(this.x-this.initX) >=45 || Math.abs(this.y-this.initY)>=45){
                if(this.y<=100){
                    this.selected = false;
                    this.x = this.initX;
                    this.y = this.initY;
                }else{//拖出去了松开，直接出牌
                    SyEventManager.dispatchEvent(SyEvent.CANCEL_SHOW_DESKTTOP_CARDS);
                    if(MJRoomModel.isTingSelecting){
                        this.onTingMahjong();
                    }else{
                        this.onChuMahjong();
                    }
                }
            }else{
                this.selected = false;
                this.x = this.initX;
                this.y = this.initY;
            }
        }
    },

    diplay:function(){
        this.removeAllChildren(true);
        this.touchLayer=null;
        //先选一个背景
        var direct = this._displayVo.direct;
        var place = this._displayVo.place;
        var an = this._cardVo.a;
        var isJs = this._cardVo.isJs;//是否是结算界面的展示
        var png = "";
        var bgPng = "";
        var hdirect = direct;
        var hplace = place;
        var bgFlippedX = false;
        var ziFlippedX = false;
        var mjScale = 1;
        if(place == 1){
            switch (direct) {
                case 1:
                case 3:
                case 4:
                    //noting to do
                    break;
                case 2:
                    hdirect = 4;
                    bgFlippedX = true;
                    break;
            }
        } else if(place == 2) {
            switch (direct) {
                case 1:
                    //noting to do
                    break;
                case 2:
                    hdirect = 4;
                    hplace = 3;
                    mjScale = 0.86;
                    ziFlippedX = true;
                    break;
                case 3:
                    hdirect = 1;
                    mjScale = 0.68;
                    break;
                case 4:
                    hplace = 3;
                    mjScale = 0.86;
                    break;
            }
        } else if(place == 3) {
            switch (direct) {
                case 1:
                    hplace = 2;
                    mjScale = 0.68;
                    break;
                case 2:
                    hdirect = 4;
                    hplace = 3;
                    //mjScale = 0.6;
                    ziFlippedX = true;
                    break;
                case 3:
                    hdirect = 1;
                    hplace = 2;
                    mjScale = 0.68;
                    break;
                case 4:
                    hplace = 3;
                    //mjScale = 0.6;
                    break;
            }
        } else if(place == 4) {
            switch (direct) {
                case 1:
                    hplace = 2;
                    mjScale = 0.5;
                    break;
                case 2:
                    hdirect = 4;
                    hplace = 3;
                    mjScale = 0.6;
                    ziFlippedX = true;
                    break;
                case 3:
                    hdirect = 1;
                    hplace = 2;
                    mjScale = 0.5;
                    break;
                case 4:
                    hplace = 3;
                    mjScale = 0.6;
                    break;
            }
        }
        if(this._cardVo.hasOwnProperty("mjScale")) {
            mjScale = this._cardVo.mjScale;
        }
        var hdp = "d"+hdirect+"p"+hplace;
        if(an===1 || (direct==3&&place==1) || (direct==4&&place==1) || (direct==2&&place==1)){
            if(an===1){
                hdp += "_an";
            }
            bgPng = "mjbg_"+hdp+".png";
        }else{
            bgPng = "mjbg_"+hdp+".png";
            png = "mj_"+hdp+"_"+this._cardVo.t+"_"+this._cardVo.n+".png";
        }
        this.anchorX=this.anchorY=0;
        //根据设置的值，获取对应的资源
        this._bgPng = bgPng;
        bgPng = SetUpModel.getMahjongRes(bgPng);
        var bg = this._bg = this.getSprite(bgPng);
        //if(direct==1&&place==1&&!isJs)
        //    bg.scale=1.16;
        if(direct==2&&place==1)
            bg.setFlippedX(true);
        bg.anchorX=bg.anchorY=0;
        bg.x = 0;
        bg.y = 0;
        this.addChild(bg);
        this.setContentSize(bg.width,bg.height);
        if(png!=""){
            var zi = this.getSprite(png);
            switch (direct){
                case 1:
                case 3:
                    zi.x = bg.width/2;
                    if(place==1)
                        zi.y = bg.height/2-8;
                    if(place==2)
                        zi.y = bg.height/2+12;
                    if(place==3)
                        zi.y = bg.height/2+12;
                    if(place==4)
                        zi.y = bg.height/2+8;
                    break;
                case 2:
                case 4:
                    if(direct==2){
                        zi.setFlippedX(true);
                        zi.setFlippedY(true);
                    }
                    zi.x = bg.width/2;
                    zi.y = bg.height/2+8;
                    break;
            }
            bg.addChild(zi);
            //飞牌展示
            if (MJRoomModel.isFeiPaiVo(this._cardVo) && this._cardVo.feiDisplay == 1) {
                this.displayFuOrFeiPai(direct, place, bg);
            }else if (MJRoomModel.isFuPaiVo(this._cardVo)) {
                //this.displayFuOrFeiPai(direct, place, "gsmj_fu.png", bg);
            }
        }
        //听牌的展示
        if (this._cardVo.tingDisplay == 1) {
            this.displayTing(bg);
        }
        if (mjScale!=1) {
            this._bg.setScale(mjScale);
        }
        //箭头
        if (png!="" && this._cardVo.jt) {
            this.displayJianTou(direct, bg, mjScale);
        }
        //place4有绿色遮罩
        if (this._cardVo.huDisplay == 1) {
            this.displayHu();
        }
        if(direct==1&&place==1&&!isJs || this.isForSelect()){
            if(!this.isTouchEnabled()){
                this.setTouchEnabled(true);
                this.addTouchEventListener(this.onTouchHandler,this);
            }
        }else{
            this.setTouchEnabled(false);
        
}    },

    displayGreyBg:function(){
        if(!this._bg.getChildByTag(1001)) {
            var png = "res/ui/mj/zzmjRoom/mjRoom_37.png";
            var initX = 0;
            var initY = 0;
            var scale = 1;
            if (this._displayVo.direct == 4 || this._displayVo.direct == 2) {
                png = "res/ui/mj/zzmjRoom/mjRoom_38.png";
                initX = 2;
            }
            var bg = new cc.Sprite(png);
            if (this._displayVo.direct == 3 || this._displayVo.direct == 1) {
                initX = 2;
                initY = 1;
                scale = 1.43;
            }
            bg.setScale(scale);
            bg.setPosition(this._bg.width / 2 + initX, this._bg.height / 2 + initY);
            this._bg.addChild(bg, 1, 1001);
        }
    },


    removeGreyBg:function(){
        if(this._bg.getChildByTag(1001)){
            this._bg.removeChildByTag(1001);
        }
    },

    displayHu: function() {
        var sprite = UICtor.cS9Img("res/ui/mj/zzmjRoom/mjRoom_29.png",cc.rect(5,5,5,5),cc.size(this._bg.width, this._bg.height));
        sprite.x = this._bg.width/2;
        sprite.y = this._bg.height/2;
        this._bg.addChild(sprite);
    },

    displayTing: function(bg) {
        this.tingpaiSprite = new cc.Sprite("res/ui/mj/ting_2.png");
        this.tingpaiSprite.setScale(1.2);
        this.tingpaiSprite.x = 62;
        this.tingpaiSprite.y = 102;
        bg.addChild(this.tingpaiSprite);
        this.tingpaiLab = UICtor.cLabel("0",20,cc.size(220,45),cc.color(255,248,238),1,1);
        this.tingpaiLab.x = this.tingpaiLab.y = 12;
        this.tingpaiSprite.addChild(this.tingpaiLab);
        this.shadeSprite = UICtor.cS9Img("res/ui/mj/ting_3.png",cc.rect(10,10,5,5),cc.size(73,107));
        this.shadeSprite.x = 37;
        this.shadeSprite.y = 54;
        bg.addChild(this.shadeSprite);
        this.tingpaiSprite.visible = false;
        this.shadeSprite.visible = false;
    },

    displayJianTou: function(direct, bg, scale) {
        var bgw = bg.width*scale;
        var bgh = bg.height*scale;
        var realpath = "res/ui/mj/zzmjRoom/"+this._cardVo.jt;
        if(!jsb.fileUtils.isFileExist(realpath)){
            cc.log("realpath is not exist...");
            return;
        }
        var sprite = new cc.Sprite(realpath);
        sprite.scale = 0.8;
        var sw = sprite.width*sprite.scale;
        var sh = sprite.height*sprite.scale;
        if (direct == 1) {
            sprite.x = bgw/2;
            sprite.y = bgh+sh/2;
        } else if (direct == 3) {
            sprite.x = bgw/2;
            sprite.y = 3;
        } else if (direct == 2) {
            sprite.x = -sw/2;
            sprite.y = bgh/2+4;
        } else if (direct == 4) {
            sprite.x = bgw+sw/2;
            sprite.y = bgh/2+4;
        }
        this.addChild(sprite);
    },

    displayFuOrFeiPai: function(direct, place, bg) {
        if(direct==1&&place==1) {
            var sprite = UICtor.cS9Img("res/ui/mj/ting_3.png",cc.rect(10,10,5,5),cc.size(90,130));
            sprite.x = 46.5;
            sprite.y = 66;
            bg.addChild(sprite);
        }
    },

    gang:function(){
        //var gang = new cc.Sprite("res/ui/mj/img_50.png");
        //this._bg.addChild(gang);
    },

    /**
     * 获取数据模型
     * @returns {CardVo}
     */
    getData:function(){
        return this._cardVo;
    },

    chuPai:function(){
        //this._bg.runAction(cc.fadeTo(0.5,0));
        //this._huase.runAction(cc.fadeTo(1,0));
    },

    xiaoHu:function(){
        var self = this;
        this._bg.runAction(cc.sequence(cc.delayTime(8),cc.fadeTo(1.5,0),cc.delayTime(0.2),cc.callFunc(function(){
            self.removeFromParent(true);
        })));
        //this._huase.runAction(cc.sequence(cc.delayTime(8),cc.fadeTo(1.5,0)));
    }
});
