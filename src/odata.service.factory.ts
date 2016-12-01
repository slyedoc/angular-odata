import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ODataService} from './odata.service';
import {ODataConfigService} from './odata-config.service';

@Injectable()
export class ODataServiceFactory {
  constructor(private http: Http, private config: ODataConfigService) {}

  public CreateService<T>(typeName: string, handleError?: (err: any) => any): ODataService<T> {
    return new ODataService<T>(typeName, this.http, this.config);
  }

  public CreateServiceWithOptions<T>(typeName: string, config: ODataConfigService): ODataService<T> {
    return new ODataService<T>(typeName, this.http, config);
  }
}
