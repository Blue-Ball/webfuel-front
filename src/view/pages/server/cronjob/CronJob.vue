<template>
  <v-card class="card-body">
    <v-card-title>
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder">Cron Job</span>
      </h3>
      <v-spacer></v-spacer>
      <div class="card-toolbar">
        <b-link to="cronjob/create">
          <a class="btn btn-primary">Create</a>
        </b-link>
        <v-text-field
          outlined
          dense
          label="Search"
          type="text"
          class=" input-lg w-200px mt-5"
        />
      </div>
    </v-card-title>
    <div class="">
      <div
        class="text-muted mt-3 mb-5 font-weight-bold font-size-sm"
        data-nsfw-filter-status="swf"
      >
        Rebuilding Cron Job will delete all Cron Job configs that was generated
        by RunCloud. We will add it back to match your configuration below.
      </div>
      <b-table
        :items="cronjobs"
        :fields="fields"
        show-empty
        empty-text="You don't have any cron jobs configured yet."
      >
        <template #cell(action)="data">
          <b-link :to="`cronjob/` + data.item._id + `/edit`" class="mr-2">
            <i class="fas fa-edit text-primary"></i>
          </b-link>
          <a role="button" v-on:click="delete_cronjob(data.item._id)"
            ><i class="fas fa-trash-alt text-danger"></i
          ></a>
        </template>
      </b-table>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      fields: [
        { key: "label", label: "Job name" },
        { key: "username", label: "Run as" },
        { key: "command", label: "Command" },
        { key: "time", label: "Time to run" },
        "action",
      ],
    };
  },
};
</script>


<style scoped src="@/assets/styles/server.css"></style>

<script>
import { mapGetters } from "vuex";
import { GET_CRONJOBS } from "@/core/services/store/cronjob.module";
export default {
  data() {
    return {
      fields: [
        { key: "label", label: "Job name" },
        { key: "username", label: "Run as" },
        { key: "command", label: "Command" },
        { key: "time", label: "Time to run" },
        { key: "action", label: "Action" },
      ],
    };
  },
  computed: {
    ...mapGetters(["cronjobs"]),
  },
  mounted() {
    this.$store.dispatch(GET_CRONJOBS, this.$parent.serverId);
  },
  methods: {
    delete_cronjob: function (jobId) {
      this.$store.dispatch(REVOKE_USER, {
        serverId: this.$parent.serverId,
        databaseId: dbId,
        dbuserId: userId,
      });
      this.$router.go();
    },
    update_cronjob: function (jobId) {
      this.$store.dispatch(DELETE_DBUSER, {
        serverId: this.$parent.serverId,
        dbuserId: userId,
      });
      this.$store.dispatch(GET_DATABASES, this.$parent.serverId);
      this.$store.dispatch(GET_DBUSERS, this.$parent.serverId);
    },
    rebuild_cronjob: function (jobId) {
      this.$store.dispatch(DELETE_DATABASE, {
        serverId: this.$parent.serverId,
        databaseId: dbId,
      });
      this.$store.dispatch(GET_DATABASES, this.$parent.serverId);
      this.$store.dispatch(GET_DBUSERS, this.$parent.serverId);
    },
  },
};
</script>
