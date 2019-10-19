import { Component, NgZone, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ViewController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as WC from 'woocommerce-api';

import { App } from 'ionic-angular';
import { ShippingPage } from '../shipping/shipping';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
  

})
export class CheckoutPage {

  WooCommerce: any;
  userid: any;
  newOrder: any;
  paymentMethods: any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  userInfo: any;
  loading: any;
  storecoupon: any[] = [];
  temp: any;
  temp1: any;
  temp2: any;
  hiding: boolean;
  placeOrderhidden: boolean;
  route: any;
  @ViewChild('content') childNavCtrl: NavController;
  

  

  constructor(public viewCtrl: ViewController,private WP: WoocommerceProvider, public navCtrl: NavController, public ngZone: NgZone, public appctrl: App, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController, public loadingCtrl : LoadingController) {
    this.showLoader();
    this.placeOrderhidden = false;
    this.newOrder = {};
    this.newOrder.billing_address = {};
    this.newOrder.shipping_address = {};
    this.billing_shipping_same = false;

    this.paymentMethods = [
     
      { method_id: "cod", method_title: "Cash on Delivery" }];
     

      this.WooCommerce = WP.init();

      this.storage.get("route").then( (data) => {
        if(data == "0"){
          
          this.route = "follow";
         
        } else {
          this.route = "unfollow";
        
        }
      })
        
    
    this.storage.get("userLoginInfo").then((userLoginInfo) => {
     
      this.userInfo = userLoginInfo.user;
      this.userid = this.userInfo.id;
      console.log(this.userInfo.id);
      this.loading.dismiss();
   
     
      let email = userLoginInfo.user.email;

      this.WooCommerce.getAsync("customers/email/" + email).then((data) => {
        
        this.ngZone.run(() => {
        this.newOrder = JSON.parse(data.body).customer;
        this.storage.get("coupon").then((data)=>{
          this.temp = data;
          console.log("Check data without coupon");
          console.log(this.temp)
          if(this.temp == null)
          {
            console.log("No coupon applied");
            this.placeOrderhidden = true;
            this.newOrder.billing_address.id = 0;
            this.newOrder.billing_address.coupon = "null";
            this.newOrder.billing_address.amount = 0;
          }
          this.newOrder.billing_address.coupon = this.temp;
          this.storecoupon.push(data);
          
          console.log("test");
          console.log(this.temp);
    
       
       });
       this.storage.get("id").then((data)=>{
        this.temp1 = data;
        this.newOrder.billing_address.id = this.temp1;
        this.storecoupon.push(data);
        
        console.log("test");
        console.log(this.temp);
  
     });
     this.storage.get("amount").then((data)=>{
      this.temp2 = data;
      this.newOrder.billing_address.amount = "-" + this.temp2;
      console.log(this.newOrder.billing_address.amount);
      
      console.log("test");
      console.log(this.temp);

     
   });
      
      })

      })

    })}
    


    
   
  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  next() {
    
    let orderItems: any[] = [];
    let data: any = {};
    data = {
      payment_details: {
        method_id: 0,
        method_title: "No",
        paid: true,
       
      },

      billing_address: this.newOrder.billing_address,
      shipping_address: this.newOrder.shipping_address,
      customer_id: this.userid || '',
      line_items: orderItems,
      coupon_lines: [{
        "id":this.newOrder.billing_address.id,
         "code": this.newOrder.billing_address.coupon,
        
      }],
      fee_lines: [{
        "title": this.newOrder.billing_address.coupon,
         "total": this.newOrder.billing_address.amount,
      }],
      

    };
    this.storage.get("cart").then((cart) => {

      cart.forEach((element) => {
        orderItems.push({
          product_id: element.product.id,
          quantity: element.qty
        });
      });

      data.line_items = orderItems;

      let orderData: any = {};

      orderData.order = data;

      console.log("ORDER DATA");
      console.log(orderData.order);
      this.storage.set("detailswoshippay",data);
      
     

    })
    
    this.navCtrl.push(ShippingPage);

    


  }
  
  close(){
    this.navCtrl.pop();
    }

}