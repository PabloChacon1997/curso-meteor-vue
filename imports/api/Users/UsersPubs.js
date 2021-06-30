// Meteor.publish('user.list', function() {
//     return Meteor.users.find(); 
// });
import { PublishEndpoint } from 'meteor/peerlibrary:middleware';
import { PermissionsMiddleware } from '../../middlewares/PermissionMiddleware';
import Permissions from "../../startup/server/Permissions";

const usersPublication = new PublishEndpoint('user.list', function() {
    return Meteor.users.find({}); 
});

usersPublication.use(new PermissionsMiddleware([Permissions.USERS.LIST.VALUE]));
