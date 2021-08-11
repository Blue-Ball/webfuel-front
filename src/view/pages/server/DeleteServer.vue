<template>
  <div class="card card-custom gutter-b">
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark"
          >Delete Your Server</span
        ><span class="text-muted mt-3 font-size-sm">
          <p>
            Please think carefully before deleting your server. All data will be
            deleted and you will not be able to add your server back without a
            full reformat. This action cannot be undone.
          </p>
          <p>Complete all field below to delete your server.</p>
        </span>
      </h3>
    </div>
    <div class="card-body pb-10 pt-0">
      <b-form method="POST" role="form" @submit="onSubmit" class="bootstrap-form"> <!-- v-if="show"  -->
        <b-form-group label="Type YES"
          ><b-form-input
            name="typeyes"
            ref="typing"
            v-model="typed_text"
            @input="onTyping($event)"
            placeholder="Type Yes here to delete this server form RunCloud"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Certify To Delete Server">
          <b-form-checkbox size="lg" name="certify" ref="confirm_1"
            v-model="confirmed_1"
            @change="check($event)"
            >I certify that I want to delete my server from RunCloud and data
            will not be returnable again.</b-form-checkbox
          >
        </b-form-group>
        <b-form-group label="Proceed to Deletion">
          <b-form-checkbox size="lg" name="certify" ref="confirm_2"
            v-model="confirmed_2"
            @change="check($event)"
            >Proceed to deletion</b-form-checkbox
          >
        </b-form-group>
        <b-form-group label="Last Warning">
          <b-form-checkbox size="lg" name="certify" ref="confirm_3"
            v-model="confirmed_3"            
           @change="check($event)"
            >I understand that what I want.</b-form-checkbox
          >
        </b-form-group>
        <input
                      type="hidden"
                      id="server_Id"
                      :value="this.serverId"
                    />
        <button type="submit" class="btn btn-danger btn-block disabled" disabled ref="btnServerDelete">
          Delete Server
        </button>
      </b-form>
      <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
      <!-- <v-card-title>
          Confirm
          <v-spacer></v-spacer>
          <p class="btn" style="color: red" @click="showModal">
            this server delete
          </p>
          
        </v-card-title>  -->

    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ConfirmDialogue from "@/view/content/widgets/dialogue/ConfirmDialogue.vue";
import Swal from "sweetalert2";
import { GET_SERVER, DELETE_SERVER } from "@/core/services/store/servers.module";  //
import router from "../../../router";

export default {
  name: "ServerDelete",
  props: ["serverId"],
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      confirmed_1 : false,
      confirmed_2 : false,
      confirmed_3 : false,
      typed_text : ''
      };
    },
  created() {
    //this.$store.dispatch(LOAD_PROFILE_INFO, "page-loading");
    //console.log(this.serverId);
  },
  beforeMount() {},
  mounted() {
    this.$store.dispatch(GET_SERVER, this.serverId);
  },
  methods: {
    onTyping: function(typinged_text){
      if(this.$refs["confirm_3"].checked && 
         this.$refs["confirm_2"].checked && 
         this.$refs["confirm_1"].checked && 
         typinged_text=='YES')
      {
        this.typed_text = typinged_text;
        //console.log(this.$refs["btnServerDelete"]);
        this.$refs["btnServerDelete"].classList.remove("disabled");
        this.$refs["btnServerDelete"].removeAttribute('disabled');
      }
      else
      {
        //console.log(this.$refs["btnServerDelete"]);
        this.$refs["btnServerDelete"].classList.add("disabled");
        this.$refs["btnServerDelete"].setAttribute('disabled', 'disabled');
      }
    },
    check: function(){
        //  console.log(this.$refs["confirm_1"].checked);
        //  console.log(this.$refs["confirm_2"].checked);
        //  console.log(this.$refs["confirm_3"].checked);
        //  console.log(this.typed_text);
      if(this.$refs["confirm_3"].checked && 
         this.$refs["confirm_2"].checked && 
         this.$refs["confirm_1"].checked &&
         this.typed_text == 'YES'
         )
      {
         this.$refs["btnServerDelete"].classList.remove("disabled");
         this.$refs["btnServerDelete"].removeAttribute('disabled');
      }
       else
      {
        //console.log(this.$refs["btnServerDelete"]);
        this.$refs["btnServerDelete"].classList.add("disabled");
        this.$refs["btnServerDelete"].setAttribute('disabled', 'disabled');
      }
      // console.log(e);
    },
    async onSubmit( e ){
      e.preventDefault();
      //console.log(this.currentServer);
      const ok = await this.$refs.confirmDialogue.show({
        title: "Delete Server " + this.currentServer.name,//this.currentServer.name,
        message:
          "Do not forget to delete this server from your cloud provider. Delete this server?",
        okButton: "Delete",
      });

      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
          
          this.$store.dispatch(DELETE_SERVER, this.serverId).then(
            (response)=>{
                console.log(response);
                Swal.fire({
                  title: "",
                  text: "The Selected Server Informations has been deleted successfully ",
                  icon: "success",
                  confirmButtonClass: "btn btn-secondary",
                }).then( () =>{
                  console.log("Clicked OK");
                  router.push("/servers")
                });
            },
            (error)=>{
              console.log(error);
            }
         );
      } else {
        // alert('You chose not to delete this page. Doing nothing now.')
      }
    }
  },
  computed: {
    ...mapGetters(["currentServer", "summery"]),
  }
};
</script>


