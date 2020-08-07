import React, { useContext, useCallback, useState } from 'react';
import { Context } from '../../../Store/store'
import { BasicContainer, SubContainer, Container } from '../../../Components/Containers';
import { useHistory, Redirect } from 'react-router-dom';
import { useWindowSize } from '../../../SelfHooks/useWindowSize'

export const Login = (props) => {

    const { APIUrl, Theme } = useContext(Context);
    const { pages: { loginPage: { login } } } = Theme;
    const [width] = useWindowSize();

    return (
        <>
            {width > 768 && <Redirect
                to={{
                    pathname: "/",
                }}
            />
            }
            {/* 寬度小於768時渲染的組件 */}
            {width <= 768 && <BasicContainer theme={login.basicContainer}>
                移動端登入畫面
            </BasicContainer>
            }

        </>
    )
}