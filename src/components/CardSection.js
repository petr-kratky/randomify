import React from 'react';
import { View, Text } from 'react-native';

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
/*        borderBottomWidth: 1,*/
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
/*        borderColor: '#000',*/
        position: 'relative'
    }
};

export default CardSection;
