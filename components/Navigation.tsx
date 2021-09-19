import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Drawer, DrawerItem, Text, IndexPath, Avatar, Divider, Card, Icon } from '@ui-kitten/components';
import {NewsfeedScreen} from "./Screens/Newsfeed";

const { Navigator, Screen } = createDrawerNavigator();

// @ts-ignore
const DrawerContent = ({ navigation, state }) => (
    <Drawer
        header={<React.Fragment>
            <Text style={styles.title} category='h6'>UI Kitten</Text>
            <Divider/>
        </React.Fragment>}
        selectedIndex={new IndexPath(state.index)}
        onSelect={index => navigation.navigate(state.routeNames[index.row])}
    >
        <DrawerItem title='Лента новостей' />
    </Drawer>
);

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
    }
};
