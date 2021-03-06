import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as WC from 'woocommerce-api';
import { MenuPage } from '../menu/menu'
import { App } from 'ionic-angular';
import { HomePage } from '../home/home'
import { CartPage } from '../cart/cart';

import { ProductsByCategoryPage } from '../products-by-category/products-by-category';
import { ProductDetailsPage } from '../product-details/product-details';
import { EmailValidator } from '@angular/forms';
import { ConfirmationPage } from '../confirmation/confirmation';
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',

})
export class CheckoutPage {

  WooCommerce: any;
  newOrder: any;
  paymentMethods: any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  userInfo: any;
  loading: any;
  //couponsent: any[];
  storecoupon: any[] = [];
  temp: any;
  temp1: any;
  temp2: any;
  hiding: boolean;
  placeOrderhidden: boolean;
  route: any;
  

  

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public ngZone: NgZone, public appctrl: App, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController, public loadingCtrl : LoadingController) {
    
    this.newOrder = {};
    this.newOrder.billing_address = {};
    this.newOrder.shipping_address = {};
    this.billing_shipping_same = false;

    this.paymentMethods = [
      //{ method_id: "bacs", method_title: "Direct Bank Transfer" },
      //{ method_id: "cheque", method_title: "Cheque Payment" },
      { method_id: "cod", method_title: "Cash on Delivery" }];
      //{ method_id: "paypal", method_title: "PayPal" }];

      this.WooCommerce = WC({
        url: "http://35.200.207.232/",
        consumerKey: "ck_349f29c988202cb1051ee2563824804083be5706",
        consumerSecret: "cs_de2719c4dc0cf0ca252dae26f74c025435f389e4"
      });

      this.storage.get("route").then( (data) => {
        if(data == "0"){
          //this.viewCtrl.dismiss();
          this.route = "follow";
         // this.storage.remove("route");
        } else {
          this.route = "unfollow";
         // this.storage.remove("route");
        }
      })
        
    
    this.storage.get("userLoginInfo").then((userLoginInfo) => {
      this.showLoader();
      this.userInfo = userLoginInfo.user;
     // let parsecoupon = userLoginInfo.coupon;
     
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
          }
          this.newOrder.billing_address.coupon = this.temp;
          this.storecoupon.push(data);
          
          console.log("test");
          console.log(this.temp);
    
          //couponsent.push(this.storecoupon);
          //console.log(this.storecoupon)
       });
       this.storage.get("id").then((data)=>{
        this.temp1 = data;
        this.newOrder.billing_address.id = this.temp1;
        this.storecoupon.push(data);
        
        console.log("test");
        console.log(this.temp);
  
        //couponsent.push(this.storecoupon);
        //console.log(this.storecoupon)
     });
     this.storage.get("amount").then((data)=>{
      this.temp2 = data;
      this.newOrder.billing_address.amount = "-" + this.temp2;
      console.log(this.newOrder.billing_address.amount);
      
      console.log("test");
      console.log(this.temp);

      //couponsent.push(this.storecoupon);
      //console.log(this.storecoupon)
   });
        this.loading.dismiss();
      })

      })

    })

  }

  

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;

    if (this.billing_shipping_same) {
      this.newOrder.shipping_address = this.newOrder.billing_address;
    }

  }
  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  placeOrderwithCoupon() {
    this.showLoader();
    //console.log("Loading page " + this.showLoader);

    let orderItems: any[] = [];
    let data: any = {};
    let couponsent: any = this.temp;

    let paymentData: any = {};

    this.paymentMethods.forEach((element, index) => {
      if (element.method_id == this.paymentMethod) {
        paymentData = element;
      }
    });


    
   
    


    data = {
      payment_details: {
        method_id: paymentData.method_id,
        method_title: paymentData.method_title,
        paid: true,
        //coupon_lines: this.userInfo.coupon
      },

      billing_address: this.newOrder.billing_address,
      shipping_address: this.newOrder.shipping_address,
      customer_id: this.userInfo.id || '',
      line_items: orderItems,
      coupon_lines: [{
        "id":this.newOrder.billing_address.id,
         "code": this.newOrder.billing_address.coupon,
         //"amount":this.newOrder.billing_address.amount,
      }],
      fee_lines: [{
        "title": this.newOrder.billing_address.coupon,
         "total": this.newOrder.billing_address.amount,
      }],
      

    };


    this.storage.get("cart").then((cart) => {

        cart.forEach((element, index) => {
          orderItems.push({
            product_id: element.product.id,
            quantity: element.qty
          });
        });

        data.line_items = orderItems;

        let orderData: any = {};

        orderData.order = data;

        this.WooCommerce.postAsync("orders", orderData).then((data) => {

          let response = (JSON.parse(data.body).order);
          this.loading.dismiss();
         // console.log("Done Loading " + this.loading);
         console.log(JSON.parse(data.body).order)
         this.storage.set("tempOrderid", response.order_number);
         this.storage.remove("coupon");
         this.storage.remove("id");
         this.storage.remove("amount");
         if(this.route == "follow"){
          this.navCtrl.pop();
         this.navCtrl.push(ConfirmationPage);
       }
     else{
       this.viewCtrl.dismiss().then(() => {
         this.navCtrl.push(ConfirmationPage);
         
         //this.navCtrl.setRoot(MenuPage);
     });
     }

         

        })

      })


  }
  

  placeOrderwithoutCoupon() {
    this.showLoader();
    //console.log("Loading page " + this.showLoader);

    let orderItems: any[] = [];
    let data: any = {};
    let couponsent: any = this.temp;

    let paymentData: any = {};

    this.paymentMethods.forEach((element, index) => {
      if (element.method_id == this.paymentMethod) {
        paymentData = element;
      }
    });


    
   
    


    data = {
      payment_details: {
        method_id: paymentData.method_id,
        method_title: paymentData.method_title,
        paid: true,
        //coupon_lines: this.userInfo.coupon
      },

      billing_address: this.newOrder.billing_address,
      shipping_address: this.newOrder.shipping_address,
      customer_id: this.userInfo.id || '',
      line_items: orderItems,
      //coupon_lines: [{
        //"amount":this.newOrder.billing_address.amount,
         //"code": this.newOrder.billing_address.coupon,
         //"id":this.newOrder.billing_address.id,
      //}],

    };

    

    


    this.storage.get("cart").then((cart) => {

        cart.forEach((element, index) => {
          orderItems.push({
            product_id: element.product.id,
            quantity: element.qty
          });
        });

        data.line_items = orderItems;

        let orderData: any = {};

        orderData.order = data;

        this.WooCommerce.postAsync("orders", orderData).then((data) => {

          let response = (JSON.parse(data.body).order);
          this.loading.dismiss();
         // console.log("Done Loading " + this.loading);
         console.log(JSON.parse(data.body).order)
         this.storage.set("tempOrderid", response.order_number);
         this.storage.remove("coupon");
         this.storage.remove("id");
         this.storage.remove("amount");

         console.log(this.route)
         if(this.route == "follow"){
          console.log("follow applied")
           this.navCtrl.pop();
          this.navCtrl.push(ConfirmationPage);
          
        }
      else{
        console.log("no follow applied")
        this.viewCtrl.dismiss().then(() => {
          this.navCtrl.push(ConfirmationPage);
          
          //this.navCtrl.setRoot(MenuPage);
      });
      }
         

         
          

        })

      })


  }

}