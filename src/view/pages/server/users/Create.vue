<template>
  <v-card class="card-body">
    <v-card-title>
      <h3 class="card-title align-items-start flex-column">
          {{title}}</h3>
        <span
          class="text-muted mt-3 font-weight-bold font-size-sm"
          data-nsfw-filter-status="swf"
          >This will create a new user for your server. This user will be able to add new Web Applications. Please make sure the choosen username is not used by any other service(nginx,apsche,mysql, etc). Choose a real username like john, bob or harley. Take note that <strong>we do not store or capture your password by any means.</strong></span
        >
      
    </v-card-title>
    <div class="pt-0 pb-10 mt-5">
      <v-form>
        <v-text-field
          outlined
          dense
          type="text"
          label="Username"
          placeholder="Only alphanumeric and/or _ are allowed"
          ref="userName"
          v-model="form.userName"
          v-if="isShowName"
          >
        </v-text-field>
        <v-text-field 
            outlined 
            dense 
            type="password"
            label="New Password" 
            ref="newPass" 
            v-model="form.newPass"
            >
            <template v-slot:append>
              <v-dialog v-model="dialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    style="margin-top: -6px; margin-right: -10px"
                    v-on="on"
                    v-bind="attrs"
                    @click="showModal"
                  >
                    Generate
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                  <span class="text-h5">Generate Password</span>
                  </v-card-title>
                  <v-card-text>
                  <v-content>
                      <h6 class="pl-0">Password Length ({{ passLen }})</h6>
                      <vue-slider
                      v-model="passLen"
                      :disabled="false"
                      @change="setChangePassLength"
                      ></vue-slider>
                      <b-card-group deck class="w-100 pr-10 pl-10 mt-5">
                      <b-row>
                          <b-col>
                          <b-form-checkbox
                              v-model="characters"
                              value="A-Z"
                              align="center"
                              button
                              button-variant="outline-secondary"
                              min-height="600px"
                              @change="generate"
                          >
                              <h3>A-Z</h3>
                              <b-card-text>Uppercase</b-card-text>
                          </b-form-checkbox>
                          </b-col>
                          <b-col>
                          <b-form-checkbox
                              v-model="characters"
                              value="a-z"
                              align="center"
                              button
                              button-variant="outline-secondary"
                              @change="generate"
                          >
                              <h3>a-z</h3>
                              <b-card-text>Lowercase</b-card-text>
                          </b-form-checkbox>
                          </b-col>
                          <b-col>
                          <b-form-checkbox
                              v-model="characters"
                              value="0-9"
                              align="center"
                              button
                              button-variant="outline-secondary"
                              @change="generate"
                          >
                              <h3>0-9</h3>
                              <b-card-text>Number</b-card-text>
                          </b-form-checkbox>
                          </b-col>
                          <b-col>
                          <b-form-checkbox
                              v-model="characters"
                              value="#"
                              align="center"
                              button
                              button-variant="outline-secondary"
                              @change="generate"
                          >
                              <h3>!%@#</h3>
                              <b-card-text>Symbol</b-card-text>
                          </b-form-checkbox>
                          </b-col>
                      </b-row>
                      </b-card-group>

                      <b-card-group class="mt-5">
                      <v-text-field
                          outlined
                          dense
                          type="text"
                          append-icon="mdi-refresh"
                          auto="true"
                          characters="characters"
                          :value="password"
                          @click:append="generate()"
                      ></v-text-field>
                      </b-card-group>
                  </v-content>
                  </v-card-text>
                  <v-card-actions>
                  <v-btn
                      block
                      large
                      color="primary"
                      type="button"
                      @click="createPass()"
                  >
                      Use This Password
                  </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
          </v-text-field>
          <v-text-field
            outlined
            dense
            label="Verify Password"
            v-model="form.verify_pass"
            type="password"
          >
          </v-text-field>
          <v-btn
            block
            large
            color="primary"
            type="button"
            @click="update()"
            ref="kt_pass_update"
          >
            Update My Password
          </v-btn>
      </v-form>
    </div>
  </v-card>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { GET_SYSTEM_USER, CREATE_SYSTEM_USERS, UPDATE_SYSTEM_USERS } from "@/core/services/store/systemUsers.module";
import Swal from "sweetalert2";
import { mapGetters } from "vuex";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

