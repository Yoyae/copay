import { Injectable } from '@angular/core';

// Providers
import { BwcProvider } from '../../providers/bwc/bwc';

@Injectable()
export class AddressProvider {
  private bitcore: any;
  private bitcorePolis: any;
  private bitcoreDash: any;
  private bitcoreMonoeci: any;
  private bitcoreGoByte: any;
  private bitcoreColossusXT: any;
  private Bitcore: any;

  constructor(
    private bwcProvider: BwcProvider,
  ) {
    this.bitcore = this.bwcProvider.getBitcore();
    this.bitcorePolis = this.bwcProvider.getBitcorePolis();
    this.bitcoreDash = this.bwcProvider.getBitcoreDash();
    this.bitcoreMonoeci = this.bwcProvider.getBitcoreMonoeci();
    this.bitcoreGoByte = this.bwcProvider.getBitcoreGoByte();
    this.bitcoreColossusXT = this.bwcProvider.getBitcoreColossusXT();
    this.Bitcore = {
      'btc': {
        lib: this.bitcore,
        translateTo: 'polis'
      },
      'polis': {
        lib: this.bitcorePolis,
        translateTo: 'btc'
      },
      'dash': {
        lib: this.bitcoreDash,
        translateTo: 'btc'
      },
      'monoeci': {
        lib: this.bitcoreMonoeci,
        translateTo: 'btc'
      },
      'gobyte': {
        lib: this.bitcoreGoByte,
        translateTo: 'btc'
      },
      'colossusxt': {
        lib: this.bitcoreColossusXT,
        translateTo: 'btc'
      }
    };
  }

  getCoin(address: string) {
    try {
      new this.Bitcore['btc'].lib.Address(address);
      return 'btc';
    } catch (e) {
      try {
        new this.Bitcore['polis'].lib.Address(address);
        return 'polis';
      } catch (e) {
        try {
          new this.Bitcore['dash'].lib.Address(address);
          return 'dash';
        } catch (e) {
          try {
            new this.Bitcore['monoeci'].lib.Address(address);
            return 'xmcc';
          } catch (e) {
		    try {
              new this.Bitcore['gobyte'].lib.Address(address);
              return 'gbx';
		    } catch (e) {
		      try {
		        new this.Bitcore['colossusxt'].lib.Address(address);
		        return 'colx';
		      } catch (e) {
		        return null;  
			  }
		    }
		  }
        }
      }
    }
  };

  translateAddress(address: string) {
    var origCoin = this.getCoin(address);
    if (!origCoin) return;

    var origAddress = new this.Bitcore[origCoin].lib.Address(address);
    var origObj = origAddress.toObject();

    var resultCoin = this.Bitcore[origCoin].translateTo;
    var resultAddress = this.Bitcore[resultCoin].lib.Address.fromObject(origObj);
    return {
      origCoin,
      origAddress: address,
      resultCoin,
      resultAddress: resultAddress.toString()
    };
  };

  validateAddress(address: string) {
    let Address = this.bitcore.Address;
    let AddressPolis = this.bitcorePolis.Address;
    let AddressDash = this.bitcoreDash.Address;
    let AddressMonoeci = this.bitcoreMonoeci.Address;
    let AddressGoByte = this.bitcoreGoByte.Address;
    let AddressColossusXT = this.bitcoreColossusXT.Address;
    let isLivenet = Address.isValid(address, 'livenet');
    let isTestnet = Address.isValid(address, 'testnet');
    let isLivenetPolis = AddressPolis.isValid(address, 'livenet');
    let isLivenetDash = AddressDash.isValid(address, 'livenet');
    let isLivenetMonoeci = AddressMonoeci.isValid(address, 'livenet');
    let isLivenetGoByte = AddressGoByte.isValid(address, 'livenet');
    let isLivenetColossusXT = AddressColossusXT.isValid(address, 'livenet');
    return {
      address,
      isValid: isLivenet || isTestnet || isLivenetPolis || isLivenetDash || isLivenetMonoeci || isLivenetGoByte || isLivenetColossusXT,
      network: isTestnet ? 'testnet' : 'livenet',
      coin: this.getCoin(address),
      translation: this.translateAddress(address),
    };
  }
}