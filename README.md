# RailReserve - Online Train Reservation System

RailReserve is a professional, easy-to-use Online Train Reservation System built using **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**, with support for a persistent database layer using **Firebase** (Firestore + Auth) and a automatic **LocalStorage fallback** for zero-setup execution.

---

## Features

1. **Secure Authentication**:
   - Togglable Sign-In and Sign-Up flows.
   - Protected routing ensures unauthenticated users are kept out of private dashboard views.
   - Credentials checked via Firebase Auth (or hashed and checked in LocalStorage).

2. **Dashboard**:
   - Welcomes users with their full name.
   - Live travel statistics (Total Bookings, Upcoming Trips, Cancelled Bookings).
   - Quick action shortcuts to book or cancel tickets.
   - Displays the 3 most recent reservations with color-coded status badges.

3. **Smart Booking System**:
   - Autofills Train Name instantly when a Train Number is selected.
   - Dynamically loads Class Type options (e.g., AC First Class, AC 2-Tier, AC Chair Car) depending on the selected train.
   - Restricts journey date pickers to future dates only.
   - Auto-generates a unique 10-character alphanumeric PNR on successful bookings.
   - Triggers a confetti celebration on confirmation.
   - Opens a print-ready electronic ticket slip modal.

4. **My Reservations Ledger**:
   - Complete grid showing all bookings by the logged-in user.
   - Real-time search by PNR, train name, train number, passenger name, or journey date.
   - Filter dropdowns to filter by status (All, Confirmed, Cancelled).
   - Quick actions to view e-tickets or directly trigger cancellations.

5. **Ticket Cancellation**:
   - Form allowing search of reservations by PNR.
   - Security verification: users cannot view or modify reservations belonging to other users.
   - Detailed ticket read-out showing passenger, train, and route details.
   - Double-confirmation warning dialogues before confirming the soft delete.

---

## Database Seeding

The application is pre-seeded with:
- **10 realistic Indian Trains** (Vande Bharat, Rajdhani, Shatabdi, and Duronto Expresses) with different class listings.
- **2 Demo passenger accounts**.
- **3 Sample reservations** (some Confirmed, some Cancelled) to make the ledger populated from the start.

### Demo Credentials

| Username (Login ID) | Password | Full Name |
| :--- | :--- | :--- |
| `demo_passenger` | `password123` | Aarav Sharma |
| `traveler_shreya` | `password123` | Shreya Somi |

---

## Local Setup & Installation

### 1. Clone the project and install dependencies
```bash
npm install
```

### 2. Configure Firebase (Optional)
If you want to use Firebase instead of the default LocalStorage database, create a `.env.local` file in the root of the project and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```
*Note: If these variables are empty or omitted, RailReserve will fall back to running on the client's LocalStorage, which persists all changes and works immediately with zero configuration.*

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal logs) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```
