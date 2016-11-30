import {
    ModuleWithProviders, NgModule,
    Optional, SkipSelf
}       from '@angular/core';

import { ODataService } from './odata.service';
import { ODataServiceConfig } from './odata.service.config';
import { ODataQuery, PagedResult } from './odata-query';
import { ODataServiceFactory } from './odata.service.factory';

@NgModule({
    imports: [],
    declarations: [],
    exports: [
        ODataService,ODataServiceConfig, ODataQuery, PagedResult, ODataServiceFactory
    ],
    providers: [ODataService]
})

export class ODataModule {
    constructor(@Optional() @SkipSelf() parentModule: ODataModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config: ODataServiceConfig): ModuleWithProviders {
        return {
            ngModule: ODataModule,
            providers: [
                {provide: ODataServiceConfig, useValue: config }
            ]
        };
    }
}