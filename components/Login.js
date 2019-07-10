import React, {Component} from 'react';
import { StyleSheet,ScrollView, Text,TextInput,TouchableOpacity,Dimensions, View,Image,ImageBackground } from 'react-native';
import bgImage from '../assets/Blur.jpeg'
import Logo from '../assets/logo.png'
import {ref,firebaseAuth} from '../cons.js'
import Icon from 'react-native-vector-icons/Ionicons'
import * as firebase from 'firebase';
import axios from 'axios'
const Direccion = 'https://server02.herokuapp.com';

const {width: WIDTH} = Dimensions.get('window')


export default class Login extends Component {
  constructor(){
    super()
    this.state={
      email:'',
      password:'',
      RegistroSection:'',
      Nombre:'',
      EmailConfim:'',
      Edad:'',
      Genero:'',
      Telefono:'',
    }
  }

  autenticar =() =>{
    console.log(this.state.email);
    this.setState({
      drimmerActivo:true
    })
    let self = this;
          firebaseAuth.signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(function(user){
            console.log(user);
          })
          .catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {

                    alert('contraseña incorrecta');
                    self.setState({
                      drimmerActivo:false
                    })
                }
            else if(errorCode==='auth/user-not-found'){
              self.setState({
                drimmerActivo:false
              })
                  alert('Usuario inexistente');
            }
                else {
                        alert(errorMessage);
                      }
                      console.log(error);
          });
        }

    registrarUser=()=>{
      let objPerfil = {
        Nombre:this.state.Nombre,
        EmailConfim:this.state.EmailConfim,
        Edad:this.state.Edad,
        Genero:this.state.Genero,
        Telefono:this.state.Telefono,
        Password:this.state.passwordRegistro,
      }
      axios.post(Direccion+`/CrearUsuario`,{userData:objPerfil})
        .then(res => {
          if (res.data=='ok') {
            this.setState({
              RegistroSection:false,
            })
          }
          else {
          alert("Ups hubo un error");
          }

      }).catch(function(error) {
        console.log( error);
          throw error;
        });
    }

  render() {
    return (
      <ImageBackground source={bgImage} style={styles.backgroundContainer}>


        {!this.state.RegistroSection?
          <View>
            <View style={styles.logoContainer}>
              <Image source={Logo} style={styles.logo}/>
              <Text style={styles.logoText}> Events</Text>
            </View>
            <View style={styles.inputContainer}>
              <Icon name={'ios-person'} size={28} color={'rgba(255,255,255, 0.7)'}
                style={styles.icono}/>
              <TextInput
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
                style={styles.input}
                placeholder={'Email'}
                placeholderTextColor={'rgba(255,255,255,0.7)'}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name={'ios-lock'} size={28} color={'rgba(255,255,255, 0.7)'}
                style={styles.icono}/>
              <TextInput
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                style={styles.input}
                placeholder={'Password'}
                placeholderTextColor={'rgba(255,255,255,0.7)'}
                secureTextEntry={true}
              />
            </View>
            <View style={styles.btnContent}>
              <TouchableOpacity
                style={styles.btnLogin}
                onPress={this.autenticar}
                >
                <Text style={styles.textButton}>Login</Text>
              </TouchableOpacity >
              <Text onPress={() => {this.setState({RegistroSection:true})}} style={styles.textRegistro}>registrarse</Text>
            </View>
          </View>
            :
            <View>
            <ScrollView>
                <View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-person'} size={28} color={'rgba(255,255,255, 0.7)'}
                      style={styles.icono}/>
                    <TextInput
                      onChangeText={(Nombre) => this.setState({Nombre})}
                      value={this.state.Nombre}
                      style={styles.input}
                      placeholder={'Nombre'}
                      placeholderTextColor={'rgba(255,255,255,0.7)'}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      onChangeText={(EmailConfim) => this.setState({EmailConfim})}
                      value={this.state.EmailConfim}
                      style={styles.input}
                      placeholder={'Email'}
                      placeholderTextColor={'rgba(255,255,255,0.7)'}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      onChangeText={(Edad) => this.setState({Edad})}
                      value={this.state.Edad}
                      style={styles.input}
                      placeholder={'Edad'}
                      placeholderTextColor={'rgba(255,255,255,0.7)'}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      onChangeText={(Genero) => this.setState({Genero})}
                      value={this.state.Genero}
                      style={styles.input}
                      placeholder={'Genero'}
                      placeholderTextColor={'rgba(255,255,255,0.7)'}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      onChangeText={(Telefono) => this.setState({Telefono})}
                      value={this.state.Telefono}
                      style={styles.input}
                      placeholder={'Telefono'}
                      placeholderTextColor={'rgba(255,255,255,0.7)'}
                      secureTextEntry={true}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Icon name={'ios-lock'} size={28} color={'rgba(255,255,255, 0.7)'}
                      style={styles.icono}/>
                    <TextInput
                      onChangeText={(passwordRegistro) => this.setState({passwordRegistro})}
                      value={this.state.passwordRegistro}
                      style={styles.input}
                      placeholder={'Password'}
                      placeholderTextColor={'rgba(255,255,255,0.7)'}
                      secureTextEntry={true}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Icon name={'ios-lock'} size={28} color={'rgba(255,255,255, 0.7)'}
                      style={styles.icono}/>
                    <TextInput
                      onChangeText={(passwordConfirm) => this.setState({passwordConfirm})}
                      value={this.state.passwordConfirm}
                      style={styles.input}
                      placeholder={'Confirm password'}
                      placeholderTextColor={'rgba(255,255,255,0.7)'}
                      secureTextEntry={true}
                    />
                  </View>
                </View>
                <View style={styles.btnContent}>
                  <TouchableOpacity
                    style={styles.btnLogin}
                    onPress={this.registrarUser}
                    >
                    <Text style={styles.textButton}>Registrarme</Text>
                  </TouchableOpacity >
                </View>
                <View style={styles.btnContent}>
                  <TouchableOpacity
                    style={styles.btnLogin}
                    onPress={() => {this.setState({RegistroSection:false})}}
                    >
                    <Text style={styles.textButton}>Log in </Text>
                  </TouchableOpacity >
                </View>
              </ScrollView>
            </View>
        }

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundContainer:  {
      flex:1,
      justifyContent:'center',
      alignItems:'center',
    },

  logoContainer:{
    alignItems:'center',
    marginBottom:50,
    },

  logo:{
    width:120,
    height:120,
  },
  icono:{
    position:'absolute',
    top:3,
    left:40,
  },
    logoText:{
      color:'white',
      fontSize:30,
      fontWeight:'500',
      marginTop:10,
      opacity:0.7,
    },
    input:{
      width: WIDTH - 55,
      height:35,
      borderRadius:45,
      fontSize:16,
      paddingLeft:45,
      backgroundColor:'rgba(117,229,229,0.55)',
      color: 'rgba(255,255,255,0.7)',
      marginHorizontal:30,
    },

    inputContainer:{
      marginTop:20,
    },
    btnContent:{
      alignItems:'center',
    },
    btnLogin:{
      width: WIDTH-55,
      height:45,
      borderRadius: 25,
      backgroundColor:'#432577',
      justifyContent:'center',
      marginTop: 40,
    },
    textButton:{
      color:'rgba(255,255,255,0.7)',
      fontSize:16,
      textAlign:'center',
    },
    textRegistro:{
      textDecorationLine:'underline',
      color:'rgba(173,173,250,0.8)',
      marginTop:40,
    }
})
