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
import { LoaderProvider } from "../../providers/loader/loader";

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
  private news: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private loader: LoaderProvider
  ) {
    this.initPage();
  }

  async initPage() {
    this.loader.show();
    try {
      var newsRef = firebase.database().ref("news/");

      const items = await newsRef.once("value");
      if (items) {
        this.news = [];
        items.forEach((item: any) => {
          this.news.push({
            title: item.val().title,
            category: item.val().category,
            source: item.val().source,
            url: item.val().url,
            date: item.val().date,
            clickCount: item.val().clickCount,
            key: item.val().key,
          });
        });
      } else {
        console.log("no news data");
      }
    } catch (error) {
      console.warn("NewsPage -> initPage -> error", error);
    }
    this.loader.hide();
  }

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
      url: data.url,
      date: moment().format("YYYY-MM-DD:HH:mm:SS"),
      clickCount: 0,
      key: newPostKey,
    };

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates["/news/" + newPostKey] = postData;
    console.log("NewsPage -> updateNews -> updates", updates);

    firebase.database().ref().update(updates);
  }
}
