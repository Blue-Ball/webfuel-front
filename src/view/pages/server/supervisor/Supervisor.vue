<template>
  <v-card class="card-body">
    <v-card-title>
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder">Supervisor Jobs</span>
      </h3>
      <v-spacer></v-spacer>
      <div class="card-toolbar">
        <b-link to="supervisor/create">
          <a class="btn btn-primary">Create</a>
        </b-link>
        <v-text-field
          outlined
          dense
          label="Search"
          type="text"
          class="input-lg w-200px mt-5"
        />
      </div>
    </v-card-title>
    <div class="">
    <span
      class="text-muted font-weight-bold font-size-sm"
      >Monitor and control processes on your server.</span
    >
    </div>
  </v-card>
</template>



<style scoped src="@/assets/styles/server.css"></style>

<script>
    export default {
        data() {
            return {
             
            };
        },
    };
</script>