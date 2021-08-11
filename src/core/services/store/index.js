import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth.module";
import htmlClass from "./htmlclass.module";
import config from "./config.module";
import breadcrumbs from "./breadcrumbs.module";
import profile from "./profile.module";
import servers from "./servers.module";
import serverDB from "./serverDB.module";
import systemusers from "./systemUsers.module";
import sshkey from "./sshkey.module";
import cronjob from "./cronjob.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    htmlClass,
    config,
    breadcrumbs,
    profile,
    servers,
    serverDB,
    systemusers,
    sshkey,
    cronjob,
  }
});
