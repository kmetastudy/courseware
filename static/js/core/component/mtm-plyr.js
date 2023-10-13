// import {mtvEvents} from '../../core/utils/mtv-events.js';
import { mtoEvents } from "../../core/utils/mto-events.js";
// plyr 을 이용한 LMS example
// https://stove99.github.io/javascript/2019/04/16/plyr-lms-example/

//
export var mtmPlyr = function (options) {
  this.id = "id-mtm-plyr-" + mtmPlyr.id++;
  this.options = options;

  this.elThis = null;
  this.player = null;
  this.autoplay = 1;
  this.stopped = true;

  this._init();
};

mtmPlyr.id = 0;

// https://www.youtube.com/embed/gLVMAbcuRg8?
// autoplay=0&
// controls=0&
// disablekb=1&
// playsinline=1&
// cc_load_policy=0&
// cc_lang_pref=auto&
// widget_referrer= http%3A%2F%2Flocalhost%3A8000%2Fst%2F
// widget_referrer=location.pathname&
// rel=0&
// showinfo=0&
// iv_load_policy=3&
// modestbranding=1&
// customControls=true&
// noCookie=false&
// enablejsapi=1&
// origin=http%3A%2F%2Flocalhost%3A8000
// &widgetid=5
mtmPlyr.prototype._getSrc = function () {
  console.log("mtmPlyr > getSrc :", location.protocol + "//" + location.host);
  var src =
    "https://www.youtube.com/embed/" +
    this.videoId +
    "?" +
    "autoplay=" +
    this.autoplay +
    "&" +
    "controls=0&" + // ok
    "disablekb=1&" + // ok
    "playsinline=1&" + // ok
    "cc_load_policy=1&" + // ?
    // + "cc_lang_pref=auto&"  //  ?
    // + "widget_referrer=" + location.pathname + "&"  // ?
    "rel=0&" + // ok
    "showinfo=0&" + // ok
    "iv_load_policy=3&" + // ok
    "modestbranding=1&" + // ok
    "customControls=true&" + // ?
    // + "noCookie=false&"     // ?
    "enablejsapi=1&" + // ok
    "origin=" +
    location.protocol +
    "//" +
    location.host; // + "&"
  // + "widgetid=5"          // ?

  // +"rel=0"
  // // +"&origin=http://localhost:8800"
  // +"&origin="+location.protocol+"//"+location.host
  // +"&enablejsapi=1&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"

  // +"&controls=" + this.controls
  // +"&disablekb=" + this.diablekb
  return src;
};

// We recommend progressive enhancement with the embedded players.
// <div class="plyr__video-embed" id="player">
//   <iframe
//     src="https://www.youtube.com/embed/bTqVqk7FSmY?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
//     allowfullscreen
//     allowtransparency
//     allow="autoplay"
//   ></iframe>
// </div>

// Or the <div> non progressively enhanced method:
// <div id="player" data-plyr-provider="youtube" data-plyr-embed-id="bTqVqk7FSmY"></div>
mtmPlyr.prototype._initProgressive = function () {
  // this.elThis.classList.add('plyr__video-embed');

  // this.elIFrame = document.createElement('iframe');
  this.elPlayer = document.createElement("video");
  // this.elPlayer.setAttribute('class')
  this.elPlayer.setAttribute("id", this.id);
  this.elThis.appendChild(this.elPlayer);

  this.elSource = document.createElement("source");
  // this.elSource.setAttribute('source');
  this.elPlayer.appendChild(this.elSource);

  // var src = this._getSrc();
  // this.elIFrame.setAttribute('src',src);
  //     // 'https://www.youtube.com/embed/bTqVqk7FSmY?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1');

  // // this.elIFrame.setAttribute('allowfullscreen','');
  // // this.elIFrame.setAttribute('allowtransparency','');
  // this.elThis.setAttribute('allowfullscreen',true);
  // this.elIFrame.setAttribute('allow','autoplay');
  // this.elThis.appendChild(this.elIFrame);

  // console.log('_initProgress : ', this.elIFrame);
};

mtmPlyr.prototype._initNonProgressive = function () {};

