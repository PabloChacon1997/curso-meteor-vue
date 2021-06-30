<template>
    <v-container fluid>
        <header-view></header-view>
        <v-main id="main_section">
            <router-view name="sectionView" v-if="loggedUser"></router-view>
        </v-main>
        <footer-view></footer-view>
    </v-container>
</template>

<script>
import FooterView from './shared/FooterView.vue';
import HeaderView from './shared/HeaderView.vue';


export default {
    name: 'LySPA',
    components: {
        HeaderView,
        FooterView
    },
    data() {
        return {
            loggedUser: false,
        }
    },
    mounted() {
        this.$subscribe('roles', []);
    },
    watch: {
        '$subReady.roles'(newValue) {
            if (newValue) {
                this.loggedUser = true;
            }
        }
    }
}
</script>


<style scoped>
    #main_section {
        margin-bottom: 80px;
        position: relative;
    }
</style>