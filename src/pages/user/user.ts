import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import * as firebase from "firebase";
import { LoaderProvider } from "../../providers/loader/loader";

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-user",
  templateUrl: "user.html",
})
export class UserPage {
  private users: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loader: LoaderProvider
  ) {
    this.initPage();
  }

  async initPage() {
    this.loader.show();
    var userRef = firebase.database().ref("users/");
    // .once("value")
    // .then((snapshot) => {
    //   console.log("UserPage -> initPage -> snapshot", snapshot.val());
    // })
    // .catch((error) => console.log("error", error));

    userRef.on("value", (items: any) => {
      console.log("loaded");
      if (items.val()) {
        items.forEach((item) => {
          this.users.push({
            name: item.val().name,
            email: item.val().email,
            date: item.val().date,
            id: item.val().id,
          });
        });

        console.log("users", this.users);
        this.loader.hide();
      } else {
        console.log("No User Data");
      }
    });
  }
}
