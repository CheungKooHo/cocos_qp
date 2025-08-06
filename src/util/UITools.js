/**
 * Created by zhoufan on 2016/6/24.
 */
var UITools = {

    addClickEvent:function(widget,target,cb,playAudio){
        if(!widget){
            cc.log("1111");
        }else{
            widget.addTouchEventListener(function(obj,type){
                if(type == ccui.Widget.TOUCH_ENDED){
                    if(playAudio==undefined || playAudio==true)
                        AudioManager.play("res/audio/common/audio_button_click.mp3");
                    cb.call(target,obj);
                }
            });
        }
    },

    /**
     * 判断是否是同一天
     */
    checkIsSameDay:function(paramDate){
        if(new Date(paramDate).toDateString() === new Date().toDateString()){
            //cc.log("checkIsSameDay is same::" , new Date(paramDate).toDateString()  , new Date().toDateString());
            return true;
        }else{
            //cc.log("checkIsSameDay is not same::" , Date(paramDate).toDateString()  , new Date().toDateString());
            return false;
        }
    },

    /**
     * 获取客户端文件缓存内容
     */
    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    /**
     * 设置客户端文件缓存内容
     * @param m
     * @returns {*}
     */
     setLocalItem:function(key , value){
        cc.sys.localStorage.setItem(key,value);
    },


    /**
     ** 转化成json存在本地
     * **/
    setLocalJsonItem:function(key , json){
        var  value = JSON.stringify(json);
        cc.sys.localStorage.setItem(key,value);
    },

    /**
     ** 读取基础数据
     *还回json格式数据
     * **/
    getLocalJsonItem:function(key){
        var value = cc.sys.localStorage.getItem(key); //从本地读取数据
        var json = {};
        if (value){
            json = JSON.parse(value); //将string转换成json
        }
        return json;
    },


    add0:function(m){
        return m<10?'0'+m:m+""
    },

    truncateLabel:function(str, num) {

        var tempLen = 0;
        var chineseRegex = /[^\x00-\xff]/g;
        for (var i = 0; i < str.length; i++) {
            var char = str.charAt(i).toString();
            if (char.match(chineseRegex) != null) {
                tempLen += 2;
            } else {
                tempLen++;
            }
            if(tempLen > num*2)break;
        }

        return str.substr(0,i);
    },

    formatTime:function(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        //cc.log("shijianchuo ..." , shijianchuo);
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        //return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
        return UITools.add0(m)+'月'+UITools.add0(d)+'日'
    },

    formatDetailTime:function(timeStr){
        var data = new Date(timeStr);
        var year = data.getFullYear();
        var month = data.getMonth() + 1;
        var day = data.getDate();

        var hour = data.getHours();
        var min = data.getMinutes();
        var sec = data.getSeconds();

        if(month < 10)month = "0" + month;
        if(day < 10)day = "0" + day;
        if(hour < 10)hour = "0" + hour;
        if(min < 10)min = "0" + min;
        if(sec < 10)sec = "0" + sec;

        var str = year + "-" + month + "-" + day + "\n" + hour + ":" + min + ":" + sec;
        return str;
    },


    /**
     * 老李要 "20180123"这样的日期 不要时间戳
     * 君子不争 君子不争....。
     */
    dealTimeToServer:function(shijianchuo){
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y+UITools.add0(m)+UITools.add0(d);
    },

    /**
     * 图片url
     * 父节点
     * 裁剪节点路劲 不指定则不适用裁剪功能
     * x
     * y
     * scale
     */
    showIcon: function (iconUrl,iconNode,clipNodePath,defaultimg,x,y,scale) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var icon = iconNode;
        var defaultimg = "res/ui/dtz/images/default_m.png"||defaultimg;
        var tUseClipNode = true;
        var tScale = scale || 1;
        if(clipNodePath == null || clipNodePath.length < 3){
            tUseClipNode = false;
        }

        if(icon.iconUrlData != null && icon.iconUrlData == iconUrl){
            cc.log("同节点 同头像 避免重复加载")
            return;
        }

        var sprite = new cc.Sprite(defaultimg);
        if(!tUseClipNode){
            if (icon.getChildByTag(345)) {
                icon.removeChildByTag(345);
            }

            sprite.x = x||icon.width * 0.5;
            sprite.y = y||icon.height * 0.5;
            icon.addChild(sprite, 5, 345);
            if (iconUrl) {
                cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                    if (!error) {
                        sprite.setTexture(img);
                        icon.iconUrlData = iconUrl;
                    }
                });
            }
        }else{
            if(iconUrl){
                sprite.x = sprite.y = 0;
                try{
                    var scale = tScale;
                    var sten = new cc.Sprite(clipNodePath);
                    sten.setScale(scale);
                    var clipnode = new cc.ClippingNode();
                    clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: x, y: y, alphaThreshold: scale});
                    clipnode.addChild(sprite);
                    icon.addChild(clipnode,5,345);
                    var self = this;
                    cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                        if (!error) {
                            sprite.setTexture(img);
                            icon.iconUrlData = iconUrl;
                            sprite.x = 0;
                            sprite.y = 0;
                        }else{
                            self._iconUrl = "";
                        }
                    });
                }catch(e){}
            }else{
                sprite.x = x || icon.width * 0.5;
                sprite.y = y || icon.height * 0.5;
                icon.addChild(sprite,5,345);
            }
        }

    },

    //处理id 后面两位用*号代替
    dealId: function (id) {
        var idStr = id.toString();
        var str = "";
        for(var i=0;i < idStr.length;i++){
            if (i == idStr.length - 2 || i == idStr.length -1){
                str = str + "*";
            }else{
                str = str + idStr[i];
            }
        }
        //cc.log("dealId",str);
        return str;
    },

    dealUserId: function (id) {
        var idStr = id.toString();
        var str = "";
        for(var i=0;i < idStr.length;i++){
            if (i == 0 || i == idStr.length -1){
                str = str + idStr[i];
            }else{
                str = str + "*";
            }
        }
        //cc.log("dealUserId",str);
        return str;
    },

    dealUserName: function (name) {
        var nameStr = name.toString();
        var str = "";
        for(var i=0;i < nameStr.length;i++){
            if (i == 0){
                str = str + nameStr[i];
            }else{
                str = str + "*";
            }
        }
        return str;
    },
}