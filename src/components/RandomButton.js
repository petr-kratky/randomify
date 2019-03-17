import React from 'react';
import { TouchableOpacity } from 'react-native';

// standalone RandomButton component used to 'randomify' albums; implemented with <TouchableOpacity>

const RandomButton = ({ children, whenPressed }) => {
    const { viewStyle } = styles;
    
    return (
        <TouchableOpacity style={viewStyle} onPress={whenPressed}>
            {children}
        </TouchableOpacity>
    );
};

const styles = {

  viewStyle: {
      backgroundColor: '#18b856',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      height: 60,
      width: 325,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.5,
      elevation: 5,
      position: 'absolute',
      bottom: 20,
      borderRadius: 50,
      // borderWidth: 0.5,
      // borderColor: '#232323'
  }
};

export default RandomButton;

