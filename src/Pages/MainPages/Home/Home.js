import React, { useContext, useCallback, useState } from 'react';
import { Context } from '../../../Store/store'
import { BasicContainer, SubContainer, Container } from '../../../Components/Containers';
import { useHistory } from 'react-router-dom';
import { useWindowSize } from '../../../SelfHooks/useWindowSize'
import { ReactComponent as LogoDone } from '../../../Assets/img/done.svg'
import { ReactComponent as LogoFail } from '../../../Assets/img/fail.svg'
import { ReactComponent as LogoNew } from '../../../Assets/img/new.svg'
import { ReactComponent as LogoPercentage } from '../../../Assets/img/percentage.svg'
import { ReactComponent as LogoTotal } from '../../../Assets/img/total.svg'
import { EasyButton } from '../../../Components/Buttons';
import { Text } from '../../../Components/Texts'

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export const Home = (props) => {

    const { APIUrl, Theme } = useContext(Context);
    const { pages: { homePage: { home } } } = Theme;
    let history = useHistory();
    const [width] = useWindowSize();



    return (
        <>
            {/* 寬度大於等於768時渲染的組件 */}
            {width > 768 && <BasicContainer theme={home.basicContainer}>
                <Container theme={{ height: '100vh' }}>
                    <img src={'/b9965e9.jpg'} alt="Background" height='100%' />
                    <Container theme={{ position: 'absolute', left: '50%', top: '40%', direction: 'column', }}>
                        <Text
                            style={{ textShadow: '0 0 1px #964f18' }}
                            theme={{
                                color: "#964f18",
                                fontSize: "48px",
                                fontWeight: "900",
                                lineHeight: '56px',
                                display: 'block',
                                width: '50%'
                            }}>{`堅持做台灣最好的鞋子`}</Text>
                        <Text
                            style={{ whiteSpace: 'pre-wrap' }}
                            theme={{
                                color: "#444",
                                fontSize: "24px",
                                fontWeight: "500",
                                lineHeight: '38px',
                                display: 'block',
                                margin: '24px 0 40px 0',
                                width: '50%'
                            }}>{`全國首創「動態足壓量測」系統
結合工研院專利技術與物理治療師的專業判讀
打造每個人專屬的足部保養對策
`}</Text>
                        <EasyButton
                            text={"預約足測"}
                            onClick={() => { history.push("/Reservation") }}
                            theme={{
                                backgroundColor: "#964f19",
                                color: "#fff",
                                borderRadius: "4px",
                                textAlign: "center",
                                fontSize: "14px",
                                cursor: "pointer",
                                fontWeight: 400,
                                width: "166px",
                                height: "40px",
                                lineHeight: "40px",
                                //margin: "auto auto 12px",
                                hoverBackgroundColor: "#6d3f00",
                            }}></EasyButton>
                    </Container>
                </Container>
                <Container theme={{ height: '375px', alignItems: 'center', justify: 'center' }}>
                    <img src={'/fa88b20.png'} alt="Background" width='65%' />
                </Container>
                <Container theme={{ height: '796px' }}>
                    <video width="100%" height="644" autoPlay="autoPlay" muted="muted">
                        <source src={"/45b0847.mp4"} type="video/mp4" />
                    </video>
                </Container>

                <Carousel renderThumbs={() => null} statusFormatter={(current, total) => null} swipeable={true} emulateTouch={true} autoPlay infiniteLoop>
                    <Container theme={{ height: '375px', backgroundColor: '#ffe27a', alignItems: 'center', justify: 'center', direction: 'column' }}>
                        <span style={{ position: 'absolute', top: '50px', left: '23%', height: '275px', width: '263px', }}>
                            <img src="/2bd3573.png" width='100%' />
                        </span>
                        <Text
                            style={{ textShadow: '0 0 1px #e03d5a' }}
                            theme={{
                                color: "#e03d5a",
                                fontSize: "40px",
                                fontWeight: "900",
                                lineHeight: '47px',
                                display: 'block',
                                margin: '0 0 24px 0'
                            }}>什麼是足壓？</Text>
                        <Text
                            style={{ textShadow: '0 0 1px #444' }}
                            theme={{
                                color: "#444",
                                fontSize: "24px",
                                fontWeight: "900",
                                lineHeight: '36px',
                                display: 'block',
                                margin: '0 0 24px 0'
                            }}>站立時，雙腳承受全身重量所造成的足底壓力分佈狀況，即是足壓。</Text>
                    </Container>
                    <Container theme={{ height: '375px', backgroundColor: '#ffe27a', alignItems: 'center', justify: 'center', direction: 'column' }}>
                        <span style={{ position: 'absolute', top: '50px', left: '23%', height: '300px', width: '170px', }}>
                            <img src="/cf1af10.png" width='100%' />
                        </span>
                        <Text
                            style={{ textShadow: '0 0 1px #e03d5a' }}
                            theme={{
                                color: "#e03d5a",
                                fontSize: "40px",
                                fontWeight: "900",
                                lineHeight: '47px',
                                display: 'block',
                                margin: '0 0 24px 0'
                            }}>什麼是步態？</Text>
                        <Text
                            style={{ textShadow: '0 0 1px #444' }}
                            theme={{
                                color: "#444",
                                fontSize: "24px",
                                fontWeight: "900",
                                lineHeight: '36px',
                                display: 'block',
                                margin: '0 0 24px 0'
                            }}>行走時，身體重心交互偏移，造成的足部受力與翻扭狀況，即是步態。</Text>
                    </Container>
                    <Container theme={{ height: '375px', backgroundColor: '#ffe27a', alignItems: 'center', justify: 'center', direction: 'column' }}>
                        <span style={{ position: 'absolute', top: '50px', left: '23%', height: '275px', width: '263px', }}>
                            <img src="/2bd3573.png" width='100%' />
                        </span>
                        <Text
                            style={{ textShadow: '0 0 1px #e03d5a' }}
                            theme={{
                                color: "#e03d5a",
                                fontSize: "40px",
                                fontWeight: "900",
                                lineHeight: '47px',
                                display: 'block',
                                margin: '0 0 24px 0'
                            }}>什麼是足壓？</Text>
                        <Text
                            style={{ textShadow: '0 0 1px #444' }}
                            theme={{
                                color: "#444",
                                fontSize: "24px",
                                fontWeight: "900",
                                lineHeight: '36px',
                                display: 'block',
                                margin: '0 0 24px 0'
                            }}>站立時，雙腳承受全身重量所造成的足底壓力分佈狀況，即是足壓。</Text>
                    </Container>
                </Carousel>
                <Container theme={{ direction: 'row', padding: '80px 0 80px 0' }}>
                    <div style={{ display: 'flex', width: '50%', justifyContent: 'center', alignItems: 'center', }}>

                        <img src="/328b6ce.jpg" width='384px' />

                    </div>
                    <div style={{ width: '50%', maxWidth: '486px' }}>
                        <img src="/cal.png" width='100%' />
                    </div>
                </Container>

                <EasyButton
                    text={"預約足測"}
                    onClick={() => { history.push("/Reservation") }}
                    theme={{
                        backgroundColor: "#964f19",
                        color: "#fff",
                        borderRadius: "4px",
                        textAlign: "center",
                        fontSize: "14px",
                        cursor: "pointer",
                        fontWeight: 400,
                        width: "166px",
                        height: "40px",
                        lineHeight: "40px",
                        margin: "auto auto 12px",
                        hoverBackgroundColor: "#6d3f00",
                    }}></EasyButton>
                <div style={{ height: "1000rem" }}>
                    sdfsdf
                </div>
                大於等於768時渲染的組件

        </BasicContainer>
            }

            {/* 寬度小於768時渲染的組件 */}
            {
                width <= 768 && <BasicContainer theme={home.basicContainer}>
                    <video width="100%" height="644" autoPlay="autoPlay" muted="muted">
                        <source src={"/45b0847.mp4"} type="video/mp4" />
                    </video>
                    <div style={{ height: "1000rem" }}>
                        sdfsdf
                </div>
                小於768時渲染的組件1
            </BasicContainer>
            }

        </>
    )
}