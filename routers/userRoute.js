import React, { Component } from 'react'
import { Route, NativeRouter, Link, Redirect } from 'react-router-native'
import Home from '../components/UserComponents/Home.js'
import Perfil from '../components/UserComponents/Perfil.js'
import BuscarEventos from '../components/UserComponents/Eventos.js'
import MisEventos from '../components/UserComponents/MisEventos.js'

import { Text,View } from 'react-native';



class UserSide extends Component{
  constructor(){
    super()

  }

  render(){
    return(
      <View>
          <NativeRouter>
              <Route exact path="/" component={Home}/>
              <Route path="/Perfil" component={Perfil}/>
              <Route path="/MisEventos" component={MisEventos}/>
              <Route path="/BuscarEventos" component={BuscarEventos}/>

          </NativeRouter>
      </View>
    )
  }
}

export default UserSide;
