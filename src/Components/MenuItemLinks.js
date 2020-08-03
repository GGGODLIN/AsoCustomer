import React, { useState } from 'react';
import { BasicContainer } from './Containers';
import { Link } from 'react-router-dom';
import { Text } from './Texts';
import styled from 'styled-components';

const MenuItemLinkBase = (props) => {
    const [ClassRight, setClassRight] = useState(``);
    return (
        <>
            <BasicContainer className={props.className} onMouseOver={() => { setClassRight("right") }} onMouseOut={() => { setClassRight("") }} theme={{ display: "inline-block", top: props.top, padding: props.padding }}>
                <Link to={props.to ?? "#"} style={{ textDecoration: "none", display: "inline-block" }}>
                    <Text theme={{ userSelect: "none", display: "inline-block", height: "100%", cursor: "pointer" }}>
                        <Text theme={{
                            userSelect: "none",
                            display: "inline-block",
                            height: "100%",
                            lineHeight: "4.5rem",
                            color: "#444",
                            fontSize: "1rem",
                            fontWeight: 700,
                            cursor: "pointer"
                        }}>{props.text}</Text>
                    </Text>
                </Link>
                <BasicContainer
                    className={ClassRight}
                    theme={{
                        userSelect: "none",
                        width: "0%",
                        bottom: `calc( 0rem + ${props.active && "2px"} )`,
                        borderBottom: "2px solid #964f18",
                        borderImageSlice: 7,
                        transition: "all .15s",
                        height: "0rem",
                    }}></BasicContainer>
                <BasicContainer theme={{
                    userSelect: "none", width: "100%", bottom: "calc( 0rem + 2px )", borderBottom: `2px solid ${(!props.active ? "transparent" : "#964f18")}`, height: "0rem"
                }}></BasicContainer>
            </BasicContainer>
        </>
    )
}

export const MenuItemLink = styled(MenuItemLinkBase).attrs((props) => ({}))`

.right {
    width: 100%;
}
`
