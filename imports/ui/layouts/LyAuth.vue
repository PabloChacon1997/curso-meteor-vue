<template>
    <v-row>
        <v-col xs="12" sm="8" md="4" class="d-flex flex-column justify-space-around pa-12">
            <div class="text-center">
                <img src="/img/vue-meteor.png"  alt="Vuetify" height="180px" width="auto" />
            </div>
            <router-view name="sectionView"></router-view>
            <div class="text-center">
                <img src="/img/vue-meteor.png"  alt="Logo" height="35px" id="logo" />
            </div>
        </v-col>
        <v-col xs="12" sm="4" md="8" class="right-side d-flex flex-column justify-center">
            <div class="display-3 font-weight-medium mr-10 text-right white--text">
                Scaffold Meteor + Vue
            </div>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'LyAuth'
}
</script>

<style scoped>
    .display-3 {
        z-index: 2;
        margin-top: 350px;
    }
    .right-side {
        background-image: url("/img/meteor.jpg");
        background-size: cover;
        position: relative;
    }
</style>

