import { FormControl } from '@angular/forms';
import { BwcProvider } from '../providers/bwc/bwc';

export class AddressValidator {

  static bitcore: BwcProvider;

  constructor(bwc: BwcProvider) {
    AddressValidator.bitcore = bwc;
  }

  isValid(control: FormControl): any {

    let b = AddressValidator.bitcore.getBitcore();
    let c = AddressValidator.bitcore.getBitcorePolis();
    let d = AddressValidator.bitcore.getBitcoreDash();
    let e = AddressValidator.bitcore.getBitcoreMonoeci();
    let f = AddressValidator.bitcore.getBitcoreGoByte();
    let g = AddressValidator.bitcore.getBitcoreColossusXT();


    let URI = b.URI;
    let Address = b.Address;
    let AddressPolis = c.Address;
    let AddressDash = d.Address;
    let AddressMonoeci = e.Address;
    let AddressGoByte = f.Address;
    let AddressColossusXT = g.Address;

    // Regular url
    if (/^https?:\/\//.test(control.value)) {
      return null;
    }

    // Bip21 uri
    let uri, isAddressValidLivenet, isAddressValidTestnet;
    if (/^bitcoin:/.test(control.value)) {
      let isUriValid = URI.isValid(control.value);
      if (isUriValid) {
        uri = new URI(control.value);
        isAddressValidLivenet = Address.isValid(uri.address.toString(), 'livenet')
        isAddressValidTestnet = Address.isValid(uri.address.toString(), 'testnet')
      }
      if (isUriValid && (isAddressValidLivenet || isAddressValidTestnet)) {
        return null;
      }
    }
	
    // Regular Address: try Bitcoin and Polis
    let regularAddressLivenet = Address.isValid(control.value, 'livenet');
    let regularAddressTestnet = Address.isValid(control.value, 'testnet');
    let regularAddressPolisLivenet = AddressPolis.isValid(control.value, 'livenet');
    let regularAddressDashLivenet = AddressDash.isValid(control.value, 'livenet');
    let regularAddressMonoeciLivenet = AddressMonoeci.isValid(control.value, 'livenet');
    let regularAddressGoByteLivenet = AddressGoByte.isValid(control.value, 'livenet');
    let regularAddressColossusXTLivenet = AddressColossusXT.isValid(control.value, 'livenet');
    if (regularAddressLivenet || regularAddressTestnet || regularAddressPolisLivenet || regularAddressDashLivenet || regularAddressMonoeciLivenet || regularAddressGoByteLivenet || regularAddressColossusXTLivenet) {
      return null;
    }

    return {
      "Invalid Address": true
    };
  }
}