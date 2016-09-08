'use strict';

var _actions = {};

/**
 * defineActionProp - define action property
 *
 * @param  {string} type action's type
 * @returns {undefined}
 */
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
  /**
   * add - add an action
   *
   * @param  {string} type          action's type
   * @param  {mixed} actionCreator  action creator function
   * @returns {function}            registered action creator function
   */
  add(type, actionCreator) {
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

  /**
   * remove - remove action type
   *
   * @param  {string} type action's type
   * @returns {undefined}
   */
  remove(type) {
    _actions[type] = [];
  },

  /**
   * replace - replace old action creator with new one
   *
   * @param  {string} type          action's type
   * @param  {mixed} actionCreator  action creator function
   * @returns {function}            registered action creator function
   */
  replace(type, actionCreator) {
    ActionsHub.remove(type);
    return ActionsHub.add(type, actionCreator);
  },

  /**
   * reset - reset actions data
   */
  reset() {
    _actions = {};
  },
};

module.exports = ActionsHub;
