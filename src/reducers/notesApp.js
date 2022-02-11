import remove from 'lodash.remove'
export const ADD_NOTE = 'ADD_NOTE'
export const DELETE_NOTE = 'DELETE_NOTE'
export const UPDATE_NOTE = 'UPDATE_NOTE'
export const RESTORE_NOTES = 'RESTORE_NOTES'

import { combineReducers } from 'redux'

function findFreeId(array){

  const sortedArray = array
    .slice()
    .sort(function (a, b){return a.id - b.id});

  let previousId = 0;

  for (let element of sortedArray){
    
    if (element.id != (previousId + 1)){

      return previousId + 1;
    }

    previousId = element.id;
  }

  return previousId + 1;
}

export function addnote(note){
  return {
    type: ADD_NOTE,
    note
  }
}

export function deletenote(id){
  return {
    type: DELETE_NOTE,
    payload: id
  }
}

export function editnote(id, note){
  return {
    type: UPDATE_NOTE,
    id: id,
    note
  }
}

const initialNoteState = []

function notesReducer(state = initialNoteState, action){

  switch(action.type){

    case ADD_NOTE:{

      let idVal = findFreeId(state)

      return [
        ...state,
        {
          id: idVal,
          note: action.note,
          date: new Date(),
        }
      ]
    }
    case DELETE_NOTE:{

      const deleteNewArray = remove(state, obj => {
        return obj.id != action.payload
      })

      return deleteNewArray
    }
    case UPDATE_NOTE:{

      const updatedArray = state.map(p =>
        p.id === action.id
          ? { ...p, note: action.note, date: new Date()}
          : p
      );

      return updatedArray
    }
    default:
      return state
  }
}

const rootReducer = combineReducers({ 
  notes: notesReducer,
});

export default rootReducer