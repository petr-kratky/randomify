import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Font } from 'expo';

// reusable Button component using <TouchableOpacity>

const Button = ({ whenPressed, children }) => {
    const { buttonStyle, textStyle } = styles;

    return (
        <TouchableOpacity style={buttonStyle} onPress={whenPressed}>
            <Text style={textStyle}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

const styles = {
    buttonStyle: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: '#20C778',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#232323',
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 3
    },
    textStyle: {
        alignSelf: 'center',
        // fontFamily: 'Aileron-Bold',
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    }
};

export default Button;
