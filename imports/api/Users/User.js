import SimpleSchema from 'simpl-schema';
import { User } from 'meteor/socialize:user-model';

Meteor.users.rawCollection().createIndex({'profile.profile': 1});


const UserProfileSchemma = new SimpleSchema({
    profile: {
        type: Object,
        optional: false,
        blackbox: true,
    }
});

User.attachSchema(UserProfileSchemma);