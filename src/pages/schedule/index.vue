<template>
  <div>
    <h1>ตารางสอน - รายการ</h1>
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
          clearable
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
        :items="schedules"
        :search="search"
      >
        <template v-slot:[`item.teacher.imageUrl`]="{ item }">
          <v-img max-width="100" :src="item.teacher.imageUrl"></v-img>
        </template>
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
            @click="deleteSchedule(item.id)"
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
          >คุณแน่ใจหรือไม่ที่จะลบตาราง ?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">ยกเลิก</v-btn>
          <v-btn color="red darken-1" text @click="deleteConfirm">ตกลง</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  data() {
    return {
      headers: [
        { text: 'วันที่', value: 'date', width: 150, filterable: true },
        { text: 'หัวข้อ', value: 'chapter.name' },
        { text: 'ผู้บรรยาย', value: 'teacher.name' },
        { text: 'รูป', value: 'teacher.imageUrl', align: 'center', width: 150 },
        { text: 'action', value: 'id', align: 'center', width: 200 },
      ],
      schedules: [],
      chapterDic: {},
      teacherDic: {},
      search: '',
      loading: false,
      dialogDelete: false,
      deleteId: '',
      fileName: null,
    }
  },
  methods: {
    async loadItems() {
      this.schedules = []
      this.loading = true
      const scheduleRef = this.$fire.database.ref('schedule')
      const chaptersRef = this.$fire.database.ref('chapter')
      const teacherRef = this.$fire.database.ref('teacher')

      const scheduleSnapshot = await scheduleRef.once('value')
      const chapterSnapshot = await chaptersRef.once('value')
      const teacherSnapshot = await teacherRef.once('value')

      const schedules = scheduleSnapshot.val()
      const chapters = chapterSnapshot.val()
      const teachers = teacherSnapshot.val()

      for (const key in chapters) {
        this.chapterDic[chapters[key].name] = chapters[key]
        this.chapterDic[chapters[key].name].id = key
      }

      for (const key in teachers) {
        this.teacherDic[teachers[key].fullName] = teachers[key]
        this.teacherDic[teachers[key].fullName].id = key
      }

      console.log('chapterDic', this.chapterDic)
      console.log('teacherDic', this.teacherDic)

      for (const key in schedules) {
        const scheduleItem = {
          id: key,
          date: schedules[key].date,
          chapter: chapters[schedules[key].chapterId],
          teacher: teachers[schedules[key].teacherId],
        }
        this.schedules.push(scheduleItem)
      }
      this.loading = false
    },
    goToAdd() {
      this.$router.push({
        path: '/schedule/add',
      })
    },
    goToEdit(id) {
      this.$router.push({
        path: '/schedule/' + id,
      })
    },
    deleteSchedule(id) {
      this.dialogDelete = true
      this.deleteId = id
    },
    closeDelete() {
      this.dialogDelete = false
    },
    async deleteConfirm() {
      await this.$fire.database.ref('schedule/' + this.deleteId).remove()
      this.deleteId = ''
      this.dialogDelete = false
      await this.loadItems()
    },
    onUploadExcel(file) {
      if (!file) return
      let reader = new FileReader()

      reader.onload = function (e) {
        let data = new Uint8Array(e.target.result)
        let workbook = XLSX.read(data, { type: 'array' })
        let first_sheet_name = workbook.SheetNames[0]
        let worksheet = workbook.Sheets[first_sheet_name]
        const rows = Number(worksheet['!ref'].split(':')[1].substring(1))
        console.log(worksheet)
        console.log('rows', rows)

        for (let i = 4; i <= rows; i++) {
          if (!worksheet['B' + i]) break

          console.log(worksheet['B' + i].w)
          const chapterName = worksheet['D' + i]
            ? worksheet['D' + i].w.trim()
            : ''
          console.log('chapterName', chapterName)
          if (!this.chapterDic[chapterName]) {
            // add chapter
          }
          const fullName = `${
            worksheet['F' + i] ? worksheet['F' + i].w.trim() : ''
          } ${worksheet['G' + i] ? worksheet['G' + i].w.trim() : ''} ${
            worksheet['H' + i] ? worksheet['H' + i].w.trim() : ''
          }`

          console.log('fullName', fullName)

          if (!this.teacherDic[fullName]) {
            // add chapter
          }

          let schedule = {
            date: worksheet['B' + i].w,
            chapterId: this.chapterDic[chapterName]
              ? this.chapterDic[chapterName].id
              : '',
            teacherId: this.teacherDic[fullName]
              ? this.teacherDic[fullName].id
              : '',
          }

          console.log(schedule)
        }

        // for (let i = 1; i <= rows; i++) {
        //   // let teacher = {
        //   //   prefix: worksheet['A' + i].v,
        //   //   name: worksheet['B' + i].v,
        //   //   lastname: worksheet['C' + i].v,
        //   //   fullName: `${worksheet['A' + i].v} ${worksheet['B' + i].v} ${
        //   //     worksheet['C' + i].v
        //   //   }`,
        //   //   phoneNumber: worksheet['D' + i] ? worksheet['D' + i].v : '',
        //   //   imageUrl: '',
        //   // }

        // }
        this.fileName = null
        this.loadItems()
      }.bind(this)
      reader.readAsArrayBuffer(file)
    },
    downloadExample() {
      var file_path =
        'https://firebasestorage.googleapis.com/v0/b/samathi-8.appspot.com/o/example%2Fteacher.xlsx?alt=media&token=cfc5eca0-2854-4958-816b-c528118f891c'
      var a = document.createElement('A')
      a.href = file_path
      a.download = file_path.substr(file_path.lastIndexOf('/') + 1)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
  },
  async mounted() {
    await this.loadItems()
  },
}
</script>

<style lang="scss" scoped></style>
