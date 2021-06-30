import { PermissionsMiddleware } from '../../middlewares/PermissionMiddleware';
import Permissions from '../../startup/server/Permissions';
import { Profile } from './Profile';
import ProfilesServ from './ProfilesServ';

const noStaticProflesPublication = new PublishEndpoint('profile.listNotStaticProfiles', function() {
    return Profile.find({ name: { $nin: ProfilesServ.getStaticProfileNames() }});
});


const proflesPublication = new PublishEndpoint('profile.listAll', function() {
    return Profile.find({});
});


noStaticProflesPublication.use(new PermissionsMiddleware([Permissions.PROFILES.LIST.VALUE]));
proflesPublication.use(new PermissionsMiddleware([Permissions.PROFILES.LIST.VALUE]));
