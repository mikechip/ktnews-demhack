import React, {useEffect, useState} from 'react';
import {Alert, LogBox} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import {AppNavigator} from "./components/Navigation";
import { ThemeContext } from './components/ThemeContext';
import {parseAndAssignSources} from "./lib/NewsSource";
import {RecoilRoot} from 'recoil';
import AppLoading from 'expo-app-loading';
import {AgreementScreen} from "./components/Screens/Agreement";

LogBox.ignoreLogs(['Setting a timer']);

export default () => {
    const [ready, setReady] = useState(false);
    const [agree, setAgree] = useState(false);

    useEffect(() => {
        parseAndAssignSources().then(() => {
            console.log('Application ready');
            setReady(true);
        }).catch(e => {
            Alert.alert(
                "Ошибка инициализации",
                e.toString(),
            );
        });

        AsyncStorage.getItem('@agreement').then(v => {
            if(Number(v) > 0) {
                setAgree(true);
            }
        });
    }, []);

    const [theme, setTheme] = React.useState('light');

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    };

    if(!ready) {
        return (
            <AppLoading />
        );
    }

    let mainPage;
    if(!agree) {
        mainPage = <AgreementScreen agreed={() => setAgree(true)}/>;
    } else {
        mainPage = <AppNavigator/>;
    }

    return <>
        <IconRegistry icons={EvaIconsPack}/>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ApplicationProvider {...eva} theme={eva.light}>
                <RecoilRoot>
                    {mainPage}
                </RecoilRoot>
            </ApplicationProvider>
        </ThemeContext.Provider>
    </>
};
