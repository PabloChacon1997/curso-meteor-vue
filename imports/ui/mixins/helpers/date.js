export default {
    methods: {
        currentLocalDate() {
            const date= new Date();
            const offsetms = date.getTimezoneOffset()*60*1000;
            const msLocal = date.getTime()-offsetms;
            return new Date(msLocal);
        }   
    }
}