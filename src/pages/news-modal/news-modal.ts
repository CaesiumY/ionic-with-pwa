import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
} from "ionic-angular";
import firebase from "firebase";
import { LoaderProvider } from "../../providers/loader/loader";

/**
 * Generated class for the NewsModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-news-modal",
  templateUrl: "news-modal.html",
})
export class NewsModalPage {
  private news = {
    title: "",
    category: "",
    url: "",
    source: "",
  };

  private categoryData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loader: LoaderProvider,
    private viewCtrl: ViewController
  ) {
    var mode = this.navParams.get("mode");

    if (mode === "edit") {
      this.news = this.navParams.get("newsItem");
    }

    this.getCategoryData();
  }

  save() {
    this.viewCtrl.dismiss(this.news);
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  async getCategoryData() {
    this.loader.show();
    try {
      var categoryRef = firebase
        .database()
        .ref("/users/" + firebase.auth().currentUser.uid + "/category/");

      const items = await categoryRef.once("value");
      this.categoryData = [];
      if (items) {
        items.forEach((item: any) => {
          this.categoryData.push({
            title: item.val().title,
            code: item.val().code,
          });
        });
      }
    } catch (error) {
      console.log("NewsModalPage -> getCategoryData -> error", error);
    }
    this.loader.hide();
  }
}
