import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ItemSliding,
} from "ionic-angular";
import firebase from "firebase";
import { LoaderProvider } from "../../providers/loader/loader";

/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-category",
  templateUrl: "category.html",
})
export class CategoryPage {
  private category: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private loader: LoaderProvider
  ) {
    console.log(firebase.auth().currentUser.uid);
    this.getCategoryData();
  }

  getCategoryData() {
    this.loader.show();
    var userRef = firebase.database().ref("/category/");

    userRef.on("value", (items: any) => {
      this.category = [];
      if (items.val()) {
        items.forEach((item) => {
          console.log("CategoryPage -> getCategoryData -> item", item.val());

          this.category = [
            ...this.category,
            {
              title: item.val().title,
              code: item.val().code,
            },
          ];
        });
      } else {
        console.log("No Category Data");
      }
    });
    this.loader.hide();
  }

  add() {
    let prompt = this.alertCtrl.create({
      title: "카테고리 정보 입력",
      message: "카테고리 정보를 입력하여 주세요.",
      inputs: [
        {
          name: "code",
          placeholder: "code",
        },
        {
          name: "title",
          placeholder: "Title",
        },
      ],
      buttons: [
        {
          text: "취소",
          handler: () => {
            console.log("category add cancelled");
          },
        },
        {
          text: "저장",
          handler: (data) => {
            console.log("CategoryPage -> add -> data", data);

            var tmpCategory = {
              title: data.title,
              code: data.code,
            };

            var updates = {};
            updates["/category/" + data.code] = tmpCategory;
            firebase
              .database()
              .ref()
              .update(updates)
              .catch((error) => console.warn("category update error", error));
          },
        },
      ],
    });

    prompt.present();
  }

  edit(slidingItem: ItemSliding, item) {
    slidingItem.close();

    let prompt = this.alertCtrl.create({
      title: "카테고리 정보 입력",
      message: "카테고리 정보를 입력하여 주세요.",
      inputs: [
        {
          name: "code",
          placeholder: "code",
          value: item.code,
        },
        {
          name: "title",
          placeholder: "Title",
          value: item.title,
        },
      ],
      buttons: [
        {
          text: "취소",
          handler: () => {
            console.log("category add cancelled");
          },
        },
        {
          text: "저장",
          handler: (data) => {
            console.log("CategoryPage -> add -> data", data);

            var tmpCategory = {
              title: data.title,
              code: data.code,
            };

            var updates = {};
            updates["/category/" + data.code] = tmpCategory;
            firebase
              .database()
              .ref()
              .update(updates)
              .catch((error) => console.warn("category update error", error));
          },
        },
      ],
    });

    prompt.present();
  }

  delete(slidingItem: ItemSliding, item) {
    slidingItem.close();

    let confirm = this.alertCtrl.create({
      title: "카테고리 삭제",
      message: item.title + "을 삭제하시겠습니까?",
      buttons: [
        {
          text: "아니요",
          handler: () => {
            console.log("category delete cancelled");
          },
        },
        {
          text: "예",
          handler: () => {
            var deleteRef = firebase.database().ref("/category/" + item.code);
            deleteRef
              .remove()
              .catch((error) => console.warn("delete error", error));
          },
        },
      ],
    });

    confirm.present();
  }
}
