<template>
  <v-card class="card-body">
    <v-card-title>
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder"
          >Deployment Key</span
        >
      </h3>
      <v-spacer></v-spacer>
      <v-text-field
        dense
        outlined
        label="Search"
        type="text"
        v-model="search"
      />
      <span
        class="text-muted mt-3 font-size-sm"
        data-nsfw-filter-status="swf"
        >To use Git Deployment inside a Web Application, you must use and
        generate a Git Deployment Key. Each user can only have one deployment
        key, and it can be used for multiple Web Applications (except you are
        using GitHub).</span
      >
    </v-card-title>
    <div>
      <v-data-table :items="items" :headers="headers" :search="search">
        <template v-slot:item.view="{ item }">
          <span class="btn svg-icon svg-icon-primary">
            <inline-svg src="media/svg/icons/Design/Edit.svg"
              @click="showModal(item.deploymentKey)"
            />
          </span>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog" persistent max-width="800px">
              <template v-slot:default="dialog">
                <v-card>
                  <v-toolbar
                    color="primary"
                    dark
                  >{{title}}</v-toolbar>
                  <v-card-text>
                  <v-card-title>
                    {{subtitle}}
                  </v-card-title>
                  <v-hover v-slot="{ hover }">
                    <v-sheet 
                      elevation="6"
                      v-if="isShow">
                      <v-card-subtitle
                        >{{ command_url }}
                        <v-expand-transition>
                          <v-btn
                            v-if="hover"
                            absolute
                            color="orange"
                            class="white--text copy"
                            fab
                            x-small
                            right
                            @click.stop.prevent="commandCopy()"
                          >
                            <v-icon>mdi-checkbox-multiple-blank-outline</v-icon>
                          </v-btn>
                        </v-expand-transition>
                        <input
                          type="hidden"
                          id="com-deploymentKey"
                          :value="command_url"
                        />
                      </v-card-subtitle>
                    </v-sheet>
                  </v-hover>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn
                      text
                      @click="dialog.value = false"
                    >Close</v-btn>
                    <v-btn
                      color="primary"
                      @click="dialog.value = false"
                    >{{actionBtn}}</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { GET_SYSTEM_USERS} from "@/core/services/store/systemUsers.module";
export default {
  name: "DeploymentKey",
  data() {
    return {
      title:"Deployment Key for user",
      subtitle:"Insert this key inside GitHub, GitLab, Bitbucket or custom Git Server repository to enable Git deployment for your web application.",
      actionBtn: "Generate new deployment Key",
      isShow: true,
      clipboard: null,
      command_url: " ssh root@192.168.1.1",
      dialog: false,
      search: '',
      headers: [
          {
            text: 'User',
            value: 'name',
          },
          { text: 'View/Generate', value: 'view' },
          
        ],
      items: [{ name: "litegix", view: "" }],
    };
  },
  computed: {
    ...mapGetters(["systemUsers"]),
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "DeploymentKey" }]);
    this.$store.dispatch(GET_SYSTEM_USERS, this.$parent.serverId);
    setTimeout(() => {
      this.items = this.systemUsers;
    }, 500);
   
    // this.$refs.username.value = systemUser.name;
    // this.$refs.newPass.value = systemUser.password;
  },
  methods:{
    showModal(key){
      console.log(key,"eeeeeeeeee");
      this.dialog = true;
      if(typeof(key) === 'undefined' || key === null){
        this.title = "Oops!";
        this.subtitle = "You have no deployment key for erinmong . Generate one now?";
        this.actionBtn = "OK";
        this.isShow = false;
      }
      else{
        this.title = "Deployment Key for user";
        this.subtitle = "Insert this key inside GitHub, GitLab, Bitbucket or custom Git Server repository to enable Git deployment for your web application.";
        this.actionBtn = "Generate new deployment Key";
        this.isShow = true;
      }
    },
    makeToast(contents, variant = null) {
      this.$bvToast.toast(contents, {
        title: `litegix`,
        variant: variant,
        solid: true,
      });
    },
    commandCopy() {
      let testingCodeToCopy = "";
      testingCodeToCopy = document.querySelector("#com-deploymentKey");
      testingCodeToCopy.setAttribute("type", "text"); // 不是 hidden 才能複製
      testingCodeToCopy.select();

      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        // alert('Testing code was copied ' + msg);
        this.makeToast(msg + "copy", "successful");
      } catch (err) {
        alert("Oops, unable to copy");
      }

      /* unselect the range */
      testingCodeToCopy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
  }
};
</script>