mtmPlyr.prototype._initVariables = function () {
  // Basic
  this.videoId = null;
  if (this.options && this.options.videoId) this.videoId = this.options.videoId;

  this.bAutoPlay = false;
  if (this.options && this.options.bAutoPlay) this.bAutoPlay = this.options.bAutoPlay;

  // TimeShift
  this.startTime = 0;
  if (this.options && this.options.startTime) this.startTime = this.options.startTime;

  this.endTime = 0;
  if (this.options && this.options.endTime) this.endTime = this.options.endTime;

  this.forward = true;
  if (this.options && this.options.forward) this.forward = this.options.forward;

  this.forwardTime = 0;
  if (this.options && this.options.forwardTime) this.forwardTime = this.options.forwardTime;
};

mtmPlyr.prototype._initEvents = function () {
  // mtoEvents.on('OnBeforeSwitchScreen',this.onBeforeSwitchScreenHandler.bind(this));
  // mtoEvents.on('OnAfterSwitchScreen',this.onAfterSwitchScreenHandler.bind(this));
};

mtmPlyr.prototype._init = function () {
  console.log("mtmPlyr > _init");

  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtm-plyr");
  // this.elThis.setAttribute('id' ,this.id);

  this._initVariables();
  if (!this.videoId) this.videoId = "bTqVqk7FSmY";
  this._initProgressive();

  console.log("mtmPlyr _init:");
  // 가장 어려운게...
  // 화면의 사이즈가 바꿔서 , player 가 panel 의 위치를 바꿀때,
  // play 중에 바뀌면 계속 play 되게
  // pause 중에 바뀌면 계속 pause 되게
  // stop 중에 바뀌면 계속 stop 되게 ....
  // 이게 되는데는 autoplay 가 중요하고, 이는 youtube 의 iframe 에 적용되는
  // autoplay=1 혹은 autoplay=0 의 설정이 매우 중요하다.
  this.player = new Plyr(
    // '#'+this.id,
    this.elPlayer,
    {
      // timeShift 를 enable
      timeShift: {
        enable: true,
        startTime: this.startTime,
        endTime: this.endTime,
        forward: this.forward,
        forwardTime: this.forwardTime,
      },
      // custom duration 을 하면 progress bar 를 custom 가능
      // duration : 10,
      debug: true,
      // 이놈의 autoplay 땜에 .... 화면 스위치시 백그라운드에서
      // 재생이 되었다.
      autoplay: false,
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "fullscreen",
      ],
      settings: ["caption", "quality", "speed"],
      quality: { default: 576, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240] },
      invertTime: false,
      keyboard: {
        focused: false,
        global: false,
      },
      listeners: {
        // 리스너로 seek 안되게 처리할려면 요렇게
        // seek: this.onSeek.bind(this),
        // function customSeekBehavior(e) {
        //     //e.preventDefault();
        //     //alert('변경 불가능');
        //     //return false;
        // }
      },
    },
  );

  this.player.on("timeupdate", this.onTimeUpdate.bind(this));

  this.player.on(
    "ended",
    // (e) => {
    //     // console.log(e.detail.plyr);
    //     console.log('mtmPlyr > video ended');
    //     // this.player.currentTime = this.startTime;
    //     // this.player.pause();
    //     // alert('비디오 재생이 끝났음');
    // }
    this.onEnd.bind(this),
  );

  this.player.on("ready", this.onReady.bind(this));

  // document.getElementById('go_btn').addEventListener('click', function(e) {
  //     player.pause();
  //     player.currentTime = 60*3 + 55;
  //     player.play();
  // });
  if (!this.videoId || !this.bAutoPlay) this.show(false);

  this._initEvents();
};

