<template>
  <v-container 
    class='pa-0'
    fill-height
    fluid
  >
    <v-row 
        no-gutters
        align="center"
    >
      <v-col>
        <v-container fluid :class="{'mw-90': $vuetify.breakpoint.smAndDown, 'mw-50': $vuetify.breakpoint.mdAndUp}">
          <p class="text-h3 font-weight-bold">Login</p>
          <p>Isi email dan password di bawah untuk login ke akunmu</p>
          <v-text-field
            v-model="email"
            label="Email"
            outlined
            type="email"
          />
          <v-text-field
            v-model="password"
            label="Password"
            outlined
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (showPassword = !showPassword)"
            :type="showPassword ? 'text' : 'password'"
          />
          <v-btn 
              color="blue darken-2"
              elevation="2"
              class="white--text"
              :loading="isLoading"
              @click="login"
          >
            Login
          </v-btn>
        </v-container>
      </v-col>
      <v-col class='banner blue darken-2 white--text pl-16 pt-16 d-none d-md-block'>
        <div class="my-auto banner-element">
          <p class="text-h3 font-weight-bold">Gerak Lurus</p>
          <p class="font-weight-light">Admin Dashboard Panel</p>
          <p class="white black--text d-inline-flex text-h2 font-weight-medium pa-3">Ajari Siswa Gerak Lurus</p>
          <p class="white black--text d-inline-flex text-h2 font-weight-medium pa-3 mt-3">Melalui Aplikasi</p>
        </div>
      </v-col>
  </v-row>
  <Notification 
    :show="showNotif" 
    :message="notifMessage" 
    :isError="notifError" />
</v-container>
</template>

<script>
import { auth, db } from "@/firebase"
import { signInWithEmailAndPassword, signOut } from "@firebase/auth";
import { doc, getDoc } from '@firebase/firestore'
import { utils } from '@/mixins'
import Notification from '@/components/Notification';

export default {
  name: 'LoginView',
  components: { Notification },
  mixins: [utils],
  data: () => ({
    email: "",
    password: "",
    showPassword: false
  }),
  methods: {
    async login() {
      try {
        const userCred = await signInWithEmailAndPassword(auth, this.email, this.password)
        const response = await getDoc(doc(db, "admin", userCred.user.uid))
        if (response.exists()) {
          this.$router.replace({ path: '/' })
        } else {
          await signOut(auth)
          throw Error("Only admin who able to access this dashboard")
        }
      } catch (error) {
        const dataError = {
          isShow: true,
          isError: true,
          message: error
        }
        this.$store.dispatch('notification/showNotification', dataError)
      }
    }
  }
}
</script>

<style scoped>
.banner {
height: 85vh;
position: relative;
}

.banner-element {
position: absolute; 
top: 50%; 
transform: translateY(-50%);
}

.mw-90 {
max-width: 90%
}

.mw-50 {
max-width: 50%
}
</style>