import { Injectable } from '@angular/core';

import { Logger } from '../../providers/logger/logger';

import * as BWCBitcoin from 'bitcore-wallet-client';
import * as BWCDash from 'bitcore-wallet-client-dash';
import * as BWCMonoeci from 'bitcore-wallet-client-monoeci';
import * as BWCGoByte from 'bitcore-wallet-client-gobyte';
import * as BWCColossusXT from 'bitcore-wallet-client-colx';
import * as BWCPolis from 'bitcore-wallet-client-polis';


@Injectable()
export class BwcProvider {
  constructor(
    private logger: Logger
  ) {
    this.logger.info('BwcProvider initialized.');
  }
  public getBitcore(coin?): any {
	if( coin === 'btc'){
	  return BWCBitcoin.Bitcore;
	} else if ( coin === 'polis' ){
	  return BWCPolis.Bitcore;
	} else if ( coin === 'dash' ){
	  return BWCDash.Bitcore;
	} else if ( coin === 'xmcc' ){
      return BWCMonoeci.Bitcore;
    } else if ( coin === 'gbx' ){
      return BWCGoByte.Bitcore;
    } else if ( coin === 'colx' ){
      return BWCColossusXT.Bitcore;
    }
    return BWCBitcoin.Bitcore;
  }

  public getBitcorePolis(): any {
    return BWCPolis.Bitcore;
  }

  public getBitcoreDash(): any {
    return BWCDash.Bitcore;
  }

  public getBitcoreMonoeci(): any {
    return BWCMonoeci.Bitcore;
  }
  
  public getBitcoreGoByte(): any {
    return BWCGoByte.Bitcore;
  }
  
  public getBitcoreColossusXT(): any {
    return BWCColossusXT.Bitcore;
  }

  public getErrors(): any { // No bitcore connections - just a lib of errors - Polis bitcore has specific errors (InstantSend, ..)
    return BWCPolis.errors;
  }

  public getSJCL(): any { // No bitcore connections - Just a descriptor of crypto words
    return BWCPolis.sjcl;
  }


  public getUtils(coin: string): any {
    if( coin === 'btc' ){
		return BWCBitcoin.Utils;
	} else if ( coin === 'dash' ){
	  return BWCDash.Utils;
	} else if ( coin === 'xmcc' ){
      return BWCMonoeci.Utils;
    } else if ( coin === 'gbx' ){
      return BWCGoByte.Utils;
    } else if ( coin === 'colx' ){
      return BWCColossusXT.Utils;
    }
    return BWCPolis.Utils;
  }

  public parseSecretBtc(opts): any {// Bitcore connections
	return BWCBitcoin.parseSecret(opts);
  }

  public parseSecretPolis(opts): any {
	return BWCPolis.parseSecret(opts);
  }

  public parseSecretDash(opts): any {
  return BWCDash.parseSecret(opts);
  }

  public parseSecretMonoeci(opts): any {
  return BWCMonoeci.parseSecret(opts);
  }
  
  public parseSecretGoByte(opts): any {
  return BWCGoByte.parseSecret(opts);
  }
  
  public parseSecretColossusXT(opts): any {
  return BWCColossusXT.parseSecret(opts);
  }

  public getClient(coin: string, walletData?, opts?): any { // Bitcore connections
    opts = opts || {};

	let bwc = null;
	if ( coin === 'btc' ){
		// note opts use `bwsurl` all lowercase;
		bwc = new BWCBitcoin({
		  baseUrl: opts.bwsurl || 'https://bws-btc.monoeci.io/bws/api',
		  verbose: opts.verbose,
		  timeout: 100000,
		  transports: ['polling'],
		});
	} else if ( coin === 'polis' ) {
		// note opts use `bwsurl` all lowercase;
		bwc = new BWCPolis({
		  baseUrl: opts.bwsurl || 'https://bws-polis.monoeci.io/bws/api',
		  verbose: opts.verbose,
		  timeout: 100000,
		  transports: ['polling'],
		});
	}
  else if ( coin === 'dash' ) {
		// note opts use `bwsurl` all lowercase;
		bwc = new BWCDash({
		  baseUrl: opts.bwsurl || 'https://bws-dash.monoeci.io/bws/api',
		  verbose: opts.verbose,
		  timeout: 100000,
		  transports: ['polling'],
		});
	}
  else if ( coin === 'xmcc' ) {
    // note opts use `bwsurl` all lowercase;
    bwc = new BWCMonoeci({
      baseUrl: opts.bwsurl || 'https://bws-xmcc.monoeci.io/bws/api',
      verbose: opts.verbose,
      timeout: 100000,
      transports: ['polling'],
    });
  }
  else if ( coin === 'gbx' ) {
    // note opts use `bwsurl` all lowercase;
    bwc = new BWCGoByte({
      baseUrl: opts.bwsurl || 'https://bws-gbx.monoeci.io/bws/api',
      verbose: opts.verbose,
      timeout: 100000,
      transports: ['polling'],
    });
  }
  else if ( coin === 'colx' ) {
    // note opts use `bwsurl` all lowercase;
    bwc = new BWCColossusXT({
      baseUrl: opts.bwsurl || 'https://bws-colx.monoeci.io/bws/api',
      verbose: opts.verbose,
      timeout: 100000,
      transports: ['polling'],
    });
  }

    if (walletData)
      bwc.import(walletData, opts);

    return bwc;
  }

}
