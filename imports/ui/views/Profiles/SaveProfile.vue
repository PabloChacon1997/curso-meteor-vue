<template>
    <v-container>
        <v-row>
            <v-col>
                <div class="headline">{{ dataView.title }}</div>
            </v-col>
            <v-col cols="2">
                <v-btn block type="submit" form="saveProfile" color="primary">
                    {{ dataView.targetButton }}
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-form @submit.prevent="saveProfile" id="saveProfile" autocomplete="off">
                    <v-row>
                        <v-col md="6">
                            <v-text-field
                                v-model="profile.name"
                                id="inputName"
                                name="name"
                                label="Nombre del perfil"
                            ></v-text-field>
                        </v-col>
                        <v-col md="6">
                            <v-text-field
                                v-model="profile.description"
                                id="inputDescription"
                                name="description"
                                label="Descripción del perfil"
                            ></v-text-field>
                            
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>Permisos de este perfil</v-card-title>
                    <v-card-text>
                        <v-text-field 
                            v-model="searchSelfPermissions"
                            placeholder="Buscar..."
                            id="inputSearchSelfPermissions"
                            name="profileName"
                        ></v-text-field>
                    </v-card-text>
                    <v-sheet 
                        id="scrolling-techniques-2" 
                        class="overflow-y-auto" 
                        max-height="500px"
                    >
                        <v-list style="height: 400px">
                            <v-list-item-group>
                                <draggable 
                                    :list="filteredSelfPermissions"
                                    @change="(ev) =>onChangeDragList(ev,'selfPermissions')" 
                                    group="permissions"
                                >
                                    <v-list-item 
                                        v-for="permission in filteredSelfPermissions"
                                        v-text="permission.publicName"
                                        :key="permission._id"
                                    ></v-list-item>
                                </draggable>
                            </v-list-item-group>
                        </v-list>
                    </v-sheet>
                </v-card>
            </v-col>
            <v-col>
                <v-card>
                    <v-card-title>Todos los permisos</v-card-title>
                    <v-card-text>
                        <v-text-field 
                            v-model="searchPermissions"
                            placeholder="Buscar..."
                            id="inputSearchSelfPermissions"
                            name="profileName2"
                        ></v-text-field>
                    </v-card-text>
                    <v-sheet 
                        id="scrolling-techniques-3" 
                        class="overflow-y-auto" 
                        max-height="500px"
                    >
                        <v-list style="height: 400px">
                            <v-list-item-group>
                                <draggable 
                                    :list="filteredPermissions" 
                                    @change="(ev) =>onChangeDragList(ev,'allPermissions')" 
                                    group="permissions"
                                >
                                    <v-list-item 
                                        v-for="permission in filteredPermissions"
                                        v-text="permission.publicName"
                                        :key="permission._id"
                                    ></v-list-item>
                                </draggable>
                            </v-list-item-group>
                        </v-list>
                    </v-sheet>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import draggable from 'vuedraggable';



export default {
    name: 'SaveProfile',
    components: {
        draggable
    },
    data() {
        return {
            profile: {
                _id: null,
                name: null,
                description: null,
                permissions: [],
            },
            dataView: {
                title: '',
                targetButton: '',
            },
            searchSelfPermissions: '',
            searchPermissions: '',
            selfPermissions: [],
            allPermissions: []
        }
    },
    created() {
        if (this.$router.currentRoute.name.includes('create')) {
            this.dataView.title = 'Crear perfil';
            this.dataView.targetButton = 'Crear';
            this.listAllPermissions();
        }else if (this.$router.currentRoute.name.includes('edit')) {
            this.dataView.title = 'Editar perfil';
            this.dataView.targetButton = 'Actualizar';
            this.profile = this.$store.state.temporal.element;
            this.initPermissionsList();
        }
    },
    methods: {
        onChangeDragList(event, propData) {
            if (event.hasOwnProperty('removed')) {
                this[propData]=this[propData].filter(permission => permission._id!== event.removed.element._id);
            } else if (event.hasOwnProperty('added')) {
                this[propData].splice(event.added.newIndex, 0, event.added.element);
            }
        },
        saveProfile() {
            this.$loader.activate('Guardando perfil...');
            this.profile.permissions = this.selfPermissions.map(permissions => permissions._id);
            Meteor.call('profile.save', this.profile, (error, response) => {
                this.$loader.deactivate();
                if (error) {
                    this.$alert.showAlertSimple('error', error.reason);
                } else {
                    this.$alert.showAlertSimple('success', response.message);
                    this.$router.push({ name: 'home.profiles' });
                }
            });
        },
        listAllPermissions() {
            Meteor.call('permissions.list', (error, response) => {
                if (error) {
                    this.$alert.showAlertSimple('error', error.reason);
                } else {
                    this.allPermissions = response.data;
                }
            });
        },
        initPermissionsList() {
            Meteor.call('permissions.listByIdProfile', {idProfile: this.profile._id}, (error, response) => {
                if (error) {
                    this.$alert.showAlertSimple('error', error.reason);
                } else {
                    this.selfPermissions = response.data;
                }
            });
            Meteor.call('permissions.listUserForIdProfile', {idProfile: this.profile._id}, (error, response) => {
                if (error) {
                    this.$alert.showAlertSimple('error', error.reason);
                } else {
                    this.allPermissions = response.data;
                }
            });
        }
    },
    computed: {
        filteredSelfPermissions() {
            return this.selfPermissions.filter(permissions => {
                return permissions.publicName.toLowerCase().includes(this.searchSelfPermissions.toLowerCase())
            });
        },
        filteredPermissions() {
            return this.allPermissions.filter(permissions => {
                return permissions.publicName.toLowerCase().includes(this.searchPermissions.toLowerCase())
            });
        },
    }
}
</script>

<style scoped>

</style>