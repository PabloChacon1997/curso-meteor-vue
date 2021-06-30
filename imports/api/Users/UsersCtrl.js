
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import {check, Match} from 'meteor/check';
import './UserPressenceConfig';

import { ResponseMessage } from '../../startup/server/utilities/ResponseMessage';
import UsersServ from './UsersServ';
import AuthGuard from '../../middlewares/AuthGuard';
import Permissions from '../../startup/server/Permissions';


Accounts.onCreateUser((options, user) => {
    const customizedUser = Object.assign({
        status: {
            online: false
        }
    }, user);
    if (options.profile) {
        customizedUser.profile = options.profile;
    }

    return customizedUser;
});

Accounts.validateLoginAttempt(loginAttempt => {
    if (loginAttempt.allowed) {
        if (!loginAttempt.user.emails[0].verified) {
            throw new Meteor.Error('403', 'El correo de la cuenta no se ha verificado aún!!');
        }
        const loginAttemptOfUser = loginAttempt.user.services.resume?.loginTokens || [];
        if (loginAttemptOfUser.length > 1) {
            Meteor.users.update(loginAttempt.user._id, {
                $set: {
                    'services.resume.loginTokens': [loginAttemptOfUser.pop()]
                }
            });
        }
        return true;
    }
});


new ValidatedMethod({
    name: 'user.save',
    mixins: [MethodHooks],
    permissions: [Permissions.USERS.CREATE.VALUE, Permissions.USERS.UPDATE.VALUE],
    beforeHooks: [AuthGuard.checkPermission],
    validate({ user }) {
        try {
            check(user, {
                _id: Match.OneOf(String, null),
                username: String,
                emails: [{ address: String, verified: Boolean }],
                profile: {
                    profile: String,
                    name: String,
                    path: Match.OneOf(String, null)
                }
            });
        } catch (exception) {
            console.log('user.save', exception);
            throw new Meteor.Error('403', 'La informacion intrducida no es válida!');
        }
        UsersServ.validateEmail(user.emails[0].address, user._id);
        UsersServ.validateUsername(user.username, user._id);
    },
    async run({user, photoFileUser}) {
        console.log('Id del usuario loged: ', this.userId);
        const responseMessage = new ResponseMessage();
        if (user._id !== null) {
            try {
                await UsersServ.updateUser(user, photoFileUser);
                responseMessage.create('Se actualizo el usuario con éxito!!');
            } catch (exception) {
                console.log('user.save', exception);
                throw new Meteor.Error('500', 'Ocurrio un error al actualizar usuario!!');
            }
        } else {
            try {
                await UsersServ.createUser(user, photoFileUser);
                responseMessage.create('Se ha creado el usuario con éxito!!')
            } catch (exception) {
                console.log('user.save', exception);
                throw new Meteor.Error('500', 'Ocurrio un error al crear usuario!!');
            }
            
        }

        return responseMessage;
    }
});


new ValidatedMethod({
    name: 'user.delete',
    mixins: [MethodHooks],
    permissions: [Permissions.USERS.DELETE.VALUE],
    beforeHooks: [AuthGuard.checkPermission],
    validate({idUser}) {
        try {
            check(idUser, String);
        } catch (exception) {
            console.log('user.delete', exception);
            throw new Meteor.Error('403', 'La informacion introducida no es válida!!');
        }
    },
    async run({idUser}) {
        const responseMessage = new ResponseMessage();
        try {
            await UsersServ.deleteUser(idUser);
            responseMessage.create('Se ha eliminado el usuario con éxito!!');
        } catch (exception) {
            console.log('user.delete', exception);
            throw new Meteor.Error('500', 'Ocurrio un error al eliminar usuario!!');
        }
        return responseMessage;
    }
});


new ValidatedMethod({
    name: 'user.updatePersonalData',
    mixins: [MethodHooks],
    beforeHooks: [AuthGuard.isUserLogged],
    validate({user}) {
        try {
            check(user, {
                _id: Match.OneOf(String, null),
                username: String,
                emails: [{ address: String, verified: Boolean }],
                profile: {
                    profile: String,
                    name: String,
                    path: Match.OneOf(String, null)
                }
            });
        } catch (exception) {
            console.log('user.updatePersonalData', exception);
            throw new Meteor.Error('403', 'La informacion intrducida no es válida!');
        }
        UsersServ.validateEmail(user.emails[0].address, user._id);
        UsersServ.validateUsername(user.username, user._id);
    },
    async run({user, photoFileUser}) {
        console.log('Id del usuario loged: ', this.userId);
        const responseMessage = new ResponseMessage();
        try {
            await UsersServ.updateUser(user, photoFileUser);
            responseMessage.create('Se actualizó la informacion con éxito!!');
        } catch (exception) {
            console.log('user.updatePersonalData', exception);
            throw new Meteor.Error('500', 'Ocurrio un error al actualizar la información!!');
        }

        return responseMessage;
    }
});
