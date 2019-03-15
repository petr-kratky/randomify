// Import a lib to help create a component
import React, { Component } from 'react';
import { View } from 'react-native';
import AlbumDetail from './src/components/AlbumDetail';

// Create a component
export default class App extends Component {
    render() {
        return (
            <View style={styles.mainStyle}>
                <AlbumDetail />
            </View>
        );
    }
}

const styles = {
    mainStyle: {
        flex: 1,
        backgroundColor: '#30312e'
    },
};


