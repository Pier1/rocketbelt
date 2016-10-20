(function () {
  $(document).ready(function(){
    $(document).on('ready', function() {
      $('.regular').slick({
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
      });

      $('#gallery1_main-image').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: false,
        asNavFor: '#gallery1_thumbs'
      });

      $('#gallery1_thumbs').slick({
        arrows: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '#gallery1_main-image',
        dots: false,
        centerMode: false,
        focusOnSelect: true,
        swipeToSlide: true
      });

      // $('.center').slick({
      //   dots: true,
      //   infinite: true,
      //   centerMode: true,
      //   slidesToShow: 3,
      //   slidesToScroll: 3
      // });
      // $('.variable').slick({
      //   dots: true,
      //   infinite: true,
      //   variableWidth: true
      // });
    });
  });
})();
