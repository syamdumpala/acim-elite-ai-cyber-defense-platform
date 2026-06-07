import { useThreatStore } from "../state/useThreatStore";
import { motion } from "framer-motion";

import GlobeRenderer from "../render/GlobeRenderer";

import ThreatFeed from "../dashboard/ThreatFeed";
import RiskChart from "../dashboard/RiskChart";
import TimelineController from "../dashboard/TimelineController";
import CountryDistribution from "../dashboard/CountryDistribution";
import SeverityDistribution from "../dashboard/SeverityDistribution";
import IncidentLog from "../dashboard/IncidentLog";

import HoneypotVisualizer from "../defense/HoneypotVisualizer";
import ContainmentZone from "../defense/ContainmentZone";
import NeutralizationEffect from "../defense/NeutralizationEffect";

import StableMode from "../modes/StableMode";
import ElevatedMode from "../modes/ElevatedMode";
import CriticalMode from "../modes/CriticalMode";
import LockdownMode from "../modes/LockdownMode";
import RecoveryMode from "../modes/RecoveryMode";

import { MODES } from "../utils/constants";

export default function CommandCenter() {
  const mode = useThreatStore((s) => s.mode);
  const risk = useThreatStore((s) => s.risk);

  // ==========================
  // MODE SWITCHING
  // ==========================
  let modeConfig;

  switch (mode) {
    case MODES.ELEVATED:
      modeConfig = ElevatedMode();
      break;
    case MODES.CRITICAL:
      modeConfig = CriticalMode();
      break;
    case MODES.LOCKDOWN:
      modeConfig = LockdownMode();
      break;
    case MODES.RECOVERY:
      modeConfig = RecoveryMode();
      break;
    default:
      modeConfig = StableMode();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${modeConfig.background} transition-all duration-500`}
    >
      {/* ========================= HEADER ========================= */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <h1 className={`text-lg font-bold tracking-widest ${modeConfig.accent}`}>
          ACIM ELITE CYBER COMMAND
        </h1>

        <div className="text-sm">
          Risk Index:
          <span className="ml-2 text-red-400 font-semibold">
            {risk}
          </span>
        </div>
      </div>

      {/* ========================= MAIN GRID ========================= */}
      <div className="grid grid-cols-12 gap-6 p-6">

        {/* 3D GLOBE SECTION */}
        <motion.div
          layout
          className="col-span-8 bg-[#111827] rounded-xl border border-gray-800 p-4"
        >
          <GlobeRenderer />
        </motion.div>

        {/* RIGHT PANEL */}
        <div className="col-span-4 flex flex-col gap-6">
          <ThreatFeed />
          <SeverityDistribution />
        </div>

        {/* ANALYTICS ROW */}
        <div className="col-span-6">
          <RiskChart />
        </div>

        <div className="col-span-6">
          <CountryDistribution />
        </div>

        {/* DEFENSE ROW */}
        <div className="col-span-4">
          <HoneypotVisualizer />
        </div>

        <div className="col-span-4">
          <ContainmentZone />
        </div>

        <div className="col-span-4">
          <NeutralizationEffect />
        </div>

        {/* TIMELINE + INCIDENT */}
        <div className="col-span-6">
          <TimelineController />
        </div>

        <div className="col-span-6">
          <IncidentLog />
        </div>
      </div>

      {/* ========================= LOCKDOWN OVERLAY ========================= */}
      {mode === MODES.LOCKDOWN && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          className="fixed inset-0 bg-red-700 pointer-events-none"
        />
      )}
    </motion.div>
  );
}