export default {
    basicContainer: {
        height: "calc( 100% - 4.5rem - 36px )",
        //backgroundColor: "#f7f1ed",
        width: "100%",
        padding: '0 5% 5% 5%',
        position: "fixed",
        top: "calc( 4.5rem + 36px )",
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
        tablet: {
            display: 'inline-block',
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
            padding: "0 0.1rem 0 0.2rem"
        }
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
}