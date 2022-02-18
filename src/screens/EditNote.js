import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, ToastAndroid, Platform,
          AlertIOS, TextInput } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import { addnote, editnote } from '../reducers/notesApp';
import reduxStore from '../reducers/store';

function EditNote({ route }) {

  const {store, persistor} = reduxStore();

  const [noteTitle, setNoteTitle] = useState(route.params.item.note.noteTitle);
  const [savedTitle, setSavedNoteTitle] = useState(route.params.item.note.noteTitle);
  const [savedDescription, setSavedDescription] = useState(route.params.item.note.noteDescription);
  const [noteDescription, setNoteDescription] = useState(route.params.item.note.noteDescription);
  const [id, setId] = useState(route.params.item.id);
  const [isNewNote, setIsNewNote] = useState(route.params.newNote);
  const [shouldShowKeyboard, setShouldShowKeyboard] = useState(false);

  const storeData = useSelector(state => state);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);

  const dispatch = useDispatch();

  // keyboard controls

  const showKeyboard = () => {

    inputRef.current.focus();
  }

  const showKeyboard2 = () => {

    if(isNewNote){

      inputRef2.current.focus();
    }
    else{

      inputRef2.current.blur();
    }
  }
  
  useEffect(() => {

    // retrieve id for new note
    if(isNewNote){

      setId(route.params.newId);
      showKeyboard();
    }
  }, []);

  // ensure data saved to store
  useEffect(() => {

    persistor.flush();
  
  }, [storeData]);

  // create new note
  const addNote = note => {

    dispatch(addnote(note));
    persistor.flush();
  }

  // update the note
  const editNote = (id, note) => {

    dispatch(editnote(id, note));
  }

  // show toast message
  function notifyMessage(msg) {
    if (Platform.OS === 'android') {

      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
    else{

      AlertIOS.alert(msg);
    }
  }

  function onSaveNote() {

    if(noteDescription != savedDescription || noteTitle != savedTitle){

      if(isNewNote){

        addNote({ noteTitle, noteDescription });
        persistor.flush();
        notifyMessage('Saved');
        setIsNewNote(false)
      }
      else{

        editNote(id, { noteTitle, noteDescription });
        persistor.flush();
        notifyMessage('Saved');
        setSavedDescription(noteDescription);
      }
    }
  }

  return (

  <View style={styles.wholeContainer}>

    <TextInput
      value={noteTitle}
      mode='outlined'
      onChangeText={setNoteTitle}
      style={styles.title}
      ref={inputRef}
      onSubmitEditing={() => showKeyboard2()}
    />
    
    <ScrollView
      contentContainerStyle={[{flexGrow:1}]}
      style={{flex:1}}
      overScrollMode="never"
      ref={scrollRef}
    >

      <TextInput
        value={noteDescription}
        onChangeText={setNoteDescription}
        mode="flat"
        multiline={true}
        style={styles.text}
        ref={inputRef2}
        autoFocus={true}
        textAlignVertical= 'top'
        spellCheck={false}
        autoCorrect={false}
        scrollEnabled={false}
        showSoftInputOnFocus={shouldShowKeyboard}
        onFocus={(event) => setShouldShowKeyboard(true)}
      />
    </ScrollView>

    <Appbar style={styles.bottom}>
      <Appbar.Action icon="check" onPress={() => onSaveNote()} />
    </Appbar>
  </View>
  )
}

const styles = StyleSheet.create({

  container:{
    flex: 1,
    backgroundColor: 'black',
  },
    iconButton:{
    backgroundColor: '#219653',
    position: 'absolute',
    right: 0,
    top: 40,
    margin: 10
  },
  titleContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title:{
    fontSize: 17,
    backgroundColor: '#111111',
    borderBottomColor: '#fcba03',
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 6,
    color: 'white',
  },
  text:{
    height: '100%',
    paddingTop: 10,
    paddingHorizontal: 6,
    fontSize: 17,
    backgroundColor: '#111111',
    color: 'white',
  },
  wholeContainer:{
    flex: 1,
    backgroundColor: 'black',
  },
  bottom:{
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 49,
    paddingHorizontal: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#fcba03',
    borderTopWidth: 1,
    backgroundColor: 'black',
    borderColor: '#fcba03'
  },
})

export default EditNote