mtmPlyr.prototype._switchScreenVideo = function () {
  if (this.stopped) return;

  console.log("_switchScreenVideo");

  this.setVideoId(this.videoId);

  // this.hasSwitch = false;

  this.player.timeShift = this.hasSwitchTimeShift;
  this.player.currentTime = this.hasSwitchCurrentTime;
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Handler //////////////////////////////////
// mtmPlyr.prototype.onBeforeSwitchScreenHandler = function() {
//     console.log('mtmPlyr > onBeforeSwitchScreenHandler #1 :');
//     this.hasSwitch = false;
//     if(!this.player)
//         return;
//     if(this.stopped)
//     {
//         // this.player.autoplay = false;
//         // this.autoplay = false;
//         // var src = this._getSrc();
//         // this.elIFrame.setAttribute('src',src);

//         // // this.player.stop();

//         // this.player.stop();
//         // this.stopVideo();
//         return;
//     }

//     this.hasSwitch = true;
//     this.hasSwitchPlaying = this.player.playing;
//     this.hasSwitchStopped = this.player.stopped;
//     this.hasSwitchTimeShift = this.player.timeShift;
//     this.hasSwitchCurrentTime = this.player.currentTime;
//     console.log('mtmPlyr > onBeforeSwitchScreenHandler #2 :', this.hasSwitchPlaying,this.hasSwitchStopped ,
//         this.hasSwitchCurrentTime,this.hasSwitchTimeShift);
// }

// mtmPlyr.prototype.onAfterSwitchScreenHandler = function() {
//     console.log('mtmPlyr > onAfterSwitchScreenHandler :');

//     if(!this.player)
//         return;
//     if(!this.hasSwitch)
//         return;

//     if(this.hasSwitch && this.stopped)
//     {
//         // this.player.stop();
//         // this.stopVideo();
//         this.hasSwitch = false;
//         return;
//     }
//     // console.log('mtmPlyr > onAfterSwitchScreenHandler');
//     console.log('mtmPlyr > onAfterSwitchScreenHandler :', this.hasSwitchPlaying,
//         this.hasSwitchCurrentTime,this.hasSwitchTimeShift);

//     setTimeout(this._switchScreenVideo.bind(this),100);

//     // this.player.playing;

// }

mtmPlyr.prototype.onEnd = function (e) {
  console.log("mtmPlyr > onEnd :", e);

  if (this.options && this.options.eventVideoHandler) this.options.eventVideoHandler();
};
mtmPlyr.prototype.onTimeUpdate = function (e) {
  // console.log('mtmPlyr > onTimeUpdate :',e);
  // console.log('mtmPlyr > onTimeUpdate :' ,e.detail.plyr.currentTime + ' / ' + this.player.duration);
  // console.log('mtmPlyr > onTimeUpdate :' , this.player);
};

mtmPlyr.prototype.onSeek = function (e) {
  console.log("mtmPlyr > onSeek :", e);
  // console.log('mtmPlyr > onSeek > player :',this.player);
};

mtmPlyr.prototype.onReady = function (e) {
  // console.log('mtmPlyr > onReady :',e);
  // console.log('mtmPlyr > onReady > player :',this.player.duration);
  // this.player.duration = 10;

  // this.elIFrame.setAttribute('allow','');
  if (this.stopped) {
    console.log("mtmPlyr.>.onReady : but stopped");
    this.player.stop();
    return;
  }
  this.player.currentTime = this.startTime;
  var self = this;
  if (this.player.isIos);
  else
    setTimeout(function () {
      // Todo. 이것을 자동으로 Play 하기 위해서 어떻게 ....
      // Todo. ....
      self.player.play();
    }, 0);
  // this.player.play();
  this.stopped = false;
  this.player.muted = false;
  return;

  if (this.bAutoPlay && this.videoId) {
    if (this.hasSwitch && !this.stopped) {
      console.log("onready #1");
      this.hasSwitch = false;
      this.player.timeShift = this.hasSwitchTimeShift;
      // this.player.currentTime = this.hasSwitchCurrentTime;
      this.player.currentTime = this.hasSwitchCurrentTime;

      if (this.hasSwitchPlaying) {
        console.log("onready #2");

        this.player.play();
        this.stopped = false;
        this.player.muted = false;
      } else if (!this.hasSwitchStopped) {
        console.log("onready #3");

        // this.player.restart();
        this.player.paused = false;
        // this.player.pause();
        this.player.forward(this.hasSwitchCurrentTime);
        // this.player.play();
        this.player.muted = false;
        setTimeout(() => {
          this.player.pause();
          // this.player.muted = false;
        }, 100);
      }
    } else if (!this.stopped) {
      console.log("onready #4");

      console.log("mtmPlyr > onReady : play ", this.videoId);
      this.player.currentTime = this.startTime;
      var self = this;
      if (this.player.isIos);
      else
        setTimeout(function () {
          // Todo. 이것을 자동으로 Play 하기 위해서 어떻게 ....
          // Todo. ....
          self.player.play();
        }, 500);
      // this.player.play();
      this.stopped = false;
      this.player.muted = false;
    } else {
      console.log("onready #5");

      this.player.stop();
      this.stopped = true;
      this.player.muted = true;
    }

    console.log("onready #6");
  }
  console.log("onready #7");
};

///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// API ////////////////////////////////////
mtmPlyr.prototype.setTimeShift = function (timeShift) {
  if (!timeShift) return;
  // if(timeShift.enable)
  this.player.config.timeShift = timeShift;
};

mtmPlyr.prototype.show = function (bShow) {
  this.show = bShow;
  if (bShow) this.elThis.style.display = "";
  else this.elThis.style.display = "none";
};

mtmPlyr.prototype.play = function () {
  this.player.play();
  this.stopped = false;
};

mtmPlyr.prototype.pause = function () {
  this.player.pause();
};

mtmPlyr.prototype.stop = function () {
  this.player.stop();
  this.stopped = true;
};

mtmPlyr.prototype.setOptions = function (options) {};

mtmPlyr.prototype.setVideoId = function (videoId) {
  this.videoId = videoId;
  // if(!this.player)
  // {
  //     var source = {
  //         type: 'video',
  //         sources: [
  //           {
  //             src: videoId,
  //             provider: 'youtube',
  //           },
  //         ],
  //     };

  //     this._initProgressive(source);
  // }
  // console.log('mtmPlyr > setVideoId : ',this.videoId);

  // this.player.stop();
  // this.stopped = true;
  // this.autoplay = 1;
  // var src = this._getSrc();
  // this.elIFrame.setAttribute('src',src);
  // this.elThis.children[1].children[0].setAttribute('src',src);
  // console.log('mtmPlyr > stopVideo : ',src);
  // console.log('mtmPlyr > stopVideo : ', this.elThis.children[1].children[0]);
  // var self = this;
  // this.stopped = false;
  // this.player.play();

  this.player.source = {
    type: "video",
    sources: [
      {
        src: videoId,
        provider: "youtube",
      },
    ],
  };

  // this.player.play();
};

mtmPlyr.prototype.setVideoTime = function (startTime, endTime) {
  this.startTime = startTime;
  this.endTime = endTime;
  var timeShift = { startTime: startTime, endTime: endTime, forward: true, forwardTime: 0 };
  // this.player.config.timeShift.startTime = this.startTime;
  // this.player.config.timeShift.endTime = this.startTime;
  this.player.timeShift = timeShift;
  console.log("mtmPlyr > setVideoTime : ", this.player.config);
};

mtmPlyr.prototype.playVideo = function () {
  // this.player.autoplay = true;
  this.player.play();
  this.stopped = false;
};

mtmPlyr.prototype.stopVideo = function () {
  console.log("mtmPlyr > stopVideo");

  // 이렇게 해야.... autoplay -> 0 , setAttribute 'src' , and then stop()
  // 아니다.
  this.player.stop();
  this.autoplay = 0;

  // 이게 뭐지??? --> 이걸 하니까 video 가 완전 stop 되네...
  // Todo. 이걸 좀더 우아하게 하는 방법이 없을까?
  // var src = this._getSrc();
  // this.elThis.children[0].children[1].children[0].setAttribute('src',src);
  this.stopped = true;
};

// autoplay : false
// buffered : 1
// currentTime : 52.644755
// currentTrack : -1
// download : "https://www.youtube.com/watch?t=52&v=bTqVqk7FSmY"
// duration : 184
// ended : false
// hasAudio : true
// isAudio : false
// isEmbed : true
// isHTML5 : false
// isVideo : true
// isVimeo : false
// isYouTube : true
// language : undefined
// loop : false
// maximumSpeed : 2
// minimumSpeed : 0.5
// muted : false
// paused : true
// pip : false
// playing : false
// poster : "https://i.ytimg.com/vi/bTqVqk7FSmY/maxresdefault.jpg"
// quality : undefined
// ratio : "16:9"
// seeking : false
// source : "https://www.youtube.com/watch?t=52&v=bTqVqk7FSmY"
// speed : 1
// stopped : false
// volume : 0.5
