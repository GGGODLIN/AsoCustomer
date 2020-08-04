export default {
    loginCard: {
        loginCardContainer: {
            zIndex: "1000",
            height: "100vh",
            backgroundColor: "#0000008f",
            padding: "0.5rem",
            direction: "row",
            justify: "center",
            alignItems: "center",
        },
        loginCardformCard: {
            zIndex: "1001",
            boxShadow: "0 2px 4px #0000001a",
            borderRadius: "16px",
            backgroundColor: "#fff",
            //border: "1px solid #eee",
            minWidth: "0",
            width: "100%",
        },
        loginCardContent: {
            // width: "100%",
            direction: "row",
            justify: "space-between",
            alignItems: "center",
        },
        loginButton: {
            backgroundColor: "#964f19",
            color: "#fff",
            borderRadius: "4px",
            textAlign: "center",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: 400,
            width: "140px",
            height: "40px",
            lineHeight: "40px",
            margin: "2rem 0 0 2.1rem",
            hoverBackgroundColor: "#6d3f00",
        },
        forgetText: {
            height: "14px",
            fontSize: ".75em",
            lineHeight: "14px",
            color: "#666",
            margin: "8px 0 0 2.1rem",
            userSelect: "none"
        },
        forgetTextRight: {
            height: "14px",
            fontSize: ".75em",
            lineHeight: "14px",
            color: "#964f19",
            margin: "8px 0 0 0",
            userSelect: "none",
            cursor: "pointer"
        },
        loginForm: {
            width: "100%",
            padding: "0 2.1rem 0",
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
        exportText: {
            display: "block",
            textAlign: "center",
            color: "#595959",
            fontSize: "2rem",
            fontWeight: 900
        }
    }
}
