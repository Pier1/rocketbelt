(function () {
  'use strict';
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
        observer: true,
        observeParents: true
      }
    )
  ;

  galleryThumbs.slides[0].classList.add('swiper-slide-selected');
  galleryTop.params.control = galleryThumbs;

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
})();
