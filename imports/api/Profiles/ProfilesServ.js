import { Profile } from "./Profile"
import { StaticProfiles } from "./ProfileSeader";

export default {
    validateName(name, idProfile) {
        const existsName = Profile.findOne({name});
        if (idProfile) {
            const oldProfile = Profile.findOne(idProfile);
            if (oldProfile.name !== name && existsName) {
                throw new Meteor.Error('403','El nuevo nombre de perfil ya existe!!');
            }
        } else if(existsName){
            throw new Meteor.Error('403','El nuevo nombre de perfil ya existe!!');
        }
    },
    getUsersByProfile(idProfile) {
        const profile = Profile.findOne(idProfile);
        return Meteor.users.find({'profile.profile': profile.name}).fetch();
    },
    setUserRoles(idUser, profileName) {
        const permissions = Profile.findOne({name: profileName}).permissions;
        Meteor.roleAssignment.remove({'user._id': idUser});
        Roles.setUserRoles(idUser, permissions, profileName);
    },
    updateProfileUsers(users, profile){
        users.forEach(user => {
            this.setUserRoles(user._id, profile.name);
        });
    },
    getStaticProfileNames() {
        return Object.keys(StaticProfiles).map(staticProfileName => {
            return StaticProfiles[staticProfileName].name;
        })
    }
}