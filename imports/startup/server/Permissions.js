const Permissions = {
    USERS: {
        LIST: { VALUE: 'users-list' , TEXT: 'Listar usuarios'},
        CREATE: { VALUE: 'users-create', TEXT: 'Crear usuario' },
        UPDATE: { VALUE: 'users-update', TEXT: 'Actualizar usuario' },
        DELETE: { VALUE: 'users-delete', TEXT: 'Eliminar usuario' },
    },
    PROFILES: {
        LIST: { VALUE: 'profiles-list' , TEXT: 'Listar perfiles'},
        CREATE: { VALUE: 'profiles-create', TEXT: 'Crear perfil' },
        UPDATE: { VALUE: 'profiles-update', TEXT: 'Actualizar perfil' },
        DELETE: { VALUE: 'profiles-delete', TEXT: 'Eliminar perfil' },
    },
    PERMISSIONS: {
        LIST: { VALUE: 'permissions-list' , TEXT: 'Listar permisos'},
    },
    CHAT: {
        LIST: {VALUE: 'messages-list', TEXT: 'Ver mensajes del chat'},
        CREATE: {VALUE: 'messages-create', TEXT: 'Enviar mensaje del chat'},
    }
};

export const permissionsArray = Object.keys(Permissions).reduce((accumulator, systemModuleName) => {
    const systemModuleObject = Permissions[systemModuleName];
    const modulePermissions = Object.keys(systemModuleObject).map(permission => systemModuleObject[permission]);
    return accumulator.concat(modulePermissions);
}, []);

if (Meteor.isDevelopment) {
    if (Meteor.settings.private && Meteor.settings.private.REFRESH_PERMISSIONS) {
        console.log('Updating permissions ...');
        const currentRoles = Roles.getAllRoles().fetch();
        
        
        for (const permission of permissionsArray) {
            if (!currentRoles.find(_role => _role._id===permission.VALUE)) {
                Roles.createRole(permission.VALUE);
            }
            Meteor.roles.update(permission.VALUE, {
                $set: {
                    publicName: permission.TEXT
                }
            });
        }
    }
}


export default Permissions;