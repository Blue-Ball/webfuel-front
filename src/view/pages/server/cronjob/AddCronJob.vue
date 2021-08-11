<template>
  <v-card class="card-body">
    <v-card-title>
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder"
          >Add New Cron Job</span
        >
      </h3>
    </v-card-title>
    <div class="">
      <b-form id="kt_form_cronjob">
        <b-form-group label="Job Label">
          <b-form-input
            name="label"
            size="lg"
            v-model="form.label"
            placeholder="Label for this cron job"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="User (The user to run this job)">
          <b-form-input
            v-model="form.username"
            name="username"
            size="lg"
            placeholder="User to run the cron job"
          ></b-form-input>
        </b-form-group>

        <div class="form-group">
          <label class="control-label">Vendor Binary</label>
          <b-form-select
            size="lg"
            v-model="form.vendor"
            :options="vendorlist"
          ></b-form-select>
        </div>
        <div class="form-group">
          <label for="command" class="control-label">Command</label>
          <textarea
            name="command"
            size="lg"
            rows="3"
            v-model="form.command"
            placeholder="/path/to/script.(sh | php | js) OR if the vendor binary is empty you can rm -rf /tmp/*"
            class="form-control"
          ></textarea>
        </div>
        <h4>Pre-defined Settings</h4>
        <div class="form-group">
          <label class="control-label">Predefined Settings</label>
          <b-form-select
            size="lg"
            v-model="predefine"
            :options="predefinelist"
          ></b-form-select>
        </div>
        <h4>Custom Settings</h4>
        <b-form-group label="Minute"
          ><b-form-input
            name="minute"
            size="lg"
            placeholder=""
            v-model="form.minute"
          ></b-form-input
        ></b-form-group>
        <b-form-group label="Hour"
          ><b-form-input
            name="hour"
            size="lg"
            placeholder=""
            v-model="form.hour"
          ></b-form-input
        ></b-form-group>
        <b-form-group label="Day of Month"
          ><b-form-input
            name="dayofmonth"
            placeholder=""
            size="lg"
            v-model="form.dayofmonth"
          ></b-form-input
        ></b-form-group>
        <b-form-group label="Month"
          ><b-form-input
            name="month"
            placeholder=""
            size="lg"
            v-model="form.month"
          ></b-form-input
        ></b-form-group>
        <b-form-group label="Day of Week"
          ><b-form-input
            name="dayofweek"
            placeholder=""
            size="lg"
            v-model="form.dayofweek"
          ></b-form-input
        ></b-form-group>
        <button
          type="submit"
          class="btn btn-primary btn-block"
          ref="kt_form_cronjob_submit"
        >
          Create cron job
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

import Swal from "sweetalert2";
import { CREATE_CRONJOB } from "@/core/services/store/cronjob.module";
import { Constants } from "@/core/services/constants.module";

export default {
  data() {
    return {
      predefine: "",
      predefinelist: Constants.predefinelist,
      vendorlist: Constants.vendorlist,
      form: {
        label: "",
        username: "litegix",
        vendor: "",
        command: "",
        minute: "*",
        hour: "*",
        dayofmonth: "*",
        month: "*",
        dayofweek: "*",
      },
    };
  },
  mounted() {
    const create_form = KTUtil.getById("kt_form_cronjob");
    this.fv = formValidation(create_form, {
      fields: {
        label: {
          validators: {
            notEmpty: {
              message: "The label field is required",
            },
          },
        },
        username: {
          validators: {
            notEmpty: {
              message: "The user name field is required",
            },
          },
        },
        command: {
          validators: {
            notEmpty: {
              message: "The command field is required",
            },
          },
        },
        minute: {
          validators: {
            notEmpty: {
              message:
                "The minute field is required unless predefined cron is in @reboot.",
            },
          },
        },
        hour: {
          validators: {
            notEmpty: {
              message:
                "The hour field is required unless predefined cron is in @reboot.",
            },
          },
        },
        dayofmonth: {
          validators: {
            notEmpty: {
              message:
                "The day of month field is required unless predefined cron is in @reboot.",
            },
          },
        },
        month: {
          validators: {
            notEmpty: {
              message:
                "The month field is required unless predefined cron is in @reboot.",
            },
          },
        },
        dayofweek: {
          validators: {
            notEmpty: {
              message:
                "The day of week field is required unless predefined cron is in @reboot.",
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
    this.fv.on("core.form.valid", this.addcronjob);
    this.fv.on("core.form.invalid", () => {});
  },
  methods: {
    addcronjob() {
      const submitButton = this.$refs["kt_form_cronjob_submit"];
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
        username: this.form.username,
        command: this.form.vendor.trim() + " " + this.form.command,
        minute: this.form.minute,
        hour: this.form.hour,
        dayOfMonth: this.form.dayofmonth,
        month: this.form.month,
        dayOfWeek: this.form.dayofweek,
        serverId: this.$parent.serverId,
      };
      this.$store
        .dispatch(CREATE_CRONJOB, payload)
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
        text: "CronJob " + name + " has been successfully created",
        icon: "success",
        confirmButtonClass: "btn btn-secondary",
        heightAuto: false,
      }).then(() => {
        console.log();
        this.$router.push({
          name: "server-cronjob",
        });
      });
    },
  },
};
</script>