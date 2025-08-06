var failCount = 0;
var maxFailCount = 5; //最大错误重试次数

var startEnterGame = function () {
  sy.assetsScene.logo.visible = true;
  sy.assetsScene.bgLayer.visible = true;
  sy.assetsScene.initDt();
};

var AssetsUpdateFailedPopup = cc.Layer.extend({
  root: null,
  mainpopup: null,
  ctor: function () {
    this._super();
    var _this = this;
    cc.loader.loadJson('res/alertPop.json', function (err, configJson) {
      _this.loadComplete();
    });
  },

  getWidget: function (name) {
    return ccui.helper.seekWidgetByName(this.root, name);
  },

  /**
   * 加载完成后初始化UI
   *
   */
  loadComplete: function () {
    this.root = ccs.uiReader.widgetFromJsonFile('res/alertPop.json');
    this.addChild(this.root);
    this.getWidget('Label_35').setString('更新失败！请重新登录游戏！');
    this.btnok = this.getWidget('Button_36');
    this.btnok.addTouchEventListener(this.onOk, this);
    var btncancel = this.getWidget('Button_37');
    this.btnok.x -= 122;
    btncancel.visible = false;
  },

  onOk: function (obj, type) {
    if (type == ccui.Widget.TOUCH_ENDED) {
      if (cc.sys.os == cc.sys.OS_IOS) {
        ios_sdk_exit();
      } else {
        cc.director.end();
      }
    }
  },
});

var AssetsUpdateModel = {
  init: function () {
    this.tags = [];
    this.isLog = false;
  },

  log: function (tag) {
    this.tags.push(tag);
  },

  getTags: function () {
    return this.tags.toString();
  },
};

/**
 * 自动更新js和资源
 */
