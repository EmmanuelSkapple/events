import React, { Component } from 'react';
import '../style/header.css';
import Icon from '@material-ui/core/Icon';
import {Link} from 'react-router-dom'

class Header extends Component{
  constructor (props) {
  super(props)
  this.state = {
    menuOpen: false
  }
  this.handleStateChange = this.handleStateChange.bind(this);


}

handleStateChange () {
  this.setState({menuOpen: !this.state.menuOpen})
}

handleItemClick () {
  this.setState({menuOpen: false})
}

  render(){

    const menuVis = this.state.menuOpen ? 'menuActive' : 'menu';
    const displayImg = this.state.menuOpen ? 'imgMenuActive' : 'imgMenu';
    const MenuButton = this.state.menuOpen ? 'MenuButtonActive' : 'MenuButton';
    const ContentMenu = this.state.menuOpen ? 'ContentMenuActive' : 'ContentMenu';
    const displayDatos = this.state.menuOpen ? 'DatosActive' : 'Datos';

  return (
    <div >

      <div style={{position:'relative'}}>

      <div>
        <video id="videoBG" autoPlay muted loop playsinline>
            <source src="../imagenes/kodika.mp4" type="video/mp4"/>
        </video>
        <div className="scroll-downs">
          <div className="mousey">
            <div className="scroller"></div>
          </div>
        </div>
      </div>

        <div onClick={this.handleStateChange} id={menuVis}>
          <img id={displayImg} src='../imagenes/insignia.png' />
          {this.state.menuOpen?
            <Icon onClick={this.handleStateChange} id={MenuButton}>add</Icon>

            :
            <Icon id='burger'onClick={this.handleStateChange} id={MenuButton}>dehaze</Icon>

          }
          <div id={ContentMenu}>
          <a onClick={() => this.handleItemClick()} id="home"  className="menu-item" href="/">Home</a>
          <a onClick={() => this.handleItemClick()} id="about" className="menu-item" href="#"> Nosotros</a>
          <a onClick={() => this.handleItemClick()} id="contact" className="menu-item" href="/work">Nuestro trabajo</a>

          </div>
          <div id={displayDatos}>
              <div className="box Ubicacion">
                <h5 style={{fontSize:'2vh',color:'#776C10',fontWeight:'100'}}>Ubicación</h5>
              <p>Zapopan, Jalisco, MX</p>
              </div>
              <div className="box Cotizaciones">
                <h5 style={{fontSize:'2vh',color:'#776C10',fontWeight:'100'}} >Contrátanos</h5>
                <p>contact@kodika.mx</p>
              </div>
              <div className="box Redes" >
                <h5 style={{fontSize:'2vh',color:'#776C10',fontWeight:'100'}}>Redes Sociales</h5>
                <p>Facebook</p>
                <p>Twitter</p>
                <p>Instagram</p>
                <p>Github</p>
                <p>Linkedin</p>
              </div>
              <div className="box Equipo">
                <h5 style={{fontSize:'2vh',color:'#776C10',fontWeight:'100'}}>Forma parte de nuestro equipo</h5>
                <p>hiring@kodika.mx </p>
              </div>
          </div>
        </div>
        <img src='../imagenes/logo1.png' id='logoPrincipal' style={{position:'relative'}}/>
      </div>


    </div>
  )};
}

export default Header;
