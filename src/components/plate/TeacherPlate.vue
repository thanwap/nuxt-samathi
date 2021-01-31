<template>
  <div>
    <div class="plate plate-main">
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
        <img class="plate-picture-image" :src="image" alt="" />
      </div>
      <div class="plate-footer-wrap">
        <div class="plate-footer">
          <div>หนังสือครูสมาธิ เล่ม {{ bookNumber }}</div>
          <div>สมเด็จพระญาณวชิโรดม (หลวงพ่อวิริยังค์ สิรินฺธโร)</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chapterName: String,
    teacherName: String,
    image: String,
    bookNumber: String,
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.plate {
  position: relative;
  width: 100%;
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
      width: 80%;
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
