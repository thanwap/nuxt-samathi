<template>
  <div>
    <div>
      <div ref="plate" class="plate plate-main">
        <div class="plate-head">
          <img src="~assets/images/header.jpg" alt="" />
        </div>
        <div class="plate-detail-wrap">
          <div class="plate-detail">
            <div>หัวข้อ : {{ chapterName }}</div>
            <div>ผู้บรรยาย : {{ teacherName }}</div>
          </div>
        </div>
        <div class="plate-picture">
          <img :src="croppedImageBase64" alt="" />
        </div>
        <div class="plate-footer-wrap">
          <div class="plate-footer">
            <div>หนังสือครูสมาธิ เล่ม {{ bookNumber }}</div>
            <div>สมเด็จพระญาณวชิโรดม (หลวงพ่อวิริยังค์ สิรินฺธโร)</div>
          </div>
        </div>
      </div>
      <div><button @click="downloadPlate">download</button></div>
    </div>
    <v-row>
      <v-col>
        <v-form ref="form" lazy-validation>
          <v-text-field v-model="chapterName" label="หัวข้อ"></v-text-field>
          <v-text-field v-model="teacherName" label="ผู้บรรยาย"></v-text-field>
          <v-text-field
            v-model="bookNumber"
            label="หนังสือครูสมาธิ เล่ม"
          ></v-text-field>
        </v-form>
      </v-col>
      <v-col>
        <cropper
          class="cropper"
          :src="imageBase64"
          :stencil-props="{
            aspectRatio: 4 / 4,
          }"
          @change="change"
        ></cropper
      ></v-col>
    </v-row>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export default {
  components: { Cropper },
  data() {
    return {
      chapterName: '',
      teacherName: '',
      bookNumber: '',
      imageUrl: '',
      imageBase64: '',
      croppedImageBase64: '',
      output: null,
    }
  },
  methods: {
    async loadPage() {
      const schedule = await this.$services.scheduleApi.getScheduleByDate(
        new Date('2020-09-22')
      )
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
      console.log('el', el)
      // add option type to get the image version
      // if not provided the promise will return
      // the canvas.
      const options = {
        type: 'dataURL',
      }
      console.log(this.$html2canvas)
      let canvas = await this.$html2canvas(el, options)
      const a = document.createElement('a')
      a.href = canvas.toDataURL()
      a.target = '_blank'
      a.download = 'teacher-image'
      a.click()
    },
  },
  async mounted() {
    await this.loadPage()
  },
}
</script>

<style lang="scss" scoped>
.plate {
  position: relative;
  width: 30%;
  font-family: rsuregular, Tahoma;
  margin: 0 auto;

  .plate-head {
    z-index: 0;
    width: 100%;

    img {
      width: 100%;
      height: auto;
    }
  }

  .plate-detail-wrap {
    position: relative;
    margin-top: -11px;
    padding-bottom: 10px;
    background: white;
    z-index: 200;
  }

  .plate-detail {
    position: relative;
    z-index: 1;
    border-top: solid black 1px;
    border-bottom: solid black 1px;
    padding-top: 5px;
    padding-bottom: 5px;
    text-align: center;
    color: #180180;
    font-weight: bold;
    font-size: 20px;
    line-height: 40px;
    background: rgb(64, 164, 242);
    background: -moz-linear-gradient(
      180deg,
      rgba(64, 164, 242, 1) 0%,
      rgba(214, 235, 252, 1) 100%
    );
    background: -webkit-linear-gradient(
      180deg,
      rgba(64, 164, 242, 1) 0%,
      rgba(214, 235, 252, 1) 100%
    );
    background: linear-gradient(
      180deg,
      rgba(64, 164, 242, 1) 0%,
      rgba(214, 235, 252, 1) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#40a4f2",endColorstr="#d6ebfc",GradientType=1);
  }

  .plate-picture {
    position: relative;
    text-align: center;

    .plate-picture-image {
      overflow: hidden;
      height: auto;
    }

    .plate-block {
      position: absolute;
      background: white;
      height: 100%;
      top: 0;
      z-index: 3;
    }

    img {
      max-width: 380px;
      width: auto;
      height: auto;
      vertical-align: bottom;
    }
  }

  .plate-footer-wrap {
    padding-top: 10px;
    position: relative;
    z-index: 5;
    background: white;
  }

  .plate-footer {
    border-top: solid black 1px;
    border-bottom: solid black 1px;
    text-align: center;
    color: #180180;
    font-weight: bold;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 20px;
    line-height: 40px;
    background: rgb(64, 164, 242);
    background: -moz-linear-gradient(
      180deg,
      rgba(64, 164, 242, 1) 0%,
      rgba(214, 235, 252, 1) 100%
    );
    background: -webkit-linear-gradient(
      180deg,
      rgba(64, 164, 242, 1) 0%,
      rgba(214, 235, 252, 1) 100%
    );
    background: linear-gradient(
      180deg,
      rgba(64, 164, 242, 1) 0%,
      rgba(214, 235, 252, 1) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#40a4f2",endColorstr="#d6ebfc",GradientType=1);
  }
}
</style>
