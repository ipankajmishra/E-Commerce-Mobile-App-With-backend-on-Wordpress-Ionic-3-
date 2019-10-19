import { Component , NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';

@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})
export class MyaccountPage {

  WooCommerce: any;
  orders: any;
  user: any;
  loggedIn: boolean;
  id: any;
  line_items: any;
  total: any;
  imgs: any[];
  list: any[];

  constructor(public navCtrl: NavController, private WP: WoocommerceProvider, public navParams: NavParams, public ngZone: NgZone,  public storage: Storage) {

    this.WooCommerce = WP.init();
    

  }

  fetching(pass){
    this.storage.get("userLoginInfo").then( (userLoginInfo) => {

      if(userLoginInfo != null){

        console.log("User logged in...");
        this.user = userLoginInfo.user;
        console.log(this.id);
        this.loggedIn = true;

      //console.log(this.id);
      console.log('ionViewDidLoad MyaccountPage');
      this.WooCommerce.getAsync("customers/" + this.user.id + "/orders/").then( (data) => {
      console.log(JSON.parse(data.body));
      this.ngZone.run(() => {
        this.orders = JSON.parse(data.body).orders;
        console.log(this.orders);
        for(let i=0;i< this.orders.length;i++)
        {
          if(pass == this.orders[i]){
            this.line_items = this.orders[i].line_items;
          for(let j=0;j< this.line_items.length;j++)
          {
           this.list[j]= this.line_items[j].name;
          }
        }
          
          console.log(this.line_items);
        }
      })
    
    }, (err) => {
      console.log(err);  
    })
      }
      else {
        console.log("No user found.");
        this.user = {};
        this.loggedIn = false;
      }



    })
  }

  

  
    
      
   
    
 

}
