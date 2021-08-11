import ApiService from "@/core/services/api.service";

export const SET_SSHKEYS = "setSSHKeys";
export const SET_SSHKEY = "setSSHKey";
export const SET_VAULTSSHKEY = "setVaultSSHKey";
export const SET_ERROR = "setError";

export const CREATE_SSHKEY = "createSSHKey";

export const GET_SSHKEYS = "getSSHKeys";
export const GET_SSHKEY = "getSSHKey";
export const GET_VAULT_SSHKEY = "getVaultSSHKey";

export const REVOKE_SSHKEY = "revokeSSHKey";

const state = {
  sshkeys: {},
  sshkey: {},
  vaultsshkeys: {},
  error: {},
};

const getters = {
  sshkeys(state) {
    return state.sshkeys;
  },
  sshkey(state) {
    return state.sshkey;
  },
  vaultsshkeys(state) {
    return state.vaultsshkeys;
  },
};

const actions = {
  [CREATE_SSHKEY](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post(
        "servers/" + credentials.serverId + "/sshcredentials",
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
  [GET_SSHKEY](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get(
        "servers/" +
          credentials.serverId +
          "/sshcredentials/" +
          credentials.keyId
      )
        .then(({ data }) => {
          resolve(data);
          if (data.success) {
            context.commit(SET_SSHKEY, data.data.sshkey);
          }
        })
        .catch((error) => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [GET_SSHKEYS](context, serverId) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("servers/" + serverId + "/sshcredentials")
        .then(({ data }) => {
          resolve(data);
          if (data.success) {
            context.commit(SET_SSHKEYS, data.data.sshKeys);
          }
        })
        .catch((error) => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [GET_VAULT_SSHKEY](context, serverId) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("servers/" + serverId + "/sshcredentials/vault")
        .then(({ data }) => {
          resolve(data);
          if (data.success) {
            context.commit(SET_VAULTSSHKEY, data.data.sshKeys);
          }
        })
        .catch((error) => {
          context.commit(SET_ERROR, error.response.data.errors);
          reject(error);
        });
    });
  },
  [REVOKE_SSHKEY](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete(
        "servers/" +
          credentials.serverId +
          "/sshcredentials/" +
          credentials.keyId
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
  [SET_SSHKEY](state, sshkey) {
    state.sshkey = sshkey;
    state.errors = {};
  },
  [SET_SSHKEYS](state, sshkeys) {
    state.sshkeys = sshkeys;
    state.errors = {};
  },
  [SET_VAULTSSHKEY](state, vaultsshkeys) {
    state.vaultsshkeys = vaultsshkeys;
    state.errors = {};
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
