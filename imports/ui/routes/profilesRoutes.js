import ListProfiles from '../views/Profiles/ListProfiles.vue';
import SaveProfile from '../views/Profiles/SaveProfile.vue';



export default {
    path: 'perfiles',
    components: {
        sectionView: {
            render: c=>c("router-view")
        }
    },
    children: [
        {
            name: 'home.profiles',
            path: '',
            meta: { permission: 'profiles-list' },
            component: ListProfiles
        },
        {
            name: 'home.profiles.create',
            path: 'crear',
            meta: { permission: 'profiles-create' },
            component: SaveProfile
        },
        {
            name: 'home.profiles.edit',
            path: 'editar',
            meta: { permission: 'profiles-update' },
            component: SaveProfile
        },
    ]
}
