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

export class ODataOperationTest<IEmployee> extends ODataOperation<IEmployee> {
    public Exec(): Observable<Array<IEmployee>> {
        return Observable.of(new Array<IEmployee>());
    }
}

describe('ODataOperation', () => {
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

    it('Expand(string) via injection', inject([ Http, ODataConfigService ], (http: Http, config: ODataConfigService) => {
        // Assign
        let test = new ODataOperationTest<IEmployee>('Employees', config, http);

        // Act
        test.Expand('x');

        // Assert
        assert.equal(test['_expand'], 'x');
    }));

    it('Expand(string)', () => {
        // Assign
        let test = new ODataOperationTest<IEmployee>('Employees', null, null);

        // Act
        test.Expand('x, y');

        // Assert
        assert.equal(test['_expand'], 'x, y');
    });

    it('Expand(string[])', () => {
        // Assign
        let test = new ODataOperationTest<IEmployee>('Employees', null, null);

        // Act
        test.Expand([ 'a', 'b' ]);

        // Assert
        assert.equal(test['_expand'], 'a,b');
    });

    it('Select(string)', () => {
        // Assign
        let test = new ODataOperationTest<IEmployee>('Employees', null, null);

        // Act
        test.Select('x,y,z');

        // Assert
        assert.equal(test['_select'], 'x,y,z');
    });

    it('Select(string[])', () => {
        // Assign
        let test = new ODataOperationTest<IEmployee>('Employees', null, null);

        // Act
        test.Select([ 'a', 'b' ]);

        // Assert
        assert.equal(test['_select'], 'a,b');
    });
});
