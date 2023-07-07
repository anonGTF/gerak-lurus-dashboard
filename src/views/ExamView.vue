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
          :items="examQuestions"
          :items-per-page="5"
          class="elevation-1 mr-3 mt-3"
        >
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
        <v-toolbar-title>Detail Soal Latihan</v-toolbar-title>
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
            <v-col cols="12" class="mt-4">
              <v-text-field
                v-model="selectedItem.number"
                label="Nomor"
                type="number"
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
          Anda yakin ingin menghapus soal latihan ini?
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
import { db } from '@/firebase'
import { collection, onSnapshot, orderBy, query, setDoc, doc, addDoc, deleteDoc } from '@firebase/firestore'

export default {
  name: "ExamView",
  data: () => ({
    headers: [
      {
        text: 'No',
        align: 'start',
        value: 'number',
      },
      { text: 'Soal', value: 'content' },
      { text: 'Action', value: 'action', width: '20%' }
    ],
    examQuestions: [],
    dialog: false,
    deleteDialog: false,
    mode: 'edit',
    selectedItem: {},
  }),
  methods: {
    async saveEdit() {
      if (this.mode == 'add') {
        await addDoc(collection(db, "exam"), {
          number: parseInt(this.selectedItem.number),
          content: this.selectedItem.content
        })
      } else {
        await setDoc(doc(db, "exam", this.selectedItem.id), {
          number: parseInt(this.selectedItem.number),
          content: this.selectedItem.content
        })
      }
      this.closeDialog()
    },
    async deleteDoc() {
      await deleteDoc(doc(db, 'exam', this.selectedItem.id))
      this.closeDeteleDialog()
    },
    openDialog(item, mode) {
      this.selectedItem = item ?? {}
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
    const ref = query(collection(db, 'exam'), orderBy('number'))
    onSnapshot(ref, (result) => {
      this.examQuestions = []
      result.forEach(item => {
        const data = item.data()
        this.examQuestions.push({
          id: item.id,
          number: data.number,
          content: data.content.replaceAll('\\n', '\n')
        })
      })
    })
  }
}
</script>

<style>

</style>