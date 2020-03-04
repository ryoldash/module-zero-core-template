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
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6ImM1ZTFkMjViLWU1MmItNWQ5Zi1kMDYwLTM5ZjJkZjE2ZmNmZSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJBZG1pbiIsInN0cmluZyIsImFzZGEiXSwic3ViIjoiMSIsImp0aSI6IjFhZDE0Yjc0LTcxNTgtNGY1Mi04YzdkLWRlNmIwNmMxMTczYyIsImlhdCI6MTU4MzMwMTgxMywibmJmIjoxNTgzMzAxODEzLCJleHAiOjE1ODMzODgyMTMsImlzcyI6IlRlbXBsYXRlRGVtbyIsImF1ZCI6IlRlbXBsYXRlRGVtbyJ9.S0uFe-G6iXNrwRWUseabalJ4yZCBxroM5RpwXU-jFxM';
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
