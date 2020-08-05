import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Context } from '../Store/store'
import { Container, BasicContainer, SubContainer } from './Containers';
import { Text } from './Texts';
import { EasyButton } from './Buttons';
import { FormControl, FormRow, FormCardTextInput, FormCardSelector, CheckboxWhatever } from './Forms';
import { useForm, useSelector } from '../SelfHooks/useForm';
import { setItemlocalStorage, getItemlocalStorage, clearlocalStorage } from '../Handlers/LocalStorageHandler';
import { useLoginAsync } from '../SelfHooks/useAsync';
import { portalService } from './Portal'
import { YearFrom1930to, getDayByYearAndMonth, month } from '../Mappings/Mappings';
import { useHistory } from 'react-router-dom';

//#region 表單卡片基底
const LoginCardBase = (props) => {

    const { APIUrl, Theme, Switch } = useContext(Context);
    const { loginCard } = Theme;
    const [IsLogin, setIsLogin] = useState("");
    let history = useHistory();


    const [Account, Accounthandler, AccountregExpResult, AccountResetValue] = useForm("", ["^.{1,}$", "^[0-9]{1,}$", "^.{1,999}$"], ["請輸入工號", "工號限使用數字", "最長為999個數字"]); //足健師工號欄位
    const [Pass, Passhandler, PassregExpResult, PassResetValue] = useForm("", ["^.{1,}$", "^[0-9]{1,}$", "^.{1,999}$"], ["請輸入工號", "工號限使用數字", "最長為999個數字"]); //足健師工號欄位
    const [BirthYear, BirthYearhandler, BirthYearregExpResult, BirthYearResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇生日西元年"]); // 生日西元年欄位
    const [BirthMonth, BirthMonthhandler, BirthMonthregExpResult, BirthMonthResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇生日月份"]);// 生日月份欄位
    const [BirthDay, BirthDayhandler, BirthDayregExpResult, BirthDayResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇生日日期"]); // 生日日期欄位
    const [Agreement, setAgreement] = useState(false); // 同意條款
    //#region 登入 API
    const loginVerification = useCallback(async (account, pass) => {
        //let uid = "";
        await fetch(`${APIUrl}api/Login/CustomerLogin?acc=${account}&pwd=${pass}`,
            {
                method: "POST",
                body: JSON.stringify({
                    acc: account,
                    pwd: pass
                })
            })//取得Token
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                if (PreResult.success) {
                    //setItemlocalStorage("Auth", PreResult.token);
                    // portalService.success({
                    //     autoClose: false,
                    //     removeYesButton: true,
                    //     removeNoButton: true,
                    //     content: (
                    //         <>
                    //             <Text theme={loginCard.exportText}>
                    //                 登入成功
                    //             </Text>
                    //         </>)
                    // })
                } else {
                    //console.log(PreResult)
                    if (PreResult?.msg) {
                        //setMessage(PreResult.message);
                        portalService.error({
                            autoClose: false,
                            removeYesButton: true,
                            removeNoButton: true,
                            content: (
                                <>
                                    <Text theme={loginCard.exportText}>
                                        {PreResult.msg}
                                    </Text>
                                </>)
                        })
                    }
                    throw new Error("使用者資訊錯誤");
                }
            })
            .catch((Error) => {
                throw Error;
            })
            .finally(() => {
                //Switch();//觸發LS路由重新更新
            });

        await fetch(`${APIUrl}api/Login/JWTTokenCustomer?name=${account}&pass=${pass}`)//透過Token取得使用者資訊
            .then(Result => {
                //portalService.clear();
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                //console.log(PreResult)
                if (PreResult.success) {
                    setItemlocalStorage("Auth", PreResult.token);
                    //儲存 跨組件State LoginName: "test",
                    //setItemlocalStorage("LoginName", PreResult.response.uRealName);
                    //uid = PreResult.response.Id;
                } else {
                    clearlocalStorage();
                    throw new Error("取得Token失敗");
                }
            })
            .catch((Error) => {
                clearlocalStorage();
                throw Error;
            })
            .finally(() => {
                props?.close && props.close()
                history.push('/Profile');
                Switch();//觸發LS路由重新更新
            });

        return "登入成功";

    }, [Account, APIUrl, Pass, Switch])

    const [execute] = useLoginAsync(loginVerification, false);
    //#endregion 

    return (
        <>
            {/* 背景 */}
            < Container className={props.className} theme={loginCard.loginCardContainer}
                onClick={() => {
                    (props.backgroundCanClose ?? true) && (props?.close && props.close())
                }}
            >
                {/* 彈窗容器 */}
                <BasicContainer onClick={(e) => { e.stopPropagation(); }}
                    style={{ maxWidth: "59.375rem" }}
                    theme={props?.theme?.loginCard ?? loginCard.loginCardformCard}>
                    <Container theme={loginCard.loginCardContent}>
                        {/* 左半邊 */}
                        <SubContainer style={{ backgroundImage: "linear-gradient(145.54deg, rgb(150, 79, 24) 0.36%, rgba(150, 79, 24, 0.8) 99.58%)", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px" }} theme={{ occupy: 4.8, height: "36.25rem" }}>
                            <img alt="sdf" width="200" style={{ userSelect: "none", margin: "4.5rem 0 0 2.1rem" }} height="42.36" src={"/2db8549.png"}></img>
                            <Text style={{ userSelect: "none" }} theme={{ display: "block", margin: "4.5rem 0 0 2.1rem", color: "#ffffffde", fontSize: "2rem" }}>歡迎回來！</Text>
                            <Text style={{ userSelect: "none" }} theme={{ display: "block", margin: "4.5rem 0 0 2.1rem", color: "#ffffffde", fontSize: "1rem", fontWeight: 700 }}>。專業到位的足壓量測</Text>
                            <Text style={{ userSelect: "none" }} theme={{ display: "block", margin: "0.5rem 0 0 2.1rem", color: "#ffffffde", fontSize: "1rem", fontWeight: 700 }}>。3 步驟完成預約</Text>
                            <Text style={{ userSelect: "none" }} theme={{ display: "block", margin: "0.5rem 0 0 2.1rem", color: "#ffffffde", fontSize: "1rem", fontWeight: 700 }}>。全台據點快速選擇</Text>
                        </SubContainer>
                        {/* 右半邊 */}
                        {/* 登入卡片 */}
                        {IsLogin === "" &&
                            <SubContainer style={{ borderTopRightRadius: "16px", borderBottomRightRadius: "16px" }} theme={{ occupy: 7.2, height: "36.25rem" }}>
                                <Text style={{ userSelect: "none" }} theme={{ display: "block", margin: "6rem 0 2.75rem 2.1rem", color: "#444", fontSize: "1.75rem", fontWeight: 600 }}>會員登入</Text>
                                {/* 登入-帳號 */}
                                <FormControl theme={loginCard.loginForm} sumbit={true} onSubmit={(e) => { e.preventDefault(); execute(Account, Pass); }}>
                                    <FormRow>
                                        <FormCardTextInput
                                            label={"登入帳號"}
                                            hint={""}
                                            value={Account}
                                            onChange={Accounthandler}
                                            regExpResult={AccountregExpResult}
                                            placeholder={"您的email信箱"}
                                            theme={loginCard.AccountTextInput}
                                        ></FormCardTextInput>
                                    </FormRow>
                                    {/* 登入-密碼 */}
                                    <FormRow>
                                        <FormCardTextInput
                                            label={"登入密碼"}
                                            pass
                                            hint={<>
                                                <Text theme={{ ...loginCard.forgetText, margin: 0 }}>忘記密碼了嗎？</Text>
                                                <Text onClick={() => { setIsLogin("忘記密碼") }} theme={{ ...loginCard.forgetTextRight, margin: 0 }}> 寄送 Email 重設密碼</Text>
                                            </>}
                                            value={Pass}
                                            onChange={Passhandler}
                                            regExpResult={PassregExpResult}
                                            placeholder={"預設為您的手機號碼，例 0912666888"}
                                            theme={{
                                                ...loginCard.AccountTextInput,
                                                input: {
                                                    ...loginCard.AccountTextInput.input,
                                                    ...(Pass.length > 0 ? { letterSpacing: "0.5rem" } : {})
                                                }
                                            }}
                                        ></FormCardTextInput>
                                    </FormRow>
                                </FormControl>
                                {/* 按鈕 */}
                                <EasyButton theme={loginCard.loginButton} text={"立即登入"} onClick={() => { execute(Account, Pass); }} />
                                <Text theme={loginCard.forgetText}>還沒有會員嗎？</Text>
                                <Text onClick={() => { setIsLogin("註冊帳號") }} theme={loginCard.forgetTextRight}> 註冊帳號</Text>
                            </SubContainer>}
                        {/* 註冊卡片 */}
                        {IsLogin === "註冊帳號" &&
                            <SubContainer style={{ borderTopRightRadius: "16px", borderBottomRightRadius: "16px" }} theme={{ occupy: 7.2, height: "36.25rem" }}>
                                <Text style={{ userSelect: "none" }} theme={{ display: "block", margin: "6rem 0 2rem 2.1rem", color: "#444", fontSize: "1.75rem", fontWeight: 600 }}>註冊帳號</Text>
                                {/* 在這裡加上 註冊表單... */}

                                {/* 使用範例*/}
                                <FormControl theme={{
                                    width: "100%",
                                    padding: "0 2.1rem 0",
                                    overflowY: "scroll",
                                    height: "calc( 100% - 20.1rem )"
                                }} sumbit={true} onSubmit={(e) => { e.preventDefault(); /*execute(Account, Pass);*/ }}>
                                    <FormRow>
                                        <FormCardTextInput
                                            label={(<>姓名<Text style={{ textShadow: "0 0 1px #d25959" }} theme={{ display: "inline-block", color: "#d25959", fontSize: " 0.9rem" }}>＊必填</Text></>)}
                                            //hint={""}
                                            value={Account}
                                            onChange={Accounthandler}
                                            regExpResult={AccountregExpResult}
                                            placeholder={"請輸入真實中文姓名，以便確認您的預約資料"}
                                            theme={loginCard.AccountTextInput}
                                        ></FormCardTextInput>
                                    </FormRow>
                                    <FormRow>
                                        <FormCardSelector
                                            label={"出生年月日"}
                                            hint={""}
                                            placeholder={"西元年"}
                                            value={BirthYear}
                                            isSearchable
                                            options={YearFrom1930to(2020)}
                                            //defaultValue={ { value: '1', label: 'Chocolate' }}
                                            onChange={(value) => { BirthYearResetValue(value); BirthMonthResetValue(''); BirthDayResetValue('') }}
                                            regExpResult={BirthYearregExpResult}
                                            theme={loginCard.birthFormCardSelector}
                                        ></FormCardSelector>
                                        <FormCardSelector
                                            label={""}
                                            hint={""}
                                            placeholder={"月份"}
                                            value={BirthMonth}
                                            isSearchable
                                            options={month}
                                            //defaultValue={ { value: '1', label: 'Chocolate' }}
                                            onChange={(value) => { BirthMonthResetValue(value); BirthDayResetValue('') }}
                                            regExpResult={BirthMonthregExpResult}
                                            theme={loginCard.birthFormCardSelector}
                                        ></FormCardSelector>
                                        <FormCardSelector
                                            label={""}
                                            hint={""}
                                            placeholder={"日期"}
                                            value={BirthDay}
                                            isSearchable
                                            options={getDayByYearAndMonth(BirthYear.value, BirthMonth.value)}
                                            //defaultValue={ { value: '1', label: 'Chocolate' }}
                                            onChange={(value) => { BirthDayResetValue(value) }}
                                            regExpResult={BirthDayregExpResult}
                                            theme={loginCard.birthFormCardSelector}
                                        ></FormCardSelector>
                                    </FormRow>
                                </FormControl>

                                <Text onClick={() => { setAgreement(a => !a) }} theme={{ display: "inline-block", fontSize: "0.75rem", color: "#787676", margin: "2rem 0 0 2.1rem", cursor: "pointer" }}>
                                    <CheckboxWhatever checked={Agreement} ></CheckboxWhatever>
                                    我同意阿瘦集團服務條款及隱私政策、收到最新活動訊息
                                </Text>
                                <EasyButton theme={loginCard.signUpButton} text={"註冊"} onClick={() => { console.log("...做註冊要做的事") }} />
                                <Text theme={loginCard.forgetText}>已經有會員了嗎？</Text>
                                <Text onClick={() => { setIsLogin("") }} theme={loginCard.forgetTextRight}> 登入帳號</Text>
                            </SubContainer>
                        }
                        {/* 忘記密碼卡片 */}
                        {IsLogin === "忘記密碼" &&
                            <SubContainer style={{ borderTopRightRadius: "16px", borderBottomRightRadius: "16px" }} theme={{ occupy: 7.2, height: "36.25rem" }}>
                                <Text style={{ userSelect: "none" }} theme={{ display: "block", margin: "6rem 0 0 2.1rem", color: "#444", fontSize: "1.75rem", fontWeight: 600 }}>忘記密碼</Text>
                                {/* 在這裡加上 忘記密碼表單... */}

                                <EasyButton theme={loginCard.loginButton} text={"傳送驗證碼"} onClick={() => { console.log("...做忘記密碼要做的事") }} />
                                <Text theme={loginCard.forgetText}>回到</Text>
                                <Text onClick={() => { setIsLogin("") }} theme={loginCard.forgetTextRight}> 會員登入</Text>
                            </SubContainer>
                        }
                    </Container>

                    {props.children}
                </BasicContainer>
                {/* <BasicContainer onClick={(e) => { e.stopPropagation(); }}
                    theme={props?.theme?.formCard ?? formCard.formCard}>
                    <Container theme={formCard.titleBar}>
                        <SubContainer>
                            <Text theme={formCard.titleText}>{props.title}</Text>
                        </SubContainer>
                        <SubContainer theme={{}}>
                            <EasyButton theme={props?.theme?.yesButton ?? formCard.yesButton} text={props.yesText} onClick={() => { props?.yes && props.yes() }} />
                            <EasyButton theme={props?.theme?.noButton ?? formCard.noButton} text={props.noText} onClick={() => { props?.no && props.no() }} />
                        </SubContainer>
                    </Container>

                    {props.children}
                </BasicContainer> */}
            </Container >
        </>
    )
}
//#endregion

//#region 表單卡片組件
/* 
   Date   : 2020-06-24 23:04:27
   Author : Arhua Ho
   Content: 表單卡片組件
            可傳入props : 
                close : 點擊背景區所要執行的函數
                backgroundCanClose : Boolean 決定點擊背景區是否可以關閉視窗，預設為true，即可關閉 
                yes : 確認按鈕函數
                yesText : 確認按鈕文字
                no : 取消按鈕函數
                noText : 取消按鈕文字
                theme : {
                  formCard : {}, //彈窗樣式 (BasicContainer)
                  yesButton : {}, //確認按鈕樣式
                  noButton : {}, //取消按鈕樣式
                }
*/
export const LoginCard = styled(LoginCardBase).attrs((props) => ({}))`

`
//#endregion

