import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ItemSliding,
  AlertController,
} from "ionic-angular";
import { NewsModalPage } from "../news-modal/news-modal";
import firebase from "firebase";
import moment from "moment";
import { LoaderProvider } from "../../providers/loader/loader";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

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
  private mode: any;
  private limit: any = 10;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private loader: LoaderProvider,
    private alertCtrl: AlertController,
    private iab: InAppBrowser
  ) {
    this.initPage();
  }

  async initPage() {
    this.loader.show();
    try {
      var newsRef = firebase
        .database()
        .ref("news/")
        .orderByChild("timeStamp")
        .limitToFirst(this.limit);

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
            timeStamp: item.val().timeStamp,
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

  onClickNews(newsItem) {
    const browser = this.iab.create(newsItem.url);
  }

  add() {
    this.mode = "add";
    let newsModal = this.modalCtrl.create(NewsModalPage, {
      mode: this.mode,
      news: "",
    });

    newsModal.onDidDismiss((data) => {
      if (data) {
        this.updateNews(data);
      }
    });

    newsModal.present();
  }

  updateNews(data) {
    if (this.mode === "edit") {
      var editedPostData = {
        ...data,
      };
      var editedUpdates = {};
      editedUpdates["/news/" + data.key] = editedPostData;
      console.log("NewsPage -> updateNews -> editedUpdates", editedUpdates);

      firebase.database().ref().update(editedUpdates);
    } else {
      var newPostKey = firebase.database().ref().child("news/").push().key;
      let timeStamp: any = firebase.database.ServerValue.TIMESTAMP;

      var postData = {
        title: data.title,
        category: data.category,
        source: data.source,
        url: data.url,
        date: moment().format("YYYY-MM-DD:HH:mm:SS"),
        clickCount: 0,
        key: newPostKey,
        timeStamp,
      };

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates["/news/" + newPostKey] = postData;
      console.log("NewsPage -> updateNews -> updates", updates);

      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          var stampRef = firebase.database().ref("news/" + newPostKey);
          var stamp: any;

          stampRef
            .once("value", (item: any) => {
              stamp = item.val().timeStamp * -1;
            })
            .then(() => {
              firebase
                .database()
                .ref("news/" + newPostKey)
                .update({
                  timeStamp: stamp,
                });

              this.initPage();
            });
        });
    }
  }

  edit(slidingItem: ItemSliding, item) {
    slidingItem.close();

    this.mode = "edit";
    let newsModal = this.modalCtrl.create(NewsModalPage, {
      mode: this.mode,
      newsItem: item,
    });

    newsModal.onDidDismiss((data) => {
      if (data) {
        this.updateNews(data);
      }
    });

    newsModal.present();
  }

  delete(slidingItem: ItemSliding, item) {
    slidingItem.close();

    let confirm = this.alertCtrl.create({
      title: "뉴스 삭제",
      message: item.title.substr(0, 7) + "...을 삭제하시겠습니까?",
      buttons: [
        {
          text: "아니요",
          handler: () => {
            console.log("news delete cancelled");
          },
        },
        {
          text: "예",
          handler: () => {
            var deleteRef = firebase.database().ref("news/" + item.key);
            deleteRef
              .remove()
              .then(() => {
                this.initPage();
              })
              .catch((error) => console.warn("delete error", error));
          },
        },
      ],
    });

    confirm.present();
  }

  async doInfinite(infiniteScroll) {
    this.limit += 10;
    await this.initPage();

    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }

  async doRefresh(refresher) {
    this.limit = 10;
    await this.initPage();

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
