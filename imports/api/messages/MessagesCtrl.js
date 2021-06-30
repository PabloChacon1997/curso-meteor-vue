import { check } from 'meteor/check';


import AuthGuard from '../../middlewares/AuthGuard';
import { ResponseMessage } from '../../startup/server/utilities/ResponseMessage';
import { Message } from './Message';
import Permissions from '../../startup/server/Permissions';



new ValidatedMethod({
    name: 'message.save',
    mixins: [MethodHooks],
    permissions: [Permissions.CHAT.CREATE.VALUE],
    beforeHooks: [AuthGuard.checkPermission],
    validate(message) {
        try {
            check(message, {
                idSender: String,
                idReceiver: String,
                text: String,
                date: String,
                read: Boolean,
            });
        } catch (exception) {
            console.log('user.save', exception);
            throw new Meteor.Error('403', 'La informacion intrducida no es válida!');
        }

    },
    async run(message) {
        const responseMessage = new ResponseMessage();
        try {
            Message.insert(message);
            responseMessage.create('Se inserto el mensaje exitosamente');
        } catch (exception) {
            console.log('message.save', exception);
            throw new Meteor.Error('500', 'Ocurrio un error al insertar el mensaje!!');
        }

        return responseMessage;
    }
});



new ValidatedMethod({
    name: 'message.read',
    mixins: [MethodHooks],
    beforeHooks: [AuthGuard.isUserLogged],
    validate(messages) {
        try {
            check(messages, [
                {
                    _id: String,
                    idSender: String,
                    idReceiver: String,
                    text: String,
                    date: String,
                    read: Boolean,
                }
            ]);
        } catch (exception) {
            console.log('user.save', exception);
            throw new Meteor.Error('403', 'La informacion intrducida no es válida!');
        }

    },
    async run(messages) {
        const responseMessage = new ResponseMessage();
        try {
            Message.update({ _id: {$in: messages.map(m=>m._id) } },{
                $set: {
                    read: true
                }
            }, {multi: true});
            responseMessage.create('Se inserto el mensaje exitosamente');
        } catch (exception) {
            console.log('message.read', exception);
            throw new Meteor.Error('500', 'Ocurrio un error al guardar los mensajes como leidos!!');
        }

        return responseMessage;
    }
});