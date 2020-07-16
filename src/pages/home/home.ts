import { Component } from "@angular/core";
import { NavController, AlertController } from "ionic-angular";
import * as firebase from "firebase";
import { ManagerPage } from "../manager/manager";
import { LoaderProvider } from "../../providers/loader/loader";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
  private username: any;
  private userEmail: any;
  private userId: any;

  private masterEmail: any = "test4@test.com"; // NOTE - NOT RECOMMENDED CONTROL. but lecturer did like this.
  private masterSwitch: any;

  private news: any;
  private limit: any = 10;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private loader: LoaderProvider,
    private iab: InAppBrowser
  ) {
    this.masterSwitch = false;
    this.initPage();
    this.getNewsData();
  }

  toManager() {
    this.navCtrl.push(ManagerPage);
  }

  async getNewsData() {
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
  }

  initPage() {
    this.loader.show();
    try {
      var user = firebase.auth().currentUser;

      if (user) {
        console.log("HomePage -> initPage -> user", user);
        this.username = user.displayName;
        this.userEmail = user.email;
        this.userId = user.uid;

        if (user.email === this.masterEmail) {
          this.masterSwitch = true;
        }
      }
    } catch (error) {
      console.warn("HomePage -> initPage -> error", error);
    }

    this.loader.hide();
  }

  search() {
    let prompt = this.alertCtrl.create({
      title: "검색어 입력",
      message: "검색어를 입력해 주세요.",
      inputs: [
        {
          name: "keyword",
          placeholder: "Keyword",
        },
      ],
      buttons: [
        {
          text: "취소",
          handler: () => {
            console.log("search cancelled");
          },
        },
        {
          text: "검색",
          handler: (data) => {
            this.searchNews(data);
          },
        },
      ],
    });

    prompt.present();
  }

  searchNews({ keyword }) {
    var tmpNews = [];
    var newsRef = firebase.database().ref("news/");
    newsRef
      .once("value", (items: any) => {
        if (items.val()) {
          items.forEach((item) => {
            tmpNews = [...tmpNews, ...item.val()];
          });
        } else {
          console.log("no news data");
        }
      })
      .then(() => {
        // this.news = [];
        if (keyword && keyword.trim() != "") {
          this.news = tmpNews.filter((tmpNewsItem) => {
            return (
              tmpNewsItem.title.toLowerCase().indexOf(keyword.toLowerCase()) >
              -1
            );
          });
        }
      })
      .catch((error) => console.warn(error));
  }

  logout() {
    let confirm = this.alertCtrl.create({
      title: "Log out",
      message: "로그아웃 하시겠습니까?",
      buttons: [
        {
          text: "아니오",
          handler: () => {
            console.log("logout disagreed");
          },
        },
        {
          text: "예",
          handler: () => {
            firebase
              .auth()
              .signOut()
              .then(() => {
                // Sign-out successful.
                console.log("logout successfully");
              })
              .catch((error) => {
                // An error happened.
                console.log("HomePage -> logout -> error", error);
              });
          },
        },
      ],
    });

    confirm.present();
  }

  onClickNews(newsItem) {
    const browser = this.iab.create(newsItem.url);
  }

  async doInfinite(infiniteScroll) {
    this.limit += 10;
    await this.getNewsData();

    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }

  async doRefresh(refresher) {
    this.limit = 10;
    await this.getNewsData();

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
