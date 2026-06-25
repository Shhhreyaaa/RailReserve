"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getTrains, createReservation } from "@/lib/db";
import { Train, Reservation } from "@/lib/types";
import TicketModal from "@/components/TicketModal";
import { Train as TrainIcon, Calendar, ArrowRight, ShieldAlert, Loader } from "lucide-react";
import confetti from "canvas-confetti";

export default function BookPage() {
  const { user } = useAuth();
  const [trains, setTrains] = useState<Train[]>([]);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  
  // Form fields
  const [passengerName, setPassengerName] = useState("");
  const [trainNumber, setTrainNumber] = useState("");
  const [trainName, setTrainName] = useState("");
  const [classType, setClassType] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [fromPlace, setFromPlace] = useState("");
  const [toDestination, setToDestination] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successReservation, setSuccessReservation] = useState<Reservation | null>(null);

  // Load trains list
  useEffect(() => {
    async function loadTrains() {
      try {
        const list = await getTrains();
        setTrains(list);
      } catch (e) {
        console.error("Failed to load trains", e);
      }
    }
    loadTrains();
  }, []);

  // Update train name and classes when train number is selected
  const handleTrainNumberChange = (num: string) => {
    setTrainNumber(num);
    const found = trains.find((t) => t.train_number === num);
    if (found) {
      setSelectedTrain(found);
      setTrainName(found.train_name);
      setClassType(""); // Reset class selection
    } else {
      setSelectedTrain(null);
      setTrainName("");
      setClassType("");
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);

    // Basic validation
    if (!passengerName.trim()) {
      setError("Passenger Name is required.");
      return;
    }
    if (!trainNumber) {
      setError("Please select a train number.");
      return;
    }
    if (!classType) {
      setError("Please select a class type.");
      return;
    }
    if (!journeyDate) {
      setError("Please select a journey date.");
      return;
    }
    if (!fromPlace.trim()) {
      setError("Origin station (From) is required.");
      return;
    }
    if (!toDestination.trim()) {
      setError("Destination station (To) is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await createReservation({
        user_id: user.id,
        passenger_name: passengerName.trim(),
        train_number: trainNumber,
        train_name: trainName,
        class_type: classType,
        journey_date: journeyDate,
        from_place: fromPlace.trim(),
        to_destination: toDestination.trim(),
      });

      // Confetti effect
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#eab308", "#3b82f6", "#10b981"],
      });

      setSuccessReservation(res);
      // Reset form
      setPassengerName("");
      setTrainNumber("");
      setTrainName("");
      setSelectedTrain(null);
      setClassType("");
      setJourneyDate("");
      setFromPlace("");
      setToDestination("");
    } catch (err: any) {
      setError(err.message || "Failed to book ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date string for input min attribute
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Tomorrow
    return today.toISOString().split("T")[0];
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 space-y-6 select-none max-w-4xl mx-auto w-full">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <TrainIcon className="w-6 h-6 text-yellow-500" />
          Book Train Ticket
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Reserve seats on long-distance and express trains. All fields are required.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Booking Form Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <form onSubmit={handleBook} className="space-y-6">
          {/* Passenger details */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Passenger Name
            </label>
            <input
              type="text"
              required
              placeholder="Full name of primary passenger"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-xl px-4 py-3 text-sm outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Train Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Train Number
              </label>
              <select
                required
                value={trainNumber}
                onChange={(e) => handleTrainNumberChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-xl px-4 py-3 text-sm outline-none transition"
              >
                <option value="">Select a train...</option>
                {trains.map((train) => (
                  <option key={train.train_number} value={train.train_number}>
                    {train.train_number} ({train.train_name.split(" ")[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Train Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Train Name
              </label>
              <input
                type="text"
                disabled
                placeholder="Select train number to auto-fill"
                value={trainName}
                className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-slate-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Class Type
              </label>
              <select
                required
                disabled={!selectedTrain}
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-xl px-4 py-3 text-sm outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!selectedTrain ? "Select a train first..." : "Select Class..."}
                </option>
                {selectedTrain?.classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Date of Journey */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Date of Journey
              </label>
              <input
                type="date"
                required
                min={getMinDate()}
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-xl px-4 py-3 text-sm outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Station */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                From Station
              </label>
              <input
                type="text"
                required
                placeholder="Boarding station, e.g. New Delhi (NDLS)"
                value={fromPlace}
                onChange={(e) => setFromPlace(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-xl px-4 py-3 text-sm outline-none transition"
              />
            </div>

            {/* To Station */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                To Destination
              </label>
              <input
                type="text"
                required
                placeholder="Destination station, e.g. Howrah Jn (HWH)"
                value={toDestination}
                onChange={(e) => setToDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-xl px-4 py-3 text-sm outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 active:scale-[0.985] text-slate-950 font-bold py-3.5 px-4 rounded-xl transition duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none text-sm uppercase tracking-wider"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Confirm Booking & Generate PNR
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Ticket success modal */}
      <TicketModal
        reservation={successReservation}
        onClose={() => setSuccessReservation(null)}
      />
    </div>
  );
}
