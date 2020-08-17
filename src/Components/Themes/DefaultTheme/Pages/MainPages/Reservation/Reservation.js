export default {
    basicContainer: {
        height: "calc( 100% - 4.5rem - 48px )",
        //backgroundColor: "#f7f1ed",
        width: "100%",
        //padding: '0 3% 10% 3%',
        position: "fixed",
        top: "calc( 4.5rem )",
        bottom: 0,
        overflowY: 'scroll',
        //overflowX: 'scroll',
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
    birthFormCardSelector: {
        selectSubContainer: {
            occupy: 4,
            padding: "0 0.1rem 0 0.2rem"
        },
        selectBasicContainer: {
            //width: "95%",
        }
    },
    AccountTextInput: {
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
            padding: "0 0.1rem 0 0.2rem"
        }
    },
    locationFormCardTextInput: {
        selectSubContainer: {
            occupy: 6,
            //height: '2.25rem',
            height: '36px',
            padding: "0 0.1rem 0 0"
        },
        selectBasicContainer: {
            margin: '4px 0 0 0',
            height: '36px',
        },
        formCardSelectLabel: {
            fontSize: '16px',
            lineHeight: '22px',
            margin: '0 0 4px 0'
        },
    },
    okTimeSelector: {
        selectSubContainer: {
            occupy: 12,
            margin: '8px 0 0 0 ',
            // backgroundColor: '#f9f4f1',
            // color: '#f9f4f1'
        },
        selectBasicContainer: {
            backgroundColor: '#f9f4f1',
            color: '#f9f4f1'
        },

    },
    textSmallTitle: {
        color: "#999999",
        fontSize: "14px",
        fontWeight: "700",
        lineHeight: '28px',
        display: 'inline-block',
        cursor: "default",
        //textAlign: 'center',
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
        margin: '0 0 16px 0'
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
            occupy: 12,
            //padding: "0 0.1rem 0 0.2rem",
        },

    },
    submitButton: {
        backgroundColor: "#964f19",
        color: "#fff",
        borderRadius: "4px",
        textAlign: "center",
        fontSize: "14px",
        cursor: "pointer",
        fontWeight: 400,
        width: "100%",
        height: "40px",
        lineHeight: "40px",
        margin: "16px 0 16px 0 ",
        hoverBackgroundColor: "#6d3f00",
    },
}