# G31_EndTerm
Team-Members:
1. Rishi Srivastava
2. Prakhar Shahi
3. Ayush Goswami
4. Saksham Wadwa
5. Shruti Gupta

Problem Statement: Food Donation & Pickup Coordination System 
work flow:-
```
1.Admin
    - Login
    - View Requests
    - Assign Volunteers
    - Manage Users
    - Generate Reports
2.donor
    - Register/Login
    - Create Donation Request
    - Verify Volunteer with OTP for Pickup
    - View Donation History
3.Volunteer:-
    - Register/Login
    - View Assigned Pickups
    - Verify Pickup with Donor OTP
    - Generate OTP for Food Delivery
    - Update Pickup Status
4.Receiver:-
    - Register/Login
    - Enter OTP to Receive Food
    - View Received Food History



Scrap-to-Smile/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Donation.js
│   │   └── Request.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── donations.js
│   │   └── requests.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DonationForm.jsx
│   │   │   ├── DonationList.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── DonorDashboard.jsx
│   │   │   ├── VolunteerDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── socket.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```
 Tech Stack
 Frontend
- React.js for building user dashboards for donor, volunteer, admin and receiver
- Vite as the development bundler
- Context API for authentication and global state
- Axios for API requests
- Socket.io client for real-time updates
- TailwindCSS or CSS for styling

 Backend
- Node.js as the server environment
- Express.js for building REST APIs
- MongoDB for storing users, donations and requests
- Mongoose for schema modeling
- JWT for authentication
- Bcrypt.js for password hashing
- Socket.io for real-time communication

 Additional Tools
- Git and GitHub for version control and team collaboration
- Postman for API testing


