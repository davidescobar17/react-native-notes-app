import React from 'react'
import { StyleSheet } from 'react-native'
import { Appbar } from 'react-native-paper'

function Header({ titleText, subtitleText }) {
    return (
        <Appbar.Header>
            <Appbar.Content titleStyle={styles.titleStyle} subtitleStyle={styles.subtitleStyle} title={titleText} subtitle={subtitleText}/>
        </Appbar.Header>
    )
}

const styles = StyleSheet.create({
    titleStyle:{
        textAlign: 'center',
        fontSize: 22
    },
    subtitleStyle:{
        textAlign: 'center',
        fontSize: 16
    }
})

export default Header