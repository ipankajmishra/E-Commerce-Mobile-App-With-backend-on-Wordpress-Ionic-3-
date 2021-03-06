import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MenuPage} from '../menu/menu';

@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
})
export class ConfirmationPage {

  tempOrderid: any;
  route: any;

  constructor(public appCtrl: App, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public ngZone: NgZone, public storage: Storage) {
    this.storage.remove("coupon");
    this.storage.remove("id");
    this.storage.remove("amount");
    this.storage.get("route").then( (data) => {
      if(data == "0"){
        //this.viewCtrl.dismiss();
        this.route = "follow";
        this.storage.remove("route");
      } else {
        this.route = "unfollow";
        this.storage.remove("route");
      }
    })
  }
  

  ionViewDidLoad() {
    this.storage.get("tempOrderid").then((data)=>{
      //console.log("start", data);
      this.tempOrderid = data;
      






      
  });
  }

  continueShopping(){
    if(this.route == "follow")
         {

                this.storage.set("cart", []);
                this.storage.set("finalcartlength",0);
                this.ngZone.run(() => {
                  this.navCtrl.pop();
                  this.navCtrl.setRoot(MenuPage);});
                //this.viewCtrl.dismiss().then(() => {
                  //this.appctrl.getRootNav().setRoot(MenuPage);
                  
                  //this.navCtrl.setRoot(MenuPage);
              //});
                //this.viewCtrl.dismiss();
                //this.navCtrl.setRoot(MenuPage);
                //console.log(this.storage.remove("coupon"));
                  console.log("path 1");
                //console.log(this.storage.remove("id")); 
                //console.log(this.storage.remove("amount"));  
                //this.navCtrl.pop();
                //this.navCtrl.pop(ProductDetailsPage);
                //this.navCtrl.pop();
                //this.appctrl.getRootNav().push(HomePage);
                
                //this.navCtrl.setRoot(HomePage);
                
              }
           

          else{
            console.log("path 2");
                  this.storage.set("cart", []);
                  this.storage.set("finalcartlength",0);
                  //this.navCtrl.push(MenuPage);
                  //console.log("this path chosen");
                  this.navCtrl.pop();
                  //this.viewCtrl.dismiss().then(() => {
                    this.appCtrl.getRootNav().setRoot(MenuPage);
                    
                    //this.navCtrl.setRoot(MenuPage);
                //});
                  //this.viewCtrl.dismiss();
              //this.navCtrl.setRoot(MenuPage);
                  //console.log(this.storage.remove("coupon"));
  
                  //console.log(this.storage.remove("id")); 
                  //console.log(this.storage.remove("amount"));  
                  //this.navCtrl.pop();
                  //this.navCtrl.pop(ProductDetailsPage);
                  //this.navCtrl.pop();
                  //this.appctrl.getRootNav().push(HomePage);
                  
                  //this.navCtrl.setRoot(HomePage);
                  
                
          }
  }

}
