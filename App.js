import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AlbumDetail from './src/components/AlbumDetail';
import RandomButton from "./src/components/RandomButton";
import { Font, LinearGradient } from "expo";

export default class App extends Component {
    constructor() {
        super();

        this.state = {
            fontsLoaded: false
        }
    }

    /*
    @loadFonts:
        loads custom fonts via async call and re-renders screen
    */

    loadFonts = async() => {
        await Font.loadAsync({'aileron-heavy': require('./assets/fonts/Aileron-Heavy-webfont.ttf'),});
        this.setState({ fontsLoaded: true });
    };

    componentDidMount() {
        this.loadFonts();
    }

    render() {
        if(!this.state.fontsLoaded) {
            return (
                <View>
                    <Text>Loading fonts..</Text>
                </View>
            );
        }

        const {
            mainStyle,
            randomButtonTextStyle
        } = styles;

        return (
            <View style={mainStyle}>
                <LinearGradient
                    colors={['#444', '#393939', '#111']}
                    start={[0.4, 0.1]}
                    style={{flex: 1}}
                >
                <AlbumDetail ref={(AlbumDetail) => {this.AlbumDetail = AlbumDetail;} } />
                <RandomButton whenPressed={() => {this.AlbumDetail.refreshAlbum()}}>
                    <Text style={randomButtonTextStyle}>RANDOMIFY</Text>
                </RandomButton>
                </LinearGradient>
            </View>
        );
    }
}

const styles = {
    mainStyle: {
        flex: 1,
        backgroundColor: '#343434',
    },
    randomButtonTextStyle: {
        letterSpacing: 3,
        fontFamily: 'aileron-heavy',
        fontSize: 32,
        color: '#fff',
        // textShadowColor: '#fff',
        // textShadowOffset: { width: 1.2, height: 1.2 },
        // textShadowRadius: 2,
  },
};


