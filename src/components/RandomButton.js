// Import libs
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';


// Define a component
const RandomButton = ({ buttonText, whenPressed }) => {
    const { textStyle, viewStyle } = styles;
    
    return (
        <TouchableOpacity style={viewStyle} onPress={whenPressed}>
            <Text style={textStyle}>{buttonText.toUpperCase()}</Text>
        </TouchableOpacity>
    );
};

const styles = {
  textStyle: {
      // fontFamily: 'Aileron-Black',
      fontSize: 47,
      color: '#20C778',
      textShadowColor: '#fff',
      textShadowOffset: { width: 1.2, height: 1.2 },
      textShadowRadius: 2

  },
  viewStyle: {
      backgroundColor: '#232323',
      justifyContent: 'center',
      alignItems: 'center',
      height: 70,
      width: 341,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 1,
      elevation: 5,
      position: 'relative',
      borderRadius: 15,
  }
};

// Make the component available to other parts of app
export default RandomButton;

