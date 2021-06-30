import AuthGuard from "../../middlewares/AuthGuard";
import Permissions from "../../startup/server/Permissions";
import { ResponseMessage } from "../../startup/server/utilities/ResponseMessage";
import { check } from 'meteor/check';
import { Profile } from "../Profiles/Profile";


new ValidatedMethod({
    name: 'permissions.list',
    mixins: [MethodHooks],
    permissions: [Permissions.PERMISSIONS.LIST.VALUE],
    beforeHooks: [AuthGuard.checkPermission],
    validate: null,
    run() {
        const responseMessage = new ResponseMessage();

        try {
            const permissions = Meteor.roles.find().fetch();
            responseMessage.create('Permisos del sistema disponibles', null, permissions);
        } catch (exception) {
            console.log('permissions.list', exception);
            throw new Meteor.Error('500', 'Ocurrio un error al obtener los permisos!!');
        }

        return responseMessage;
    }
});


new ValidatedMethod({
    name: 'permissions.listByIdProfile',
    mixins: [MethodHooks],
    permissions: [Permissions.PERMISSIONS.LIST.VALUE],
    beforeHooks: [AuthGuard.checkPermission],
    validate({idProfile}) {
        try {
            check(idProfile, String);
        } catch (exception) {
            console.log('permissions.listByIdProfile', exception);
            throw new Meteor.Error('4030', 'La información introducida no es válida!!');
        }
    },
    run({idProfile}) {
        const responseMessage = new ResponseMessage();

        try {
            const profile = Profile.findOne(idProfile);
            const permissions = Meteor.roles.find({_id: {$in: profile.permissions}}).fetch();
            responseMessage.create('Permisos asociados al perfil', null, permissions);
        } catch (exception) {
            console.log('permissions.listByIdProfile', exception);
            throw new Meteor.Error('500', 'Ocurrio un error al obtener los permisos del perfil!!');
        }

        return responseMessage;
    }
});


new ValidatedMethod({
    name: 'permissions.listUserForIdProfile',
    mixins: [MethodHooks],
    permissions: [Permissions.PERMISSIONS.LIST.VALUE],
    beforeHooks: [AuthGuard.checkPermission],
    validate({idProfile}) {
        try {
            check(idProfile, String);
        } catch (exception) {
            console.log('permissions.listUserForIdProfile', exception);
            throw new Meteor.Error('403', 'La información introducida no es válida!!');
        }
    },
    run({idProfile}) {
        const responseMessage = new ResponseMessage();

        try {
            const profile = Profile.findOne(idProfile);
            const permissions = Meteor.roles.find({ _id: { $not: { $in: profile.permissions } } }).fetch();
            responseMessage.create('Permisos asociados al perfil', null, permissions);
        } catch (exception) {
            console.log('permissions.listUserForIdProfile', exception);
            throw new Meteor.Error('500', 'Ocurrio un error al obtener los permisos No asociados al perfil!!');
        }

        return responseMessage;
    }
});

new ValidatedMethod({
    name: 'permission.check',
    mixins: [MethodHooks],
    beforeHooks: [AuthGuard.isUserLogged],
    validate({permission}) {
        try {
            check(permission, String);
        } catch (exception) {
            console.log('permission.check', exception);
            throw new Meteor.Error('403', 'La información introducida no es válida!!');
        }
    },
    run({permission}) {
        const responseMessage = new ResponseMessage();
        try {
            const scope = Roles.getScopesForUser(this.userId)[0];
            const hasPermission = Roles.userIsInRole(this.userId, permission, scope);
            responseMessage.create(`El usuario ${hasPermission ? 'Si': 'No'} tiene el permiso`, 
                null, {hasPermission});
        } catch (exception) {
            console.log('permissions.listUserForIdProfile', exception);
            throw new Meteor.Error('500', 'Ha ocurrido un error al verificar el permiso!!');
        }

        return responseMessage;
    }
});