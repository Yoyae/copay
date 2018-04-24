import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { Logger } from '../../../providers/logger/logger';

@Component({
  selector: 'page-monoeci',
  templateUrl: 'monoeci.html',
})
export class BuySellMonoeciPage {

  public services: any;
  constructor(
    private logger: Logger,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private navParams: NavParams
  ) {
    this.services = [
      {
        url : 'https://www.cryptopia.co.nz/Exchange/?market=XMCC_BTC',
        caption : 'Cryptopia'
      },
	  {
        url : 'https://wallet.crypto-bridge.org/market/BRIDGE.XMCC_BRIDGE.BTC',
        caption : 'CryptoBridge'
      },
      {
        url : 'https://www.coinexchange.io/market/XMCC/BTC',
        caption : 'CoinExchange'
      },
      {
        url : 'https://crex24.com/fr/',
        caption : 'Crex24'
      }
    ];
  }

  ionViewDidLoad() {
    this.logger.info('ionViewDidLoad Buy Sell Monoeci Page');
  }

  ionViewWillEnter() {
    this.logger.info('ionViewWillEnter Buy Sell Monoeci Page');
  }

  public openMarket(url: string): void {
    window.open(url, '_self');
  }
}
