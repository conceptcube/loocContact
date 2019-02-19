import {
  Injectable
} from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions
} from '@angular/http';
import {
  Platform,
  ToastController,
  LoadingController,
  //App,
  AlertController,
  ModalController,
  Events,
  ActionSheetController,
  App
} from "ionic-angular";

import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';

//declare function unescape(s: string): string;
declare var navigator: any;

@Injectable()
export class ToastCtrl {
  constructor(
    private toastCtrl: ToastController
  ) {}
  present(message, duration: number = 4000) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      cssClass: 'toast-primary',
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'ok'
    });
    toast.present();
    return false;
  }
}
@Injectable()
export class AlertCtrl {
  constructor(
    private alertCtrl: AlertController,
    private events: Events
  ) {}
  create(data: any = {}) {
    history.pushState({}, '', location.href);
    let handler = [];
    let clicked_button_index = null;
    if (data.buttons) {
      if (data.buttons.length != 0) {
        for (let i = 0; i < data.buttons.length; i++) {
          handler.push(data.buttons[i].handler);
          data.buttons[i].handler = () => {
            clicked_button_index = i;
          };
        }
      }
    }
    let alert = this.alertCtrl.create(data);
    alert.onWillDismiss(() => {
      this.events.publish('app:overlayPop');
      history.back();
    });
    alert.onDidDismiss(() => {
      if (typeof handler[clicked_button_index] == 'function') {
        let inputs: any = {};
        if (data.inputs) {
          for (let i = 0; i < data.inputs.length; i++) {
            inputs[data.inputs[i].name] = data.inputs[i].value;
          }
        }
        handler[clicked_button_index](inputs);
      }
    });
    return alert;
  }
}
@Injectable()
export class ActionCtrl {
  constructor(
    private actionCtrl: ActionSheetController,
    private events: Events
  ) {

  }
  create(data: any = {}) {
    history.pushState({}, '', location.href);
    let handler = [];
    let clicked_button_index = null;
    if (data.buttons) {
      if (data.buttons.length != 0) {
        for (let i = 0; i < data.buttons.length; i++) {
          handler.push(data.buttons[i].handler);
          data.buttons[i].handler = () => {
            clicked_button_index = i;
          };
        }
      }
    }

    let action = this.actionCtrl.create(data);

    action.onWillDismiss(() => {
      this.events.publish('app:overlayPop');
      history.back();
    });
    action.onDidDismiss(() => {
      if (typeof handler[clicked_button_index] == 'function') handler[clicked_button_index]();
    });
    return action;
  }
}
@Injectable()
export class ModalCtrl {
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private events: Events
  ) {

  }
  create(page = '', data = {}, opt = {}) {
    history.pushState({}, '', location.href);
    let modal = this.modalCtrl.create(page, data, opt);
    modal.onWillDismiss(() => {
      this.events.publish('app:overlayPop');
      history.back();
    });
    return modal;
  }
  openBrowser(url) {
    if (url.indexOf('http') != -1) {
      window.open(url, '_blank', 'location=yes,toolbarcolor=#71cbd3,hideurlbar=yes');
    } else {
      this.create(url).present();
    }
  }
  loader() {
    let timeout = true;
    let loader = {
      body: this.loadingCtrl.create({
        spinner: 'hide',
        content: '<div class="custom-loader">\
                    <div class="shadow"></div>\
                    <div class="box"></div>\
                  </div>',
        duration: 300000
      }),
      present: () => {
        loader.body.present();
      },
      dismiss: () => {
        try {
          loader.body.dismiss();
        } catch (e) {

        }
        timeout = false;
      }
    }

    loader.body.onDidDismiss(() => {
      if (timeout) {
        //this.toast.present('Your internet connection is not working properly. If the problem persists, please contact administrator.');
      }
    });
    return loader;
  }
}

@Injectable()
export class ImgTrans {
  getReady: any = null;
  getError:any = null;

  constructor(
    public toastCtrl: ToastCtrl
  ) {
    
  }

