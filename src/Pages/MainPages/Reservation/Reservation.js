import React, { useContext, useCallback, useState, useEffect } from 'react';
import { Context } from '../../../Store/store'
import { BasicContainer, SubContainer, Container } from '../../../Components/Containers';
import { dateTrans } from '../../../Handlers/DateHandler';
import { clearlocalStorage, getItemlocalStorage, setItemlocalStorage } from '../../../Handlers/LocalStorageHandler';
import { useHistory, useLocation } from 'react-router-dom';
import { useWindowSize } from '../../../SelfHooks/useWindowSize'
import GoogleMapReact from 'google-map-react';
import HomeIcon from '@material-ui/icons/Home';
import { useAsync } from '../../../SelfHooks/useAsync';
import { FormControl, FormRow, FormCardTextInput, FormCardSelector, CheckboxWhatever, FormCardLeftIconSelector } from '../../../Components/Forms';
import { YearFrom1930to, Counties, cityAndCountiesLite, getDayByYearAndMonth, month, hours } from '../../../Mappings/Mappings';
import { useForm, useSelector } from '../../../SelfHooks/useForm';
import { SingleDatePicker, SingleDatePicker2 } from '../../../Components/DatePicker';
import { Text } from '../../../Components/Texts'
import { EasyButton } from '../../../Components/Buttons';
import { PageSubTitle, PageSubTitleMobile } from '../../../Components/PageSubTitle';
import { alertService } from '../../../Components/JumpAlerts';
import { portalService } from '../../../Components/Portal';
import { MyStepper } from '../../../Components/Stepper';

