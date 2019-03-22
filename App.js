import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AlbumDetail from './src/components/AlbumDetail';
import RandomButton from "./src/components/RandomButton";
import {AuthSession, Font, LinearGradient} from "expo";
import { encode as btoa } from 'base-64';

export default class App extends Component {
    constructor(props) {

        super(props);

        this.state = {
            fontsLoaded: false,
            login: false,
            tokens: {
                accessToken: 'no_access_token', // access token required by api calls
                refreshToken: 'no_refresh_token', // token to refresh (obtain new) access token wo user interference
                expiresIn: 'no_expire_time' // expiry time for the access token (6 minutes)
            }
        }
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
            const redirectUrl = AuthSession.getRedirectUrl();
            const clientID = '8a352836ac464579ab2e790ee597a703';
            const scopes = ''; //
            result = await AuthSession.startAsync({
                behavior: 'web',
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
            redirectUri: AuthSession.getRedirectUrl()
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

        this.setState({
            tokens: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                expiresIn: expiresIn
            }});


      } catch (err) {
        console.error(err);
      }
    };

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
        this.getTokens()
            .then(() => {
                this.setState({login: true});
            })
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
                <AlbumDetail
                    ref={(AlbumDetail) => {this.AlbumDetail = AlbumDetail;}}
                    accessToken={this.state.tokens.accessToken}
                />
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


