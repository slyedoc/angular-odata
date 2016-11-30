/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />
import { assert } from 'chai';
import { Observable, Operator } from 'rxjs/rx';
import { Location } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, ConnectionBackend, HttpModule } from '@angular/http';
import { IEmployee } from './helpers/employee';
import { ODataQuery, PagedResult } from '../odata-query';
import { ODataServiceFactory } from '../odata.service.factory';
import { ODataConfigService } from '../odata-config.service';

export class ODataQueryMock<IEmployee> extends ODataQuery<IEmployee> {
    public Exec(): Observable<Array<IEmployee>> {
        return Observable.of(new Array<IEmployee>());
    }

    public ExecWithCount(): Observable<PagedResult<IEmployee>> {
        let p = new PagedResult<IEmployee>();
        p.count = 0;
        p.data = new Array<IEmployee>();
        return Observable.of(p);
    }
}

describe('ODataQuery', () => {
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

    // it('Exec', inject([ Http, ODataConfigService ], (http: Http, config: ODataConfigService) => {
    //     // Assign
    //     let query = new ODataQueryMock<IEmployee>('Employees', config, http);

    //     // Act
    //     query
    //         .Filter('x')
    //         .Top(10)
    //         .Skip(20)
    //         .OrderBy('x');

    //     let result = query.Exec();

    //     // Assert
    //     // spyOn(http, 'get');
    //     // expect(http.get).toHaveBeenCalled();
    // }));

    it('Filter(string)', inject([ Http, ODataConfigService ], (http: Http, config: ODataConfigService) => {
        // Assign
        let test = new ODataQueryMock<IEmployee>('Employees', config, http);

        // Act
        test.Filter('x');

        // Assert
        assert.equal(test['_filter'], 'x');
    }));

    it('OrderBy(string)', inject([ Http, ODataConfigService ], (http: Http, config: ODataConfigService) => {
        // Assign
        let test = new ODataQueryMock<IEmployee>('Employees', config, http);

        // Act
        test.OrderBy('o');

        // Assert
        assert.equal(test['_orderBy'], 'o');
    }));

    it('Skip(number)', inject([ Http, ODataConfigService ], (http: Http, config: ODataConfigService) => {
        // Assign
        let test = new ODataQueryMock<IEmployee>('Employees', config, http);

        // Act
        test.Skip(10);

        // Assert
        assert.equal(test['_skip'], 10);
    }));

    it('Top(number)', inject([ Http, ODataConfigService ], (http: Http, config: ODataConfigService) => {
        // Assign
        let test = new ODataQueryMock<IEmployee>('Employees', config, http);

        // Act
        test.Top(20);

        // Assert
        assert.equal(test['_top'], 20);
    }));
});
