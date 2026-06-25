export interface User {
  id: string;
  login_id: string;
  password?: string; // Hashed password
  full_name: string;
  email?: string;
  phone?: string;
  created_at: string;
}

export interface Train {
  train_number: string;
  train_name: string;
  classes: string[];
}

export interface Reservation {
  id: string;
  pnr: string;
  user_id: string;
  passenger_name: string;
  train_number: string;
  train_name: string;
  class_type: string;
  journey_date: string;
  from_place: string;
  to_destination: string;
  booking_timestamp: string;
  status: "Confirmed" | "Cancelled";
}
