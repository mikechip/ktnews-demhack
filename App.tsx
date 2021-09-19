import React, {useEffect} from 'react';
import {Alert, LogBox} from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import {AppNavigator} from "./components/Navigation";
import { ThemeContext } from './components/ThemeContext';
import {parseAndAssignSources} from "./lib/NewsSource";
import {RecoilRoot} from 'recoil';

LogBox.ignoreLogs(['Setting a timer']);

export default () => {
    useEffect(() => {
        parseAndAssignSources().then(r => console.log('Application ready')).catch(e => {
            Alert.alert(
                "Ошибка инициализации",
                e.toString(),
            );
        });
    }, []);

    const [theme, setTheme] = React.useState('light');

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    };

    return <>
        <IconRegistry icons={EvaIconsPack}/>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ApplicationProvider {...eva} theme={eva.light}>
                <RecoilRoot>
                    <AppNavigator/>
                </RecoilRoot>
            </ApplicationProvider>
        </ThemeContext.Provider>
    </>
};
