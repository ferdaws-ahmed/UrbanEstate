"use client";
import CardWrapper from "./CardWrapper";

export default function SupportTicketStatus() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Support Ticket Status</h3>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Open Tickets</span>
          <span className="text-red-400">12</span>
        </div>

        <div className="flex justify-between">
          <span>In Progress</span>
          <span className="text-yellow-400">8</span>
        </div>

        <div className="flex justify-between">
          <span>Resolved</span>
          <span className="text-emerald-400">24</span>
        </div>
      </div>
    </CardWrapper>
  );
}