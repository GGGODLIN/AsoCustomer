import React, { useContext, useCallback, useState } from 'react';
import { Context } from '../../../Store/store'
import { BasicContainer, SubContainer, Container } from '../../../Components/Containers';
import { useHistory } from 'react-router-dom';
import { useWindowSize } from '../../../SelfHooks/useWindowSize'

export const History = (props) => {

    const { APIUrl, Theme } = useContext(Context);
    const { pages: { historyPage: { history } } } = Theme;
    let historyRoute = useHistory(); // 因為頁面的 history 重複命名 所以這裡特別改用 historyRoute
    const [width] = useWindowSize();

    return (
        <>
            {/* 寬度大於等於768時渲染的組件 */}
            {width > 768 && <BasicContainer theme={history.basicContainer}>
                大於等於768時渲染的組件
            </BasicContainer>
            }

            {/* 寬度小於768時渲染的組件 */}
            {width <= 768 && <BasicContainer theme={history.basicContainer}>
                小於768時渲染的組件
            </BasicContainer>
            }

        </>
    )
}