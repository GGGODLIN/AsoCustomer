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
import { PageSubTitle, PageSubTitleMobile } from '../../../Components/PageSubTitle';
import { CardTable } from '../../../Components/CardTable';
import { dateTrans, dateTransAndGetWeek, addDays, addMonths } from '../../../Handlers/DateHandler';

export const Profile = (props) => {

    const { APIUrl, Theme, setOpwnLoginCard } = useContext(Context);
    const { pages: { profilePage: { profile } } } = Theme;
    const [TableData, setTableData] = useState([]);
    const [HisTableData, setHisTableData] = useState([]);
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

    //#region 查詢列表API
    const getOrdersList = useCallback(async () => {

        await fetch(`${APIUrl}api/Orders/GetList?_date=${dateTrans()}&orderBy=Status`,
            {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getItemlocalStorage("Auth")}`
                },
            }
        )//查詢角色、表格翻頁
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
                    setTableData({ data: PreResult.response });
                    return "查詢角色表格資訊成功"
                } else {
                    throw new Error("查詢角色表格資訊失敗");
                }
            })
            .catch((Error) => {
                clearlocalStorage();
                if (window.innerWidth > 768) {
                    history.push("/");
                    setOpwnLoginCard(true);
                } else {
                    history.push("/Login");
                }

                throw Error;
            })
            .finally(() => {

            });

        return await fetch(`${APIUrl}api/Orders/GetList?_eDate=${dateTrans(addDays(new Date(), -1))}&orderBy=Status`,
            {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getItemlocalStorage("Auth")}`
                },
            }
        )//查詢角色、表格翻頁
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
                    setHisTableData({ data: PreResult.response });
                    return "查詢角色表格資訊成功"
                } else {
                    throw new Error("查詢角色表格資訊失敗");
                }
            })
            .catch((Error) => {
                clearlocalStorage();
                if (window.innerWidth > 768) {
                    history.push("/");
                    setOpwnLoginCard(true);
                } else {
                    history.push("/Login");
                }

                throw Error;
            })
            .finally(() => {

            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [execute, Pending] = useAsync(getOrdersList, true);
    //#endregion

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

    //#region 取消預約API
    const cancelOrder = useCallback(async (rowData) => {
        //console.log("reOrder", rowData);
        return await fetch(`${APIUrl}api/Orders/Put`,
            {
                method: "PUT",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getItemlocalStorage("Auth")}`
                },
                body: JSON.stringify({
                    ...rowData,
                    Status: 4,
                    FootMasterId: 0,
                    IsDeleted: false,
                })
            }
        )//查詢角色、表格翻頁
            .then(() => {
                execute();
            })
            .catch((Error) => {
                clearlocalStorage();
                if (window.innerWidth > 768) {
                    history.push("/");
                    setOpwnLoginCard(true);
                } else {
                    history.push("/Login");
                }
                throw Error;
            })
            .finally(() => {

            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [executeCancelOrder, PendingCancelOrder] = useAsync(cancelOrder, false);
    //#endregion


    const resetFormData = () => {
        EmailResetValue(UserData?.response?.cEmail ?? '');
        NameResetValue(UserData?.response?.cRealName ?? '');
        PhoneResetValue(UserData?.response?.cTel ?? '');
        PassResetValue("");
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
                            <Text theme={{ display: "block" }}>
                                <Text onClick={() => { (DataEditing && setPassEditing(p => !p)) }} theme={{ ...profile.textSmallTitle, color: `${DataEditing ? "#964f19" : "#999999"}`, cursor: `${DataEditing ? "pointer" : "default"}` }} >
                                    登入密碼
                            </Text>
                            </Text>
                            {!PassEditing ? <Text theme={profile.textContentPwd}>{`·  ·  ·  ·  ·  ·`}</Text>
                                : <FormCardTextInput
                                    //label={"姓名"}
                                    //hint={""}
                                    pass
                                    value={Pass}
                                    onChange={Passhandler}
                                    regExpResult={PassregExpResult}
                                    placeholder={""}
                                    theme={{
                                        ...profile.textInput,
                                        input: {
                                            ...profile.textInput.input,
                                            ...(Pass.length > 0 ? { letterSpacing: "0.5rem" } : {})
                                        }
                                    }}
                                ></FormCardTextInput>}

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
                            }}
                                icon={<CreateIcon
                                    onClick={() => { setPassEditing(!PassEditing) }}
                                    style={{
                                        position: "relative",
                                        top: "0.1rem",
                                        height: "1rem",
                                        color: "#444",
                                        cursor: "pointer",
                                    }} />}
                                text={DataEditing ? '' : ""}
                            />}
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
                                    theme={profile.textInput}
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
                                    theme={profile.textInput}
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
                                    theme={profile.textInput}
                                ></FormCardTextInput>}
                        </BasicContainer>
                        <BasicContainer theme={profile.DataContainer}>
                            <Text theme={profile.textSmallTitle} >生日</Text>
                            <Text theme={profile.textContent}>{UserData?.response?.cBirthDay?.split('T')[0]}</Text>
                        </BasicContainer>
                        <BasicContainer theme={profile.DataContainer}>
                            <Text theme={profile.textSmallTitle} >通訊地址</Text>
                            <Text theme={profile.textContent}>{`${UserData?.response?.CommCounty ?? ''}${UserData?.response?.CommDistrict ?? ''}${UserData?.response?.CommAddr ?? ''}`}</Text>
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
                        <PageSubTitle title='最新預約' text={{ userSelect: "none", color: "#444", fontSize: "1.75em", fontWeight: 'normal', padding: " 0.2rem 0 12px 0", }}
                            container={{
                                direction: "row",
                                justify: "space-between",
                                //padding: "0 40px 0 40px ",
                                width: '100%',
                                //margin: '40px 0 24px 0',
                                //height: '3rem',
                            }} />
                        <BasicContainer theme={profile.tableBasicContainer}>
                            <CardTable data={TableData}
                                title={["預約日期", "預約編號", ""]} //必傳 title 與 colKeys 順序必需互相對應，否則名字跟資料欄會對錯
                                colKeys={["CustomerName", "OrderNo", "controll"]} //必傳
                                // turnPageExecute={(executePages) => { execute(executePages, SearchWord) }}//暫不提供，因為沒用到 發查翻頁，必傳否則不能翻頁
                                theme={{
                                    // basicContainer:{}, // 卡片最外層容器
                                    // rowContainer: {}, // 卡片內每個資料列容器樣式，可在下方針對個別欄位複寫樣式
                                    // rowTitle: {}, // 卡片內每個資料列中標題 不以renderTitle複寫時樣式
                                    // rowContent: {}, // 卡片內每個資料列中標題 不以renderContent複寫時樣式
                                    "CustomerName": {
                                        // 提供客製化渲染內容，可使用預設參數 item 與 id，item 為 對應列表資料、id 為對應列表資料的id
                                        // renderTitle: (item, id) => (`${item} ${id} sdf`)
                                        //width: "20%",
                                        renderTitle: (item, id, rowItem) => ((item &&
                                            <>




                                                <Text theme={{
                                                    display: 'inline-block',
                                                    width: '50%',
                                                    //margin: "0 0 0.375rem 0",
                                                    color: "#444",
                                                    fontSize: "22px",
                                                    fontWeight: "900"
                                                }}>{rowItem?.ShopName}</Text>

                                                <Text theme={{
                                                    display: 'inline-block',
                                                    width: '50%',
                                                    margin: "0 0 0.375rem 0",
                                                    color: "#999",
                                                    fontSize: "16px",
                                                    fontWeight: "500",
                                                    height: "0.875rem"
                                                }}>{'預約日期'}</Text>





                                            </>)),
                                        renderContent: (item, id, rowItem) => ((item &&
                                            <>
                                                <Text theme={{
                                                    display: 'inline-block',
                                                    width: '50%',
                                                    //margin: "0 0 0.375rem 0",
                                                    color: "#444",
                                                    fontSize: "1.125rem",
                                                    fontWeight: "400"
                                                }}>{rowItem?.ShopAddr}</Text>
                                                <Text style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: "vertical",
                                                    //padding: '0 5rem 0 0',
                                                    whiteSpace: 'nowarp',
                                                    //display: 'inline-box',
                                                }}
                                                    theme={{
                                                        display: "-webkit-inline-box",
                                                        width: '50%',
                                                        //margin: "0 0 0.375rem 0",
                                                        color: "#444",
                                                        fontSize: "1.125rem",
                                                        fontWeight: "900"
                                                    }}>{`${rowItem?.ReservationDate?.split("T")?.[0]} ${rowItem?.ReservationDate?.split("T")?.[1]}`}</Text>





                                            </>))
                                    },
                                    "OrderNo": {
                                        // 提供客製化渲染內容，可使用預設參數 item 與 id，item 為 對應列表資料、id 為對應列表資料的id
                                        // renderTitle: (item, id) => (`${item} ${id} sdf`)
                                        //width: "20%",
                                        renderTitle: (item, id, rowItem) => ((item &&
                                            <>

                                                <Text style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: "vertical",
                                                    //padding: '0 5rem 0 0',
                                                    whiteSpace: 'nowarp',
                                                    display: 'inline-box',
                                                }}
                                                    theme={{
                                                        display: "-webkit-inline-box",
                                                        width: '50%',
                                                        margin: "0 0 0.375rem 0",
                                                        color: "#fff",
                                                        fontSize: "0.875rem",
                                                        fontWeight: "500",
                                                        height: "1.25rem"
                                                    }}>{'預約編號'}</Text>

                                                <Text style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: "vertical",
                                                    //padding: '0 5rem 0 0',
                                                    whiteSpace: 'nowarp',
                                                    display: 'inline-box',
                                                }}
                                                    theme={{
                                                        display: "-webkit-inline-box",
                                                        width: '50%',
                                                        margin: "0 0 0.375rem 0",
                                                        color: "#999",
                                                        fontSize: "0.875rem",
                                                        fontWeight: "500",
                                                        height: "1.25rem"
                                                    }}>{'預約編號'}</Text>


                                            </>)),
                                        renderContent: (item, id, rowItem) => ((item &&
                                            <>
                                                <Text
                                                    style={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        //WebkitLineClamp: 0,
                                                        //WebkitBoxOrient: "vertical",
                                                        //padding: '0 5rem 0 0',
                                                        whiteSpace: 'nowarp',
                                                        display: 'inline-box',
                                                    }}
                                                    theme={{
                                                        display: 'inline-block',
                                                        width: '50%',
                                                        //margin: "0 0 0.375rem 0",
                                                        color: "#964f19",
                                                        fontSize: "1.125rem",
                                                        fontWeight: "400"
                                                    }}>{rowItem?.ShopTel}</Text>
                                                <Text style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    //WebkitLineClamp: 0,
                                                    //WebkitBoxOrient: "vertical",
                                                    //padding: '0 5rem 0 0',
                                                    whiteSpace: 'nowarp',
                                                    display: 'inline-box',
                                                }}
                                                    theme={{
                                                        display: 'inline-block',
                                                        width: '50%',
                                                        //margin: "0 0 0.375rem 0",
                                                        color: "#444",
                                                        fontSize: "1.125rem",
                                                        fontWeight: "400"
                                                    }}>{item}</Text>






                                            </>))
                                    },
                                    "controll": {
                                        width: "40%",
                                        rowContainer: {
                                            position: "absolute",
                                            top: "0.875rem",
                                            right: "0.2rem"
                                        },
                                        renderTitle: (item, id) => ((item && null)),
                                        renderContent: (item, id, rowItem) => {
                                            return (
                                                <BasicContainer theme={{
                                                    textAlign: "right",
                                                }}>
                                                    {[
                                                        <Text
                                                            key={`${item}1`}
                                                            theme={{
                                                                display: 'block',
                                                                //width: '35%',
                                                                margin: "0 1rem 0 0",
                                                                color: rowItem?.Status <= 1 ? "#e37f22" : rowItem?.Status === 2 ? "#d25959" : rowItem?.Status === 3 ? '#d25959' : rowItem?.Status === 4 ? '#d25959' : rowItem?.Status === 5 ? '#26b49a' : rowItem?.Status === 6 ? '#d25959' : '#d25959',

                                                                fontSize: "1rem",
                                                                fontWeight: "400",
                                                                textAlign: "right",
                                                            }}>{rowItem?.Status <= 1 ? '即將到來' : rowItem?.Status === 2 ? '客戶未到' : rowItem?.Status === 3 ? '已由顧客取消' : rowItem?.Status === 4 ? '已由系統取消' : rowItem?.Status === 5 ? '已完成' : rowItem?.Status === 6 ? '逾期未排班' : '狀態異常'}</Text>,
                                                        <EasyButton
                                                            key={`${item}2`}
                                                            onClick={() => {

                                                                let { ReservationDate, OrderNo, ShopName, CustomerName, MasterName, AllService, FootMeasureService, IsHelp, WhereKnow, WillingIntroduce, ServiceRemark } = rowItem;
                                                                let resaveRowItem = { ReservationDate, OrderNo, ShopName, CustomerName, MasterName, AllService, FootMeasureService, IsHelp, WhereKnow, WillingIntroduce, ServiceRemark };

                                                                rowItem?.Status <= 1 ?
                                                                    portalService.warn({
                                                                        autoClose: false,
                                                                        yes: () => { rowItem?.Status <= 1 ? executeCancelOrder(rowItem) : history.push(`ReservationList/${rowItem?.Id}?data=${JSON.stringify(resaveRowItem)}`) },
                                                                        yesText: "是，取消預約",
                                                                        noText: "否，繼續瀏覽",
                                                                        content: (
                                                                            <>
                                                                                <Text theme={profile.exportText}>
                                                                                    {`確定取消${rowItem?.ReservationDate?.split('T')?.[0]}在${rowItem?.ShopName}的預約嗎`}
                                                                                </Text>

                                                                            </>)
                                                                    }) : history.push(`ReservationList/${rowItem?.Id}?data=${JSON.stringify(resaveRowItem)}`)
                                                            }}
                                                            theme={rowItem?.Status <= 1 ? profile.exportButton : (rowItem?.Status === 5 && rowItem?.AllService !== 0) ? profile.checkServiceButton : { display: 'none' }}
                                                            text={rowItem?.Status <= 1 ? "取消預約" : '查看評論'}
                                                        />
                                                    ]}
                                                </BasicContainer>
                                            )
                                        }
                                    },
                                }}
                            />
                        </BasicContainer>
                        <PageSubTitle title='歷史紀錄' text={{ userSelect: "none", color: "#444", fontSize: "1.75em", fontWeight: 'normal', padding: " 0.2rem 0 12px 0", }}
                            container={{
                                direction: "row",
                                justify: "space-between",
                                //padding: "0 40px 0 40px ",
                                width: '100%',
                                //margin: '40px 0 24px 0',
                                //height: '3rem',
                            }} />
                        <BasicContainer theme={profile.tableBasicContainer}>
                            <CardTable data={HisTableData}
                                title={["預約日期", "預約編號",]} //必傳 title 與 colKeys 順序必需互相對應，否則名字跟資料欄會對錯
                                colKeys={["CustomerName", "OrderNo",]} //必傳
                                // turnPageExecute={(executePages) => { execute(executePages, SearchWord) }}//暫不提供，因為沒用到 發查翻頁，必傳否則不能翻頁
                                theme={{
                                    // basicContainer:{}, // 卡片最外層容器
                                    // rowContainer: {}, // 卡片內每個資料列容器樣式，可在下方針對個別欄位複寫樣式
                                    // rowTitle: {}, // 卡片內每個資料列中標題 不以renderTitle複寫時樣式
                                    // rowContent: {}, // 卡片內每個資料列中標題 不以renderContent複寫時樣式
                                    "CustomerName": {
                                        // 提供客製化渲染內容，可使用預設參數 item 與 id，item 為 對應列表資料、id 為對應列表資料的id
                                        // renderTitle: (item, id) => (`${item} ${id} sdf`)
                                        //width: "20%",
                                        renderTitle: (item, id, rowItem) => ((item &&
                                            <>




                                                <Text theme={{
                                                    display: 'inline-block',
                                                    width: '50%',
                                                    //margin: "0 0 0.375rem 0",
                                                    color: "#444",
                                                    fontSize: "22px",
                                                    fontWeight: "900"
                                                }}>{rowItem?.ShopName}</Text>

                                                <Text theme={{
                                                    display: 'inline-block',
                                                    width: '50%',
                                                    margin: "0 0 0.375rem 0",
                                                    color: "#999",
                                                    fontSize: "16px",
                                                    fontWeight: "500",
                                                    height: "0.875rem"
                                                }}>{'預約日期'}</Text>





                                            </>)),
                                        renderContent: (item, id, rowItem) => ((item &&
                                            <>
                                                <Text theme={{
                                                    display: 'inline-block',
                                                    width: '50%',
                                                    //margin: "0 0 0.375rem 0",
                                                    color: "#444",
                                                    fontSize: "1.125rem",
                                                    fontWeight: "400"
                                                }}>{rowItem?.ShopAddr}</Text>
                                                <Text style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: "vertical",
                                                    //padding: '0 5rem 0 0',
                                                    whiteSpace: 'nowarp',
                                                    //display: 'inline-box',
                                                }}
                                                    theme={{
                                                        display: "-webkit-inline-box",
                                                        width: '50%',
                                                        //margin: "0 0 0.375rem 0",
                                                        color: "#444",
                                                        fontSize: "1.125rem",
                                                        fontWeight: "900"
                                                    }}>{`${rowItem?.ReservationDate?.split("T")?.[0]} ${rowItem?.ReservationDate?.split("T")?.[1]}`}</Text>





                                            </>))
                                    },
                                    "OrderNo": {
                                        // 提供客製化渲染內容，可使用預設參數 item 與 id，item 為 對應列表資料、id 為對應列表資料的id
                                        // renderTitle: (item, id) => (`${item} ${id} sdf`)
                                        //width: "20%",
                                        renderTitle: (item, id, rowItem) => ((item &&
                                            <>

                                                <Text style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: "vertical",
                                                    //padding: '0 5rem 0 0',
                                                    whiteSpace: 'nowarp',
                                                    display: 'inline-box',
                                                }}
                                                    theme={{
                                                        display: "-webkit-inline-box",
                                                        width: '50%',
                                                        margin: "0 0 0.375rem 0",
                                                        color: "#fff",
                                                        fontSize: "0.875rem",
                                                        fontWeight: "500",
                                                        height: "1.25rem"
                                                    }}>{'預約編號'}</Text>

                                                <Text style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: "vertical",
                                                    //padding: '0 5rem 0 0',
                                                    whiteSpace: 'nowarp',
                                                    display: 'inline-box',
                                                }}
                                                    theme={{
                                                        display: "-webkit-inline-box",
                                                        width: '50%',
                                                        margin: "0 0 0.375rem 0",
                                                        color: "#999",
                                                        fontSize: "0.875rem",
                                                        fontWeight: "500",
                                                        height: "1.25rem"
                                                    }}>{'預約編號'}</Text>


                                            </>)),
                                        renderContent: (item, id, rowItem) => ((item &&
                                            <>
                                                <Text
                                                    style={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        //WebkitLineClamp: 0,
                                                        //WebkitBoxOrient: "vertical",
                                                        //padding: '0 5rem 0 0',
                                                        whiteSpace: 'nowarp',
                                                        display: 'inline-box',
                                                    }}
                                                    theme={{
                                                        display: 'inline-block',
                                                        width: '50%',
                                                        //margin: "0 0 0.375rem 0",
                                                        color: "#964f19",
                                                        fontSize: "1.125rem",
                                                        fontWeight: "400"
                                                    }}>{rowItem?.ShopTel}</Text>
                                                <Text style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    //WebkitLineClamp: 0,
                                                    //WebkitBoxOrient: "vertical",
                                                    //padding: '0 5rem 0 0',
                                                    whiteSpace: 'nowarp',
                                                    display: 'inline-box',
                                                }}
                                                    theme={{
                                                        display: 'inline-block',
                                                        width: '50%',
                                                        //margin: "0 0 0.375rem 0",
                                                        color: "#444",
                                                        fontSize: "1.125rem",
                                                        fontWeight: "400"
                                                    }}>{item}</Text>






                                            </>))
                                    },
                                    "controll": {
                                        width: "40%",
                                        rowContainer: {
                                            position: "absolute",
                                            top: "0.875rem",
                                            right: "0.2rem"
                                        },
                                        renderTitle: (item, id) => ((item && null)),
                                        renderContent: (item, id, rowItem) => {
                                            return (
                                                <BasicContainer theme={{
                                                    textAlign: "right",
                                                }}>
                                                    {[
                                                        <Text
                                                            key={`${item}1`}
                                                            theme={{
                                                                display: 'block',
                                                                //width: '35%',
                                                                margin: "0 1rem 0 0",
                                                                color: rowItem?.Status <= 1 ? "#e37f22" : rowItem?.Status === 2 ? "#d25959" : rowItem?.Status === 3 ? '#d25959' : rowItem?.Status === 4 ? '#d25959' : rowItem?.Status === 5 ? '#26b49a' : rowItem?.Status === 6 ? '#d25959' : '#d25959',

                                                                fontSize: "1rem",
                                                                fontWeight: "400",
                                                                textAlign: "right",
                                                            }}>{rowItem?.Status <= 1 ? '即將到來' : rowItem?.Status === 2 ? '客戶未到' : rowItem?.Status === 3 ? '已由顧客取消' : rowItem?.Status === 4 ? '已由系統取消' : rowItem?.Status === 5 ? '已完成' : rowItem?.Status === 6 ? '逾期未排班' : '狀態異常'}</Text>,
                                                        <EasyButton
                                                            key={`${item}2`}
                                                            onClick={() => {

                                                                let { ReservationDate, OrderNo, ShopName, CustomerName, MasterName, AllService, FootMeasureService, IsHelp, WhereKnow, WillingIntroduce, ServiceRemark } = rowItem;
                                                                let resaveRowItem = { ReservationDate, OrderNo, ShopName, CustomerName, MasterName, AllService, FootMeasureService, IsHelp, WhereKnow, WillingIntroduce, ServiceRemark };

                                                                rowItem?.Status <= 1 ?
                                                                    portalService.warn({
                                                                        autoClose: false,
                                                                        yes: () => { rowItem?.Status <= 1 ? executeCancelOrder(rowItem) : history.push(`ReservationList/${rowItem?.Id}?data=${JSON.stringify(resaveRowItem)}`) },
                                                                        yesText: "是，取消預約",
                                                                        noText: "否，繼續瀏覽",
                                                                        content: (
                                                                            <>
                                                                                <Text theme={profile.exportText}>
                                                                                    {`確定取消${rowItem?.ReservationDate?.split('T')?.[0]}在${rowItem?.ShopName}的預約嗎`}
                                                                                </Text>

                                                                            </>)
                                                                    }) : history.push(`ReservationList/${rowItem?.Id}?data=${JSON.stringify(resaveRowItem)}`)
                                                            }}
                                                            theme={rowItem?.Status <= 1 ? profile.exportButton : (rowItem?.Status === 5 && rowItem?.AllService !== 0) ? profile.checkServiceButton : { display: 'none' }}
                                                            text={rowItem?.Status <= 1 ? "取消預約" : '查看評論'}
                                                        />
                                                    ]}
                                                </BasicContainer>
                                            )
                                        }
                                    },
                                }}
                            />
                        </BasicContainer>
                    </SubContainer>
                </Container>
            </BasicContainer>
            }

            {/* 寬度小於768時渲染的組件 */}
            {width <= 768 && <BasicContainer theme={profile.basicContainer}>
                <Container theme={{ direction: 'column', alignItems: 'center', justify: 'center', margin: '0 0 4rem 0' }}>

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
                            left: '120px',
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
                        <Text theme={{ display: "block" }}>
                            <Text onClick={() => { (DataEditing && setPassEditing(p => !p)) }} theme={{ ...profile.textSmallTitle, color: `${DataEditing ? "#964f19" : "#999999"}`, cursor: `${DataEditing ? "pointer" : "default"}` }} >
                                登入密碼
                            </Text>
                        </Text>
                        {!PassEditing ? <Text theme={profile.textContentPwd}>{`·  ·  ·  ·  ·  ·`}</Text>
                            : <FormCardTextInput
                                //label={"姓名"}
                                //hint={""}
                                pass
                                value={Pass}
                                onChange={Passhandler}
                                regExpResult={PassregExpResult}
                                placeholder={""}
                                theme={{
                                    ...profile.textInputLessThan768,
                                    input: {
                                        ...profile.textInputLessThan768.input,
                                        ...(Pass.length > 0 ? { letterSpacing: "0.5rem" } : {})
                                    }
                                }}
                            ></FormCardTextInput>}

                        {DataEditing && !PassEditing && < EasyButton theme={{
                            backgroundColor: "#fff",
                            display: "inline-block",
                            position: 'absolute',
                            top: '0',
                            left: '120px',
                            width: "8rem",
                            height: "2rem",
                            lineHeight: "2rem",
                            color: '#fff',
                            textAlign: "center",
                            //hoverColor: DataEditing ? 'rgb(38, 180, 154)' : "#666",
                            fontSize: "0.875rem",
                        }}
                            icon={<CreateIcon
                                onClick={() => { setPassEditing(!PassEditing) }}
                                style={{
                                    position: "relative",
                                    top: "0.1rem",
                                    height: "1rem",
                                    color: "#444",
                                    cursor: "pointer",
                                }} />}
                            text={DataEditing ? '' : ""}
                        />}
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
                                theme={profile.textInputLessThan768}
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
                                theme={profile.textInputLessThan768}
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
                                theme={profile.textInputLessThan768}
                            ></FormCardTextInput>}
                    </BasicContainer>
                    <BasicContainer theme={profile.DataContainer}>
                        <Text theme={profile.textSmallTitle} >生日</Text>
                        <Text theme={profile.textContent}>{UserData?.response?.cBirthDay?.split('T')[0]}</Text>
                    </BasicContainer>
                    <BasicContainer theme={profile.DataContainer}>
                        <Text theme={profile.textSmallTitle} >通訊地址</Text>
                        <Text theme={profile.textContent}>{`${UserData?.response?.CommCounty ?? ''}${UserData?.response?.CommDistrict ?? ''}${UserData?.response?.CommAddr ?? ''}`}</Text>
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

                </Container>
            </BasicContainer>
            }

        </>
    )
}