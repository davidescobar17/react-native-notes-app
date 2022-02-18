import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { List, Appbar, Button as PaperButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-native-modal';

import { deletenote } from '../reducers/notesApp';
import reduxStore from '../reducers/store';
import Header from '../components/Header';

function ViewNotes({navigation}){

  const storeData = useSelector(state => state);
  const dispatch = useDispatch();
  const {store, persistor} = reduxStore();

  // to determine available note id for new note

  // get a free id for a new note
  function findFreeId (array){

    const sortedArray = array
      .slice()
      .sort(function (a, b){return a.id - b.id});

    let previousId = 0;

    for(let element of sortedArray){

      if (element.id != (previousId + 1)){

        return previousId + 1;
      }

      previousId = element.id;
    }

    return previousId + 1;
  }

  const [latestNoteId, setLatestNoteId] = useState(-1);

  // respond to changes in the store data
  useEffect(() => {

    // stopping undefined warning
    if(storeData.notes.length > 0){

      setLatestNoteId(findFreeId(storeData.notes));
    }
    else{

      setLatestNoteId(1);
    }
  }, [storeData])

  // deleting note overlay and functionality

  const [visibleOverlayDeleteNoteConfirm, setVisibleOverlayDeleteNoteConfirm] = useState(false);
  
  const toggleOverlayDeleteNoteConfirm = () => {

    setVisibleOverlayDeleteNoteConfirm(!visibleOverlayDeleteNoteConfirm);
  };

  const deleteNote = id => {

    deleteNoteFromTags(id);
    dispatch(deletenote(id));
    persistor.flush();
  }

  // setting a height for flatlist items to improve flatlist performance
  const getItemLayout = (data, index) => (
    {length: 55, offset: 55 * index, index}
  );

  // note item component for flatlist
  const renderItem = ({item}) => 
    <List.Item
      title={item.note.noteTitle}
      description={""}
      descriptionNumberOfLines={0}
      titleStyle={styles.listTitle}
      style={styles.listItem}
      onPress={() => {

                  navigation.navigate('EditNote', {item: item})
              }}
      delayLongPress={250}
      onLongPress={() => {

                    setSelectedNoteId(item.id);
                    toggleOverlayDeleteNoteConfirm();
                  }}
    />
  
  return (
    <View style={styles.wholeContainer}>
      <View style={styles.container}>

        { storeData.notes.length === 0 ? (
          <View style={styles.noItemsMessageContainer}>
          </View>
          ) : (
          <View style={{flex:1, flexDirection:'row'}}>
            <FlatList
              style={{flex:1}}
              keyboardShouldPersistTaps={'always'}
              data={storeData.notes}
              getItemLayout={getItemLayout}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              initialNumToRender={11}
              maxToRenderPerBatch={21}
              windowSize={10}
            />
          </View>
        )}

        <Modal animationInTiming={1} animationOutTiming={1} isVisible={visibleOverlayDeleteNoteConfirm}
          animationIn={'fadeIn'} animationOut={'fadeOut'} backdropTransitionOutTiming={0}
          onBackdropPress={toggleOverlayDeleteNoteConfirm} onBackButtonPress={toggleOverlayDeleteNoteConfirm}>

            <View>
              <Header
                titleText='Confirm delete' subtitleText='Delete this note?'/>

              <View style={styles.dialogContainer}>
                <View style={{marginBottom: 5 }}>
                  <PaperButton mode="contained" uppercase={false}
                    theme={{colors:{primary:'#fcba03'}}}
                    contentStyle={styles.button} labelStyle={styles.buttonText}
                    onPress={() => {deleteNote(selectedNoteId); toggleOverlayDeleteNoteConfirm();}}>
                    Delete
                  </PaperButton>
                </View>

                <PaperButton mode="contained" uppercase={false}
                  theme={{colors:{primary:'#fcba03'}}}
                  contentStyle={styles.button} labelStyle={styles.buttonText}
                  onPress={() => toggleOverlayDeleteNoteConfirm()}>
                  Back
                </PaperButton>
              </View>
            </View>
        </Modal>

        <Appbar style={styles.optionsBar}>
          <Appbar.Action icon="plus"
            onPress={() => navigation.navigate('EditNote', {item:{note:{noteTitle:"", noteDescription: ""}},
            newNote: true, newId: latestNoteId })}/>
        </Appbar>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#111111',
    paddingBottom: 65,
    paddingTop: 5,
  },
  noItemsMessageContainer:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    fontSize: 20,
    color: 'white'
  },
  dialogContainer:{
    backgroundColor: '#111111',
    paddingVertical: 20,
    paddingHorizontal: 10,
    maxHeight: "80%"
  },
  listTitle:{
    fontSize: 18,
    color: 'white',
  },
  listItem:{
    borderWidth: 1,
    borderColor: '#fcba03',
    paddingBottom: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    height: 55,
    justifyContent: 'center',
    backgroundColor: 'black',
    elevation: 16,
  },
  button:{
    borderRadius: 10,
    height: 35,
  },
  paperButton:{
    marginVertical: 2,
    borderRadius: 10,
    marginTop: 5,
    height: 30,
    width: 35,
  },
  buttonText:{
    fontSize: 20,
    height: 25,
    textAlign: 'center',
    justifyContent: 'center',
  },
  optionsBar:{
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
  wholeContainer:{
    flex: 1,
    backgroundColor: 'black',
  },
})

export default ViewNotes