var res = {};
var SYS = {};

res.majiang_plist = 'res/plist/majiang_gsbg.plist';
res.majiang_png = 'res/plist/majiang_gsbg.png';
res.majiang_zi_plist = 'res/plist/majiang_gszi.plist';
res.majiang_zi_png = 'res/plist/majiang_gszi.png';
res.majiang_ln_plist = 'res/plist/majiang_lnbg.plist';
res.majiang_ln_png = 'res/plist/majiang_lnbg.png';
res.majiang_ln_zi_plist = 'res/plist/majiang_lnzi.plist';
res.majiang_ln_zi_png = 'res/plist/majiang_lnzi.png';
res.majiang_thjbg_plist = 'res/plist/majiang_thjbg.plist';
res.majiang_thjbg_png = 'res/plist/majiang_thjbg.png';
res.majiang_oldzi_plist = 'res/plist/majiang_oldzi.plist';
res.majiang_oldzi_png = 'res/plist/majiang_oldzi.png';
res.majiang_yellowbg_plist = 'res/plist/majiang_yellowbg.plist';
res.majiang_yellowbg_png = 'res/plist/majiang_yellowbg.png';
res.majiang_thjzi_plist = 'res/plist/majiang_thjzi.plist';
res.majiang_thjzi_png = 'res/plist/majiang_thjzi.png';

res.phz_plist = 'res/plist/paohuzi.plist';
res.phz_png = 'res/plist/paohuzi.png';
res.hbgzp_plist = 'res/plist/hbgzpCard.plist';
res.hbgzp_png = 'res/plist/hbgzpCard.png';
res.hbgzp_newplist = 'res/plist/hbgzpNewCard.plist';
res.hbgzp_newpng = 'res/plist/hbgzpNewCard.png';
res.emoji_plist = 'res/plist/biaoqing.plist';
res.emoji_png = 'res/plist/biaoqing.png';
res.poker_plist = 'res/plist/nmw_bcard.plist';
res.poker_png = 'res/plist/nmw_bcard.png';
res.PDKpoker_plist = 'res/plist/poker.plist';
res.PDKpoker_png = 'res/plist/poker.png';
res.test_png = 'res/ui/images/bomb.png';
res.tongzi_png = 'res/ui/dtz/images/redKuang.png';
res.dizha_png = 'res/ui/dtz/images/orangeKuang.png';
res.xi_png = 'res/ui/dtz/images/yellowKuang.png';
res.mingci1 = 'res/ui/dtz/images/mingci1.png';

res.mingci2 = 'res/ui/dtz/images/mingci2.png';
res.mingci3 = 'res/ui/dtz/images/mingci3.png';
res.mingci4 = 'res/ui/dtz/images/mingci4.png';

res.phz_cards_plist = 'res/plist/phz_cards.plist';
res.phz_cards_png = 'res/plist/phz_cards.png';
res.ahphz_cards_plist = 'res/plist/ahphz_cards.plist';
res.ahphz_cards_png = 'res/plist/ahphz_cards.png';

res.nmw_bcard_plist = 'res/plist/nmw_bcard.plist';
res.nmw_bcard_png = 'res/plist/nmw_bcard.png';

res.qf_bcard_plist = 'res/plist/qf_cards.plist';
res.qf_bcard_png = 'res/plist/qf_cards.png';
res.qf_scard_plist = 'res/plist/qf_scards.plist';
res.qf_scard_png = 'res/plist/qf_scards.png';

res.ddz_poker_plist = 'res/plist/ddz_poker.plist';
res.ddz_poker_png = 'res/plist/ddz_poker.png';

res.pdk_bigcards_plist = 'res/plist/pdk_bigcards.plist';
res.pdk_bigcards_png = 'res/plist/pdk_bigcards.png';
res.pdk_midcards_plist = 'res/plist/pdk_midcards.plist';
res.pdk_midcards_png = 'res/plist/pdk_midcards.png';
res.pdk_smallcards_plist = 'res/plist/pdk_smallcards.plist';
res.pdk_smallcards_png = 'res/plist/pdk_smallcards.png';

