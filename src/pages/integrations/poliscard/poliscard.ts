import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { Logger } from '../../../providers/logger/logger';

@Component({
  selector: 'page-poliscard',
  templateUrl: 'poliscard.html',
})
export class PolisCardPage {

  public services: any;
  constructor(
    private logger: Logger,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private navParams: NavParams
  ) {
    this.services = [
      {
        url : 'https://www.southxchange.com/Market/Book/POLIS/BTC',
        caption : 'Southxchange'
      },
      {
        url : 'https://stocks.exchange/trade/POLIS/BTC',
        caption : 'Stocks.exchange'
      },
      {
        url : 'https://www.cryptopia.co.nz/Exchange?market=POLIS_BTC',
        caption : 'Cryptopia'
      },
      {
        url : 'https://wallet.crypto-bridge.org/market/BRIDGE.POLIS_BRIDGE.BTC',
        caption : 'CryptoBridge'
      }
    ];
  }

  ionViewDidLoad() {
    this.logger.info('ionViewDidLoad PolisCardPage');
  }

  ionViewWillEnter() {
    this.logger.info('ionViewWillEnter PolisCardPage');
  }

  public openMarket(url: string): void {
    window.open(url, '_self');
  }
}
