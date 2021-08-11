<template>
  <div class="card card-custom gutter-b">
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark"
          >Server Details</span
        >
      </h3>

      <div class="card-toolbar">
        <input
          type="text"
          placeholder="Search..."
          class="form-control input-lg w-200px mr-5"
        />
      </div>
    </div>
    <div class="card-body pb-10 pt-0">
      <b-table
        :items="this.ServerActivityLogs"
        :fields="fields1"
        show-empty
        empty-text="You don't have anything inside here yet."
      >
        <template #cell(label)="data">
          <div v-if="data.item.label == 'Error'">
            <span class="label label-lg label-inline label-danger"> Error</span>
          </div>
          <div v-if="data.item.label == 'Info'">
            <span class="label label-lg label-inline label-success"> Info</span>
          </div>
          <div v-if="data.item.label == 'Warning'">
            <span class="label label-lg label-inline label-warning">
              Warning</span
            >
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import { GET_SERVER_ACTIVITYLOGS, GET_SERVER } from "@/core/services/store/servers.module";  //


export default {
  props: ["serverId"],
  created() {
    this.$store.dispatch(GET_SERVER_ACTIVITYLOGS, this.serverId);
    //console.log(this.serverId);
  },
  beforeMount() {},
  mounted() {
    this.$store.dispatch(GET_SERVER, this.serverId);
    //console.log(this.ServerActivityLogs);
  },
  computed: {
    ...mapGetters(["currentServer", "ServerActivityLogs"]),
  },
  data() {
    return {
      fields1: ["label", "log", "date", "time"],
    };
  }
};
</script>
