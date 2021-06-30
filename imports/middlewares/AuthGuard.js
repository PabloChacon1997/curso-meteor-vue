const checkPermission = function(methodArgs, methodOptions) {
    const idUser= this.userId;
    const permissions = methodOptions.permissions;
    let hasPermissions = false;
    console.log(idUser);
    if (idUser!== null) {
        const profileName = Meteor.user().profile.profile;
        hasPermissions = Roles.userIsInRole(idUser, permissions, profileName);
    }

    if (!hasPermissions) {
        throw new Meteor.Error('403', 'Acceso denegado!!','No tienes permiso para ejecutar esta acción');
    }


    return methodArgs;
}

const isUserLogged = function(methodArgs, methodOptions) {
    if (!this.userId) {
        throw new Meteor.Error('403', 'Acceso denegado!!', 'No tienes permisos para ejecutar esta acción');
    }

    return methodArgs;
}


export default { checkPermission, isUserLogged };