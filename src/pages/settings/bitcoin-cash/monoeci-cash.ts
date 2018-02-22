import { Component } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';
import * as lodash from 'lodash';
import { Logger } from "../../../providers/logger/logger";

// Providers
import { BwcErrorProvider } from "../../../providers/bwc-error/bwc-error";
import { BwcProvider } from "../../../providers/bwc/bwc";
import { ExternalLinkProvider } from "../../../providers/external-link/external-link";
import { OnGoingProcessProvider } from "../../../providers/on-going-process/on-going-process";
import { PopupProvider } from "../../../providers/popup/popup";
import { ProfileProvider } from '../../../providers/profile/profile';
import { PushNotificationsProvider } from "../../../providers/push-notifications/push-notifications";
import { TxFormatProvider } from "../../../providers/tx-format/tx-format";
import { WalletProvider } from "../../../providers/wallet/wallet";

@Component({
	selector: 'page-monoeci-cash',
	templateUrl: 'monoeci-cash.html',
})
export class BitcoinCashPage {
	private walletsXMCC: any[];
	private errors: any;

	public availableWallets: any[];
	public nonEligibleWallets: any[];
	public error: any;

	constructor(
		private navCtrl: NavController,
		private walletProvider: WalletProvider,
		private profileProvider: ProfileProvider,
		private txFormatProvider: TxFormatProvider,
		private onGoingProcessProvider: OnGoingProcessProvider,
		private popupProvider: PopupProvider,
		private pushNotificationsProvider: PushNotificationsProvider,
		private externalLinkProvider: ExternalLinkProvider,
		private bwcErrorProvider: BwcErrorProvider,
		private bwcProvider: BwcProvider,
		private logger: Logger,
		private translate: TranslateService
	) {
		this.walletsXMCC = this.profileProvider.getWallets({
			coin: 'xmcc',
			onlyComplete: true,
			network: 'livenet'
		});
		this.availableWallets = [];
		this.nonEligibleWallets = [];
		this.errors = this.bwcProvider.getErrors();
	}

	ionViewWillEnter() {
		// Filter out already duplicated wallets
		this.walletsXMCC = lodash.filter(this.walletsXMCC, w => {
			return !xPubKeyIndex[w.credentials.xPubKey];
		});

		lodash.each(this.walletsXMCC, (w) => {
			if (w.credentials.derivationStrategy != 'BIP44') {
				w.excludeReason = this.translate.instant('Non BIP44 wallet');
				this.nonEligibleWallets.push(w);
			} else if (!w.canSign()) {
				w.excludeReason = this.translate.instant('Read only wallet');
				this.nonEligibleWallets.push(w);
			} else if (w.needsBackup) {
				w.excludeReason = this.translate.instant('Backup needed');
				this.nonEligibleWallets.push(w);
			} else {
				this.availableWallets.push(w);
			}
		});

		this.availableWallets = this.availableWallets;
		this.nonEligibleWallets = this.nonEligibleWallets;
	}

	public openRecoveryToolLink(): void {
		let url = 'https://bitpay.github.io/copay-recovery/';
		let optIn = true;
		let title = this.translate.instant('Open the recovery tool');
		let okText = this.translate.instant('Open');
		let cancelText = this.translate.instant('Go Back');
		this.externalLinkProvider.open(url, optIn, title, null, okText, cancelText);
	}
}