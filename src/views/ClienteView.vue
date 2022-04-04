<template>
  <div class="cliente">
    <TablaCartaCliente/>
  </div>
</template>

<script>
// @ is an alias to /src
import TablaCartaCliente from '@/components/TablaCartaCliente.vue'

export default {
  name: 'ClienteView',
  components: {
    TablaCartaCliente
  }
}
</script>
