<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" xs="12" sm="4" md="3" lg="2" xl="2">
        <v-card class="mx-auto" max-width="300" tile>
          <v-list subheader>
            <v-subheader>CONTACTOS</v-subheader>
            <v-list-item-group v-model="contactSelected" color="primary">
              <v-divider></v-divider>
              <template v-for="contact in users">
                <v-list-item :key="contact._id" :value="contact">
                  <v-list-item-icon>
                    <v-icon :color="contact.status.online?'green':'red'">
                      mdi-checkbox-blank-circle
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="contact.profile.name">
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" xs="12" sm="8" md="9" lg="10" xl="10">
        <v-card class="mx-auto" v-if="contactSelected" height="70vh">
          <v-list-item>
            <v-list-item-avatar size="36px">
              <img :src="contactSelected.profile.path || '/img/user.png'" alt="Avatar">
            </v-list-item-avatar>
            <v-list-item-title class="headline">{{contactSelected.profile.name}}</v-list-item-title>
          </v-list-item>
          <v-card-text id="messageContainer" style="height: 70%" class="overflow-y-auto">
            <v-row v-for="msg in messages" v-bind:key="msg._id"
                :class="msg.idReceiver===contactSelected._id ?'justify-end' :'justify-start'">
              <v-col cols="7">
                <v-card raised shaped :color="msg.idReceiver===contactSelected._id ?'cyan lighten-5' :'red lighten-5'">
                  <v-card-text class="pb-1">
                    {{ msg.text }}
                  </v-card-text>
                  <v-card-subtitle class="text-right pt-1 pb-1">
                    <v-tooltip left>
                      <template v-slot:activator="{on}">
                        <v-icon v-on="on" small>info_outlined</v-icon>
                      </template>
                      <span>{{ msg.date.substring(7, 15) }}</span>
                    </v-tooltip>
                    {{msg.date.substring(15, 21)}}
                    <v-icon style="margin-right: -15px;" small :color="msg.read ?'red': 'gray'">
                      check
                    </v-icon>
                    <v-icon small :color="msg.read ?'red': 'gray'">
                      check
                    </v-icon>
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-text-field
                autocomplete="off"
                @focus="markMessagesAsRead"
                v-model="message.text" 
                label="Introduce tu mensaje"
                v-on:keyup.enter="sendMessage"
            ></v-text-field>
            <v-btn class="mx-2" @click="sendMessage" fab dark color="indigo">
              <v-icon dark>send</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-else height="70vh">
          <h1>Bienvenido al Chat</h1>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Message } from '../../../api/messages/Message';
import date from '../../mixins/helpers/date';


export default {
  name: 'Chat',
  mixins: [date],
  data() {
    return {
      contactSelected: null,
      message: {
          idSender: null,
          idReceiver: null,
          date: null,
          text: null,
          read: false
      }
    };
  },
  meteor: {
    $subscribe: {
      'user.list': [],
      'messages.list': function() {
          return [this.contactSelected? this.contactSelected._id: null]
      }
    },
    users() {
      return Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch();
    },
    messages() {
        return this.contactSelected ? Message.find({}, {
            sort:{
                date: 1
            }
        }).fetch(): []
    }
  },
  updated() {
    const elem = this.$el.querySelector('#messageContainer');
    if (elem) {
      elem.scrollTop=elem.scrollHeight;
    }
  },
  methods: {
      sendMessage() {
          this.message.idSender = Meteor.userId();
          this.message.idReceiver = this.contactSelected._id;
          this.message.date = this.currentLocalDate().toString();
          Meteor.call('message.save',this.message, (error, response) => {
            if (error) {
                    this.$alert.showAlertSimple('error', error.reason);
            } else {
                this.message.text = null;
            }
          });
      },
      markMessagesAsRead() {
        const messages = this.messages.filter(message => message.read===false && message.idReceiver===Meteor.userId());
        if (messages.length) {
          Meteor.call('message.read',this.messages, (error, response) => {
            if (error) {
              this.$alert.showAlertSimple('error', error.reason);
            }
          });
        }
      }
  }
};
</script>

<style scoped>

</style>