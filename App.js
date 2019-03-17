import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AlbumDetail from './src/components/AlbumDetail';
import RandomButton from "./src/components/RandomButton";
import { Font } from "expo";

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
        await Font.loadAsync({'aileron-black': require('./assets/fonts/Aileron-Black-webfont.ttf'),});
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
                <AlbumDetail ref={(AlbumDetail) => {this.AlbumDetail = AlbumDetail;} } />
                <RandomButton whenPressed={() => {this.AlbumDetail.refreshAlbum()}}>
                    <Text style={randomButtonTextStyle}>RANDOMIFY</Text>
                </RandomButton>
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
        fontFamily: 'aileron-black',
        fontSize: 47,
        color: '#20C778',
        textShadowColor: '#fff',
        textShadowOffset: { width: 1.2, height: 1.2 },
        textShadowRadius: 2,
  },
};


