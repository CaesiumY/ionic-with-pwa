import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
} from "ionic-angular";
import { SignupPage } from "../signup/signup";
import * as firebase from "firebase";
import { LoaderProvider } from "../../providers/loader/loader";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html",
})
export class LoginPage {
  private account: any = {
    email: "",
    password: "",
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loader: LoaderProvider,
    private alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }

  async login() {
    this.loader.show();
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.account.email, this.account.password)
      .then((result) => {
        console.log("LoginPage -> login -> result", result);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(
          "SignupPage -> signup -> errorCode",
          errorCode,
          errorMessage
        );
      });
    this.loader.hide();
  }
  signup() {
    this.navCtrl.push(SignupPage);
  }

  reset() {
    let alert = this.alertCtrl.create({
      title: "Reset Passworld",
      message: "패스워드 재설정 링크를 받을 이메일 주소를 적어주세요.",
      inputs: [
        {
          name: "email",
          placeholder: "email",
        },
      ],
      buttons: [
        {
          text: "취소",
          role: "cancel",
          handler: () => {
            console.log("cancelled");
          },
        },
        {
          text: "확인",
          handler: (data) => {
            var auth = firebase.auth();
            var emailAddress = data.email;

            auth
              .sendPasswordResetEmail(emailAddress)
              .then(() => {
                // Email sent.
                let alert = this.alertCtrl.create({
                  title: "Password Reset Email",
                  subTitle:
                    "사용자가 입력한 이메일로 패스워드 재설정 메일이 전송되었습니다. 메일을 확인해 주세요.",
                  buttons: ["확인"],
                });
                alert.present();
              })
              .catch((error) => {
                // An error happened.
                console.warn(error);
              });
          },
        },
      ],
    });

    alert.present();
  }
}
