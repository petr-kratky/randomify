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
      backgroundColor: '#232323',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      height: 70,
      width: 341,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 1,
      elevation: 5,
      position: 'absolute',
      bottom: 25,
      borderRadius: 50,
  }
};

export default RandomButton;

