"use client";

import React from "react";
import { Reservation } from "@/lib/types";
import { X, Printer, Train, ShieldCheck, Ticket } from "lucide-react";

interface TicketModalProps {
  reservation: Reservation | null;
  onClose: () => void;
}

export default function TicketModal({ reservation, onClose }: TicketModalProps) {
  if (!reservation) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm print:p-0 print:bg-white select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-scaleIn print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 print:hidden bg-slate-900/50">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-yellow-500" />
            Electronic Reservation Slip (ERS)
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Content */}
        <div className="p-6 md:p-8 space-y-6 print:p-0">
          {/* Watermark / Style Header */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-slate-800/60 pb-6 print:border-slate-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg print:border-black print:text-black">
                <Train className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-100 print:text-black">
                  Rail<span className="text-yellow-500 print:text-black">Reserve</span>
                </h4>
                <p className="text-[10px] text-slate-400 tracking-wider font-mono print:text-slate-600">
                  BOARDING PASS / E-TICKET
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-mono block print:text-slate-600">
                PNR NUMBER
              </span>
              <span className="text-lg font-mono font-bold text-yellow-500 print:text-black">
                {reservation.pnr}
              </span>
            </div>
          </div>

          {/* Grid Journey details */}
          <div className="grid grid-cols-2 gap-y-6 md:grid-cols-4 border-b border-slate-800 pb-6 print:border-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Train Details</span>
              <span className="text-sm font-bold text-slate-200 print:text-black">
                {reservation.train_number}
              </span>
              <span className="text-xs text-slate-400 block truncate print:text-slate-700">
                {reservation.train_name}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Class</span>
              <span className="text-sm font-bold text-slate-200 print:text-black">
                {reservation.class_type}
              </span>
              <span className="text-xs text-slate-400 block print:text-slate-700">
                Quota: General
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Date of Journey</span>
              <span className="text-sm font-bold text-slate-200 print:text-black">
                {new Date(reservation.journey_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-xs text-slate-400 block print:text-slate-700">
                Future Date
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Status</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full inline-block font-semibold mt-1 border ${
                  reservation.status === "Confirmed"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 print:bg-transparent print:text-black print:border-black"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20 print:bg-transparent print:text-black print:border-black"
                }`}
              >
                {reservation.status}
              </span>
            </div>
          </div>

          {/* Boarding and destination details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/40 p-4 border border-slate-800 rounded-xl print:bg-transparent print:border-none print:p-0">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">From Station</span>
              <span className="text-sm font-bold text-slate-200 print:text-black">
                {reservation.from_place}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">To Destination</span>
              <span className="text-sm font-bold text-slate-200 print:text-black">
                {reservation.to_destination}
              </span>
            </div>
          </div>

          {/* Passenger details */}
          <div className="border-b border-slate-800 pb-6 print:border-slate-300">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-2">
              Passenger Information
            </span>
            <div className="w-full bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden print:border-slate-300">
              <table className="w-full text-left text-xs font-mono text-slate-400 print:text-black">
                <thead className="bg-slate-950/50 border-b border-slate-800 uppercase text-[9px] font-semibold text-slate-500 print:border-slate-300 print:bg-slate-100">
                  <tr>
                    <th className="px-4 py-2">No.</th>
                    <th className="px-4 py-2">Passenger Name</th>
                    <th className="px-4 py-2 text-right">Seat / Coach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
                  <tr>
                    <td className="px-4 py-3">1</td>
                    <td className="px-4 py-3 text-slate-200 font-bold print:text-black">
                      {reservation.passenger_name}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300 print:text-black">
                      S3 / 24 (Upper Berth)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Stylized QR-Code / barcode section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono print:text-black">
              <ShieldCheck className="w-4 h-4 text-emerald-500 print:text-black" />
              Secure Digital Reservation Record
            </div>
            <div className="text-center font-mono text-[9px] text-slate-600 print:text-black border border-slate-800/40 p-2 rounded-lg bg-slate-900/10 print:border-slate-300">
              [ RAILRESERVE QR SECURE DATA SCAN ]
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-900/50 border-t border-slate-800/80 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition active:scale-[0.98]"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
