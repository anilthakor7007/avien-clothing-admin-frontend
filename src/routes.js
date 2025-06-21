import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdBrandingWatermark,
  MdCategory,
  MdVerifiedUser,
  MdPerson4,
  MdShoppingCart,
  MdShoppingBag
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import Brands from 'views/admin/brands';
import Categories from 'views/admin/categories';
// import Categories from 'views/admin/categories';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import ShowCustomers from "./views/admin/customers/components/ShowCustomers"
import RTL from 'views/admin/rtl';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import SignUpCentered from 'views/auth/signUp';
import { FaProductHunt } from 'react-icons/fa';
import { RiProductHuntFill, RiProductHuntLine } from 'react-icons/ri';
import Products from 'views/admin/products';
import userEvent from '@testing-library/user-event';
import Customers from './views/admin/customers';
import Orders from 'views/admin/orderDetails';

const routes = [
  // {
  //   name: 'Main Dashboard',
  //   layout: '/admin',
  //   path: '/dashboard',
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   component: <MainDashboard />,
  // },
  {
    name: 'Brand Details',
    layout: '/admin',
    path: '/brand/list',
    icon: (
      <Icon
        as={MdBrandingWatermark}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <Brands />,
    secondary: true,
  },
  {
    name: 'Categories',
    layout: '/admin',
    path: '/Categories/list',
    icon: (
      <Icon
        as={MdCategory}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <Categories/>,
    secondary: true,
  },
  {
    name: 'products',
    layout: '/admin',
    path: '/products/list',
    icon: (
      <Icon
        as={RiProductHuntFill}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <Products/>,
    secondary: true,
  },
  // {
  //   name: 'Data Tables',
  //   layout: '/admin',
  //   icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
  //   path: '/data-tables',
  //   component: <DataTables />,
  // },
  {
    name: 'Order details',
    layout: '/admin',
    icon: <Icon as={MdShoppingBag} width="20px" height="20px" color="inherit" />,
    path: '/orders',
    component: <Orders />,
  },
  {
    name: 'Customer details',
    layout: '/admin',
    icon: <Icon as={MdPerson4} width="20px" height="20px" color="inherit" />,
    path: '/customers',
    component: <Customers />,
  },
  {
    name: 'Register New Admin',
    layout: '/auth',
    path: '/sign-up',
    icon: <Icon as={MdVerifiedUser} width="20px" height="20px" color="inherit" />,
    component: <SignUpCentered />,
  },
  // {
  //   name: 'RTL Admin',
  //   layout: '/rtl',
  //   path: '/rtl-default',
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   component: <RTL />,
  // },
  {
    name: 'Admin Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
];

export default routes;
