# 🛒 Forever - Full Stack MERN E-commerce Clothing Store

<div align="center">

![Forever E-commerce](https://img.shields.io/badge/Forever-E--commerce-black?style=for-the-badge&logo=shopify&logoColor=white)

A modern **full-stack e-commerce clothing website** built with **React**, **Node.js**, **Express**, **MongoDB**, and **Tailwind CSS**. Complete **online shopping platform** with user authentication, shopping cart, product filtering, and admin dashboard.

[![Live Demo](https://img.shields.io/badge/🔗_Live_Demo-Visit_Site-success?style=for-the-badge)](https://forever-frontend-tau-sooty.vercel.app/)

</div>

---

## 🔥 Keywords

> MERN Stack E-commerce | React Shopping Cart | Node.js E-commerce | Online Clothing Store | Full Stack Web Application | MongoDB E-commerce | React Tailwind E-commerce | JavaScript Shopping Website | Responsive E-commerce | Admin Dashboard | Product Management

---

## ✨ Features

### 🛍️ Customer Features
- 🔐 **User Authentication** - Secure Login & Registration
- 🛒 **Shopping Cart** - Add, Remove, Update Items
- ❤️ **Wishlist** - Save Favorite Products
- 🔍 **Smart Search** - Find Products Instantly
- 🏷️ **Category Filter** - Men, Women, Kids
- 👕 **Type Filter** - Topwear, Bottomwear, Winterwear
- 💰 **Price Sorting** - Low to High, High to Low
- 📦 **Order Placement** - Easy Checkout Process
- 📜 **Order History** - Track All Orders
- 💵 **Cash on Delivery** - Convenient Payment Option
- 📱 **Fully Responsive** - Mobile, Tablet, Desktop
- 🔔 **Toast Notifications** - Real-time Feedback
- 📧 **Newsletter Subscription** - Stay Updated

### 👨‍💼 Admin Features
- 📊 **Admin Dashboard** - Complete Control Panel
- ➕ **Add Products** - Upload New Items with Images
- 📋 **Product List** - View & Manage All Products
- 📦 **Order Management** - Track & Update Orders
- 🖼️ **Cloudinary Integration** - Cloud Image Storage

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Database | Styling | Tools |
|:--------:|:-------:|:--------:|:-------:|:-----:|
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white) |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) |

</div>

---


## 📸 Screenshots

### 🏠 Homepage
![Homepage](./screenshots/homepage.PNG)

### 🛍️ Product Collection
![Collection](./screenshots/collection.png)

### 📄 Product Details
![Product Details](./screenshots/product-details.PNG)

### 🛒 Shopping Cart
![Cart](./screenshots/cart.PNG)

### 👤 User Login
![Login](./screenshots/login.PNG)

### 📦 Place Order
![Place Order](./screenshots/place-order.PNG)

### ➕ Add Product (Admin)
![Add Product](./screenshots/addproduct.PNG)

### 📝 Product List (Admin)
![Product List](./screenshots/listitem.PNG)

### 📋 Orders Page (Admin)
![Orders](./screenshots/orders.PNG)

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary Account

### 1. Clone the Repository

```bash
git clone https://github.com/ARQUM21/forever.git
cd forever

```
 
### 2. Install Dependencies

```bash
# Install Frontend Dependencies
cd frontend
npm install

# Install Backend Dependencies
cd ../backend
npm install

# Install Admin Dependencies
cd ../admin
npm install

```

### 3. Environment Variables
Create `backend/.env` (copy `backend/.env.example`) and replace the example values:

```dotenv
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_password
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Use the exact Cloudinary variable names shown above; the backend reads
`CLOUDINARY_NAME` and `CLOUDINARY_SECRET_KEY`. Keep `backend/.env` private and
never commit real credentials. When a MongoDB password contains reserved URL
characters, URL-encode it in `MONGODB_URI`.

For online checkout, create Razorpay API keys in the Razorpay Dashboard and
set the test key ID and secret above. Keep the secret only in `backend/.env`;
the backend creates payment orders and verifies payment signatures. Restart
the backend after adding the keys. Use Razorpay test mode until your account is
ready for live payments.

Create `frontend/.env` and `admin/.env` (copy each folder's `.env.example`):

```dotenv
VITE_BACKEND_URL=http://localhost:4000
```

This connects both Vite apps to the backend running on port 4000. Restart each
Vite dev server after changing an `.env` file. `VITE_` variables are exposed in
the browser, so only use this variable for the backend URL, never for secrets.

### 4. Run the Application
```Bash

# Run Backend
cd backend
npm run server

# Run Frontend (new terminal)
cd frontend
npm run dev

# Run Admin (new terminal)
cd admin
npm run dev
```

### 5. Open in Browser

```text
Frontend: http://localhost:5173
Admin:    http://localhost:5174
Backend:  http://localhost:5000
```

### 📁 Folder Structure

```text

forever/
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 assets/
│   │   ├── 📂 components/
│   │   │   ├── BestSeller.jsx
│   │   │   ├── CartTotal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── LatestCollection.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NewsLetterBox.jsx
│   │   │   ├── OurPolicy.jsx
│   │   │   ├── ProductItem.jsx
│   │   │   ├── RelatedProducts.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── Title.jsx
│   │   ├── 📂 pages/
│   │   │   ├── About.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Collection.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── PlaceOrder.jsx
│   │   │   └── Product.jsx
│   │   ├── 📂 context/
│   │   │   └── ShopContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   ├── vercel.json
│   └── package.json
│
├── 📂 admin/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── 📂 pages/
│   │   │   ├── Add.jsx
│   │   │   ├── List.jsx
│   │   │   └── Orders.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   ├── vercel.json
│   └── package.json
│
├── 📂 backend/
│   ├── 📂 config/
│   │   ├── cloudinary.js
│   │   └── mongodb.js
│   ├── 📂 controllers/
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── 📂 middleware/
│   │   ├── adminAuth.js
│   │   ├── auth.js
│   │   └── multer.js
│   ├── 📂 models/
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   ├── 📂 routes/
│   │   ├── cartRoute.js
│   │   ├── orderRoute.js
│   │   ├── productRoute.js
│   │   └── userRoute.js
│   ├── server.js
│   ├── .env
│   ├── .gitignore
│   ├── vercel.json
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```


---

## 🔮 Future Enhancements

- [ ] Payment Gateway Integration (Stripe/Razorpay)
- [ ] Email Notifications
- [ ] Product Reviews & Ratings
- [ ] Multiple Payment Options
- [ ] Discount Coupons


---

### 🤝 Contributing
Contributions are welcome! Feel free to open issues and pull requests.

```Bash

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request
```


---

## 📧 Contact

<div align="center">

**Muhammad Arqum Tariq**

[![GitHub](https://img.shields.io/badge/GitHub-ARQUM21-181717?style=for-the-badge&logo=github)](https://github.com/ARQUM21)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Muhammad_Arqum_Tariq-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/muhammadarqumtariq/)
[![Email](https://img.shields.io/badge/Email-marqum987@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:marqum987@gmail.com)

</div>

---

## ⭐ Show Your Support

Give a ⭐ if you like this project!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### Made with ❤️ by Muhammad Arqum Tariq

![Visitors](https://api.visitorbadge.io/api/visitors?path=ARQUM21%2Fforever&label=Visitors&countColor=%23263759)

</div>
