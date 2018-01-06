'use strict';

export default {
  name(state) {
    return state.user && state.user.id && `${state.user.firstName} ${state.user.lastName}`;
  }
};
