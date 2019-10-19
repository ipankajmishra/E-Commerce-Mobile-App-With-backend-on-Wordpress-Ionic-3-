import { Injectable } from '@angular/core';
import * as WC from 'woocommerce-api';


@Injectable()
export class WoocommerceProvider {

  Woocommerce: any;
  WoocommerceV2: any;

  constructor() {
    this.Woocommerce = WC({
        url: "https://happyec.in/",
        consumerKey: "ck_349f29c988202cb1051ee2563824804083be5706",
        consumerSecret: "cs_de2719c4dc0cf0ca252dae26f74c025435f389e4"
    });

    this.WoocommerceV2 = WC({
        url: "https://happyec.in/",
        consumerKey: "ck_349f29c988202cb1051ee2563824804083be5706",
        consumerSecret: "cs_de2719c4dc0cf0ca252dae26f74c025435f389e4",
      wpAPI: true,
      version: "wc/v2"
    });
  }

  init(v2?: boolean){
    if(v2 == true){
      return this.WoocommerceV2;
    } else {
      return this.Woocommerce;
    }
  }

}