export default {
  name: "Create",
  components: {
    VueSlider,
  },
  data() {
    return {
      form:{
        userName:"",
        newPass: "",
        verify_pass: ""
      },
      title:"Create System User",
      isShowName:true,
      passLen: 12,
      size: {
        type: String,
        default: "12",
      },
      password: {
        type: String,
        default: "",
      },
      dialog: false,
      characters : ["a-z", "A-Z", "0-9", "#"],
    };
  },
  props: ["userId"],
    auto: [String, Boolean],
  computed: {
    ...mapGetters(["systemUsers"]),
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Users", route: "Users" },
      { title: "create" },
    ]);
    if(this.userId != 0){
      this.title = "Update password for System user";
      this.isShowName = false;
      this.$store.dispatch(GET_SYSTEM_USER, {
                                                _id:this.userId,
                                                name: this.form.userName,
                                                serverId: this.$parent.serverId
                                              });
      setTimeout(() => {
          this.form.newPass = this.systemUsers.password;
          this.form.verify_pass = this.systemUsers.password;
        }, 1000);
    }
      
  },
  methods: {
    generate() {
      this.size = this.passLen;
      let charactersArray = this.characters;
      let CharacterSet = "";
      let password = "";
      if (charactersArray.indexOf("a-z") >= 0) {
        CharacterSet += "abcdefghijklmnopqrstuvwxyz";
      }
      if (charactersArray.indexOf("A-Z") >= 0) {
        CharacterSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      }
      if (charactersArray.indexOf("0-9") >= 0) {
        CharacterSet += "0123456789";
      }
      if (charactersArray.indexOf("#") >= 0) {
        CharacterSet += "![]{}()%&*$#^<>~@|";
      }

      for (let i = 0; i < this.size; i++) {
        password += CharacterSet.charAt(
          Math.floor(Math.random() * CharacterSet.length)
        );
      }
      this.password = password;
    },
    showModal() {
      this.generate();
    },

    createPass() {
      this.dialog = false;
      this.form.newPass = this.password;
      this.form.verify_pass = this.password;
    },
    setChangePassLength() {
      this.generate();
    },
    makeToast(contents, variant = null) {
      this.$bvToast.toast(contents, {
        title: `Litegix`,
        toaster: "b-toaster-bottom-right",
        variant: variant,
        solid: true,
      });
    },
    update() {
      if(this.userId != 0){
        const payload = {
          id:this.userId,
          serverId: this.$parent.serverId,
          password: this.form.newPass
        };
        this.dataUpdate(payload);
      }
      else{
        const payload = {
          name: this.form.userName,
          serverId: this.$parent.serverId,
          password: this.form.newPass
        };
        this.createUser(payload);
      }
    },
    createUser(payload){
      // set spinner to submit button
      const submitButton = this.$refs["kt_pass_update"];
      submitButton.$el.classList.add("spinner", "spinner-light", "spinner-right");
      
      const removeSpinner = () => {
        submitButton.$el.classList.remove(
          "spinner",
          "spinner-light",
          "spinner-right"
        );
      };
      this.$store
        .dispatch(CREATE_SYSTEM_USERS, payload)
        .then((data) => {
          removeSpinner();
          this.onCreateSuccess(data.serverId);
        })
        .catch(() => {
          removeSpinner();
        }); 
    },
    dataUpdate(payload){
      // set spinner to submit button
      const submitButton = this.$refs["kt_pass_update"];
      submitButton.$el.classList.add("spinner", "spinner-light", "spinner-right");
      
      const removeSpinner = () => {
        submitButton.$el.classList.remove(
          "spinner",
          "spinner-light",
          "spinner-right"
        );
      };
      this.$store
        .dispatch(UPDATE_SYSTEM_USERS, payload)
        .then((data) => {
          removeSpinner();
          this.onCreateSuccess(data.serverId);
        })
        .catch(() => {
          removeSpinner();
        });
    },
    onCreateSuccess(serverId) {
      Swal.fire({
        title: "",
        text: 'Your Server has been successfully created',
        icon: "success",
        confirmButtonClass: "btn btn-secondary",
        heightAuto: false,
      }).then(() => {
        console.log(serverId);
        this.$router.push({ name: "server-user"});
      });
    }
  }
};
</script>