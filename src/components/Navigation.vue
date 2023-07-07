<template>
  <div> 
    <v-navigation-drawer app v-model="drawer" class="nav-drawer">
      <v-img
        class="mt-5 mx-auto"
        max-height="100"
        max-width="150"
        src="../assets/logo_tensi.png"
      ></v-img>

      <v-list class="pa-0">
        <v-list-item-group 
          light
          color="#4a47d6">
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            ripple
            class="my-2"
            router 
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-medium text-caption">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar flat class="topbar">
      <v-container>
        <v-row align="center" justify="center">
          <v-icon 
            class="hidden-md-and-up"
            @click.stop="drawer = !drawer">
            mdi-menu
          </v-icon>
          <v-spacer/>
          <v-avatar size="36">
            <img :src="avatar" alt="User Avatar"/>
          </v-avatar>
          <p class="ml-4 my-auto text-subtitle-2 text-right">{{ name }}</p>
          <v-btn icon color="red" class="ml-4" @click.prevent="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-toolbar>
  </div>
</template>

<script>
import { auth } from '@/firebase'
import { signOut } from '@firebase/auth'

export default {
  name: 'NavBar',
  data: () => ({
    items: [
        { title: 'List Jawaban', icon: 'mdi-clipboard-text', link: '/' },
        { title: 'Materi', icon: 'mdi-book-open-variant', link: '/material' },
        { title: 'Kuis', icon: 'mdi-calculator-variant', link: '/quiz' },
        { title: 'Latihan', icon: 'mdi-alarm-panel', link: '/exam' },
    ],
    drawer: null,
    name: "",
    avatar: "https://firebasestorage.googleapis.com/v0/b/mytensi-fc11e.appspot.com/o/users%2F1_W35QUSvGpcLuxPo3SRTH4w.png?alt=media&token=783d86c9-49af-44ed-906e-04eb8ae17695"
  }),
  methods: {
    async logout() {
      await signOut(auth)
      this.$router.replace({ path: '/login' })
    }
  },
  async mounted() {
    this.name = auth.currentUser.displayName
    this.avatar = auth.currentUser.photoUrl
  }
}
</script>

<style scoped>

#divider{
  border: 0.5px solid #F2F2F2; 
}

.topbar {
    border-bottom: #E0E0E0 1px solid;
}
</style>