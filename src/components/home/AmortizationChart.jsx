"use client";

import React, { useEffect, useRef } from "react";

// Loads Chart.js from CDN and renders a stacked bar chart showing principal vs interest per year
export default function AmortizationChart({ loanAmount, annualRate, years }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadChart = () => {
      return new Promise((resolve) => {
        if (typeof window === "undefined") return resolve();
        if (window.Chart) return resolve();
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    let chartInstance;

    loadChart().then(() => {
      if (!canvasRef.current || !window.Chart) return;
      const ctx = canvasRef.current.getContext("2d");

      // compute yearly principal & interest
      const monthlyRate = annualRate / 100 / 12;
      const months = Math.max(1, Math.round(years * 12));
      let balance = loanAmount;
      const perYear = {};

      // compute EMI
      let emi = 0;
      if (monthlyRate === 0) emi = loanAmount / months;
      else {
        const x = Math.pow(1 + monthlyRate, months);
        emi = (loanAmount * monthlyRate * x) / (x - 1);
      }

      for (let m = 1; m <= months; m++) {
        const interest = balance * monthlyRate;
        const principal = emi - interest;
        balance = Math.max(0, balance - principal);
        const year = Math.ceil(m / 12);
        perYear[year] = perYear[year] || { principal: 0, interest: 0 };
        perYear[year].principal += principal;
        perYear[year].interest += interest;
      }

      const labels = Object.keys(perYear).map((y) => `Y${y}`);
      const principalData = Object.values(perYear).map((v) => Math.round(v.principal));
      const interestData = Object.values(perYear).map((v) => Math.round(v.interest));

      chartInstance = new window.Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            { label: "Principal", data: principalData, backgroundColor: "#0f2e28" },
            { label: "Interest", data: interestData, backgroundColor: "#94a894" },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true },
            y: { stacked: true },
          },
          plugins: { legend: { position: "bottom" } },
        },
      });
    });

    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, [loanAmount, annualRate, years]);

  return <div style={{ height: 260 }} className="mt-6"><canvas ref={canvasRef} /></div>;
}
