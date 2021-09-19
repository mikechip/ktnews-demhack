import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, ImageBackground, Image, ViewProps, Alert} from 'react-native';
import {Button, Card, Divider, Layout, List, Spinner, Text} from '@ui-kitten/components';
import {fetchRSS, INewsItem, newsListState, sortNewsByDate} from "../../lib/News";
import {stripTags} from "../../lib/Format";
import {useRecoilState} from "recoil";
import {disabledSourcesState, newsSourcesState, parseAndAssignSources} from "../../lib/NewsSource";
import {openLink} from "../../lib/Webview";

export const NewsfeedScreen = () => {
    const [loaded, setLoaded] = useState(false);
    const [list, setList] = useRecoilState<Array<INewsItem>>(newsListState);
    const [sources, setSources] = useRecoilState(newsSourcesState);
    const [needUpdate, setNeedUpdate] = useState(false);
    const [disabled] = useRecoilState(disabledSourcesState);

    useEffect(() => {
        if(!sources?.length) {
            console.log('Sources not found, parsing');
            parseAndAssignSources().then(l => setSources(l));
        } else if(!list?.length) {
            console.log('Parsing news from ' + sources?.length + ' sources');

            Promise.all(sources.map((i) => {
                if(disabled?.indexOf(i.url) >= 0) {
                    return null;
                }

                return fetchRSS(i.rss).catch(e => {
                    Alert.alert(
                        "Невозможно прочитать '" + i.title + "'",
                        e.toString(),
                    );
                })
            }).filter(i => i !== null)).then((r) => {
                if(!r?.length) {
                    setLoaded(true);
                    return;
                }

                // @ts-ignore
                setList(sortNewsByDate(r.flat()));
                setNeedUpdate(false);
                setLoaded(true);
            });
        }
    }, [sources, list]);

    useEffect(() => {
        /**
         * Выводить плашку только если что-то поменялось уже после загрузки
         */
        if(disabled?.length && list?.length) {
            setNeedUpdate(true);
        }
    }, [disabled]);

    const renderItemHeader = (headerProps: ViewProps | undefined, info: any) => (
        <ImageBackground
            style={{ minHeight: 160, maxHeight: 250, width: '100%' }}
            source={{uri: info?.item?.image}} blurRadius={3}
        >
            <Text style={styles.coverText}>{info?.item?.title?.substr(0, 150)}</Text>
            <Text style={styles.coverDate}>{info?.item?.date?.toLocaleString()}</Text>
            <Image source={{uri: info?.item?.source?.image}} style={styles.coverIcon} />
        </ImageBackground>
    );

    /* const renderItemFooter = (footerProps, info) => (
        <Text {...footerProps}>
            ...
        </Text>
    ); */

    const renderItem = (info: any) => (
        <Card
            style={styles.item}
            status='basic' onPress={ () => openLink(info?.item?.url) }
            header={headerProps => renderItemHeader(headerProps, info)}
            /* footer={footerProps => renderItemFooter(footerProps, info)} */
        >
            <Text>
                {stripTags(info?.item?.desc || info?.item?.title).substr(0, 1000)}
            </Text>
        </Card>
    );

    return (
        <SafeAreaView style={{flex: 1}}>
            <Divider/>
            <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {(!loaded) && <Spinner size='giant'/>}
                {(loaded && !list.length) && <Text category='h3'>Новостей нет 😔</Text>}
                {(loaded && list.length > 0) && <React.Fragment>
                    {needUpdate && <Button appearance='outline' onPress={() => setList([])} style={{margin: 5}}>
                        Обновить список новостей
                    </Button>}

                    <List
                        contentContainerStyle={styles.contentContainer}
                        data={list} style={{width: '100%'}}
                        renderItem={renderItem}
                    />
                </React.Fragment>}
            </Layout>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    item: {
        marginVertical: 4
    },
    articleImage: {
        flex: 1,
        height: 170,
        width: '100%',
        marginVertical: -16,
        marginBottom: 0
    },
    coverText: {
        color: 'white',
        fontSize: 15,
        lineHeight: 22,
        fontWeight: 'bold',
        position: 'absolute',
        bottom: 25,
        width: '85%',
        left: 10,
        textShadowColor: '#585858',
        textShadowOffset: {width: 3, height: 3},
        textShadowRadius: 6,
    },
    coverDate: {
        color: "#B8B5B5",
        fontSize: 12,
        lineHeight: 25,
        textAlign: "center",
        position: 'absolute',
        bottom: 2,
        left: 10,
        borderStyle: 'solid'
    },
    coverIcon: {
        width: 30,
        height: 30,
        position: 'absolute',
        bottom: 4,
        right: 10,
        borderRadius: 5
    }
});
