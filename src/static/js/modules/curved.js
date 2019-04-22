export default function curved() {
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  const closingTitleOne = new CircleType(document.querySelector('.closing-title > div:nth-of-type(1)'))
  const closingTitleTwo = new CircleType(document.querySelector('.closing-title > div:nth-of-type(2)'))
  const sliderTitle = new CircleType(document.querySelector('.slider-title'))

  if (windowWidth < 768) {
    closingTitleOne.radius(750)
    closingTitleTwo.radius(750)
    sliderTitle.radius(600)
    return
  }

  closingTitleOne.radius(1500)
  closingTitleTwo.radius(1500)
  sliderTitle.radius(1120)
}