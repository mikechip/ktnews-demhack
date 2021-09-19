import React from "react";
import {SafeAreaView, Text} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Card, CheckBox, Divider, Layout} from "@ui-kitten/components";
import {openLink} from "../../lib/Webview";

export const AgreementScreen = (props: any) => {
    const [checked, setChecked] = React.useState(false);

    const agree = async() => {
        if(checked) {
            await AsyncStorage.setItem('@agreement', '1');
            props?.agreed();
        }
    }

    return <SafeAreaView style={{flex: 1}}>
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Card>
                <CheckBox
                    checked={checked}
                    onChange={nextChecked => setChecked(nextChecked)}
                >
                    Согласен с пользовательским соглашением
                </CheckBox>

                {checked && <Button appearance='outline'  onPress={() => agree()} style={{margin: 10}}>
                    Продолжить
                </Button>}
            </Card>

            <Card style={{marginTop: 15}}>
                <Text onPress={() => openLink('https://cdn.ktnet.app/news_agreement.docx')}>Пользовательское соглашение</Text>
                <Divider style={{margin: 5}}/>
                <Text onPress={() => openLink('https://cdn.ktnet.app/news_policy.docx')}>Политика конфиденциальности</Text>
            </Card>
        </Layout>
    </SafeAreaView>;
}
