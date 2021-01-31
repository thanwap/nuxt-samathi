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
          <v-img
            max-width="100"
            :src="
              item.teacher
                ? item.teacher.imageUrl
                  ? item.teacher.imageUrl
                  : 'https://firebasestorage.googleapis.com/v0/b/nuxt-samathi.appspot.com/o/images%2Fteacher-mock.jpg?alt=media&token=6ae7ae12-f7db-4c43-8b0c-97e74909bcb3'
                : 'https://firebasestorage.googleapis.com/v0/b/nuxt-samathi.appspot.com/o/images%2Fteacher-mock.jpg?alt=media&token=6ae7ae12-f7db-4c43-8b0c-97e74909bcb3'
            "
          ></v-img>
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
        { text: 'วันที่', value: 'date', width: 150, filterable: true },
        { text: 'เริ่ม', value: 'start', width: 150, filterable: true },
        { text: 'จบ', value: 'end', width: 150, filterable: true },
        { text: 'หัวข้อ', value: 'chapter.name' },
        { text: 'ผู้บรรยาย', value: 'teacher.fullName' },
        { text: 'รูป', value: 'teacher.imageUrl', align: 'center', width: 150 },
        { text: 'action', value: 'id', align: 'center', width: 200 },
      ],
      schedules: [],
      scheduleDic: {},
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

      const schedules = await this.$services.scheduleApi.listWithKey()
      const chapters = await this.$services.chapterApi.listWithKey()
      const teachers = await this.$services.teacherApi.listWithKey()

      for (const key in schedules) {
        this.scheduleDic[schedules[key].date] = schedules[key]
        this.scheduleDic[schedules[key].date].id = key
      }

      for (const key in chapters) {
        this.chapterDic[chapters[key].name] = chapters[key]
        this.chapterDic[chapters[key].name].id = key
      }

      for (const key in teachers) {
        this.teacherDic[teachers[key].fullName] = teachers[key]
        this.teacherDic[teachers[key].fullName].id = key
      }

      for (const key in schedules) {
        const scheduleItem = {
          id: key,
          date: schedules[key].date,
          start: schedules[key].start,
          end: schedules[key].end,
          chapter: chapters[schedules[key].chapterId],
          teacher: teachers[schedules[key].teacherId],
        }
        this.schedules.push(scheduleItem)
      }
      this.loading = false
    },
    goToAdd() {
      this.$router.push({
        path: '/master/schedule/add',
      })
    },
    goToEdit(id) {
      this.$router.push({
        path: '/master/schedule/' + id,
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
      this.$services.scheduleApi.delete(this.deleteId)
      this.deleteId = ''
      this.dialogDelete = false
      await this.loadItems()
    },
    onUploadExcel(file) {
      if (!file) return
      let reader = new FileReader()

      reader.onload = async function (e) {
        this.loading = true
        let data = new Uint8Array(e.target.result)
        let workbook = XLSX.read(data, { type: 'array' })
        let first_sheet_name = workbook.SheetNames[0]
        let worksheet = workbook.Sheets[first_sheet_name]
        const rows = Number(worksheet['!ref'].split(':')[1].substring(1))
        console.log(worksheet)

        for (let i = 4; i <= rows; i++) {
          if (!worksheet['B' + i]) break

          const chapterName = worksheet['D' + i]
            ? worksheet['D' + i].w.trim()
            : ''
          if (!this.chapterDic[chapterName]) {
            let time = worksheet['E' + i] ? worksheet['E' + i].v : 0

            let chapter = {
              chapterNumber: chapterName.split(' ')[0],
              bookNumber: isNaN(chapterName.split(' ')[0][0])
                ? '3'
                : chapterName.split(' ')[0][0],
              name: chapterName,
              time: time,
            }

            const chapterId = await this.$services.chapterApi.add(chapter)
            chapter.id = chapterId
            this.chapterDic[chapterName] = chapter
          }

          const prefix = worksheet['F' + i] ? worksheet['F' + i].w.trim() : ''
          const name = worksheet['G' + i] ? worksheet['G' + i].w.trim() : ''
          const lastName = worksheet['H' + i] ? worksheet['H' + i].w.trim() : ''
          const phoneNumber = worksheet['I' + i]
            ? worksheet['I' + i].w.trim()
            : ''

          const fullName = `${prefix} ${name} ${lastName}`.trim()

          if (fullName && !this.teacherDic[fullName]) {
            let teacher = {
              prefix: prefix,
              name: name,
              lastname: lastName,
              fullName: fullName,
              phoneNumber: phoneNumber,
              imageUrl: '',
            }
            let teacherId = await this.$services.teacherApi.add(teacher)
            teacher.id = teacherId
            this.teacherDic[fullName] = teacher
          }

          const dateString = worksheet['B' + i] ? worksheet['B' + i].w : null

          const startEnd = worksheet['C' + i] ? worksheet['C' + i].w : null
          let start = null
          let end = null

          if (startEnd) {
            const times = startEnd.slice(0, startEnd.length - 2).split('-')
            start = times.length > 0 ? times[0].replace('.', ':').trim() : null
            end = times.length > 1 ? times[1].replace('.', ':').trim() : null
          }

          if (new Date(dateString).toString() === 'Invalid Date') {
            continue
          }

          let schedule = {
            date: dateString ? this.formatDate(new Date(dateString)) : null,
            start: start,
            end: end,
            chapterId: this.chapterDic[chapterName]
              ? this.chapterDic[chapterName].id
              : '',
            teacherId: this.teacherDic[fullName]
              ? this.teacherDic[fullName].id
              : '',
          }

          if (this.scheduleDic[schedule.date]) {
            this.$services.scheduleApi.update(
              this.scheduleDic[schedule.date].id,
              schedule
            )
          } else {
            this.$services.scheduleApi.add(schedule)
          }

          console.log('schedule', schedule)
        }
        this.loading = false
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
    formatDate(date) {
      console.log(date)
      if (!date) return ''

      return `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(
        2,
        '0'
      )}-${(date.getDate() + '').padStart(2, '0')}`
    },
  },
  async mounted() {
    await this.loadItems()
  },
}
</script>

<style lang="scss" scoped></style>
