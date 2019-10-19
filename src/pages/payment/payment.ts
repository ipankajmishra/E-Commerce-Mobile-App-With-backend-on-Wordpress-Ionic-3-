import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConfirmationPage } from '../confirmation/confirmation';
import * as WC from 'woocommerce-api';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';


@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  paymethods: any;
  newOrder: any;
  paymentMethods: any[];
  paymentMethod: any;
  details: any;
  userInfo: any;
  route: any;
  WooCommerce: any;
  loading: any;
  shippingcharge: any;
  shippingtitle: any;
  shippingid: any;
  paylaterselected: boolean;
  carttotal: any;
  shippingtotal: any;
  overalltotal: any;
  temp1: any;
  temp2: any;
  temp3: any;
  paymentid: any;
  razoramount: any;
  billingadd: any;
  razorsuccess: boolean;


  constructor(public navCtrl: NavController,private WP: WoocommerceProvider, public alertCtrl: AlertController,public loadingCtrl : LoadingController, public viewCtrl: ViewController, public navParams: NavParams,public storage: Storage) {
    this.paymethods="paypal";
    this.paylaterselected = false;
    this.razorsuccess = false;
    this.newOrder = {};
    this.newOrder.billing_address = {};

    this.storage.get("carttotal").then((data)=>
        {
            console.log("get storage data");
            console.log(data);
            this.carttotal = data;
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
    this.WooCommerce = WP.init();

    this.storage.get("shippingcharge").then((data)=>{
          this.shippingcharge = data;
          this.newOrder.billing_address.charge = this.shippingcharge;
          this.overalltotal = this.carttotal + this.shippingcharge;
          this.razoramount = this.overalltotal * 100;
  });

  this.storage.get("method_id").then((data)=>{
    this.shippingid = data;
    this.newOrder.billing_address.id = this.shippingid;
});


this.storage.get("method_title").then((data)=>{
  this.shippingtitle = data;
  this.newOrder.billing_address.title = this.shippingtitle;
  console.log(this.newOrder.billing_address.title);
});

    this.storage.get("detailswoshippay").then((data)=>
        {
            console.log("get storage data");
            console.log(data);
            this.details = data;
            this.billingadd = this.details.billing_address;
            console.log(this.billingadd);
        });
        this.storage.get("userLoginInfo").then((userLoginInfo) => {
          //this.showLoader();
          this.userInfo = userLoginInfo.user;});

    this.storage.get("id").then((data)=>{
      this.temp1 = data;
    //this.newOrder.billing_address.id = this.temp1;
      }); 


    this.storage.get("coupon").then((data)=>{
      if(data == null)
      {
        this.temp2 = "No Coupon";
      }
      else{
      this.temp2 = data;
      console.log(this.temp2);}
      //this.newOrder.billing_address.id = this.temp1;
      }); 

    this.storage.get("amount").then((data)=>{
      this.temp3 = "-" + data;
      //this.newOrder.billing_address.id = this.temp1;
      }); 
  
  }

  selectpaylater(){
    this.paylaterselected = false;
  }

  continuepaylater(){
    this.showLoader();
    let data1: any = {};
    data1 = {
      payment_details: {
        method_id: "paylater",
        method_title: "Hapington Pay Later",
        paid: true,
        //coupon_lines: this.userInfo.coupon
      },

      billing_address: this.details.billing_address,
      shipping_address: this.details.shipping_address,
      customer_id: this.userInfo.id || '',
      line_items: this.details.line_items,
      shipping_lines: [
        {
          method_id: this.newOrder.billing_address.id,
          method_title: this.newOrder.billing_address.title,
          total: this.newOrder.billing_address.charge
        }
      ],
      coupon_lines: [{
        "id":this.temp1,
         "code": this.temp2,
         //"amount":this.newOrder.billing_address.amount,
      }],
      fee_lines: [{
        "title": this.temp2,
         "total": this.temp3,
      }],
      
    };

    let orderData: any = {};

        orderData.order = data1;
        console.log(orderData)

        this.WooCommerce.postAsync("orders", orderData).then((data) => {

          let response = (JSON.parse(data.body).order);
          //this.loading.dismiss();
         // console.log("Done Loading " + this.loading);
         console.log(JSON.parse(data.body).order)
         this.storage.set("tempOrderid", response.order_number);
         this.storage.remove("coupon");
         this.storage.remove("id");
         this.storage.remove("amount");
         if(this.route == "follow"){
          
          this.loading.dismiss();
         this.navCtrl.push(ConfirmationPage);
       }
     else{
      
       //this.viewCtrl.dismiss().then(() => {
        
        this.loading.dismiss();
         this.navCtrl.push(ConfirmationPage);
         
         //this.navCtrl.setRoot(MenuPage);
    // });
     }

         

        })


  }

  paylaterradio() {
    this.paylaterselected = true;
  }



  
payrazorpay(){
    var options = {
      description: 'HappyEC order.',
      image: 'https://www.hapington.com/app/imgs/icon.png',
      currency: 'INR',
      key: 'rzp_test_PelLDnNDT7SLAR',
      amount: this.razoramount,
      name: 'HappyEC - A Hapington Venture',
      /*prefill: {
        email: 'demo@email.com',
        contact: '1234567890',
        name: 'My Name'
      },*/
      theme: {
        color: '#F37254'
      },
      modal: {
        ondismiss: function() {
          //alert('dismissed')
        }
      }
    };
    let vm = this;
    var successCallback = function(payment_id) {
      vm.paymentid = payment_id;
      console.log(payment_id);
      if(payment_id != null){
        vm.showLoader();
        vm.razorsuccess = true;
         
        //vm.navCtrl.push(RazorconfirmPage);
        console.log(vm.razorsuccess);

        let data1: any = {};
      data1 = {
      payment_details: {
        method_id: "RazorPay Prepaid_" + vm.paymentid,
        method_title: vm.paymentid,
        paid: true,
        //coupon_lines: this.userInfo.coupon
      },

      billing_address: vm.details.billing_address,
      shipping_address: vm.details.shipping_address,
      customer_id: vm.userInfo.id || '',
      line_items: vm.details.line_items,
      shipping_lines: [
        {
          method_id: vm.newOrder.billing_address.id,
          method_title: vm.newOrder.billing_address.title,
          total: vm.newOrder.billing_address.charge
        }
      ],
      coupon_lines: [{
        "id":vm.temp1,
         "code": vm.temp2,
         //"amount":this.newOrder.billing_address.amount,
      }],
      fee_lines: [{
        "title": vm.temp2,
         "total": vm.temp3,
      }],
      
    };

    let orderData: any = {};

        orderData.order = data1;
        console.log(orderData)

        vm.WooCommerce.postAsync("orders", orderData).then((data) => {

          let response = (JSON.parse(data.body).order);
          //this.loading.dismiss();
         // console.log("Done Loading " + this.loading);
         console.log(JSON.parse(data.body).order)
         vm.storage.set("tempOrderid", response.order_number);
         vm.storage.remove("coupon");
         vm.storage.remove("id");
         vm.storage.remove("amount");
         if(vm.route == "follow"){
          
          vm.loading.dismiss();
         vm.navCtrl.push(ConfirmationPage);
       }
     else{
      
       //this.viewCtrl.dismiss().then(() => {
        
        vm.loading.dismiss();
         vm.navCtrl.push(ConfirmationPage);
         
         //this.navCtrl.setRoot(MenuPage);
    // });
     }

         

        })
    

        
        
      
      }
    };
    console.log(vm.razorsuccess);
  

    var cancelCallback = function(error) {
      
      //this.navCtrl.pop();
      //alert(error.description + ' (Error ' + error.code + ')');
      //this.viewCtrl.dismiss();
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);

  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }




  

}
