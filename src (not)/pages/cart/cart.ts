import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, App, Item, Events ,LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CheckoutPage } from '../checkout/checkout';
import { LoginPage } from '../login/login';
import * as WC from 'woocommerce-api';
import { Badge } from '@ionic-native/badge';
import { MenuPage } from '../menu/menu';
import { HomePage } from '../home/home';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  cartItems: any[] = [];
  newCoupon: any = {};
  total: any;
  showEmptyCartMessage: boolean = false;
  cartvalid: boolean;
  WooCommerce: any;
  couponapplied: boolean;
  discount: any;
  individual: any;
  loading: any;
  userInfo: any;
  temp: any = {};
  route: any;
  temp1: any;
  temp2: any;
  temp3: any;
  badge1: any;
  temp4: any;
  //badge2: any;
  constructor(private badge: Badge,public loadingCtrl : LoadingController, public events: Events, private appCtrl: App, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public ngZone: NgZone, public viewCtrl: ViewController, public toastController: ToastController) {

    this.total = 0.0;
    this.WooCommerce = WC({
      url: "http://www.happyfruit.in/",
      consumerKey: "ck_349f29c988202cb1051ee2563824804083be5706",
      consumerSecret: "cs_de2719c4dc0cf0ca252dae26f74c025435f389e4"
    });
  

      this.storage.ready().then(()=>{
      
      this.storage.get("cart").then( (data)=>{
        this.cartItems = data || [];  
        console.log(this.cartItems);
        this.ngZone.run(() => {
        this.storage.set("cartLength", this.cartItems.length);})
        //console.log(JSON.parse(this.cartItems[0].qty));
        this.temp2 = 0;
        for( let i = 0; i < this.cartItems.length; i ++)
        {
          
          this.temp1 = parseFloat(JSON.parse(this.cartItems[i].qty));
          //console.log(this.temp1);
          this.temp2 = parseFloat(this.temp2) + this.temp1;
          
          //this.temp2 = j;
        }
        console.log(this.temp2);
        this.events.publish("updateBadge", {"badgeValue": this.temp2});
        this.storage.set("finalcartlength", this.temp2);

        if(this.cartItems.length > 0){
          
          //this.badge.set(this.cartItems.length);
          

          this.cartItems.forEach( (item, index)=> {

          if(item.variation){
            this.total = this.total + (parseFloat(item.variation.price) * item.qty);
          } else {
            this.total = this.total + (item.product.price * item.qty);
          }
        }
        )
        

          

        } else {

          this.showEmptyCartMessage = true;
          this.cartvalid = true;
          
}


      })

    })
    this.events.subscribe("updateBadge", (data)=>{
      console.log("updateBadge: " + JSON.stringify(data));
      console.log('hi');
      this.badge1 = data.badgeValue;
      //console.log(this.badge);
      
  })
    
  
  }
  
  


  removeFromCart(item, i){
    

    let price = item.product.price;
    let qty = item.qty;

    this.cartItems.splice(i, 1);
    

    this.storage.set("cart", this.cartItems).then( ()=> {

      this.total = this.total - (price * qty);
      this.storage.set("cartLength", this.cartItems.length);
      

      
    });
    this.temp3 = this.badge1 - parseFloat(qty);
      console.log("temp3", this.temp3);
    
  this.events.publish("updateBadge", {"badgeValue": this.temp3});
  this.storage.set("finalcartlength", this.temp3);
    if(this.cartItems.length == 0){
      this.showEmptyCartMessage = true;
      this.cartvalid = true;
    }


  }

  closeModal(){
    //this.viewCtrl.dismiss().then(() => {
      
      //this.appCtrl.getRootNav().setRoot(MenuPage);
      this.viewCtrl.dismiss();
      this.viewCtrl._willEnter();
      
      //this.loadData("Data");
      //this.navCtrl.setRoot(MenuPage);
  //});
    //ionViewWillEnter() {
    //closeModal(){
    //this.viewCtrl.dismiss();
  }//}
  checkout(){
    this.storage.get("userLoginInfo").then( (data) => {
      this.storage.remove("carttotal");
      this.storage.set("carttotal",this.total);
      if(data != null){
        this.viewCtrl.dismiss();
        this.navCtrl.push(CheckoutPage);
      } else {
        this.navCtrl.push(LoginPage, {next: CheckoutPage});
      }
    })

  }

  changeQty(item, i, change){
    
        let price;
        
    
    if(!item.variation)
      price = item.product.price;
    else
      price = parseFloat(item.variation.price);
    
    let  qty = item.qty;

    if(change < 0 && item.qty == 1){
      return;
    }

    qty = qty + change;
    
    item.qty = qty;
    item.amount = qty * price;

    this.cartItems[i] = item;

    this.storage.set("cart", this.cartItems).then( ()=> {
      //this.storage.remove("cartLength");
      //this.storage.set("cartLength", this.cartItems.length);

      this.toastController.create({
        message: "Cart Updated.",
        duration: 2000,
        showCloseButton: true
      }).present();

    });
    this.temp4 = this.badge1 + parseFloat(change);
      console.log("temp4", this.temp4);
    
  this.events.publish("updateBadge", {"badgeValue": this.temp4});
  console.log("setting length")
  this.storage.set("finalcartlength", this.temp4);

    this.total = (parseFloat(this.total.toString()) + (parseFloat(price.toString()) * change));
  }  
  
        //couponsent.push(this.storecoupon);
        //console.log(this.storecoupon)
     

  checkCoupon(){
    this.showLoader();
    this.storage.get("userLoginInfo").then( (data) => {
      if(data != null){
      
      this.storage.get("userLoginInfo").then((userLoginInfo) => {

      this.userInfo = userLoginInfo.user;
      let email = userLoginInfo.user.email;


      
    
    this.WooCommerce.getAsync("coupons").then((data) => {
      let res = (JSON.parse(data.body));
      console.log(JSON.parse(data.body));
      let temp1: any[] = JSON.parse(data.body).coupons;
      console.log(temp1);

      for( let i = 0; i < temp1.length; i ++){
        if(temp1[i].code == this.newCoupon.coupon){
            this.temp = temp1[i];
        }


      }


        if(this.temp.code == this.newCoupon.coupon){
          if(this.temp.usage_limit > this.temp.usage_count){
          //console.log(email);
          //let indiv: any[] = temp[i].individual_use;
          if(this.temp.individual_use == true){
            console.log(this.temp.used_by)
            //console.log(this.temp.individual_use);
          let emails: any[] = this.temp.customer_emails;
          console.log(emails);
          for( let i = 0; i < emails.length; i ++){
          if(emails[i] == email){
            console.log(emails[i]);
          console.log("Valid");
          this.storage.remove("coupon");
          this.storage.set("coupon", this.newCoupon.coupon);
          this.storage.remove("id");
          this.storage.set("id", this.temp.id);
          this.storage.remove("amount");
          this.storage.set("amount", this.temp.amount);
          this.toastController.create({
            message: "Coupon Applied Successfully.",
            duration: 1000,
            showCloseButton: false
          }).present();
          this.couponapplied = true;
          this.discount = this.temp.amount;
          if(this.temp.minimum_amount <= this.total && this.temp.maximum_amount >= this.total)
          {
          this.total = this.total - this.discount;
        }
          else{
            this.total = this.total;
          }


        }
        else{
          console.log("Not Valid");
          this.toastController.create({
            message: "Invalid or expired code.",
            duration: 1000,
            showCloseButton: false
          }).present();


        }}}








        else{
          //console.log(this.temp.individual_use);
          console.log("Valid");
          //console.log(this.temp.id);
          
          this.couponapplied = true;
          this.storage.remove("coupon");
          this.storage.set("coupon", this.newCoupon.coupon);
          this.storage.remove("id");
          this.storage.set("id", this.temp.id);
          this.storage.remove("amount");
          this.storage.set("amount", this.temp.amount);
          this.storage.get("coupon").then((data)=>{
            console.log(data);
         });
         this.storage.get("id").then((data)=>{
            console.log(data);
         });
         this.storage.get("amount").then((data)=>{
            console.log(data);
         });
          
          this.discount = this.temp.amount;
          console.log(this.temp.minimum_amount);
          if(parseFloat(this.temp.minimum_amount) <= parseFloat(this.total) && parseFloat(this.temp.maximum_amount) >= parseFloat(this.total))
          {
          this.total = this.total - this.discount;
          this.toastController.create({
            message: "Coupon Applied Successfully.",
            duration: 1000,
            showCloseButton: false
          }).present();
        }
          else{
            this.total = this.total;
            this.couponapplied = false;
            this.newCoupon.coupon = [];
            this.toastController.create({
              message: "Min. amount required.",
              duration: 1000,
              showCloseButton: false
            }).present();
          }
        }}
        else{
          console.log("Not Valid")
          this.toastController.create({
            message: "Invalid or expired code.",
            duration: 1000,
            showCloseButton: false
          }).present();
        }
      
      }
        else{
          console.log("Not Valid")
          this.toastController.create({
            message: "Invalid or expired code.",
            duration: 1000,
            showCloseButton: false
          }).present();
        }
      


  
  
  
    }
    
    
    
    
    
    );

    

  });}
  else {
    this.navCtrl.push(LoginPage, {next: CartPage});
  }


});
this.loading.dismiss();
}

  removeCoupon(){

    this.couponapplied = false;
    this.newCoupon.coupon = [];
    this.total = this.total + parseFloat(this.discount);
    //console.log(this.storage.remove("coupon"));
    //console.log(this.storage.remove("id")); 
    //console.log(this.storage.remove("amount"));


  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Validating Code'
    });
    this.loading.present();
  }

  
}

