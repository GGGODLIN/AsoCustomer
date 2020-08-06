import React, { useContext, useCallback, useState } from 'react';
import { Context } from '../../../Store/store'
import { BasicContainer, SubContainer, Container } from '../../../Components/Containers';
import { useHistory } from 'react-router-dom';
import { useWindowSize } from '../../../SelfHooks/useWindowSize'
import { EasyButton } from '../../../Components/Buttons';
import { portalService } from '../../../Components/Portal';
import { clearlocalStorage } from '../../../Handlers/LocalStorageHandler';
import { Text } from '../../../Components/Texts';

export const Profile = (props) => {

    const { APIUrl, Theme } = useContext(Context);
    const { pages: { profilePage: { profile } } } = Theme;
    let history = useHistory();
    const [width] = useWindowSize();

    return (
        <>
            {/* 寬度大於等於768時渲染的組件 */}
            {width > 768 && <BasicContainer theme={profile.basicContainer}>
                <Container>
                    <SubContainer theme={{ occupy: 4 }}>
                        <BasicContainer >
                            <img src="/Group.svg" height='180px' alt="Background" />
                        </BasicContainer>
                        <BasicContainer >
                            <Text theme={profile.textSmallTitle} >登入帳號</Text>
                            <Text>123</Text>
                        </BasicContainer>
                        <EasyButton theme={{
                            backgroundColor: "#fff",
                            display: "inline-block",
                            width: "3.5rem",
                            height: "2rem",
                            lineHeight: "2rem",
                            color: "#d25959",
                            border: "1px solid #d25959",
                            borderRadius: "1.25rem",
                            textAlign: "center",
                            hoverBackgroundColor: "#d25959",
                            hoverColor: "#fff",
                            fontSize: "0.875rem",
                            cursor: "pointer",
                        }} text={"登出"} onClick={() => {
                            portalService.warn({
                                autoClose: false,
                                yes: () => { clearlocalStorage(); history.push("/"); },
                                yesText: "確定登出",
                                noText: "取消，繼續瀏覽",
                                content: (
                                    <>
                                        <Text theme={{
                                            display: "block",
                                            textAlign: "center",
                                            color: "#595959",
                                            fontSize: "1.5rem",
                                            fontWeight: 600
                                        }}>
                                            {`確定要登出嗎?`}
                                        </Text>
                                        <Text theme={{
                                            display: "block",
                                            textAlign: "center",
                                            color: "#545454",
                                            fontSize: "1.125rem",
                                            fontWeight: 600
                                        }}>
                                            {`登出後將自動跳轉至首頁`}
                                        </Text>
                                    </>)
                            })
                        }} />
                    </SubContainer>
                    <SubContainer theme={{ occupy: 8 }}>
                        123
                </SubContainer>
                </Container>
            </BasicContainer>
            }

            {/* 寬度小於768時渲染的組件 */}
            {width <= 768 && <BasicContainer theme={profile.basicContainer}>
                小於768時渲染的組件
                <EasyButton theme={{
                    backgroundColor: "#fff",
                    display: "inline-block",
                    width: "3.5rem",
                    height: "2rem",
                    lineHeight: "2rem",
                    color: "#d25959",
                    border: "1px solid #d25959",
                    borderRadius: "1.25rem",
                    textAlign: "center",
                    hoverBackgroundColor: "#d25959",
                    hoverColor: "#fff",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                }} text={"登出"} onClick={() => {
                    portalService.warn({
                        autoClose: false,
                        yes: () => { clearlocalStorage(); history.push("/"); },
                        yesText: "確定登出",
                        noText: "取消，繼續瀏覽",
                        content: (
                            <>
                                <Text theme={{
                                    display: "block",
                                    textAlign: "center",
                                    color: "#595959",
                                    fontSize: "1.5rem",
                                    fontWeight: 600
                                }}>
                                    {`確定要登出嗎?`}
                                </Text>
                                <Text theme={{
                                    display: "block",
                                    textAlign: "center",
                                    color: "#545454",
                                    fontSize: "1.125rem",
                                    fontWeight: 600
                                }}>
                                    {`登出後將自動跳轉至首頁`}
                                </Text>
                            </>)
                    })
                }} />
            </BasicContainer>
            }

        </>
    )
}