import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Logger } from '../../providers/logger/logger';

// providers
import { ConfigProvider } from '../../providers/config/config';
import { LanguageProvider } from '../../providers/language/language';
import { PersistenceProvider } from '../../providers/persistence/persistence';
import { PlatformProvider } from '../../providers/platform/platform';

/* TODO: implement interface propertly
interface App {
  packageName: string;
  packageDescription: string;
  packageNameId: string;
  themeColor: string;
  userVisibleName: string;
  purposeLine: string;
  bundleName: string;
  appUri: string;
  name: string;
  nameNoSpace: string;
  nameCase: string;
  nameCaseNoSpace: string;
  gitHubRepoName: string;
  gitHubRepoUrl: string;
  gitHubRepoBugs: string;
  disclaimerUrl: string;
  url: string;
  appDescription: string;
  winAppName: string;
  WindowsStoreIdentityName: string;
  WindowsStoreDisplayName: string;
  windowsAppId: string;
  pushSenderId: string;
  description: string;
  version: string;
  androidVersion: string;
  commitHash: string;
  _extraCSS: string;
  _enabledExtensions: any;
}*/

@Injectable()
export class AppProvider {
  public info: any;
  public servicesInfo: any;
  private jsonPathApp: string = 'assets/appConfig.json';
  private jsonPathServices: string = 'assets/externalServices.json';

  constructor(
    public http: HttpClient,
    private logger: Logger,
    private language: LanguageProvider,
    public config: ConfigProvider,
    private persistence: PersistenceProvider,
    private platformProvider: PlatformProvider
  ) {
    this.logger.info('AppProvider initialized.');
  }

  public load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.persistence.load();
      this.config
        .load()
        .then(() => {
          this.language.load();
          this.getServicesInfo().subscribe(infoServices => {
            this.servicesInfo = infoServices;
            this.getInfo().subscribe(infoApp => {
              this.info = infoApp;
              if (this.platformProvider.isNW) this.setCustomMenuBarNW();
              resolve();
            });
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private setCustomMenuBarNW() {
    let gui = (window as any).require('nw.gui');
    let win = gui.Window.get();
    let nativeMenuBar = new gui.Menu({
      type: 'menubar'
    });
    try {
      nativeMenuBar.createMacBuiltin(this.info.nameCase);
    } catch (e) {
      this.logger.debug('This is not OSX');
    }
    win.menu = nativeMenuBar;
  }

  private getInfo() {
    return this.http.get(this.jsonPathApp);
  }

  private getServicesInfo() {
    return this.http.get(this.jsonPathServices);
  }
}
