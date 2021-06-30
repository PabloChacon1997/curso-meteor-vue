import mimetypes from 'mimetypes';


import { BASE_URL_STORAGE, firebaseAdminStorage } from '../services/FirebaseAdmin';
import { ResponseMessage } from './ResponseMessage';
import Utilities from './Utilities';



export default {
    async saveFileFromBufferToGoogleStorage(fileBuffer, name, path, mimeType) {
        const responseMessage = new ResponseMessage();

        const fileName = `${name}${Utilities.generateNumberToken(10, 99)}.${mimetypes.detectExtension(mimeType)}`;
        const file = firebaseAdminStorage.file(`${path}/${fileName}`);
        const fileUrl = `${BASE_URL_STORAGE}/${firebaseAdminStorage.name}/${path}/${fileName}`;


        try {
            await file.save(fileBuffer, {
                metadata: {
                    contentType: mimeType
                },
                public: true,
            });
            responseMessage.create('File uploaded', null, {success: true, fileUrl})
        } catch (error) {
            console.log('Error uploading file to google storage: ', error);
            responseMessage.create('Error uploading file to google storage!!', null, {success: false});
        }
        return responseMessage;
    },
    async saveFileFromBase64ToGoogleStorage(base64file, name, path) {
        const mimeType = base64file.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-,+]+).*,.*/)[1];
        const base64encodedImageString = base64file.split(';base64,').pop();
        const fileBuffer = Buffer.from(base64encodedImageString, 'base64');
        return await this.saveFileFromBufferToGoogleStorage(fileBuffer,name, path, mimeType);
    },
    async deleteFileFromGoogleStorageIfExists(fileLoation) {
        const file = firebaseAdminStorage.file(fileLoation);

        try {
            const existsFile = await file.exists();
            if (existsFile[0]) {
                await file.delete();
            }
        } catch (exception) {
            console.log('Error deleting file from google storage: ', exception);
        }
    },
    async deleteFilesOfFolderFromGoogleStorage(userFolder) {
        try {
            await firebaseAdminStorage.deleteFiles( { prefix: userFolder + '/' } );
        } catch (exception) {
            console.log('Error deleting files from google storage: ', exception);
        }
    }
}