import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    TouchableNativeFeedback,
    Dimensions,
    Image,
    ScrollView,
} from 'react-native';
import Modal from "react-native-modal";

import { LinearGradient } from 'expo-linear-gradient'

import Icon from 'react-native-vector-icons/Ionicons'
import DatePicker from 'react-native-datepicker'
const Direccion = 'https://server02.herokuapp.com';
import Tab from './Tab.js'
import axios from 'axios'
import * as firebase from 'firebase';


const {width: WIDTH,height: HEIGHT} = Dimensions.get('window')





export default class Eventos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            Cards:[],
        }
        this.GetEventos = this.GetEventos.bind(this);

    }

    componentWillMount(){
      console.log('componentWillMount');
      this.GetEventos();
    }

    GetEventos=()=>{
      var self=this;
      axios.get(Direccion+`/TomarEventosAll`)
        .then(res => {
          console.log(res.data);
          if (res.data.length >0) {
            self.setState({
              Cards:res.data,
            })
          }
          else {
            self.setState({
              Cards:[],
            })
          }

      })
    }



    render() {

        return (
          <View  style={styles.container}>
                <Tab tabActive={1}/>
                  <View style={{flex: 1}}  >
                    <ScrollView style={{flex:1,height:HEIGHT,width:WIDTH }} >

                      <View style={styles.cardContent}>
                      {
                        this.state.Cards.map((it,key)=>{
                          return(<CardEventos callbackGetEnventos={this.GetEventos}  it={it} key={key}/>)
                        })
                      }
                      </View>
                    </ScrollView>
                  </View>


         </View>


        );
    }
  }


  class CardEventos extends Component {

     constructor(props) {
         super(props);
         this.state = {
         active:'',
         openCard:false,
         Asistentes:[],
         isModalVisible:false,
         IdEvento:'',
         Existente:false,
         HoraCliente:0,
         };

     }

     componentWillMount(){
       let eventoId = this.props.it.key;
       let FounderId = this.props.it.Fundador;
       axios.post(Direccion+`/ConsultarAsistentes`,{eventInfo:eventoId,FounderId:FounderId})
         .then(res => {
           console.log(res.data);
           if (res.data) {
             let Zonacliente = new Date().toString().match(/([-\+][0-9]+)\s/)[1]
             let Diferencia = (parseInt(this.props.it.Zona)-parseInt(Zonacliente.substring(0,3)));
             this.setState({
               Asistentes:res.data,
               HoraCliente:parseInt(this.props.it.Hora)-Diferencia,
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

    toggleModal = () => {
      this.setState({ isModalVisible: !this.state.isModalVisible });
      this.props.callbackGetEnventos(true);

    };

     registrarseEvento=()=>{
       console.log(Direccion+`/RegistroEvento`);
       var self=this;
       let Eventoinfo = {key:this.props.it.key,Nombre:this.props.it.Nombre,Image:this.props.it.Image};
       let FounderId = this.props.it.Fundador;

       axios.post(Direccion+`/AsistirEvento`,{userId:firebase.auth().currentUser.uid,AsistenteName:firebase.auth().currentUser.displayName,eventInfo:Eventoinfo,FounderId:FounderId})
         .then(res => {
           if (res.data!='404') {
            this.setState({
              isModalVisible:true,
              IdEvento:firebase.auth().currentUser.uid,
            })
           }
           else {
             this.setState({
               isModalVisible:true,
               IdEvento:firebase.auth().currentUser.uid,
               Existente:true,
             })
           }

       }).catch(function(error) {
         console.log( error);
           throw error;
         });
     }

     render() {
       let users="";
       let moreUser="";

       if (this.state.Asistentes) {
         users = this.state.Asistentes.length-2;
         moreUser = users>0?users:0;
         console.log(this.state.Asistentes);
       }

         return (
           <LinearGradient
                colors={['#F4AC86', '#FDB2A9']}
                style={[CardStyles.Linearcontent,shadow]}
              >
           {!this.state.openCard?

             <View style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20, width:WIDTH-60 ,marginBottom:20}}>
             <TouchableNativeFeedback
                 onPress={() => this.setState({ openCard: true}) }
                  style={{height:240 ,marginBottom:5}}
                 >

                 <View style={{alignItems: 'center'}}>
                     <View>
                      <Image style={{width:WIDTH-60,height:180, borderTopRightRadius:10,borderTopLeftRadius:10}} source={{uri:this.props.it.Image}}/>
                     </View>

                       <View style={{flex: 1,  marginLeft:5}}>
                         <Text style={{fontSize: 24, fontWeight: '700', paddingBottom: 8}}>{this.props.it.Nombre}</Text>
                         <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray', paddingBottom: 10}}>{this.props.it.Descripcion}</Text>
                         <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray'}}> {this.props.it.Fecha} </Text>
                         <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray'}}>Creado por : {this.props.it.userName} </Text>

                        </View>
                       <View>
                       {this.state.Asistentes.length>=1?
                           <View>
                             {this.state.Asistentes.length>=2?
                               <Text style={{fontSize: 14, fontWeight: '300', paddingBottom: 8}}>{this.state.Asistentes[0]},{this.state.Asistentes[1]} y {moreUser} personas mas asistiran   </Text>
                               :
                               <Text style={{fontSize: 14, fontWeight: '300', paddingBottom: 8,marginTop:20}}>{this.state.Asistentes[0]} asistira </Text>
                             }
                           </View>
                         :
                         <View>
                         <Text style={{fontSize: 14, fontWeight: '300', paddingBottom: 8,marginTop:20}}>Aun no hay asistentes</Text>

                         </View>
                       }

                       </View>
                 </View>
             </TouchableNativeFeedback>
            </View>
            :
            <View style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20, width:WIDTH-60,marginBottom:20}}>
            <TouchableNativeFeedback
                onPress={() => this.setState({ openCard: false}) }
                 style={{height:300 ,marginBottom:20}}
                >

                <View style={{alignItems: 'center'}}>
                  <View style={{flex: 1,  marginLeft:5}}>
                    <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray', paddingBottom: 10}}>Pais</Text>
                    <Text style={{fontSize: 18, fontWeight: '700', paddingBottom: 8}}>{this.props.it.Pais}</Text>

                    <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray'}}>Estado</Text>
                    <Text style={{fontSize: 18, fontWeight: '700', paddingBottom: 8}}>{this.props.it.Estado} </Text>

                    <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray', paddingBottom: 10}}>Ciudad</Text>
                    <Text style={{fontSize: 18, fontWeight: '700', paddingBottom: 8}}>{this.props.it.Ciudad}</Text>

                    <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray'}}>Direccion</Text>
                    <Text style={{fontSize: 18, fontWeight: '700', paddingBottom: 8}}>{this.props.it.Direccion} </Text>

                    <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray', paddingBottom: 10}}>Duracion</Text>
                    <Text style={{fontSize: 18, fontWeight: '700', paddingBottom: 8}}>{this.props.it.Duracion}</Text>

                    <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray',marginTop:20}}>Precio </Text>
                    <Text style={{fontSize: 30, fontWeight: '700', paddingBottom: 8}}>$ {this.props.it.Precio} </Text>
                    <Text style={{alignItems:'center',fontSize: 18,marginLeft:3, fontWeight: '200', color: 'gray'}}>Hora: {this.state.HoraCliente}:{this.props.it.Minutos}</Text>

                  </View>
                    <TouchableOpacity
                      style={styles.btnRegistrase}
                      onPress={this.registrarseEvento}
                      >
                      <Text style={styles.textButton}>Registrase</Text>
                    </TouchableOpacity >
                </View>
            </TouchableNativeFeedback>
          </View>
           }
           <Modal isVisible={this.state.isModalVisible}>
             <View style={CardStyles.backgroundModal}>
                 {!this.props.Existente?
                   <View>
                   <Text style={{alignItems:'center',fontSize: 30,marginLeft:3, fontWeight: '500', color: 'gray'}}>Felicidades</Text>
                   <Text style={{alignItems:'center',fontSize: 13,marginLeft:3, fontWeight: '300', color: 'gray'}}>Este es el codigo de tu entrada</Text>
                   <Text style={{alignItems:'center',fontSize: 18,marginLeft:3, fontWeight: '200', color: 'gray'}}>{this.state.IdEvento}</Text>

                   </View>
                   :
                   <View>
                   <Text style={{alignItems:'center',fontSize: 30,marginLeft:3, fontWeight: '500', color: 'gray'}}>Lo Sentimos</Text>
                   <Text style={{alignItems:'center',fontSize: 13,marginLeft:3, fontWeight: '300', color: 'gray'}}>Ya estas registrado en este evento</Text>
                   <Text style={{alignItems:'center',fontSize: 13,marginLeft:3, fontWeight: '300', color: 'gray'}}>Este es el codigo de tu entrada</Text>
                   <Text style={{alignItems:'center',fontSize: 18,marginLeft:3, fontWeight: '200', color: 'gray'}}>{this.state.IdEvento}</Text>

                   </View>
                 }

               <TouchableOpacity
                 style={CardStyles.btnAceptarModal}
                 onPress={this.toggleModal}
                 >
                 <Text style={styles.textButton}>Aceptar</Text>
               </TouchableOpacity >

             </View>
           </Modal>
           </LinearGradient>
         )
     }
 }




 const CardStyles = StyleSheet.create({

   container:{
     width:290,
   },

   Linearcontent:{
     flex: 1,
     marginTop:15,
     marginBottom:25,
     borderTopRightRadius:20,
     borderTopLeftRadius:20,
     borderBottomLeftRadius: 20,
     borderBottomRightRadius: 20,
     width:WIDTH-60,

   },

   btnAceptarModal:{
     width: WIDTH-120,
     height:45,
     borderRadius: 25,
     backgroundColor:'#5CC27A',
     justifyContent:'center',
     marginBottom:5,
   },

   backgroundModal:{
     flex:1,
     backgroundColor:'#F8E5E1',
     marginTop:HEIGHT/2,
     borderRadius: 20,
     alignItems:'center',

   }
 })

 const shadow = {
   shadowColor: '#30C1DD',
   shadowRadius: 30,
   shadowOpacity: 0.6,
   elevation: 20,
   shadowOffset: {width: 10,height: 10}
 }

  const styles = StyleSheet.create({
    cardContent:{
         width:WIDTH-10,
         alignItems:'center',
    },

    btnRegistrase:{
      width: WIDTH-80,
      height:45,
      borderRadius: 25,
      backgroundColor:'#5CC27A',
      justifyContent:'center',
      marginBottom:5,
    },
    container:{
         width:WIDTH,
         height:HEIGHT,
    },
    contentForm:{
      alignItems:'center',
      textAlign:'center',
      height:800,
    },
    TextForm:{
      fontSize:30,
      color: '#5CC27A'
    },
    btnAdd:{
      width:50,
      height:50,
      marginLeft:WIDTH-50,
    },
    backButton:{
      marginLeft:14,
    },
    BarTop:{
      width:WIDTH,
      height:55,
      backgroundColor:'rgba(95,189,156,0.9)'
    },

    input:{
      width: (WIDTH/2)-20,
      height:35,
      borderRadius:45,
      textAlign:'center',
      color: 'rgba(0,0,0,0.7)',
      borderColor: 'black',
      borderWidth: 1,
      marginLeft:5,
    },
    contentTextInput:{
      marginTop:10,
      marginBottom: 30,
      flexDirection: 'row',
      flexWrap: 'wrap'
    },

    inputDesc:{
      width: (WIDTH/2)+20,
      height:70,
      borderRadius:10,
      fontSize:16,
      textAlign:'center',
      color: 'rgba(0,0,0,0.7)',
      borderColor: 'black',
      borderWidth: 1,
      marginLeft:5,
    },
    btnCrear:{
      width: WIDTH-55,
      height:45,
      borderRadius: 25,
      backgroundColor:'#5CC27A',
      justifyContent:'center',
      marginBottom:5,
    },
    textButton:{
      color:'rgba(255,255,255,0.7)',
      fontSize:16,
      textAlign:'center',
    },
  })
