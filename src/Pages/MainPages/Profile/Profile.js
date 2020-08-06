import React, { useContext, useCallback, useState, useEffect } from 'react';
import { Context } from '../../../Store/store'
import { BasicContainer, SubContainer, Container } from '../../../Components/Containers';
import { useHistory } from 'react-router-dom';
import { useWindowSize } from '../../../SelfHooks/useWindowSize'
import { EasyButton } from '../../../Components/Buttons';
import { portalService } from '../../../Components/Portal';
import { clearlocalStorage, getItemlocalStorage, setItemlocalStorage } from '../../../Handlers/LocalStorageHandler';
import { Text } from '../../../Components/Texts';
import CreateIcon from '@material-ui/icons/Create';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useForm, useSelector } from '../../../SelfHooks/useForm'
import { FormCardTextInput, FormControl, FormRow, FormCardSelector } from '../../../Components/Forms';
import { useAsync } from '../../../SelfHooks/useAsync';

export const Profile = (props) => {

    const { APIUrl, Theme, setOpwnLoginCard } = useContext(Context);
    const { pages: { profilePage: { profile } } } = Theme;
    let history = useHistory();
    const [width] = useWindowSize();
    console.log(JSON.parse(getItemlocalStorage("LoginData")));
    const [UserData, setUserData] = useState(JSON.parse(getItemlocalStorage("LoginData")));
    const [DataEditing, setDataEditing] = useState(false);
    const [PassEditing, setPassEditing] = useState(false);
    const [Pass, Passhandler, PassregExpResult, PassResetValue] = useForm("", ["^.{1,}$"], ["請輸入正確密碼格式"]); // 密碼欄位
    const [Email, Emailhandler, EmailregExpResult, EmailResetValue] = useForm("", ["^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z]+$"], ["請輸入正確E-mail格式"]); // Email
    const [Name, Namehandler, NameregExpResult, NameResetValue] = useForm("", ["^[\u4E00-\u9FA5]{1,}$", "^.{1,5}$"], ["請輸入中文姓名", "姓名最長為5個中文字"]); // 姓名欄位
    const [Phone, Phonehandler, PhoneregExpResult, PhoneResetValue] = useForm("", ["^.{1,}$", "^09[0-9]{8}$"], ["請輸入手機號碼", "請輸入正確手機格式"]); // 手機欄位

    //#region 修改使用者資訊API
    const putUserData = useCallback(async (oldData, newPwd, newName, newEmail, newPhone) => {
        await fetch(`${APIUrl}api/UserInfo/Put`,
            {
                method: "PUT",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getItemlocalStorage("Auth")}`
                },
                body: JSON.stringify({
                    ...oldData,
                    cRealName: newName ?? oldData?.cRealName,
                    cEmail: newEmail ?? oldData?.cEmail,
                    cTel: newPhone ?? oldData?.cTel,
                })
            })
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                if (PreResult.Status === 401) {
                    //Token過期 強制登出
                    clearlocalStorage();
                    if (window.innerWidth > 768) {
                        history.push("/");
                        setOpwnLoginCard(true);
                    } else {
                        history.push("/Login");
                    }

                    throw new Error("Token過期 強制登出");
                }
                if (PreResult.success) {
                    //console.log(PreResult.response)
                    setItemlocalStorage("LoginData", JSON.stringify({
                        ...UserData, response: {
                            ...oldData,
                            cRealName: newName ?? oldData?.cRealName,
                            cEmail: newEmail ?? oldData?.cEmail,
                            cTel: newPhone ?? oldData?.cTel,
                        }
                    }));
                    setUserData({
                        ...UserData, response: {
                            ...oldData,
                            cRealName: newName ?? oldData?.cRealName,
                            cEmail: newEmail ?? oldData?.cEmail,
                            cTel: newPhone ?? oldData?.cTel,
                        }
                    });
                    return "更新使用者資訊成功"
                } else {
                    //clearlocalStorage();
                    throw new Error("更新使用者資訊失敗");
                }
            })
            .catch((Error) => {
                // clearlocalStorage();
                // if (window.innerWidth > 768) {
                //     history.push("/");
                //     setOpwnLoginCard(true);
                // } else {
                //     history.push("/Login");
                // }
                throw Error;
            })
            .finally(() => {

            });
        return await fetch(`${APIUrl}api/Login/PutForgetPasswordCustomer?cAccount=${oldData?.cLoginName}&cPassword=${newPwd ?? ''}`,
            {
                method: "PUT",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getItemlocalStorage("Auth")}`
                },
            })//改密碼
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                if (PreResult.success) {
                    //console.log(PreResult.response)

                    return "更新使用者密碼成功"
                } else {
                    //clearlocalStorage();
                    throw new Error("更新使用者密碼失敗");
                }
            })
            .catch((Error) => {

            })
            .finally(() => {

            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [executePutUserData, PendingPutUserData] = useAsync(putUserData, false);
    //#endregion


    const resetFormData = () => {
        EmailResetValue(UserData?.response?.cEmail ?? '');
        NameResetValue(UserData?.response?.cRealName ?? '');
        PhoneResetValue(UserData?.response?.cTel ?? '');
        PassResetValue();
    };

    useEffect(() => {
        resetFormData();
    }, []);
    return (
        <>
            {/* 寬度大於等於768時渲染的組件 */}
            {width > 768 && <BasicContainer theme={profile.basicContainer}>
                <Container>
                    <SubContainer theme={{ occupy: 4 }}>
                        <BasicContainer >
                            <img src="/Group.svg" height='180px' alt="Background" />
                        </BasicContainer>
                        <BasicContainer theme={profile.DataContainer}>
                            <Text theme={profile.textSmallTitle} >登入帳號</Text>
                            <Text theme={profile.textContent}>{UserData?.response?.cLoginName}</Text>
                            <EasyButton theme={{
                                backgroundColor: "#fff",
                                display: "inline-block",
                                position: 'absolute',
                                top: '0',
                                left: '80px',
                                width: "8rem",
                                height: "2rem",
                                lineHeight: "2rem",
                                color: DataEditing ? 'rgb(38, 180, 154)' : "#444",
                                textAlign: "center",
                                hoverColor: DataEditing ? 'rgb(38, 180, 154)' : "#666",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                            }}
                                icon={DataEditing ?
                                    <CheckCircleOutlineIcon style={{
                                        position: "relative",
                                        top: "0.1rem",
                                        height: "1rem"
                                    }} />
                                    : <CreateIcon style={{
                                        position: "relative",
                                        top: "0.1rem",
                                        height: "1rem"
                                    }} />}
                                text={DataEditing ? '確認修改' : "編輯資料"}
                                onClick={() => {
                                    setPassEditing(false);
                                    if (!DataEditing)
                                        setDataEditing(!DataEditing);
                                    else {
                                        setDataEditing(!DataEditing);
                                        portalService.warn({
                                            autoClose: false,
                                            yes: () => { executePutUserData(UserData?.response, Pass, Name, Email, Phone) },
                                            yesText: "確定修改",
                                            noText: "取消，繼續瀏覽",
                                            content: (
                                                <>
                                                    <Text theme={{
                                                        display: "block",
                                                        textAlign: "center",
                                                        color: "#595959",
                                                        fontSize: "1.5rem",
                                                        fontWeight: 600
                                                    }}>
                                                        {`是否確定修改`}
                                                    </Text>

                                                </>)
                                        })
                                    }
                                }} />
                        </BasicContainer>
                        <BasicContainer theme={profile.DataContainer}>
                            <Text theme={profile.textSmallTitle} >登入密碼</Text>
                            <Text theme={profile.textContentPwd}>{`·  ·  ·  ·  ·  ·`}</Text>
                            {DataEditing && !PassEditing && < EasyButton theme={{
                                backgroundColor: "#fff",
                                display: "inline-block",
                                position: 'absolute',
                                top: '0',
                                left: '80px',
                                width: "8rem",
                                height: "2rem",
                                lineHeight: "2rem",
                                color: '#fff',
                                textAlign: "center",
                                //hoverColor: DataEditing ? 'rgb(38, 180, 154)' : "#666",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                            }}
                                icon={<CreateIcon style={{
                                    position: "relative",
                                    top: "0.1rem",
                                    height: "1rem",
                                    color: "#444",
                                }} />}
                                text={DataEditing ? '確認修改' : "編輯資料"}
                                onClick={() => { setPassEditing(!PassEditing) }} />}
                        </BasicContainer>
                        <BasicContainer theme={profile.DataContainer}>
                            <Text theme={profile.textSmallTitle} >姓名</Text>
                            {!DataEditing ? <Text theme={profile.textContent}>{UserData?.response?.cRealName}</Text>
                                : <FormCardTextInput
                                    //label={"姓名"}
                                    //hint={""}
                                    value={Name}
                                    onChange={Namehandler}
                                    regExpResult={NameregExpResult}
                                    placeholder={"請輸入中文姓名"}
                                    theme={profile.passFormCardTextInput(0)}
                                ></FormCardTextInput>}
                        </BasicContainer>
                        <BasicContainer theme={profile.DataContainer}>
                            <Text theme={profile.textSmallTitle} >Email</Text>
                            {!DataEditing ? <Text theme={profile.textContent}>{UserData?.response?.cEmail}</Text>
                                : <FormCardTextInput
                                    //label={"管理員帳號"}
                                    //hint={"請輸入一個有效的電子郵件帳號"}
                                    value={Email}
                                    onChange={Emailhandler}
                                    regExpResult={EmailregExpResult}
                                    placeholder={"abe_wang@gmail.com"}
                                    theme={profile.passFormCardTextInput(0)}
                                ></FormCardTextInput>}
                        </BasicContainer>
                        <BasicContainer theme={profile.DataContainer}>
                            <Text theme={profile.textSmallTitle} >聯絡電話</Text>
                            {!DataEditing ? <Text theme={profile.textContent}>{UserData?.response?.cTel}</Text>
                                : <FormCardTextInput
                                    //label={"手機號碼"}
                                    //hint={""}
                                    value={Phone}
                                    onChange={Phonehandler}
                                    regExpResult={PhoneregExpResult}
                                    placeholder={"請輸入手機號碼"}
                                    theme={profile.passFormCardTextInput(0)}
                                ></FormCardTextInput>}
                        </BasicContainer>
                        <BasicContainer theme={profile.DataContainer}>
                            <Text theme={profile.textSmallTitle} >生日</Text>
                            <Text theme={profile.textContent}>{UserData?.response?.cBirthDay?.split('T')[0]}</Text>
                        </BasicContainer>
                        <BasicContainer theme={profile.DataContainer}>
                            <Text theme={profile.textSmallTitle} >通訊地址</Text>
                            <Text theme={profile.textContent}>{`${UserData?.response?.CommCounty}${UserData?.response?.CommDistrict}${UserData?.response?.CommAddr}`}</Text>
                        </BasicContainer>
                        <EasyButton theme={{
                            backgroundColor: "#fff",
                            display: "inline-block",
                            width: "3.5rem",
                            height: "2rem",
                            lineHeight: "2rem",
                            color: "#d25959",
                            border: "1px solid #d25959",
                            borderRadius: "1.25rem",
                            textAlign: "center",
                            hoverBackgroundColor: "#d25959",
                            hoverColor: "#fff",
                            fontSize: "0.875rem",
                            cursor: "pointer",
                        }} text={"登出"} onClick={() => {
                            portalService.warn({
                                autoClose: false,
                                yes: () => { clearlocalStorage(); history.push("/"); },
                                yesText: "確定登出",
                                noText: "取消，繼續瀏覽",
                                content: (
                                    <>
                                        <Text theme={{
                                            display: "block",
                                            textAlign: "center",
                                            color: "#595959",
                                            fontSize: "1.5rem",
                                            fontWeight: 600
                                        }}>
                                            {`確定要登出嗎?`}
                                        </Text>
                                        <Text theme={{
                                            display: "block",
                                            textAlign: "center",
                                            color: "#545454",
                                            fontSize: "1.125rem",
                                            fontWeight: 600
                                        }}>
                                            {`登出後將自動跳轉至首頁`}
                                        </Text>
                                    </>)
                            })
                        }} />
                    </SubContainer>
                    <SubContainer theme={{ occupy: 8 }}>
                        123
                </SubContainer>
                </Container>
            </BasicContainer>
            }

            {/* 寬度小於768時渲染的組件 */}
            {width <= 768 && <BasicContainer theme={profile.basicContainer}>
                小於768時渲染的組件
                <EasyButton theme={{
                    backgroundColor: "#fff",
                    display: "inline-block",
                    width: "3.5rem",
                    height: "2rem",
                    lineHeight: "2rem",
                    color: "#d25959",
                    border: "1px solid #d25959",
                    borderRadius: "1.25rem",
                    textAlign: "center",
                    hoverBackgroundColor: "#d25959",
                    hoverColor: "#fff",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                }} text={"登出"} onClick={() => {
                    portalService.warn({
                        autoClose: false,
                        yes: () => { clearlocalStorage(); history.push("/"); },
                        yesText: "確定登出",
                        noText: "取消，繼續瀏覽",
                        content: (
                            <>
                                <Text theme={{
                                    display: "block",
                                    textAlign: "center",
                                    color: "#595959",
                                    fontSize: "1.5rem",
                                    fontWeight: 600
                                }}>
                                    {`確定要登出嗎?`}
                                </Text>
                                <Text theme={{
                                    display: "block",
                                    textAlign: "center",
                                    color: "#545454",
                                    fontSize: "1.125rem",
                                    fontWeight: 600
                                }}>
                                    {`登出後將自動跳轉至首頁`}
                                </Text>
                            </>)
                    })
                }} />
            </BasicContainer>
            }

        </>
    )
}