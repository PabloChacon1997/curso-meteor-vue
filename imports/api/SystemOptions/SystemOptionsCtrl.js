import AuthGuard from '../../middlewares/AuthGuard';
import Permissions from '../../startup/server/Permissions';
import SystemOptions from './SystemOptions';


import { ResponseMessage } from '../../startup/server/utilities/ResponseMessage';



new ValidatedMethod ({
    name: 'user.getSystemOptions',
    mixins: [MethodHooks],
    permissions: [Permissions.PERMISSIONS.LIST.VALUE],
    beforeHooks: [AuthGuard.isUserLogged],
    validate: null,
    run() {
        const responseMessage = new ResponseMessage();

        const userLogged = Meteor.user();

        const userRoles = Roles.getRolesForUser(userLogged._id, userLogged.profile.profile);

        const optionsOfUser = SystemOptions.reduce((accumulator, systemOptions) => {
            if (!systemOptions.permission || !!userRoles.find(role => role === systemOptions.permission)) {
                accumulator.push(systemOptions);
            }
            return accumulator;
        }, []);

        responseMessage.create('Opciones del sistema del usuario', null, optionsOfUser);

        return responseMessage;
    }
});

