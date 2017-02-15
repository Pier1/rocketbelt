(function () {
  'use strict';
  var galleryMain =
    new Swiper('#gallery-with-thumbs',
      {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        observer: true,
        observeParents: true
      }
    )
  ;

  galleryMain.on('onTransitionStart', function (g) {
    // Add skeleton screen if the image isn't already loaded
    if (g.slides[g.activeIndex].classList.contains('swiper-lazy-loading')) {
      g.slides[g.activeIndex].classList.add('lazyload-loading');
    }
  });

  galleryMain.on('onLazyImageReady', function (g) {
    // Remove skeleton screen when image has loaded
    g.slides[g.activeIndex].classList.remove('lazyload-loading');
  });

  var galleryThumbs =
    new Swiper('.gallery-thumbs',
      {
        preloadImages: true,
        lazyLoading: false,
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        freeMode: true,
        observer: true,
        observeParents: true
      }
    )
  ;

  galleryThumbs.slides[0].classList.add('swiper-slide-selected');
  galleryMain.params.control = galleryThumbs;

  galleryThumbs.on('onTap', function (g) {
    if (g.clickedIndex !== undefined && g.previousIndex !== g.clickedIndex) {
      var len = g.slides.length;
      for (var i = 0; i < len; i++) {
        g.slides[i].classList.remove('swiper-slide-selected');
      }

      g.slides[g.clickedIndex].classList.add('swiper-slide-selected');
      galleryMain.slideTo(g.clickedIndex);
    }
  });

  galleryThumbs.on('onSlideChangeStart', function (g) {
    if (galleryMain.activeIndex !== g.activeIndex) {
      galleryMain.slideTo(g.clickedIndex);
    }
  });

  galleryMain.on('onSlideChangeEnd', function (g) {
    var len = galleryThumbs.slides.length;
    for (var i = 0; i < len; i++) {
      galleryThumbs.slides[i].classList.remove('swiper-slide-selected');
    }

    galleryThumbs.slides[g.activeIndex].classList.add('swiper-slide-selected');
  });
})();
