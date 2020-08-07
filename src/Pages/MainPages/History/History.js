import React, { useContext, useCallback, useState } from 'react';
import { Context } from '../../../Store/store'
import { BasicContainer, SubContainer, Container } from '../../../Components/Containers';
import { useHistory } from 'react-router-dom';
import { useWindowSize } from '../../../SelfHooks/useWindowSize'
import { PageSubTitle, PageSubTitleMobile } from '../../../Components/PageSubTitle';
import { CardTable } from '../../../Components/CardTable';
import { dateTrans, dateTransAndGetWeek, addDays, addMonths } from '../../../Handlers/DateHandler';
import { clearlocalStorage, getItemlocalStorage, setItemlocalStorage } from '../../../Handlers/LocalStorageHandler';
import { Text } from '../../../Components/Texts';
import { EasyButton } from '../../../Components/Buttons';
import { portalService } from '../../../Components/Portal';
import { useAsync } from '../../../SelfHooks/useAsync';

export const History = (props) => {

    const { APIUrl, Theme, setOpwnLoginCard } = useContext(Context);
    const { pages: { profilePage: { profile } } } = Theme;
    let history = useHistory(); // 因為頁面的 history 重複命名 所以這裡特別改用 historyRoute
    const [width] = useWindowSize();
    const [TableData, setTableData] = useState([]);
    const [HisTableData, setHisTableData] = useState([]);

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

    return (
        <>
            {/* 寬度大於等於768時渲染的組件 */}
            {width > 768 && <BasicContainer theme={profile.basicContainer}>
                大於等於768時渲染的組件
            </BasicContainer>
            }

            {/* 寬度小於768時渲染的組件 */}
            {width <= 768 && <BasicContainer theme={profile.basicContainer}>
                <SubContainer theme={{ occupy: 12 }}>
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
                                                display: 'block',
                                                //width: '50%',
                                                //margin: "0 0 0.375rem 0",
                                                color: "#444",
                                                fontSize: '1.125rem',
                                                fontWeight: "900"
                                            }}>{rowItem?.ShopName}</Text>
                                            <Text theme={{
                                                display: 'block',
                                                //width: '50%',
                                                //margin: "0 0 0.375rem 0",
                                                color: "#444",
                                                fontSize: "0.875rem",
                                                fontWeight: "400",
                                                margin: '0 0 8px 0'
                                            }}>{rowItem?.ShopAddr}</Text>
                                            <Text

                                                theme={{
                                                    display: 'block',
                                                    //width: '50%',
                                                    //margin: "0 0 0.375rem 0",
                                                    color: "#964f19",
                                                    fontSize: "0.875rem",
                                                    fontWeight: "400"
                                                }}>{rowItem?.ShopTel}</Text>






                                        </>)),
                                    renderContent: (item, id, rowItem) => ((item &&
                                        <>






                                        </>))
                                },
                                "OrderNo": {
                                    // 提供客製化渲染內容，可使用預設參數 item 與 id，item 為 對應列表資料、id 為對應列表資料的id
                                    // renderTitle: (item, id) => (`${item} ${id} sdf`)
                                    //width: "20%",
                                    renderTitle: (item, id, rowItem) => ((item &&
                                        <>
                                            <Text theme={{
                                                display: 'block',
                                                //width: '50%',
                                                margin: "0 0 0.375rem 0",
                                                color: "#999",
                                                fontSize: "0.75rem",
                                                fontWeight: "500",
                                                height: "0.875rem"
                                            }}>{'預約日期'}</Text>
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
                                                    display: "block",
                                                    //width: '50%',
                                                    //margin: "0 0 0.375rem 0",
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "900"
                                                }}>{`${rowItem?.ReservationDate?.split("T")?.[0]} ${rowItem?.ReservationDate?.split("T")?.[1]}`}</Text>
                                            <Text
                                                theme={{
                                                    display: "block",
                                                    //width: '50%',
                                                    //margin: "0 0 0.375rem 0",
                                                    color: "#999",
                                                    fontSize: "0.75rem",
                                                    fontWeight: "500",
                                                    height: "1.25rem"
                                                }}>{'預約編號'}</Text>




                                        </>)),
                                    renderContent: (item, id, rowItem) => ((item &&
                                        <>

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
                                                    display: 'block',
                                                    //width: '50%',
                                                    //margin: "0 0 0.375rem 0",
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "900",
                                                    margin: '0 0 -20px 0'
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
                                                display: 'block',
                                                //width: '50%',
                                                //margin: "0 0 0.375rem 0",
                                                color: "#444",
                                                fontSize: '1.125rem',
                                                fontWeight: "900"
                                            }}>{rowItem?.ShopName}</Text>
                                            <Text theme={{
                                                display: 'block',
                                                //width: '50%',
                                                //margin: "0 0 0.375rem 0",
                                                color: "#444",
                                                fontSize: "0.875rem",
                                                fontWeight: "400",
                                                margin: '0 0 8px 0'
                                            }}>{rowItem?.ShopAddr}</Text>
                                            <Text

                                                theme={{
                                                    display: 'block',
                                                    //width: '50%',
                                                    //margin: "0 0 0.375rem 0",
                                                    color: "#964f19",
                                                    fontSize: "0.875rem",
                                                    fontWeight: "400"
                                                }}>{rowItem?.ShopTel}</Text>






                                        </>)),
                                    renderContent: (item, id, rowItem) => ((item &&
                                        <>






                                        </>))
                                },
                                "OrderNo": {
                                    // 提供客製化渲染內容，可使用預設參數 item 與 id，item 為 對應列表資料、id 為對應列表資料的id
                                    // renderTitle: (item, id) => (`${item} ${id} sdf`)
                                    //width: "20%",
                                    renderTitle: (item, id, rowItem) => ((item &&
                                        <>
                                            <Text theme={{
                                                display: 'block',
                                                //width: '50%',
                                                margin: "0 0 0.375rem 0",
                                                color: "#999",
                                                fontSize: "0.75rem",
                                                fontWeight: "500",
                                                height: "0.875rem"
                                            }}>{'預約日期'}</Text>
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
                                                    display: "block",
                                                    //width: '50%',
                                                    //margin: "0 0 0.375rem 0",
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "900"
                                                }}>{`${rowItem?.ReservationDate?.split("T")?.[0]} ${rowItem?.ReservationDate?.split("T")?.[1]}`}</Text>
                                            <Text
                                                theme={{
                                                    display: "block",
                                                    //width: '50%',
                                                    //margin: "0 0 0.375rem 0",
                                                    color: "#999",
                                                    fontSize: "0.75rem",
                                                    fontWeight: "500",
                                                    height: "1.25rem"
                                                }}>{'預約編號'}</Text>




                                        </>)),
                                    renderContent: (item, id, rowItem) => ((item &&
                                        <>

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
                                                    display: 'block',
                                                    //width: '50%',
                                                    //margin: "0 0 0.375rem 0",
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "900",
                                                    margin: '0 0 -20px 0'
                                                }}>{item}</Text>






                                        </>))
                                },

                            }}
                        />
                    </BasicContainer>
                </SubContainer>
            </BasicContainer>
            }

        </>
    )
}