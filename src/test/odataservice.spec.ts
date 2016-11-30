/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />
import { assert } from 'chai';
import { Observable, Operator } from 'rxjs/rx';
import { Location } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, ConnectionBackend, HttpModule } from '@angular/http';
import { IEmployee } from './helpers/employee';
import { ODataOperation } from '../odata-operation';
import { ODataServiceFactory } from '../odata.service.factory';
import { ODataConfigService } from '../odata-config.service';

describe('ODataService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BaseRequestOptions,
                MockBackend,
                {
                    provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                // {
                //     provide: Location, useFactory: () => {
                //         return {
                //             path: 'http://localhost/test'
                //         };
                //     }
                // },
                ODataConfigService,
                ODataServiceFactory
            ],
            imports: [
                HttpModule
            ]
        });
    });

    it('Construct via injection', inject([ ODataServiceFactory ], (factory: ODataServiceFactory) => {
        // Act
        let service = factory.CreateService<IEmployee>('Employees');

        // Assert
        assert.isNotNull(service);
    }));
});
