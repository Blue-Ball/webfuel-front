<template>
  <!--begin::Advance Table Widget 10-->
  <v-card class="card-body">
    <!--begin::Header-->
    <v-card-title>
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder">System User</span>
      </h3>
      <v-spacer></v-spacer>
      <div class="card-toolbar">
        <b-link to="user/create/0">
          <a class="btn btn-success font-weight-bolder font-size-sm">Create User</a>
        </b-link>
      </div>
    </v-card-title>
      <v-text-field 
        outlined 
        dense 
        label="Search" 
        hide-details=""
        class="searchSSHKey"
        v-model="search"
      ></v-text-field>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="py-0">
      <!--begin::Table-->
      <div class="table-responsive">
        <table
          class="table table-head-custom table-vertical-center"
          id="kt_advance_table_widget_4"
          :search="search"
        >
          <thead>
            <tr class="text-center">
              <th class="pl-0" style="min-width: 180px">Username</th>
              <th style="min-width: 180px" >Change Password</th>
              <th class="pr-0" style="min-width: 160px">Action</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td class="pl-0 text-center">
                  <span class="
                      font-weight-bolder
                      text-hover-primary
                      font-size-lg
                    "
                    >litegix</span
                  >
                </td>
                <td class="pl-0 text-center">
                  <i class="btn btn-icon btn-center btn-hover-primary btn-sm"
                  >
                    <span class="svg-icon svg-icon-md svg-icon-primary">
                      <inline-svg
                        src="media/svg/icons/General/Lock.svg"
                      ></inline-svg>
                    </span>
                  </i>
                </td>
                <td class="pr-0 text-center">
                  <i class="btn btn-icon btn-center btn-hover-primary btn-sm"
                  >
                    <span class="svg-icon svg-icon-md svg-icon-primary">
                      -
                    </span>
                  </i>
                </td>
              </tr>
              <tr>
                <td class="pl-0 text-center">
                  <span class="
                      font-weight-bolder
                      text-hover-primary
                      font-size-lg
                    "
                    >root</span
                  >
                </td>
                <td class="pl-0 text-center">
                  <i class="btn btn-icon btn-center btn-hover-primary btn-sm"
                  >
                    <span class="svg-icon svg-icon-md svg-icon-primary">
                      -
                    </span>
                  </i>
                </td>
                <td class="pr-0 text-center">
                  <i class="btn btn-icon btn-center btn-hover-primary btn-sm"
                  >
                    <span class="svg-icon svg-icon-md svg-icon-primary">
                      -
                    </span>
                  </i>
                </td>
              </tr>
              <!-- display system users -->
              <template v-for="(item, i) in getlist">
                <tr v-bind:key="i">
                  <td class="pl-0 text-center">
                    <span class="
                        font-weight-bolder
                        text-hover-primary
                        font-size-lg
                      "
                      >{{ item.name }}</span
                    >
                  </td>
                  <td class="pl-0 text-center">
                    <b-link :to="'user/create/'+ item._id">
                      <i class="btn btn-icon btn-center btn-hover-primary btn-sm"
                        >
                        <span class="svg-icon svg-icon-md svg-icon-primary">
                          <inline-svg
                            src="media/svg/icons/General/Lock.svg"
                          ></inline-svg>
                        </span>
                      </i>
                    </b-link>
                  </td>
                  <td class="pr-0 text-center">
                    <i class="btn btn-icon btn-center btn-hover-primary btn-sm"
                      @click="deleteUser(item._id)"
                    >
                      <span class="svg-icon svg-icon-md svg-icon-primary">
                        <inline-svg
                          src="media/svg/icons/General/Trash.svg"
                        ></inline-svg>
                      </span>
                    </i>
                  </td>
                </tr>
              </template>
          </tbody>
        </table>
      </div>
      <!--end::Table-->
    </div>
    <!--end::Body-->
  </v-card>
  <!--end::Advance Table Widget 10-->
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { GET_SYSTEM_USERS, DELETE_SYSTEM_USER } from "@/core/services/store/systemUsers.module";
import { mapGetters } from "vuex";
export default {
  name: "Users",
  data() {
    return {
      search:'',
      checked: false,
      list: [
        {
          name: "litegix",
        },
        {
          name: "root",
        },
      ],
      getlist: [
        {
          name: "",
          id: ""
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["systemUsers"]),
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Users", route: "Users" },
      { title: "create" },
    ]);
    this.$store.dispatch(GET_SYSTEM_USERS, this.$parent.serverId);
    setTimeout(() => {
        this.getlist = this.systemUsers;
      }, 500);
   
    // this.$refs.username.value = systemUser.name;
    // this.$refs.newPass.value = systemUser.password;
  },
  methods: {
    deleteUser(id){
      this.$store.dispatch(DELETE_SYSTEM_USER, {
        serverId: this.$parent.serverId,
        id: id
      });
      this.$store.dispatch(GET_SYSTEM_USERS, this.$parent.serverId);
      setTimeout(() => {
        this.getlist = this.systemUsers;
      }, 500);
    }
  }
};
</script>
