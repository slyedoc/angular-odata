import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {ODataConfigService, ODataConfigServiceConfig} from './odata-config.service';
import {ODataServiceFactory} from './odata.service.factory';

export {ODataService} from './odata.service';
export {ODataConfigService, ODataConfigServiceConfig} from './odata-config.service';
export {ODataServiceFactory} from './odata.service.factory';
export {ODataQuery, PagedResult} from './odata-query';
export {ODataGetOperation} from './odata-operation';

@NgModule({imports: [], declarations: [], exports: [], providers: [ODataConfigService]})
export class ODataModule {
  static forRoot(config: ODataConfigServiceConfig): ModuleWithProviders {
    return {ngModule: ODataModule, providers: [{provide: ODataConfigService, useValue: config}, ODataServiceFactory]};
  }

  constructor(@Optional() @SkipSelf() parentModule: ODataModule) {
    if (parentModule) {
      throw new Error('ODataModule is already loaded. Import it in the AppModule only');
    }
  }
}
