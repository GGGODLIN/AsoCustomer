import React, { useContext, useCallback, useState } from 'react';
import { Context } from '../../../Store/store'
import { BasicContainer, SubContainer, Container } from '../../../Components/Containers';
import { useHistory } from 'react-router-dom';
import { useWindowSize } from '../../../SelfHooks/useWindowSize'
import { QAndA } from '../../../Components/QAndA';
import { Text } from '../../../Components/Texts';
import { ReactComponent as FootQAndA } from '../../../Assets/img/footQAndA.svg'
import { PageSubTitle, PageSubTitleMobile } from '../../../Components/PageSubTitle';

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
                <PageSubTitle title='常見問題' text={{ userSelect: "none", color: "#444", fontSize: "1.75em", fontWeight: 'normal', padding: " 0.2rem 0 12px 0", }}
                    container={{
                        direction: "row",
                        justify: "space-between",
                        //padding: "0 40px 0 40px ",
                        width: '100%',
                        margin: '40px 0 24px 0',
                        //height: '3rem',
                    }} />

                {/* 標題 (如果要調左右空白，自己加一個容器調Padding)*/}
                <Container theme={{ margin: '0 0 40px 0' }}>
                    <BasicContainer theme={{ display: "block", margin: "0 0 0.875rem 0" }}>
                        <Text style={{ textShadow: "0px 0px 1px #964f19" }} theme={{ padding: "0 0 0 1.8rem", display: "inline-block", fontWeight: 800, fontSize: "1.5rem", color: "#964f19", backgroundColor: "#fcfdc6" }}>
                            <FootQAndA style={{ position: "absolute", left: "-0.1rem", top: "-0.4rem" }}></FootQAndA>
                    足部健康相關
                    </Text>
                    </BasicContainer>
                    <QAndA
                        title={"什麼是足壓？"}
                        content={"雙腳承受全身重量所造成的足底壓力分佈狀況，即是足壓。一般的足壓分析可分為靜態與動態的壓力，靜態足壓是指站立時所造成的壓力，動態足壓，為走路或跑步時所呈現的壓力。"}
                        active={WhichOpen === "什麼是足壓？"}
                        onClick={() => { setWhichOpen("什麼是足壓？") }}></QAndA>
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
                    <QAndA
                        title={"常見的異常步態有哪些？"}
                        content={"常見的異常步態，主要分為內偏步態和外偏步態兩種。走路時，足弓正常垮下0.4-0.6公分，一旦超過這個範圍，走路重心容易內偏（偏向腳大拇指側）；如果下陷量不足，甚至還變高，走路重心會呈現外偏（偏向小腳趾側）。根據阿瘦集團累積超過10萬筆的足測大數據統計，逾九成（90.9%）國人步態有問題，以內偏步態最普遍(佔52%)，其次是外偏(30.6%)。"}
                        active={WhichOpen === "常見的異常步態有哪些？"}
                        onClick={() => { setWhichOpen("常見的異常步態有哪些？") }}></QAndA>
                    <QAndA
                        title={"錯誤的步態會對身體造成什麼影響？"}
                        content={"步態內偏的人，足弓過度內旋，容易出現骨盆前頃，特徵有小腹過凸，腰椎前凸幅度過大，患者剛開始沒有立即症狀，漸漸會出現腰痠，走路耐力變差，下肢關節會慢慢出現症狀，甚至會有慢性腰痛的現象；外偏的步態，特徵是腳的剛性強，足弓無法像彈簧一樣壓縮，緩衝撞擊力道的能力較差，承受外界撞擊力變重。無論哪種異常步態，最後都可能引發關節提早退化，引發各種慢性疼痛的困擾，嚴重時甚至會危害身體健康。"}
                        active={WhichOpen === "錯誤的步態會對身體造成什麼影響？"}
                        onClick={() => { setWhichOpen("錯誤的步態會對身體造成什麼影響？") }}></QAndA>
                </Container>
                <Container theme={{ margin: '0 0 40px 0' }}>
                    <BasicContainer theme={{ display: "block", margin: "0 0 0.875rem 0" }}>
                        <Text style={{ textShadow: "0px 0px 1px #964f19" }} theme={{ padding: "0 0 0 1.8rem", display: "inline-block", fontWeight: 800, fontSize: "1.5rem", color: "#964f19", backgroundColor: "#fcfdc6" }}>
                            <FootQAndA style={{ position: "absolute", left: "-0.1rem", top: "-0.4rem" }}></FootQAndA>
                            足測服務相關
                    </Text>
                    </BasicContainer>
                    <QAndA
                        title={"為什麼要做動態足壓量測？"}
                        content={"雙腳是人類的第二顆心臟，同時也是支持全身的地基，足部結構的歪斜進一步還會導致腳踝、膝蓋、髖關節、骨盆甚至是脊椎的排列異常，使我們的關節承受不正常的壓力與磨損，而產生膝蓋疼痛、腰痠背痛的問題。然而，其實這些毛病可能是長期錯誤的步態累積所致，透過動態足壓量測能快速地篩檢出足部結構異常的族群及高風險族群，揪出錯誤步態行為，唯有知道自己真正的足健康狀態，才能找到最佳的預防及保養對策"}
                        active={WhichOpen === "為什麼要做動態足壓量測？"}
                        onClick={() => { setWhichOpen("為什麼要做動態足壓量測？") }}></QAndA>
                    <QAndA
                        title={"什麼動態足壓量測？"}
                        content={"阿瘦集團的動態足壓量測可以忠實紀錄腳在鞋子中的走動行為，並根據數據分析，了解自己真實的步態類型及足部狀況。整體流程約15分鐘，民眾先量腳型並依照穿鞋習慣、選擇適當測量鞋，在6公尺的步道來回行走，透過鞋中偵測器將收集的數據，上傳雲端進行分析，並給予「個人化」的鞋具或是步態調整的建議。"}
                        active={WhichOpen === "什麼動態足壓量測？"}
                        onClick={() => { setWhichOpen("什麼動態足壓量測？") }}></QAndA>
                </Container>
                <Container theme={{ margin: '0 0 40px 0' }}>
                    <BasicContainer theme={{ display: "block", margin: "0 0 0.875rem 0" }}>
                        <Text style={{ textShadow: "0px 0px 1px #964f19" }} theme={{ padding: "0 0 0 1.8rem", display: "inline-block", fontWeight: 800, fontSize: "1.5rem", color: "#964f19", backgroundColor: "#fcfdc6" }}>
                            <FootQAndA style={{ position: "absolute", left: "-0.1rem", top: "-0.4rem" }}></FootQAndA>
                            超正步鞋墊相關
                    </Text>
                    </BasicContainer>
                    <QAndA
                        title={"我需要穿矯正型鞋墊嗎？"}
                        content={"穿著合適之鞋墊可以提供足部所需的支撐力，防止足部翻轉與相關足部關節的蹋陷現象，而「矯正型鞋墊」就像眼鏡或牙套一樣，必須依照每個人的不同情況進行調整，所以才能發揮個別矯正的功效。可先到阿瘦集團全國門市進行動態足壓量測，由專業服務人員服務諮詢。若是屬於特殊的足部狀況，建議還是得由專科醫師或物理治療師評估、判斷治療或矯正的方式。"}
                        active={WhichOpen === "我需要穿矯正型鞋墊嗎？"}
                        onClick={() => { setWhichOpen("我需要穿矯正型鞋墊嗎？") }}></QAndA>
                    <QAndA
                        title={"矯正型鞋墊的適用對象"}
                        content={"以阿瘦集團「超正步鞋墊」為例，每片鞋墊皆由高密度支撐腳床搭配相對應的墊片組合而成，腳床環狀包覆、穩定步態，再搭配不同材質及形狀的墊片，強化不同區塊的支撐或減壓功能。動態足壓量測分析過步態類型，就能客製化適用的鞋墊，針對步態有問題或是想要改善腿型的人，會是不錯的選擇。"}
                        active={WhichOpen === "矯正型鞋墊的適用對象"}
                        onClick={() => { setWhichOpen("矯正型鞋墊的適用對象") }}></QAndA>
                    <QAndA
                        title={"請問配戴鞋墊一定要先經過測量嗎？"}
                        content={"與物理治療師團隊合作研發的超正步鞋墊，可依據自己的步態狀況調整、對應痛點，組合出最適合您足部狀況的鞋墊。建議在購買鞋墊前，先前往各門市進行免費的動態足壓量測，以科學化測量出自己的真實步態，才能掌握足部的健康狀況喔。"}
                        active={WhichOpen === "請問配戴鞋墊一定要先經過測量嗎？"}
                        onClick={() => { setWhichOpen("請問配戴鞋墊一定要先經過測量嗎？") }}></QAndA>
                </Container>
            </BasicContainer>
            }

            {/* 寬度小於768時渲染的組件 */}
            {width <= 768 && <BasicContainer theme={faq.basicContainer}>


                {/* 標題 (如果要調左右空白，自己加一個容器調Padding)*/}
                <Container theme={{ margin: '0 0 40px 0' }}>
                    <BasicContainer theme={{ display: "block", margin: "0 0 0.875rem 0" }}>
                        <Text style={{ textShadow: "0px 0px 1px #964f19" }} theme={{ padding: "0 0 0 1.8rem", display: "inline-block", fontWeight: 800, fontSize: "1.5rem", color: "#964f19", backgroundColor: "#fcfdc6" }}>
                            <FootQAndA style={{ position: "absolute", left: "-0.1rem", top: "-0.4rem" }}></FootQAndA>
                    足部健康相關
                    </Text>
                    </BasicContainer>
                    <QAndA
                        title={"什麼是足壓？"}
                        content={"雙腳承受全身重量所造成的足底壓力分佈狀況，即是足壓。一般的足壓分析可分為靜態與動態的壓力，靜態足壓是指站立時所造成的壓力，動態足壓，為走路或跑步時所呈現的壓力。"}
                        active={WhichOpen === "什麼是足壓？"}
                        onClick={() => { setWhichOpen("什麼是足壓？") }}></QAndA>
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
                    <QAndA
                        title={"常見的異常步態有哪些？"}
                        content={"常見的異常步態，主要分為內偏步態和外偏步態兩種。走路時，足弓正常垮下0.4-0.6公分，一旦超過這個範圍，走路重心容易內偏（偏向腳大拇指側）；如果下陷量不足，甚至還變高，走路重心會呈現外偏（偏向小腳趾側）。根據阿瘦集團累積超過10萬筆的足測大數據統計，逾九成（90.9%）國人步態有問題，以內偏步態最普遍(佔52%)，其次是外偏(30.6%)。"}
                        active={WhichOpen === "常見的異常步態有哪些？"}
                        onClick={() => { setWhichOpen("常見的異常步態有哪些？") }}></QAndA>
                    <QAndA
                        title={"錯誤的步態會對身體造成什麼影響？"}
                        content={"步態內偏的人，足弓過度內旋，容易出現骨盆前頃，特徵有小腹過凸，腰椎前凸幅度過大，患者剛開始沒有立即症狀，漸漸會出現腰痠，走路耐力變差，下肢關節會慢慢出現症狀，甚至會有慢性腰痛的現象；外偏的步態，特徵是腳的剛性強，足弓無法像彈簧一樣壓縮，緩衝撞擊力道的能力較差，承受外界撞擊力變重。無論哪種異常步態，最後都可能引發關節提早退化，引發各種慢性疼痛的困擾，嚴重時甚至會危害身體健康。"}
                        active={WhichOpen === "錯誤的步態會對身體造成什麼影響？"}
                        onClick={() => { setWhichOpen("錯誤的步態會對身體造成什麼影響？") }}></QAndA>
                </Container>
                <Container theme={{ margin: '0 0 40px 0' }}>
                    <BasicContainer theme={{ display: "block", margin: "0 0 0.875rem 0" }}>
                        <Text style={{ textShadow: "0px 0px 1px #964f19" }} theme={{ padding: "0 0 0 1.8rem", display: "inline-block", fontWeight: 800, fontSize: "1.5rem", color: "#964f19", backgroundColor: "#fcfdc6" }}>
                            <FootQAndA style={{ position: "absolute", left: "-0.1rem", top: "-0.4rem" }}></FootQAndA>
                            足測服務相關
                    </Text>
                    </BasicContainer>
                    <QAndA
                        title={"為什麼要做動態足壓量測？"}
                        content={"雙腳是人類的第二顆心臟，同時也是支持全身的地基，足部結構的歪斜進一步還會導致腳踝、膝蓋、髖關節、骨盆甚至是脊椎的排列異常，使我們的關節承受不正常的壓力與磨損，而產生膝蓋疼痛、腰痠背痛的問題。然而，其實這些毛病可能是長期錯誤的步態累積所致，透過動態足壓量測能快速地篩檢出足部結構異常的族群及高風險族群，揪出錯誤步態行為，唯有知道自己真正的足健康狀態，才能找到最佳的預防及保養對策"}
                        active={WhichOpen === "為什麼要做動態足壓量測？"}
                        onClick={() => { setWhichOpen("為什麼要做動態足壓量測？") }}></QAndA>
                    <QAndA
                        title={"什麼動態足壓量測？"}
                        content={"阿瘦集團的動態足壓量測可以忠實紀錄腳在鞋子中的走動行為，並根據數據分析，了解自己真實的步態類型及足部狀況。整體流程約15分鐘，民眾先量腳型並依照穿鞋習慣、選擇適當測量鞋，在6公尺的步道來回行走，透過鞋中偵測器將收集的數據，上傳雲端進行分析，並給予「個人化」的鞋具或是步態調整的建議。"}
                        active={WhichOpen === "什麼動態足壓量測？"}
                        onClick={() => { setWhichOpen("什麼動態足壓量測？") }}></QAndA>
                </Container>
                <Container theme={{ margin: '0 0 40px 0' }}>
                    <BasicContainer theme={{ display: "block", margin: "0 0 0.875rem 0" }}>
                        <Text style={{ textShadow: "0px 0px 1px #964f19" }} theme={{ padding: "0 0 0 1.8rem", display: "inline-block", fontWeight: 800, fontSize: "1.5rem", color: "#964f19", backgroundColor: "#fcfdc6" }}>
                            <FootQAndA style={{ position: "absolute", left: "-0.1rem", top: "-0.4rem" }}></FootQAndA>
                            超正步鞋墊相關
                    </Text>
                    </BasicContainer>
                    <QAndA
                        title={"我需要穿矯正型鞋墊嗎？"}
                        content={"穿著合適之鞋墊可以提供足部所需的支撐力，防止足部翻轉與相關足部關節的蹋陷現象，而「矯正型鞋墊」就像眼鏡或牙套一樣，必須依照每個人的不同情況進行調整，所以才能發揮個別矯正的功效。可先到阿瘦集團全國門市進行動態足壓量測，由專業服務人員服務諮詢。若是屬於特殊的足部狀況，建議還是得由專科醫師或物理治療師評估、判斷治療或矯正的方式。"}
                        active={WhichOpen === "我需要穿矯正型鞋墊嗎？"}
                        onClick={() => { setWhichOpen("我需要穿矯正型鞋墊嗎？") }}></QAndA>
                    <QAndA
                        title={"矯正型鞋墊的適用對象"}
                        content={"以阿瘦集團「超正步鞋墊」為例，每片鞋墊皆由高密度支撐腳床搭配相對應的墊片組合而成，腳床環狀包覆、穩定步態，再搭配不同材質及形狀的墊片，強化不同區塊的支撐或減壓功能。動態足壓量測分析過步態類型，就能客製化適用的鞋墊，針對步態有問題或是想要改善腿型的人，會是不錯的選擇。"}
                        active={WhichOpen === "矯正型鞋墊的適用對象"}
                        onClick={() => { setWhichOpen("矯正型鞋墊的適用對象") }}></QAndA>
                    <QAndA
                        title={"請問配戴鞋墊一定要先經過測量嗎？"}
                        content={"與物理治療師團隊合作研發的超正步鞋墊，可依據自己的步態狀況調整、對應痛點，組合出最適合您足部狀況的鞋墊。建議在購買鞋墊前，先前往各門市進行免費的動態足壓量測，以科學化測量出自己的真實步態，才能掌握足部的健康狀況喔。"}
                        active={WhichOpen === "請問配戴鞋墊一定要先經過測量嗎？"}
                        onClick={() => { setWhichOpen("請問配戴鞋墊一定要先經過測量嗎？") }}></QAndA>
                </Container>
            </BasicContainer>
            }

        </>
    )
}