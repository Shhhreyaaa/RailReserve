import { Train, Reservation, User } from "./types";

export const DEFAULT_TRAINS: Train[] = [
  {
    train_number: "12002",
    train_name: "New Delhi Shatabdi Express",
    classes: ["AC Chair Car", "Executive Class"],
  },
  {
    train_number: "12301",
    train_name: "Howrah Rajdhani Express",
    classes: ["AC First Class", "AC 2-Tier", "AC 3-Tier"],
  },
  {
    train_number: "22436",
    train_name: "Vande Bharat Express",
    classes: ["AC Chair Car", "Executive Chair Car"],
  },
  {
    train_number: "12260",
    train_name: "Sealdah Duronto Express",
    classes: ["AC First Class", "AC 2-Tier", "AC 3-Tier", "Sleeper Class"],
  },
  {
    train_number: "12626",
    train_name: "Kerala Express",
    classes: ["AC 2-Tier", "AC 3-Tier", "Sleeper Class", "General Class"],
  },
  {
    train_number: "12951",
    train_name: "Mumbai Rajdhani Express",
    classes: ["AC First Class", "AC 2-Tier", "AC 3-Tier"],
  },
  {
    train_number: "12839",
    train_name: "Howrah Chennai Mail",
    classes: ["AC 2-Tier", "AC 3-Tier", "Sleeper Class", "General Class"],
  },
  {
    train_number: "12267",
    train_name: "Mumbai Central Duronto",
    classes: ["AC First Class", "AC 2-Tier", "AC 3-Tier", "Sleeper Class"],
  },
  {
    train_number: "12009",
    train_name: "Mumbai Central Shatabdi",
    classes: ["AC Chair Car", "Executive Class"],
  },
  {
    train_number: "20607",
    train_name: "MGR Chennai Central Vande Bharat",
    classes: ["AC Chair Car", "Executive Chair Car"],
  },
];

// Seed some initial user data for testing
export const DEFAULT_USERS: User[] = [
  {
    id: "user-1",
    login_id: "demo_passenger",
    full_name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "9876543210",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "user-2",
    login_id: "traveler_shreya",
    full_name: "Shreya Somi",
    email: "shreya@example.com",
    phone: "9988776655",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Seed reservations
export const DEFAULT_RESERVATIONS: Reservation[] = [
  {
    id: "res-1",
    pnr: "PNR4829103",
    user_id: "user-1",
    passenger_name: "Aarav Sharma",
    train_number: "12301",
    train_name: "Howrah Rajdhani Express",
    class_type: "AC 2-Tier",
    journey_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    from_place: "New Delhi (NDLS)",
    to_destination: "Howrah Jn (HWH)",
    booking_timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Confirmed",
  },
  {
    id: "res-2",
    pnr: "PNR7463920",
    user_id: "user-1",
    passenger_name: "Neha Sharma",
    train_number: "12002",
    train_name: "New Delhi Shatabdi Express",
    class_type: "AC Chair Car",
    journey_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    from_place: "New Delhi (NDLS)",
    to_destination: "Habibganj (HBJ)",
    booking_timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Confirmed",
  },
  {
    id: "res-3",
    pnr: "PNR1098472",
    user_id: "user-2",
    passenger_name: "Shreya Somi",
    train_number: "22436",
    train_name: "Vande Bharat Express",
    class_type: "Executive Chair Car",
    journey_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    from_place: "New Delhi (NDLS)",
    to_destination: "Varanasi Jn (BSB)",
    booking_timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Cancelled",
  },
];
