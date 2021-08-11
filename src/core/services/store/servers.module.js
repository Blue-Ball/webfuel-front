import ApiService from "@/core/services/api.service";

export const SET_SERVERS = "setServers";
export const SET_CONFIGSCRIPT = "setConfigScript";
export const SET_ERROR = "setError";
export const SET_INSTALLPROCESS = "setInstallProcess";
export const SET_SERVER_SUMMERY = "setServerSummery";
export const SET_SERVER_PHPVERSION = "setServerPHPversion";
export const SET_PHPVERSION = "setPHPversion";

export const CREATE_SERVER = "createServer";
export const UPDATE_SERVER_PHPVERSION = "updateServerPHPversioin";
export const CONFIGURE_SERVER = "configureServer";
export const GET_SERVERS = "getServers";
export const GET_SERVER_SUMMERY = "getServerSummery";
export const GET_SERVER_PHPVERSION = "getServerPHPversion";
export const GET_SCRIPT = "getScript";
export const GET_INSTALLPROCESS = "getInstallProcess";

export const DELETE_SERVER = "deleteServer"
export const GET_SERVER = "getServer"
export const SET_CURRENT_SERVER = "setCurrentServer"

export const GET_SERVER_ACTIVITYLOGS = "getServerActivityLogs"
export const SET_SERVER_ACTIVITYLOGS = "setServerActivityLogs"


const state = {
  servers: {},
  summery: {},
  currentServer: {},
  configscript: {},
  installprocess: 0,
  serverPHPVersion: "",
  activityLogs : {},
  user : {}
};

const getters = {
  servers(state) {
    return state.servers;
  },
  summery(state) {
    return state.summery;
  },
  currentServer(state) {
    return state.currentServer;
  },
  configscript(state) {
    return state.configscript;
  },
  installprocess(state) {
    return state.installprocess;
  },
  ServerUser(state) {
    return state.user;
  },
  ServerActivityLogs(state) {
    var ret = [];
    for(var i=0; i<state.activityLogs.length; i++)
    {
      ret.push(state.activityLogs[i]);
    }
    return ret;
  },
  serverPHPVersion(state) {
    return state.serverPHPVersion;
  }
};

const actions = {
  [GET_SERVER_ACTIVITYLOGS](context, serverId) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post("servers/" + serverId + "/activitylogs")
        .then(({ data }) => {
          if (data.success) {
            context.commit(SET_SERVER_ACTIVITYLOGS, data.data);
          }
           resolve(data);
        })
        .catch(error => {
          console.log(error.response);
          context.commit(SET_ERROR, error.response.data.errors);
           reject(error);
        });
    });
  },
  [CREATE_SERVER](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post("servers/store", credentials)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(error => {
          console.log(error.response);
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [GET_SERVERS](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("servers")
        .then(({ data }) => {
          resolve(data);
          if (data.success) {
            context.commit(SET_SERVERS, data.data.servers);
          }
        })
        .catch(error => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [GET_SERVER](context, serverId) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("servers/" + serverId + "/settings")
        .then(({ data }) => {
          resolve(data);
          if (data.success) {
            //console.log(data.data);
            context.commit(SET_CURRENT_SERVER, data.data);
          }

        })
        .catch(error => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [GET_SCRIPT](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("servers/" + credentials + "/config/installscript")
        .then(({ data }) => {
          resolve(data);
          if (data.success) {
            context.commit(SET_CONFIGSCRIPT, data.data);
          }

        })
        .catch(error => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [GET_INSTALLPROCESS](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("servers/" + credentials + "/config/installstate/" + state.installprocess)
        .then(({ data }) => {
          resolve(data);
          if (data.success) {
            context.commit(SET_INSTALLPROCESS, data.data.state);
          }

        })
        .catch(error => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [DELETE_SERVER](context, serverId) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post("servers/" + serverId + "/delete")
        .then(({ data }) => {
          if (data) {
            if (data.success) {
              //context.commit(SET_INSTALLPROCESS, data.data.state);
            }
            resolve(data);
          }
          else
          {
            throw new Error({'error': 'failed'})
          }
        })
        .catch(error => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },

  [GET_SERVER_SUMMERY](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post("servers/" + credentials + "/summary")
        .then(({ data }) => {
          resolve(data);
          console.log(data);
          if (data.success) {
            context.commit(SET_SERVER_SUMMERY, data.data);
          }

        })
        .catch(error => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [GET_SERVER_PHPVERSION](context, serverId) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("servers/" + serverId + "/phpVersion")
        .then(({ data }) => {
          resolve(data);
          if (data.success) {
            context.commit(SET_PHPVERSION, data.data);
          }
        })
        .catch(error => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [UPDATE_SERVER_PHPVERSION](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post("servers/" + credentials.serverId + "/phpVersion", credentials)
        .then(({ data }) => {
          resolve(data);
          console.log(data);
          if (data.success) {
            context.commit(SET_PHPVERSION, data.data);
          }

        })
        .catch(error => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [SET_SERVER_PHPVERSION](context, value) {
    context.commit(SET_PHPVERSION, value);
  },
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_SERVERS](state, servers) {
    state.servers = servers;
    state.errors = {};
  },
  [SET_SERVER_SUMMERY](state, summery) {
    state.summery = summery;
    state.errors = {};
  },
  [SET_SERVER_ACTIVITYLOGS](state, activityLogs) {
    state.activityLogs = activityLogs;
    state.errors = {};
  },
  [SET_CURRENT_SERVER](state, curServer) {
    state.currentServer = curServer;
    state.errors = {};
  },
  [SET_CONFIGSCRIPT](state, configscript) {
    state.configscript = configscript;
    state.errors = {};
  },
  [SET_INSTALLPROCESS](state, installprocess) {
    state.installprocess = installprocess;
    state.errors = {};
  },
  [SET_PHPVERSION](state, serverPHPVersion) {
    state.serverPHPVersion = serverPHPVersion;
    state.errors = {};
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
