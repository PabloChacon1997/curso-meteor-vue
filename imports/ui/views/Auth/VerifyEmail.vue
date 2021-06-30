<template>
    <div align="center">
        <div v-if="loading">
            <h3>Cargando datos...</h3>
        </div>
        <div v-else>
            <v-icon size="120" :color="status?'green':'red'">
                {{status?'mdi-check-circle': 'mdi-cancel'}}
            </v-icon>

            <h3 class="text-wrap">
                {{message}}
                <small v-text="description"></small>
            </h3>
            <v-btn :to="{name: 'login'}" color="primary">Regresar al login</v-btn>
        </div>
    </div>
</template>


<script>
    export default {
        name: 'VerifyEmail',
        data() {
            return {
                loading: true,
                status: false,
                message: null,
                description: null
            }
        },
        mounted() {            
            const token = this.$route.params.token;
            Accounts.verifyEmail(token, error => {
                this.loading = false;
                if (error) {
                    console.error('Verify email failed: ', error);
                    this.status = false;
                    this.message = 'Se ha producido un error en el verificado tu cuenta!!';
                    this.description = 'Intentalo de nuevo o use la opción "Olvide mi contraseña"';
                } else {
                    this.status = true;
                    this.message = 'Se ha verificado tu coreeo con exito!!';
                    this.description = 'Ahora puedes inciar sesion"';
                }
            });
        }
    }
</script>


<style scoped>

</style>