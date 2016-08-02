'use strict';

jest.unmock('../index');
const Actions = require('../index');

function newDispatch() {
  var dispatch = jest.fn(action => typeof action === 'function' ? action(dispatch) : action);
  return dispatch;
}

describe('ActionsHub', () => {
  it('addAction(type, actionCreator): add new action', () => {
    // Simple action
    Actions.addAction('ADD');
    expect(Actions.ADD('new')).toEqual({type: 'ADD', payload: 'new'});
    Actions.addAction('REMOVE', {meta: 'soft'});
    expect(Actions.REMOVE(1)).toEqual({type: 'REMOVE', payload: 1, meta: 'soft'});
    var update = jest.fn();
    Actions.addAction('UPDATE', update);
    Actions.UPDATE('old');
    expect(update.mock.calls).toEqual([['old']]);
    // ThunkAction
    var dispatch = newDispatch();
    Actions.addAction('ADD', {meta: 'plugin'});
    dispatch(Actions.ADD('new'));
    expect(dispatch.mock.calls[1][0]).toEqual({type: 'ADD', payload: 'new'});
    expect(dispatch.mock.calls[2][0]).toEqual({type: 'ADD', payload: 'new', meta: 'plugin'});
  });

  it('removeAction(type): remove old action', () => {
    var dispatch = newDispatch();
    Actions.removeAction('REMOVE');
    expect(dispatch(Actions.REMOVE(1))).toBeUndefined();
    expect(dispatch.mock.calls.length).toBe(1);
  });

  it('replaceAction(type, actionCreator): replace old action with a new action', () => {
    var add = jest.fn(action => action);
    Actions.replaceAction('ADD', add);
    expect(Actions.ADD('new')).toBe('new');
    expect(Actions.ADD({id: 1})).toEqual({id: 1});
  });
});
