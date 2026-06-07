import { motion } from "framer-motion";
import { ReplayEngine } from "../core/ReplayEngine";

export default function TimelineController() {
  return (
    <motion.div
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      className="bg-[#111827] rounded-xl p-4 border border-gray-800 flex justify-between items-center"
    >
      <h2 className="text-sm text-gray-400 tracking-widest">
        REPLAY CONTROLLER
      </h2>

      <div className="flex gap-3">
        <button
          onClick={() => console.log(ReplayEngine.getHistory())}
          className="px-3 py-1 bg-blue-600 rounded text-xs"
        >
          PLAY
        </button>
        <button
          onClick={() => ReplayEngine.clear()}
          className="px-3 py-1 bg-gray-700 rounded text-xs"
        >
          RESET
        </button>
      </div>
    </motion.div>
  );
}