import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PaymentPage } from '../payment/payment';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-shipping',
  templateUrl: 'shipping.html',
})
export class ShippingPage {

  WooCommerce: any;
  temp: any[];
  value: any;
  method_selected: any;
  free: boolean;
  selected: boolean;
  method_id: any;
  method_title: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.selected = false;
    /*this.WooCommerce = WC({
      url: "http://35.200.207.232/",
      consumerKey: "ck_349f29c988202cb1051ee2563824804083be5706",
      consumerSecret: "cs_de2719c4dc0cf0ca252dae26f74c025435f389e4",
      wpAPI: true, // Enable the WP REST API integration
      //queryStringAuth: true,
      //verifySsl: false,
      version: 'wc/v3' //Even I used v2 then also problem exist.
    });

    this.WooCommerce.getAsync("shipping_methods").then((data) => {
      console.log(JSON.parse(data.body));
      this.temp = JSON.parse(data.body);
      

  });*/
  }
  ionViewDidLoad() {
    
    this.storage.get("carttotal").then((data)=>
        {
            console.log("get storage data");
            console.log(data);
            if(data  < 350)
            {
                this.free = true;
            }
        });
  }

  paymentpage(){
    //console.log(this.value);
    this.navCtrl.pop();
    this.navCtrl.push(PaymentPage);
  }

  flat_rate() {
    this.method_selected = 45;
    this.method_id = "flat";
    this.method_title = "Flat rate";
    console.log(this.method_selected);
    this.storage.remove("shippingcharge");
    this.storage.remove("method_id");
    this.storage.remove("method_title");
    this.storage.set("shippingcharge",this.method_selected);
    this.storage.set("method_id",this.method_id);
    this.storage.set("method_title",this.method_title);
    
    this.selected = true;
  }
  free_shipping() {
    this.method_selected = 0;
    this.method_id = "free";
    this.method_title = "Free Shipping";
    console.log(this.method_selected);
    this.storage.remove("shippingcharge");
    this.storage.remove("method_id");
    this.storage.remove("method_title");
    this.storage.set("shippingcharge",this.method_selected);
    this.storage.set("method_id",this.method_id);
    this.storage.set("method_title",this.method_title);
    this.selected = true;
  }
  guaranteed() {
    this.method_selected = 89;
    this.method_id = "g2d";
    this.method_title = "Guranteed 1-2 days";
    console.log(this.method_title);
    this.storage.remove("shippingcharge");
    this.storage.remove("method_id");
    this.storage.remove("method_title");
    this.storage.set("shippingcharge",this.method_selected);
    this.storage.set("method_id",this.method_id);
    this.storage.set("method_title",this.method_title);
    this.selected = true;
  }

}
