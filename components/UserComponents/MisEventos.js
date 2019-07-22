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
import {ImagePicker, Permissions} from 'expo';
import * as Progress from 'react-native-progress';
import { LinearGradient } from 'expo-linear-gradient'
import {SubirDato} from '../uploadData.js';
import Icon from 'react-native-vector-icons/Ionicons'
import DatePicker from 'react-native-datepicker'
const Direccion = 'https://server02.herokuapp.com';
import Tab from './Tab.js'
import axios from 'axios'
import * as firebase from 'firebase';
import TimePicker from 'react-native-simple-time-picker';

const self = this;
const {width: WIDTH,height: HEIGHT} = Dimensions.get('window')





export default class MisEventos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            Cards:[],
            Nombre:'Carnita Asada',
            Descripcion:'Una carnita para todas las edades, con bebida y botana incluida',
            Fecha:'09/09/2019',
            Direccion:'Obsidiana #2424',
            Duracion:'1h',
            Precio:'140',
            Pais:'Mexico',
            Estado:'Jalisco',
            Ciudad:'Zapopan',
            file:null,
            Progreso:0,
            isModalVisible:0,
            Terminado:false,
        }
        this.GetEventos = this.GetEventos.bind(this);
        this.SubirEvento = this.SubirEvento.bind(this);
        this._pickImage = this._pickImage.bind(this);
    }

    componentWillMount(){
      this.GetEventos();
    }


    GetEventos=()=>{
      var self=this;
      axios.post(Direccion+`/TomarEventoUser`,
        {userId:firebase.auth().currentUser.uid})
        .then(res => {

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

    nuevaImagen=(event)=>{
      let reader = new FileReader();
         let file = event.target.files[0];
          reader.onloadend = (e) => {
            this.setState({
              file: file,
              imagePreviewUrl: reader.result,
            });
          }
          reader.readAsDataURL(file);
    }






    SubirEvento=()=>{
      var self=this;
      var date = new Date();
      let ImageUpload=SubirDato('usuarios/'+firebase.auth().currentUser.uid+'/Eventos/Image',firebase.storage(),this.state.file,self);
      ImageUpload.then(function(done){
        let Eventoinfo = {
           Nombre:self.state.Nombre,
          Descripcion:self.state.Descripcion,
          Fecha:self.state.Fecha,
          Direccion:self.state.Direccion,
          Duracion:self.state.Duracion,
          Precio:self.state.Precio,
          Pais:self.state.Pais,
          Estado:self.state.Estado,
          Ciudad:self.state.Ciudad,
          Hora:self.state.selectedHours,
          Minutos:self.state.selectedMinutes,
          Zona:  new Date().toString().match(/([-\+][0-9]+)\s/)[1],
          Image:done,
        }


        console.log("Eventoinfo:" + Eventoinfo);
        axios.post(Direccion+`/NuevoEvento`,{userName:firebase.auth().currentUser.displayName,userId:firebase.auth().currentUser.uid,ObjEvent:Eventoinfo})
          .then(res => {
            if (res.data) {
              self.setState({
                modalVisible:false,
              })
            self.GetEventos();
            }
            else {
            alert("Ups hubo un error");
            }

        }).catch(function(error) {
          console.log( error);
            throw error;
          });

      })

    }
    toggleModal = () => {
      this.setState({ isModalVisible: !this.state.isModalVisible });
    };


  async checkCameraRollPermission() {
     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
     if (status !== 'granted') {
       Alert.alert(
         'Hey',
         'Hey! You might want to enable notifications for my app, they are good.',
         [
           { text: 'Settings', onPress: () => Linking.openURL('app-settings:') },
           {
             text: 'Cancel',
             onPress: () => console.log('Cancel Pressed'),
             style: 'cancel'
           }
         ]
       )
       this.setState({
         hasCameraRollPermissions: false
       })
       return false
     }
     this.setState({
       hasCameraRollPermissions: true
     })
     return true
   }


async  _pickImage() {
  const checkPermissions = await this.checkCameraRollPermission()
  console.log(checkPermissions, '--what is returned here determins the permissions');
   if (!checkPermissions) return

   let result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.All,
     allowsEditing: true,
     aspect: [4, 3],
   });




    if (!result.cancelled) {
      this.setState({ file: result.uri });
    }
  };


    render() {
      let ProgesoInt = parseFloat(parseInt(this.state.Progreso)/100);
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
                          return(<CardEventos  callbackGetEventos={this.GetEventos} it={it} key={key}/>)
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
                   <Text style={{fontSize:24}}>Establece una hora de inicio</Text>

                   <View style={CardStyles.TimeContainer}>
                     <TimePicker
                       selectedHours={this.state.selectedHours}
                       selectedMinutes={this.state.selectedMinutes}
                       onChange={(hours, minutes) => this.setState({ selectedHours: hours, selectedMinutes: minutes })}
                     />
                   </View>
                   <Text onPress={this._pickImage} style={{color: 'white'}}><Icon name='md-aperture'
                   style={{color:'rgba(197,126,252,0.9)',fontSize:60}} /></Text>
                  </View>
                  <View style={{alignItems:'center'}}>
                    <TouchableOpacity
                      style={styles.btnCrear}
                      onPress={this.SubirEvento}
                      disabled={!this.state.Nombre||!this.state.Descripcion||!this.state.Fecha
                      ||!this.state.Direccion||!this.state.Duracion||!this.state.Precio||!this.state.Estado||!this.state.Pais
                      ||!this.state.Ciudad||!this.state.file}
                      >
                      <Text style={styles.textButton}>Crear Evento</Text>
                    </TouchableOpacity >
                  </View>
                  </ScrollView>
                  <Modal isVisible={this.state.isModalVisible}>
                    <View style={CardStyles.backgroundModal}>
                        {!this.state.Terminado?
                          <View>
                          <Text style={{fontSize: 30,marginLeft:6, fontWeight: '500', color: 'gray'}}>Subiendo Tu evento</Text>
                          <Text style={{fontSize: 13,marginLeft:12, fontWeight: '200', color: 'gray'}}>esto puede llegar a tardar </Text>
                          <Text style={{fontSize: 13,marginLeft:12, fontWeight: '200', color: 'gray'}}>por el peso de la imagen </Text>
                            <View style={{alignItems:'center'}}>
                              <Progress.Bar style={{marginTop:40}} progress={ProgesoInt} height={10} width={200} />
                              <Text style={{fontSize: 13,marginLeft:10, fontWeight: '100', color: 'gray'}}> {ProgesoInt*100} %</Text>
                            </View>
                          </View>
                          :
                          <View>
                          <Text style={{fontSize: 30,marginLeft:6, fontWeight: '500', color: 'gray'}}>En hora buena!!</Text>
                          <Text style={{fontSize: 13,marginLeft:12, fontWeight: '200', color: 'gray'}}>Evento creado exitosamente</Text>

                          <TouchableOpacity
                            style={CardStyles.btnAceptarModal}
                            onPress={this.toggleModal}
                            >
                            <Text style={styles.textButton}>Aceptar</Text>
                          </TouchableOpacity >
                          </View>
                        }
                    </View>
                  </Modal>
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
           active:'',
           openCard:false,
           Asistentes:[],
           };

       }

       Eliminate=()=>{
         var self=this;
         console.log(this.props);
         axios.post(Direccion+`/EliminateEvent`,{userId:firebase.auth().currentUser.uid,eventoId:this.props.it.key})
           .then(res => {
             if (res.data) {
               this.props.callbackGetEventos(true);
             }

         })
       }

       componentWillMount(){
         let eventoId = this.props.it.key;
         let FounderId = this.props.it.Fundador;
         axios.post(Direccion+`/ConsultarAsistentes`,{eventInfo:eventoId,FounderId:FounderId})
           .then(res => {
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
       render() {
         let users="";
         let moreUser="";

         if (this.state.Asistentes) {
           users = this.state.Asistentes.length-2;
           moreUser = users>0?users:'';

         }
         console.log(this.props.it.Image);

         return (
           <LinearGradient
                colors={['#A771FF', '#F4AC86']}
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
                             <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'black', paddingBottom: 10}}>{this.props.it.Descripcion}</Text>
                             <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'black'}}> {this.props.it.Fecha} </Text>
                             <Text style={{fontSize: 12,marginLeft:3, fontWeight: '500', color: 'black'}}>Creado por : {this.props.it.userName} </Text>

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

                    </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableOpacity
                  style={CardStyles.btnCancelCard}
                  onPress={this.Eliminate}
                  >
                  <Text style={CardStyles.textButton}>Eliminar</Text>
                </TouchableOpacity >

              </View>
               }

               </LinearGradient>
         )
     }
 }
 const CardStyles = StyleSheet.create({
   btnCancelCard:{
     width: WIDTH-60,
     height:45,
      borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
     backgroundColor:'#C24C3A',
     justifyContent:'center',
   },
   textButton:{
     color:'rgba(255,255,255,0.7)',
     fontSize:16,
     textAlign:'center',
   },
   container:{
     width:330,
   },
   Linearcontent:{
     flex: 1,
     marginTop:15,
     marginBottom:10,
     borderTopRightRadius:20,
     borderTopLeftRadius:20,
     borderBottomLeftRadius: 20,
     borderBottomRightRadius: 20,
     width:WIDTH-60,
   },
   backgroundModal:{
     flex:1,
     backgroundColor:'#F8E5E1',
     marginTop:HEIGHT/2,
     borderRadius: 20,
     alignItems:'center',
   },
   btnAceptarModal:{
     width: WIDTH-90,
     height:45,
     borderRadius: 25,
     backgroundColor:'#5CC27A',
     justifyContent:'center',
     marginBottom:5,
   },
   TimeContainer:{
     width: (WIDTH/2)-20,
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
