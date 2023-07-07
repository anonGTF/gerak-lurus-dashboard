<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="answerListForTable"
          :items-per-page="5"
          class="elevation-1 mr-3 mt-3"
        >
          <template v-slot:item.answer="{ item }">
            <v-btn
              color="primary"
              large
              text
            >
              <v-icon left>
                mdi-open-in-new
              </v-icon>
              <a :href="item.answer" target="_blank" class="text-decoration-none">Buka File</a>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from '@/firebase'
import { query, onSnapshot, collection, orderBy } from '@firebase/firestore'
import { formatDate } from '@/utils'
import parseISO from 'date-fns/esm/parseISO/index'

export default {
  name: "AnswerListView",
  data: () => ({
    headers: [
        {
          text: 'No',
          align: 'start',
          value: 'index',
        },
        { text: 'Nama', value: 'name' },
        { text: 'Tanggal', value: 'date' },
        { text: 'Jawaban', value: 'answer' },
      ],
      answerList: [],
  }),
  computed: {
    answerListForTable: ({ answerList }) => 
      answerList.map((items, index) => ({
        ...items,
        date: formatDate(parseISO(items.date)),
        index: index + 1
      })),
  },
  async mounted() {
    const ref = query(collection(db, 'answers'), orderBy('date', 'desc'))
    onSnapshot(ref, (result) => {
      this.answerList = []
      result.forEach(item => {
        const data = item.data()
        this.answerList.push({
          id: item.id,
          name: data.name,
          date: data.date,
          answer: data.answer
        })
      })
    })
  }
}
</script>

<style>

</style>