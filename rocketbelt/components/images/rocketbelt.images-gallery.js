(function () {
  'use strict';

  $(document).ready(function(){
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.4.0/js/swiper.jquery.js',
      function () {
        var galleryTop =
          new Swiper('.gallery-main',
            {
              nextButton: '.swiper-button-next',
              prevButton: '.swiper-button-prev',
              observer: true,
              observeParents: true
            }
          )
        ;

        var galleryThumbs =
          new Swiper('.gallery-thumbs',
            {
              spaceBetween: 10,
              centeredSlides: true,
              slidesPerView: 'auto',
              slideToClickedSlide: true,
              freeMode: true,
              freeModeMomentumRatio: 0.6,
              freeModeMomentumVelocityRatio: 0.8,
              observer: true,
              observeParents: true
            }
          )
        ;

        galleryTop.params.control = galleryThumbs;
        galleryThumbs.slides[0].classList.add('swiper-slide-selected');

        galleryThumbs.on('onTap', function (e) {
          if (e.clickedIndex !== undefined && e.previousIndex !== e.clickedIndex) {
            var len = e.slides.length;
            for (var i = 0; i < len; i++) {
              e.slides[i].classList.remove('swiper-slide-selected');
            }

            e.slides[e.clickedIndex].classList.add('swiper-slide-selected');
            galleryTop.slideTo(e.clickedIndex);
          }
        });

        galleryThumbs.on('onSlideChangeStart', function (e) {
          if (galleryTop.activeIndex !== e.activeIndex) {
            galleryTop.slideTo(e.clickedIndex);
          }
        });

        galleryTop.on('onSlideChangeEnd', function (e) {
          var len = galleryThumbs.slides.length;
          for (var i = 0; i < len; i++) {
            galleryThumbs.slides[i].classList.remove('swiper-slide-selected');
          }

          galleryThumbs.slides[e.activeIndex].classList.add('swiper-slide-selected');
        });
      }
    );
  });
})();
