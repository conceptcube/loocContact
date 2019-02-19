import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CSlidesComponent } from '../../components/c-slides/c-slides';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'calendar', 
  segment: 'calendar' 
})
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  @ViewChild('mainNavSlides') mainNavSlides: CSlidesComponent;
  @ViewChild('mainNavDotSlides') mainNavDotSlides: CSlidesComponent;
  @ViewChild('subNavSlides') subNavSlides: CSlidesComponent;
  @ViewChild('subNavDotSlides') subNavDotSlides: CSlidesComponent;
 

  activeIndex:number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private statuasbar : StatusBar
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
  }
  mainNavChaingeStart(ev) {
    //console.log(ev.realIndex);
    this.activeIndexSet(ev.realIndex);
    setTimeout(() => {
    this.mainNavDotSlides.swiper.slideTo(ev.realIndex, 300, false)
    },80);
  }
  mainNavDotChaingeStart(ev) {
    this.activeIndexSet(ev.realIndex);
    setTimeout(() => {
    this.mainNavSlides.swiper.slideTo(ev.realIndex, 300, false)
    },80);
  }
  subNavChaingeStart(ev) {
    setTimeout(() => {
    this.subNavDotSlides.swiper.slideTo(ev.realIndex, 300, false)
    },80);
  }
  subNavDotChaingeStart(ev) {
    setTimeout(() => {
      this.subNavSlides.swiper.slideTo(ev.realIndex, 300, false)
      },80);
  }

  activeIndexSet(num){
    this.activeIndex = num;
    this.statuasbar.backgroundColorByHexString(this.activeIndexColorHex());
  }

  activeIndexColor(){
    switch(this.activeIndex){
      case 0:
      return 'primary';
      case 1:
      return 'secondary';
      case 2:
      return 'third';
      case 3:
      return 'fourth';
      case 4:
      return 'fifth';
      case 5:
      return 'sixth';
      case 6:
      return 'seven';
      case 7:
      return 'eight';
    }
  }
  activeIndexColorHex(){
    switch(this.activeIndex){
      case 0:
      return '#2c3271';
      case 1:
      return '#80afc1';
      case 2:
      return '#df968d';
      case 3:
      return '#ed8a58';
      case 4:
      return '#ea3468';
      case 5:
      return '#4090ea';
      case 6:
      return '#2c3271';
      case 7:
      return '#80afc1';
    }
  }
}