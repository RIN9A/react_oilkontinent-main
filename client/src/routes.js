import {
    ADMIN_ROUTE, AZS_ROUTE,
    CARDS_ROUTE, CONTACTS_ROUTE,
    LOGIN_ROUTE, LOGOUT_ROUTE,
    PAYMENT_ROUTE, PAYMENTS_ROUTE, PPR_ROUTE, PROFILE_ROUTE,
    REGISTRATION_ROUTE,
    TRANSACTIONS_ROUTE, USERS_ROUTE
} from "./utils/consts";
import Admin from "./page/Admin";
import Auth from "./page/Auth";
import CardsPage from "./page/CardsPage";
import TransactionsPage from "./page/TransactionsPage";
import CardPage from "./page/CardPage";
import AZSPage from "./page/AZSPage";
import PaymentPage from "./page/PaymentPage";
import UserPage from "./page/UserPage";
import PaymentsPage from "./page/PaymentsPage";
import CreateUserPage from "./page/CreateUserPage";
import {RequireAuth} from "./hoc/RequireAuth";
import PPRCosts from "./page/PPRCosts";
import Logout from "./components/Logout";
import UsersPage from "./page/UsersPage";
import UserAdminPage from "./page/UserAdminPage";
import TransactionAdminPage from "./page/TransactionAdminPage";
import SearchCards from "./page/SearchCards";
import ContactsPage from "./page/ContactsPage";
import DriverAzsList from "./page/AZSDrivers";


export const authRoutes = [
    {
        path: PROFILE_ROUTE,
        Component: <UserPage/>
    },
    {
        path: CONTACTS_ROUTE,
        Component: <ContactsPage/>
    },
    {
        path: TRANSACTIONS_ROUTE,
        Component: <TransactionsPage/>
    },
    {
        path: PAYMENT_ROUTE,
        Component: <PaymentPage/>
    },
    {
        path: PAYMENTS_ROUTE,
        Component: <PaymentsPage/>
    },
    {
        path: TRANSACTIONS_ROUTE,
        Component: <TransactionsPage/>
    },
    {
        path: CARDS_ROUTE,
        Component: <CardsPage/>
    },
    {
        path: CARDS_ROUTE + '/:id',
        Component: <CardPage/>
    },
    {
        path: AZS_ROUTE,
        Component: <DriverAzsList/>
    },
    {
        path: REGISTRATION_ROUTE,
        Component: <CreateUserPage/>
    },
    {
        path: LOGOUT_ROUTE,
        Component: <Logout/>
    }
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: <Auth/>
    },
]

export const managerRoutes = [
    {
        path: USERS_ROUTE + "/drivers",
        Component: <UsersPage />,

    },
    
    {
        path: USERS_ROUTE + "/drivers" + '/:id',
        Component: <UserAdminPage/>
    },
      {
        path: 'managers-transactions',
        Component: <TransactionAdminPage/>
    },
        {
        path: PPR_ROUTE+"/manager",
        Component: <RequireAuth role='manager'><PPRCosts/></RequireAuth>
    },

     {
        path: 'drivers-cards',
        Component: <SearchCards/>
    },
    {
        path: LOGOUT_ROUTE,
        Component: <Logout/>
    },
   
]
export const adminRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: <RequireAuth role='admin'><Admin/></RequireAuth>
    },
    {
        path: PPR_ROUTE,
        Component: <RequireAuth role='admin'><PPRCosts/></RequireAuth>
    },
    {
        path: USERS_ROUTE,
        Component: <UsersPage/>
    },
    {
        path: USERS_ROUTE + '/:id',
        Component: <UserAdminPage/>
    },
    {
        path: 'transactionsAll',
        Component: <TransactionAdminPage/>
    },
    {
        path: 'cardsAll',
        Component: <SearchCards/>
    },
    {
        path: LOGOUT_ROUTE,
        Component: <Logout/>
    }
]