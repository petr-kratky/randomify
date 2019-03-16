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

const sp = new Spotify(); // create new spotify api session, later used to make calls

export default class AlbumDetail extends Component {
    constructor() {
        super();

        this.state = {
            tokens: {
                accessToken: 'no_access_token', // access token required by api calls
                refreshToken: 'no_refresh_token', // token to refresh (obtain new) access token wo user interference
                expiresIn: 'no_expire_time' // expiry time for the access token (6 minutes)
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

    /*
    @getAuthorizationCode:
        requests auth code from spotify api using application credentials
        launches auth session for the user to grant randomify access to their account
        returns @result.params.code (auth_code from the session)

        @redirectUrl: url where user will be redirected after session is complete
        @clientID: randomify application ID
        @scopes: list of rights the user grants to the app; none are required for search api endpoint
    */

    // TODO: securely store login credentials on backend and request them via API call

    getAuthorizationCode = async () => {
        try {
            let result;
            const redirectUrl = 'https://auth.expo.io/@kratky.pete/randomify';
            const clientID = '8a352836ac464579ab2e790ee597a703';
            const scopes = ''; //
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

    /*
    @getTokens:
        uses auth_code from @getAuthorizationCode() to request access_token required by api calls
        stores obtained tokens (access_token, refresh_token) and access token's expire time in 'tokens' state

        @authorizationCode: auth_code from auth session
        @credentials: randomify's application credentials
        @credsB64: base64-encoded string with credentials
        @responseJson: response from the request stored in .json format
    */

    // TODO: use refresh_token to obtain new access_token automatically once expired

    getTokens = async () => {
      try {
        const authorizationCode = await this.getAuthorizationCode();

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

        this.setState({tokens: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresIn: expiresIn
            }});

      } catch (err) {
        console.error(err);
      }
    };

    /*
    @randomNum:
        generate random number from 0 to maxNum
    */

    randomNum(maxNum) {
        return Math.floor(Math.random() * maxNum);
    }

    /*
    @randomChar:
        picks a random character from a-z/0-9 for spotify api search query
    */

    randomChar() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return chars.charAt(this.randomNum(chars.length));
    };

    /*
    @fetchRandomAlbum:
         fetches random album from spotify api
         generates random offset; spotify api will then return an album from search query based on that offset number
         fetches 1 album (limit: 1) from the search query of 10000 albums (offset: 0-10000))
         updates current state with new fetched album id
    */

    fetchRandomAlbum = async() => {
        const offset = this.randomNum(10000);
        await sp.searchAlbums(this.randomChar(), {limit: 1, offset: offset, market: 'CZ'})
            .then((response) => {
                this.setState({ album: {
                    id: response.albums.items[0].id,
                    }
                })
            });
        };

    /*
    @fetchAlbum:
        fetches details of previously obtained album from @fetchRandomAlbum()
        updates current state with the fetched details
    */

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
            });
    };

    /*
    @fetchArtist:
        fetches details about the album's artist
        requires @fetchAlbum() to first update current state with artistID
        then updates 'artist' state with artist thumbnail img url
    */

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

    /*
    @refreshAlbum:
        calls above-defined spotify api calls to generate a new random album onto screen
        also called by the 'RANDOMIFY' button
    */

    refreshAlbum() {
        this.fetchRandomAlbum()
            .then(() => {
                this.fetchAlbum()
                    .then(() => {
                        this.fetchArtist()
                    })
            });
    }

    /*
    @componentDidMount:
        requests access token for spotify api requests upon App launch via @getTokens()
        set access token for active spotify api session (active for 6 minutes)
        load first random album on app launch
    */

    componentDidMount() {
        this.getTokens()
            .then(() => {
                sp.setAccessToken(this.state.tokens.accessToken);
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