  trans(img, size) {
    return img ? img.replace(/(.jpg|.png|.jpeg)/, "_" + size + "$1") : undefined;
  }
  get(srcType) {
    const sourceType = srcType == 'camera' ? 1 : 2;
    const option = {
      targetWidth: 1080,
      targetHeight: 1080,
      correctOrientation: true,
      sourceType: sourceType,
      destinationType: 0,
      //encodingType: 'JPEG'
    }
    navigator.camera.getPicture(data => {
      let blob = this.dataURItoBlob('data:image/jpeg;base64,' + data);
      this.getReady({
        blob: blob,
        url: this.createObjectURL(blob)
      });
      blob = null;
    }, () => {
      this.getError();
    }, option);
    return new Promise((resolve) => {
      this.getReady = (o) => {
        resolve(o);
      }
      this.getError = () => {
        this.toastCtrl.present('잘못된 이미지 형식입니다.(ex.gif,svg)');
        resolve();
      }
    });
  }
  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob: any = new Blob([ab], {
      type: mimeString
    });
    blob.lastModifiedDate = new Date();
    return blob;
  }
  createObjectURL(blob) {
    return (window.URL ? URL : window['webkitURL']).createObjectURL(blob);
  }
}

@Injectable()
export class Utils {
  checkEmail(str) {
    let rule = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    if (rule.test(str) === false) {
      return {
        valid: false,
        message: '유효한 이메일이 아닙니다.'
      }
    } else {
      return {
        valid: true,
        message: '유효한 이메일 입니다.'
      };
    }
  }

  checkPassword(str) {
    if (!str) {
      return {
        valid: false,
        message: '패스워드를 입력해주세요.'
      };
    } else {
      let pw: string = str;
      let num = pw.search(/[0-9]/g); // 숫자
      let eng = pw.search(/[a-z]/ig); // 영어
      //let spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi); // 특수문자

      if (pw.length < 4 || pw.length > 20) {
        return {
          valid: false,
          message: '4자리 ~ 20자리 이내로 입력해주세요.'
        };
      } else if (pw.search(/₩s/) != -1) {

        return {
          valid: false,
          message: '비밀번호는 공백없이 입력해주세요.'
        };

      } else if (num < 0 || eng < 0) {

        return {
          valid: false,
          message: '영문, 숫자를 혼합하여 입력해주세요.'
        };

      } else {
        return {
          valid: true,
          message: '유효한 비밀번호 입니다.'
        };
      }
    }
  }

