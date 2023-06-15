class ElementCreateBox {
  constructor(selector, options) {
    if(typeof selector === 'string' && selector !== undefined) {
      if(selector.substring(0,1) === '.') {
        this.selector = document.querySelector(selector);
      } else {
        this.selector = document.querySelector(`.${selector}`);
      }
    } else {
      throw new Error('Некорректный ввод селектора');
    }

    this.options = options ?? { dots: false, animation: false, buttons: true };
    this.initSlider();
  }

  get getWidthSlideItem() {
    let slideItem = this.selector.querySelector('.slider__item');
    let slideItemWidth = slideItem.clientWidth + (slideItem.clientLeft * 2);
    return slideItemWidth;
  }

  get getSelector() {
    return this.selector;
  } 

  get gapWidth() {
    return this.options.gap;
  }

  get getActiveSlide() {
    const allSlide = this.selector.querySelectorAll('.slider__item');
    const array = Array.from(allSlide);
    
    let result = null;

    array.forEach((item, index) => {
      if (item.classList.contains('active')) {
        result = index;
      }
    })

    return result

  }

  isHasDots() {
    if (typeof this.options.dots === 'boolean') {
      return this.options.dots;
    }
  }

  isHasAnimation() {
    if (typeof this.options.animation === 'boolean') {
      return this.options.animation;
    }
  }

  onDotsClick() {
    const dots = this.selector.querySelectorAll('.slider-dots-btn');
    const buttons = this.selector.querySelectorAll('.slider-btn');
    const sliderItemsLength = this.selector.querySelectorAll('.slider__item').length;
     
    if (dots !== null) {
      dots.forEach(dot => {
        dot.addEventListener('click', e => {
          e.preventDefault();
          let currentIndex = Number(e.target.dataset.index) - 1;
          console.log(currentIndex)
          this.selectSlideItem(currentIndex);
        })
      })
    }

    if (buttons !== null) {
      buttons.forEach(button => {
        button.addEventListener('click', e => {
          e.preventDefault();

          const target = e.target;
          let lastSlide = this.getActiveSlide
          let currentSlide = null; 

          
          if (target.classList.contains('slider__next-btn')) {
            currentSlide = lastSlide + 1;

          } else {
            currentSlide = lastSlide - 1;
          }

          if (currentSlide === sliderItemsLength) {
            currentSlide = 0;
          }

          if (currentSlide < 0) {
            currentSlide = sliderItemsLength - 1;
          }

          this.removeActiveSlide(lastSlide);
          this.addActiveSlide(currentSlide);
          this.selectSlideItem(currentSlide);

        })
      })
    }
  }
  
  addActiveSlide(index) {
    const allSlides = this.selector.querySelectorAll('.slider__item');
    allSlides[index].classList.add('active');
  }

  removeActiveSlide(index) {
    const allSlides = this.selector.querySelectorAll('.slider__item');
    allSlides[index].classList.remove('active');
  }

  createStylesInnerElements() {
    let selectors = Array.from(this.selector.querySelectorAll('div'));
    const sliderLineBox = document.createElement('div');

    selectors[0].classList.add('active');

    sliderLineBox.classList.add('slider-line-box');
    this.selector.classList.add('slider');
    this.selector.appendChild(sliderLineBox);

    if (selectors !== null && selectors !== undefined) {
      selectors.forEach((selectorItem, indexSelectorItem) => {
        selectorItem.classList.add('slider__item');
        selectorItem.setAttribute('data-index', indexSelectorItem);
        sliderLineBox.appendChild(selectorItem);
      });
      
    }
    

    if (this.isHasDots()) {
      let selectorsLength = selectors.length;
      const dotsBox = document.createElement('div');
      dotsBox.classList.add('slider__dots-box');
      for (let i = 0; i < selectorsLength; i++) {
        dotsBox.insertAdjacentHTML('beforeend', `<button class="slider-dots-btn" data-index="${i+1}">${i + 1}</button>`);
      }
      
      this.selector.appendChild(dotsBox);
      
    }

    if (this.options.buttons !== undefined && this.options.buttons !== null && this.options.buttons) {
      this.createButtons();
    }

    if (this.options.gap !== undefined) {
      sliderLineBox.style.gap = `${this.options.gap}px`;
    }

    if (this.options.animaitonDuration !== undefined) {
      sliderLineBox.style.transition = `transform ${this.options.animaitonDuration / 1000}s ease`;
    }

  }

  createButtons() {
    const prevBtn = document.createElement('button');
    const nextBtn = document.createElement('button');

    prevBtn.classList.add('slider-btn', 'slider__prev-btn');
    nextBtn.classList.add('slider-btn', 'slider__next-btn');

    prevBtn.textContent = 'prev';
    nextBtn.textContent = 'next';

    this.selector.insertAdjacentElement('beforeend', prevBtn);
    this.selector.insertAdjacentElement('beforeend', nextBtn);
  }

  selectSlideItem(dotIndex) {
    let sliderLineBox = this.selector.querySelector('.slider-line-box');
    sliderLineBox.style.transform = `translateX(${(-dotIndex * this.getWidthSlideItem) - ((this.gapWidth ?? 0) * dotIndex)}px)`;
  }

  setSlideInterval(func, ms) {
    const interval = setInterval(func, ms);
  }

  autoPlaySelect() {
    let sliderItems = this.selector.querySelectorAll('.slider__item').length;
    let sliderCount = 0;
    const sliderLineBox = this.selector.querySelector('.slider-line-box');
    
    if (this.options.autoPlay !== undefined && typeof this.options.autoPlay === 'boolean' && this.options.autoPlay === true) {
      this.setSlideInterval(() => {
        sliderCount++;
        if (sliderCount >= sliderItems) {
          sliderCount = 0;
        }
        this.selectSlideItem(sliderCount);
      }, this.options.autoPlayTime ?? 1000);
    } 
  }

  initSlider() {
    this.createStylesInnerElements();
    this.onDotsClick();
    this.autoPlaySelect();
  }

  /* 
    options:
    dots: true включение выключение dots
    buttons: true/false включение выключение кнопок
    animation: true/false включение выключение анимации
    animationDuration: ms время выполняемой анимации
    autoPlay: boolean
    autoPlayTime: ms
    gap: number отступы между слайдами
  */
}

const element = new ElementCreateBox('box', {
  dots: true,
  gap: 60,
  animaitonDuration: 500,
  autoPlay: true,
  autoPlayTime: 3000,
  buttons: true
});

