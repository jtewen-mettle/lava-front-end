import { useState, useEffect, useCallback } from 'react';
import { getUrlParams, createAuthUrl } from '../utils';
import { CLIENT_ID_MAPPING, AUTH_CONFIG } from '../constants';

export const useAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [message, setMessage] = useState('🔐 Waiting for SMART Authorization Token...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const exchangeCodeForToken = useCallback(async (code, tokenUri, clientId) => {
    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: AUTH_CONFIG.redirectUri,
      client_id: clientId
    });

    try {
      const response = await fetch(tokenUri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data.toString(),
      });

      const tokenResponse = await response.json();

      if (tokenResponse.access_token) {
        sessionStorage.setItem('token', tokenResponse.access_token);
        sessionStorage.setItem('auth_response', JSON.stringify(tokenResponse));
        setIsAuthorized(true);
        setMessage('✅ Authorization successful');
      } else {
        throw new Error('No access token received');
      }
    } catch (err) {
      console.error('Token Exchange Error:', err);
      setError(`❌ Error exchanging code for token: ${err.message}`);
      setMessage(`❌ Error exchanging code for token: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const initializeSmartLaunch = useCallback(async (serviceUri, launch, clientId) => {
    try {
      const response = await fetch(`${serviceUri}/metadata`);
      const metadata = await response.json();
      
      const securityExt = metadata.rest?.[0]?.security?.extension || [];
      const oauthExt = securityExt.find(
        (ext) => ext.url === 'http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris'
      );

      if (!oauthExt) {
        throw new Error('No OAuth URIs found in metadata');
      }

      const authUri = oauthExt.extension.find((e) => e.url === 'authorize')?.valueUri;
      const tokenUri = oauthExt.extension.find((e) => e.url === 'token')?.valueUri;

      if (!authUri || !tokenUri) {
        throw new Error('Authorization or Token URI not found in metadata');
      }

      sessionStorage.setItem('tokenUri', tokenUri);
      sessionStorage.setItem('serverUri', serviceUri);

      const authorizeUrl = createAuthUrl({
        authUri,
        clientId,
        scope: AUTH_CONFIG.scope,
        redirectUri: AUTH_CONFIG.redirectUri,
        serviceUri,
        launch,
        state: '76cb5332-f09f-4325-92d6-baa85a65d218'
      });

      window.location.href = authorizeUrl;
    } catch (err) {
      console.error('SMART Launch Error:', err);
      setError(`❌ Error launching SMART app: ${err.message}`);
      setMessage(`❌ Error launching SMART app: ${err.message}`);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsAuthorized(true);
    setLoading(false);
    return;

    const urlParams = getUrlParams();
    const serviceUri = urlParams['iss'];
    const launch = urlParams['launch'];
    const code = urlParams['code'];
    const storedUri = sessionStorage.getItem('serverUri') || serviceUri;
    const clientId = CLIENT_ID_MAPPING[storedUri] || AUTH_CONFIG.defaultClientId;

    if (code) {
      const tokenUri = sessionStorage.getItem('tokenUri');
      if (tokenUri) {
        exchangeCodeForToken(code, tokenUri, clientId);
      } else {
        setError('❌ Token URI not found in session storage');
        setLoading(false);
      }
    } else if (serviceUri) {
      initializeSmartLaunch(serviceUri, launch, clientId);
    } else {
      setIsAuthorized(true);
      setLoading(false);
    }
  }, [exchangeCodeForToken, initializeSmartLaunch]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('auth_response');
    sessionStorage.removeItem('tokenUri');
    sessionStorage.removeItem('serverUri');
    setIsAuthorized(false);
    setMessage('🔐 Waiting for SMART Authorization Token...');
  }, []);

  return {
    isAuthorized,
    message,
    loading,
    error,
    logout
  };
};