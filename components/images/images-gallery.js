(function () {
  $(document).ready(function(){
    $(document).on('ready', function() {
      $('#gallery1_main-image').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        fade: false,
        infinite: false
      });
    });
  });
})();
