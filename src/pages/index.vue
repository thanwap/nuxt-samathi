<template>
  <div>
    <div ref="plate" class="plate-printer">
      <teacher-plate
        :teacher-name="teacherName"
        :chapter-name="chapterName"
        :image="croppedImageBase64"
        :book-number="bookNumber"
      ></teacher-plate>
    </div>
    <v-row>
      <v-col cols="12" sm="4"
        ><div class="show-plate">
          <teacher-plate
            :teacher-name="teacherName"
            :chapter-name="chapterName"
            :image="croppedImageBase64"
            :book-number="bookNumber"
          ></teacher-plate>
          <div class="d-flex justify-center">
            <v-btn
              color="primary"
              class="mt-4 align-center"
              @click="downloadPlate"
            >
              ดาวน์โหลด
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="8">
        <v-form ref="form" lazy-validation>
          <v-menu
            v-model="datePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Picker without buttons"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              @change="loadPage"
              @input="datePicker = false"
            ></v-date-picker>
          </v-menu>
          <v-text-field v-model="chapterName" label="หัวข้อ"></v-text-field>
          <v-text-field v-model="teacherName" label="ผู้บรรยาย"></v-text-field>
          <v-text-field
            v-model="bookNumber"
            label="หนังสือครูสมาธิ เล่ม"
          ></v-text-field>
        </v-form>
        <div>
          <div class="cropper-container">
            <cropper
              class="cropper"
              :src="imageBase64"
              :stencil-props="{
                aspectRatio: 4 / 4,
              }"
              @change="change"
            ></cropper>
          </div>
        </div>

        <v-file-input
          @change="onUploadImage"
          accept="image/*"
          label="File input"
        ></v-file-input>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import TeacherPlate from '../components/plate/TeacherPlate'
import 'vue-advanced-cropper/dist/style.css'

export default {
  components: { Cropper, TeacherPlate },
  data() {
    return {
      chapterName: '',
      teacherName: '',
      bookNumber: '',
      imageUrl: '',
      imageBase64: '',
      croppedImageBase64: '',
      output: null,
      date: new Date().toISOString().substr(0, 10),
      datePicker: false,
    }
  },
  methods: {
    async loadPage() {
      const schedule = await this.$services.scheduleApi.getScheduleByDate(
        new Date(this.date)
      )
      if (!schedule) return
      this.teacherName = schedule.teacher.fullName
      this.chapterName = schedule.chapter.name
      this.bookNumber = schedule.chapter.bookNumber
      this.imageUrl = schedule.teacher.imageUrl
      this.getDataUri(this.imageUrl, (base64) => {
        this.imageBase64 = base64
      })
    },
    change(data) {
      this.croppedImageBase64 = data.canvas.toDataURL()
    },
    getDataUri(targetUrl, callback) {
      var xhr = new XMLHttpRequest()
      xhr.onload = function () {
        var reader = new FileReader()
        reader.onloadend = function () {
          callback(reader.result)
        }
        reader.readAsDataURL(xhr.response)
      }
      var proxyUrl = 'https://cors-anywhere.herokuapp.com/'
      xhr.open('GET', proxyUrl + targetUrl)
      xhr.responseType = 'blob'
      xhr.send()
    },
    async downloadPlate() {
      const el = this.$refs.plate
      const options = {
        type: 'dataURL',
      }

      let canvas = await this.$html2canvas(el, options)
      const a = document.createElement('a')

      a.href = canvas.toDataURL()
      a.target = '_blank'
      a.download = 'teacher-image'
      a.click()
    },
    async onUploadImage(file) {
      if (!file) return
      this.file = file
      var base64 = await this.$utils.toBase64(file)
      this.imageBase64 = base64
    },
  },
  async mounted() {
    await this.loadPage()
  },
}
</script>

<style lang="scss" scoped>
.plate-printer {
  width: 543px;
  position: fixed;
  top: 0;
  left: -543px;
}
.cropper-container {
  width: 50%;
  margin: 0 auto;
}
</style>
