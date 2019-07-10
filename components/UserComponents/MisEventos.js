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





export default class MisEventos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            Cards:[],
            Nombre:'',
            Descripcion:'',
            Fecha:'',
            Direccion:'',
            Duracion:'',
            Precio:'',
            Pais:'',
            Estado:'',
            Ciudad:'',
        }
        this.GetEventos = this.GetEventos.bind(this);
        this.SubirEvento = this.SubirEvento.bind(this);

    }

    componentWillMount(){
      console.log('componentWillMount');
      this.GetEventos();
    }

    GetEventos=()=>{
      var self=this;
      console.log('antes de tomar');
      axios.post(Direccion+`/TomarEventoUser`,
        {userId:firebase.auth().currentUser.uid})
        .then(res => {
          console.log('tomados');
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

    SubirEvento=()=>{
      console.log(Direccion+`/NuevoEvento`);
      var self=this;
      let Eventoinfo = {
         Nombre:this.state.Nombre,
        Descripcion:this.state.Descripcion,
        Fecha:this.state.Fecha,
        Direccion:this.state.Direccion,
        Duracion:this.state.Duracion,
        Precio:this.state.Precio,
        Pais:this.state.Pais,
        Estado:this.state.Estado,
        Ciudad:this.state.Ciudad,
      }
      console.log(Eventoinfo);
      axios.post(Direccion+`/NuevoEvento`,{userName:firebase.auth().currentUser.displayName,userId:firebase.auth().currentUser.uid,ObjEvent:Eventoinfo})
        .then(res => {
          console.log(res.data);
          if (res.data) {
            this.setState({
              modalVisible:false,
            })
          this.GetEventos();
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
          <View  style={styles.container}>
                <Tab tabActive={2}/>

                {!this.state.modalVisible?
                  <View style={{flex: 1}}  >
                    <ScrollView style={{flex:1,height:HEIGHT,width:WIDTH }} >
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({modalVisible:true});
                        }}
                        style={styles.btnAdd}
                      >
                      <Text style={{color: 'white'}}><Icon name='ios-add-circle-outline'
                      style={{color:'rgba(95,189,156,0.9)',fontSize:50}} /></Text>
                      </TouchableOpacity>
                      <View style={styles.cardContent}>
                      {
                        this.state.Cards.map((it,key)=>{
                          return(<CardEventos  it={it} key={key}/>)
                        })

                      }
                      </View>
                    </ScrollView>
                  </View>
                :
                <View style={{flex: 1}}  >
                  <ScrollView automaticallyAdjustContentInsets={true} style={{flex:1,height:HEIGHT,width:WIDTH }} >
                  <View style={styles.contentForm}>
                    <TouchableOpacity
                      onPress={() => {this.setState({modalVisible:false})}}
                      style={styles.btnAdd}
                    >
                      <Text style={{color: 'white'}}><Icon name='ios-close-circle-outline'
                      style={{color:'rgba(95,189,156,0.9)',fontSize:50}} /></Text>
                    </TouchableOpacity>
                   <Text style={styles.TextForm}>Cuentanos</Text>
                   <Text style={styles.TextForm}> sobre</Text>
                   <Text style={styles.TextForm}>tu evento!</Text>
                   <View>
                     <View style={styles.contentTextInput}>
                       <TextInput
                         onChangeText={(Nombre) => this.setState({Nombre})}
                         value={this.state.Nombre}
                         style={styles.input}
                         placeholder={'Nombre'}
                         placeholderTextColor={'rgba(0,0,0,0.7)'}
                       />

                       <DatePicker
                         style={styles.input}
                         date={this.state.date}
                         mode="date"
                         placeholder="Fecha"
                         format="YYYY-MM-DD"
                         confirmBtnText="Aceptar"
                         cancelBtnText="Cancel"
                         customStyles={{
                           dateIcon: {
                             position: 'absolute',
                             left: 0,
                             top: 2,
                             marginLeft: 6,
                           },
                           dateInput: {
                             marginLeft: 25,
                             borderWidth:0,
                             color:'rgba(0,0,0,1)',

                             marginBottom:3,
                             borderColor:'white',
                           }
                           // ... You can check the source to find the other keys.
                         }}
                         onDateChange={(date) => {this.setState({Fecha: date})}}
                       />
                      </View>
                      <View style={styles.contentTextInput}>
                         <TextInput
                           onChangeText={(Duracion) => this.setState({Duracion})}
                           value={this.state.Duracion}
                           style={styles.input}
                           placeholder={'Duracion'}
                           placeholderTextColor={'rgba(0,0,0,0.7)'}
                         />
                         <TextInput
                           onChangeText={(Precio) => this.setState({Precio})}
                           value={this.state.Precio}
                           style={styles.input}
                           placeholder={'Precio'}
                           placeholderTextColor={'rgba(0,0,0,0.7)'}
                         />

                       </View>
                       <View style={styles.contentTextInput}>
                         <TextInput
                           onChangeText={(Pais) => this.setState({Pais})}
                           value={this.state.Pais}
                           style={styles.input}
                           placeholder={'Pais'}
                           placeholderTextColor={'rgba(0,0,0,0.7)'}
                         />
                         <TextInput
                           onChangeText={(Estado) => this.setState({Estado})}
                           value={this.state.Estado}
                           style={styles.input}
                           placeholder={'Estado'}
                           placeholderTextColor={'rgba(0,0,0,0.7)'}
                         />
                       </View>
                       <View style={styles.contentTextInput}>
                         <TextInput
                           onChangeText={(Ciudad) => this.setState({Ciudad})}
                           value={this.state.Ciudad}
                           style={styles.input}
                           placeholder={'Ciudad'}
                           placeholderTextColor={'rgba(0,0,0,0.7)'}
                         />
                         <TextInput
                           onChangeText={(Direccion) => this.setState({Direccion})}
                           value={this.state.Direccion}
                           style={styles.input}
                           placeholder={'Direccion'}
                           placeholderTextColor={'rgba(0,0,0,0.7)'}
                         />
                       </View>
                   </View>
                   <View style={styles.contentTextInput}>
                   <TextInput
                     onChangeText={(Descripcion) => this.setState({Descripcion})}
                     value={this.state.Descripcion}
                     style={styles.inputDesc}
                     placeholder={'Descripcion'}
                     placeholderTextColor={'rgba(0,0,0,0.7)'}
                     multiline={true}
                   />
                   </View>

                  </View>
                  <View style={{alignItems:'center'}}>
                    <TouchableOpacity
                      style={styles.btnCrear}
                      onPress={this.SubirEvento}
                      disabled={!this.state.Nombre||!this.state.Descripcion||!this.state.Fecha
                      ||!this.state.Direccion||!this.state.Duracion||!this.state.Precio||!this.state.Estado||!this.state.Pais
                      ||!this.state.Ciudad}
                      >
                      <Text style={styles.textButton}>Crear Evento</Text>
                    </TouchableOpacity >
                  </View>
                  </ScrollView>
                </View>

                }

         </View>


        );
    }
  }


  class CardEventos extends Component {

     constructor(props) {
         super(props);
         this.state = {
         active:''
         };

     }
     OnPress(){

     }


     render() {
       let users="";
       let moreUser="";
       if (this.props.it.Asistentes) {
         users = this.props.it.Asistentes.length-2;
         moreUser = users>0?users:'';
       }


         return (
           <View style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40, borderWidth:1, borderBottomRadius:20, width:WIDTH-60, borderColor:'gray' ,marginBottom:20}}>

                 <TouchableNativeFeedback
                     onPress={this.OnPress}
                      style={{height:200, borderWidth:1,borderColor:'gray' ,marginBottom:20}}
                     >

                     <View style={[{alignItems: 'center'}]}>
                         <View>
                          <Image style={{width:WIDTH-60}} source={require('../../assets/event.jpeg')}/>
                         </View>

                           <View style={{flex: 1,  marginLeft:5}}>
                             <Text style={{fontSize: 24, fontWeight: '700', paddingBottom: 8}}>{this.props.it.Nombre}</Text>
                             <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray', paddingBottom: 10}}>{this.props.it.Descripcion}</Text>
                             <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'gray'}}> {this.props.it.Fecha} </Text>
                            </View>
                           <View>
                           {this.props.it.Asistentes?
                             <View>
                             {moreUser?
                               <Text style={{fontSize: 24, fontWeight: '700', paddingBottom: 8}}>{this.props.it.Asistentes[0]},{this.props.it.Asistentes[1]} y {moreUser} personas mas asistiran   </Text>
                               :
                               <Text style={{fontSize: 24, fontWeight: '700', paddingBottom: 8}}>{this.props.it.Asistentes[0]} </Text>
                             }
                             </View>
                             :
                             <View/>
                           }

                           </View>
                     </View>
                 </TouchableNativeFeedback>
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
