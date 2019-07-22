import React, {Component} from 'react';
import { StyleSheet, Text,TextInput,TouchableOpacity,Dimensions, View,Image,ImageBackground } from 'react-native';
const {width: WIDTH, height:HEIGHT} = Dimensions.get('window')
import Tab from './Tab.js'
import axios from 'axios'
const Direccion = 'https://server02.herokuapp.com';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons'

import { Avatar } from 'react-native-elements'


export default class Perfil extends Component {
  constructor(props) {
      super(props);
      this.state = {
          PerfilData:[],

      }
      this.GetPerfil = this.GetPerfil.bind(this);

  }

  componentWillMount(){
    this.GetPerfil();
  }

  GetPerfil=()=>{
    var self=this;
    axios.post(Direccion+`/TomarUsuario`,{userId:firebase.auth().currentUser.uid})
      .then(res => {
        if (res.data) {
          self.setState({
            PerfilData:res.data,
          })
        }
        else {
          self.setState({
            PerfilData:[],
          })
        }
    })
  }

  render() {
    return (
      <View>
        <Tab tabActive={3}/>
        <View style={styles.headerContainer}>
         <View style={styles.userRow}>
           <Image
             style={styles.userImage}
             source={{
               uri: "http://www.myiconfinder.com/uploads/iconsets/256-256-5d8cab7b01ffef290b73909d06d92705.png",
             }}
           />
           <View style={styles.userNameRow}>
             <Text style={styles.userNameText}>{this.state.PerfilData.nombre}</Text>
           </View>
           <View style={styles.userBioRow}>
             <Text style={styles.userBioText}> {this.state.PerfilData.genero} {this.state.PerfilData.edad} años</Text>
             <Text style={styles.userBioText}>Tel: {this.state.PerfilData.telefono}</Text>
             <Text style={styles.userBioText}>email: {this.state.PerfilData.correo}</Text>

           </View>
         </View>
         <Icon
           name={'md-log-out'} size={50}
           color={'rgba(0,0,0, 0.7)'}
           style={{marginTop:30}}
           onPress={() => firebase.auth().signOut() }
           />
       </View>
      </View>

    );
  }
}


const styles = StyleSheet.create({
    headerContainer: {
      alignItems: 'center',
      backgroundColor: '#FFF',
      marginBottom: 10,
      marginTop: 45,
    },
    socialIcon: {
      marginLeft: 14,
      marginRight: 14,
    },
    socialRow: {
      flexDirection: 'row',
    },
    userBioRow: {
      marginLeft: 40,
      marginRight: 40,
    },
    userBioText: {
      color: 'gray',
      fontSize: 13.5,
      textAlign: 'center',
    },
    userImage: {
      borderRadius: 60,
      height: 120,
      marginBottom: 10,
      width: 120,
    },
    userNameRow: {
      marginBottom: 10,
    },
    userNameText: {
      color: '#5B5A5A',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    userRow: {
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      marginBottom: 12,
    },
})
