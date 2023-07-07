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
          :items="quiz"
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
        <v-toolbar-title>Detail Soal Kuis</v-toolbar-title>
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
              <v-img :src="selectedItem.question_image" max-height="300" max-width="300"></v-img>
              <v-file-input
                class="mt-3"
                label="Ganti gambar"
                outlined
                dense
                v-model="selectedImage"
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
                v-model="selectedItem.question"
                label="Pertanyaan"
                outlined
              />
              <v-select
                v-model="selectedItem.answer"
                :items="options"
                label="Jawaban"
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="selectedItem.option_a"
                label="Opsi A"
                outlined
              />
              <v-text-field
                v-model="selectedItem.option_b"
                label="Opsi B"
                outlined
              />
              <v-text-field
                v-model="selectedItem.option_c"
                label="Opsi C"
                outlined
              />
              <v-text-field
                v-model="selectedItem.option_d"
                label="Opsi D"
                outlined
              />
              <v-text-field
                v-model="selectedItem.option_e"
                label="Opsi E"
                outlined
              />
            </v-col>
            <v-col>
              <p>Penjelasan</p>
              <mavon-editor
                v-model="selectedItem.explanation"
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
          Anda yakin ingin menghapus soal kuis ini?
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
  name: "QuizView",
  data: () => ({
    headers: [
      {
        text: 'No',
        align: 'start',
        value: 'number',
      },
      { text: 'Pertanyaan', value: 'question' },
      { text: 'Action', value: 'action', width: '20%' }
    ],
    quiz: [],
    dialog: false,
    deleteDialog: false,
    mode: 'edit',
    selectedItem: {},
    selectedImage: null,
    options: ['A', 'B', 'C', 'D', 'E']
  }),
  methods: {
    async saveEdit() {
      const data = {
        number: parseInt(this.selectedItem.number),
        question: this.selectedItem.question,
        question_image: this.selectedItem.question_image,
        option_a: this.selectedItem.option_a,
        option_b: this.selectedItem.option_b,
        option_c: this.selectedItem.option_c,
        option_d: this.selectedItem.option_d,
        option_e: this.selectedItem.option_e,
        answer: this.selectedItem.answer.toLowerCase(),
        explanation: this.selectedItem.explanation
      }
      if (this.mode == 'add') {
        await addDoc(collection(db, "quiz"), data)
      } else {
        await setDoc(doc(db, "quiz", this.selectedItem.id), data)
      }
      this.closeDialog()
    },
    async uploadFile() {
      if (this.selectedImage == null) return

      const storageRef = ref(storage, `contents/${this.selectedImage.name}`)
      const result = await uploadBytes(storageRef, this.selectedImage)
      const downlaodUrl = await getDownloadURL(result.ref)
      this.selectedItem.question_image = downlaodUrl
    },
    async deleteDoc() {
      await deleteDoc(doc(db, 'quiz', this.selectedItem.id))
      this.closeDeteleDialog()
    },
    openDialog(item, mode) {
      if (item == null) {
        this.selectedItem = {
          question_image: 'https://thumbs.dreamstime.com/b/no-thumbnail-image-placeholder-forums-blogs-websites-148010362.jpg'
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
    const ref = query(collection(db, 'quiz'), orderBy('number'))
    onSnapshot(ref, (result) => {
      this.quiz = []
      result.forEach(item => {
        const data = item.data()
        this.quiz.push({
          id: item.id,
          number: data.number,
          question: data.question,
          question_image: data.question_image,
          option_a: data.option_a,
          option_b: data.option_b,
          option_c: data.option_c,
          option_d: data.option_d,
          option_e: data.option_e,
          answer: data.answer.toUpperCase(),
          explanation: data.explanation
        })
      })
    })
  }
}
</script>

<style>

</style>