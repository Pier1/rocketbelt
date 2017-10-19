(function () {
  var fn = function () {
    var els = document.getElementsByClassName('inline-with-button');
    var len = els.length;

    for (var i = 0; i < len; i++) {
      var el = els[i];
      el.addEventListener('focusin', function (e) {
        e.target.parentElement.classList.add('focused');
      });

      el.addEventListener('focusout', function (e) {
        e.target.parentElement.classList.remove('focused');
      });
    }
  };

  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
})();
