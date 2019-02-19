import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'slides',
  templateUrl: 'c-slides.html',
  host: {
    '[class.slides]': 'true'
  }
})
export class CSlidesComponent {

  @ViewChild('wrapperRef') wrapperRef;
  @ViewChild('pagerRef') pagerRef;

  @Input('pager') pager = null;
  @Input('loop') loop = null;
  @Input('autoplay') autoplay = null;
  @Input('centeredSlides') centeredSlides:any = false;
  @Input('slidesPerView') slidesPerView:any = 1;
  @Input('spaceBetween') spaceBetween = 0;

  @Output() slideChangeTransitionStart = new EventEmitter();
  @Output() slideChangeTransitionEnd = new EventEmitter();

  swiper = null;
  opts: any = {
    //observer: true, // 실시간 변경은 가능하면 지양하는 것으로 하자. 루프와 함께 쓰면 오류가 난다.
    
  }

  constructor(
    private el: ElementRef
  ) {}
  ngAfterViewInit() {
    if (this.isAttrTrue(this.pager)) {
      this.opts.pagination = {
        el: this.pagerRef.nativeElement
      }
    }

    if (this.isAttrTrue(this.loop)) {
      this.opts.loop = true
    }

    if (this.isAttrTrue(this.autoplay)) {
      this.opts.autoplay = {
        delay: this.autoplay
      }
    }

    if(this.isAttrTrue(this.slidesPerView)) {
      this.opts.slidesPerView = this.slidesPerView === 'auto' ? 'auto' : Number(this.slidesPerView);
    }

    if(this.isAttrTrue(this.centeredSlides)) {
      this.opts.centeredSlides = this.centeredSlides;
    }

    if(this.isAttrTrue(this.spaceBetween)) {
      this.opts.spaceBetween = Number(this.spaceBetween);
    }

    this.swiper = new Swiper(this.el.nativeElement.children[0], this.opts);
    if(this.loop) {
      this.swiper.on('slideChangeTransitionEnd', () => {
        const index = this.swiper.activeIndex;
        const length = this.swiper.slides.length;
        if(index == 0) {
          this.swiper.slideTo(length - 2, 0, false);
        } else if(index == length - 1) {
          this.swiper.slideTo(1, 0, false);
        }
      });
    }
    this.swiper.on('slideChangeTransitionStart',() =>{
      console.log('start');
      this.slideChangeTransitionStart.emit(this.swiper);
    });
    this.swiper.on('slideChangeTransitionEnd',() =>{
      console.log('end');
      this.slideChangeTransitionEnd.emit(this.swiper);
    });
  }

  isAttrTrue(attr) {
    if ((attr && attr !== "false") ||
      attr === '' ||
      attr === 'true' ||
      attr === true
      ) {
      return true;
    } else {
      return false;
    }
  }
}