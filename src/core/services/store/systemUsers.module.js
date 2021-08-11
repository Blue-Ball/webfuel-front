import ApiService from "@/core/services/api.service";
export const SET_SYSTEM_USERS = "setSystemUsers";
export const SET_ERROR = "setError";

export const CREATE_SYSTEM_USERS = "createSystemUsers";
export const GET_SYSTEM_USERS = "getSystemUsers";
export const GET_SYSTEM_USER = "getSystemUser";
export const DELETE_SYSTEM_USER = "deleteSystemUser"
export const UPDATE_SYSTEM_USERS = "updateSystemUser"

const state = {
  systemUsers: {}
};

const getters = {
    systemUsers(state) {
        return state.systemUsers;
    }
};

const actions = {
  [CREATE_SYSTEM_USERS](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post("servers/" + credentials.serverId + "/systemusers/store", credentials)
        .then(({ data }) => {
           resolve(data);
           if (data.success) {
            context.commit(SET_SYSTEM_USERS, data.data);
          }
        })
        .catch(error => {
          console.log(error.response);
          context.commit(SET_ERROR, error.response.data.errors);
           reject(error);
        });
    });
  },
  [UPDATE_SYSTEM_USERS](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post("servers/" + credentials.serverId + "/systemusers/changepassword/", credentials)
        .then(({ data }) => {
           resolve(data);
          console.log(data.data.users);
           if (data.success) {
            context.commit(SET_SYSTEM_USERS, data.data);
          }
        })
        .catch(error => {
          console.log(error.response);
          context.commit(SET_ERROR, error.response.data.errors);
           reject(error);
        });
    });
  },
  [GET_SYSTEM_USERS](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("servers/" + credentials + "/systemusers")
        .then(({ data }) => {
          resolve(data);
          if (data.success) {
            context.commit(SET_SYSTEM_USERS, data.data.users);
          }
        })
        .catch(error => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [GET_SYSTEM_USER](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("servers/" + credentials.serverId + "/systemusers/" + credentials._id)
        .then(({ data }) => {
          resolve(data);
          if (data.success) {
            context.commit(SET_SYSTEM_USERS, data.data.users[0]);
          }
        })
        .catch(error => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },

  [DELETE_SYSTEM_USER](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete("servers/" + credentials.serverId + "/systemusers/" + credentials.id)
        .then(({ data }) => {
          resolve(data);
          // if (data.success) {
          //   context.commit(SET_SYSTEM_USERS, data.data.users);
          // }
        })
        .catch(error => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  }
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_SYSTEM_USERS](state, systemUser) {
    state.systemUsers = systemUser;
    state.errors = {};
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
