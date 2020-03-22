import axios from 'axios';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { _toast } from '../utils/utils';

const qs = require('qs');

let showFunc: any;
let hideFunc: any;

export class httpServiceFunc {
  showFunction = (_callBack: any) => {
    showFunc = _callBack;
  };
  hideFunction = (_callBack: any) => {
    hideFunc = _callBack;
  };
}

const http = axios.create({
  baseURL: 'http://template-demo.aspnetboilerplate.com',
  timeout: 30000,
  paramsSerializer: function(params) {
    return qs.stringify(params, {
      encode: false,
    });
  },
});

http.interceptors.request.use(
  function(config) {
    showFunc();

    //  if (!!abp.auth.getToken()) {
    config.headers.common.Authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic2FtZXQiLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IkZXQzI1Wkc0MlhFUlozSTZZQzcySTNFNjJJUzNIV0pNIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjpbIkFkbWluIiwidGVzYWQiLCJhc2RhcyJdLCJzdWIiOiI1IiwianRpIjoiNGFjNzZkNjEtZTdhZi00YmU4LTlhZjgtMGE1MzEyZjQ1ODk0IiwiaWF0IjoxNTg0ODExNTIyLCJuYmYiOjE1ODQ4MTE1MjIsImV4cCI6MTU4NDg5NzkyMiwiaXNzIjoiVGVtcGxhdGVEZW1vIiwiYXVkIjoiVGVtcGxhdGVEZW1vIn0.gREMGk-ddlo0y0idDnsiYdkn5E2DAMIUPdusv8KrxMI';
    //  }

    //   config.headers.common['.AspNetCore.Culture'] = abp.utils.getCookieValue('Abp.Localization.CultureName');
    //   config.headers.common['Abp.TenantId'] = abp.multiTenancy.getTenantIdCookie();
   //config.headers.common['Abp.TenantId'] = 1;
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  response => {
    hideFunc();
    return response;
  },
  error => {
    hideFunc();
    if (
      !!error.response &&
      !!error.response.data.error &&
      !!error.response.data.error.message &&
      error.response.data.error.details
    ) {
      _toast(error.response.data.error.details);
    } else if (
      !!error.response &&
      !!error.response.data.error &&
      !!error.response.data.error.message
    ) {
      _toast(error.response.data.error.message);
    } else if (!error.response) {
      _toast(error.response);
    }
    NetInfo.fetch('ethernet').then((e: NetInfoState) => {
      if (e.isConnected == false) {
        _toast('Connectionlost');
      }
    });

    return Promise.reject(error);
  },
);

export default http;
