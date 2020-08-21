export default {
    basicContainer: {
        height: "calc( 100% - 4.5rem - 48px )",
        //backgroundColor: "#f7f1ed",
        width: "100%",
        padding: '10% 3% 0 3%',
        position: "fixed",
        top: "calc( 4.5rem )",
        bottom: 0,
        overflowY: 'scroll',
        overflowX: 'scroll',
        backgroundColor: '#fff',
        scrollHeight: ".8rem",
        tablet: {
            height: "calc( 100% - 4.5rem )",
            //backgroundColor: "#f7f1ed",
            width: "100%",
            padding: '72px 10% 0 10%',
            position: "fixed",
            top: "4.5rem",
            //right: "0rem",
            bottom: 0,
            overflowY: 'scroll',
            overflowX: 'scroll',
            backgroundColor: '#fff',
            scrollHeight: ".8rem",
        }
    },
    DataContainer: {
        margin: '0 0 24px 0',
    },
    textSmallTitle: {
        color: "#999999",
        fontSize: "14px",
        fontWeight: "700",
        lineHeight: '28px',
        display: 'inline-block',
        cursor: "default",
        textAlign: 'center',
        width: '100%',
        tablet: {
            color: "#999999",
            fontSize: "14px",
            fontWeight: "700",
            lineHeight: '28px',
            display: 'inline-block',
            width: 'auto',
            cursor: "default",
        }
    },
    textContent: {
        color: "#444",
        fontSize: "16px",
        fontWeight: "500",
        lineHeight: '28px',
        display: 'block',
        //margin: '0 0 24px 0'
    },
    textContentPwd: {
        color: "#444",
        fontSize: "16px",
        fontWeight: "900",
        lineHeight: '28px',
        display: 'block',
        //margin: '0 0 24px 0',
        letterSpacing: "0.5rem"
    },
    textInput: {
        input: {
            height: "2rem",
            lineHeight: "2rem",
            fontSize: "0.75rem",
            borderBottom: "#444444 1px solid",
            borderRadius: "0rem",
            focusBorderBottom: "#d25959 1px solid",
            focusFontSize: "1rem"
        },
        inputSubContainer: {
            occupy: 6,
            padding: "0 0.1rem 0 0.2rem",
        },

    },
    textInputLessThan768: {
        input: {
            height: "2rem",
            lineHeight: "2rem",
            fontSize: "0.75rem",
            borderBottom: "#444444 1px solid",
            borderRadius: "0rem",
            focusBorderBottom: "#d25959 1px solid",
            focusFontSize: "1rem"
        },
        inputSubContainer: {
            occupy: 12,
            padding: "0 0.1rem 0 0.2rem",
        },
    },
    passFormCardTextInput: (len) => {
        if (len > 0) {
            return {
                input: {
                    height: "2rem",
                    lineHeight: "2rem",
                    fontSize: "0.75rem",
                    borderBottom: "#444444 1px solid",
                    borderRadius: "0rem",
                    letterSpacing: "0.5rem"
                },
                inputSubContainer: {
                    occupy: 12,
                }
            }
        } else {
            return {
                input: {
                    height: "2rem",
                    lineHeight: "2rem",
                    fontSize: "0.75rem",
                    borderBottom: "#444444 1px solid",
                    borderRadius: "0rem",
                },
                inputSubContainer: {
                    occupy: 12,
                }
            }
        }
    },
    tableBasicContainer: {
        padding: "0.75rem 0 0 0",
    },
    exportButton: {
        backgroundColor: "#fff",
        display: "inline-block",
        width: "88px",
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
        margin: '6rem 1rem 0 0',
        tablet: {
            backgroundColor: "#fff",
            display: "inline-block",
            width: "5.875rem",
            height: "2.25rem",
            lineHeight: "2.25rem",
            color: "#d25959",
            border: "1px solid #d25959",
            borderRadius: "1.25rem",
            textAlign: "center",
            hoverBackgroundColor: "#d25959",
            hoverColor: "#fff",
            fontSize: "0.875rem",
            cursor: "pointer",
            margin: '3.5rem 1rem 0 0',
        }
    },
    checkServiceButton: {
        backgroundColor: "#fff",
        display: "inline-block",
        width: "5.875rem",
        height: "2.25rem",
        lineHeight: "2.25rem",
        color: "#26b49a",
        border: "1px solid #26b49a",
        borderRadius: "1.25rem",
        textAlign: "center",
        hoverBackgroundColor: "#26b49a",
        hoverColor: "#fff",
        fontSize: "0.875rem",
        cursor: "pointer",
        margin: '4.5rem 1rem 0 0',
    },
    //#region 匯出彈窗
    exportText: {
        display: "block",
        textAlign: "center",
        color: "#595959",
        fontSize: "1.125em",
        fontWeight: 500
    },
    highLightText: {
        display: "block",
        textAlign: "center",
        color: "#545454",
        fontSize: "1.125em",
        fontWeight: 500
    },
}