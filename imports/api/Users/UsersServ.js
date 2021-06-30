import ProfilesServ from "../Profiles/ProfilesServ";
import FileOperations from "../../startup/server/utilities/FileOperations";

const PATH_USERS_FILE = 'users/';

export default {
    validateEmail(newEmail, idUser) {
        const existsEmail = Accounts.findUserByEmail(newEmail);
        if (idUser) {
            const oldUser = Meteor.users.findOne(idUser);
            if (oldUser.emails[0].address !== newEmail & existsEmail) {
                throw new Meteor.Error('403','El nuevo email ya existe!!');
            }
        } else if(existsEmail){
            throw new Meteor.Error('403','El nuevo email ya existe!!');
        }
    },
    validateUsername(newUsername, idUser) {
        const existsUsername = Accounts.findUserByUsername(newUsername);
        if (idUser) {
            const oldUser = Meteor.users.findOne(idUser);
            if (oldUser.username !== newUsername & existsUsername) {
                throw new Meteor.Error('403','El nuevo nombre de usuario ya existe!!');
            }
        } else if(existsUsername){
            throw new Meteor.Error('403','El nuevo nombre de usuario ya existe!!');
        }
    },
    async createUser(user, photoFileUser) {
        const idUser = Accounts.createUser({
            username: user.username,
            email: user.emails[0].address,
            profile: user.profile
        });
        let avatarSrc = null;
        if (idUser) {
            ProfilesServ.setUserRoles(idUser, user.profile.profile);
            Accounts.sendEnrollmentEmail(idUser, user.emails[0].address);
        }

        if (photoFileUser) {
            const response = await FileOperations.saveFileFromBase64ToGoogleStorage(photoFileUser, 
                'avatar', PATH_USERS_FILE+idUser);
            if (!response.data.success) {
                throw new Meteor.Error('500', 'Error al subir la foto!!');
            } else {
                avatarSrc = response.data.fileUrl
            }
        }

        Meteor.users.update(idUser, {
            $set: {
                'profile.path': avatarSrc
            }
        });
    },
    async updateUser(user, photoFileUser) {
        const currentUser = Meteor.users.findOne(user._id);
        if (currentUser.emails[0].address!== user.emails[0].address) {
            Accounts.removeEmail(currentUser._id, currentUser.emails[0].address);
            Accounts.addEmail(currentUser._id, user.emails[0].address);
            Accounts.sendVerificationEmail(user._id, user.emails[0].address);
        }
        if (currentUser.username!==user.username) {
            Accounts.setUsername(currentUser._id, user.username);
        }
        Meteor.users.update(user._id, {
            $set: {
                profile: {
                    profile: user.profile.profile,
                    name: user.profile.name,
                    path: user.profile.path
                }
            }
        });
        ProfilesServ.setUserRoles(user._id, user.profile.profile);
        if (photoFileUser) {
            if (currentUser.profile.path) {
                await FileOperations.deleteFileFromGoogleStorageIfExists(currentUser
                    .profile.path.substring(currentUser.profile.path.indexOf(PATH_USERS_FILE)));
            }
            const response = await FileOperations.saveFileFromBase64ToGoogleStorage(photoFileUser, 
                'avatar', PATH_USERS_FILE+user._id);
            if (!response.data.success) {
                throw new Meteor.Error('403', 'Error al subir la foto!!');
            } else {
                Meteor.users.update(user._id, {
                    $set: {
                        'profile.path': response.data.fileUrl
                    }
                });
            }
        }
    },
    async deleteUser(idUser) {
        Meteor.users.remove(idUser);
        Meteor.roleAssignment.remove({'user._id': idUser});
        await FileOperations.deleteFilesOfFolderFromGoogleStorage( PATH_USERS_FILE + idUser );
    }
}