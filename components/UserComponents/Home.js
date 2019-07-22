import React, {Component} from 'react';
import { StyleSheet, Text,TextInput,TouchableOpacity,Dimensions, View,Image,ImageBackground } from 'react-native';
import Tab from './Tab.js'
import axios from 'axios'
import * as firebase from 'firebase';
const {width: WIDTH,height: HEIGHT} = Dimensions.get('window')
const Direccion = 'https://server02.herokuapp.com';
import Icon from 'react-native-vector-icons/Ionicons'

export default class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {
          NotiCard:[],

      }
      this.GetNoti = this.GetNoti.bind(this);
  }
  componentWillMount(){
    this.GetNoti();
  }

  GetNoti=()=>{
    console.log(firebase.auth().currentUser.uid);
    var self=this;
    axios.post(Direccion+`/GetNotifiaciones`,{userId:firebase.auth().currentUser.uid})
      .then(res => {
        console.log("Tomando ;las notificaiones despues del axios");

        console.log(res.data);

        if (res.data) {
          self.setState({
            NotiCard:res.data,
          })
        }
        else {
          self.setState({
            NotiCard:[],
          })
        }
    })
  }



  render() {
    const NotiCard = this.state.NotiCard;
    return (
      <View  style={styles.container}>
      <Tab tabActive={0}/>
      {
        NotiCard.map((it,key)=>{
          return(<CardNotificacion callbackGetNotificaicones={this.GetNoti} key={key}  it={it}/>)
        })
      }

      </View>

    );
  }
}



class CardNotificacion extends Component {

   constructor(props) {
       super(props);
   }


   Eliminate=()=>{
     var self=this;
     console.log(this.props);
     axios.post(Direccion+`/EliminateNotifiaciones`,{userId:firebase.auth().currentUser.uid,NotificacionId:this.props.it.key})
       .then(res => {
         if (res.data) {
           this.props.callbackGetNotificaicones(true);
         }

     })
   }

   render() {

       return (
         <View style={[styles.cardContent,shadow]}>
           <Text onPress={this.Eliminate} style={{color: 'white',position:'absolute',right:3,top:3}}><Icon name='ios-close-circle-outline'
           style={{color:'rgba(197,126,252,0.9)',fontSize:30,}} /></Text>
           <View>
             <Image
               style={styles.NotiImage}
               source={{
                 uri: this.props.it.Image,
               }}
             />
             <View style={styles.textContent}>
               <Text styles={{marginLeft:10,marginBottom:5,fontSize: 34,fontWeight: '700'}}>{this.props.it.Type}</Text>
               <Text styles={{fontSize: 12,marginRight:10,fontWeight: '300'}}>{this.props.it.Descripcion}</Text>
               <Text styles={{fontSize: 12,marginRight:34,fontWeight: '300'}}>{this.props.it.NombreEvento}</Text>

             </View>
            </View>
        </View>

       )
   }
}
const shadow = {
  shadowColor: '#30C1DD',
  shadowRadius: 30,
  shadowOpacity: 0.6,
  elevation: 20,
  shadowOffset: {width: 10,height: 10}
}

const styles = StyleSheet.create({
  container:{
       width:WIDTH,
       height:HEIGHT,
       alignItems: 'center',
  },
  cardContent:{
    width:WIDTH-30,
    height:100,
    marginTop:15,
    marginBottom:15,
    backgroundColor:'rgba(96,174,110,0.9)',
    borderRadius:10,
  },
  NotiImage: {
    borderRadius: 60,
    height: 50,
    marginBottom: 10,
    width: 50,
    position:'absolute',
    left:20,
    top:20
  },
  textContent:{
    marginLeft:WIDTH/2-80,
    alignItems:'center',
    marginTop:15,
    marginRight:7,
  }
})
