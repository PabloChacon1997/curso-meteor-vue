<template>
    <v-form @submit.prevent="updatePassword">
        <v-card>
            <v-card-title>
                <div class="subtitle-2">Cambio de contraseña</div>

            </v-card-title>
            <v-card-text>
                <v-text-field 
                    v-model="password.old"
                    id="inputPassword"
                    :append-icon="showPass.old ? 'mdi-eye': 'mdi-eye-off'"
                    :type="showPass.old ? 'text': 'password'"
                    name="currentPassword"
                    label="Contraseña actual"
                    @click:append="showPass.old=!showPass.old"
                    autocomplete="off"
                ></v-text-field>
                <v-text-field 
                    v-model="password.new"
                    id="inputNewPassword"
                    :append-icon="showPass.new ? 'mdi-eye': 'mdi-eye-off'"
                    :type="showPass.new ? 'text': 'password'"
                    name="password"
                    label="Nueva contraseña"
                    @click:append="showPass.new=!showPass.new"
                    autocomplete="new-password"
                ></v-text-field>
                <v-text-field 
                    v-model="password.confirm"
                    id="inputConfirmPassword"
                    :append-icon="showPass.confirm ? 'mdi-eye': 'mdi-eye-off'"
                    :type="showPass.confirm ? 'text': 'password'"
                    name="passwordConfirmation"
                    label="Confirmar contraseña"
                    @click:append="showPass.confirm=!showPass.confirm"
                ></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-row justify="center">
                    <v-btn 
                        type="submit" 
                        color="primary" 
                        rounded depressed
                    >
                        Cambiar
                    </v-btn>
                </v-row>
            </v-card-actions>
            <br />
        </v-card>
        
    </v-form>
</template>

<script>
export default {
    name: 'UpdatePassword',
    data() {
        return {
            password: {
                old: null,
                new: null,
                confirm: null,
            },
            showPass: {
                old: null,
                new: null,
                confirm: null,
            }
        }
    },
    methods: {
        updatePassword() {
            Accounts.changePassword(this.password.old, this.password.new, (error) => {
                if (error) {
                    this.$alert.showAlertSimple('error', 'Ocurrio un arror al cambiar la contraseña!!');
                } else {
                    this.password = {
                        old: null,
                        new: null,
                        confirm: null,
                    };
                    this.$alert.showAlertSimple('success', 'Se ha cambiado la contraseña con éxito!!');
                }
            });
        }
    }
}
</script>


<style scoped>

</style>