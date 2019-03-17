import React from 'react';
import { View } from 'react-native';

// reusable CardSection component used for displaying specific album details

const CardSection = (props) => {
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        position: 'relative'
    }
};

export default CardSection;
