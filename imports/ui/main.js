import { createApp } from 'vue';
import { Meteor } from 'meteor/meteor';
import App from './App.vue';

Meteor.startup(() => {
  const app = createApp(App);
  app.mount('#app');
});