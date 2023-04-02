/**
 * 6226576d-37e9-49eb-b201-ec1eeb0029b6 is the production microsoft client id
 * The other client id possibility is found under the Web App > Authentication under "App (client) ID"
 */
const clientId =
  process.env.CLIENT_ID ?? '6226576d-37e9-49eb-b201-ec1eeb0029b6';
/**
 * // https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-client-application-configuration
 */
const cloudInstance =
  process.env.CLOUD_INSTANCE ?? 'https://login.microsoftonline.com/';
/**
 * https://learn.microsoft.com/en-us/azure/active-directory/develop/accounts-overview
 */
const tenantId =
  process.env.TENANT_ID ?? '9188040d-6c67-4c5b-b112-36a304b66dad';
const authority = cloudInstance + (process.env.TENANT_ID ?? 'common/');
//const authority = cloudInstance + tenantId + '/';
const host = process.env.HOST ?? 'dulity.social';
const port = Number(process.env.PORT ?? 3000);
const production = process.env.NODE_ENV === 'production';
const sslEnabled = process.env.SSL_ENABLED === 'false';
const urlProto = sslEnabled ? 'https://' : 'http://';
const serverHost = sslEnabled
  ? `${urlProto}${host}:${port === 443 ? '' : port}/`
  : `${urlProto}${host}:${port === 80 ? '' : port}/`;
const redirectUri = serverHost + 'auth/redirect';
export type OpenAiProvider = 'azure' | 'openai';
export interface IEnvironment {
  production: boolean;
  developer: {
    host: string;
    port: number;
    baseUrl: string;
    sslEnabled: boolean;
  };
  openai: {
    type: OpenAiProvider;
    accessToken: string;
    organization?: string;
    model?: string;
    deployment?: string;
  };
  mongo: {
    uri: string;
    sessionCollection: string;
    sessionDatabase: string;
    mongoSessions: boolean;
  };
  cookies: {
    enabled: boolean;
    secret: string;
  };
  msal: {
    clientId: string;
    clientSecret: string;
    cloudInstance: string;
    graphMeEndpoint: string;
    authority: string;
    postLogoutRedirectUri: string;
    tenantId: string;
    redirectUri: string;
  };
}
export const environment: IEnvironment = {
  production: production,
  developer: {
    host: host,
    port: port,
    baseUrl: serverHost,
    sslEnabled: sslEnabled,
  },
  openai: {
    type: process.env.OPENAI_PROVIDER === 'azure' ? 'azure' : 'openai',
    accessToken: process.env.OPENAI_API_KEY ?? '',
    organization: process.env.OPENAI_ORGANIZATION
      ? process.env.OPENAI_ORGANIZATION
      : undefined,
    model: process.env.OPENAI_MODEL
      ? process.env.OPENAI_MODEL
      : 'chat-3.5-turbo',
    deployment: process.env.OPENAI_DEPLOYMENT
      ? process.env.OPENAI_DEPLOYMENT
      : undefined,
  },
  mongo: {
    uri: process.env.MONGO_URL ?? 'mongodb://localhost:27017/duality-social',
    sessionCollection: 'sessions',
    sessionDatabase: 'duality-social',
    mongoSessions: true,
  },
  cookies: {
    enabled: process.env.COOKIE_ENABLED === 'true',
    /**
     * arbitrarily generated string, arbitrarily 100 characters long
     */
    secret:
      process.env.EXPRESS_SESSION_SECRET ??
      'nGNP42hNZ9JmH!Lvj_JHG@FYWjHt_PRvBq.j**7DTWATj9CiMB' +
        'L*YWpe4-6YnkikcBqD*vnRFzkhums!xZ!LPRPHB9LFTFaXrBwC',
  },
  msal: {
    clientId: clientId,
    cloudInstance: cloudInstance,
    authority: authority,
    redirectUri: process.env.MSAL_REDIRECT_URI ?? redirectUri,
    postLogoutRedirectUri:
      process.env.MSAL_POST_LOGOUT_REDIRECT_URI ?? redirectUri,
    tenantId: tenantId,
    clientSecret: process.env.MSAL_CLIENT_SECRET ?? '',
    graphMeEndpoint:
      (process.env.GRAPH_API_ENDPOINT ?? 'https://graph.microsoft.com/') +
      'v1.0/me',
  },
};

export function validateEnvironment(then: (environment: IEnvironment) => void) {
  // ensure all required environment variables are set
  if (!environment.openai.accessToken) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  if (!environment.msal.clientId) {
    throw new Error('CLIENT_ID is not set');
  }
  if (!environment.msal.clientSecret) {
    throw new Error('CLIENT_SECRET is not set');
  }
  if (!environment.msal.tenantId) {
    throw new Error('TENANT_ID is not set');
  }
  if (!environment.msal.redirectUri) {
    throw new Error('MSAL_REDIRECT_URI is not set');
  }
  if (!environment.msal.postLogoutRedirectUri) {
    throw new Error('MSAL_POST_LOGOUT_REDIRECT_URI is not set');
  }
  if (!environment.msal.graphMeEndpoint) {
    throw new Error('GRAPH_API_ENDPOINT is not set');
  }
  if (!environment.cookies.secret) {
    throw new Error('EXPRESS_SESSION_SECRET is not set');
  }
  if (!environment.mongo.uri) {
    throw new Error('MONGO_URL is not set');
  }
  then(environment);
}
