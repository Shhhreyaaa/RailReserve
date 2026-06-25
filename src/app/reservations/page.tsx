"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getReservations, cancelReservation } from "@/lib/db";
import { Reservation } from "@/lib/types";
import TicketModal from "@/components/TicketModal";
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  AlertTriangle,
  Loader,
} from "lucide-react";

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Ticket Modal state
  const [viewTicket, setViewTicket] = useState<Reservation | null>(null);

  // Cancellation Modal state
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const loadReservations = async () => {
    if (!user) return;
    try {
      const list = await getReservations(user.id);
      setReservations(list);
    } catch (e) {
      console.error("Failed to load reservations", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [user]);

  // Apply filters and searches
  useEffect(() => {
    let result = reservations;

    // Apply Status Filter
    if (statusFilter !== "All") {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.pnr.toLowerCase().includes(q) ||
          r.train_name.toLowerCase().includes(q) ||
          r.train_number.includes(q) ||
          r.passenger_name.toLowerCase().includes(q) ||
          r.journey_date.includes(q)
      );
    }

    setFilteredReservations(result);
  }, [reservations, searchQuery, statusFilter]);

  const handleCancelClick = (r: Reservation) => {
    setCancelTarget(r);
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const success = await cancelReservation(cancelTarget.id);
      if (success) {
        // Refresh local reservations state
        await loadReservations();
        setCancelTarget(null);
      }
    } catch (e) {
      console.error("Cancellation failed", e);
    } finally {
      setCancelling(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 space-y-6 select-none w-full">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-yellow-500" />
            My Reservations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse, filter, search, view, or cancel your booked train tickets.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by PNR, train name, number, passenger or date (YYYY-MM-DD)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-yellow-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition text-slate-200 placeholder-slate-500"
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-yellow-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition text-slate-200 appearance-none cursor-pointer"
          >
            <option value="All">All Bookings</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-2">
          <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
          <p className="text-slate-400 text-xs">Loading reservations...</p>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10 text-center px-4">
          <ClipboardList className="w-12 h-12 text-slate-700 mb-3" />
          <h4 className="text-sm font-semibold text-slate-300">No Reservations Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {reservations.length === 0
              ? "You haven't made any reservations yet. Head over to the booking tab."
              : "No reservations match your current search queries or filters."}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 border-b border-slate-800 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">PNR</th>
                  <th className="px-6 py-4">Passenger</th>
                  <th className="px-6 py-4">Train</th>
                  <th className="px-6 py-4">Journey Date</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
                {filteredReservations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-950/30 transition">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-yellow-500 bg-slate-950 px-2.5 py-1 border border-slate-800 rounded">
                        {r.pnr}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {r.passenger_name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">
                        {r.train_number}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {r.train_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(r.journey_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Class: {r.class_type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">{r.from_place.split(" ")[0]}</div>
                      <div className="text-slate-500 text-[10px] py-0.5">to</div>
                      <div className="text-slate-300">{r.to_destination.split(" ")[0]}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${
                          r.status === "Confirmed"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewTicket(r)}
                          title="View E-Ticket"
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 hover:text-yellow-500 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {r.status === "Confirmed" && (
                          <button
                            onClick={() => handleCancelClick(r)}
                            title="Cancel Ticket"
                            className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-100 rounded-lg border border-rose-500/20 hover:border-transparent transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      <TicketModal
        reservation={viewTicket}
        onClose={() => setViewTicket(null)}
      />

      {/* Confirmation Warning Modal for Cancellation */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-rose-500">
                <div className="p-2 bg-rose-500/15 rounded-lg border border-rose-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-100">Confirm Ticket Cancellation</h4>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to cancel the ticket for passenger{" "}
                <strong className="text-slate-200">{cancelTarget.passenger_name}</strong> on train{" "}
                <strong className="text-slate-200">
                  {cancelTarget.train_number} ({cancelTarget.train_name})
                </strong>
                ? This action is permanent, and updates the PNR status immediately.
              </p>

              <div className="bg-slate-950/50 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">PNR Number:</span>
                <span className="font-mono font-bold text-yellow-500">{cancelTarget.pnr}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-900/50 border-t border-slate-800/80">
              <button
                onClick={() => setCancelTarget(null)}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelling}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-slate-100 font-bold px-4 py-2 rounded-lg text-xs transition active:scale-[0.98] disabled:opacity-50"
              >
                {cancelling ? (
                  <Loader className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Confirm Cancel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
