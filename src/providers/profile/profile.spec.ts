import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { Level, NgLoggerModule } from '@nsalaun/ng-logger';
import {
  AlertController,
  App,
  Config,
  Events,
  LoadingController,
  Platform
} from 'ionic-angular';
import * as _ from 'lodash';

import { AppProvider } from '../../providers/app/app';
import { LanguageProvider } from '../../providers/language/language';
import { Logger } from '../../providers/logger/logger';
import { TxFormatProvider } from '../../providers/tx-format/tx-format';
import { BwcErrorProvider } from '../bwc-error/bwc-error';
import { BwcProvider } from '../bwc/bwc';
import { ConfigProvider } from '../config/config';
import { OnGoingProcessProvider } from '../on-going-process/on-going-process';
import { PersistenceProvider } from '../persistence/persistence';
import { PlatformProvider } from '../platform/platform';
import { PopupProvider } from '../popup/popup';
import { WalletProvider } from '../wallet/wallet';
import { ProfileProvider } from './profile';

describe('Profile Provider', () => {
  let profileProvider: ProfileProvider;
  const walletFixture = {
    api1: {
      id: 'eabee25b-d6ab-4b11-8b76-88570d826914',
      cachedBalance: '10.00 XMCC',
      cachedBalanceUpdatedOn: null,
      credentials: {
        coin: 'xmcc',
        network: 'livenet',
        n: 1,
        m: 1
      },
      status: {
        availableBalanceSat: 1000000000 // 10 XMCC
      },
      isComplete: () => {
        return true;
      }
    },
    api3: {
      id: 'qwert25b-d6ab-4b11-8b76-88570d833333',
      cachedBalance: '1.50 XMCC',
      cachedBalanceUpdatedOn: null,
      credentials: {
        coin: 'xmcc',
        network: 'testnet',
        n: 2,
        m: 2
      },
      status: {
        availableBalanceSat: 150000000 // 1.50 XMCC
      },
      isComplete: () => {
        return true;
      }
    }
  };

  class BwcProviderMock {
    constructor() {}
    getErrors() {
      return 'error';
    }
  }

  class PersistenceProviderMock {
    constructor() {}
    getBalanceCache(walletId: any) {
      return Promise.resolve('0.00 XMCC');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        NgLoggerModule.forRoot(Level.LOG),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        AlertController,
        App,
        Config,
        ProfileProvider,
        AppProvider,
        { provide: BwcProvider, useClass: BwcProviderMock },
        BwcErrorProvider,
        ConfigProvider,
        HttpClient,
        LanguageProvider,
        LoadingController,
        Logger,
        OnGoingProcessProvider,
        { provide: PersistenceProvider, useClass: PersistenceProviderMock },
        Platform,
        PlatformProvider,
        PopupProvider,
        TranslateService,
        TxFormatProvider,
        WalletProvider,
        Events
      ]
    });
    profileProvider = TestBed.get(ProfileProvider);
    profileProvider.wallet = walletFixture;
  });

  describe('getWallets()', () => {
    it('should get successfully all wallets when no opts', () => {
      const wallets = profileProvider.getWallets();
      expect(wallets).toEqual(_.values(profileProvider.wallet));
    });

    it('should get successfully all wallets when opts are provided', () => {
      const opts = {
        coin: 'xmcc',
        network: 'testnet',
        n: 2,
        m: 2,
        hasFunds: true,
        minAmount: 0,
        onlyComplete: true
      };
      const wallets = profileProvider.getWallets(opts);
      expect(wallets).toEqual([profileProvider.wallet.api3]);
    });

  });
});
