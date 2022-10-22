<template>
  <div>
    <div class="card-header">
      {{ title }}
      <svg
        t="1665815058861"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1462"
        width="16"
        height="16"
      ><path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" p-id="1463" fill="#8a8a8a" /></svg>
    </div>
    <div class="card-content">
      {{ count }}
    </div>

    <div class="card-charts">
      <slot name="charts" />
    </div>

    <div class="card-footer">
      <slot name="footer" />
    </div>

  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: {
    title: {
      type: String,
      default: ''
    },
    count: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.card-header{
  display: flex;
  justify-content: space-between;
  color:#d9d9d9;
}

.card-content{
  font-size: 30px;
  padding: 10px 0px;
}

.card-charts{
  height: 55px;
  font-size: 13px;
  padding-top: 23px;
}
.card-footer{
  border-top: 1px #eee solid;
  padding-top: 10px;
  font-size: 14px;

}
</style>
