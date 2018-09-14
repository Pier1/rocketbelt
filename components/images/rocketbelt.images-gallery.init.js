(function () {
  'use strict';
  var galleryDefault =
    new Swiper('#gallery-main',
      {
        nextButton: '#gallery-main .swiper-button-next',
        prevButton: '#gallery-main .swiper-button-prev',
        pagination: '#gallery-main .swiper-pagination',
        slidesPerView: 1,
        lazyLoading: true,
        keyboardControl: true,
        observer: true,
        observeParents: true
      }
    )
  ;
})();
