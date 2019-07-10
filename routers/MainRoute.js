import React, { Component } from 'react'
import { Route, NativeRouter, Link, Redirect } from 'react-router-native'
import {ref,firebaseAuth} from '../cons.js'
import Login from '../components/Login.js'
import UserRoutes from './userRoute.js'
import { Text} from 'react-native';
import * as firebase from 'firebase';


function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login' , state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/user' />}
    />
  )
}

export default class MainRoute extends Component {
  state = {
    authed: false,
    loading: true,
  }
  componentDidMount () {

    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }
  componentWillUnmount () {
    this.removeListener()
  }
  render() {

    return this.state.loading === true ? <Text>Loading</Text> : (
          <NativeRouter>
                <PublicRoute authed={this.state.authed} path='/' component={Login} />
                <PrivateRoute authed={this.state.authed} path='/user' component={UserRoutes} />
        </NativeRouter>

    );
  }
}
