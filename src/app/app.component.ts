import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import * as firebase from "firebase";
// import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBbWdFogmNWrAcbvt8SG8Lm4XsoxPcyJzU",
  authDomain: "ionic-with-firebase-3234c.firebaseapp.com",
  databaseURL: "https://ionic-with-firebase-3234c.firebaseio.com",
  projectId: "ionic-with-firebase-3234c",
  storageBucket: "ionic-with-firebase-3234c.appspot.com",
  messagingSenderId: "782825335965",
  appId: "1:782825335965:web:5bb33ed19335c09a5df874",
  measurementId: "G-ML2PTKNBRE",
};
// Initialize Firebase

@Component({
  templateUrl: "app.html",
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.rootPage = HomePage;
      } else {
        // User is signed out.
        this.rootPage = LoginPage;
      }
    });
  }
}
