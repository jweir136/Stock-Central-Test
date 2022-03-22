// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyB7KxvbbZdC6IA_rsvsQaiYxNLN2pwhovI",
    authDomain: "cs1530g4-project.firebaseapp.com",
    projectId: "cs1530g4-project",
    storageBucket: "cs1530g4-project.appspot.com",
    messagingSenderId: "675042722546",
    appId: "1:675042722546:web:21e64eb5046dcdf9ef066b",
    measurementId: "G-LL3BJXLGFL"
  },
  // IEX Cloud stuff
  IEX_SANDBOX_KEY: "Tpk_12e6eee6ed7d4026a0a87dee063b86bd",
  IEX_BASE_SANBOX_URL: 'https://sandbox.iexapis.com/stable/',
  IEX_CLOUD_KEY: 'pk_4a09995ad6854e28a38018bdd36eb410',
  IEX_BASE_CLOUD_URL: 'https://cloud.iexapis.com/stable/',

  API_BASE_URL: 'http://localhost:3000/api'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
