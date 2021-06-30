export class PermissionsMiddleware extends PublishMiddleware {
    constructor(permissions) {
        super();
        this._permissions = permissions;
    }

    added(publish, collection, id, fields) {
        if (publish.userId) {
            return super.added(...arguments);
        }

        return publish.ready();
    }

    changed(publish, collection, id, fields) {
        if (this.checkPermission(publish.userId)) {
            return super.changed(...arguments);
        }

        return publish.ready();
    }

    remove(publish, collection, id, fields) {
        if (this.checkPermission(publish.userId)) {
            return super.remove(...arguments);
        }

        return publish.ready();
    }

    onReady(publish) {
        if (publish.userId) {
            return super.onReady(...arguments);
        }

        return publish.ready();
    }

    onStop(publish) {
        if (publish.userId) {
            return super.onStop(...arguments);
        }

        return publish.ready();
    }

    onError(publish) {
        if (publish.userId) {
            return super.onError(...arguments);
        }

        return publish.ready();
    }

    checkPermission(idUser) {
        const profileName = Roles.getScopesForUser(idUser)[0];
        return Roles.userIsInRole(idUser, this._permissions, profileName);
    }

}