  toNumber(number) {
    var str = String(number).replace(/[^0-9]/g, '');
    return str;
  }
  toPhone(number) {
    var tmp = '';
    var str = String(number).replace(/[^0-9]/g, '');
    switch (str.length) {
      case 10:
      case 9:
      case 8:
      case 7:
        tmp = str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 3);
        tmp += '-';
        tmp += str.substr(6);
        break;
      case 6:
      case 5:
      case 4:
        tmp = str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        break;
      case 3:
      case 2:
      case 1:
      case 0:
        tmp = str;
        break;
      default:
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7, 4);
        break;
    }
    return tmp;
  }
  toDate(number, sep = '-', length = 8) {
    var tmp = '';
    var str = String(number).replace(/[^0-9]/g, '');
    str = str.substring(0, length);
    switch (str.length) {
      case 8:
      case 7:
        tmp = str.substr(0, 4);
        tmp += sep;
        tmp += str.substr(4, 2);
        tmp += sep;
        tmp += str.substr(6);
        break;
      case 6:
      case 5:
        tmp = str.substr(0, 4);
        tmp += sep;
        tmp += str.substr(4);
        break;
      case 4:
      case 3:
      case 2:
      case 1:
      case 0:
        tmp = str;
        break;
      default:
        tmp += str.substr(0, 4);
        tmp += sep;
        tmp += str.substr(4, 2);
        tmp += sep;
        tmp += str.substr(7, 2);
        break;
    }
    return tmp;
  }
  toPrice(number) {
    let sNumber = String(number);
    let str = sNumber.replace(/[^0-9]/g, '');
    let price = str.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    return sNumber.startsWith('-') ? '-' + price : price;
  }
  toXX(number) {
    number = Math.floor(number);
    if (number < 10) {
      number = "0" + number;
    }
    return String(number);
  }
  today(obj: any = {
    year: 0,
    month: 0,
    date: 0
  }) {
    let date = new Date();
    if (obj.year) {
      date.setFullYear(date.getFullYear() + obj.year);
    }
    if (obj.month) {
      date.setMonth(date.getMonth() + obj.month);
    }
    if (obj.date) {
      date.setDate(date.getDate() + obj.date);
    }
    return date.getFullYear() + '-' + this.toXX(date.getMonth() + 1) + '-' + this.toXX(date.getDate());
  }

  toHHMM(sec) {
    sec = Math.floor(sec);
    return this.toXX(Math.floor(sec / 60)) + ' : ' + this.toXX(sec % 60);
  }

  dateCompare(date1: string, date2: string) {
    //console.log(date1.replace(/-/g, ''));
    //console.log(date2.replace(/-/g, ''));
    let d1: number = Number(date1.replace(/-/g, ''));
    let d2: number = Number(date2.replace(/-/g, ''));
    if (d1 > d2) {
      return false;
    } else {
      return true;
    }
  }
  concatObj(obj1, obj2, state = true) {
    let obj3 = {};
    if (state) {
      for (let prop in obj1) {
        obj3[prop] = obj1[prop];
      }
      for (let prop in obj2) {
        obj3[prop] = obj2[prop];
      }
    } else {
      for (let prop in obj2) {
        obj3[prop] = obj2[prop];
      }
      for (let prop in obj1) {
        obj3[prop] = obj1[prop];
      }
    }
    return obj3;
  }

  cutText(str, length = 40, line = 2) {
    let lineNum:number = 1;
    let lineArr = [];
    if(str.indexOf('\n') != -1) {
      lineArr = str.split('\n');
      lineNum = str.split('\n').length;
    } else {
      lineNum = 1;
    }
    if(lineNum > 2) {
      str = lineArr[0] + '\n' +  lineArr[1] + '...';
    }
    if(str.length > 55) {
      return str.substring(0, 55) + '...';
    } else {
      return str;
    }
  }

  query = {
    get: (data) => {
      if(data.indexOf('?') != -1) {
        data = data.split('?')[1];
      }
      var params = data;
      var paramObj = {};
      if (params.indexOf('&') != -1) {
        params = params.split('&');
      } else {
        if (params == "") {
          return undefined;
        }
        params = [params];
      }

      for (var i = 0; i < params.length; i++) {
        var pair = params[i].split('=');
        paramObj[pair[0]] = pair[1];
      }
      return paramObj;
    }
  }
  /* dataURItoFile(dataURI, name) {
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ia], name, {
      type: mimeString
    });
  } */
  clone(json) {
    return JSON.parse(JSON.stringify(json));
  }
  //custom utils
  ytubeTheme(url) {
    if (url.indexOf('=') != -1) {
      return 'https://img.youtube.com/vi/' + url.split('=')[1] + '/sddefault.jpg';
    } else {
      return 'https://img.youtube.com/vi/' + url.split('be/')[1] + '/sddefault.jpg';
    }
  }
}

@Injectable()
export class User {
  get() {
    if (window.localStorage.getItem('user_id')) {
      return {
        user_id: Number(window.localStorage.getItem('user_id')),
        user_session: window.localStorage.getItem('user_session'),
        dp_nm: window.localStorage.getItem('dp_nm'),
        profile_img: window.localStorage.getItem('profile_img'),
        auto_login: true
      }
    } else if (window.sessionStorage.getItem('user_id')) {
      return {
        user_id: Number(window.sessionStorage.getItem('user_id')),
        user_session: window.sessionStorage.getItem('user_session'),
        dp_nm: window.sessionStorage.getItem('dp_nm'),
        profile_img: window.sessionStorage.getItem('profile_img'),
        auto_login: false
      }
    } else {
      return {
        user_id: 0,
        user_session: '',
        dp_nm: '',
        auto_login: false
      }
    }
  }
  set(data, auto = true) {
    let storage: string = '';
    if (auto) {
      storage = 'localStorage';
    } else {
      storage = 'sessionStorage';
    }
    window[storage].setItem('user_id', data.user_id);
    window[storage].setItem('user_session', data.user_session);
    window[storage].setItem('dp_nm', data.dp_nm);
    window[storage].setItem('profile_img', data.profile_img);
  }
  clear() {
    window.sessionStorage.clear();
    window.localStorage.clear();
  }
}
@Injectable()
export class Device {

  platformInt: number = 3;
  key: string = 'browser';
  init: boolean = false;

