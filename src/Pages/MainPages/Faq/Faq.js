import React, { useContext, useCallback, useState } from 'react';
import { Context } from '../../../Store/store'
import { BasicContainer, SubContainer, Container } from '../../../Components/Containers';
import { useHistory } from 'react-router-dom';
import { useWindowSize } from '../../../SelfHooks/useWindowSize'

export const Faq = (props) => {

    const { APIUrl, Theme } = useContext(Context);
    const { pages: { faqPage: { faq } } } = Theme;
    let history = useHistory();
    const [width] = useWindowSize(); 

    return (
        <>
            {/* 寬度大於等於768時渲染的組件 */}
            {width > 768 && <BasicContainer theme={faq.basicContainer}>
                大於等於768時渲染的組件
            </BasicContainer>
            }

            {/* 寬度小於768時渲染的組件 */}
            {width <= 768 && <BasicContainer theme={faq.basicContainer}>
                小於768時渲染的組件
            </BasicContainer>
            }

        </>
    )
}