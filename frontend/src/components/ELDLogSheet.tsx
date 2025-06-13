import { usePlannerStore } from "../store/store";
import type { LogSegment } from "../services";
import { ELDLogSheetSkeleton } from "./ELDLogSheetSkeleton";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

const STATUS_COLORS: Record<string, string> = {
  off_duty:
    "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-emerald-200/60",
  driving: "bg-gradient-to-r from-blue-400 to-blue-600 shadow-blue-400/60",
  on_duty: "bg-gradient-to-r from-amber-400 to-orange-500 shadow-orange-300/60",
  sleeper_berth:
    "bg-gradient-to-r from-violet-400 to-fuchsia-600 shadow-fuchsia-300/60",
  rest_break: "bg-gradient-to-r from-pink-400 to-pink-600 shadow-pink-300/60",
};

const STATUS_LABELS: Record<string, string> = {
  off_duty: "Off Duty",
  driving: "Driving",
  on_duty: "On Duty (Not Driving)",
  sleeper_berth: "Sleeper Berth",
  rest_break: "Rest/Fuel",
};

const statusOrder = ["off_duty", "sleeper_berth", "driving", "on_duty"];

function timeToHour(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

function getCurrentTimePercent() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const totalMinutes = hour * 60 + minute;
  return (totalMinutes / (24 * 60)) * 100;
}

function CurrentTimeMarker() {
  const [percent, setPercent] = useState(getCurrentTimePercent());
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(getCurrentTimePercent());
    }, 1000 * 20); // update every 20s
    return () => clearInterval(interval);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        left: `calc(${percent}% - 2px)`,
        top: 0,
        bottom: 0,
        width: 3,
      }}
      className="absolute z-30 bg-gradient-to-b from-cyan-400 via-sky-400 to-fuchsia-500 rounded-full shadow-xl"
    >
      {/* Glowing orb at the top */}
      <div className="w-4 h-4 rounded-full bg-cyan-300 blur-[2px] absolute -top-3 left-1/2 -translate-x-1/2 animate-pulse" />
      <div className="w-2 h-2 rounded-full bg-fuchsia-400 absolute -top-1 left-1/2 -translate-x-1/2" />
      {/* Time label */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-black/80 text-white px-2 py-0.5 rounded text-xs shadow select-none">
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </motion.div>
  );
}

function SegmentBar({
  seg,
  status,
  j,
}: {
  seg: LogSegment;
  status: string;
  j: number;
}) {
  const [showTip, setShowTip] = useState(false);
  const startH = timeToHour(seg.start);
  const endH = timeToHour(seg.end);
  const left = (startH / 24) * 100;
  const width = ((endH - startH) / 24) * 100;
  return (
    <div
      key={j}
      className="absolute top-0 h-full group z-10"
      style={{
        left: `${left}%`,
        width: `${width}%`,
        minWidth: 8,
      }}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      onFocus={() => setShowTip(true)}
      onBlur={() => setShowTip(false)}
      tabIndex={0}
      aria-label={`${STATUS_LABELS[status]}: ${seg.start}–${seg.end} ${
        seg.note ?? ""
      }`}
    >
      <motion.div
        initial={{ width: 0, opacity: 0, scale: 0.95 }}
        animate={{ width: "100%", opacity: 1, scale: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.16 + j * 0.06,
          type: "spring",
        }}
        className={`h-full rounded-full ${STATUS_COLORS[status]} shadow-xl`}
        style={{
          boxShadow: "0 0 10px 2px rgba(0,0,0,0.14)",
          filter: "brightness(1.16) saturate(1.35)",
        }}
      />
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{
              type: "spring",
              duration: 0.18,
            }}
            className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-900 text-white px-3 py-2 rounded-xl text-xs shadow-2xl z-40 pointer-events-none"
          >
            <div className="font-bold">{STATUS_LABELS[status]}</div>
            <div>
              {seg.start}–{seg.end}
            </div>
            {seg.note && <div className="italic mt-1">{seg.note}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ELDLogSheet() {
  const { tripResult, loading } = usePlannerStore();
  if (loading) return <ELDLogSheetSkeleton />;
  if (!tripResult?.logs?.length) return null;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
      className="w-full rounded-3xl relative border-0 shadow-2xl p-6 mb-10 overflow-x-auto"
      style={{
        boxShadow: "0 8px 60px 0 rgba(80,0,160,.13)",
        border: "1px solid rgba(120,120,255,0.10)",
      }}
    >
      <h3 className="text-2xl font-black mb-5 text-primary drop-shadow-lg">
        <span className="bg-white/10 dark:bg-black/10 rounded-lg px-3 py-1">
          ELD Log Sheets
        </span>
      </h3>
      <div className="flex flex-col gap-12">
        {tripResult.logs.map((log, i) => (
          <div
            key={i}
            className="relative group rounded-2xl py-5 px-2 mb-2 bg-white/10 dark:bg-black/10 shadow-md backdrop-blur-xl border border-white/10"
          >
            <div className="absolute -top-4 left-4 text-xs px-2 py-1 rounded-xl bg-gradient-to-r from-blue-400 to-fuchsia-500 text-white shadow-md font-semibold z-10">
              {log.date}
            </div>
            {/* Hour labels */}
            <div className="flex justify-between text-[10px] font-mono dark:text-blue-200 mb-1 px-6">
              {[...Array(13)].map((_, h) => (
                <span key={h}>{h * 2}</span>
              ))}
            </div>
            <div className="relative flex flex-col gap-2 px-5">
              {/* MAGICAL TIME MARKER: only for today */}
              {log.date === today && <CurrentTimeMarker />}
              {statusOrder.map((status, idx) => (
                <div
                  key={idx}
                  className="flex items-center h-7 relative"
                  style={{ minHeight: 32 }}
                >
                  <span className="w-32 text-xs dark:text-blue-100 text-black font-medium mr-2 ml-[-40px] text-right select-none">
                    {STATUS_LABELS[status]}
                  </span>
                  <div className="relative flex-1 h-4">
                    {log.log_data
                      .filter((seg: LogSegment) => seg.status === status)
                      .map((seg: LogSegment, j: number) => (
                        <SegmentBar key={j} seg={seg} status={status} j={j} />
                      ))}
                  </div>
                </div>
              ))}
              {/* Grid: Overlaid dashed lines */}
              <div className="absolute left-28 right-0 top-0 bottom-0 z-0 pointer-events-none">
                {[...Array(13)].map((_, h) => (
                  <div
                    key={h}
                    className="absolute border-l border-dashed border-gray-700 dark:border-blue-200/30"
                    style={{
                      left: `calc(${(h / 12) * 100}% - 1px)`,
                      top: 0,
                      bottom: 0,
                      height: "100%",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-4 text-xs dark:text-blue-200">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <span key={key} className="inline-flex items-center gap-1">
            <span
              className="w-3 h-3 inline-block rounded-full"
              style={{
                background: STATUS_COLORS[key]
                  .replace("bg-gradient-to-r", "linear-gradient(to right,")
                  .replace("from-", "")
                  .replace("to-", ",")
                  .replace(/shadow-[^ ]+/, "")
                  .replace(/ /g, ""),
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
