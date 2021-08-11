<template>
  <v-card class="card-body">
    <v-card-title>
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder">SSH Keys</span>
      </h3>
      <v-spacer></v-spacer>
      <div class="card-toolbar">
        <b-link to="sshkey/create">
          <a class="btn btn-primary font-weight-bolder font-size-sm mb-5"
            >Add SSH Keys</a
          >
        </b-link>
        <v-text-field
          outlined
          dense
          label="Search"
          type="text"
        />
      </div>
    </v-card-title>
    <div class="">
      <b-table
        :fields="fields"
        :items="sshkeys"
        empty-text="You don't have anything inside here yet."
        show-empty
      >
        <template #cell(public_key)="data">
          <p>
            {{data.item.publicKey}}
          </p>
        </template>
        <template #cell(delete)="data">
          <a role="button" v-on:click="delete_sshkey(data.item._id)"
            ><i class="fas fa-trash-alt text-danger"></i
          ></a>
        </template>
      </b-table>
    </div>
  </v-card>
</template>


<style scoped src="@/assets/styles/server.css"></style>

<script>
import { mapGetters } from "vuex";
import {
  GET_SSHKEYS,
  REVOKE_SSHKEY,
} from "@/core/services/store/sshkey.module";
export default {
  data() {
    return {
      fields: ["label", "user", "public_key", "revoke"],
    };
  },
  computed: {
    ...mapGetters(["sshkeys"]),
  },
  mounted() {
    this.$store.dispatch(GET_SSHKEYS, this.$parent.serverId);
  },
  methods: {
    delete_sshkey: function (id) {
      this.$store.dispatch(REVOKE_SSHKEY, {
        serverId: this.$parent.serverId,
        sshkey: id,
      });
      this.$store.dispatch(GET_SSHKEYS, this.$parent.serverId);
    },
  },
};
</script>
