import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import * as firebase from "firebase";
import { LoaderProvider } from "../../providers/loader/loader";
import moment from "moment";

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html",
})
export class SignupPage {
  private account: any = {
    name: "",
    email: "",
    password: "",
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loader: LoaderProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad SignupPage");
  }

  async signup() {
    this.loader.show();

    try {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.account.email,
          this.account.password
        );

      if (result) {
        var user = firebase.auth().currentUser;

        await user.updateProfile({
          displayName: this.account.name,
          photoURL: "",
        });

        var postData = {
          name: this.account.name,
          email: this.account.email,
          // password: this.account.password,
          // NOTE - above password data is not encrypted! BE CAREFUL WHEN YOU INCLUDE IT!
          date: moment().format("YYYY-MM-DD"),
          id: result.uid,
        };

        // Get a key for a new Post.
        // var newPostKey = firebase.database().ref().child("posts").push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates["/users/" + result.uid] = postData;
        console.log("SignupPage -> signup -> updates", updates);

        firebase.database().ref().update(updates);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.warn("SignupPage -> signup -> error", error);
    }

    this.loader.hide();

    // firebase
    //   .auth()
    //   .createUserWithEmailAndPassword(this.account.email, this.account.password)
    //   .then((result) => {
    //     console.log("SignupPage -> signup -> result", result);
    //     var user = firebase.auth().currentUser;

    //     user
    //       .updateProfile({
    //         displayName: this.account.name,
    //         photoURL: "",
    //       })
    //       .then(() => {
    //         // Update successful.
    //         console.log("Update successful");
    //       })
    //       .catch((error) => {
    //         // An error happened.
    //         console.log("SignupPage -> signup -> error", error);
    //       });
    //   })
    //   .catch((error) => {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     console.log(
    //       "SignupPage -> signup -> errorCode",
    //       errorCode,
    //       errorMessage
    //     );
    //     // ...
    //   });
  }
}
