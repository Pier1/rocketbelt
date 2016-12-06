(function () {
  'use strict';

  $(document).ready(function(){
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.4.0/js/swiper.jquery.js',
      function () {
        var galleryTop =
          new Swiper('.gallery-top',
            {
              nextButton: '.swiper-button-next',
              prevButton: '.swiper-button-prev',
              spaceBetween: 10,
              freeModeMomentum: false
            }
          )
        ;

        var galleryThumbs =
          new Swiper('.gallery-thumbs',
            {
              spaceBetween: 10,
              centeredSlides: true,
              slidesPerView: 'auto',
              touchRatio: 0.4,
              slideToClickedSlide: true,
              freeMode: true,
              freeModeMomentumRatio: 0.4,
              freeModeMomentumVelocityRatio: 1,
              freeModeMomentumBounceRatio: 1
            }
          )
        ;

        galleryTop.params.control = galleryThumbs;
        // galleryThumbs.params.control = galleryTop;

        galleryThumbs.on('onSlideChangeStart', function (e) {
          console.log('onSlideChangeStart');
          if (galleryTop.activeIndex !== e.activeIndex) {
            galleryTop.slideTo(e.clickedIndex);
          }
        });
      }
    );
  });
})();
