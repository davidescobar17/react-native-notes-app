import React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider as StoreProvider } from 'react-redux'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { PersistGate } from 'redux-persist/integration/react'

import reduxStore from './src/reducers/store'
import ViewNotes from './src/screens/ViewNotes'
import EditNote from './src/screens/EditNote'

const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'black',
  },
};

function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ViewNotes"
      theme
    >
      <Stack.Screen
        name="ViewNotes"
        component={ViewNotes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditNote"
        component={EditNote}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default function App(){

  const {store, persistor} = reduxStore();
  
  return (
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <NavigationContainer theme={MyTheme}>
            <StackNavigator/>
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </StoreProvider>
  )
}