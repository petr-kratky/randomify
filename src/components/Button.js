import React from 'react';
import { TouchableOpacity } from 'react-native';

// reusable Button component using <TouchableOpacity>

const Button = ({ whenPressed, children }) => {
    const { buttonStyle } = styles;

    return (
        <TouchableOpacity style={buttonStyle} onPress={whenPressed}>
            {children}
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
};

export default Button;
