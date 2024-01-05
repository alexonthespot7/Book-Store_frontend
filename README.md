# Book-Store Front-end

> This React.js-based application functions as the user-facing interface for the Bookstore project.<br>
> Seamlessly designed for intuitive interaction, it provides a diverse range of functionalities catering to book browsing, selection, and ordering, addressing the needs of both customers and administrators.
> The back-end side can be found [here](https://github.com/alexonthespot7/Book-Store_backend)<br>
> <br>
> The deployed app [https://bookstore-axos.netlify.app](https://bookstore-axos.netlify.app/)

## Table of Contents
* [Usage Guide](#usage-guide)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Dependencies](#dependencies)
* [Screenshots](#screenshots)

## Usage Guide
1. Clone the project <br>
  ```git clone https://github.com/alexonthespot7/Tournament_front-end.git```<br>
2. Run the following command in a terminal window (in the complete) directory:<br>
  ```npm install```<br>
3. Set the environmental variable for the back-end url:<br>
    1. Option 1: Run the following command in a terminal window (in the complete) directory:<br>
      ```$Env:REACT_APP_API_URL="back_end_url"```<br>
    2. Option 2: Add the .env file to the root of the project with the following content:<br>
       ```REACT_APP_API_URL=<your_backend_url>```<br>
4. Run the following command in a terminal window (in the complete) directory:<br>
  ```npm start```<br>
5. Navigate to localhost:3000
  
Default ADMIN credentials:<br>
* password: test<br>
* username: admin

## Features
### For All Users
- Intuitive UI Design: A sleek, black-and-white themed interface with smooth animations throughout the website.

- Book Browsing: Browse and search for books by author, title, or category, presented as interactive cards with cover images and prices.

- Book Details: Access comprehensive book information in a dialog when clicked, and add books to the cart or view cart contents seamlessly.

- Category Display: Carousel-style presentation of books within categories, facilitating easy filtering and exploration.

- Cart Functionality: An accessible cart menu with options to manage book quantities, view total costs, and proceed to checkout.

- Order Management: Ability to fill delivery details, place orders, and obtain order IDs/passwords for tracking order status.

### For Authenticated Users

- Personal Page: Access and manage personal information, previous orders, and delivery details, providing a personalized experience.

### For Administrators

- Order Management: View and modify orders, change order information, and update order statuses; includes exporting orders' data.

- User Management: Manage user verification, roles, and details, with the ability to export user data.

- Category Management: Add, edit, or remove categories to maintain an organized book catalog.

- Book Management: Edit, delete, or add new books to the catalog, including management of book cover images stored in Firebase.

## Technologies Used
- React.js
- css
- firebase

## Dependencies
- [@mui/icons-material](https://www.npmjs.com/package/@mui/icons-material) (^5.11.0): Material-UI Icons library for customizable icons following Material Design guidelines.
- [@mui/material](https://www.npmjs.com/package/@mui/material) (^5.11.4): Material-UI framework providing pre-designed React components.
- [ag-grid-react](https://www.npmjs.com/package/ag-grid-react) (^28.2.1): React wrapper for AG-Grid to seamlessly integrate its functionalities.
- [date-fns](https://www.npmjs.com/package/date-fns) (^3.0.6): Modern JavaScript date utility library.
- [firebase](https://www.npmjs.com/package/firebase) (^9.16.0): Firebase SDK for integrating Firebase services into the application.
- [framer-motion](https://www.npmjs.com/package/framer-motion) (^8.5.4): Library facilitating smooth animations and motion design for React components.
- [nuka-carousel](https://www.npmjs.com/package/nuka-carousel) (^5.4.1): React-based carousel component offering carousel functionalities.
- [rc-footer](https://www.npmjs.com/package/rc-footer) (^0.6.8): React footer component for creating footers within applications.
- [react-router-dom](https://www.npmjs.com/package/react-router-dom) (^6.6.2): Declarative routing for navigation and view handling in React.
- [react-select](https://www.npmjs.com/package/react-select) (^5.7.0): React component providing customizable select inputs.
- [react-select-country-list](https://www.npmjs.com/package/react-select-country-list) (^2.2.3): React component offering a country list for select inputs.
- [uuid](https://www.npmjs.com/package/uuid) (^9.0.0): Library for generating and working with universally unique identifiers (UUIDs).

## Screenshots
![allbooks_fullsize](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/f1fd464a-456b-4ce2-9f47-4bce51c7c46d)

![bookpage_fullsize](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/014dfcae-96f3-49da-9b5f-e65cec0c7bd9)

![bookincart_myorders_fullsize](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/63ba4b3b-3676-4340-99b1-d8f801b04090)

![checkout_fullsize](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/32b44ba2-671a-49ad-a0fd-2233a4eddeb1)

![paymentmethod_fullsize](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/c14e10d0-aad2-4063-a275-3dc3fde676ba)

![checkout2_fullsize](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/6615e923-3c69-4b15-b466-bd0b6c14e61b)

![adminmenu_fullsize](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/dc2fb77b-1d8d-4158-82a6-34b9b96e4543)

![adminusers_fullsize](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/f44ed643-c4a9-47ab-a451-60d251454f75)

![adminorders_fullsize](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/2e8d4236-aa05-4646-8a04-e0ff77e33155)

![personalpage_personaldata_fullsize](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/cc390871-070d-4a28-a462-05064478b32a)

![cartmenu_mainpage_m](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/708bac98-7ab7-40a1-9c3f-06b37e4ce7be)

![bookdialog_m](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/a91cc816-81d3-47ec-b9ec-fc4f660ec5e6)

![booksbycategories_m](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/c1904332-e415-4e84-a4fc-2819aaeec7ab)

![myorders_m](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/16f15ab1-e245-4da6-a187-f0d4c38ffe30)

![ordersearch_m](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/146e7202-7b45-4d2d-addc-88c8362faa89)

![orderinfo_m](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/695e38ff-5f1f-4d30-aa30-1481ca4af241)

![admincategories_m](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/68e801fa-02da-4767-a005-51fdd82ad2af)

![admin_editorder_m](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/2e065113-a475-4b9a-a89f-91202a9bf22e)

![allbooks_s](https://github.com/alexonthespot7/Book-Store_frontend/assets/90186057/4264b653-f087-42bc-9046-535511ecef60)
