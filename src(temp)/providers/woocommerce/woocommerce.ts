import { Injectable } from '@angular/core';
import * as WC from 'woocommerce-api';


@Injectable()
export class WoocommerceProvider {

  Woocommerce: any;
  WoocommerceV2: any;

  constructor() {
    this.Woocommerce = WC({
      url: "http://happyec.happycake.co.in",
      consumerKey: "ck_8995a7d2d8ad90a5c93da577d09b83c6127fee2b",
      consumerSecret: "cs_67456a4cce6a89197f710ef5d6ee4f1d8d862b70"
    });

    this.WoocommerceV2 = WC({
      url: "http://happyec.happycake.co.in",
      consumerKey: "ck_8995a7d2d8ad90a5c93da577d09b83c6127fee2b",
      consumerSecret: "cs_67456a4cce6a89197f710ef5d6ee4f1d8d862b70",
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
