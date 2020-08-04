import React, { useState } from 'react';
import styled from 'styled-components';
import { BasicContainer } from './Containers';
import { Text } from './Texts';
import { ReactComponent as Down } from '../Assets/img/down.svg'

const QAndABase = (props) => {
    console.log(props.active)
    return (
        <>
            <BasicContainer className={props.className} onClick={() => { props?.onClick && props.onClick() }}>
                <BasicContainer theme={{ cursor: "pointer", display: "block", width: "100%", borderBottom: "1px solid #964f19", tablet: { borderBottom: "1px solid #964f19" } }}>
                    <Text theme={{ cursor: "pointer", display: "block", fontWeight: 600, fontSize: "1.125rem", color: "#444", padding: "0.5rem 0 0.5rem 1.5rem" }}>
                        {props.title}
                        <Down style={{ cursor: "pointer", position: "absolute", right: "0.5rem", top: "1rem" }}></Down>
                    </Text>
                </BasicContainer>
                <BasicContainer className={`${props.active && "expand"}`}
                    theme={{
                        display: "block",
                        width: "100%",
                        maxHeight: "0rem",
                        transition: "max-height .3s ease-in-out",
                        overflowY: "hidden",
                    }}>
                    <Text theme={{
                        cursor: "pointer",
                        display: "block",
                        fontWeight: 600,
                        backgroundColor: "#f8f5f2",
                        fontSize: "1rem",
                        color: "#444",
                        borderBottom: "1px solid #964f19",
                        tablet: { borderBottom: "1px solid #964f19" },
                        padding: "1rem 1.5rem"
                    }}>
                        {props.content}
                    </Text>
                </BasicContainer>
            </BasicContainer>

        </>
    )
}

export const QAndA = styled(QAndABase).attrs((props) => ({}))`

.expand {
    max-height: 50rem;
}

`
