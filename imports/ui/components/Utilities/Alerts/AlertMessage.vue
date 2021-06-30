<template>
    <v-snackbar 
        v-model="snackbar"
        :bottom="y==='bottom'"
        :right="x==='right'"
        :top="y==='top'"
        :left="x==='left'"
        :color="color"
        :multi-line="mode==='multi-line'"
        :vertical="mode==='vertical'"
        :timeout="timeout"
    >
        <v-card color="transparent" elevation="0">
            <v-card-title>
                <v-icon v-if="icon" dark left>
                    {{icon}}
                </v-icon>
                <span class="white-text"> {{title}} </span>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                        <v-btn dark text small v-on="on" @click="snackbar=false">
                            <v-icon small>mdi-window-close</v-icon>
                        </v-btn>
                    </template>
                    <span>Cerrar</span>
                </v-tooltip>
            </v-card-title>
            <v-card-text v-if="text">
                <span class="white--text"> {{text}} </span>
            </v-card-text>
        </v-card>
    </v-snackbar>
</template>

<script>
export default {
    name: 'AlertMessage',
    data() {
        return {
            snackbar: false,
            x: '',
            y: '',
            color: '',
            mode: '',
            icon: null,
            title: '',
            text: '',
            timeout: 6000,
        }
    },
    mounted() {
        Vue.prototype.$alert=this;
    },
    methods: {
        /**
         * Show the alert with the configuration options
         * @param color Alert's color: info, success, error, warning 
         * @param title Alert's title: string
         */
        showAlertSimple(color, title) {
            this.color=color;
            this.title=title;
            this.x = 'right';
            this.y = 'bottom';
            if (color==="success") {
                this.icon="check_circle";
            } else if (color==="error") {
                this.icon="close";
            } else if (color=="info") {
                this.icon="info";
            } else if (color=="warning") {
                this.icon="warning";
            }
            this.text = '';
            this.mode = '';
            this.timeout = 6000;
            this.snackbar=true;
        },
        /**
         * Show the alert with the configuration options
         * @param color Alert's color: info, success, error, warning 
         * @param title Alert's title: string
         * @param icon Alert's icon
         * @param text Alert's text
         * @param x: position of the alert: left , rigth or empty string '' for center
         * @param y: position of the alert: top, bottom
         * @param mode: vertical, multiline or empty string ''
         * @param timeout: timeout to disappear the alert. Use 0 to keep open indefinitely
         */
        showAlertFull(icon, color, title, mode, timeout, x , y, text=null) {
            this.icon = icon;
            this.color = color;
            this.title = title;
            this.mode = mode;
            this.timeout = timeout;
            this.x = x;
            this.y = y;
            this.text = text;
            this.snackbar=true;
        }
    }
}
</script>

<style>
    .v-snack__content {
        padding: 0 !important;
    }
</style>