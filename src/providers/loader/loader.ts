import { Injectable } from "@angular/core";
import { LoadingController } from "ionic-angular";

/*
  Generated class for the LoaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoaderProvider {
  constructor(public loadingCtrl: LoadingController) {}

  private loading: any;

  show() {
    this.loading = this.loadingCtrl.create({
      content: "잠시만 기다려주세요...",
    });

    this.loading.present();
  }
  hide() {
    this.loading.dismiss();
  }
}
