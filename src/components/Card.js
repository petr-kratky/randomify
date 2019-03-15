// Import libs
import React from 'react';
import { View } from 'react-native';

// Define a component
const Card = (props) => {
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#222',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        backgroundColor: '#232323',
    }
};

// Make the component available to other parts of app
export default Card;
