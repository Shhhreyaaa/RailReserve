"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getReservationByPnr, cancelReservation } from "@/lib/db";
import { Reservation } from "@/lib/types";
import {
  TicketSlash,
  Search,
  AlertTriangle,
  Loader,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  User as UserIcon,
} from "lucide-react";

export default function CancelPage() {
  const { user } = useAuth();
  const [pnrInput, setPnrInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cancellation state
  const [cancelling, setCancelling] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const pnrClean = pnrInput.trim().toUpperCase();
    if (!pnrClean) {
      setError("Please enter a valid PNR number.");
      return;
    }

    setSearching(true);
    setSearchDone(false);
    setError(null);
    setReservation(null);
    setSuccess(false);

    try {
      const res = await getReservationByPnr(pnrClean);
      if (!res) {
        setError("PNR not found. Please verify the PNR number.");
      } else if (res.user_id !== user.id) {
        // Security check: user can only access their own reservations
        setError("Access Denied: You are not authorized to view this PNR.");
      } else {
        setReservation(res);
      }
    } catch (err: any) {
      setError("Failed to fetch reservation details.");
    } finally {
      setSearching(false);
      setSearchDone(true);
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;
    setCancelling(true);
    setError(null);

    try {
      const isCancelled = await cancelReservation(reservation.id);
      if (isCancelled) {
        setSuccess(true);
        // Update local state status
        setReservation({ ...reservation, status: "Cancelled" });
      } else {
        setError("Failed to cancel ticket. Please try again later.");
      }
    } catch (err) {
      setError("An error occurred while attempting cancellation.");
    } finally {
      setCancelling(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 space-y-6 select-none max-w-2xl mx-auto w-full">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <TicketSlash className="w-6 h-6 text-yellow-500" />
          Cancel Train Ticket
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Search by 10-character PNR to cancel a ticket. Note: cancelled tickets cannot be restored.
        </p>
      </div>

      {/* Search form */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Enter PNR Number
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                placeholder="e.g. PNR7842910"
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-xl px-4 py-3 text-sm outline-none font-mono uppercase tracking-wider transition"
              />
              <button
                type="submit"
                disabled={searching}
                className="bg-yellow-500 hover:bg-yellow-600 active:scale-[0.985] text-slate-950 font-bold px-6 py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                {searching ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search PNR
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-sm">
          <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success banner */}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2 text-emerald-400 text-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>Ticket successfully cancelled. The refund is processed to your original payment mode.</span>
        </div>
      )}

      {/* Reservation Details Card */}
      {reservation && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-scaleIn">
          <div className="bg-slate-950/40 border-b border-slate-800 p-4 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-semibold font-mono">
              PNR: <span className="text-slate-100">{reservation.pnr}</span>
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                reservation.status === "Confirmed"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}
            >
              {reservation.status}
            </span>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Passenger Name</span>
                <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  {reservation.passenger_name}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Train Details</span>
                <span className="text-sm font-bold text-slate-200 block mt-0.5">
                  {reservation.train_number} - {reservation.train_name}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Date of Journey</span>
                <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  {new Date(reservation.journey_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Class</span>
                <span className="text-sm font-bold text-slate-200 block mt-0.5">
                  {reservation.class_type}
                </span>
              </div>
            </div>

            <div className="bg-slate-950/30 border border-slate-800 p-4 rounded-xl flex items-center gap-2 text-xs">
              <MapPin className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <div className="text-slate-300">
                Route: <span className="font-semibold text-slate-100">{reservation.from_place}</span> to{" "}
                <span className="font-semibold text-slate-100">{reservation.to_destination}</span>
              </div>
            </div>

            {/* Cancel Button / Warning */}
            {reservation.status === "Confirmed" ? (
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2.5 text-rose-400 text-xs">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p>
                    <strong>Warning:</strong> Confirming cancellation will instantly release this ticket and change the status of PNR{" "}
                    {reservation.pnr} to Cancelled.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-[0.985] text-slate-100 font-bold py-3 px-4 rounded-xl transition duration-200 disabled:opacity-50 disabled:pointer-events-none text-sm"
                >
                  {cancelling ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            ) : (
              <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-xs font-semibold py-2">
                This ticket has already been cancelled.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
