import { PermissionsMiddleware } from "../../middlewares/PermissionMiddleware";
import Permissions from "../../startup/server/Permissions";
import { Message } from "./Message";

const messagesPublication = new PublishEndpoint('messages.list', function(idContact = null) {
    const idUserlogged = this.userId;
    return Message.find({
        $or: [
            { idSender: idUserlogged, idReceiver: idContact },
            { idSender: idContact, idReceiver: idUserlogged },
        ]
    },{
        limit: 20,
        sort:{
            date: -1
        }
    });
});

messagesPublication.use(new PermissionsMiddleware([Permissions.CHAT.LIST.VALUE]));
