import firebaseAdmin from 'firebase-admin';
import servicesAccount from '../../../../settings/meteor-vue-3cafc-firebase-adminsdk-s3mcy-bc95b3dd56.json';



firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(servicesAccount),
    storageBucket: 'meteor-vue-3cafc.appspot.com',
});


export const firebaseAdminStorage = firebaseAdmin.storage().bucket();

export const BASE_URL_STORAGE = 'https://storage.googleapis.com';


