import React from 'react';
import {Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Drawer, Text, Divider, Toggle, Icon, ListItem, List} from '@ui-kitten/components';
import {NewsfeedScreen} from "./Screens/Newsfeed";
import {openLink} from "../lib/Webview";
import {useRecoilState} from "recoil";
import {disabledSourcesState, newsSourcesState} from "../lib/NewsSource";

const { Navigator, Screen } = createDrawerNavigator();

// @ts-ignore
const DrawerContent = ({ navigation, state }) => {
    const [sources] = useRecoilState(newsSourcesState);
    const [disabled, setDisabled] = useRecoilState(disabledSourcesState);

    // @ts-ignore
    const sourceItem = ({ item}) => (
        /**
         * Управление списком СМИ (включение-выключение)
         */
        <ListItem
            title={item.title}
        >
            <Toggle checked={disabled.indexOf(item.url) === -1} onChange={(e) => {
                let disabledNew = [...disabled];
                const idx = disabledNew.indexOf(item.url);

                if(e) {
                    disabledNew.splice(idx, 1);
                } else {
                    disabledNew.push(item.url);
                }

                setDisabled(disabledNew);
            }}>
                {item.title?.substr(0, 25)}
            </Toggle>
        </ListItem>
    );

    return <Drawer
        header={<React.Fragment>
            <Text style={styles.title} category='h6'
                  onPress={() => openLink('https://github.com/mikechip/ktnews-demhack')}>
                ktNews
            </Text>
            <Icon
                style={styles.icon} fill='#8F9BB3' name='github'
                onPress={() => openLink('https://github.com/mikechip/ktnews-demhack')}
            />
            <Divider/>
        </React.Fragment>}
    >
        {sources && <List
            data={sources} ItemSeparatorComponent={Divider} renderItem={sourceItem}
        />}
    </Drawer>
};

export const DrawerNavigator = () => (
    <Navigator
        drawerContent={props => <DrawerContent {...props}/>}
    >
        <Screen name='Новостная лента' component={NewsfeedScreen}/>
    </Navigator>
);

export const AppNavigator = () => (
    <NavigationContainer>
        <DrawerNavigator/>
    </NavigationContainer>
);

const styles = {
    title: {
        marginVertical: 15,
        marginHorizontal: 12,
        padding: 15
    },
    icon: {
        width: 32,
        height: 32,
        position: 'absolute',
        bottom: 10,
        right: 10
    }
};
