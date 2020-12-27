<template>
  <div>
    <h1>หัวข้อ - รายการ</h1>
    <v-card>
      <div class="d-flex flex-row flex-nowrap">
        <div class="ml-2 my-2">
          <v-btn color="primary" class="mr-4" @click="goToAdd"> เพิ่ม </v-btn>
        </div>
        <div class="my-2">
          <v-btn color="ascent" class="mr-4" @click="downloadExample">
            ตัวอย่างไฟล์ excel
          </v-btn>
        </div>
      </div>
      <div>
        <v-file-input
          v-model="fileName"
          @change="onUploadExcel"
          accept=".xlsx"
          label="อัพโหลดไฟล์ Excel"
        ></v-file-input>
      </div>
      <v-card-subtitle>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="ค้นหา"
          single-line
          hide-details
        ></v-text-field>
      </v-card-subtitle>

      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="chapters"
        :search="search"
      >
        <template v-slot:[`item.id`]="{ item }">
          <v-btn
            @click="goToEdit(item.id)"
            class="ma-2"
            fab
            medium
            color="secondary"
          >
            <v-icon dark> mdi-pencil </v-icon>
          </v-btn>
          <v-btn
            @click="deleteItem(item.id)"
            class="ma-2"
            fab
            medium
            color="red"
          >
            <v-icon dark> mdi-delete </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >คุณแน่ใจหรือไม่ที่จะลบหัวข้อ ?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">ยกเลิก</v-btn>
          <v-btn color="red darken-1" text @click="deleteConfirm">ตกลง</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  data() {
    return {
      headers: [
        { text: 'เล่ม', value: 'bookNumber', width: 150 },
        { text: 'บทที่', value: 'chapterNumber', width: 150, filterable: true },
        { text: 'ชื่อ', value: 'name' },
        { text: 'action', value: 'id', align: 'center', width: 200 },
      ],
      chapters: [],
      search: '',
      loading: false,
      dialogDelete: false,
      deleteId: '',
      fileName: null,
    }
  },
  methods: {
    async loadItems() {
      this.chapters = []
      this.loading = true
      const itemRef = this.$fire.database.ref('chapter')
      const itemSnapshot = await itemRef.once('value')
      const items = itemSnapshot.val()
      for (const key in items) {
        this.chapters.push({
          id: key,
          chapterNumber: items[key].chapterNumber,
          name: items[key].name,
          bookNumber: items[key].bookNumber,
        })
      }
      this.loading = false
    },
    goToAdd() {
      this.$router.push({
        path: '/chapter/add',
      })
    },
    goToEdit(id) {
      this.$router.push({
        path: '/chapter/' + id,
      })
    },
    deleteItem(id) {
      this.dialogDelete = true
      this.deleteId = id
    },
    async deleteConfirm() {
      await this.$fire.database.ref('chapter/' + this.deleteId).remove()
      this.deleteId = ''
      this.dialogDelete = false
      await this.loadItems()
    },
    closeDelete() {
      this.dialogDelete = false
    },
    onUploadExcel(file) {
      if (!file) return
      let reader = new FileReader()

      reader.onload = function (e) {
        let data = new Uint8Array(e.target.result)
        let workbook = XLSX.read(data, { type: 'array' })
        let first_sheet_name = workbook.SheetNames[0]
        let worksheet = workbook.Sheets[first_sheet_name]

        const chapterRef = this.$fire.database.ref('chapter')

        for (const [key, value] of Object.entries(worksheet)) {
          if (key[0] === '!') continue
          let chpater = {
            chapterNumber: value.v.split(' ')[0],
            bookNumber: isNaN(value.v.split(' ')[0][0])
              ? '3'
              : value.v.split(' ')[0][0],
            name: value.v,
          }
          const oldChapter = this.chapters.find(
            (x) => x.chapterNumber === chpater.chapterNumber
          )
          if (oldChapter) {
            const oldChapterRef = this.$fire.database.ref(
              'chapter/' + oldChapter.id
            )
            oldChapterRef.set(chpater)
          } else {
            const newchapterRef = chapterRef.push()
            newchapterRef.set(chpater)
          }
        }
        this.fileName = null
        this.loadItems()
      }.bind(this)
      reader.readAsArrayBuffer(file)
    },
    downloadExample() {
      var file_path =
        'https://firebasestorage.googleapis.com/v0/b/samathi-8.appspot.com/o/example%2Fchapter.xlsx?alt=media&token=46ae66e3-a479-4350-8e5d-7b33197b6a91'
      var a = document.createElement('A')
      a.href = file_path
      a.download = file_path.substr(file_path.lastIndexOf('/') + 1)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
  },

  mounted() {
    this.loadItems()
  },
}
</script>

<style lang="scss" scoped></style>