var AssetsManagerLoaderScene = cc.Scene.extend({
  _am: null,
  _progress: null,
  _percent: 0,
  _percentByFile: 0,
  _loadingBar: null,
  _fileLoadingBar: null,
  _normalLayer: null,
  _popupLayer: null,
  _checkNetworkNode: null,

  onEnter: function () {
    this._super();
    sy.assetsScene = this;
    AssetsUpdateModel.init();
    var winSize = cc.director.getWinSize();
    var self = this;

    this._checkNetworkNode = new cc.Layer();
    this.addChild(this._checkNetworkNode);
    this._normalLayer = new cc.Layer();
    this.addChild(this._normalLayer, 0);
    this._popupLayer = new cc.Layer();
    this.addChild(this._popupLayer, 10);

    //背景;
    var bgLayer = new ccui.ImageView();
    bgLayer.loadTexture(
      sy.imagepath + 'loading/background.png',
      ccui.Widget.LOCAL_TEXTURE
    );
    bgLayer.setPosition(winSize.width * 0.5, winSize.height * 0.5);
    bgLayer.setAnchorPoint(0.5, 0.5);
    //LOGO;
    var logoLayer = new ccui.ImageView();
    logoLayer.loadTexture(
      sy.imagepath + 'loading/loading_logo.png',
      ccui.Widget.LOCAL_TEXTURE
    );
    logoLayer.setAnchorPoint(0.5, 0.5);
    logoLayer.setPosition(winSize.width * 0.8888, winSize.height * 0.8888);
    this._normalLayer.addChild(bgLayer, 0);
    this._normalLayer.addChild(logoLayer, 1);

    AssetsUpdateModel.log('i1');

    var nettip = (this.noNetworkLabel = new cc.Sprite(
      sy.imagepath + 'loading/net_tip.png'
    ));
    var nettip_size = nettip.getContentSize();
    var nettip_txt = new cc.LabelTTF(
      '请在设置中找到该游戏，查看网络是否打开...',
      'Arial',
      36
    );
    nettip_txt.anchorX = nettip_txt.anchorY = 0.5;
    nettip_txt.x = nettip_size.width / 2;
    nettip_txt.y = nettip_size.height / 2;
    nettip.addChild(nettip_txt);
    nettip.visible = false;
    nettip.x = winSize.width / 2;
    nettip.y = 100;
    this._normalLayer.addChild(nettip, 3);

    //load config
    cc.loader.loadJson('syconfig.json', function (err, configJson) {
      if (err) {
        cc.log('load syconfig.json error');
      } else {
        SyConfig.init(configJson);
        if (SyConfig.PLAY_VEDIO) {
          var pre_time = parseInt(cc.sys.localStorage.getItem('playVedioTime'));
          var cur_time = new Date().getTime();
          cc.log('cur_time....', cur_time, pre_time);
          if (!pre_time || self.isAcrossDay(cur_time, pre_time)) {
            cc.sys.localStorage.setItem('playVedioTime', cur_time);
            self.logo.visible = false;
            self.bgLayer.visible = false;
            var starlogo = new ccui.ImageView();
            starlogo.loadTexture(
              sy.imagepath + 'loading/net_error_bg.jpg',
              ccui.Widget.LOCAL_TEXTURE
            );
            self.starlogo = starlogo;
            starlogo.setPosition(winSize.width / 2, winSize.height / 2);
            self._normalLayer.addChild(starlogo, 0);
            self.runAction(
              cc.sequence(
                cc.delayTime(2),
                cc.callFunc(function () {
                  self.starlogo.visible = false;
                  //playVideo("res/video/logo.mp4");
                }, this)
              )
            );
          } else {
            sy.assetsScene.initDt();
          }
        } else {
          sy.assetsScene.initDt();
        }
      }
    });
  },

  isAcrossDay: function (c_time, p_time) {
    var c_day = Math.floor(c_time / 86400000);
    var p_day = Math.floor(p_time / 86400000);
    cc.log('c_day, p_day', c_day, p_day);
    return c_day > p_day;
  },

  initDt: function () {
    if (!SyConfig.isSdk()) {
      this.checkUpdate();
    } else {
      if (SyConfig.isAndroid())
        jsb.reflection.callStaticMethod(
          'net/sy599/common/SDKHelper',
          'sdkInit',
          '()V'
        );
      else {
        //if (ios_sdk_nettype() == 0) {
        //	this.noNetworkLabel.visible = true;
        //	this._checkNetworkNode.schedule(this.checkNetworkstate.bind(this), 0.01);
        //}
        //else {
        this.checkUpdate();
        //}
      }
    }
  },

  checkNetworkstate: function () {
    if (ios_sdk_nettype() != 0) {
      this.noNetworkLabel.visible = false;
      this._checkNetworkNode.unscheduleAllCallbacks();
      this.checkUpdate();
    }
  },

  sdkInitcb: function () {
    setTimeout(function () {
      sy.assetsScene.checkUpdate();
    }, 10);
  },

  updateLoadingBar: function (percent) {
    var baseWidth = 840;
    var nowWidth = parseInt(baseWidth * (percent / 100));
    if (!this._loadingbar) {
      this._loadingbar = new cc.Sprite(sy.imagepath + 'loading/jindu2.png');
      this._loadingbar.anchorX = 0;
      this._loadingbar.anchorY = 0.5;
      this._loadingbar.x = 0;
      this._loadingbar.y =
        this.loadingbg.height / 2 + (cc.sys.isNative ? 0.0 : 22.0);
      this.loadingbg.addChild(this._loadingbar, 1);
    }
    this._loadingbar.setTextureRect(cc.rect(0, 0, nowWidth, 44));

    if (!this._loadingbar2) {
      this._loadingbar2 = new cc.Sprite(sy.imagepath + 'loading/jindu3.png');
      this._loadingbar2.anchorX = 0;
      this._loadingbar2.anchorY = 0.5;
      this._loadingbar2.x = 0;
      this._loadingbar2.y =
        this.loadingbg.height / 2 + (cc.sys.isNative ? 0.0 : 22.0);
      this.loadingbg.addChild(this._loadingbar2, 2);
    }
    this._loadingbar2.setTextureRect(cc.rect(0, 0, nowWidth, 44));
  },

  checkUpdate: function () {
    cc.log('开始检测更新....');
    this.dt = 0;
    this.diandt = 0;
    this.downloadTotalFiles = 0;
    this.downloadFiles = 0;
    var winSize = cc.director.getWinSize();
    var loadingBg = (this.loadingbg = new ccui.ImageView());
    loadingBg.loadTexture(
      sy.imagepath + 'loading/jindu1.png',
      ccui.Widget.LOCAL_TEXTURE
    );
    loadingBg.setAnchorPoint(0.5, 0.5);
    var font = 'res/font/font_res_at2.ttf';
    var txt = '检测更新...';
    var label = (this._progress = new cc.LabelTTF(
      txt,
      font,
      25,
      cc.size(winSize.width, 25)
    ));
    var that = this;
    loadingBg.x = winSize.width / 2.0;
    loadingBg.y = 190.0 * (winSize.height / 720.0);
    label.setColor(cc.color('#ffffff'));
    label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    label.x = winSize.width / 2.0;
    label.y = 230.0 * (winSize.height / 720.0);
    AssetsUpdateModel.log('i2');
    this._normalLayer.addChild(loadingBg, 3);
    this._normalLayer.addChild(this._progress, 10);
    this._normalLayer.m_progress = this._progress;
    this.updateLoadingBar(100);

    if (SyConfig.IGNORE_HOTUPDATE || cc.sys.os == cc.sys.OS_WINDOWS) {
      cc.log('checkUpdate::IGNORE_HOTUPDATE....cancel');
      this._percent = 0;
      this.scheduleUpdate();
      this.updateLoadingBar(100);
      this.loadGame();
      return;
    }
    if (SyConfig.isSdk() && (SyConfig.isAndroid() || SyConfig.isIos())) {
      AssetsUpdateModel.log('i3');
      var storagePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : './';

      var Str1 = 'release';
      var Str2 = 'android';
      if (SyConfig.DEBUG) {
        Str1 = 'release';
      }
      if (cc.sys.os === cc.sys.OS_IOS) {
        Str2 = 'ios';
      }
      var pathStr =
        'res/plist/update/' + Str1 + '/' + Str2 + '/project.manifest';
      this._am = new jsb.AssetsManager(pathStr, storagePath);
      this._am.retain();
      if (!this._am.getLocalManifest().isLoaded()) {
        AssetsUpdateModel.log('i4');
        cc.log('Fail to update assets, step skipped.');
        this.loadGame();
      } else {
        var listener = new jsb.EventListenerAssetsManager(this._am, function (
          event
        ) {
          switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
              AssetsUpdateModel.log('e1');
              cc.log('No local manifest file found, skip assets update.');
              that.loadGame();
              break;
            case jsb.EventAssetsManager.ASSET_UPDATED:
              //that.downloadFiles++;
              //if(that.downloadTotalFiles == 0){
              //	that._percent = 0;
              //}else{
              //	that._percent = 100*(that.downloadFiles/that.downloadTotalFiles);
              //}
              break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
              //clearTimeout(that.timeId);
              //that.downloadTotalFiles = event.getCURLMCode();
              that._percent = event.getPercent();
              break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
              AssetsUpdateModel.log('e2');
              cc.log('Fail to download manifest file, update skipped.');
              that.loadGame();
              break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
              AssetsUpdateModel.log('e3');
              cc.log('ALREADY_UP_TO_DATE.');
              that.loadGame();
              break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
              AssetsUpdateModel.log('e4');
              cc.log('Update finished.');
              that.loadGame();
              break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
              AssetsUpdateModel.log('e5');
              cc.log('Update failed. ' + event.getMessage());
              failCount++;
              if (failCount < maxFailCount) {
                that._am.downloadFailedAssets();
              } else {
                cc.log('Reach maximum fail count, exit update process');
                var popup = new AssetsUpdateFailedPopup();
                that._popupLayer.addChild(popup);
              }
              break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
              AssetsUpdateModel.log('e6');
              cc.log(
                'Asset update error: ' +
                  event.getAssetId() +
                  ', ' +
                  event.getMessage()
              );
              //that.loadGame();
              break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
              AssetsUpdateModel.log('e7');
              cc.log('ERROR_DECOMPRESS. ' + event.getMessage());
              that.loadGame();
              break;
            default:
              AssetsUpdateModel.log('e8');
              break;
          }
        });
        cc.eventManager.addListener(listener, 1);
        this._am.update();
      }
    }
    this.schedule(this.updateProgress, 0.8);
    this.scheduleUpdate();
  },

  update: function (dt) {
    this.dt += dt;
    if (this.dt >= 0.5) {
      this.dt = 0;
      this.diandt += 1;
      if (this._percent == 0) {
        var dian = ['.', '..', '...'];
        this._progress.setString('正在检查更新' + dian[this.diandt - 1]);
        if (this.diandt >= 3) {
          this.diandt = 0;
        }
      }
    }
  },

  loadGame: function () {
    //clearTimeout(this.timeId);
    var self = this;
    self._load_percent1 = 0;
    self._load_percent2 = 0;

    if (this._loadingbar) {
      this.unscheduleUpdate();
      this.updateLoadingBar(100);
    }
    AssetsUpdateModel.log('s1');
    //jsList是jsList.js的变量，记录全部js。
    this.scheduleOnce(function () {
      //cc.director.runScene(new MainScene());
      cc.loader.loadJs(['src/jsList.js'], function () {
        AssetsUpdateModel.log('s2');
        cc.loader.loadJs(jsList, function () {
          if (!cc.sys.isNative) {
            self.preloadJson();
            //loadStartLoads(imageRes.common);
            self._webLoading();
            self.schedule(self.updateLoad, 0.2);
          } else {
            cc.director.runScene(new MainScene());
          }
        });
      });
    }, 0.3);
  },

  _webLoading: function () {
    var self = this;
    //g_startLoads = []
    otherLoads();
    cc.loader.load(
      g_startLoads,
      function (result, count, loadedCount) {
        var percent = ((loadedCount / count) * 100) | 0;
        self._load_percent2 = Math.min(percent, 100);
      },
      function () {
        self._load_percent2 = 100;
      }
    );
  },
  updateLoad: function () {
    var self = this;
    if (this._loadingbar) {
      this.updateLoadingBar(100);
    }
    ////this.sdkLog("===>>> loading preload js::: percent 1:"+this._load_percent1 + ", percent 2:"+this._load_percent2);
    if (this._load_percent1 >= 100 && this._load_percent2 >= 100) {
      var that = this;
      that.unschedule(this.updateProgress);
      that.unschedule(this.updateLoad);
      if (cc.sys.isNative) {
        Loading.preload(
          loadStartLoads([imageRes.common]),
          function () {
            cc.director.runScene(new MainScene());
          },
          that._normalLayer,
          false
        );
      } else {
        Loading.preload(
          loadStartLoads([
            imageRes.common,
            imageRes.game,
            imageRes.popLayer,
            imageRes.texiao,
          ]),
          function () {
            cc.director.runScene(new MainScene());
          },
          that._normalLayer,
          false
        );
      }
    }
  },
  updateProgress: function (dt) {
    var p = parseInt('' + this._percent);
    if (p > 0) {
      var p = parseInt(this._percent);
      if (p >= 100) {
        this._progress.setString('更新完成');
      } else {
        this._progress.setString('正在更新...' + (p + '%'));
      }
      this.updateLoadingBar(this._percent);
    }
  },

  onExit: function () {
    cc.log('AssetsManager::onExit');
    if (this._am) {
      this._am.release();
    }
    this._super();
  },
  preloadJson: function () {
    var self = this;
    var res = [
      'res/ActivityNoticePop.json',
      'res/ActivityPop.json',
      'res/CSmjBigResult.json',
      'res/ClubTablePop.json',
      'res/DTZ3RenBigResult.json',
      'res/DTZ3RenBigResultSx.json',
      'res/DTZ3RenReplay.json',
      'res/DTZ3RenRoom.json',
      'res/DTZ3RenSmallResult.json',
      'res/DTZ3WTZRenBigResult.json',
      'res/DTZ3recordDetail.json',
      'res/DTZBigResultSx.json',
      'res/DTZCardNote.json',
      'res/DTZGiftAlertPop.json',
      'res/DTZGiftExchangePop.json',
      'res/DTZGiftRecordPop.json',
      'res/DTZMatchResultPop.json',
      'res/DTZMoney3RenBigResult.json',
      'res/DTZMoney3RenRoom.json',
      'res/DTZMoneyLoading.json',
      'res/DTZReplay.json',
      'res/DTZbigResult.json',
      'res/DTZrecordDetail.json',
      'res/DTZroom.json',
      'res/DTZsmallResult.json',
      'res/DaiLiActivityPop.json',
      'res/HZmjBigResult.json',
      'res/MemberItemPop.json',
      'res/MerryChristmasShare.json',
      'res/PDKMatchRoom.json',
      'res/PDKrecord.json',
      'res/PDKrecordDetail.json',
      'res/PDKtotalRecordCell.json',
      'res/RedPacketPop.json',
      'res/ShopPop.json',
      'res/YqhPop.json',
      'res/YqhSqPop.json',
      'res/agreement.json',
      'res/ahmjRoom.json',
      'res/ahmjRoomThree.json',
      'res/ahmjRoomTwo.json',
      'res/ahphzRoom.json',
      'res/ahphzRoom2Ren.json',
      'res/alertPop.json',
      'res/applyExitRoom.json',
      'res/bigResult.json',
      'res/bjdDailiPop.json',
      'res/bjdHome.json',
      'res/bsmjReplay.json',
      'res/bsmjReplayThree.json',
      'res/bsmjReplayTwo.json',
      'res/bsmjRoom.json',
      'res/bsmjRoomThree.json',
      'res/bsmjRoomTwo.json',
      'res/changeCreditSepPop.json',
      'res/chat.json',
      'res/clubAddPlayerPop.json',
      'res/clubAgencyManagePop.json',
      'res/clubAgentProceedPop.json',
      'res/clubBagManagePop.json',
      'res/clubChoiceTimePop.json',
      'res/clubCreateTeamPop.json',
      'res/clubCreditDividePop.json',
      'res/clubCreditInputPop.json',
      'res/clubCreditPop.json',
      'res/clubCreditRatioPop.json',
      'res/clubDtz3RecallDetailPop.json',
      'res/clubDtzRecallDetailPop.json',
      'res/clubHzmjRecallDetailPop.json',
      'res/clubInputPlayersFromClub.json',
      'res/clubInputPlayersFromTeam.json',
      'res/clubInvitePop.json',
      'res/clubKickPlayerPop.json',
      'res/clubMatchTipPop.json',
      'res/clubPdkRecallDetailPop.json',
      'res/clubPhzRecallDetailPop.json',
      'res/clubPlayerInfoPop.json',
      'res/clubRoomCell.json',
      'res/clubRoomDetailPop.json',
      'res/clubRuleManagePop.json',
      'res/clubSingleTimePop.json',
      'res/clubStatisticsDownPop.json',
      'res/clubStatisticsPop.json',
      'res/clubStatisticsPopItem.json',
      'res/clubTeamDetailManagePop.json',
      'res/clubTeamListPop.json',
      'res/clubTeamPop.json',
      'res/clubTipsPop.json',
      'res/clubUpgradeSucceedPop.json',
      'res/clubUserRolePop.json',
      'res/createRoom.json',
      'res/csmjRoom.json',
      'res/csmjRoomThree.json',
      'res/csmjRoomTwo.json',
      'res/csmjSetup.json',
      'res/cutCardPop.json',
      'res/daiKaiRoom.json',
      'res/dailiPop.json',
      'res/deleteMemberPop.json',
      'res/dnBigResult.json',
      'res/dnBigResultMore.json',
      'res/dnChat.json',
      'res/dnCreateRoom.json',
      'res/dnHome.json',
      'res/dnReplay.json',
      'res/dnReplayMore.json',
      'res/dnRoom.json',
      'res/dnRoomMore.json',
      'res/dnSmallResult.json',
      'res/dnSmallResultMore.json',
      'res/dnWanfaPop.json',
      'res/dtSetup.json',
      'res/dtzInvitePop.json',
      'res/dtzMoneyRoomSetPop.json',
      'res/dtzMoneyRulePop.json',
      'res/dtzRoomSetPop.json',
      'res/dtzSetup.json',
      'res/duihuanGoodsItem.json',
      'res/duihuanOrderItem.json',
      'res/duihuanShop.json',
      'res/duihuanTaskItem.json',
      'res/duihuanTipPop.json',
      'res/fengshenbang.json',
      'res/gdcsmjDipai.json',
      'res/gpsAlertPop.json',
      'res/gpsPop3.json',
      'res/gpsPop4.json',
      'res/gpsReviewPop.json',
      'res/hall.json',
      'res/hbgzpBigResult.json',
      'res/hbgzpReplay.json',
      'res/hbgzpReplayLess.json',
      'res/hbgzpReplayMore.json',
      'res/hbgzpRoom.json',
      'res/hbgzpRoom2Ren.json',
      'res/hbgzpRoomMore.json',
      'res/hbgzpSetPop.json',
      'res/hbgzpSmallResult.json',
      'res/home.json',
      'res/huodongPop.json',
      'res/hzmjCreateRoom.json',
      'res/hzmjReplay.json',
      'res/hzmjReplayThree.json',
      'res/hzmjReplayTwo.json',
      'res/hzmjRoom.json',
      'res/hzmjRoomThree.json',
      'res/hzmjRoomTwo.json',
      'res/idVerify.json',
      'res/inviteCode.json',

      'res/luckDraw.json',
      'res/marketPop.json',
      'res/matchAlertPop.json',
      'res/matchApplyLayer.json',
      'res/matchAwardPop.json',
      'res/matchDtzRoom.json',
      'res/matchField.json',
      'res/matchHomePop.json',
      'res/matchInviteCode.json',
      'res/matchPdkRoom.json',
      'res/matchPdkSmallResult.json',
      'res/matchRankPop.json',
      'res/matchRecordPop.json',
      'res/matchResult.json',
      'res/matchResultPop.json',
      'res/matchRulePop.json',
      'res/matchTips.json',
      'res/matchWaitRoom.json',
      'res/matchWaiting.json',
      'res/mjBigResult.json',
      'res/mjChat.json',
      'res/mjCreateRoom.json',
      'res/mjGang.json',
      'res/mjHaiDi.json',
      'res/mjHome.json',
      'res/mjRecordCell.json',
      'res/mjReplay.json',
      'res/mjRoom.json',
      'res/mjSetup.json',
      'res/mjSmallResult.json',
      'res/mjWanfaPop.json',
      'res/nxghzRoom.json',
      'res/nxghzRoom2Ren.json',
      'res/nxmjRoom.json',
      'res/nxmjRoomThree.json',
      'res/nxmjRoomTwo.json',
      'res/nymjMaPai.json',
      'res/pay.json',
      'res/payTypeSelectPop.json',
      'res/pdkBigResult.json',
      'res/pdkCreateRoom.json',
      'res/pdkHome.json',
      'res/pdkMoneyResultPop.json',
      'res/pdkMoneyRoom.json',
      'res/pdkRoom.json',
      'res/pdkRoomSetPop.json',
      'res/pdkSetup.json',
      'res/pdkSmallResult.json',
      'res/phzBigResult.json',
      'res/phzBigResultBP.json',
      'res/phzBigResultMore.json',
      'res/phzBigResultMoreBP.json',
      'res/phzChat.json',
      'res/phzCreateRoom.json',
      'res/phzCreateRoomNew.json',
      'res/phzDissolutionPop.json',
      'res/phzHandCard.json',
      'res/phzHome.json',
      'res/phzMoneyResultPop.json',
      'res/phzMoneyRoom.json',
      'res/phzPlayerInfo.json',
      'res/phzReplay.json',
      'res/phzReplayLess.json',
      'res/phzReplayMore.json',
      'res/phzRoom.json',
      'res/phzRoom2Ren.json',
      'res/phzRoomMore.json',
      'res/phzSetPop.json',
      'res/phzSetup.json',
      'res/phzSmallResult.json',
      'res/phzSmallResultTwo.json',
      'res/phzWanfaPop.json',
      'res/phzrecordDetail.json',
      'res/playerAward.json',
      'res/playerInfo.json',
      'res/preparationTime.json',
      'res/pyqAllotListPop.json',
      'res/pyqBeInvitePop.json',
      'res/pyqCheckInputPop.json',
      'res/pyqChenYuan.json',
      'res/pyqHall.json',
      'res/pyqHallNew.json',
      'res/pyqInfoPop.json',
      'res/pyqInviteListPop.json',
      'res/pyqNewPifuPop.json',
      'res/pyqPifuPop.json',
      'res/pyqRecordPop.json',
      'res/pyqSet.json',
      'res/pyqTongji.json',
      'res/pyqWanfa.json',
      'res/qfBigResult.json',
      'res/qfCardNote.json',
      'res/qfChat.json',
      'res/qfCreateRoom.json',
      'res/qfReplay.json',
      'res/qfRoom.json',
      'res/qfRoomSetPop.json',
      'res/qfSmallResult.json',
      'res/record.json',
      'res/recordCell.json',
      'res/recordListPop.json',
      'res/redeemCode.json',
      'res/registry.json',
      'res/representPop.json',
      'res/room.json',
      'res/sdhSetup.json',
      'res/seePlayBack.json',
      'res/selectScoreType.json',
      'res/servicePop.json',
      'res/setup.json',
      'res/shareDTPop.json',
      'res/shareDailyPop.json',
      'res/shopTipPop.json',
      'res/signInPop.json',
      'res/smallResult.json',
      'res/symjCreateRoom.json',
      'res/symjReplay.json',
      'res/symjReplayThree.json',
      'res/symjReplayTwo.json',
      'res/symjRoom.json',
      'res/symjRoomThree.json',
      'res/symjRoomTwo.json',
      'res/tcpfmjSetup.json',
      'res/totalRecordCell.json',
      'res/xxeqsRoom.json',
      'res/xxeqsRoom2Ren.json',
      'res/yjghzRoom.json',
      'res/yjghzRoom2Ren.json',
      'res/yjmjRoom.json',
      'res/yjmjRoomThree.json',
      'res/yjmjRoomTwo.json',
      'res/yzchzRoom.json',
      'res/yzchzRoom2Ren.json',
      'res/yzlcRoom.json',
      'res/yzlcRoom2Ren.json',
      'res/yzlcRoomMore.json',
      'res/yzlcShowChuo.json',
      'res/yzwdmjBigResult.json',
      'res/yzwdmjRoom.json',
      'res/yzwdmjRoomThree.json',
      'res/yzwdmjRoomTwo.json',
      'res/zhzRoom.json',
      'res/zhzRoom2Ren.json',
      'res/zhzRoomMore.json',
      'res/zzmjCreateRoom.json',
      'res/zzmjRoom.json',
      'res/zzmjRoomThree.json',
      'res/zzmjRoomTwo.json',
      'res/zzphBigResult.json',
      'res/zzphRoom.json',
      'res/zzphRoom2Ren.json',
      'res/zzphRoomMore.json',
      'res/zzphSmallResult.json',

      //加载;
      'res/loadingCircle.json',
      //登录;
      'res/login.json',

      //大厅;
      'res/lobby.json',
      //亲友;
      'res/clubPopCreditCreate.json', //俱乐部-玩法修改比赛设置弹窗;

      //弹窗;
      'res/loginMoniPanel.json',
      'res/loginPanel.json',
      'res/alertPopPhoneLogin.json', //手机登录;
      'res/alertPopKefu.json', //客服;
      'res/alertPopNotice.json', //公告;
      'res/alertPopPlayerMsg.json', //邮件、消息;
      'res/alertPopCheckIdCard.json', //实名验证;
      'res/alertPopSet.json', //设置-大厅;
      'res/alertPopReport.json', //设置->举报;
      'res/alertPopAgreement.json', //设置->查看用户协议;
      'res/alertPopBindInviteCode.json', //绑定邀请码;
      'res/alertPopShare.json', //分享;
      'res/alertPopWanfa.json', //玩法;
      'res/alertPopShareGift.json', //分享有礼;
      'res/alertPopUserInfo.json', //大厅-玩家信息;
      'res/alertPopJoinRoom.json', //大厅-加入房间;
      'res/alertPopRecord.json', //大厅-战绩弹窗;
      'res/alertPopCreateRoom.json', //大厅-创建玩法弹窗;
    ];
    cc.loader.load(
      res,
      function (result, count, loadedCount) {
        var percent = ((loadedCount / count) * 100) | 0;
        self._load_percent1 = Math.min(percent, 100);
      },
      function () {
        self._load_percent1 = 100;
        cc.log('load all json ................... OK');
      }
    );
  },
});
var Loading = cc.Layer.extend({
  layer: null,
  resources: null,
  m_progress: null,
  init: function (resources, cb, isHide) {
    var self = this;
    self.removeFromParent();
    self.m_isHide = isHide;
    self.m_progress = sy.assetsScene._normalLayer.m_progress;
    sy.assetsScene.updateLoadingBar(0);
    self.m_progress.setString('资源拼命加载中...' + (0 + '%'));

    if (typeof resources == 'string') {
      resources = [resources];
    }
    self.resources = resources.slice(0) || []; //g_startLoads被改变bug
    self.cb = cb;

    self.size = self.resources.length;
    return self;
  },

  onEnter: function () {
    var self = this;
    //记录加载了几个界面
    self.loadingLayerNum = 0;
    this._super();
    if (cc.sys.isNative) {
      if (!self.resources.length) {
        if (self.cb) self.cb();
        return;
      }
      self.loading = 0;
      self.finishedSize = 0;
      //增加 需要new页面的个数
      self.resourceNum = self.resources.length;

      self.scheduleUpdate();
    } else {
      self.schedule(self._webLoading, 0.3);
    }
  },
  onExit: function () {
    var self = this;
    self.resources = null;
    self.cb = null;
    this._super();
  },
  getPercent: function () {
    return this.percent;
  },
  update: function (dt) {
    var self = this;
    if (self.loading >= 4) return; //最多同时加载n个资源
    if (self.finishedSize >= self.size) {
      self.unscheduleUpdate();
      if (self.cb) self.cb();
      self.removeFromParent(); //完成之后移除自己
      return;
    }
    //图片资源加载
    if (self.finishedSize < self.resources.length) {
      var res = self.resources.pop();
      if (!res || res == []) {
        cc.log('load res fail');
        return;
      }
      self.loading++;
      cc.log('正在拼命加载中！！！', self.finishedSize, self.size);
      var ext = cc.path.extname(res).toLowerCase();
      cc.log('', ext);
      if (ArrayUtil.in_array(ext, ['.png', '.jpg', '.jpeg'])) {
        cc.textureCache.addImageAsync(res, function () {
          self.loading--;
          ++self.finishedSize;
        });
      } else if (ArrayUtil.in_array(ext, ['.exportjson', '.json'])) {
        cc.loader.load(res, function () {
          self.loading--;
          ++self.finishedSize;
        });
      } else {
        self.loading--;
        ++self.finishedSize;
      }
    } else {
      self.loadingLayerNum++;
      ++self.finishedSize;
    }
    var percent = ((self.finishedSize / self.size) * 100) | 0;
    self.percent = Math.min(percent, 100);
    if (self.percent == 100) {
      sy.assetsScene.updateLoadingBar(self.percent);
      self.m_progress.setString('加载完成...');
    } else {
      self.m_progress.setString('资源拼命加载中...' + (self.percent + '%'));
      sy.assetsScene.updateLoadingBar(self.percent);
    }
  },
  _webLoading: function () {
    var self = this;
    self.unschedule(self._webLoading);
    var res = self.resources;
    cc.loader.load(
      res,
      function (result, count, loadedCount) {
        var percent = ((loadedCount / count) * 100) | 0;
        self.percent = Math.min(percent, 100);
        if (self.percent == 100) {
          sy.assetsScene.updateLoadingBar(self.percent);
          self.m_progress.setString('加载完成...');
        } else {
          sy.assetsScene.updateLoadingBar(self.percent);
          self.m_progress.setString('资源拼命加载中...' + (self.percent + '%'));
        }
      },
      function () {
        if (self.cb) self.cb();
      }
    );
  },
});

Loading.preload = function (resources, cb, isLayer, isHide) {
  var loadingLayer;
  loadingLayer = SYS.KKKK = cc.loading = new Loading();
  loadingLayer.init(resources, cb, isHide);
  //加载;
  isLayer.addChild(loadingLayer);
};