var images = [];
var imageBasePath = sy.imagepath;
var imageRes = {
  //todo common 下放入的特效都提前预加载  不是常用和特殊的 放到其他目录
  common: {
    //公用;
    common_loading_background_png: imageBasePath + 'loading/background.png',
    common_loading_logo_png: imageBasePath + 'loading/loading_logo.png',
    common_loading_circle_png: imageBasePath + 'loading/loading_circle.png',
    common_loading_shaizi_png: imageBasePath + 'loading/loading_shaizi.png',
    common_input_tmbg: imageBasePath + 'common/common_input_tmbg.png',
    common_alpha_png: imageBasePath + 'common/alpha.png',
    common_head_m_png: imageBasePath + 'common/common_default_m.png',
    common_head_w_png: imageBasePath + 'common/common_default_w.png',
    common_button1_plist: imageBasePath + 'common/common_button1.plist',
    common_button1_png: imageBasePath + 'common/common_button1.png',
    common_paomadeng_png: imageBasePath + 'common/common_paomadeng.png',
    common_test_icon_png: imageBasePath + 'common/common_test_icon.png',
    common_touxiangkuang_png:
      imageBasePath + 'common/common_touxiangkuang1.png',
    common_flatlabel_tmbg: imageBasePath + 'common/common_img_pzbg.png',
    //登录;
    login_plist: imageBasePath + 'login/login.plist',
    login_png: imageBasePath + 'login/login.png',
    login_logo_png: imageBasePath + 'login/login_logo.png',
    login_dibg_png: imageBasePath + 'login/login_dibg.png',
    login_di_info_png: imageBasePath + 'login/login_diinfo.png',
    //大厅;
    lobby_background_png: imageBasePath + 'lobby/lobby_background.png',
    lobby_background_di_png: imageBasePath + 'lobby/lobby_background_di.png',
    lobby1_plist: imageBasePath + 'lobby/lobby1.plist',
    lobby1_png: imageBasePath + 'lobby/lobby1.png',
    lobby2_plist: imageBasePath + 'lobby/lobby2.plist',
    lobby2_png: imageBasePath + 'lobby/lobby2.png',
    //茶楼;
    club_background1_jpg: imageBasePath + 'club/club_img_bg_1.jpg',
    club_background2_jpg: imageBasePath + 'club/club_img_bg_2.jpg',
    club_background3_jpg: imageBasePath + 'club/club_img_bg_3.jpg',
    club_background4_jpg: imageBasePath + 'club/club_img_bg_4.jpg',
    club_background5_jpg: imageBasePath + 'club/club_img_bg_5.jpg',
    club_background6_jpg: imageBasePath + 'club/club_img_bg_6.jpg',
    club_background7_jpg: imageBasePath + 'club/club_img_bg_7.jpg',
    club_background8_jpg: imageBasePath + 'club/club_img_bg_8.jpg',
    club1_plist: imageBasePath + 'club/club.plist',
    club1_png: imageBasePath + 'club/club.png',
    //公用-游戏;
  },
  game: {},
  popLayer: {
    popup_plist: imageBasePath + 'popup/popup.plist',
    popup_png: imageBasePath + 'popup/popup.png',
    popup_title_plist: imageBasePath + 'popup/popup_title.plist',
    popup_title_png: imageBasePath + 'popup/popup_title.png',
    popup_login_plist: imageBasePath + 'popup/popup_login.plist',
    popup_login_png: imageBasePath + 'popup/popup_login.png',
    popup_kefu_plist: imageBasePath + 'popup/popup_kefu.plist',
    popup_kefu_png: imageBasePath + 'popup/popup_kefu.png',
    popup_notice_msg1_jpg:
      imageBasePath + 'popup/popup_notice_bangdingshouji.jpg',
    popup_notice_msg2_jpg:
      imageBasePath + 'popup/popup_notice_waiguaxuanshang.jpg',
    popup_notice_msg3_jpg:
      imageBasePath + 'popup/popup_notice_zhengzhongshenming.jpg',
    popup_notice_plist: imageBasePath + 'popup/popup_notice.plist',
    popup_notice_png: imageBasePath + 'popup/popup_notice.png',
    popup_setting_plist: imageBasePath + 'popup/popup_setting.plist',
    popup_setting_png: imageBasePath + 'popup/popup_setting.png',
    popup_input_plist: imageBasePath + 'popup/popup_input.plist',
    popup_input_png: imageBasePath + 'popup/popup_input.png',
    popup_share_plist: imageBasePath + 'popup/popup_share.plist',
    popup_share_png: imageBasePath + 'popup/popup_share.png',
    popup_wanfa_plist: imageBasePath + 'popup/popup_wanfa.plist',
    popup_wanfa_png: imageBasePath + 'popup/popup_wanfa.png',
    popup_user_info_plist: imageBasePath + 'popup/popup_userinfo.plist',
    popup_user_info_png: imageBasePath + 'popup/popup_userinfo.png',
    popup_record_background_jpg: imageBasePath + 'popup/popup_record_bg1.jpg',
    popup_record_plist: imageBasePath + 'popup/popup_record.plist',
    popup_record_png: imageBasePath + 'popup/popup_record.png',
    popup_create_background_png: imageBasePath + 'popup/popup_create_bg1.png',
    popup_create_plist: imageBasePath + 'popup/popup_create.plist',
    popup_create_png: imageBasePath + 'popup/popup_create.png',
  },
  //todo 放入不预加载的特效
  texiao: {},
  //todo 其他需要使用  也可自定义通过功能命名
  othersRes: {},
};

