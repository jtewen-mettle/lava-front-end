export const getUrlParams = () => {
  const params = {};
  window.location.search
    .substring(1)
    .split('&')
    .forEach((param) => {
      const [key, value] = param.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    });
  return params;
};

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

export const createAuthUrl = ({ authUri, clientId, scope, redirectUri, serviceUri, launch, state }) => {
  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    aud: serviceUri
  };

  if (state) {
    params.state = state;
  }

  if (launch) {
    params.launch = launch;
  }

  const queryString = buildQueryString(params);
  return `${authUri}?${queryString}`;
};

export const getCurrentHost = () => {
  return `${window.location.protocol}//${window.location.host}`;
};

export const getCurrentUrl = () => {
  return window.location.href;
};

export const isLocalhost = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '::1';
};