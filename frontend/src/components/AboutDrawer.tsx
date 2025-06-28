import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Info } from "lucide-react";
import { motion } from "framer-motion";

export function AboutDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-surface/70 text-secondary hover:shadow-lg transition text-sm font-semibold"
        aria-label="About / Help"
      >
        <Info size={18} /> About
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex justify-end">
          <Dialog.Panel className="w-full max-w-md h-full bg-white dark:bg-surface shadow-xl p-8 flex flex-col gap-4 overflow-y-auto rounded-l-3xl">
            <button
              className="ml-auto text-gray-400 hover:text-primary text-xl mb-2"
              onClick={() => setOpen(false)}
              aria-label="Close About"
            >
              ×
            </button>
            <Dialog.Title className="font-bold text-2xl text-secondary mb-2">
              About & Help
            </Dialog.Title>
            <p className="text-base mb-2">
              <strong>Trip Planner</strong> is a smart full-stack demo
              for property-carrying truckers. Enter your route, and our AI plans
              a legal drive under US <b>Hours of Service (HOS)</b> rules, with
              ELD log sheets and map stops.
            </p>
            <ul className="list-disc pl-6 text-sm space-y-2">
              <li>
                Inputs: your current, pickup, dropoff location, and your cycle
                hours used
              </li>
              <li>
                Map: All route stops (pickup, rest, fuel, dropoff) are shown
              </li>
              <li>Log sheet: ELD grid auto-generated for every trip day</li>
              <li>
                Legal rules: 11hr driving/14hr duty, 30min break, fueling every
                1,000mi
              </li>
            </ul>
            <div className="mt-2 text-xs text-gray-500">
              Built by{" "}
              <a
                href="https://github.com/JeanEudes-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Jean-Eudes Assogba
              </a>
              <br />
              For demo purposes only.
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </motion.div>
  );
}
