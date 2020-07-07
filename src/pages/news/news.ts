import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
} from "ionic-angular";
import { NewsModalPage } from "../news-modal/news-modal";
import firebase from "firebase";
import moment from "moment";

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
      this.updateNews(data);
    });

    newsModal.present();
  }

  updateNews(data) {
    var newPostKey = firebase.database().ref().child("news/").push().key;

    var postData = {
      title: data.title,
      category: data.category,
      source: data.source,
      webUrl: data.webUrl,
      date: moment().format("YYYY-MM-DD:HH:mm:SS"),
      clickCount: 0,
      key: newPostKey,
    };

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates["/news/" + data.key] = postData;
    console.log("NewsPage -> updateNews -> updates", updates);

    firebase.database().ref().update(updates);
  }
}
