import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PaymentPage } from '../payment/payment';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';


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

  constructor(public navCtrl: NavController,private WP: WoocommerceProvider, public navParams: NavParams, public storage: Storage) {
    this.selected = false;
  
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
