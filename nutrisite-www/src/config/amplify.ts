import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_USER_POOL_ID,
            userPoolClientId: import.meta.env.VITE_CLIENT_ID,
            signUpVerificationMethod: 'link',
            loginWith: {
                oauth: {
                    domain: import.meta.env.VITE_COGNITO_DOMAIN,
                    scopes: ['email', 'openid'],
                    responseType: 'code',
                    redirectSignIn: [],
                    redirectSignOut: []
                }
            }
        },

    },
    API: {
        REST: {
            NutriSiteApi: {
                endpoint: import.meta.env.VITE_API_URL,
                region: import.meta.env.VITE_AWS_REGION,
            },
        },
    },
});