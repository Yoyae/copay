import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Logger } from '../../providers/logger/logger';

@Injectable()
export class RateProvider {

  private rates: any;
  private ratesBTC: any;
  private alternatives: any[];
  private alternativesBTC: any[];
  private ratesAvailable: boolean;
  private ratesAvailableBTC: boolean;
  
  private FROM_SAT: number;
  private TO_SAT: number;

  private rateServiceUrl = 'https://api.coinmarketcap.com/v1/ticker/monacocoin/';
  private btcRateServiceUrl = 'https://bitpay.com/api/rates';

  constructor(
    private http: HttpClient,
    private logger: Logger
  ) {
    this.logger.info('RateProvider initialized.');
    this.rates = {};
	this.ratesBTC = {};
    this.alternatives = [];
	this.alternativesBTC = [];
    this.FROM_SAT = 1 / 1e8;
    this.TO_SAT = 1e8;
	this.ratesAvailable = false;
	this.ratesAvailableBTC = false;
    this.updateRatesBtc();
    this.updateRatesXmcc();
  }

  private updateRatesBtc(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getBTC().then((dataBTC: any) => {

        _.each(dataBTC, (currency: any) => {
          this.ratesBTC[currency.code] = currency.rate;
		  this.alternativesBTC.push({
            name: currency.name,
            isoCode: currency.code,
            rate: currency.rate
          });
        });
        this.ratesAvailableBTC = true;
        resolve();
      }).catch((errorBTC: any) => {
        this.logger.error(errorBTC);
        reject(errorBTC);
      });
    });
  }

  private updateRatesXmcc(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getXMCC().then((dataXMCC: any) => {
		if (!this.ratesAvailableBTC) {
		  throw "BTC rates not available for XMCC conversion";
		}
		
        _.each(this.alternativesBTC, (currency: any) => {
          this.rates[currency.isoCode] = currency.rate * dataXMCC.data[0].price_btc;
		  this.alternatives.push({
            name: currency.name,
            isoCode: currency.isoCode,
            rate: currency.rate * dataXMCC.data[0].price_btc
          });
        });
		this.ratesAvailable = true;
        resolve();
      }).catch((errorXMCC: any) => {
        this.logger.error(errorXMCC);
        reject(errorXMCC);
      });
    });
  }

  private getBTC(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.btcRateServiceUrl).subscribe((data: any) => {
        resolve(data);
      });
    });
  }

  private getXMCC(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.rateServiceUrl).subscribe((data: any) => {
        resolve(data);
      });
    });
  }

  public getRate(code: string, chain?: string): number {
    if (chain == 'btc')
      return this.ratesBTC[code];
    else
      return this.rates[code];
  }

  public getAlternatives(): any[] {
    return this.alternatives;
  }

  public isAvailable() {
    return this.ratesAvailable;
  }

  public toFiat(satoshis: number, code: string, chain: string): number {
    if (!this.isAvailable()) {
      return null;
    }
    return satoshis * this.FROM_SAT * this.getRate(code, chain);
  }

  public fromFiat(amount: number, code: string, chain: string): number {
    if (!this.isAvailable()) {
      return null;
    }
    return amount / this.getRate(code, chain) * this.TO_SAT;
  }

  public listAlternatives(sort: boolean) {
    let alternatives = _.map(this.getAlternatives(), (item: any) => {
      return {
        name: item.name,
        isoCode: item.isoCode
      }
    });
    if (sort) {
      alternatives.sort((a: any, b: any) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      });
    }
    return _.uniqBy(alternatives, 'isoCode');
  }

  public whenRatesAvailable(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.ratesAvailable) resolve();
      else {
        this.updateRatesBtc().then(() => {
          resolve();
        });
      }
    });
  }

}
