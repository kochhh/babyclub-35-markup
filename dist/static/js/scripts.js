(function () {
  'use strict';

  function curved() {
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var closingTitleOne = new CircleType(document.querySelector('.closing-title > div:nth-of-type(1)'));
    var closingTitleTwo = new CircleType(document.querySelector('.closing-title > div:nth-of-type(2)'));
    var sliderTitle = new CircleType(document.querySelector('.slider-title'));

    if (windowWidth < 768) {
      closingTitleOne.radius(750);
      closingTitleTwo.radius(750);
      sliderTitle.radius(600);
      return;
    }

    closingTitleOne.radius(1500);
    closingTitleTwo.radius(1500);
    sliderTitle.radius(1120);
  }

  function slider() {
    var booksSlider = new Swiper('.swiper-container', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      preloadImages: false,
      lazy: true,
      slidesPerView: 4,
      breakpoints: {
        1099: {
          slidesPerView: 3
        },
        767: {
          slidesPerView: 2
        },
        575: {
          slidesPerView: 1
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    curved();
    slider();
  });

}());