pushArmaturesDirect('texiao', 'bjdqp_denglu', 0, 'res/bjdani/login/');
pushArmaturesDirect(
  'texiao',
  'chuangjianjiaru',
  0,
  'res/bjdani/chuangjianjiaru/'
);
pushArmaturesDirect('texiao', 'qinyouquan', 0, 'res/bjdani/qinyouquan/');
pushArmaturesDirect('texiao', 'dyjzcr', 0, 'res/bjdani/dyjzcr/');
pushArmaturesDirect('texiao', 'dt_logo', 0, 'res/bjdani/dt_logo/');
pushArmaturesDirect('texiao', 'xilieanniu', 0, 'res/bjdani/xilieanniu/');
pushArmaturesDirect('texiao', 'kuaisuzuju', 0, 'res/bjdani/kuaisuzuju/');
pushArmaturesDirect('texiao', 'baijindao_mjq_touzi', 0, 'res/bjdani/saiziani/');
pushArmaturesDirect(
  'texiao',
  'shengjichenggong',
  0,
  'res/bjdani/shengjichenggong/'
);

function pushArmaturesDirect(tx, name, pngMax, dir) {
  //pngMax默认为0，大于0的都要传值
  if (pngMax >= 3) {
    cc.log('---------------------', name);
  }
  pngMax = parseInt('' + pngMax);
  var resDir = imageRes[tx];
  resDir[name + 'Json'] = dir + name + '.ExportJson';
  resDir[name + 'Png'] = [];
  resDir[name + 'Plist'] = [];
  for (var i = 0; i <= pngMax; ++i) {
    resDir[name + 'Png'].push(dir + name + i + '.png');
    resDir[name + 'Plist'].push(dir + name + i + '.plist');
  }
}

for (var i in imageRes) {
  for (var j in imageRes[i]) {
    images[j] = imageRes[i][j];
  }
}
g_startLoads = []; //在热更脚本文件中，网页端预加载

var otherRes = [
  'res/font/bjdmj/shuzi2-export.fnt',
  'res/font/bjdmj/shuzi1-export.fnt',
];

//另预加载其他格式的字符串资源路径
function otherLoads() {
  for (var i = 0; i < otherRes.length; i++) {
    cc.log('resLoader: ' + otherRes[i]);
    g_startLoads.push(otherRes[i]);
  }
}

function loadStartLoads() {
  var startLoads = [];
  for (var i in arguments) {
    resLoader(arguments[i], startLoads);
  }
  cc.log('finish load info all.');
  return startLoads;
}

function resLoader(res, loads) {
  if (!res) {
    return;
  }
  if (cc.isArray(res)) {
    for (var i in res) {
      resLoader(res[i], loads);
    }
  } else if (cc.isObject(res)) {
    for (var i in res) {
      resLoader(res[i], loads);
    }
  } else if (cc.isString(res)) {
    cc.log('resLoader: ' + res);
    loads.push(res);
  } else {
    cc.log('res log error');
  }
  return;
}
