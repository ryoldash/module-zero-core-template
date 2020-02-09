import React from 'react'
import { StyleSheet, View, Dimensions, Text } from 'react-native'
import { NavigationStackProp } from 'react-navigation-stack'
import { LineChart } from 'react-native-chart-kit'
import { Icon } from 'native-base'
import { ScrollView } from 'react-native-gesture-handler'

export interface Props {
    navigation: NavigationStackProp
}

export interface State {}

export class Dasboard extends React.Component<Props, State> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.flexRow}>
                    <View style={[styles.card, styles.dasboardCardtask]}>
                        <View style={styles.flexRow}>
                            <Icon
                                type="AntDesign"
                                name="check"
                                style={{ color: 'white', marginRight: 5 }}
                            />
                            <Text style={styles.text}>New Task</Text>
                        </View>
                        <View style={styles.flexCenter}>
                            <Text style={styles.text}>125</Text>
                        </View>
                    </View>
                    <View style={[styles.card, styles.dasboardCardTicket]}>
                        <View style={styles.flexRow}>
                            <Icon
                                type="AntDesign"
                                name="question"
                                style={{ color: 'white', marginRight: 5 }}
                            />
                            <Text style={styles.text}>New Ticket</Text>
                        </View>
                        <View style={styles.flexCenter}>
                            <Text style={styles.text}>125</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.flexRow}>
                    <View style={[styles.card, styles.dasboardCardComment]}>
                        <View style={styles.flexRow}>
                            <Icon
                                type="AntDesign"
                                name="message1"
                                style={{ color: 'white', marginRight: 5 }}
                            />
                            <Text style={styles.text}>New Comments</Text>
                        </View>
                        <View style={styles.flexCenter}>
                            <Text style={styles.text}>125</Text>
                        </View>
                    </View>
                    <View style={[styles.card, styles.dasboardCardVisitor]}>
                        <View style={styles.flexRow}>
                            <Icon
                                type="AntDesign"
                                name="adduser"
                                style={{ color: 'white', marginRight: 5 }}
                            />
                            <Text style={styles.text}>New Visitors</Text>
                        </View>
                        <View style={styles.flexCenter}>
                            <Text style={styles.text}>125</Text>
                        </View>
                    </View>
                </View>
                <LineChart
                    data={{
                        labels: ['Page 1', 'Page 1', 'Page 3', 'Page 4', 'Page 5', 'Page 6'],
                        datasets: [
                            {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                ],
                            },
                            {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                ],
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width - 10} // from react-native
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix="k"
                    chartConfig={{
                        backgroundColor: '#A4FE82',
                        backgroundGradientFrom: '#ECECEC',
                        backgroundGradientTo: '#ECECEC',
                        color: (opacity = 1, index) => '#A6D9BA',
                        labelColor: (opacity = 1) => 'black',
                        style: {
                            borderRadius: 5,
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        marginHorizontal: 5,
                        borderRadius: 5,
                    }}
                />
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.card, styles.dasboardCardtask]} />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.card, styles.dasboardCardTicket]} />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.card, styles.dasboardCardComment]} />
                </View>
            </ScrollView>
        )
    }
}
const window = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 5,
        shadowColor: '#000',
        padding: 10,
        width: Math.round(window.width * window.scale),
        height: 80,
        marginTop: 5,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.0,
        elevation: 24,
        borderRadius: 6,
        justifyContent: 'center',
    },
    dasboardCardtask: {
        backgroundColor: '#e91e63',
        borderRadius: 5,
    },
    dasboardCardTicket: {
        backgroundColor: '#00bcd4',
        borderRadius: 5,
    },
    dasboardCardComment: {
        backgroundColor: '#8bc34a',
        borderRadius: 5,
    },
    dasboardCardVisitor: {
        backgroundColor: '#ff9800',
        borderRadius: 5,
    },
    dashboardCardCounter: {
        fontSize: 36,
        color: '#fff',
    },
    dashboardCardName: {
        fontSize: 18,
        color: '#fff',
        marginBottom: -5,
    },
    dashboardCardIcon: {
        fontSize: 48,
        color: '#fff',
    },
    dashboardBox: {
        marginTop: 16,
        backgroundColor: '#fff',
        minHeight: 240,
        borderRadius: 5,
    },
    dashboardCardTinyLine: {
        marginTop: 16,
        backgroundColor: '#e91e63',
        borderRadius: 5,
    },
    latestSocialTrendsList: {
        marginTop: 16,
        backgroundColor: '#00bcd4',
        borderRadius: 5,
    },
    answeredTickeds: {
        marginTop: 16,
        backgroundColor: '#009688',
        borderRadius: 5,
    },
    flexRow: {
        flexDirection: 'row',
    },
    flexCenter: {
        alignItems: 'center',
        flex: 1,
    },
    text: {
        color: 'white',
    },
})

export default Dasboard
