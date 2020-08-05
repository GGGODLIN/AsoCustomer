import React, { useContext, useCallback, useState } from 'react';
import { Context } from '../../../Store/store'
import { BasicContainer, SubContainer, Container, ContainerScale } from '../../../Components/Containers';
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
                <Container theme={{ height: '100vh', overflowX: 'hidden', }}>
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
                <Container theme={{ backgroundColor: '#f2f6f9', height: '544px', alignItems: 'center', justify: 'center', direction: 'column' }}>
                    <Text
                        style={{ textShadow: '0 0 1px #444' }}
                        theme={{
                            color: "#444",
                            fontSize: "40px",
                            fontWeight: "900",
                            lineHeight: '47px',
                            display: 'block',

                        }}>專業檢測流程</Text>
                    <Text
                        //style={{ textShadow: '0 0 1px #444' }}
                        theme={{
                            color: "#555",
                            fontSize: "18px",
                            fontWeight: "500",
                            lineHeight: '24px',
                            display: 'block',
                            margin: '16px 0 0 0'
                        }}>與工研院專利技術合作</Text>
                    <Text
                        //style={{ textShadow: '0 0 1px #444' }}
                        theme={{
                            color: "#555",
                            fontSize: "18px",
                            fontWeight: "500",
                            lineHeight: '24px',
                            display: 'block',

                        }}>聘請專業物理治療師提供數據分析與建議</Text>
                    <Container theme={{ alignItems: 'center', justify: 'center', }}>
                        <ContainerScale theme={{ transition: 'all .3s', margin: '64px 110px 0 0', }}>
                            <img src="/17d0ecd.png" height='180px' alt="Background" />
                            <Text
                                style={{ whiteSpace: 'nowrap', textShadow: '0 0 1px #444' }}
                                theme={{
                                    position: 'absolute', margin: '100px 0 0 38px', color: "#444",
                                    fontSize: "20px",
                                    fontWeight: "500",
                                    lineHeight: '26px',

                                }}>
                                {`量測足三圍`}
                            </Text>
                            <Text
                                style={{ whiteSpace: 'nowrap', textShadow: '0 0 1px #444' }}
                                theme={{
                                    position: 'absolute', margin: '126px 0 0 38px', color: "#444",
                                    fontSize: "20px",
                                    fontWeight: "500",
                                    lineHeight: '26px',

                                }}>
                                {`總足長/內中足長/足寬`}
                            </Text>
                        </ContainerScale>
                        <ContainerScale theme={{ transition: 'all .3s', margin: '64px 110px 0 0', }}>
                            <img src="/9da42c4.png" height='180px' alt="Background" />
                            <Text
                                style={{ whiteSpace: 'nowrap', textShadow: '0 0 1px #444' }}
                                theme={{
                                    position: 'absolute', margin: '100px 0 0 38px', color: "#444",
                                    fontSize: "20px",
                                    fontWeight: "500",
                                    lineHeight: '26px',

                                }}>
                                {`穿上檢測專用鞋具`}
                            </Text>
                            <Text
                                style={{ whiteSpace: 'nowrap', textShadow: '0 0 1px #444' }}
                                theme={{
                                    position: 'absolute', margin: '126px 0 0 38px', color: "#444",
                                    fontSize: "20px",
                                    fontWeight: "500",
                                    lineHeight: '26px',

                                }}>
                                {`依量測師指示行走12公尺`}
                            </Text>
                        </ContainerScale>
                        <ContainerScale theme={{ transition: 'all .3s', margin: '64px 0px 0 0', }}>
                            <img src="/881b261.png" height='180px' alt="Background" />
                            <Text
                                style={{ whiteSpace: 'nowrap', textShadow: '0 0 1px #444' }}
                                theme={{
                                    position: 'absolute', margin: '100px 0 0 38px', color: "#444",
                                    fontSize: "20px",
                                    fontWeight: "500",
                                    lineHeight: '26px',

                                }}>
                                {`獨家APP演算法`}
                            </Text>
                            <Text
                                style={{ whiteSpace: 'nowrap', textShadow: '0 0 1px #444' }}
                                theme={{
                                    position: 'absolute', margin: '126px 0 0 38px', color: "#444",
                                    fontSize: "20px",
                                    fontWeight: "500",
                                    lineHeight: '26px',

                                }}>
                                {`5秒內完成分析判讀`}
                            </Text>
                        </ContainerScale>
                    </Container>
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
                <Container theme={{ height: '611px', alignItems: 'center', justify: 'center', direction: 'column' }}>
                    <Text
                        style={{ textShadow: '0 0 1px #444' }}
                        theme={{
                            color: "#444",
                            fontSize: "40px",
                            fontWeight: "900",
                            lineHeight: '47px',
                            display: 'block',

                        }}>輕鬆四步驟 · 健康有掌握</Text>
                    <Text
                        //style={{ textShadow: '0 0 1px #444' }}
                        theme={{
                            color: "#555",
                            fontSize: "18px",
                            fontWeight: "500",
                            lineHeight: '24px',
                            display: 'block',
                            margin: '16px 0 0 0'
                        }}>立即預約動態足壓量測，深入分析4大足部健康指標，打造個人專屬足部保養對策。</Text>
                    <Text
                        //style={{ textShadow: '0 0 1px #444' }}
                        theme={{
                            color: "#555",
                            fontSize: "18px",
                            fontWeight: "500",
                            lineHeight: '24px',
                            display: 'block',

                        }}>各門市開放每日十位預約體驗名額，可免費享有動態足壓量測</Text>
                    <Container theme={{ alignItems: 'center', }}>
                        <div style={{ margin: '0 5% 0 10%', width: '10%', padding: '1.25%' }}>
                            <img src="/3078658.png" width='100%' alt="Background" />
                        </div>
                        <div style={{ margin: '0 5% 0 5%', width: '10%', padding: '1.25%' }}>
                            <img src="/3078658.png" width='100%' alt="Background" />
                        </div>
                        <div style={{ margin: '0 5% 0 5%', width: '10%', padding: '1.25%' }}>
                            <img src="/3078658.png" width='100%' alt="Background" />
                        </div>
                        <div style={{ margin: '0 10% 0 5%', width: '10%', padding: '1.25%' }}>
                            <img src="/3078658.png" width='100%' alt="Background" />
                        </div>
                    </Container>
                    <Container theme={{ alignItems: 'center', margin: '20px 0 20px 0' }}>
                        <Text
                            //style={{ textShadow: '0 0 1px #444' }}
                            theme={{
                                color: "#49589b",
                                fontSize: "28px",
                                fontWeight: "700",
                                lineHeight: '24px',
                                textAlign: 'center',
                                margin: '0 0 0 10%',
                                width: '12.5%'
                            }}>預約</Text>
                        <Text
                            style={{ borderBottom: '0.5px solid #49589b', }}
                            theme={{
                                color: "#49589b",
                                fontSize: "28px",
                                fontWeight: "700",
                                lineHeight: '24px',
                                textAlign: 'center',
                                //margin: '0 5% 0 10%',
                                width: '10%',
                                //borderBottom: '10px solid #49589b',
                            }}> </Text>
                        <Text
                            //style={{ textShadow: '0 0 1px #444' }}
                            theme={{
                                color: "#49589b",
                                fontSize: "28px",
                                fontWeight: "700",
                                lineHeight: '24px',
                                textAlign: 'center',
                                //margin: '0 5% 0 0',
                                width: '12.5%'
                            }}>預約</Text>
                        <Text
                            style={{ borderBottom: '0.5px solid #49589b', }}
                            theme={{
                                color: "#49589b",
                                fontSize: "28px",
                                fontWeight: "700",
                                lineHeight: '24px',
                                textAlign: 'center',
                                //margin: '0 5% 0 10%',
                                width: '10%',
                                //borderBottom: '10px solid #49589b',
                            }}> </Text>
                        <Text
                            //style={{ textShadow: '0 0 1px #444' }}
                            theme={{
                                color: "#49589b",
                                fontSize: "28px",
                                fontWeight: "700",
                                lineHeight: '24px',
                                textAlign: 'center',
                                //margin: '0 5% 0 5%',
                                width: '12.5%'
                            }}>預約</Text>
                        <Text
                            style={{ borderBottom: '0.5px solid #49589b', }}
                            theme={{
                                color: "#49589b",
                                fontSize: "28px",
                                fontWeight: "700",
                                lineHeight: '24px',
                                textAlign: 'center',
                                //margin: '0 5% 0 10%',
                                width: '10%',
                                //borderBottom: '10px solid #49589b',
                            }}> </Text>
                        <Text
                            //style={{ textShadow: '0 0 1px #444' }}
                            theme={{
                                color: "#49589b",
                                fontSize: "28px",
                                fontWeight: "700",
                                lineHeight: '24px',
                                textAlign: 'center',
                                margin: '0 10% 0 0',
                                width: '12.5%'
                            }}>預約</Text>
                    </Container>
                    <Container theme={{ alignItems: 'center' }}>
                        <Text
                            //style={{ textShadow: '0 0 1px #444' }}
                            theme={{
                                color: "#49589b",
                                fontSize: "18px",
                                fontWeight: "600",
                                lineHeight: '24px',
                                textAlign: 'center',
                                margin: '0 0 0 5%',
                                width: '22.5%'
                            }}>致電至您方便的門市進行預約</Text>
                        <Text
                            //style={{ textShadow: '0 0 1px #444' }}
                            theme={{
                                color: "#49589b",
                                fontSize: "18px",
                                fontWeight: "600",
                                lineHeight: '24px',
                                textAlign: 'center',
                                //margin: '0 5% 0 0',
                                width: '22.5%'
                            }}>依預約時間前往體驗動態足壓量測</Text>
                        <Text
                            //style={{ textShadow: '0 0 1px #444' }}
                            theme={{
                                color: "#49589b",
                                fontSize: "18px",
                                fontWeight: "600",
                                lineHeight: '24px',
                                textAlign: 'center',
                                //margin: '0 5% 0 0',
                                width: '22.5%'
                            }}>阿瘦專業服務人員協助報告解讀、健康對策推薦</Text>
                        <Text
                            //style={{ textShadow: '0 0 1px #444' }}
                            theme={{
                                color: "#49589b",
                                fontSize: "18px",
                                fontWeight: "600",
                                lineHeight: '24px',
                                textAlign: 'center',
                                margin: '0 5% 0 0',
                                width: '22.5%'
                            }}>半年後回店追蹤足部壓力狀況，保持健康好腳力</Text>

                    </Container>
                </Container>
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