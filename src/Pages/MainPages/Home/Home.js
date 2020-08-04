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

export const Home = (props) => {

    const { APIUrl, Theme } = useContext(Context);
    const { pages: { homePage: { home } } } = Theme;
    let history = useHistory();
    const [width] = useWindowSize();

    return (
        <>
            {/* 寬度大於等於768時渲染的組件 */}
            {width > 768 && <BasicContainer theme={home.basicContainer}>
                <div style={{ height: "1000rem" }}>
                    sdfsdf
                </div>
                大於等於768時渲染的組件
            </BasicContainer>
            }

            {/* 寬度小於768時渲染的組件 */}
            {width <= 768 && <BasicContainer theme={home.basicContainer}>
                <div style={{ height: "1000rem" }}>
                    sdfsdf
                </div>
                小於768時渲染的組件1
            </BasicContainer>
            }

        </>
    )
}