  constructor(
    //private app: App,
    private plt: Platform
  ) {
    //platformInt
  }
  async ready() {
    await this.plt.ready();
    if (this.plt.is('core')) {
      this.platformInt = 3;
    } else if (this.plt.is('mobileweb')) {
      if (this.plt.is('android')) {
        this.platformInt = 4;
      } else if (this.plt.is('ios')) {
        this.platformInt = 5;
      } else {
        this.platformInt = 3; //pc android ios 다 아님
      }
    } else if (this.plt.is('android')) {
      this.key = window['device'].uuid;
      this.platformInt = 1;
    } else if (this.plt.is('ios')) {
      this.key = window['device'].uuid;
      this.platformInt = 2;
    } else {
      this.platformInt = 3; //pc android ios 다 아님
    }
    return new Promise(resolve => resolve());
  }
  afterInit() {
    return new Promise(resolve => {
      const check = () => {
        if (this.init) {
          resolve();
        } else {
          setTimeout(check, 200);
        }
      }
      check();
    });
  }

  //익스플로러 체크
  isIE() {
    let word;
    let version = null;

    let agent = navigator.userAgent.toLowerCase();

    // IE old version ( IE 10 or Lower )
    if (navigator.appName == "Microsoft Internet Explorer") word = "msie ";

    else {
      // IE 11
      if (agent.search("trident") > -1) word = "trident/.*rv:";

      // Microsoft Edge
      else if (agent.search("edge/") > -1) word = "edge/";

      // 그외, IE가 아니라면 ( If it's not IE or Edge )
      else return version;
    }

    let reg = new RegExp(word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");

    if (reg.exec(agent) != null) version = RegExp.$1 + RegExp.$2;

    return version;
  }
}
@Injectable()
export class Connect {
  loading: any = null;
  loadingBool: boolean = false;
  loadingCounter: number = 0;
  isError: boolean = false;
  isSessionEnd: boolean = false;
  url: string = '';

