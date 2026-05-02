**📌 Overview**

FoodBridge is a web-based food sharing platform that connects food donors with receivers through instant alerts. It helps reduce food wastage by enabling quick and efficient redistribution of surplus food.

The system provides a simple and user-friendly interface where donors can post available food and receivers can get notified instantly.

**🚀 Features**

🔐 Role-based Login

Donor login

Receiver login with OTP verification

📢 Instant Food Alerts

Donors can post food details

Receivers get notified quickly

🍛 Food Selection with Images

Multiple food items can be selected

Image preview supported

📍 Location Integration

Manual entry or auto-detect location

⏳ Expiry Tracking

Donors can set “Best Before” time

🔑 OTP Verification

Secure confirmation during pickup

👀 Live Preview

Real-time preview of posted food details

**🛠️ Technologies Used**

Frontend: HTML, CSS, JavaScript

Backend (Optional Integration): Firebase (Firestore)

**Other Features:**

Geolocation API

Session Storage

OTP Simulation

**📂 Project Structure**

FoodBridge/
│
├── index.html          # Landing page
├── login.html          # Login page (Donor/Receiver)
├── donor_post.html     # Donor food posting page
├── receiver_view.html  # Receiver dashboard (if included)
├── style.css           # Styling
├── firebase-init.js    # Firebase configuration
└── assets/             # Images (food items)

**⚙️ How It Works**

User selects role (Donor / Receiver)

Login with email & password

**Donor:**

Select food items

Add quantity, expiry, and location

Post alert

**Receiver:**

Gets notified instantly

Confirms pickup using OTP

Food is successfully shared 🎉

🔧 Setup Instructions

**Clone the repository:**

git clone https://github.com/Hema263/FoodBridge.git

Open the project folder:

cd FoodBridge

**Run the project:**

Open index.html in your browser


🔥 Firebase Setup (Optional)
To enable real-time database:
Create a project in Firebase
Enable Firestore Database
Add your Firebase config in firebase-init.js
Ensure Firestore rules allow read/write

**🎯 Use Case**

Reducing food wastage

Helping needy people

Connecting communities

Real-time food redistribution


📈** Future Enhancements**

📱 Mobile app version

🔔 Push notifications

🤖 AI-based food priority prediction
🗺️ Map-based tracking
📊 Analytics dashboard
