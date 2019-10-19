import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, Events } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';
import { Badge } from '@ionic-native/badge';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';


@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  product: any;
  WooCommerce : any;
  reviews: any[] = [];
  badge1: any;
  temp1: any;
  temp2: any;
  temp: any;
  temp4: any;
  temp3: any;
  

  constructor(public events: Events, private WP: WoocommerceProvider, private badge: Badge, public navCtrl: NavController, public navParams: NavParams, public ngZone: NgZone, public storage: Storage, public toastCtrl: ToastController, public modalCtrl: ModalController) {
    this.product = this.navParams.get("product");
    this.temp3 = 0;
    this.storage.get("finalcartlength").then((data)=>{
      console.log("start", data);
      this.temp4 = data;
      if(this.temp4 > 0){
      this.events.publish("updateBadge", {"badgeValue": this.temp4});
      this.badge = this.temp;}
      else{
        this.events.publish("updateBadge", {"badgeValue": 0});
        this.badge = this.temp3;
      }
  });
    
    
    
    console.log(this.product);

    this.WooCommerce = WP.init();
    

  }

  ionViewDidLoad(){
    this.WooCommerce.getAsync('products/'+this.product.id + '/reviews').then((data)=> {
      this.ngZone.run(() => {
      this.reviews = JSON.parse(data.body).product_reviews;
      })
      console.log(this.reviews);

    }, (err)=> {
      console.log(err);
    })

    this.events.subscribe("updateBadge", (data)=>{
      console.log("updateBadge: " + JSON.stringify(data));
      console.log('hi');
      this.badge1 = data.badgeValue;
      //console.log(this.badge);
      
  })
  }
  
  addToCart(product) {

    this.storage.get("cart").then((data) => {

      if (data == null || data.length == 0) {
        data = [];

        data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
        })

        this.temp2 = this.badge1 + 1;
       this.events.publish("updateBadge", {"badgeValue": this.temp2});
       this.storage.set("finalcartlength", this.temp2);
      } else {

        let added = 0;

        for (let i = 0; i < data.length; i++) {

          if (product.id == data[i].product.id) {
            let qty = data[i].qty;
            this.temp1 = this.badge1 + 1;
            this.events.publish("updateBadge", {"badgeValue": this.temp1});
            this.storage.set("finalcartlength", this.temp1);
            console.log("Product is already in the cart");

            data[i].qty = qty + 1;
            data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
            added = 1;
          }

        }

        if (added == 0) {
          data.push({
            "product": product,
            "qty": 1,
            "amount": parseFloat(product.price)
          })
        }

      }
      
      
      

      this.storage.set("cart", data).then(() => {
        console.log("Cart Updated");
        console.log(data);

        this.toastCtrl.create({
          message: "Added to cart",
          duration: 1000
        }).present();

      })

    })

  }

  openCart(){
  

    //this.modalCtrl.create(CartPage).present();
    this.navCtrl.push(CartPage);

  }

  /*doRefresh(refresher) {
    this.navCtrl.pop();
    this.navCtrl.push(ProductDetailsPage, {"product": this.product});
    console.log('Begin async operation', refresher);
  
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }*/

  doRefresh(refresher) {
    
    this.ionViewDidLoad();
    
    console.log('Started', refresher);
    setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
    }, 3000);
  }



  }