  constructor(
    private http: Http,
    private toast: ToastCtrl,
    private modalCtrl: ModalCtrl,
    private loadingCtrl: LoadingController,
    private imgTrans: ImgTrans,
    private appCtrl: App
  ) {

  }
  async run(method = 'NOTTING', body: any = {}, sOpt: any = {
    loading: false,
    delay: false
  }) {

    let delay = new Date().getTime();

    const opt = {
      loading: sOpt.loading == true ? true : false,
      delay: sOpt.delay ? (typeof sOpt.delay === 'number' ? sOpt.delay : 500) : false
    }

    if (opt.loading) {
      if (this.loadingCounter == 0) {
        this.loading = this.loader();
        this.loading.present();
      }
      this.loadingCounter++;
    }

    const url = this.url + method;
    const headers = new Headers();
    const data = this.jsonToFormData(body);
    const options = new RequestOptions({
      headers: headers
    });
    let imgArr = [];

    const http = await this.http.post(url, data, options).timeout(60000).map(res => {
      return res.json();
    }).toPromise().catch(error => {
      switch (error.status) {
        case 0:
          this.toast.present('서버 통신에 실패했습니다.\n 인터넷 연결을 확인해주세요.');
          break;
        case 500:
          console.log(error);
          this.toast.present('[' + error.status + ']' + error.statusText + '\n' + error._body);
          break;
      }
    });

    if (http) {
      if (http.data) {
        imgArr = this.getUrlFromObj(http.data);
        await this.checkAllImg(imgArr);
        //console.log(await this.checkAllImg(imgArr));
      }
    }

    if (opt.delay) {
      delay = new Date().getTime() - delay;
      await this.timeout(delay < opt.delay ? opt.delay - delay : 0);
    }

    if (opt.loading) {
      this.loadingCounter--;
      if (this.loadingCounter == 0) {
        this.loading.dismiss();
      }
    }

    return http ? http : {
      code: 9999
    };
  }
  error(error) {
    console.error(error);
    if (error.code === 1002) {
      if (this.isSessionEnd === true) return;
      this.isSessionEnd = true;
      setTimeout(() => {
        this.isSessionEnd = false;
      }, 5000);
      console.log(this.appCtrl.getRootNavs()[0]);
      this.appCtrl.getRootNavs()[0].setRoot('login');
    } else {
      if (this.isError === true) return;
      this.isError = true;
      setTimeout(() => {
        this.isError = false;
      }, 1000);
      this.toast.present(error.message);
    }
  }
  async delay(func, delay_limit = 500) {
    let delay = new Date().getTime();
    await func();
    delay = new Date().getTime() - delay;
    await this.timeout(delay < delay_limit ? delay_limit - delay : 0);
  }
  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  jsonToFormData(json) {
    let form = new FormData();
    for (let prompt in json) {
      if (typeof json[prompt] == 'object') {
        if (json[prompt] == null) {
          form.append(prompt, json[prompt]);
        } else if (json[prompt].constructor.name == 'Array') {
          if (typeof json[prompt][0] == 'object') {
            //console.log(json[prompt][0].constructor.name);
            if (json[prompt][0].constructor.name == 'File') {
              //파일 어레이임!!!!
              for (let i = 0; i < json[prompt].length; i++) {
                //console.log(prompt);
                //console.log(json[prompt][i]);
                form.append(prompt, json[prompt][i]);
              }
            } else if (json[prompt][0].constructor.name == 'Blob') {
              for (let i = 0; i < json[prompt].length; i++) {
                //console.log(prompt);
                //console.log(json[prompt][i]);
                form.append(prompt, json[prompt][i], 'attaches' + new Date().getTime() + '.jpeg');
              }
            } else {
              //보통 오브젝트 어레이임
              //console.log(prompt);
              //console.log(JSON.stringify(json[prompt]));
              form.append(prompt, JSON.stringify(json[prompt]));
            }
          } else {
            //보통 어레이임
            //console.log(prompt);
            //console.log(JSON.stringify(json[prompt]));
            form.append(prompt, JSON.stringify(json[prompt]));
          }
        } else {
          //오브젝트임
          //console.log(prompt);
          //console.log(JSON.stringify(json[prompt]));
          //console.log(json[prompt].constructor.name);
          if (json[prompt].constructor.name == 'File') {
            form.append(prompt, json[prompt]);
          } else if (json[prompt].constructor.name == 'Blob') {
            if (json[prompt].type.indexOf('audio') != -1) {
              form.append(prompt, json[prompt], 'attaches' + new Date().getTime() + '.mp3');
            } else {
              form.append(prompt, json[prompt], 'attaches' + new Date().getTime() + '.jpeg');
            }
          } else {
            form.append(prompt, JSON.stringify(json[prompt]));
          }
        }
      } else {
        if (json[prompt] == 'true') json[prompt] = true;
        if (json[prompt] == 'false') json[prompt] = false;
        //console.log(prompt);
        //console.log(JSON.stringify(json[prompt]));
        form.append(prompt, json[prompt]);
      }
    }
    return form;
  }
  getUrlFromObj(obj) {
    let arr = [];
    const run = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        for (let key in obj) {
          if (typeof obj[key] === 'string') {
            if (obj[key].indexOf('http') == 0 && (obj[key].indexOf('.png') != -1 || obj[key].indexOf('.jpg') != -1 || obj[key].indexOf('.jpeg') != -1)) {
              if (key === 'product_big_img') {
                arr.push(this.imgTrans.trans(obj[key], '_m'));
                arr.push(this.imgTrans.trans(obj[key], '_s'));
              }
              arr.push(obj[key]);
            }
          } else {
            run(obj[key]);
          }
        }
      }
    }
    run(obj);
    return arr;
  }
  checkImg(path) {
    return new Promise(resolve => {
      let img = new Image();
      img.onload = () => resolve({
        path,
        status: 'ok'
      });
      img.onerror = () => resolve({
        path,
        status: 'error'
      });
      img.src = path;
      img = null;
    });
  }
  checkAllImg(paths) {
    return Promise.all(paths.map(this.checkImg));
  }

  loader() {
    let timeout = true;
    let loader = {
      body: this.loadingCtrl.create({
        spinner: 'hide',
        content: '<div class="custom-loader">\
                    <div class="shadow"></div>\
                    <div class="box"></div>\
                  </div>',
        duration: 300000
      }),
      present: () => {
        loader.body.present();
      },
      dismiss: () => {
        try {
          loader.body.dismiss();
        } catch (e) {

        }
        timeout = false;
      }
    }

    loader.body.onDidDismiss(() => {
      if (timeout) {
        this.toast.present('Your internet connection is not working properly. If the problem persists, please contact administrator.');
      }
    });
    return loader;
  }

}