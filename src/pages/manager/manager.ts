import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { NewsPage } from "../news/news";
import { UserPage } from "../user/user";
import { CategoryPage } from "../category/category";

/**
 * Generated class for the ManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-manager",
  templateUrl: "manager.html",
})
export class ManagerPage {
  private menus = [
    {
      code: "001",
      title: "News database",
    },
    {
      code: "002",
      title: "User database",
    },
    {
      code: "003",
      title: "Category database",
    },
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ManagerPage");
  }

  toMenu(menu) {
    switch (menu.code) {
      case "001":
        return this.navCtrl.push(NewsPage);
      case "002":
        return this.navCtrl.push(UserPage);
      case "003":
        return this.navCtrl.push(CategoryPage);

      default:
        break;
    }
  }
}
