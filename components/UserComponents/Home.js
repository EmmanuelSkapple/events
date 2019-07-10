import React, {Component} from 'react';
import { StyleSheet, Text,TextInput,TouchableOpacity,Dimensions, View,Image,ImageBackground } from 'react-native';
import Tab from './Tab.js'

const {width: WIDTH,height: HEIGHT} = Dimensions.get('window')

export default class Home extends Component {


  render() {
    return (
      <View  style={styles.container}>
      <Tab tabActive={0}/>
        <Text>Hola</Text>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container:{
       width:WIDTH,
       height:HEIGHT,
       alignItems: 'center',
  }
})
