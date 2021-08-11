import ApiService from "@/core/services/api.service";

export const SET_CRONJOBS = "setCronjobs";
export const SET_CRONJOB = "setCronjob";
export const SET_ERROR = "setError";

export const CREATE_CRONJOB = "createCronjob";
export const UPDATE_CRONJOB = "updateCronjob";

export const GET_CRONJOBS = "getCronjobs";
export const GET_CRONJOB = "getCronjob";

export const DELETE_CRONJOB = "deleteCronjob";

const state = {
  cronjobs: {},
  cronjob: {},
  error: {},
};

const getters = {
  cronjobs(state) {
    return state.cronjobs;
  },
  cronjob(state) {
    return state.cronjob;
  },
};

const actions = {
  [CREATE_CRONJOB](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post(
        "servers/" + credentials.serverId + "/cronjobs",
        credentials
      )
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [GET_CRONJOB](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get(
        "servers/" + credentials.serverId + "/cronjobs/" + credentials.keyId
      )
        .then(({ data }) => {
          resolve(data);
          if (data.success) {
            context.commit(SET_CRONJOB, data.data.sshkey);
          }
        })
        .catch((error) => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [GET_CRONJOBS](context, serverId) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("servers/" + serverId + "/cronjobs")
        .then(({ data }) => {
          resolve(data);
          if (data.success) {
            context.commit(SET_CRONJOBS, data.data.cronjobs);
          }
        })
        .catch((error) => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [UPDATE_CRONJOB](context, serverId) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("servers/" + serverId + "/cronjobs/vault")
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [DELETE_CRONJOB](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete(
        "servers/" + credentials.serverId + "/cronjobs/" + credentials.keyId
      )
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_CRONJOB](state, cronjob) {
    state.cronjob = cronjob;
    state.errors = {};
  },
  [SET_CRONJOBS](state, cronjobs) {
    state.cronjobs = cronjobs;
    state.errors = {};
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
