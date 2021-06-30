<template>
    <v-app>
        <router-view name="allPageView"></router-view>
        <alert-message/>
        <loader/>
    </v-app>
</template>

<script>
import AlertMessage from './components/Utilities/Alerts/AlertMessage.vue';
import Loader from './components/Utilities/Loaders/Loader.vue';

    export default {
        name: "App",
        components: {
            AlertMessage,
            Loader
        }
        
    }
</script>

<style scoped>

</style>
