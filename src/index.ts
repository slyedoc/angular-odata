import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { ODataService } from './odata.service';
import { ODataConfigService, ODataConfigServiceConfig } from './odata-config.service';
import { ODataQuery, PagedResult } from './odata-query';
import { ODataServiceFactory } from './odata.service.factory';
import { ODataGetOperation } from './odata-operation';

@NgModule({
    imports: [],
    declarations: [
        ODataService,
        ODataConfigService,
        ODataQuery,
        PagedResult,
        ODataServiceFactory,
        ODataGetOperation],
    exports: [
        ODataService,
        ODataConfigService,
        ODataQuery,
        PagedResult,
        ODataServiceFactory,
        ODataGetOperation
    ],
    providers: [ODataService]
})
export class ODataModule {
    constructor(@Optional() @SkipSelf() parentModule: ODataModule) {
        if (parentModule) {
            throw new Error('ODataModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config: ODataConfigServiceConfig): ModuleWithProviders {
        return {
            ngModule: ODataModule,
            providers: [
                {provide: ODataConfigService, useValue: config }
            ]
        };
    }
}