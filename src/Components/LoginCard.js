import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Context } from '../Store/store'
import { Container, BasicContainer, SubContainer } from './Containers';
import { Text } from './Texts';
import { EasyButton } from './Buttons';
import { FormControl, FormRow, FormCardTextInput, FormCardSelector, CheckboxWhatever } from './Forms';
import { useForm, useSelector } from '../SelfHooks/useForm';
import { setItemlocalStorage, getItemlocalStorage, clearlocalStorage } from '../Handlers/LocalStorageHandler';
import { useLoginAsync, useAsync } from '../SelfHooks/useAsync';
import { portalService } from './Portal'
import { alertService } from './JumpAlerts'
import { YearFrom1930to, Counties, cityAndCountiesLite, getDayByYearAndMonth, month } from '../Mappings/Mappings';
import { useHistory } from 'react-router-dom';


//#region 表單卡片基底
const LoginCardBase = (props) => {

    const { APIUrl, Theme, Switch } = useContext(Context);
    const { loginCard } = Theme;
    const [IsLogin, setIsLogin] = useState("");
    let history = useHistory();

    const [Phone, Phonehandler, PhoneregExpResult, PhoneResetValue] = useForm("", ["^.{1,}$", "^09[0-9]{8}$"], ["請輸入正確手機號碼", "請輸入正確手機格式"]); // 管理員手機欄位
    const [Email, Emailhandler, EmailregExpResult, EmailResetValue] = useForm("", ["^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z]+$"], ["請輸入正確E-mail格式"]); // Email欄位
    const [County, Countyhandler, CountyregExpResult, CountyResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇縣市"]); // 直轄地區欄位
    const [District, Districthandler, DistrictregExpResult, DistrictResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇行政區"]); // 直轄地區欄位
    const [Addr, Addrhandler, AddrregExpResult, AddrResetValue] = useForm("", ["^.{1,}$"], ["請輸入詳細地址"]); // 地址欄位
    const [Name, Namehandler, NameregExpResult, NameResetValue] = useForm("", ["^[\u4E00-\u9FA5]{1,}$", "^.{1,5}$"], ["請輸入足健師中文姓名", "姓名最長為5個中文字"]); // 足健師姓名欄位
    const [Account, Accounthandler, AccountregExpResult, AccountResetValue] = useForm("", ["^.{1,}$", "^[0-9]{1,}$", "^.{1,999}$"], ["請輸入工號", "工號限使用數字", "最長為999個數字"]); //足健師工號欄位
    const [Pass, Passhandler, PassregExpResult, PassResetValue] = useForm("", ["^.{1,}$", "^[0-9]{1,}$", "^.{1,999}$"], ["請輸入工號", "工號限使用數字", "最長為999個數字"]); //足健師工號欄位
    const [BirthYear, BirthYearhandler, BirthYearregExpResult, BirthYearResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇生日西元年"]); // 生日西元年欄位
    const [BirthMonth, BirthMonthhandler, BirthMonthregExpResult, BirthMonthResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇生日月份"]);// 生日月份欄位
    const [BirthDay, BirthDayhandler, BirthDayregExpResult, BirthDayResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇生日日期"]); // 生日日期欄位
    const [Agreement, setAgreement] = useState(false); // 同意條款

    const [ResetEmail, ResetEmailhandler, ResetEmailregExpResult, ResetEmailResetValue] = useForm("", ["^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z]+$"], ["請輸入正確E-mail格式"]); // Email欄位
    const [ResetCode, ResetCodehandler, ResetCoderegExpResult, ResetCodeResetValue] = useForm("", [], []); // Code欄位
    const [ResetPwd, ResetPwdhandler, ResetPwdregExpResult, ResetPwdResetValue] = useForm("", ["^.{1,}$"], ["請輸入正確密碼格式"]); // Pwd欄位
    const [ForgetStep, setForgetStep] = useState(1); // 忘記密碼流程狀態

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
                    setItemlocalStorage("LoginData", JSON.stringify(PreResult));
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

    //#region 新增顧客API 
    const addUser = useCallback(async (Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr) => {
        //return console.log(`${BirthYear?.value}-${BirthMonth?.value}-${BirthDay?.value}`, `${ServiceArea.map((item) => { return item?.value })?.join()}`);
        //return console.log(Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr)
        return await fetch(`${APIUrl}api/UserInfo/Post`,
            {
                method: "POST",
                headers: {
                    'content-type': 'application/json',

                },
                body: JSON.stringify({
                    cLoginName: Email,
                    cLoginPWD: Phone,
                    cRealName: Name,
                    cBirthDay: (BirthYear && BirthMonth && BirthDay) ? `${BirthYear?.value}-${BirthMonth?.value}-${BirthDay?.value}` : '',
                    CreateTime: new Date(),
                    IsDeleted: false,
                    CommAddr: Addr,
                    CommCounty: County?.value,
                    CommDistrict: District?.value,
                    cEmail: Email,
                    cTel: Phone,
                })
            }
        )//查詢角色、表格翻頁
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                //console.log(PreResult)
                if (PreResult.Status === 401) {
                    //Token過期 強制登出
                    clearlocalStorage();
                    history.push("/Login");
                    throw new Error("Token過期 強制登出");
                }

                if (PreResult.success) {
                    portalService.success({
                        autoClose: false,
                        close: () => {
                            history.push('/Profile');
                            Switch();//觸發LS路由重新更新
                            setForgetStep(1);
                            setIsLogin("");
                        },
                        yes: () => {
                            history.push('/Profile');
                            Switch();//觸發LS路由重新更新
                            setForgetStep(1);
                            setIsLogin("");
                        },
                        yesText: "確定",
                        removeNoButton: true,
                        content: (
                            <>

                                <Text theme={{
                                    display: "block",
                                    textAlign: "center",
                                    color: "#545454",
                                    fontSize: "1.125rem",
                                    fontWeight: 600
                                }}>
                                    {`註冊成功，請以剛剛註冊的帳號密碼登入`}
                                </Text>
                            </>)
                    })
                    return "成功新增顧客資訊"
                } else {
                    alertService.warn(PreResult.msg, { autoClose: true });
                    throw new Error("新增顧客資訊失敗");
                }
            })
            .catch((Error) => {
                throw Error;
            })
            .finally(() => {

            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [AddUserExecute, AddUserPending] = useAsync(addUser, false);
    //#endregion

    //#region 忘記密碼－輸入帳號API 
    const forgetFirstStep = useCallback(async (ResetEmail) => {
        //return console.log(`${BirthYear?.value}-${BirthMonth?.value}-${BirthDay?.value}`, `${ServiceArea.map((item) => { return item?.value })?.join()}`);
        //return console.log(Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr)
        return await fetch(`${APIUrl}api/Login/PushPhoneMessageCustomer?phoneNum=${ResetEmail}&status=2`,
            {
                method: "GET",
                headers: {
                    'content-type': 'application/json',

                },

            }
        )//查詢角色、表格翻頁
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                //console.log(PreResult)
                if (PreResult.Status === 401) {
                    //Token過期 強制登出
                    clearlocalStorage();
                    history.push("/Login");
                    throw new Error("Token過期 強制登出");
                }

                if (PreResult.success) {
                    alertService.normal(PreResult.msg, { autoClose: true });
                    setForgetStep(2);
                    return "成功新增顧客資訊"
                } else {
                    alertService.warn(PreResult.msg, { autoClose: true });
                    throw new Error("新增顧客資訊失敗");
                }
            })
            .catch((Error) => {
                throw Error;
            })
            .finally(() => {
                // props?.close && props.close()
                // history.push('/Profile');
                // Switch();//觸發LS路由重新更新
            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [ForgetFirstStepExecute, ForgetFirstStepPending] = useAsync(forgetFirstStep, false);
    //#endregion

    //#region 忘記密碼－輸入驗證碼API 
    const forgetSecondStep = useCallback(async (ResetEmail, Code) => {
        //return console.log(`${BirthYear?.value}-${BirthMonth?.value}-${BirthDay?.value}`, `${ServiceArea.map((item) => { return item?.value })?.join()}`);
        //return console.log(Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr)
        return await fetch(`${APIUrl}api/Login/CheckPhoneCodeCustomer?phoneNum=${ResetEmail}&vCode=${Code}&status=2`,
            {
                method: "GET",
                headers: {
                    'content-type': 'application/json',

                },

            }
        )//查詢角色、表格翻頁
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                //console.log(PreResult)
                if (PreResult.Status === 401) {
                    //Token過期 強制登出
                    clearlocalStorage();
                    history.push("/Login");
                    throw new Error("Token過期 強制登出");
                }

                if (PreResult.success) {
                    alertService.normal(PreResult.msg, { autoClose: true });
                    setForgetStep(3);
                    return "成功新增顧客資訊"
                } else {
                    alertService.warn(PreResult.msg, { autoClose: true });
                    throw new Error("新增顧客資訊失敗");
                }
            })
            .catch((Error) => {
                throw Error;
            })
            .finally(() => {
                // props?.close && props.close()
                // history.push('/Profile');
                // Switch();//觸發LS路由重新更新
            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [ForgetSecondStepExecute, ForgetSecondStepPending] = useAsync(forgetSecondStep, false);
    //#endregion

    //#region 忘記密碼－輸入新密碼API 
    const forgetThirdStep = useCallback(async (ResetEmail, ResetPwd) => {
        //return console.log(`${BirthYear?.value}-${BirthMonth?.value}-${BirthDay?.value}`, `${ServiceArea.map((item) => { return item?.value })?.join()}`);
        //return console.log(Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr)
        return await fetch(`${APIUrl}api/Login/PutForgetPasswordCustomer?cAccount=${ResetEmail}&cPassword=${ResetPwd}`,
            {
                method: "PUT",
                headers: {
                    'content-type': 'application/json',

                },

            }
        )//查詢角色、表格翻頁
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                //console.log(PreResult)
                if (PreResult.Status === 401) {
                    //Token過期 強制登出
                    clearlocalStorage();
                    history.push("/Login");
                    throw new Error("Token過期 強制登出");
                }

                if (PreResult.success) {
                    portalService.success({
                        autoClose: false,
                        close: () => {
                            history.push('/Profile');
                            Switch();//觸發LS路由重新更新
                            setForgetStep(1);
                            setIsLogin("");
                        },
                        yes: () => {
                            history.push('/Profile');
                            Switch();//觸發LS路由重新更新
                            setForgetStep(1);
                            setIsLogin("");
                        },
                        yesText: "確定",
                        removeNoButton: true,
                        content: (
                            <>

                                <Text theme={{
                                    display: "block",
                                    textAlign: "center",
                                    color: "#545454",
                                    fontSize: "1.125rem",
                                    fontWeight: 600
                                }}>
                                    {`修改成功，請以剛剛重設的帳號密碼登入`}
                                </Text>
                            </>)
                    })

                    return "成功新增顧客資訊"
                } else {
                    //alertService.warn(PreResult.msg, { autoClose: true });
                    throw new Error("新增顧客資訊失敗");
                }
            })
            .catch((Error) => {
                throw Error;
            })
            .finally(() => {
                //alertService.normal('請以剛剛重設的帳號密碼登入', { autoClose: false });
            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [ForgetThirdStepExecute, ForgetThirdStepPending] = useAsync(forgetThirdStep, false);
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
                                <Text style={{ userSelect: "none" }} theme={{ display: "block", margin: "40px 0 2rem 2.1rem", color: "#444", fontSize: "1.75rem", fontWeight: 600 }}>註冊帳號</Text>
                                {/* 在這裡加上 註冊表單... */}

                                {/* 使用範例*/}
                                <FormControl theme={{
                                    width: "100%",
                                    padding: "0 2.1rem 0",
                                    overflowY: "scroll",
                                    height: "calc( 100% - 16rem )"
                                }} sumbit={true} onSubmit={(e) => { e.preventDefault(); /*execute(Account, Pass);*/ }}>
                                    <FormRow>
                                        <FormCardTextInput
                                            label={(<>姓名<Text style={{ textShadow: "0 0 1px #d25959" }} theme={{ display: "inline-block", color: "#d25959", fontSize: " 0.9rem" }}>＊必填</Text></>)}
                                            //hint={""}
                                            value={Name}
                                            onChange={Namehandler}
                                            regExpResult={NameregExpResult}
                                            placeholder={"請輸入真實中文姓名，以便確認您的預約資料"}
                                            theme={loginCard.AccountTextInput}
                                        ></FormCardTextInput>
                                    </FormRow>
                                    <FormRow>
                                        <FormCardTextInput
                                            label={(<>Email<Text style={{ textShadow: "0 0 1px #d25959" }} theme={{ display: "inline-block", color: "#d25959", fontSize: " 0.9rem" }}>＊必填</Text></>)}
                                            hint={"email將作為您的登入帳號，日後不可修改"}
                                            value={Email}
                                            onChange={Emailhandler}
                                            regExpResult={EmailregExpResult}
                                            placeholder={"aso_service@gmail.com"}
                                            theme={loginCard.AccountTextInput}
                                        ></FormCardTextInput>
                                    </FormRow>
                                    <FormRow>
                                        <FormCardTextInput
                                            label={(<>手機號碼<Text style={{ textShadow: "0 0 1px #d25959" }} theme={{ display: "inline-block", color: "#d25959", fontSize: " 0.9rem" }}>＊必填</Text></>)}
                                            hint={"手機號碼將作為您的登入密碼"}
                                            value={Phone}
                                            onChange={Phonehandler}
                                            regExpResult={PhoneregExpResult}
                                            placeholder={"0966888168"}
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

                                    <FormRow>
                                        <FormCardSelector
                                            label={"通訊地址"}
                                            //hint={""}
                                            placeholder={"請選擇縣市"}
                                            value={County}
                                            isSearchable
                                            options={Counties}
                                            //defaultValue={ { value: '1', label: 'Chocolate' }}
                                            onChange={(value) => { CountyResetValue(value); DistrictResetValue('') }}
                                            regExpResult={CountyregExpResult}
                                            theme={loginCard.birthFormCardSelector}
                                        ></FormCardSelector>
                                        <FormCardSelector
                                            label={""}
                                            //hint={""}
                                            placeholder={"請選擇行政區"}
                                            value={District}
                                            isSearchable
                                            options={cityAndCountiesLite[County.value]}
                                            //defaultValue={ { value: '1', label: 'Chocolate' }}
                                            onChange={(value) => { DistrictResetValue(value) }}
                                            regExpResult={DistrictregExpResult}
                                            theme={loginCard.birthFormCardSelector}
                                        ></FormCardSelector>
                                    </FormRow>
                                    <FormRow>
                                        <FormCardTextInput
                                            //label={""}
                                            hint={""}
                                            value={Addr}
                                            onChange={Addrhandler}
                                            regExpResult={AddrregExpResult}
                                            placeholder={"忠孝東路四段 100 號 3 樓"}
                                            theme={loginCard.AccountTextInput}
                                        ></FormCardTextInput>
                                    </FormRow>

                                </FormControl>

                                <Text onClick={() => { setAgreement(a => !a) }} theme={{ display: "inline-block", fontSize: "0.75rem", color: "#787676", margin: "2rem 0 0 2.1rem", cursor: "pointer" }}>
                                    <CheckboxWhatever checked={Agreement} onChange={() => { /* 不需要做事，用上面的onClick控制 */ }}></CheckboxWhatever>
                                    我同意阿瘦集團服務條款及隱私政策、收到最新活動訊息
                                </Text>
                                <EasyButton theme={loginCard.signUpButton} text={"註冊"} onClick={() => {
                                    //全部通過檢核才可放行
                                    (NameregExpResult ? alertService.warn(NameregExpResult, { autoClose: true })

                                        : (PhoneregExpResult ? alertService.warn(PhoneregExpResult, { autoClose: true })

                                            : (EmailregExpResult ? alertService.warn(EmailregExpResult, { autoClose: true })
                                                : (!Agreement ? alertService.warn('請勾選是否同意阿瘦集團服務條款及隱私政策', { autoClose: true })
                                                    : AddUserExecute(Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr)
                                                )
                                            )
                                        )
                                    )

                                }} />
                                <Text theme={loginCard.forgetText}>已經有會員了嗎？</Text>
                                <Text onClick={() => { setIsLogin("") }} theme={loginCard.forgetTextRight}> 登入帳號</Text>
                            </SubContainer>
                        }
                        {/* 忘記密碼卡片 */}
                        {IsLogin === "忘記密碼" &&
                            <SubContainer style={{ borderTopRightRadius: "16px", borderBottomRightRadius: "16px" }} theme={{ occupy: 7.2, height: "36.25rem", padding: '15% 0 0 0' }}>
                                {ForgetStep === 1 && <><Text style={{ userSelect: "none" }} theme={{ display: "block", margin: "1rem 0 0 2.1rem", color: "#444", fontSize: "1.75rem", fontWeight: 600 }}>忘記密碼</Text>

                                    <FormControl theme={{
                                        width: "100%",
                                        padding: "0 2.1rem 0",
                                        overflowY: "scroll",
                                        height: "calc( 100% - 20.1rem )"
                                    }} sumbit={true} onSubmit={(e) => { e.preventDefault(); /*execute(Account, Pass);*/ }}>
                                        <FormRow>
                                            <FormCardTextInput
                                                label={'請輸入帳號(Email)'}
                                                //hint={""}
                                                value={ResetEmail}
                                                onChange={ResetEmailhandler}
                                                regExpResult={ResetEmailregExpResult}
                                                placeholder={"您的Email信箱"}
                                                theme={loginCard.AccountTextInput}
                                            ></FormCardTextInput>
                                        </FormRow>

                                    </FormControl>
                                    <EasyButton theme={loginCard.loginButton} text={"傳送驗證碼"} onClick={() => {
                                        console.log("...做忘記密碼要做的事")
                                        ForgetFirstStepExecute(ResetEmail);
                                    }} />
                                    <Text theme={loginCard.forgetText}>回到</Text>
                                    <Text onClick={() => { setIsLogin("") }} theme={loginCard.forgetTextRight}> 會員登入</Text></>}

                                {ForgetStep === 2 && <><Text style={{ userSelect: "none" }} theme={{ display: "block", margin: "1rem 0 0 2.1rem", color: "#444", fontSize: "1.75rem", fontWeight: 600 }}>忘記密碼</Text>

                                    <FormControl theme={{
                                        width: "100%",
                                        padding: "0 2.1rem 0",
                                        overflowY: "scroll",
                                        height: "calc( 100% - 20.1rem )"
                                    }} sumbit={true} onSubmit={(e) => { e.preventDefault(); /*execute(Account, Pass);*/ }}>
                                        <FormRow>
                                            <FormCardTextInput
                                                label={'請輸入帳號(Email)'}
                                                //hint={""}
                                                value={ResetEmail}
                                                disabled
                                                onChange={ResetEmailhandler}
                                                regExpResult={ResetEmailregExpResult}
                                                placeholder={"您的Email信箱"}
                                                theme={loginCard.AccountTextInput}
                                            ></FormCardTextInput>
                                        </FormRow>
                                        <FormRow>
                                            <FormCardTextInput
                                                label={'請輸入驗證碼'}
                                                //hint={""}
                                                value={ResetCode}
                                                onChange={ResetCodehandler}
                                                regExpResult={ResetCoderegExpResult}
                                                placeholder={"請輸入驗證碼"}
                                                theme={loginCard.AccountTextInput}
                                            ></FormCardTextInput>
                                        </FormRow>

                                    </FormControl>
                                    <EasyButton theme={loginCard.loginButton} text={"確認驗證碼"} onClick={() => {
                                        console.log("...做忘記密碼要做的事")
                                        ForgetSecondStepExecute(ResetEmail, ResetCode);
                                    }} />
                                    <Text theme={loginCard.forgetText}>回到</Text>
                                    <Text onClick={() => { setIsLogin("") }} theme={loginCard.forgetTextRight}> 會員登入</Text></>}

                                {ForgetStep === 3 && <><Text style={{ userSelect: "none" }} theme={{ display: "block", margin: "1rem 0 0 2.1rem", color: "#444", fontSize: "1.75rem", fontWeight: 600 }}>忘記密碼</Text>

                                    <FormControl theme={{
                                        width: "100%",
                                        padding: "0 2.1rem 0",
                                        overflowY: "scroll",
                                        height: "calc( 100% - 20.1rem )"
                                    }} sumbit={true} onSubmit={(e) => { e.preventDefault(); /*execute(Account, Pass);*/ }}>
                                        <FormRow>
                                            <FormCardTextInput
                                                label={'請輸入帳號(Email)'}
                                                //hint={""}
                                                value={ResetEmail}
                                                disabled
                                                onChange={ResetEmailhandler}
                                                regExpResult={ResetEmailregExpResult}
                                                placeholder={"您的Email信箱"}
                                                theme={loginCard.AccountTextInput}
                                            ></FormCardTextInput>
                                        </FormRow>
                                        <FormRow>
                                            <FormCardTextInput
                                                label={'請輸入新密碼'}
                                                //hint={""}
                                                value={ResetPwd}
                                                onChange={ResetPwdhandler}
                                                regExpResult={ResetPwdregExpResult}
                                                placeholder={"請輸入4-16位數，半形英數字組成之密碼"}
                                                theme={loginCard.AccountTextInput}
                                            ></FormCardTextInput>
                                        </FormRow>

                                    </FormControl>
                                    <EasyButton theme={loginCard.loginButton} text={"確認驗證碼"} onClick={() => {
                                        console.log("...做忘記密碼要做的事")
                                        ForgetThirdStepExecute(ResetEmail, ResetPwd);
                                    }} />
                                    <Text theme={loginCard.forgetText}>回到</Text>
                                    <Text onClick={() => { setIsLogin("") }} theme={loginCard.forgetTextRight}> 會員登入</Text></>}


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

