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
    textSmallTitle: {
        color: "#999999",
        fontSize: "14px",
        fontWeight: "700",
        lineHeight: '28px',
        display: 'block',
    }
}