export const Reservation = (props) => {

    const { APIUrl, Theme, setOpwnLoginCard, Switch } = useContext(Context);
    const { pages: { reservationPage: { reservation } } } = Theme;
    let history = useHistory();
    const [width] = useWindowSize();
    let urlParams = new URLSearchParams(useLocation().search);//取得參數
    let data = JSON.parse(urlParams.get("data"));

    const [UserData, setUserData] = useState(JSON.parse(getItemlocalStorage("LoginData")));
    const [GmapData, setGmapData] = useState({});
    const [ShopData, setShopData] = useState('');
    const [MasterData, setMasterData] = useState({});
    const [IsLogin, setIsLogin] = useState(getItemlocalStorage("Auth") ? true : false);

    const [County, Countyhandler, CountyregExpResult, CountyResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇縣市"]); // 直轄地區欄位
    const [District, Districthandler, DistrictregExpResult, DistrictResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇行政區"]); // 直轄地區欄位
    const [Addr, Addrhandler, AddrregExpResult, AddrResetValue] = useForm("", ["^.{1,}$"], ["請輸入詳細地址"]); // 地址欄位
    const [ShopChoosen, ShopChoosenhandler, ShopChoosenregExpResult, ShopChoosenResetValue] = useForm("", [], []); // 
    const [DateRegion, DateRegionhandler, DateRegionregExpResult, DateRegionResetValue] = useForm('', [""], [""]);//日期區間欄位
    const [Time, Timehandler, TimeregExpResult, TimeResetValue] = useSelector("", [], []);
    const [OkTime, OkTimehandler, OkTimeregExpResult, OkTimeResetValue] = useSelector("", [], []);
    const [Agreement, setAgreement] = useState(false); // 同意條款
    const [Remark, Remarkhandler, RemarkregExpResult, RemarkResetValue] = useForm("", [], []); // 備註欄位
    console.log(IsLogin);

    const [Phone, Phonehandler, PhoneregExpResult, PhoneResetValue] = useForm("", ["^.{1,}$", "^09[0-9]{8}$"], ["請輸入正確手機號碼", "請輸入正確手機格式"]); // 管理員手機欄位
    const [Email, Emailhandler, EmailregExpResult, EmailResetValue] = useForm("", ["^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z]+$"], ["請輸入正確E-mail格式"]); // Email欄位
    const [NewCounty, NewCountyhandler, NewCountyregExpResult, NewCountyResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇縣市"]); // 直轄地區欄位
    const [NewDistrict, NewDistricthandler, NewDistrictregExpResult, NewDistrictResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇行政區"]); // 直轄地區欄位
    const [NewAddr, NewAddrhandler, NewAddrregExpResult, NewAddrResetValue] = useForm("", ["^.{1,}$"], ["請輸入詳細地址"]); // 地址欄位
    const [Name, Namehandler, NameregExpResult, NameResetValue] = useForm("", ["^[\u4E00-\u9FA5]{1,}$", "^.{1,5}$"], ["請輸入中文姓名", "姓名最長為5個中文字"]); // 足健師姓名欄位
    const [Account, Accounthandler, AccountregExpResult, AccountResetValue] = useForm("", ["^.{1,}$", "^[0-9]{1,}$", "^.{1,999}$"], ["請輸入工號", "工號限使用數字", "最長為999個數字"]); //足健師工號欄位
    const [Pass, Passhandler, PassregExpResult, PassResetValue] = useForm("", ["^.{1,}$", "^[0-9]{1,}$", "^.{1,999}$"], ["請輸入工號", "工號限使用數字", "最長為999個數字"]); //足健師工號欄位
    const [BirthYear, BirthYearhandler, BirthYearregExpResult, BirthYearResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇生日西元年"]); // 生日西元年欄位
    const [BirthMonth, BirthMonthhandler, BirthMonthregExpResult, BirthMonthResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇生日月份"]);// 生日月份欄位
    const [BirthDay, BirthDayhandler, BirthDayregExpResult, BirthDayResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇生日日期"]); // 生日日期欄位

    const [Step, setStep] = useState(0);

    useEffect(() => {
        if (!!data && !!ShopData) {
            let DataCounty = Counties.filter((item) => item.value === data?.County);
            let DataDistrict = cityAndCountiesLite[data?.County].filter((item) => item.value === data?.District);
            let ShopArray = filterShop(ShopData, DataCounty[0], DataDistrict[0]).filter((item) => item?.Id === data?.Id);
            let AutoShop = ShopArray[ShopArray.length - 1];
            console.log("Data is", data, DataCounty, DataDistrict, AutoShop)//從網址取得參數
            CountyResetValue(DataCounty[0]);
            DistrictResetValue(DataDistrict[0]);
            ShopChoosenResetValue(AutoShop);
            executeGetNewLocation(`${data?.County ?? ''}${data?.District ?? ''}${data?.Addr ?? ''}`);
        }
        else {
            console.log("nothing")//從網址取得參數
        }
    }, [ShopData]);


    //#region 查詢列表API
    const getOrdersList = useCallback(async () => {

        await fetch(`${APIUrl}api/Shops/GetList`,
            {
                headers: {
                    'content-type': 'application/json',
                    //'Authorization': `Bearer ${getItemlocalStorage("Auth")}`
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
                    let data = PreResult.response.map((item) => { return { ...item, value: item?.ShopName, label: item?.ShopName } })
                    setShopData(data);
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

        return await fetch(`${APIUrl}api/FootMaster/GetList`,
            {
                headers: {
                    'content-type': 'application/json',
                    //'Authorization': `Bearer ${getItemlocalStorage("Auth")}`
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
                    let data = PreResult.response.map((item) => { return { ...item, value: item?.mRealName, label: item?.mRealName } })
                    //console.log(data)
                    setMasterData(data);
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

    //#region 查詢座標API
    const getLocation = useCallback(async () => {

        return await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${UserData?.response?.CommCounty ?? '新北市板橋區板新路'}${UserData?.response?.CommDistrict ?? ''}${UserData?.response?.CommAddr ?? ''}&key=AIzaSyA1h_cyazZLo1DExB0h0B2JBuOfv-yFtsM`,

        )//查詢角色、表格翻頁
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                // if (PreResult.Status === 401) {
                //     //Token過期 強制登出
                //     clearlocalStorage();
                //     if (window.innerWidth > 768) {
                //         history.push("/");
                //         setOpwnLoginCard(true);
                //     } else {
                //         history.push("/Login");
                //     }

                //     throw new Error("Token過期 強制登出");
                // }

                if (PreResult.status === 'OK') {
                    console.log(PreResult)
                    setGmapData(PreResult);
                    return "查詢角色表格資訊成功"
                } else {
                    throw new Error("查詢角色表格資訊失敗");
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

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [executeGetLocation, PendingGetLocation] = useAsync(getLocation, true);
    //#endregion

    //#region 新增訂單API 
    const addOrder = useCallback(async (ShopId, Uid, UserRemark, Date, Time) => {
        //return console.log("加訂單", ShopId, Uid, UserRemark, `${dateTrans(Date)}T${Time?.value}`, Time)
        //return console.log(Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr)
        return await fetch(`${APIUrl}api/Orders/Post`,
            {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getItemlocalStorage("Auth")}`

                },
                body: JSON.stringify({
                    IsDeleted: false,
                    ReservationDate: `${dateTrans(Date)}T${Time?.value}`,
                    ShopId: ShopId,
                    Status: 0,
                    Uid: Uid,
                    UserRemark: UserRemark,
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
                    alertService.normal("成功新增訂單資訊", { autoClose: true });
                    return "成功新增顧客資訊"
                } else {
                    alertService.warn(PreResult.msg, { autoClose: true });
                    throw new Error("新增訂單資訊失敗");
                }
            })
            .catch((Error) => {
                throw Error;
            })
            .finally(() => {
                props?.close && props.close()
                history.push('/Profile');
                Switch();//觸發LS路由重新更新
            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [addOrderExecute, addOrderPending] = useAsync(addOrder, false);
    //#endregion

    //#region 未登入時，新增帳號&登入拿token&建立訂單API 
    const newUserDoTheseThings = useCallback(async (ShopId, Uid, UserRemark, cDate, Time, Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr) => {
        //return console.log("加訂單", ShopId, Uid, UserRemark, `${dateTrans(Date)}T${Time?.value}`, Time)
        //return console.log(Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr)
        let newUid = '';
        //建立帳號
        await fetch(`${APIUrl}api/UserInfo/Post`,
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
                    // clearlocalStorage();
                    // history.push("/Login");
                    // throw new Error("Token過期 強制登出");
                }

                if (PreResult.success) {
                    //alertService.normal("成功新增顧客資訊", { autoClose: true });
                    return "成功新增顧客資訊"
                } else {
                    //alertService.warn(PreResult.msg, { autoClose: true });
                    throw new Error("新增顧客資訊失敗");
                }
            })
            .catch((Error) => {
                console.warn(Error);
                throw Error;
            })
            .finally(() => {
                // props?.close && props.close()
                // history.push('/Profile');
                // Switch();//觸發LS路由重新更新
            });

        //登入並拿token
        await fetch(`${APIUrl}api/Login/CustomerLogin?acc=${Email}&pwd=${Phone}`,
            {
                method: "POST",
                body: JSON.stringify({
                    acc: Email,
                    pwd: Phone
                })
            })//取得Token
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                if (PreResult.success) {
                    setItemlocalStorage("LoginData", JSON.stringify(PreResult));
                    newUid = PreResult.response?.Id;
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
                                    <Text theme={reservation.exportText}>
                                        {PreResult.msg}
                                    </Text>
                                </>)
                        })
                    }
                    throw new Error("使用者資訊錯誤");
                }
            })
            .catch((Error) => {
                console.warn(Error);
                throw Error;
            })
            .finally(() => {
                //Switch();//觸發LS路由重新更新
            });

        await fetch(`${APIUrl}api/Login/JWTTokenCustomer?name=${Email}&pass=${Phone}`)//透過Token取得使用者資訊
            .then(Result => {
                //portalService.clear();
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                //console.log(PreResult)
                if (PreResult.success) {
                    setItemlocalStorage("Auth", PreResult.token);
                    //setIsLogin(true);
                    //儲存 跨組件State LoginName: "test",
                    //setItemlocalStorage("LoginName", PreResult.response.uRealName);
                    //uid = PreResult.response.Id;
                } else {
                    clearlocalStorage();
                    throw new Error("取得Token失敗");
                }
            })
            .catch((Error) => {
                console.warn(Error);
                clearlocalStorage();
                throw Error;
            })
            .finally(() => {
                // props?.close && props.close()
                // history.push('/Profile');
                // Switch();//觸發LS路由重新更新
            });

        //新增訂單
        return await fetch(`${APIUrl}api/Orders/Post`,
            {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getItemlocalStorage("Auth")}`

                },
                body: JSON.stringify({
                    IsDeleted: false,
                    ReservationDate: `${dateTrans(cDate)}T${Time?.value}`,
                    ShopId: ShopId,
                    Status: 0,
                    Uid: newUid,
                    UserRemark: UserRemark,
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
                    alertService.normal("成功新增訂單資訊", { autoClose: true });
                    return "成功新增顧客資訊"
                } else {
                    alertService.warn(PreResult.msg, { autoClose: true });
                    throw new Error("新增訂單資訊失敗");
                }
            })
            .catch((Error) => {
                console.warn(Error);
                throw Error;
            })
            .finally(() => {
                props?.close && props.close()
                history.push('/Profile');
                Switch();//觸發LS路由重新更新
            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [newUserDoTheseThingsExecute, newUserDoTheseThingsPending] = useAsync(newUserDoTheseThings, false);
    //#endregion

    const filterShop = (array, County, District) => {
        //console.log("filterShop", array, County, District)
        if (County && District) {
            let matchArea = County?.value.replace('臺', '台');

            let matchArea2 = District?.value.replace('臺', '台');
            //console.log(day);
            let filterArray = array.filter((item) => { return ((item?.County === County?.value || item?.County === matchArea) && (item?.District === District?.value || item?.District === matchArea2)) });
            // let filterArray2 = filterArray.filter((item) => { return fliterTimeFunc(item, day, time) });
            //console.log("filter", filterArray);
            return filterArray;
        }

        return [];
    }


    const dayMapping = {
        1: "MondayService",
        2: "TuesdayService",
        3: "WednesdayService",
        4: "ThursdayService",
        5: "FridayService",
        6: "SaturdayService",
        0: "SundayService",

    }
    const filterMaster = (array, order, date, timeSelect) => {
        console.log(order, date, timeSelect)
        if (order && date && timeSelect) {
            let matchArea = order?.County + order?.District;
            matchArea = matchArea.replace('台', '臺');
            // let matchArea2 = order?.ShopAddr.slice(0, 5);//前五個字 ex台中市南區
            // matchArea2 = matchArea2.replace('台', '臺');
            let day = new Date(date).getDay();//星期幾
            let time = timeSelect?.value;
            //console.log(day);
            let filterArray = array.filter((item) => { return fliterAreaFunc(item, matchArea, matchArea) });
            console.log(filterArray);
            let res = [];
            filterArray.forEach((item, index) => {
                let serviceTime = item?.[dayMapping[day]].split('-');
                if (time >= serviceTime[0] && time <= serviceTime[1]) {
                    console.log(item?.[dayMapping[day]])
                    res.push({ ...item, label: `足健師服務時間: ${item?.[dayMapping[day]]}` })
                }
            })
            return res;
            // let filterArray2 = filterArray.filter((item) => { return fliterTimeFunc(item, day, time) });


            //console.log("filter", filterArray);
            //return filterArray2;
        }

        return [];
    }

    const fliterAreaFunc = (item, matchArea, matchArea2) => {
        //console.log("testTF", item, matchArea, matchArea2);
        let serviceArray = item?.ServiceArea.split(',');
        for (let i = 0; i < serviceArray.length; i++) {
            if (serviceArray[i] === matchArea || serviceArray[i] === matchArea2) {
                return true;
            }
        }
        return false;
    }

    const fliterTimeFunc = (item, day, time) => {
        //console.log(item, day, time)
        if (day === 4) {
            let serviceTime = item?.ThursdayService.split('-');
            if (time >= serviceTime[0] && time <= serviceTime[1]) {
                return { ...item, label: `足健師服務時間: ${item?.ThursdayService}` };
            }
            else
                return false;
        } else if (day === 5) {
            let serviceTime = item?.FridayService.split('-');
            if (time >= serviceTime[0] && time <= serviceTime[1]) {
                return { ...item, label: `足健師服務時間: ${item?.FridayService}` };
            }
            else
                return false;
        } else if (day === 6) {
            let serviceTime = item?.SaturdayService.split('-');
            if (time >= serviceTime[0] && time <= serviceTime[1]) {
                return { ...item, label: `足健師服務時間: ${item?.SaturdayService}` };
            }
            else
                return false;
        } else if (day === 0) {
            let serviceTime = item?.SundayService.split('-');
            if (time >= serviceTime[0] && time <= serviceTime[1]) {
                return { ...item, label: `足健師服務時間: ${item?.SundayService}` };
            }
            else
                return false;
        } else if (day === 1) {
            let serviceTime = item?.MondayService.split('-');
            if (time >= serviceTime[0] && time <= serviceTime[1]) {
                return { ...item, label: `足健師服務時間: ${item?.MondayService}` };
            }
            else
                return false;
        } else if (day === 2) {
            let serviceTime = item?.TuesdayService.split('-');
            if (time >= serviceTime[0] && time <= serviceTime[1]) {
                return { ...item, label: `足健師服務時間: ${item?.TuesdayService}` };
            }
            else
                return false;
        } else if (day === 3) {
            let serviceTime = item?.WednesdayService.split('-');
            if (time >= serviceTime[0] && time <= serviceTime[1]) {
                return { ...item, label: `足健師服務時間: ${item?.WednesdayService}` };
            }
            else
                return false;
        }
        else {
            return false;
        }

    }

    const getNewLocation = useCallback(async (addr) => {

        return await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=AIzaSyA1h_cyazZLo1DExB0h0B2JBuOfv-yFtsM`,

        )//查詢角色、表格翻頁
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                // if (PreResult.Status === 401) {
                //     //Token過期 強制登出
                //     clearlocalStorage();
                //     if (window.innerWidth > 768) {
                //         history.push("/");
                //         setOpwnLoginCard(true);
                //     } else {
                //         history.push("/Login");
                //     }

                //     throw new Error("Token過期 強制登出");
                // }

                if (PreResult.status === 'OK') {
                    console.log(PreResult)
                    setGmapData(PreResult);
                    return "查詢角色表格資訊成功"
                } else {
                    throw new Error("查詢角色表格資訊失敗");
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

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [executeGetNewLocation, PendingGetNewLocation] = useAsync(getNewLocation, false);
    //#endregion


    return (
        <>
            {/* 寬度大於等於768且已登入時渲染的組件 */}
            {(width > 768 && IsLogin) && <BasicContainer theme={reservation.basicContainer}>
                <Container>
                    <SubContainer theme={{ width: '362px', padding: '0 1rem 0 0 ' }}>
                        <PageSubTitle title='預約足測' text={{ userSelect: "none", color: "#444", fontSize: "1.75em", fontWeight: 'normal', padding: " 0.2rem 0 8px 0", }}
                            container={{
                                direction: "row",
                                justify: "space-between",
                                //padding: "0 40px 0 40px ",
                                width: '100%',
                                margin: '-53px 0 24px 0',
                                //height: '3rem',
                            }} />
                        <FormControl theme={{
                            width: "100%",

                            //overflowY: "scroll",
                            //height: "calc( 100% - 20.1rem )"
                        }} sumbit={true} onSubmit={(e) => { e.preventDefault(); /*execute(Account, Pass);*/ }}>


                            <Text>請搜尋您欲前往的服務門市</Text>
                            <FormRow>
                                <FormCardSelector
                                    //label={""}
                                    //hint={""}
                                    placeholder={"縣市"}
                                    value={County}
                                    isSearchable
                                    options={Counties}
                                    //defaultValue={ { value: '1', label: 'Chocolate' }}
                                    onChange={(value) => { CountyResetValue(value); DistrictResetValue(''); ShopChoosenResetValue('') }}
                                    regExpResult={CountyregExpResult}
                                    theme={reservation.birthFormCardSelector}
                                ></FormCardSelector>
                                <FormCardSelector
                                    //label={""}
                                    //hint={""}
                                    placeholder={"行政區"}
                                    value={District}
                                    isSearchable
                                    options={cityAndCountiesLite[County.value]}
                                    //defaultValue={ { value: '1', label: 'Chocolate' }}
                                    onChange={(value) => { DistrictResetValue(value); ShopChoosenResetValue('') }}
                                    regExpResult={DistrictregExpResult}
                                    theme={reservation.birthFormCardSelector}
                                ></FormCardSelector>
                                <FormCardSelector
                                    //label={""}
                                    //hint={""}
                                    placeholder={"門市"}
                                    value={ShopChoosen}
                                    isSearchable
                                    options={filterShop(ShopData, County, District)}
                                    //defaultValue={ { value: '1', label: 'Chocolate' }}
                                    onChange={(value) => { ShopChoosenResetValue(value); executeGetNewLocation(`${value.County}${value.District}${value.Addr}`); }}
                                    regExpResult={ShopChoosenregExpResult}
                                    theme={reservation.birthFormCardSelector}
                                ></FormCardSelector>
                            </FormRow>
                            <FormRow>
                                <SubContainer theme={{ occupy: 6 }}>
                                    <SingleDatePicker2
                                        getDate={DateRegionResetValue}
                                        value={DateRegion}// [startDate,endDate]
                                    //doThings={(date) => { props.execute(dateTrans(date), dateTrans(date), SearchWord); }}
                                    ></SingleDatePicker2>
                                </SubContainer>
                                <FormCardLeftIconSelector
                                    clearIconLeft='150%'
                                    label={"預約時段"}
                                    hint={""}
                                    placeholder={"預約時段"}
                                    value={Time}
                                    isSearchable
                                    isClearable
                                    options={hours}
                                    onChange={(values) => { TimeResetValue(values) }}
                                    regExpResult={TimeregExpResult}
                                    theme={reservation.locationFormCardTextInput}
                                ></FormCardLeftIconSelector>
                            </FormRow>
                            <FormRow>
                                <FormCardSelector
                                    //label={""}
                                    //hint={""}
                                    placeholder={filterMaster(MasterData, ShopChoosen, DateRegion, Time)?.length > 0 ? "選擇可預約時段" : '該時段無服務足健師，請重新選擇'}
                                    value={OkTime}
                                    isSearchable
                                    options={filterMaster(MasterData, ShopChoosen, DateRegion, Time)}
                                    //defaultValue={ { value: '1', label: 'Chocolate' }}
                                    onChange={(value) => { OkTimeResetValue(value) }}
                                    regExpResult={OkTimeregExpResult}
                                    theme={reservation.okTimeSelector}
                                ></FormCardSelector>
                            </FormRow>


                        </FormControl>
                        <Container>
                            <SubContainer theme={{ occupy: 12, margin: '32px 0 0 0 ' }}>
                                <Container theme={{ direction: 'column' }}>
                                    <Text theme={reservation.textSmallTitle}>選擇門市</Text>
                                    <Text theme={{ ...reservation.textContent, fontSize: '1.125rem', fontWeight: "700", }}>{ShopChoosen?.ShopName}</Text>
                                </Container>
                                <Container theme={{ direction: 'column' }}>
                                    <Text theme={reservation.textSmallTitle}>門市地址</Text>
                                    <Text theme={reservation.textContent}>{`${ShopChoosen?.County ?? ''}${ShopChoosen?.District ?? ''}${ShopChoosen?.Addr ?? ''}`}</Text>
                                </Container>
                            </SubContainer>
                            <SubContainer theme={{ occupy: 6 }}>
                                <Container theme={{ direction: 'column' }}>
                                    <Text theme={reservation.textSmallTitle}>門市電話</Text>
                                    <Text theme={{ ...reservation.textContent, color: "#964f19" }}>{ShopChoosen?.ShopTel}</Text>
                                </Container>

                            </SubContainer>
                            <SubContainer theme={{ occupy: 6 }}>
                                <Container theme={{ direction: 'column' }}>
                                    <Text theme={reservation.textSmallTitle}>預約人數</Text>
                                    <Text theme={reservation.textContent}>１人</Text>
                                </Container>

                            </SubContainer>
                            <SubContainer theme={{ occupy: 12, margin: '0 0 16px 0' }}>
                                <Container theme={{ direction: 'column' }}>
                                    <Text onClick={() => { setAgreement(a => !a) }} theme={{ display: "inline-block", fontSize: "0.75rem", color: "#787676", cursor: "pointer" }}>
                                        <CheckboxWhatever checked={Agreement} onChange={() => { /* 不需要做事，用上面的onClick控制 */ }}></CheckboxWhatever>
                                    我同意阿瘦集團服務條款及隱私政策、收到最新活動訊息
                                </Text>
                                </Container>
                            </SubContainer>
                            <SubContainer theme={{ occupy: 12 }}>
                                <Container theme={{ direction: 'column' }}>
                                    <FormCardTextInput
                                        label={"備註"}
                                        //hint={""}
                                        value={Remark}
                                        onChange={Remarkhandler}
                                        regExpResult={RemarkregExpResult}
                                        placeholder={"有什麼需要告訴我們的嗎？(選填)"}
                                        theme={reservation.textInput}
                                    ></FormCardTextInput>
                                </Container>
                            </SubContainer>
                            <SubContainer theme={{ occupy: 12 }}>
                                <EasyButton theme={reservation.submitButton} text={"確定預約"} onClick={() => {
                                    (ShopChoosen === '' ? alertService.warn('請選擇門市', { autoClose: true })
                                        : (DateRegion === '' ? alertService.warn('請選擇預約日期', { autoClose: true })
                                            : (Time === '' ? alertService.warn('請選擇預約時段', { autoClose: true })
                                                : (!Agreement ? alertService.warn('請選擇是否同意阿瘦集團服務條款', { autoClose: true })
                                                    : (OkTime === '' ? alertService.warn('請選擇可預約時間', { autoClose: true })
                                                        : addOrderExecute(ShopChoosen?.Id, UserData?.response?.Id, Remark, DateRegion, Time)
                                                    )
                                                )
                                            )
                                        )
                                    );
                                }} />
                            </SubContainer>
                        </Container>
                    </SubContainer>
                    <SubContainer theme={{ width: 'calc(100% - 362px)', height: '600px' }}>
                        {GmapData?.results && <GoogleMapReact
                            bootstrapURLKeys={{ key: 'AIzaSyA1h_cyazZLo1DExB0h0B2JBuOfv-yFtsM' }}
                            defaultCenter={{
                                lat: GmapData?.results?.[0]?.geometry?.location?.lat,
                                lng: GmapData?.results?.[0]?.geometry?.location?.lng
                            }}
                            center={{
                                lat: GmapData?.results?.[0]?.geometry?.location?.lat,
                                lng: GmapData?.results?.[0]?.geometry?.location?.lng
                            }}
                            defaultZoom={15}
                            layerTypes={['TransitLayer']}
                        >
                            <HomeIcon
                                lat={GmapData?.results?.[0]?.geometry?.location?.lat}
                                lng={GmapData?.results?.[0]?.geometry?.location?.lng}
                                style={{
                                    position: "relative",
                                    top: "0.1rem",
                                    height: "3rem",
                                    width: '3rem',
                                    color: '#964f19'
                                }} />
                        </GoogleMapReact>}
                    </SubContainer>
                </Container>

            </BasicContainer>
            }

            {/* 寬度大於等於768且未登入時渲染的組件 */}
            {(width > 768 && !IsLogin) && <BasicContainer theme={reservation.basicContainer}>
                <Container>
                    <SubContainer theme={{ width: '362px', padding: '0 1rem 0 0 ' }}>
                        <PageSubTitle title='預約足測' text={{ userSelect: "none", color: "#444", fontSize: "1.75em", fontWeight: 'normal', padding: " 0.2rem 0 8px 0", }}
                            container={{
                                direction: "row",
                                justify: "space-between",
                                //padding: "0 40px 0 40px ",
                                width: '100%',
                                margin: '-53px 0 24px 0',
                                //height: '3rem',
                            }} />
                        <FormControl theme={{
                            width: "100%",

                            //overflowY: "scroll",
                            //height: "calc( 100% - 20.1rem )"
                        }} sumbit={true} onSubmit={(e) => { e.preventDefault(); /*execute(Account, Pass);*/ }}>


                            <Text>請搜尋您欲前往的服務門市</Text>
                            <FormRow>
                                <FormCardSelector
                                    //label={""}
                                    //hint={""}
                                    placeholder={"縣市"}
                                    value={County}
                                    isSearchable
                                    options={Counties}
                                    //defaultValue={ { value: '1', label: 'Chocolate' }}
                                    onChange={(value) => { CountyResetValue(value); DistrictResetValue(''); ShopChoosenResetValue('') }}
                                    regExpResult={CountyregExpResult}
                                    theme={reservation.birthFormCardSelector}
                                ></FormCardSelector>
                                <FormCardSelector
                                    //label={""}
                                    //hint={""}
                                    placeholder={"行政區"}
                                    value={District}
                                    isSearchable
                                    options={cityAndCountiesLite[County.value]}
                                    //defaultValue={ { value: '1', label: 'Chocolate' }}
                                    onChange={(value) => { DistrictResetValue(value); ShopChoosenResetValue('') }}
                                    regExpResult={DistrictregExpResult}
                                    theme={reservation.birthFormCardSelector}
                                ></FormCardSelector>
                                <FormCardSelector
                                    //label={""}
                                    //hint={""}
                                    placeholder={"門市"}
                                    value={ShopChoosen}
                                    isSearchable
                                    options={filterShop(ShopData, County, District)}
                                    //defaultValue={ { value: '1', label: 'Chocolate' }}
                                    onChange={(value) => { ShopChoosenResetValue(value); executeGetNewLocation(`${value.County}${value.District}${value.Addr}`); }}
                                    regExpResult={ShopChoosenregExpResult}
                                    theme={reservation.birthFormCardSelector}
                                ></FormCardSelector>
                            </FormRow>
                            <FormRow>
                                <SubContainer theme={{ occupy: 6 }}>
                                    <SingleDatePicker2
                                        getDate={DateRegionResetValue}
                                        value={DateRegion}// [startDate,endDate]
                                    //doThings={(date) => { props.execute(dateTrans(date), dateTrans(date), SearchWord); }}
                                    ></SingleDatePicker2>
                                </SubContainer>
                                <FormCardLeftIconSelector
                                    clearIconLeft='150%'
                                    label={"預約時段"}
                                    hint={""}
                                    placeholder={"預約時段"}
                                    value={Time}
                                    isSearchable
                                    isClearable
                                    options={hours}
                                    onChange={(values) => { TimeResetValue(values) }}
                                    regExpResult={TimeregExpResult}
                                    theme={reservation.locationFormCardTextInput}
                                ></FormCardLeftIconSelector>
                            </FormRow>
                            <FormRow>
                                <FormCardSelector
                                    //label={""}
                                    //hint={""}
                                    placeholder={filterMaster(MasterData, ShopChoosen, DateRegion, Time)?.length > 0 ? "選擇可預約時段" : '該時段無服務足健師，請重新選擇'}
                                    value={OkTime}
                                    isSearchable
                                    options={filterMaster(MasterData, ShopChoosen, DateRegion, Time)}
                                    //defaultValue={ { value: '1', label: 'Chocolate' }}
                                    onChange={(value) => { OkTimeResetValue(value) }}
                                    regExpResult={OkTimeregExpResult}
                                    theme={reservation.okTimeSelector}
                                ></FormCardSelector>
                            </FormRow>


                        </FormControl>
                        <Container>
                            <SubContainer theme={{ occupy: 12, margin: '32px 0 0 0 ' }}>
                                <Container theme={{ direction: 'column' }}>
                                    <Text theme={reservation.textSmallTitle}>選擇門市</Text>
                                    <Text theme={{ ...reservation.textContent, fontSize: '1.125rem', fontWeight: "700", }}>{ShopChoosen?.ShopName}</Text>
                                </Container>
                                <Container theme={{ direction: 'column' }}>
                                    <Text theme={reservation.textSmallTitle}>門市地址</Text>
                                    <Text theme={reservation.textContent}>{`${ShopChoosen?.County ?? ''}${ShopChoosen?.District ?? ''}${ShopChoosen?.Addr ?? ''}`}</Text>
                                </Container>
                            </SubContainer>
                            <SubContainer theme={{ occupy: 6 }}>
                                <Container theme={{ direction: 'column' }}>
                                    <Text theme={reservation.textSmallTitle}>門市電話</Text>
                                    <Text theme={{ ...reservation.textContent, color: "#964f19" }}>{ShopChoosen?.ShopTel}</Text>
                                </Container>

                            </SubContainer>
                            <SubContainer theme={{ occupy: 6 }}>
                                <Container theme={{ direction: 'column' }}>
                                    <Text theme={reservation.textSmallTitle}>預約人數</Text>
                                    <Text theme={reservation.textContent}>１人</Text>
                                </Container>

                            </SubContainer>
                            <SubContainer theme={{ occupy: 12 }}>
                                <FormControl theme={{
                                    width: "100%",
                                    //padding: "0 2.1rem 0",
                                    overflowY: "scroll",
                                    //height: "calc( 100% - 20.1rem )"
                                }} sumbit={true} onSubmit={(e) => { e.preventDefault(); /*execute(Account, Pass);*/ }}>
                                    <FormRow>
                                        <FormCardTextInput
                                            label={(<><Text style={{
                                                fontSize: '16px',
                                                lineHeight: '22px',
                                                margin: '0 0 4px 0'
                                            }}>姓名</Text><Text style={{ textShadow: "0 0 1px #d25959" }} theme={{ display: "inline-block", color: "#d25959", fontSize: " 0.9rem" }}>＊必填</Text></>)}
                                            //hint={""}
                                            value={Name}
                                            onChange={Namehandler}
                                            regExpResult={NameregExpResult}
                                            placeholder={"請輸入真實中文姓名，以便確認您的預約資料"}
                                            theme={reservation.AccountTextInput}
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
                                            theme={reservation.AccountTextInput}
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
                                            theme={reservation.AccountTextInput}
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
                                            theme={reservation.birthFormCardSelector}
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
                                            theme={reservation.birthFormCardSelector}
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
                                            theme={reservation.birthFormCardSelector}
                                        ></FormCardSelector>
                                    </FormRow>

                                    <FormRow>
                                        <FormCardSelector
                                            label={"通訊地址"}
                                            //hint={""}
                                            placeholder={"縣市"}
                                            value={NewCounty}
                                            isSearchable
                                            options={Counties}
                                            //defaultValue={ { value: '1', label: 'Chocolate' }}
                                            onChange={(value) => { NewCountyResetValue(value); NewDistrictResetValue('') }}
                                            regExpResult={NewCountyregExpResult}
                                            theme={reservation.birthFormCardSelector}
                                        ></FormCardSelector>
                                        <FormCardSelector
                                            label={""}
                                            //hint={""}
                                            placeholder={"行政區"}
                                            value={NewDistrict}
                                            isSearchable
                                            options={cityAndCountiesLite[NewCounty.value]}
                                            //defaultValue={ { value: '1', label: 'Chocolate' }}
                                            onChange={(value) => { NewDistrictResetValue(value) }}
                                            regExpResult={NewDistrictregExpResult}
                                            theme={reservation.birthFormCardSelector}
                                        ></FormCardSelector>
                                    </FormRow>
                                    <FormRow>
                                        <FormCardTextInput
                                            //label={""}
                                            hint={""}
                                            value={NewAddr}
                                            onChange={NewAddrhandler}
                                            regExpResult={NewAddrregExpResult}
                                            placeholder={"忠孝東路四段 100 號 3 樓"}
                                            theme={reservation.AccountTextInput}
                                        ></FormCardTextInput>
                                    </FormRow>

                                </FormControl>
                            </SubContainer>
                            <SubContainer theme={{ occupy: 12, margin: '0 0 16px 0' }}>
                                <Container theme={{ direction: 'column' }}>
                                    <Text onClick={() => { setAgreement(a => !a) }} theme={{ display: "inline-block", fontSize: "0.75rem", color: "#787676", cursor: "pointer" }}>
                                        <CheckboxWhatever checked={Agreement} onChange={() => { /* 不需要做事，用上面的onClick控制 */ }}></CheckboxWhatever>
                                    我同意阿瘦集團服務條款及隱私政策、收到最新活動訊息
                                </Text>
                                </Container>
                            </SubContainer>

                            <SubContainer theme={{ occupy: 12 }}>
                                <EasyButton theme={reservation.submitButton} text={"確定預約"} onClick={() => {
                                    (ShopChoosen === '' ? alertService.warn('請選擇門市', { autoClose: true })
                                        : (DateRegion === '' ? alertService.warn('請選擇預約日期', { autoClose: true })
                                            : (Time === '' ? alertService.warn('請選擇預約時段', { autoClose: true })
                                                : (NameregExpResult ? alertService.warn(NameregExpResult, { autoClose: true })

                                                    : (PhoneregExpResult ? alertService.warn(PhoneregExpResult, { autoClose: true })

                                                        : (EmailregExpResult ? alertService.warn(EmailregExpResult, { autoClose: true })
                                                            : (!Agreement ? alertService.warn('請選擇是否同意阿瘦集團服務條款', { autoClose: true })
                                                                : (OkTime === '' ? alertService.warn('請選擇可預約時間', { autoClose: true })
                                                                    : newUserDoTheseThingsExecute(ShopChoosen?.Id, UserData?.response?.Id, Remark, DateRegion, Time, Name, Phone, Email, BirthYear, BirthMonth, BirthDay, NewCounty, NewDistrict, NewAddr)
                                                                )
                                                            )
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    );
                                }} />
                            </SubContainer>
                        </Container>
                    </SubContainer>
                    <SubContainer theme={{ width: 'calc(100% - 362px)', height: '600px' }}>
                        {GmapData?.results && <GoogleMapReact
                            bootstrapURLKeys={{ key: 'AIzaSyA1h_cyazZLo1DExB0h0B2JBuOfv-yFtsM' }}
                            defaultCenter={{
                                lat: GmapData?.results?.[0]?.geometry?.location?.lat,
                                lng: GmapData?.results?.[0]?.geometry?.location?.lng
                            }}
                            center={{
                                lat: GmapData?.results?.[0]?.geometry?.location?.lat,
                                lng: GmapData?.results?.[0]?.geometry?.location?.lng
                            }}
                            defaultZoom={15}
                            layerTypes={['TransitLayer']}
                        >
                            <HomeIcon
                                lat={GmapData?.results?.[0]?.geometry?.location?.lat}
                                lng={GmapData?.results?.[0]?.geometry?.location?.lng}
                                style={{
                                    position: "relative",
                                    top: "0.1rem",
                                    height: "3rem",
                                    width: '3rem',
                                    color: '#964f19'
                                }} />
                        </GoogleMapReact>}
                    </SubContainer>
                </Container>

            </BasicContainer>
            }

            {/* 寬度小於768時渲染的組件 */}
            {width <= 768 && <BasicContainer theme={reservation.basicContainer}>
                <Container theme={{ height: '100%' }}>
                    <SubContainer theme={{ width: '100%', height: "100%" }}>
                        {GmapData?.results && <GoogleMapReact
                            bootstrapURLKeys={{ key: 'AIzaSyA1h_cyazZLo1DExB0h0B2JBuOfv-yFtsM' }}
                            defaultCenter={{
                                lat: GmapData?.results?.[0]?.geometry?.location?.lat,
                                lng: GmapData?.results?.[0]?.geometry?.location?.lng
                            }}
                            center={{
                                lat: GmapData?.results?.[0]?.geometry?.location?.lat,
                                lng: GmapData?.results?.[0]?.geometry?.location?.lng
                            }}
                            defaultZoom={15}
                            layerTypes={['TransitLayer']}
                        >
                            <HomeIcon
                                lat={GmapData?.results?.[0]?.geometry?.location?.lat}
                                lng={GmapData?.results?.[0]?.geometry?.location?.lng}
                                style={{
                                    position: "relative",
                                    top: "0.1rem",
                                    height: "3rem",
                                    width: '3rem',
                                    color: '#964f19'
                                }} />
                        </GoogleMapReact>}
                    </SubContainer>
                    <SubContainer theme={{ width: '100%', position: 'absolute', padding: '0 5% 0 5%', backgroundColor: 'white' }}>
                        <Container>
                            {/* <Text onClick={() => { setStep(Step + 1) }}>123456</Text> */}
                            <MyStepper step={Step} />
                        </Container>
                        <Container theme={{ margin: '16px 0 0 0' }}>
                            {(Step === 0) && <FormControl theme={{
                                width: "100%",

                                //overflowY: "scroll",
                                //height: "calc( 100% - 20.1rem )"
                            }} sumbit={true} onSubmit={(e) => { e.preventDefault(); /*execute(Account, Pass);*/ }}>


                                <Text>請搜尋您欲前往的服務門市</Text>
                                <FormRow>
                                    <FormCardSelector
                                        //label={""}
                                        //hint={""}
                                        placeholder={"縣市"}
                                        value={County}
                                        isSearchable
                                        options={Counties}
                                        //defaultValue={ { value: '1', label: 'Chocolate' }}
                                        onChange={(value) => { CountyResetValue(value); DistrictResetValue(''); ShopChoosenResetValue('') }}
                                        regExpResult={CountyregExpResult}
                                        theme={reservation.birthFormCardSelector}
                                    ></FormCardSelector>
                                    <FormCardSelector
                                        //label={""}
                                        //hint={""}
                                        placeholder={"行政區"}
                                        value={District}
                                        isSearchable
                                        options={cityAndCountiesLite[County.value]}
                                        //defaultValue={ { value: '1', label: 'Chocolate' }}
                                        onChange={(value) => { DistrictResetValue(value); ShopChoosenResetValue('') }}
                                        regExpResult={DistrictregExpResult}
                                        theme={reservation.birthFormCardSelector}
                                    ></FormCardSelector>
                                    <FormCardSelector
                                        //label={""}
                                        //hint={""}
                                        placeholder={"門市"}
                                        value={ShopChoosen}
                                        isSearchable
                                        options={filterShop(ShopData, County, District)}
                                        //defaultValue={ { value: '1', label: 'Chocolate' }}
                                        onChange={(value) => {
                                            ShopChoosenResetValue(value);
                                            executeGetNewLocation(`${value.County}${value.District}${value.Addr}`);
                                            setStep(1);
                                        }}
                                        regExpResult={ShopChoosenregExpResult}
                                        theme={reservation.birthFormCardSelector}
                                    ></FormCardSelector>
                                </FormRow>
                            </FormControl>}
                            {(Step === 1) && <>
                                <SubContainer theme={{ occupy: 12, margin: '32px 0 0 0 ' }}>
                                    <Container theme={{ direction: 'column' }}>
                                        <SubContainer theme={{ occupy: 12 }}>
                                            <Text theme={reservation.textSmallTitle}>選擇門市</Text>
                                            <EasyButton theme={{
                                                position: 'absolute',
                                                right: '0px',
                                                top: '0px',
                                                backgroundColor: "#fff",
                                                display: "inline-block",
                                                width: "7rem",
                                                height: "2rem",
                                                lineHeight: "2rem",
                                                color: "#964f19",
                                                border: "1px solid #964f19",
                                                borderRadius: "1.25rem",
                                                textAlign: "center",
                                                hoverBackgroundColor: "#964f19",
                                                hoverColor: "#fff",
                                                fontSize: "0.875rem",
                                                cursor: "pointer",
                                            }} text={"重新選擇"} onClick={() => {
                                                setStep(0);
                                            }} />
                                        </SubContainer>
                                        <Text theme={{ ...reservation.textContent, fontSize: '1.125rem', fontWeight: "700", }}>{ShopChoosen?.ShopName}</Text>
                                    </Container>
                                    <Container theme={{ direction: 'column' }}>
                                        <Text theme={reservation.textSmallTitle}>門市地址</Text>
                                        <Text theme={reservation.textContent}>{`${ShopChoosen?.County ?? ''}${ShopChoosen?.District ?? ''}${ShopChoosen?.Addr ?? ''}`}</Text>
                                    </Container>
                                </SubContainer>
                                <SubContainer theme={{ occupy: 6 }}>
                                    <Container theme={{ direction: 'column' }}>
                                        <Text theme={reservation.textSmallTitle}>門市電話</Text>
                                        <Text theme={{ ...reservation.textContent, color: "#964f19" }}>{ShopChoosen?.ShopTel}</Text>
                                    </Container>

                                </SubContainer>
                                <SubContainer theme={{ occupy: 6 }}>
                                    <Container theme={{ direction: 'column' }}>
                                        <Text theme={reservation.textSmallTitle}>預約人數</Text>
                                        <Text theme={reservation.textContent}>１人</Text>
                                    </Container>

                                </SubContainer>
                                <FormRow>
                                    <SubContainer theme={{ occupy: 6 }}>
                                        <SingleDatePicker2
                                            getDate={DateRegionResetValue}
                                            value={DateRegion}// [startDate,endDate]
                                        //doThings={(date) => { props.execute(dateTrans(date), dateTrans(date), SearchWord); }}
                                        ></SingleDatePicker2>
                                    </SubContainer>
                                    <FormCardLeftIconSelector
                                        clearIconLeft='150%'
                                        label={"預約時段"}
                                        hint={""}
                                        placeholder={"預約時段"}
                                        value={Time}
                                        isSearchable
                                        isClearable
                                        options={hours}
                                        onChange={(values) => { TimeResetValue(values) }}
                                        regExpResult={TimeregExpResult}
                                        theme={reservation.locationFormCardTextInput}
                                    ></FormCardLeftIconSelector>
                                </FormRow>
                                <FormRow>
                                    <FormCardSelector
                                        //label={""}
                                        //hint={""}
                                        placeholder={filterMaster(MasterData, ShopChoosen, DateRegion, Time)?.length > 0 ? "選擇可預約時段" : '該時段無服務足健師，請重新選擇'}
                                        value={OkTime}
                                        isSearchable
                                        options={filterMaster(MasterData, ShopChoosen, DateRegion, Time)}
                                        //defaultValue={ { value: '1', label: 'Chocolate' }}
                                        onChange={(value) => { OkTimeResetValue(value) }}
                                        regExpResult={OkTimeregExpResult}
                                        theme={reservation.okTimeSelector}
                                    ></FormCardSelector>
                                </FormRow>
                                <SubContainer theme={{ occupy: 12, margin: '0 0 16px 0' }}>
                                    <Container theme={{ direction: 'column' }}>
                                        <Text onClick={() => { setAgreement(a => !a) }} theme={{ display: "inline-block", fontSize: "0.75rem", color: "#787676", cursor: "pointer" }}>
                                            <CheckboxWhatever checked={Agreement} onChange={() => { /* 不需要做事，用上面的onClick控制 */ }}></CheckboxWhatever>
                                    我同意阿瘦集團服務條款及隱私政策、收到最新活動訊息
                                </Text>
                                    </Container>
                                </SubContainer>
                                <SubContainer theme={{ occupy: 12 }}>
                                    <Container theme={{ direction: 'column' }}>
                                        <FormCardTextInput
                                            label={"備註"}
                                            //hint={""}
                                            value={Remark}
                                            onChange={Remarkhandler}
                                            regExpResult={RemarkregExpResult}
                                            placeholder={"有什麼需要告訴我們的嗎？(選填)"}
                                            theme={reservation.textInput}
                                        ></FormCardTextInput>
                                    </Container>
                                </SubContainer>
                                <SubContainer theme={{ occupy: 12, margin: '0 0 16px 0' }}>
                                    <EasyButton theme={reservation.submitButton} text={"確定預約"} onClick={() => {
                                        (ShopChoosen === '' ? alertService.warn('請選擇門市', { autoClose: true })
                                            : (DateRegion === '' ? alertService.warn('請選擇預約日期', { autoClose: true })
                                                : (Time === '' ? alertService.warn('請選擇預約時段', { autoClose: true })
                                                    : (!Agreement ? alertService.warn('請選擇是否同意阿瘦集團服務條款', { autoClose: true })
                                                        : (OkTime === '' ? alertService.warn('請選擇可預約時間', { autoClose: true })
                                                            : addOrderExecute(ShopChoosen?.Id, UserData?.response?.Id, Remark, DateRegion, Time)
                                                        )
                                                    )
                                                )
                                            )
                                        );
                                    }} />
                                </SubContainer>
                            </>}
                        </Container>
                    </SubContainer>
                </Container>
            </BasicContainer>
            }
            {/* 寬度小於768時且未登入渲染的組件 */}
            {(width <= 768 && !IsLogin) && <BasicContainer theme={reservation.basicContainer}>
                <Container theme={{ height: '100%' }}>
                    <SubContainer theme={{ width: '100%', height: "100%" }}>
                        {GmapData?.results && <GoogleMapReact
                            bootstrapURLKeys={{ key: 'AIzaSyA1h_cyazZLo1DExB0h0B2JBuOfv-yFtsM' }}
                            defaultCenter={{
                                lat: GmapData?.results?.[0]?.geometry?.location?.lat,
                                lng: GmapData?.results?.[0]?.geometry?.location?.lng
                            }}
                            center={{
                                lat: GmapData?.results?.[0]?.geometry?.location?.lat,
                                lng: GmapData?.results?.[0]?.geometry?.location?.lng
                            }}
                            defaultZoom={15}
                            layerTypes={['TransitLayer']}
                        >
                            <HomeIcon
                                lat={GmapData?.results?.[0]?.geometry?.location?.lat}
                                lng={GmapData?.results?.[0]?.geometry?.location?.lng}
                                style={{
                                    position: "relative",
                                    top: "0.1rem",
                                    height: "3rem",
                                    width: '3rem',
                                    color: '#964f19'
                                }} />
                        </GoogleMapReact>}
                    </SubContainer>
                    <SubContainer theme={{ width: '100%', position: 'absolute', padding: '0 5% 0 5%', backgroundColor: 'white' }}>
                        <Container>
                            {/* <Text onClick={() => { setStep(Step + 1) }}>123456</Text> */}
                            <MyStepper step={Step} />
                        </Container>
                        <Container theme={{ margin: '16px 0 0 0' }}>
                            {(Step === 0) && <FormControl theme={{
                                width: "100%",

                                //overflowY: "scroll",
                                //height: "calc( 100% - 20.1rem )"
                            }} sumbit={true} onSubmit={(e) => { e.preventDefault(); /*execute(Account, Pass);*/ }}>


                                <Text>請搜尋您欲前往的服務門市</Text>
                                <FormRow>
                                    <FormCardSelector
                                        //label={""}
                                        //hint={""}
                                        placeholder={"縣市"}
                                        value={County}
                                        isSearchable
                                        options={Counties}
                                        //defaultValue={ { value: '1', label: 'Chocolate' }}
                                        onChange={(value) => { CountyResetValue(value); DistrictResetValue(''); ShopChoosenResetValue('') }}
                                        regExpResult={CountyregExpResult}
                                        theme={reservation.birthFormCardSelector}
                                    ></FormCardSelector>
                                    <FormCardSelector
                                        //label={""}
                                        //hint={""}
                                        placeholder={"行政區"}
                                        value={District}
                                        isSearchable
                                        options={cityAndCountiesLite[County.value]}
                                        //defaultValue={ { value: '1', label: 'Chocolate' }}
                                        onChange={(value) => { DistrictResetValue(value); ShopChoosenResetValue('') }}
                                        regExpResult={DistrictregExpResult}
                                        theme={reservation.birthFormCardSelector}
                                    ></FormCardSelector>
                                    <FormCardSelector
                                        //label={""}
                                        //hint={""}
                                        placeholder={"門市"}
                                        value={ShopChoosen}
                                        isSearchable
                                        options={filterShop(ShopData, County, District)}
                                        //defaultValue={ { value: '1', label: 'Chocolate' }}
                                        onChange={(value) => {
                                            ShopChoosenResetValue(value);
                                            executeGetNewLocation(`${value.County}${value.District}${value.Addr}`);
                                            setStep(1);
                                        }}
                                        regExpResult={ShopChoosenregExpResult}
                                        theme={reservation.birthFormCardSelector}
                                    ></FormCardSelector>
                                </FormRow>

                                <Text theme={{ width: '50%', display: 'inline-block', textAlign: 'end', color: '#964f19', padding: '32px 0.25rem 32px 0' }} onClick={() => { console.log("go login") }}>立即登入</Text>
                                <Text theme={{ width: '50%', display: 'inline-block', padding: '32px 0px 32px 0.25rem' }}>加速預約</Text>
                            </FormControl>}
                            {(Step === 1) && <>
                                <SubContainer theme={{ occupy: 12, margin: '32px 0 0 0 ' }}>
                                    <Container theme={{ direction: 'column' }}>
                                        <SubContainer theme={{ occupy: 12 }}>
                                            <Text theme={reservation.textSmallTitle}>選擇門市</Text>
                                            <EasyButton theme={{
                                                position: 'absolute',
                                                right: '0px',
                                                top: '0px',
                                                backgroundColor: "#fff",
                                                display: "inline-block",
                                                width: "7rem",
                                                height: "2rem",
                                                lineHeight: "2rem",
                                                color: "#964f19",
                                                border: "1px solid #964f19",
                                                borderRadius: "1.25rem",
                                                textAlign: "center",
                                                hoverBackgroundColor: "#964f19",
                                                hoverColor: "#fff",
                                                fontSize: "0.875rem",
                                                cursor: "pointer",
                                            }} text={"重新選擇"} onClick={() => {
                                                setStep(0);
                                            }} />
                                        </SubContainer>
                                        <Text theme={{ ...reservation.textContent, fontSize: '1.125rem', fontWeight: "700", }}>{ShopChoosen?.ShopName}</Text>
                                    </Container>
                                    <Container theme={{ direction: 'column' }}>
                                        <Text theme={reservation.textSmallTitle}>門市地址</Text>
                                        <Text theme={reservation.textContent}>{`${ShopChoosen?.County ?? ''}${ShopChoosen?.District ?? ''}${ShopChoosen?.Addr ?? ''}`}</Text>
                                    </Container>
                                </SubContainer>
                                <SubContainer theme={{ occupy: 6 }}>
                                    <Container theme={{ direction: 'column' }}>
                                        <Text theme={reservation.textSmallTitle}>門市電話</Text>
                                        <Text theme={{ ...reservation.textContent, color: "#964f19" }}>{ShopChoosen?.ShopTel}</Text>
                                    </Container>

                                </SubContainer>
                                <SubContainer theme={{ occupy: 6 }}>
                                    <Container theme={{ direction: 'column' }}>
                                        <Text theme={reservation.textSmallTitle}>預約人數</Text>
                                        <Text theme={reservation.textContent}>１人</Text>
                                    </Container>

                                </SubContainer>
                                <SubContainer theme={{ occupy: 12 }}>
                                    <FormControl theme={{
                                        width: "100%",
                                        //padding: "0 2.1rem 0",
                                        overflowY: "scroll",
                                        //height: "calc( 100% - 20.1rem )"
                                    }} sumbit={true} onSubmit={(e) => { e.preventDefault(); /*execute(Account, Pass);*/ }}>
                                        <FormRow>
                                            <FormCardTextInput
                                                label={(<>姓名<Text style={{ textShadow: "0 0 1px #d25959" }} theme={{ display: "inline-block", color: "#d25959", fontSize: " 0.9rem" }}>＊必填</Text></>)}
                                                //hint={""}
                                                value={Name}
                                                onChange={Namehandler}
                                                regExpResult={NameregExpResult}
                                                placeholder={"請輸入真實中文姓名，以便確認您的預約資料"}
                                                theme={reservation.AccountTextInput}
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
                                                theme={reservation.AccountTextInput}
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
                                                theme={reservation.AccountTextInput}
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
                                                theme={reservation.birthFormCardSelector}
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
                                                theme={reservation.birthFormCardSelector}
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
                                                theme={reservation.birthFormCardSelector}
                                            ></FormCardSelector>
                                        </FormRow>

                                        <FormRow>
                                            <FormCardSelector
                                                label={"通訊地址"}
                                                //hint={""}
                                                placeholder={"縣市"}
                                                value={NewCounty}
                                                isSearchable
                                                options={Counties}
                                                //defaultValue={ { value: '1', label: 'Chocolate' }}
                                                onChange={(value) => { NewCountyResetValue(value); NewDistrictResetValue('') }}
                                                regExpResult={NewCountyregExpResult}
                                                theme={reservation.birthFormCardSelector}
                                            ></FormCardSelector>
                                            <FormCardSelector
                                                label={""}
                                                //hint={""}
                                                placeholder={"行政區"}
                                                value={NewDistrict}
                                                isSearchable
                                                options={cityAndCountiesLite[NewCounty.value]}
                                                //defaultValue={ { value: '1', label: 'Chocolate' }}
                                                onChange={(value) => { NewDistrictResetValue(value) }}
                                                regExpResult={NewDistrictregExpResult}
                                                theme={reservation.birthFormCardSelector}
                                            ></FormCardSelector>
                                        </FormRow>
                                        <FormRow>
                                            <FormCardTextInput
                                                //label={""}
                                                hint={""}
                                                value={NewAddr}
                                                onChange={NewAddrhandler}
                                                regExpResult={NewAddrregExpResult}
                                                placeholder={"忠孝東路四段 100 號 3 樓"}
                                                theme={reservation.AccountTextInput}
                                            ></FormCardTextInput>
                                        </FormRow>

                                    </FormControl>
                                </SubContainer>
                                <FormRow>
                                    <SubContainer theme={{ occupy: 6 }}>
                                        <SingleDatePicker2
                                            getDate={DateRegionResetValue}
                                            value={DateRegion}// [startDate,endDate]
                                        //doThings={(date) => { props.execute(dateTrans(date), dateTrans(date), SearchWord); }}
                                        ></SingleDatePicker2>
                                    </SubContainer>
                                    <FormCardLeftIconSelector
                                        clearIconLeft='150%'
                                        label={"預約時段"}
                                        hint={""}
                                        placeholder={"預約時段"}
                                        value={Time}
                                        isSearchable
                                        isClearable
                                        options={hours}
                                        onChange={(values) => { TimeResetValue(values) }}
                                        regExpResult={TimeregExpResult}
                                        theme={reservation.locationFormCardTextInput}
                                    ></FormCardLeftIconSelector>
                                </FormRow>
                                <FormRow>
                                    <FormCardSelector
                                        //label={""}
                                        //hint={""}
                                        placeholder={filterMaster(MasterData, ShopChoosen, DateRegion, Time)?.length > 0 ? "選擇可預約時段" : '該時段無服務足健師，請重新選擇'}
                                        value={OkTime}
                                        isSearchable
                                        options={filterMaster(MasterData, ShopChoosen, DateRegion, Time)}
                                        //defaultValue={ { value: '1', label: 'Chocolate' }}
                                        onChange={(value) => { OkTimeResetValue(value) }}
                                        regExpResult={OkTimeregExpResult}
                                        theme={reservation.okTimeSelector}
                                    ></FormCardSelector>
                                </FormRow>
                                <SubContainer theme={{ occupy: 12, margin: '0 0 16px 0' }}>
                                    <Container theme={{ direction: 'column' }}>
                                        <Text onClick={() => { setAgreement(a => !a) }} theme={{ display: "inline-block", fontSize: "0.75rem", color: "#787676", cursor: "pointer" }}>
                                            <CheckboxWhatever checked={Agreement} onChange={() => { /* 不需要做事，用上面的onClick控制 */ }}></CheckboxWhatever>
                                    我同意阿瘦集團服務條款及隱私政策、收到最新活動訊息
                                </Text>
                                    </Container>
                                </SubContainer>
                                <SubContainer theme={{ occupy: 12 }}>
                                    <Container theme={{ direction: 'column' }}>
                                        <FormCardTextInput
                                            label={"備註"}
                                            //hint={""}
                                            value={Remark}
                                            onChange={Remarkhandler}
                                            regExpResult={RemarkregExpResult}
                                            placeholder={"有什麼需要告訴我們的嗎？(選填)"}
                                            theme={reservation.textInput}
                                        ></FormCardTextInput>
                                    </Container>
                                </SubContainer>
                                <SubContainer theme={{ occupy: 12, margin: '0 0 16px 0' }}>
                                    <EasyButton theme={reservation.submitButton} text={"確定預約"} onClick={() => {
                                        (ShopChoosen === '' ? alertService.warn('請選擇門市', { autoClose: true })
                                            : (DateRegion === '' ? alertService.warn('請選擇預約日期', { autoClose: true })
                                                : (Time === '' ? alertService.warn('請選擇預約時段', { autoClose: true })
                                                    : (NameregExpResult ? alertService.warn(NameregExpResult, { autoClose: true })

                                                        : (PhoneregExpResult ? alertService.warn(PhoneregExpResult, { autoClose: true })

                                                            : (EmailregExpResult ? alertService.warn(EmailregExpResult, { autoClose: true })
                                                                : (!Agreement ? alertService.warn('請選擇是否同意阿瘦集團服務條款', { autoClose: true })
                                                                    : (OkTime === '' ? alertService.warn('請選擇可預約時間', { autoClose: true })
                                                                        : newUserDoTheseThingsExecute(ShopChoosen?.Id, UserData?.response?.Id, Remark, DateRegion, Time, Name, Phone, Email, BirthYear, BirthMonth, BirthDay, NewCounty, NewDistrict, NewAddr)
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    )
                                                )
                                            )
                                        );
                                    }} />
                                </SubContainer>
                            </>}
                        </Container>
                    </SubContainer>
                </Container>
            </BasicContainer>
            }

        </>
    )
}