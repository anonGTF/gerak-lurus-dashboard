<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn 
          color="primary" 
          depressed 
          class="white--text text-none"
          @click="openDialog(null, 'add')"
        >
          <v-icon class="mr-3">mdi-plus-circle</v-icon>
          Tambah Data
        </v-btn>
        <v-data-table
          :headers="headers"
          :items="materialForTable"
          :items-per-page="5"
          class="elevation-1 mr-3 mt-3"
        >
          <template v-slot:item.thumbnail="{ item }">
            <v-img 
              :src="item.thumbnail"
              max-height="200"
              max-width="200"
            ></v-img>
          </template>

          <template v-slot:item.action="{ item }">
            <v-item-group>
              <v-btn text color="primary" @click.stop="openDialog(item, 'edit')">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
  
              <v-btn text color="red" @click.stop="openDeleteDialog(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-item-group>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="80vw"
    >
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Detail Materi</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            dark
            text
            @click="saveEdit"
          >
            Simpan
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="3" class="mt-4">
              <v-img :src="selectedItem.thumbnail" max-height="300" max-width="300"></v-img>
              <v-file-input
                class="mt-3"
                label="Ganti thumbnail"
                outlined
                dense
                v-model="selectedThumbnail"
                @change="uploadFile"
              ></v-file-input>
            </v-col>
            <v-col cols="9" class="mt-4">
              <v-text-field
                v-model="selectedItem.number"
                label="Nomor"
                type="number"
                outlined
              />
              <v-text-field
                v-model="selectedItem.title"
                label="Judul"
                outlined
              />
            </v-col>
            <v-col cols="12">
              <mavon-editor
                v-model="selectedItem.content"
                language="en"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteDialog"
      persistent
      max-width="360"
    >
      <v-card>
        <v-card-title class="text-h5">
          Anda yakin ingin menghapus materi ini?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            text
            @click="closeDeteleDialog()"
          >
            Batalkan
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="deleteDoc"
          >
            Iya
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { db, storage } from '@/firebase'
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage'
import { collection, onSnapshot, orderBy, query, setDoc, doc, addDoc, deleteDoc } from '@firebase/firestore'

export default {
  name: "MaterialView",
  data: () => ({
    headers: [
      {
        text: 'No',
        align: 'start',
        value: 'number',
      },
      { text: 'Judul', value: 'title' },
      { text: 'Thumbnail', value: 'thumbnail' },
      { text: 'Konten', value: 'shortContent' },
      { text: 'Action', value: 'action' }
    ],
    materials: [],
    dialog: false,
    deleteDialog: false,
    mode: 'edit',
    selectedItem: {},
    selectedThumbnail: null
  }),
  computed: {
    materialForTable: ({ materials }) => 
    materials.map(item => ({
      ...item,
      shortContent: item.content.substring(0, 50) + "..."
    })) 
  },
  methods: {
    async saveEdit() {
      if (this.mode == 'add') {
        await addDoc(collection(db, "materials"), {
          number: parseInt(this.selectedItem.number),
          title: this.selectedItem.title,
          thumbnail: this.selectedItem.thumbnail,
          content: this.selectedItem.content
        })
      } else {
        await setDoc(doc(db, "materials", this.selectedItem.id), {
          number: parseInt(this.selectedItem.number),
          title: this.selectedItem.title,
          thumbnail: this.selectedItem.thumbnail,
          content: this.selectedItem.content
        })
      }
      this.closeDialog()
    },
    async uploadFile() {
      if (this.selectedThumbnail == null) return

      const storageRef = ref(storage, `contents/${this.selectedThumbnail.name}`)
      const result = await uploadBytes(storageRef, this.selectedThumbnail)
      const downlaodUrl = await getDownloadURL(result.ref)
      this.selectedItem.thumbnail = downlaodUrl
    },
    async deleteDoc() {
      await deleteDoc(doc(db, 'materials', this.selectedItem.id))
      this.closeDeteleDialog()
    },
    openDialog(item, mode) {
      if (item == null) {
        this.selectedItem = {
          thumbnail: 'https://thumbs.dreamstime.com/b/no-thumbnail-image-placeholder-forums-blogs-websites-148010362.jpg'
        }
      } else {
        this.selectedItem = item
      }
      this.mode = mode
      this.dialog = true
    },
    closeDialog() {
      this.selectedItem = {}
      this.dialog = false
    },
    openDeleteDialog(item) {
      this.selectedItem = item
      this.deleteDialog = true
    },
    closeDeteleDialog() {
      this.selectedItem = {}
      this.deleteDialog = false
    }
  },
  async mounted() {
    const ref = query(collection(db, 'materials'), orderBy('number'))
    onSnapshot(ref, (result) => {
      this.materials = []
      result.forEach(item => {
        const data = item.data()
        this.materials.push({
          id: item.id,
          number: data.number,
          title: data.title,
          thumbnail: data.thumbnail,
          content: data.content.replaceAll('\\n', '\n')
        })
      })
    })
  }
}
</script>

<style>

</style>