<template>
  <div>
    <h1>อาจารย์ - รายการ</h1>
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
        :items="teachers"
        :search="search"
      >
        <template v-slot:[`item.imageUrl`]="{ item }">
          <v-img max-width="100" :src="item.imageUrl"></v-img>
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
          >คุณแน่ใจหรือไม่ที่จะลบอาจารย์ ?</v-card-title
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
        { text: 'รูป', value: 'imageUrl', align: 'center', width: 100 },
        { text: 'ชื่อ-นามสกุล', value: 'fullName', filterable: true },
        { text: 'เบอร์โทรศัพท์', value: 'phoneNumber', width: 200 },
        { text: 'action', value: 'id', align: 'center', width: 200 },
      ],
      teachers: [],
      search: '',
      loading: false,
      dialogDelete: false,
      deleteId: '',
      fileName: null,
    }
  },
  methods: {
    async loadItems() {
      console.log('load Teachers')
      this.teachers = []
      this.loading = true
      try {
        this.teachers = await this.$services.teacherApi.list()
      } catch (e) {
        console.log(e)
      }

      this.loading = false
    },
    goToAdd() {
      this.$router.push({
        path: '/master/teacher/add',
      })
    },
    goToEdit(id) {
      this.$router.push({
        path: '/master/teacher/' + id,
      })
    },
    deleteItem(id) {
      this.dialogDelete = true
      this.deleteId = id
    },
    async deleteConfirm() {
      await this.$services.teacherApi.delete(this.deleteId)
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

      reader.onload = async function (e) {
        this.loading = true

        let data = new Uint8Array(e.target.result)
        let workbook = XLSX.read(data, { type: 'array' })
        let first_sheet_name = workbook.SheetNames[0]
        let worksheet = workbook.Sheets[first_sheet_name]
        const rows = Number(worksheet['!ref'].split(':')[1].substring(1))

        for (let i = 1; i <= rows; i++) {
          let teacher = {
            prefix: worksheet['A' + i].v,
            name: worksheet['B' + i].v,
            lastname: worksheet['C' + i].v,
            fullName: `${worksheet['A' + i].v} ${worksheet['B' + i].v} ${
              worksheet['C' + i].v
            }`,
            phoneNumber: worksheet['D' + i] ? worksheet['D' + i].v : '',
            imageUrl: '',
          }
          const oldTeacher = this.teachers.find(
            (x) => x.fullName === teacher.fullName
          )
          if (oldTeacher) {
            await this.$services.teacherApi.update(oldTeacher.id, teacher)
          } else {
            await this.$services.teacherApi.add(teacher)
          }
        }
        this.fileName = null
        this.loading = false
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
    this.loadItems()
  },
}
</script>

<style lang="scss" scoped></style>
