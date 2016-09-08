# redux-actions-hub
[![Build Status](https://travis-ci.org/apentle/redux-actions-hub.svg?branch=master)](https://travis-ci.org/apentle/redux-actions-hub) [![Coverage Status](https://coveralls.io/repos/github/apentle/redux-actions-hub/badge.svg?branch=master)](https://coveralls.io/github/apentle/redux-actions-hub?branch=master) [![npm version](https://badge.fury.io/js/redux-actions-hub.svg)](https://badge.fury.io/js/redux-actions-hub)

Share Redux Actions between modules

## Installation
```bash
npm i --save redux-actions-hub
```

## Usage
**Actions**
```javascript
import Actions from 'redux-actions-hub';

// Auto generate action creator
Actions.add('ADD_TODO');

// Action creator
Actions.add('removeTodo', function(id) {
  return {
    type: 'REMOVE_TODO',
    id
  };
});

// With middleware
Actions.add('DELETED_TODO');
Actions.add('REMOTE_FAIL');
Actions.add('remoteDelete', function(id) {
  return dispatch => {
    fetch('https://localhost/todos/delete/' + id)
      .then(response => dispatch(Actions.DELETED_TODO(id)))
      .catch(err => dispatch(Actions.REMOTE_FAIL(err)));
  }
});

```
**dispatch**
```javascript
import {removeTodo, remoteDelete} from 'redux-actions-hub';

// Dispatch
dispatch(removeTodo(1));
dispatch(remoteDelete(1));

```

## API
1. **add(type, actionCreator)** Add new action creator to hub
2. **remove(type)** Remove action creator from hub
3. **replace(type, actionCreator)** Replace action creator from hub with new action creator
4. **reset()** Reset actions data
