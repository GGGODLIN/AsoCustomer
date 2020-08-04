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

export const Home = (props) => {

    const { APIUrl, Theme } = useContext(Context);
    const { pages: { homePage: { home } } } = Theme;
    let history = useHistory();
    const [width] = useWindowSize();

    return (
        <>
            {/* 寬度大於等於768時渲染的組件 */}
            {width > 768 && <BasicContainer theme={home.basicContainer}>
                <video width="100%" height="644" autoplay="autoplay" muted="muted">
                    <source src={"/45b0847.mp4"} type="video/mp4" />
                </video>
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
            {width <= 768 && <BasicContainer theme={home.basicContainer}>
                <video width="100%" height="644" autoplay="autoplay" muted="muted">
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