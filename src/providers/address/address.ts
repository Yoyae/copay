import { Injectable } from '@angular/core';

// Providers
import { BwcProvider } from '../../providers/bwc/bwc';

@Injectable()
export class AddressProvider {
  private bitcore: any;
  private Bitcore: any;

  constructor(
    private bwcProvider: BwcProvider,
  ) {
    this.bitcore = this.bwcProvider.getBitcore();
    this.Bitcore = {
      'xmcc': {
        lib: this.bitcore
      }
    };
  }

  getCoin(address: string) {
    try {
      new this.Bitcore['xmcc'].lib.Address(address);
      return 'xmcc';
    } catch (e) {
      return null;
    }
  };

  validateAddress(address: string) {
    let Address = this.bitcore.Address;
    let isLivenet = Address.isValid(address, 'livenet');
    let isTestnet = Address.isValid(address, 'testnet');
    return {
      address,
      isValid: isLivenet || isTestnet,
      network: isTestnet ? 'testnet' : 'livenet',
      coin: this.getCoin(address)
    };
  }
}