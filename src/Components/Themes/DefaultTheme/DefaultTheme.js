import orderCards from './OrderCard'
import home from './Pages/MainPages/Home/Home'
import locations from './Pages/MainPages/Locations/Locations'
import faq from './Pages/MainPages/Faq/Faq'
import reservation from './Pages/MainPages/Reservation/Reservation'
import profile from './Pages/MainPages/Profile/Profile'
import history from './Pages/MainPages/History/History'
import error404 from './Pages/ErrorPages/Error404'
import forms from "./Forms";
import tags from "./Tags";
import buttons from "./Buttons";
import tables from "./Tables";
import jumpDialog from "./JumpDialog";
import jumpAlerts from "./JumpAlerts";
import formCard from "./FormCard";
import loginCard from "./LoginCard";
import cardTable from "./CardTable";
import list from "./Lists";
import menuBar from "./MenuBar";
import portal from "./Portal";

export default {
    ...orderCards,
    ...list,
    ...forms,
    ...tags,
    ...menuBar,
    ...tables,
    ...cardTable,
    ...jumpDialog,
    ...jumpAlerts,
    ...buttons,
    ...formCard,
    ...loginCard,
    ...portal,
    pages: {
        homePage: {
            home,
        },
        faqPage: {
            faq,
        },
        profilePage: {
            profile,
        },
        locationsPage: {
            locations,
        },
        reservationPage: {
            reservation,
        },
        historyPage: {
            history,
        }

    },
    errorPages: {
        error404
    }
}