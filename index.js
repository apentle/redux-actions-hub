'use strict';

var _actions = {};

// Private method : define action property
function defineActionProp(type) {
  ActionsHub[type] = function() {
    var creators = _actions[type];
    if (creators.length === 1) {
      // Simply forward to original action creator
      return creators[0].apply(null, arguments);
    } else if (creators.length > 1) {
      // ThunkAction
      var args = arguments;
      return function(dispatch) {
        // dispatch all action creator
        for (var i = 0, cLength = creators.length; i < cLength; i++) {
          dispatch(creators[i].apply(null, args));
        }
      };
    }
  }
}

// Actions Hub
const ActionsHub = {
  addAction(type, actionCreator) {
    if (typeof actionCreator !== 'function') {
      // Make a new actionCreator
      var action = actionCreator;
      if (typeof action !== 'object') {
        action = {};
      }
      action.type = type;
      // action {type: string, payload: any}
      actionCreator = function(payload) {
        action.payload = payload;
        return action;
      };
    }

    // Add actionCreator to Hub
    _actions[type] = _actions[type] === undefined ? [] : _actions[type];
    _actions[type].push(actionCreator);

    // Return a related action creator
    ActionsHub[type] !== undefined || defineActionProp(type);
    return ActionsHub[type];
  },

  removeAction(type) {
    _actions[type] = [];
  },

  replaceAction(type, actionCreator) {
    ActionsHub.removeAction(type);
    return ActionsHub.addAction(type, actionCreator);
  },
};

module.exports = ActionsHub;
