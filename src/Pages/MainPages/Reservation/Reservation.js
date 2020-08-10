import React, { useContext, useCallback, useState } from 'react';
import { Context } from '../../../Store/store'
import { BasicContainer, SubContainer, Container } from '../../../Components/Containers';
import { clearlocalStorage, getItemlocalStorage, setItemlocalStorage } from '../../../Handlers/LocalStorageHandler';
import { useHistory } from 'react-router-dom';
import { useWindowSize } from '../../../SelfHooks/useWindowSize'
import GoogleMapReact from 'google-map-react';
import HomeIcon from '@material-ui/icons/Home';
import { useAsync } from '../../../SelfHooks/useAsync';
import { FormControl, FormRow, FormCardTextInput, FormCardSelector, CheckboxWhatever, FormCardLeftIconSelector } from '../../../Components/Forms';
import { YearFrom1930to, Counties, cityAndCountiesLite, getDayByYearAndMonth, month, hours } from '../../../Mappings/Mappings';
import { useForm, useSelector } from '../../../SelfHooks/useForm';
import { SingleDatePicker, SingleDatePicker2 } from '../../../Components/DatePicker';
import { Text } from '../../../Components/Texts'

export const Reservation = (props) => {

    const { APIUrl, Theme, setOpwnLoginCard } = useContext(Context);
    const { pages: { reservationPage: { reservation } } } = Theme;
    let history = useHistory();
    const [width] = useWindowSize();
    const [UserData, setUserData] = useState(JSON.parse(getItemlocalStorage("LoginData")));
    const [GmapData, setGmapData] = useState({});
    const [ShopData, setShopData] = useState({});
    const [MasterData, setMasterData] = useState({});

    const [County, Countyhandler, CountyregExpResult, CountyResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇縣市"]); // 直轄地區欄位
    const [District, Districthandler, DistrictregExpResult, DistrictResetValue] = useSelector("", [(value) => ((value?.value ?? "").toString()?.length > 0)], ["請選擇行政區"]); // 直轄地區欄位
    const [Addr, Addrhandler, AddrregExpResult, AddrResetValue] = useForm("", ["^.{1,}$"], ["請輸入詳細地址"]); // 地址欄位
    const [ShopChoosen, ShopChoosenhandler, ShopChoosenregExpResult, ShopChoosenResetValue] = useForm("", [], []); // 
    const [DateRegion, DateRegionhandler, DateRegionregExpResult, DateRegionResetValue] = useForm('', [""], [""]);//日期區間欄位
    const [Time, Timehandler, TimeregExpResult, TimeResetValue] = useSelector("", [], []);
    const [OkTime, OkTimehandler, OkTimeregExpResult, OkTimeResetValue] = useSelector("", [], []);
    console.log(OkTime);
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

        return await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${UserData?.response?.CommCounty}${UserData?.response?.CommDistrict}${UserData?.response?.CommAddr}&key=AIzaSyA1h_cyazZLo1DExB0h0B2JBuOfv-yFtsM`,

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

    const filterShop = (array, County, District) => {
        //console.log(array, County, District)
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

    return (
        <>
            {/* 寬度大於等於768時渲染的組件 */}
            {width > 768 && <BasicContainer theme={reservation.basicContainer}>
                <Container>
                    <SubContainer theme={{ occupy: 4 }}>
                        <FormControl theme={{
                            width: "100%",

                            overflowY: "scroll",
                            height: "calc( 100% - 20.1rem )"
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
                                    onChange={(value) => { ShopChoosenResetValue(value) }}
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
                                    placeholder={"選擇可預約時段"}
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
                    </SubContainer>
                    <SubContainer theme={{ occupy: 8, height: '600px' }}>
                        {GmapData?.results && <GoogleMapReact
                            bootstrapURLKeys={{ key: 'AIzaSyA1h_cyazZLo1DExB0h0B2JBuOfv-yFtsM' }}
                            defaultCenter={{
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
                小於768時渲染的組件
            </BasicContainer>
            }

        </>
    )
}