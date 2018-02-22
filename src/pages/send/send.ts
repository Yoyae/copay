import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Logger } from '../../providers/logger/logger';

// providers
import { AddressBookProvider } from '../../providers/address-book/address-book';
import { AddressProvider } from '../../providers/address/address';
import { IncomingDataProvider } from '../../providers/incoming-data/incoming-data';
import { PopupProvider } from '../../providers/popup/popup';
import { ProfileProvider } from '../../providers/profile/profile';
import { WalletProvider } from '../../providers/wallet/wallet';

// pages
import { AmountPage } from './amount/amount';

import * as _ from 'lodash';

@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class SendPage {
  public search: string = '';
  public walletsXmcc: any;
  public walletXmccList: any;
  public contactsList: object[] = [];
  public filteredContactsList: object[] = [];
  public hasXmccWallets: boolean;
  public hasContacts: boolean;
  public contactsShowMore: boolean;
  public searchFocus: boolean;
  private CONTACTS_SHOW_LIMIT: number = 10;
  private currentContactsPage: number = 0;

  constructor(
    private navCtrl: NavController,
    private profileProvider: ProfileProvider,
    private walletProvider: WalletProvider,
    private addressBookProvider: AddressBookProvider,
    private logger: Logger,
    private incomingDataProvider: IncomingDataProvider,
    private popupProvider: PopupProvider,
    private addressProvider: AddressProvider
  ) { }

  ionViewDidLoad() {
    this.logger.info('ionViewDidLoad SendPage');
  }

  ionViewWillEnter() {
    this.walletsXmcc = this.profileProvider.getWallets({ coin: 'xmcc' });
    this.hasXmccWallets = !(_.isEmpty(this.walletsXmcc));
    this.updateXmccWalletsList();
    this.updateContactsList();
  }

  ionViewDidEnter() {
    this.search = '';
  }

  private updateXmccWalletsList(): void {
    this.walletXmccList = [];

    if (!this.hasXmccWallets) return;

    _.each(this.walletsXmcc, (v: any) => {
      this.walletXmccList.push({
        color: v.color,
        name: v.name,
        recipientType: 'wallet',
        coin: v.coin,
        network: v.network,
        m: v.credentials.m,
        n: v.credentials.n,
        getAddress: (): Promise<any> => {
          return new Promise((resolve, reject) => {
            this.walletProvider.getAddress(v, false).then((addr) => {
              return resolve(addr);
            }).catch((err) => {
              return reject(err);
            });
          });
        }
      });
    });
  }

  private updateContactsList(): void {
    this.addressBookProvider.list().then((ab: any) => {

      this.hasContacts = _.isEmpty(ab) ? false : true;
      if (!this.hasContacts) return;

      this.contactsList = [];
      _.each(ab, (v: any, k: string) => {
        this.contactsList.push({
          name: _.isObject(v) ? v.name : v,
          address: k,
          network: this.addressProvider.validateAddress(k).network,
          email: _.isObject(v) ? v.email : null,
          recipientType: 'contact',
          coin: this.addressProvider.validateAddress(k).coin,
          getAddress: (): Promise<any> => {
            return new Promise((resolve, reject) => {
              return resolve(k);
            });
          }
        });
      });
      let shortContactsList = _.clone(this.contactsList.slice(0, (this.currentContactsPage + 1) * this.CONTACTS_SHOW_LIMIT));
      this.filteredContactsList = _.clone(shortContactsList);
      this.contactsShowMore = this.contactsList.length > shortContactsList.length;
    });
  }

  public showMore(): void {
    this.currentContactsPage++;
    this.updateContactsList();
  }

  public searchInFocus(): void {
    this.searchFocus = true;
  }

  public searchBlurred(): void {
    if (this.search == null || this.search.length == 0) {
      this.searchFocus = false;
    }
  }

  public findContact(search: string): void {
    if (this.incomingDataProvider.redir(search)) return;
    if (search && search.trim() != '') {
      let result = _.filter(this.contactsList, (item: any) => {
        let val = item.name;
        return _.includes(val.toLowerCase(), search.toLowerCase());
      });
      this.filteredContactsList = result;
    } else {
      this.updateContactsList();
    }
  }

  public goToAmount(item: any): void {
    item.getAddress().then((addr: string) => {
      if (!addr) {
        // Error is already formated
        this.popupProvider.ionicAlert('Error - no address');
        return;
      }
      this.logger.debug('Got address:' + addr + ' | ' + item.name);
      this.navCtrl.push(AmountPage, {
        recipientType: item.recipientType,
        toAddress: addr,
        name: item.name,
        email: item.email,
        color: item.color,
        coin: item.coin,
        network: item.network,
      });
      return;
    }).catch((err: any) => {
      this.logger.warn(err);
    });
  };
}
