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
          <p class="text-h3 font-weight-bold">Registrasi Akun</p>
          <p>Isi data di bawah untuk registrasi akunmu</p>
          <p>Sudah punya akun? <router-link to="/login" class="text--blue-darken-2">Login!</router-link></p>
          <v-text-field
            v-model="name"
            label="Nama Lengkap"
            outlined
            dense
            hide-details
            class="mb-3"
          />
          <v-text-field
            v-model="nip"
            label="NIP"
            outlined
            dense
            hide-details
            class="mb-3"
          />
          <v-text-field
            v-model="email"
            label="Email"
            outlined
            dense
            type="email"
            hide-details
            class="mb-3"
          />
          <v-text-field
            v-model="password"
            label="Password"
            outlined
            dense
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (showPassword = !showPassword)"
            :type="showPassword ? 'text' : 'password'"
          />
          <v-btn 
              color="blue darken-2"
              elevation="2"
              class="white--text"
              :loading="isLoading"
              @click="register"
          >
            Register
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
import { createUserWithEmailAndPassword, updateProfile  } from "@firebase/auth";
import { setDoc, doc } from "@firebase/firestore";
import { utils } from '@/mixins'
import Notification from '@/components/Notification';

export default {
name: 'RegisterView',
components: { Notification },
mixins: [utils],
data: () => ({
  name: "",
  nip: "",
  email: "",
  password: "",
  showPassword: false
}),
methods: {
  async register() {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, this.email, this.password)
      await updateProfile(userCred.user, {
        displayName: this.name,
        photoURL: "https://firebasestorage.googleapis.com/v0/b/mytensi-fc11e.appspot.com/o/users%2F1_W35QUSvGpcLuxPo3SRTH4w.png?alt=media&token=783d86c9-49af-44ed-906e-04eb8ae17695"
      })

      await setDoc(doc(db, "admin", userCred.user.uid), {
        name: this.name,
        nip: this.nip
      })
      this.$router.replace({ path: '/' })
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