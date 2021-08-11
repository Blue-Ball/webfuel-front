<template>
  <v-card class="card-body">
    <v-card-title>
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder"
          >PHP-CLI Version</span
        >
      </h3>
      <span
        class="text-muted mt-3 font-weight-bold font-size-sm"
        data-nsfw-filter-status="swf"
        >Your RunCloud server is equipped with multiple PHP Versions for
        multiple types of Web Applications in order to want to run PHP-CLI
        with different versions. If you use Composer, it will run using the
        PHP-CLI version you have chosen.</span
      >
    </v-card-title>
    <div class="">
      <b-form id="kt_form_phpverison">
        <b-form-group label="Select PHP Version">
          <b-form-radio-group
            v-model="serverPHPVersion"
            :options="php_versions"
            buttons
            button-variant="outline-primary"
            size="lg"
            name="phpVersion"
          ></b-form-radio-group>
        </b-form-group>
        <v-btn
          color="primary"
          left
          type="submit"
          ref="kt_form_phpverison_submit"
        >
          Update PHP-CLI Version
        </v-btn>
      </b-form>
    </div>
  </v-card>
</template>


<style lang="scss">
@import "@/assets/sass/pages/wizard/wizard-1.scss";
</style>

<script>
import formValidation from "@/assets/plugins/formvalidation/dist/es6/core/Core";
import Trigger from "@/assets/plugins/formvalidation/dist/es6/plugins/Trigger";
import Bootstrap from "@/assets/plugins/formvalidation/dist/es6/plugins/Bootstrap";
import SubmitButton from "@/assets/plugins/formvalidation/dist/es6/plugins/SubmitButton";
import KTUtil from "@/assets/js/components/util";

import Swal from "sweetalert2";
import { mapGetters } from "vuex";
import {
  GET_SERVER_PHPVERSION,
  UPDATE_SERVER_PHPVERSION,
  SET_SERVER_PHPVERSION,
} from "@/core/services/store/servers.module";
import { Constants } from "@/core/services/constants.module";

export default {
  data() {
    return {
      php_versions: Constants.php_versions,
    };
  },
  computed: {
    ...mapGetters({ phpVersion: "serverPHPVersion" }),
    serverPHPVersion: {
      get() {
        return this.phpVersion;
      },
      set(value) {
        this.$store.dispatch(SET_SERVER_PHPVERSION, value);
        return value;
      },
    },
  },
  mounted() {
    this.$store.dispatch(GET_SERVER_PHPVERSION, this.$parent.serverId);
    const update_form = KTUtil.getById("kt_form_phpverison");
    this.fv = formValidation(update_form, {
      fields: {
        phpVersion: {
          validators: {
            notEmpty: {
              message: "this field is required",
            },
          },
        },
      },
      plugins: {
        trigger: new Trigger(),
        submitButton: new SubmitButton(),
        bootstrap: new Bootstrap(),
      },
    });
    this.fv.on("core.form.valid", this.updatePHPversion);
    this.fv.on("core.form.invalid", () => {});
  },
  methods: {
    updatePHPversion() {
      const submitButton = this.$refs["kt_form_phpverison_submit"];
      submitButton.classList.add("spinner", "spinner-light", "spinner-right");
      const removeSpinner = () => {
        submitButton.classList.remove(
          "spinner",
          "spinner-light",
          "spinner-right"
        );
      };
      const payload = {
        phpVersion: this.serverPHPVersion,
        serverId: this.$parent.serverId,
      };
      console.log("data", payload);
      this.$store
        .dispatch(UPDATE_SERVER_PHPVERSION, payload)
        .then(() => {
          removeSpinner();
          this.onCreateSuccess();
        })
        .catch(() => {
          removeSpinner();
        });
    },
    onCreateSuccess() {
      Swal.fire({
        title: "",
        text: "PHP version has been successfully updated",
        icon: "success",
        confirmButtonClass: "btn btn-secondary",
        heightAuto: false,
      }).then(() => {
        // this.$router.push({
        //   name: "server-database",
        // });
      });
    },
  },
};
</script>