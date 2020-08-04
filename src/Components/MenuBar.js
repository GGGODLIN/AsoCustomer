import React, { useContext, useState, useEffect } from 'react';
import { BasicContainer, Container, SubContainer } from './Containers';
import { Context } from '../Store/store'
import { Text } from './Texts';
import { Link, useLocation, useHistory } from 'react-router-dom';
import SortIcon from '@material-ui/icons/Sort';
import { navbarTitleMappingLogin, navbarTitleMappingUnLogin } from '../Mappings/Mappings';
import { MenuItemLink } from './MenuItemLinks';
import { EasyButtonPulse } from './Buttons';
import PersonIcon from '@material-ui/icons/Person';

import HomeIcon from '@material-ui/icons/Home';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AddIcon from '@material-ui/icons/Add';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import { getItemlocalStorage } from '../Handlers/LocalStorageHandler';

export const MenuBar = (props) => {
    //document.documentElement.clientWidth ,can by js controll responed
    const { Theme, setOpwnLoginCard } = useContext(Context);
    const { menuBar } = Theme;
    const [OpenMenu, setOpenMenu] = useState(false);
    let location = useLocation();
    let history = useHistory();

    return (
        <>
            {/* 大於768的側邊欄 */}
            {/* 超出大小設置沒做 */}
            <BasicContainer theme={menuBar.leftModeBasicContainer}>
                {/* 圖片 */}
                <Container theme={{ justify: "space-around" }}>
                    <SubContainer theme={{ height: "4.5rem" }}>
                        <BasicContainer theme={menuBar.leftModeImgContainer}>
                            <img onClick={() => { history.push("/") }} alt="sdf" width="200" style={{ userSelect: "none", cursor: "pointer" }} height="42.36" src={"/bdcb328.png"}></img>
                        </BasicContainer>
                        <MenuItemLink to={"/"} text={"　首頁　"} padding={"0 2.75rem 0"} top={"-1rem"} active={location.pathname === "/"}></MenuItemLink>
                        <MenuItemLink to={"/Locations"} text={"服務據點"} padding={"0 2.75rem 0 0"} top={"-1rem"} active={location.pathname === "/Locations"}></MenuItemLink>
                        <MenuItemLink to={"/Faq"} text={"常見問題"} padding={"0 2.75rem 0 0"} top={"-1rem"} active={location.pathname === "/Faq"}></MenuItemLink>
                    </SubContainer>
                    <SubContainer theme={{ height: "4.5rem" }}>
                        {getItemlocalStorage("Auth") ?
                            <MenuItemLink to={"/Profile"} text={"會員專區"} padding={"0 2.75rem 0 0"} top={"-.1rem"} active={location.pathname === "/Profile"}></MenuItemLink>
                            : <MenuItemLink to={"/"} onClick={() => { setOpwnLoginCard(true) }} text={"登入會員"} padding={"0 2.75rem 0 0"} top={"-.1rem"} active={location.pathname === "/Profile"}></MenuItemLink>
                        }
                        <EasyButtonPulse
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
                            }}></EasyButtonPulse>
                    </SubContainer>

                </Container>
                {/* 標題 */}
            </BasicContainer>

            {/* 小於768的頂部欄 */}
            <BasicContainer theme={menuBar.topModeTitleBasicContainer}>
                {/* 開關功能選單按鈕與顯示目前功能名稱 */}
                <Container theme={{ justify: "center" }}>
                    <Text theme={{ userSelect: "none", display: "inline-block", fontWeight: 600, fontSize: "1.25rem", height: "100%", lineHeight: "4.5rem" }}>
                        {getItemlocalStorage("Auth") ? navbarTitleMappingLogin[location.pathname] : navbarTitleMappingUnLogin[location.pathname]}
                    </Text>
                    <PersonIcon
                        onClick={() => { history.push("/Profile") }}
                        style={{
                            color: "#9a263c",
                            position: "absolute",
                            right: "21px",
                            top: "1.5rem",
                            cursor: "pointer"
                        }}></PersonIcon>
                </Container>
            </BasicContainer>
            <BasicContainer theme={menuBar.topModeBasicContainer}>
                {/* 開關功能選單按鈕與顯示目前功能名稱 */}
                <Container theme={{ padding: "0.5rem 0 0 0" }}>
                    <SubContainer theme={{ occupy: 0.5 }}></SubContainer>
                    <SubContainer theme={{ occupy: 2.2 }}>
                        <Link to={"/"} style={{ textDecoration: "none", display: "inline-block" }}>
                            <Text theme={{ userSelect: "none", display: "inline-block", height: "100%", cursor: "pointer" }}>
                                <HomeIcon style={{ userSelect: "none", color: `${location.pathname === "/" ? "#9b1847" : "#aaaaaa"}`, width: "100%", height: "1.7rem" }}></HomeIcon>
                                <Text theme={{
                                    userSelect: "none",
                                    display: "block",
                                    color: `${location.pathname === "/" ? "#9b1847" : "#aaaaaa"}`,
                                    fontSize: "0.625rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    textAlign: "center",
                                    top: "-0.5rem"
                                }}>首頁</Text>
                            </Text>
                        </Link>
                    </SubContainer>
                    <SubContainer theme={{ occupy: 2.2 }}>
                        <Link to={"/History"} style={{ textDecoration: "none", display: "inline-block" }}>
                            <Text theme={{ userSelect: "none", display: "inline-block", height: "100%", cursor: "pointer" }}>
                                <ListAltIcon style={{ userSelect: "none", color: `${location.pathname === "/History" ? "#9b1847" : "#aaaaaa"}`, width: "100%", height: "1.7rem" }}></ListAltIcon>
                                <Text theme={{
                                    userSelect: "none",
                                    display: "block",
                                    color: `${location.pathname === "/History" ? "#9b1847" : "#aaaaaa"}`,
                                    fontSize: "0.625rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    textAlign: "center",
                                    top: "-0.5rem"
                                }}>預約紀錄</Text>
                            </Text>
                        </Link>
                    </SubContainer>
                    <SubContainer theme={{ occupy: 2.2 }}>
                        <Container theme={{ justify: "center" }}>
                            <BasicContainer theme={{
                                position: "absolute", top: "-1.5rem",
                                boxShadow: "0px 2px 4px #00000029",
                                backgroundColor: "#fff",
                                width: "64px",
                                height: "64px",
                                borderRadius: "100%",
                                border: "1px solid #0000000a"
                            }}>
                                <Link to={"/Reservation"} style={{ textDecoration: "none", display: "inline-block" }}>
                                    <Text theme={{ userSelect: "none", display: "inline-block", height: "100%", cursor: "pointer" }}>
                                        <AddIcon style={{ userSelect: "none", color: `${location.pathname === "/Reservation" ? "#9b1847" : "#aaaaaa"}`, width: "100%", height: "2.5rem" }}></AddIcon>
                                        <Text theme={{
                                            userSelect: "none",
                                            display: "block",
                                            color: `${location.pathname === "/Reservation" ? "#9b1847" : "#aaaaaa"}`,
                                            fontSize: "0.625rem",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            textAlign: "center",
                                            top: "-0.5rem"
                                        }}>預約足測</Text>
                                    </Text>
                                </Link>
                            </BasicContainer>
                        </Container>
                    </SubContainer>
                    <SubContainer theme={{ occupy: 2.2 }}>
                        <Link to={"/Locations"} style={{ textDecoration: "none", display: "inline-block" }}>
                            <Text theme={{ userSelect: "none", display: "inline-block", height: "100%", cursor: "pointer" }}>
                                <LocationOnIcon style={{ userSelect: "none", color: `${location.pathname === "/Locations" ? "#9b1847" : "#aaaaaa"}`, width: "100%", height: "1.7rem" }}></LocationOnIcon>
                                <Text theme={{
                                    userSelect: "none",
                                    display: "block",
                                    color: `${location.pathname === "/Locations" ? "#9b1847" : "#aaaaaa"}`,
                                    fontSize: "0.625rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    textAlign: "center",
                                    top: "-0.5rem"
                                }}>服務據點</Text>
                            </Text>
                        </Link>
                    </SubContainer>
                    <SubContainer theme={{ occupy: 2.2 }}>
                        <Link to={"/Faq"} style={{ textDecoration: "none", display: "inline-block" }}>
                            <Text theme={{ userSelect: "none", display: "inline-block", height: "100%", cursor: "pointer" }}>
                                <QuestionAnswerIcon style={{ userSelect: "none", color: `${location.pathname === "/Faq" ? "#9b1847" : "#aaaaaa"}`, width: "100%", height: "1.7rem" }}></QuestionAnswerIcon>
                                <Text theme={{
                                    userSelect: "none",
                                    display: "block",
                                    color: `${location.pathname === "/Faq" ? "#9b1847" : "#aaaaaa"}`,
                                    fontSize: "0.625rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    textAlign: "center",
                                    top: "-0.5rem"
                                }}>常見問題</Text>
                            </Text>
                        </Link>
                    </SubContainer>
                    <SubContainer theme={{ occupy: 0.5 }}></SubContainer>
                </Container>
            </BasicContainer>
        </>
    )
}