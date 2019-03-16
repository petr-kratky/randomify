// Import libs
import React, {Component} from 'react';
import Spotify from 'spotify-web-api-js';
import {Image, Linking, Text, View} from 'react-native';
import { AuthSession } from 'expo';
import { encode as btoa } from 'base-64'
import Card from './Card';
import CardSection from './CardSection';
import Button from './Button';
import RandomButton from './RandomButton';

const sp = new Spotify();

// Define a component
export default class AlbumDetail extends Component {
    constructor() {
        super();

        this.setState = this.setState.bind(this);
        this.fetchAlbum = this.fetchAlbum.bind(this);
        this.fetchArtist = this.fetchArtist.bind(this);
        this.getTokens = this.getTokens.bind(this);

        this.state = {
            tokens: {
                accessToken: 'no_access_token',
                refreshToken: 'no_refresh_token',
                expiresIn: 'no_expire_time'
            },
            album: {
                id: 'album_id',
                name: 'album_name',
                artist: 'artist_name',
                artistID: 'artist_id',
                image: 'image_URL',
                url: 'album_URL'
            },
            artist: {
                thumbnail: 'thumbnail_URL'
            }
        };
    }

    getAuthorizationCode = async () => {
        try {
            let result;
            const redirectUrl = 'https://auth.expo.io/@kratky.pete/randomify';
            const clientID = '8a352836ac464579ab2e790ee597a703';
            const scopes = 'user-modify-playback-state user-library-read';
            result = await AuthSession.startAsync({
              authUrl:
                'https://accounts.spotify.com/authorize' +
                '?response_type=code' +
                '&client_id=' +
                clientID +
                (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
                '&redirect_uri=' +
                encodeURIComponent(redirectUrl),
            });
            return result.params.code;
        } catch (err) {
            console.error(err);
        }
    };


    getTokens = async () => {
      try {
        const authorizationCode = await this.getAuthorizationCode();
        console.log('Authorization Code: ' + authorizationCode);

        const credentials = {
            clientId: '8a352836ac464579ab2e790ee597a703',
            clientSecret: 'ae0d353236ff4dd780b32670fb55f97a',
            redirectUri: 'https://auth.expo.io/@kratky.pete/randomify'
        };
        const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credsB64}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${
            credentials.redirectUri
          }`,
        });
        const responseJson = await response.json();

        const {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn,
        } = responseJson;

        console.log('Access Token: ' + accessToken);

        this.setState({tokens: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresIn: expiresIn
            }});

        console.log('tokens.accessToken: ' + this.state.tokens.accessToken)

      } catch (err) {
        console.error(err);
      }
    };


    // generate random number from 0 to maxNum
    randomNum(maxNum) {
        return Math.floor(Math.random() * maxNum);
    }

    // picks a random character from a-z/0-9 for api search query
    randomChar() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return chars.charAt(this.randomNum(chars.length));
    };


    fetchRandomAlbum = async() => {
        const offset = this.randomNum(10000);
        await sp.searchAlbums(this.randomChar(), {limit: 1, offset: offset, market: 'CZ'})
            .then((response) => {
                console.log('RandomAlbumID:' + response.albums.items[0].id);
                this.setState({ album: {
                    id: response.albums.items[0].id,
                    }
                })
            });
        };


    fetchAlbum = async() => {
        await sp.getAlbum(this.state.album.id)
            .then((response) => {
                this.setState({ album: {
                        name: response.name,
                        url: response.uri,
                        image: response.images[0].url,
                        artist: response.artists[0].name,
                        artistID: response.artists[0].id
                    }
                });
                console.log('artistID_getAlbum(): ' + this.state.album.artistID);
            });
    };

    fetchArtist() {
        console.log('artistID_fetchArtist(): ' + this.state.album.artistID);
        sp.getArtist(this.state.album.artistID)
            .then((response) => {
                this.setState({ artist: {
                        thumbnail: response.images[0].url
                    }
                });
            });
    }

    // load new random album onto screen
    refreshAlbum() {
        this.fetchRandomAlbum()
            .then(() => {
                this.fetchAlbum()
                    .then(() => {
                        this.fetchArtist()
                    })
            });
    }

    componentDidMount() {
        // request new access token upon app launch
        this.getTokens()
            .then(() => {
                // set access token for active spotify api session (active for 6 minutes)
                sp.setAccessToken(this.state.tokens.accessToken);
                // load first random album on app launch
                this.refreshAlbum();
            })
    }

    render() {
        const album = this.state.album;
        const artist = this.state.artist;

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
                                source={{ uri: artist.thumbnail }}
                            />
                        </View>
                        <View style={headerContentStyle}>
                            <Text style={headerTextStyle}>{album.name}</Text>
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
                        <Button whenPressed={() => {  }} >
                            debug button
                        </Button>
                    </CardSection>
                </Card>
                <View style={randomButtonStyle}>
                    <RandomButton
                        buttonText={'randomify'}
                        whenPressed={() => this.refreshAlbum()}
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
