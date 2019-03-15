// Import libs
import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import { Text, View, Image, Linking } from 'react-native';
import { Font } from 'expo';
import Card from './Card';
import CardSection from './CardSection';
import Button from './Button';
import RandomButton from './RandomButton';

const spotifyWebAPI = new Spotify();


// Define a component
export default class AlbumDetail extends Component {
    constructor() {
        super();

        this.setState = this.setState.bind(this);
        this.fetchAlbum = this.fetchAlbum.bind(this);
        this.fetchArtist = this.fetchArtist.bind(this);

        this.state = {
/*            loggedIn: !!params.access_token,*/
            album: {
                name: '',
                artist: '',
                artistID: '',
                image: '',
                thumbnail: '',
                url: ''
            }
        };
    }

    componentDidMount() {
        this.fetchAlbum();
        this.fetchArtist();
    }

    fetchAlbum() {
        spotifyWebAPI.getAlbum('4ohPMPeZukCChC6xNJpeYx')
            .then((response) => {
                this.state.artistID = response.artists[0].id;
                this.setState({ album: {
                        name: response.name,
                        artist: response.artists[0].name,
                        image: response.images[0].url,
                        url: response.href
                    }
                });
            });
    }

    fetchArtist() {
        spotifyWebAPI.getArtist(this.state.album.artistID)
            .then((response) => {
                this.setState({ album: {
                        thumbnail: response.images[0].url
                    }
                });
            });
    }

    render() {
        const album = this.state.album;

        const {
            thumbnailStyle,
            headerContentStyle,
            thumbnailContainerStyle,
            headerTextStyle,
            imageStyle,
            artistTextStyle,
            randomButtonStyle
        } = styles;

        if (album == null) {
            return <View><Text>Loading...</Text></View>;
        }

        return (
            <View>
                <Card>
                    <CardSection>
                        <View style={thumbnailContainerStyle}>
                            <Image
                                style={thumbnailStyle}
                                source={{ uri: album.thumbnail }}
                            />
                        </View>
                        <View style={headerContentStyle}>
                            <Text style={headerTextStyle}>{album.name.toUpperCase()}</Text>
                            <Text style={artistTextStyle}>{album.artist}</Text>
                        </View>
                    </CardSection>
                    <CardSection>
                        <Image
                            style={imageStyle}
                            source={{ uri: album.image }}
                        />
                    </CardSection>
                    <CardSection>
                        <Button whenPressed={() => { Linking.openURL(album.url); }}>
                            Listen on Spotify
                        </Button>
                        <Button whenPressed={() => { Linking.openURL('http://3.17.71.163:8080/'); }}>
                            Login to Spotify
                        </Button>
                    </CardSection>
                </Card>
                <View style={randomButtonStyle}>
                    <RandomButton
                        buttonText={'randomify'}
                        whenPressed={() => this.fetchAlbum()}
                    />
                </View>
            </View>
        );
    }
}

const styles = {
    headerContentStyle: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    headerTextStyle: {
        fontSize: 18,
        // fontFamily: 'Aileron-SemiBold',
        color: '#fff',
    },
    artistTextStyle: {
        // fontFamily: 'Aileron-Light',
        color: '#fff'
    },
    thumbnailStyle: {
        height: 50,
        width: 50,
        borderRadius: 50
    },
    thumbnailContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 10,
        backgroundColor: '#232323'
    },
    imageStyle: {
        height: 320,
        flex: 1,
        width: null,
        borderRadius: 5
    },
    randomButtonStyle: {
        justifyContent: 'flex-end',
        alignSelf: 'center',
        marginTop: 37
    }
};
