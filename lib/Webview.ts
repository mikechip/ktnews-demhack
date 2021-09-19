import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn';

export async function openLink(url: string) {
    try {
        const isAvailable = await InAppBrowser.isAvailable()

        if (isAvailable) {
            return InAppBrowser.open(url, {
                dismissButtonStyle: 'cancel',
                preferredBarTintColor: 'gray',
                preferredControlTintColor: 'white',
                showTitle: true,
                toolbarColor: '#A8B2F0',
                secondaryToolbarColor: 'black',
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: true,
            });
        } else { // noinspection ExceptionCaughtLocallyJS
            throw new Error('In-app WebView is not supported')
        }
    } catch (error) {
        console.warn(error);
        return Linking.openURL(url)
    }
}
