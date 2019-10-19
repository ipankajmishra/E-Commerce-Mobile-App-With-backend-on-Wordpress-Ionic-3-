import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, App } from 'ionic-angular';
import * as WC from 'woocommerce-api';
//import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';
import { ProductDetailsPage } from '../product-details/product-details';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchQuery: string = "";
  WooCommerce: any;
  products: any[] = [];
  page: number = 2;
  loading: any;
  noresult: boolean;
  resultbanner: boolean;
  temp: any;

  constructor(public appCtrl: App, public navCtrl: NavController, public navParams: NavParams,public loadingCtrl : LoadingController, public toastCtrl: ToastController, public ngZone: NgZone) {
    this.showLoader();
    console.log(this.navParams.get("searchQuery"));
    this.searchQuery = this.navParams.get("searchQuery");
    this.temp = this.searchQuery;

    this.WooCommerce = WC({
      url: "http://35.200.207.232/",
      consumerKey: "ck_349f29c988202cb1051ee2563824804083be5706",
      consumerSecret: "cs_de2719c4dc0cf0ca252dae26f74c025435f389e4"
    });
    

    
      this.WooCommerce.getAsync("products?filter[q]=" + this.searchQuery).then((searchData) => {
        this.ngZone.run(() => {
          
          if(JSON.parse(searchData.body).products.length > 0){
            this.products = JSON.parse(searchData.body).products;
            this.noresult = false;
            this.resultbanner = true;
          this.loading.dismiss();}
          else{
            
            this.loading.dismiss();
            this.noresult = true;
          }
    });});
    


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  loadMoreProducts(event){

    this.WooCommerce.getAsync("products?filter[q]=" + this.searchQuery + "&page=" + this.page).then((searchData) => {
      this.products = this.products.concat(JSON.parse(searchData.body).products);

      if(JSON.parse(searchData.body).products.length < 10){
        event.enable(false);

        this.toastCtrl.create({
          message: "No more products!",
          duration: 5000
        }).present();

      }

      event.complete();
      this.page ++;

    });
  }
  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Connecting wires for you...'
    });
    this.loading.present();
  }
  onSearch(event){
    if(this.searchQuery.length > 0){
      this.navCtrl.pop();
      this.navCtrl.push(SearchPage, {"searchQuery": this.searchQuery});
      
      //this.searchQuery= "searchQuery";
      this.searchQuery = "";
      
    }
  }
  openProductPage(product){
    //this.navCtrl.push(ProductDetailsPage, {"product": product})
    this.appCtrl.getRootNavs()[0].push(ProductDetailsPage, {"product" : product})
}

}
