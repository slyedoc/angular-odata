import {Injectable, Optional} from '@angular/core';
import {RequestOptions, Headers, Response} from '@angular/http';
import {PagedResult} from './odata-query';

export class KeyConfigs {
  public filter: string = '$filter';
  public top: string = '$top';
  public skip: string = '$skip';
  public orderBy: string = '$orderby';
  public select: string = '$select';
  public expand: string = '$expand';
}

export class ODataConfigServiceConfig { baseUrl: string = '/'; }

@Injectable()
export class ODataConfigService {
  public keys: KeyConfigs = new KeyConfigs();
  public baseUrl: string = 'http://localhost/odata';

  constructor(@Optional() config: ODataConfigServiceConfig) {
    if (config) {
      this.baseUrl = config.baseUrl;
    }
  }

  public getEntityUri(entityKey: string, _typeName: string) {
    if (!/^[0-9]*$/.test(entityKey)) {
      return this.baseUrl + '/' + _typeName + '(\'' + entityKey + '\')';
    }
    return this.baseUrl + '/' + _typeName + '(' + entityKey + ')';
  }

  handleError(err: any, caught: any): void { console.warn('OData error: ', err, caught); };

  get requestOptions(): RequestOptions { return new RequestOptions({body: ''}); };

  get postRequestOptions(): RequestOptions {
    let headers = new Headers({'Content-Type': 'application/json; charset=utf-8'});
    return new RequestOptions({headers: headers});
  }

  public extractQueryResultData<T>(res: Response): T[] {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    let entities: T[] = body.value;
    return entities;
  }

  public extractQueryResultDataWithCount<T>(res: Response): PagedResult<T> {
    let pagedResult = new PagedResult<T>();

    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    let entities: T[] = body.value;

    pagedResult.data = entities;

    try {
      let count = parseInt(body['@odata.count'], 10) || entities.length;
      pagedResult.count = count;
    } catch (error) {
      console.warn('Cannot determine OData entities count. Falling back to collection length...');
      pagedResult.count = entities.length;
    }

    return pagedResult;
  }
}
