import React, { useContext, useCallback, useState } from 'react';
import { Context } from '../../../Store/store'
import { BasicContainer, SubContainer, Container } from '../../../Components/Containers';
import { useHistory } from 'react-router-dom';
import { useWindowSize } from '../../../SelfHooks/useWindowSize'
import { QAndA } from '../../../Components/QAndA';
import { Text } from '../../../Components/Texts';
import { ReactComponent as FootQAndA } from '../../../Assets/img/footQAndA.svg'

export const Faq = (props) => {

    const { APIUrl, Theme } = useContext(Context);
    const { pages: { faqPage: { faq } } } = Theme;
    const [WhichOpen, setWhichOpen] = useState(``);
    let history = useHistory();
    const [width] = useWindowSize();

    return (
        <>
            {/* 寬度大於等於768時渲染的組件 */}
            {width > 768 && <BasicContainer theme={faq.basicContainer}>
                大於等於768時渲染的組件
                {/* 標題 (如果要調左右空白，自己加一個容器調Padding)*/}
                <BasicContainer theme={{ display: "block", margin: "0 0 0.875rem 0" }}>
                    <Text style={{ textShadow: "0px 0px 1px #964f19" }} theme={{ padding: "0 0 0 1.8rem", display: "inline-block", fontWeight: 800, fontSize: "1.5rem", color: "#964f19", backgroundColor: "#fcfdc6" }}>
                        <FootQAndA style={{ position: "absolute", left: "-0.1rem", top: "-0.4rem" }}></FootQAndA>
                    足部健康相關
                    </Text>
                </BasicContainer>
                <QAndA
                    title={"甚麼是足壓？"}
                    content={"雙腳承受全身重量所造成的足底壓力分佈狀況，即是足壓。一般的足壓分析可分為靜態與動態的壓力，靜態足壓是指站立時所造成的壓力，動態足壓，為走路或跑步時所呈現的壓力。"}
                    active={WhichOpen === "甚麼是足壓？"}
                    onClick={() => { setWhichOpen("甚麼是足壓？") }}></QAndA>
                <QAndA
                    title={"什麼是步態？重要嗎？"}
                    content={"行走時，身體重心交互偏移，造成的足部受力與翻扭狀況，即是步態。如果步態有問題，下肢關節會慢慢磨損，可能提早10-20年退化，比同年齡、同體型的人更早產生問題。好比輪胎跑20幾公里沒有異狀，若胎面方向不正確，1-2萬公里後，某些部位磨損會比較快，這時才要處理，已經太慢了。因此，步態分析和足壓如同血壓一樣，需要定期量測與紀錄，以利了解雙腳健康狀況。"}
                    active={WhichOpen === "什麼是步態？重要嗎？"}
                    onClick={() => { setWhichOpen("什麼是步態？重要嗎？") }}></QAndA>
                <QAndA
                    title={"什麼是足弓？對下肢關節有什麼影響呢？"}
                    content={"人體走路時，由腳掌的足弓來支撐與傳遞重量，如同彈簧一樣適度扭轉，並且保持平衡。足弓是由一系列骨頭形成如拱橋的形狀，走路時，足弓應維持正常弧度，是身體結構的根基。足弓若異常，如同「桌子缺了桌腳，整個桌面也跟著歪斜」，連帶影響上方膝關節、髖關節、骨盆，甚至脊椎。"}
                    active={WhichOpen === "什麼是足弓？對下肢關節有什麼影響呢？"}
                    onClick={() => { setWhichOpen("什麼是足弓？對下肢關節有什麼影響呢？") }}></QAndA>
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