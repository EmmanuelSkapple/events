import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import {Link } from 'react-router-native'
const {width: WIDTH} = Dimensions.get('window');


export default class Tabs extends Component {
  constructor(props) {
      super(props);
      this.state = {
          activeTab:0,

      }
    }
    componentWillMount(){
      this.setState({
        activeTab:this.props.tabActive,
      })
    }

  render() {
    return (
      <View>
        <View style={styles.containerUp}/>
        <View>
        <TextInput
          style={styles.input}
          placeholder={'Buscar'}
          placeholderTextColor={'rgba(0,0,0,0.7)'}
        />
        <Icon name={'ios-search'} size={28} color={'rgba(0,0,0, 0.7)'}
          style={styles.icono}/>
        </View>

        <View style={styles.container}>
          <View style={styles.tabsContainer}>
            <Link to="/"
            style={[ styles.tabContainer,0 === this.state.activeTab ? styles.tabContainerActive : []]}
            >

                <Text style={styles.tabText}>
                  Home
                </Text>
            </Link>
              <Link to="/BuscarEventos"
              style={[ styles.tabContainer,1 === this.state.activeTab ? styles.tabContainerActive : []]}
              >

                <Text style={styles.tabText}>
                  Eventos
                </Text>
              </Link>
              <Link to="/MisEventos"
              style={[ styles.tabContainer,2 === this.state.activeTab ? styles.tabContainerActive : []]}
              >

                <Text style={styles.tabText}>
                  Mis Eventos
                </Text>
              </Link>
              <Link to="/Perfil"
              style={[ styles.tabContainer,3 === this.state.activeTab ? styles.tabContainerActive : []]}
              >

                <Text style={styles.tabText}>
                  Mi Perfil
                </Text>
              </Link>

          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerUp: {
    backgroundColor:'rgba(95,189,156,0.9)',
    width:WIDTH,
    height:25,

  },
  container: {
    backgroundColor:'rgba(98,193,160,0.55)',
    width:WIDTH,
    height:40,
    justifyContent:'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingTop: 0,
  },
  tabContainer: {
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',

    flex:1,
  },
  tabContainerActive: {
    borderBottomColor: 'rgba(79,151,126,0.9)',
  },
  tabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input:{
    width: WIDTH - 30,
    height:35,
    borderRadius:45,
    fontSize:16,
    marginLeft:10,
    paddingLeft:35,
    marginBottom:10,
    marginTop:10,
    backgroundColor:'rgba(255,255,255,0.55)',
    color: 'rgba(0,0,0,0.7)',
    borderWidth: 0.5,
   borderColor: '#d6d7da',
  },
  icono:{
    position:'absolute',
    top:12,
    right:35,
  },

});
