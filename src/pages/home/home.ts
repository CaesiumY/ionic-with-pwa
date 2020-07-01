import { Component } from "@angular/core";
import { NavController, AlertController } from "ionic-angular";
import * as firebase from "firebase";

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

  constructor(
    public navCtrl: NavController,
    private alerCtrl: AlertController
  ) {
    this.masterSwitch = false;
    this.initPage();
  }

  initPage() {
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
  }

  logout() {
    let confirm = this.alerCtrl.create({
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
}
