<template>
  <div class="staff">
    <TablaCartaStaff/>
  </div>
</template>

<script>
// @ is an alias to /src
import TablaCartaStaff from '@/components/TablaCartaStaff.vue'

export default {
  name: 'StaffView',
  components: {
    TablaCartaStaff
  }
}
</script>
