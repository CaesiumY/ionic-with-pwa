import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
} from "ionic-angular";
import { NewsModalPage } from "../news-modal/news-modal";

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-news",
  templateUrl: "news.html",
})
export class NewsPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController
  ) {}

  add() {
    let newsModal = this.modalCtrl.create(NewsModalPage);

    newsModal.onDidDismiss((data) => {
      console.log(data);
    });

    newsModal.present();
  }
}
