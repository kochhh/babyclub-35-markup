export default function slider() {
  const booksSlider = new Swiper('.swiper-container', {
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
  })
}