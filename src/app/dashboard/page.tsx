"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getReservations } from "@/lib/db";
import { Reservation } from "@/lib/types";
import Link from "next/link";
import {
  Ticket,
  Calendar,
  XCircle,
  PlusCircle,
  Search,
  ArrowRight,
  TrendingUp,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadData(uid: string) {
      try {
        const resList = await getReservations(uid);
        setReservations(resList);
      } catch (e) {
        console.error("Failed to load reservations", e);
      } finally {
        setLoading(false);
      }
    }
    loadData(user.id);
  }, [user]);

  if (!user) return null;

  // Calculate statistics
  const totalBookings = reservations.length;
  const upcomingTrips = reservations.filter((r) => {
    const isFuture = new Date(r.journey_date) >= new Date(new Date().setHours(0,0,0,0));
    return isFuture && r.status === "Confirmed";
  }).length;
  const cancelledTrips = reservations.filter((r) => r.status === "Cancelled").length;

  const recentBookings = reservations.slice(0, 3);

  return (
    <div className="p-6 md:p-8 space-y-8 select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100">
            Welcome back, <span className="text-yellow-500">{user.full_name}</span>!
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage your rail reservations, book tickets, or view journey histories.
          </p>
        </div>
        <div className="flex gap-3 z-10">
          <Link
            href="/book"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-sm transition active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            Book Ticket
          </Link>
          <Link
            href="/cancel"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-lg text-sm transition active:scale-[0.98]"
          >
            <Search className="w-4 h-4" />
            Quick Cancel
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition duration-300">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-400">Total Bookings</p>
            <p className="text-3xl font-bold text-slate-100">
              {loading ? "-" : totalBookings}
            </p>
          </div>
          <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition duration-300">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition duration-300">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-400">Upcoming Trips</p>
            <p className="text-3xl font-bold text-slate-100">
              {loading ? "-" : upcomingTrips}
            </p>
          </div>
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition duration-300">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition duration-300">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-400">Cancelled Bookings</p>
            <p className="text-3xl font-bold text-slate-100">
              {loading ? "-" : cancelledTrips}
            </p>
          </div>
          <div className="p-4 bg-rose-500/10 text-rose-400 rounded-xl group-hover:scale-110 transition duration-300">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reservations */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">Recent Reservations</h3>
            <Link
              href="/reservations"
              className="text-yellow-500 hover:text-yellow-400 text-xs font-semibold flex items-center gap-1 hover:underline"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-2">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-xs">Loading bookings...</p>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/20 text-center px-4">
              <Ticket className="w-10 h-10 text-slate-600 mb-3" />
              <h4 className="text-sm font-semibold text-slate-300">No Reservations Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                You haven't booked any train tickets. Get started by booking a new ticket now.
              </p>
              <Link
                href="/book"
                className="mt-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500 hover:text-slate-950 px-4 py-2 rounded-lg text-xs font-semibold transition"
              >
                Book Your First Ticket
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700/60 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold bg-slate-800 text-yellow-500 px-2 py-0.5 rounded">
                        {r.pnr}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          r.status === "Confirmed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="text-slate-200">
                      <h4 className="font-semibold text-sm">
                        {r.train_number} - {r.train_name}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {r.from_place} → {r.to_destination}
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-start md:items-end justify-between md:justify-center border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
                    <div className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(r.journey_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <span className="text-xs text-yellow-500/80 font-mono mt-1">
                      {r.class_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips & Travel Guidelines */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
              Travel Tips
            </h3>
            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/40">
                <p className="font-semibold text-slate-300">Identity Proof</p>
                <p className="mt-1">
                  Remember to carry a valid ID proof (Aadhaar Card, Passport, Voter ID) during your journey.
                </p>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/40">
                <p className="font-semibold text-slate-300">Cancellations</p>
                <p className="mt-1">
                  Tickets can be cancelled up to 4 hours before the scheduled train departure time.
                </p>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/40">
                <p className="font-semibold text-slate-300">Reporting Time</p>
                <p className="mt-1">
                  Arrive at the originating station at least 30-45 minutes before departure.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-4 mt-6 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Powered by RailReserve</span>
            <span className="text-yellow-500/80 flex items-center gap-0.5">
              IRCTC Partner <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
