<template>
  <v-card class="card-body">
    <v-card-title>
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder">Add SSH Key</span>
      </h3>
    </v-card-title>
    <div class="">
      <b-form id="kt_form_sshkey">
        <b-form-group label="Use vault">
          <b-form-checkbox size="lg" name="useVault" v-model="form.useVault"
            >Use vaulted SSH Key</b-form-checkbox
          >
        </b-form-group>

        <div class="form-group" v-if="form.useVault">
          <label class="control-label">Vaulted SSH Key</label>
          <b-form-select
            size="lg"
            name="publickey"
            v-model="form.vaultPublickey"
            :options="vaultsshkeys"
            value-field="publickey"
            text-field="name"
          ></b-form-select>
        </div>

        <b-form-group label="Label">
          <b-form-input
            name="label"
            size="lg"
            v-model="form.label"
            placeholder="Any label for you to recognize this public key"
          ></b-form-input>
        </b-form-group>

        <div class="form-group">
          <label class="control-label">User</label>
          <b-form-select
            size="lg"
            name="userId"
            v-model="form.userId"
            :options="systemUsers"
            value-field="_id"
            text-field="name"
          ></b-form-select>
        </div>

        <div class="form-group" v-if="!form.useVault">
          <label class="control-label">Public Key</label>
          <b-form-textarea
            size="lg"
            name="publickey"
            v-model="form.publickey"
            rows="4"
          ></b-form-textarea>
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          ref="kt_form_sshkey_submit"
        >
          Add
        </button>
      </b-form>
    </div>
  </v-card>
</template>


<script>
import formValidation from "@/assets/plugins/formvalidation/dist/es6/core/Core";
import Trigger from "@/assets/plugins/formvalidation/dist/es6/plugins/Trigger";
import Bootstrap from "@/assets/plugins/formvalidation/dist/es6/plugins/Bootstrap";
import SubmitButton from "@/assets/plugins/formvalidation/dist/es6/plugins/SubmitButton";
import KTUtil from "@/assets/js/components/util";

import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import {
  GET_VAULT_SSHKEY,
  CREATE_SSHKEY,
} from "@/core/services/store/sshkey.module";
import { GET_SYSTEM_USERS } from "@/core/services/store/systemUsers.module";

export default {
  data() {
    return {
      form: {
        label: "",
        userId: "",
        publickey: "",
        useVault: true,
        vaultPublickey: "",
      },
    };
  },
  computed: {
    ...mapGetters(["vaultsshkeys", "systemUsers"]),
  },
  mounted() {
    this.$store.dispatch(GET_SYSTEM_USERS, this.$parent.serverId);
    this.$store.dispatch(GET_VAULT_SSHKEY, this.$parent.serverId);
    const create_form = KTUtil.getById("kt_form_sshkey");
    this.fv = formValidation(create_form, {
      fields: {
        label: {
          validators: {
            notEmpty: {
              message: "Public Key is required",
            },
          },
        },
        userId: {
          validators: {
            notEmpty: {
              message: "User is required",
            },
          },
        },
        publickey: {
          validators: {
            notEmpty: {
              message: "Key label is required",
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
    this.fv.on("core.form.valid", this.addSSHKey);
    this.fv.on("core.form.invalid", () => {});
  },
  methods: {
    addSSHKey() {
      // set spinner to submit button
      const submitButton = this.$refs["kt_form_sshkey_submit"];
      submitButton.classList.add("spinner", "spinner-light", "spinner-right");
      const removeSpinner = () => {
        submitButton.classList.remove(
          "spinner",
          "spinner-light",
          "spinner-right"
        );
      };
      const payload = {
        label: this.form.label,
        userId: this.form.userId,
        publickey: this.form.useVault
          ? this.form.vaultPublickey
          : this.form.publickey,
        serverId: this.$parent.serverId,
      };
      this.$store
        .dispatch(CREATE_SSHKEY, payload)
        .then(() => {
          removeSpinner();
          this.onCreateSuccess(payload.label);
        })
        .catch(() => {
          removeSpinner();
        });
    },
    onCreateSuccess(name) {
      Swal.fire({
        title: "",
        text: "SSHKey " + name + " has been successfully created",
        icon: "success",
        confirmButtonClass: "btn btn-secondary",
        heightAuto: false,
      }).then(() => {
        console.log();
        this.$router.push({
          name: "server-sshkey",
        });
      });
    },
  },
};
</script>