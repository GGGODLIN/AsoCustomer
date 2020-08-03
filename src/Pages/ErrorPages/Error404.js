import React, { useContext } from 'react'
import { Context } from '../../Store/store'
import { BasicContainer } from '../../Components/Containers';
import { useHistory } from 'react-router-dom';
import { useWindowSize } from '../../SelfHooks/useWindowSize';

export const Error404 = (props) => {

    const { Theme } = useContext(Context);
    const { errorPages: { error404 } } = Theme;
    let history = useHistory();
    const [width] = useWindowSize();

    return (
        <>
            {/* 寬度大於等於768時渲染的組件 */}
            {width > 768 && <BasicContainer theme={error404.basicContainer}>
                大於等於768時渲染的組件
            </BasicContainer>
            }

            {/* 寬度小於768時渲染的組件 */}
            {width <= 768 && <BasicContainer theme={error404.basicContainer}>
                小於768時渲染的組件
            </BasicContainer>
            }

        </>
    )
}


