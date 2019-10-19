import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, App, Events , ModalController } from 'ionic-angular';
import { ProductDetailsPage } from '../product-details/product-details';
import { CartPage } from '../cart/cart';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
import { Badge } from '@ionic-native/badge';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {

  WooCommerce: any;
  products: any[];
  page: number;
  category: any;
  loading: any;
  temp: any;
  cartbadge: any;
  temp2: any;
  temp3: any;

  constructor(private badge: Badge, public events: Events, public storage: Storage, public appCtrl: App,public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public ngZone: NgZone, public toastCtrl: ToastController, public loadingCtrl : LoadingController) {
    this.showLoader();
    this.temp3 = 0;
    this.storage.get("finalcartlength").then((data)=>{
      console.log("start", data);
      this.temp2 = data;
      if(this.temp2 > 0){
      this.events.publish("updateBadge", {"badgeValue": this.temp2});
      this.badge = this.temp2;}
      else{
        this.events.publish("updateBadge", {"badgeValue": 0});
        this.badge = this.temp3;
      }
  });
    console.log("Loading page " + this.showLoader);
    this.page = 1;
    this.category = this.navParams.get("category");
    
    this.WooCommerce = WC({
      url: "http://www.happyfruit.in/",
      consumerKey: "ck_349f29c988202cb1051ee2563824804083be5706",
      consumerSecret: "cs_de2719c4dc0cf0ca252dae26f74c025435f389e4"
    });

    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then( (data) => {
      console.log(JSON.parse(data.body));
      this.ngZone.run(() => {
        this.products = JSON.parse(data.body).products;
      })
      this.loading.dismiss();
      console.log("Done Loading " + this.loading);
    }, (err) => {
      console.log(err)  
    })

    
      
        
  
        //couponsent.push(this.storecoupon);
        //console.log(this.storecoupon)
    
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
    this.events.subscribe("updateBadge", (data)=>{
        console.log("updateBadge: " + JSON.stringify(data));
        console.log('hi');
        this.badge = data.badgeValue;
    })
  }

  loadMoreProducts(event) {
    this.page++;
    console.log("Getting page " + this.page);
    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=" + this.page).then((data) => {
      let temp = (JSON.parse(data.body).products);
      this.products = this.products.concat(JSON.parse(data.body).products)
      console.log(this.products);
      if(event != null)
      {
        event.complete();
      }
      if(temp.length < 10){
        event.enable(false);

        this.toastCtrl.create({
          message: "No More products!",
          duration: 3000
        }).present();
      }
    })
    
  }
  openProductPage(product){
    //this.navCtrl.push(ProductDetailsPage, {"product": product})
    this.appCtrl.getRootNavs()[0].push(ProductDetailsPage, {"product" : product})
}
openCart(){

  this.modalCtrl.create(CartPage).present();

}

    
  



}
