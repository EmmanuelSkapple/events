import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    TouchableNativeFeedback,
    Modal,
    Dimensions,
    Image,
    ScrollView,
} from 'react-native';
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
      console.log('antes de tomar');
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
         };

     }

     componentWillMount(){
       let eventoId = this.props.it.key;
       let FounderId = this.props.it.Fundador;
       axios.post(Direccion+`/ConsultarAsistentes`,{eventInfo:eventoId,FounderId:FounderId})
         .then(res => {
           console.log(res.data);
           if (res.data) {
             this.setState({
               Asistentes:res.data
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


     registrarseEvento=()=>{
       console.log(Direccion+`/RegistroEvento`);
       var self=this;
       let eventoId = this.props.it.key;
       let FounderId = this.props.it.Fundador;

       axios.post(Direccion+`/AsistirEvento`,{userId:firebase.auth().currentUser.uid,AsistenteName:firebase.auth().currentUser.displayName,eventInfo:eventoId,FounderId:FounderId})
         .then(res => {
           console.log(res.data);
           if (res.data) {
           this.props.callbackGetEnventos(true);
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
       let users="";
       let moreUser="";
       if (this.state.Asistentes) {
         users = this.state.Asistentes.length-2;
         moreUser = users>0?users:'';
       }

         return (
           <View style={{marginTop:15}}>
           {!this.state.openCard?

             <View style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40,borderWidth:1, width:WIDTH-60, borderColor:'gray' ,marginBottom:20}}>
             <TouchableNativeFeedback
                 onPress={() => this.setState({ openCard: true}) }
                  style={{height:200 ,marginBottom:5}}
                 >

                 <View style={{alignItems: 'center'}}>
                     <View>
                      <Image style={{width:WIDTH-60}} source={require('../../assets/event.jpeg')}/>
                     </View>

                       <View style={{flex: 1,  marginLeft:5}}>
                         <Text style={{fontSize: 24, fontWeight: '700', paddingBottom: 8}}>{this.props.it.Nombre}</Text>
                         <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray', paddingBottom: 10}}>{this.props.it.Descripcion}</Text>
                         <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray'}}> {this.props.it.Fecha} </Text>
                         <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray'}}>Creado por : {this.props.it.userName} </Text>

                        </View>
                       <View>
                       {this.state.Asistentes?
                         <View>
                         {moreUser?
                           <Text style={{fontSize: 24, fontWeight: '700', paddingBottom: 8}}>{this.state.Asistentes[0].Nombre},{this.state.Asistentes[1].Nombre} y {moreUser} personas mas asistiran   </Text>
                           :
                           <Text style={{fontSize: 24, fontWeight: '700', paddingBottom: 8}}>{this.state.Asistentes[0].Nombre} </Text>
                         }
                         </View>
                         :
                         <View>
                         <Text style={{fontSize: 24, fontWeight: '700', paddingBottom: 8}}>Aun no hay asistentes</Text>

                         </View>
                       }

                       </View>
                 </View>
             </TouchableNativeFeedback>
            </View>
            :
            <View style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40, borderWidth:1, width:WIDTH-60, borderColor:'gray' ,marginBottom:20}}>
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

          </View>
         )
     }
 }

 const CardStyles = StyleSheet.create({

   container:{
     width:290,
   }
 })


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
      fontSize:16,
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
