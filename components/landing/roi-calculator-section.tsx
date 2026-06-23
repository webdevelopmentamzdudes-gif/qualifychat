"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/landing/section";
import { Reveal } from "@/components/motion/reveal";

export function RoiCalculatorSection() {
  const [visitors, setVisitors] = useState(2000);
  const [chatRate, setChatRate] = useState(8);
  const [avgValue, setAvgValue] = useState(150);

  const { chats, missed, recovered, revenue } = useMemo(() => {
    const totalChats = Math.round(visitors * (chatRate / 100));
    const missedLeads = Math.round(totalChats * 0.45);
    const recoveredLeads = Math.round(missedLeads * 0.35);
    const recoveredRevenue = recoveredLeads * avgValue;
    return {
      chats: totalChats,
      missed: missedLeads,
      recovered: recoveredLeads,
      revenue: recoveredRevenue,
    };
  }, [visitors, chatRate, avgValue]);

  return (
    <Section
      id="roi"
      eyebrow="ROI estimate"
      title="What are missed chats costing you?"
      subtitle="A simple model — adjust the inputs to match your business."
    >
      <Reveal>
        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
          <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-soft landing-card-glow">
            <div>
              <label htmlFor="visitors" className="text-sm font-medium">
                Monthly website visitors
              </label>
              <input
                id="visitors"
                type="range"
                min={500}
                max={20000}
                step={500}
                value={visitors}
                onChange={(e) => setVisitors(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
                aria-valuemin={500}
                aria-valuemax={20000}
                aria-valuenow={visitors}
              />
              <p className="mt-1 text-sm text-muted-foreground">
                {visitors.toLocaleString()} visitors / mo
              </p>
            </div>

            <div>
              <label htmlFor="chatRate" className="text-sm font-medium">
                Estimated chat / contact rate (%)
              </label>
              <input
                id="chatRate"
                type="range"
                min={2}
                max={25}
                step={1}
                value={chatRate}
                onChange={(e) => setChatRate(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
                aria-valuemin={2}
                aria-valuemax={25}
                aria-valuenow={chatRate}
              />
              <p className="mt-1 text-sm text-muted-foreground">{chatRate}%</p>
            </div>

            <div>
              <label htmlFor="avgValue" className="text-sm font-medium">
                Average customer value ($)
              </label>
              <input
                id="avgValue"
                type="range"
                min={50}
                max={2000}
                step={50}
                value={avgValue}
                onChange={(e) => setAvgValue(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
                aria-valuemin={50}
                aria-valuemax={2000}
                aria-valuenow={avgValue}
              />
              <p className="mt-1 text-sm text-muted-foreground">
                ${avgValue.toLocaleString()}
              </p>
            </div>
          </div>

          <motion.div
            layout
            className="flex flex-col justify-center rounded-2xl border border-primary/25 bg-brand-gradient-soft p-8 landing-card-glow"
          >
            <p className="text-sm text-muted-foreground">
              Estimated monthly conversations
            </p>
            <p className="text-3xl font-bold">{chats}</p>

            <div className="mt-6 space-y-4 border-t border-primary/15 pt-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  Leads at risk without fast response
                </p>
                <p className="text-2xl font-bold text-destructive/90">
                  ~{missed}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Potential recovered leads with QualifyChat
                </p>
                <p className="text-2xl font-bold text-primary">~{recovered}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Estimated recovered revenue / mo
                </p>
                <p className="text-4xl font-bold tracking-tight text-gradient">
                  ${revenue.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Illustrative model only — not a guarantee. Assumes ~45% of
              conversations need faster response and ~35% can be recovered with
              24/7 AI + alerts.
            </p>
          </motion.div>
        </div>
      </Reveal>
    </Section>
  );
}
