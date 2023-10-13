// TODO
// 아래 파일이 없다.
// require('./mto-confirm-popup.css');

// sweetalert version #1 로 만드는 popup
// sweetalert version #1 을 customizing 하기
export var mtoConfirmPopup = {
  show: function (options) {
    swal({
      title: options.title,
      text: options.text,
      icon: options.icon,
      closeOnClickOutside: options.closeOnClickOutside,
      buttons: options.buttons,
    }).then(function (result) {
      if (result) {
        if (options.callback && options.callback.confirm) options.callback.confirm();
      } else {
        if (options.callback && options.callback.cancel) options.callback.cancel();
      }
    });
  },
};
