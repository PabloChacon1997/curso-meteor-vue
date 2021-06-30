
import { Meteor } from 'meteor/meteor';
import Vue from 'vue';


import '../../ui/plugins';
import '../../ui/directives';

// Main App
import App from '../../ui/App.vue';
import router from '../../ui/router';
import store from '../../ui/store';
import vuetify from '../../ui/plugins/vuetify';



Meteor.startup(() => {
    new Vue({
        router,
        store,
        vuetify,
        render: h=>h(App)
    }).$mount('app');
});

