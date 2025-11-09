import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { create } from "zustand";
import dayjs from "dayjs";
import { nanoid } from "nanoid";

// ---------- Types
type Tier = "bronze" | "silver" | "gold" | "platinum";

type Reward = {
  id: string;
  title: string;
  vendor: string;
  points: number;
  tier: Tier;
  badge?: string;
  description?: string;
  icon?: string; // lucide name if you use icons elsewhere
  colorFrom: string; // gradient start
  colorTo: string;   // gradient end
};

type RedemptionTicket = {
  ticketId: string;
  rewardId: string;
  title: string;
  vendor: string;
  points: number;
  issuedAt: string;   // ISO
  expiresAt: string;  // ISO
  status: "active" | "consumed" | "expired";
  qrPayload: string;  // signed data payload
};

// ---------- Catalog (associate colors with tiers like Revolut)
const TIER_COLORS: Record<Tier, { from: string; to: string; ring: string }> = {
  bronze:   { from: "from-[#7a4b2b]", to: "to-[#bf8a5a]", ring: "ring-[#caa177]/40" },
  silver:   { from: "from-[#585c68]", to: "to-[#b9c4cf]", ring: "ring-[#c7d3df]/40" },
  gold:     { from: "from-[#9a7a2f]", to: "to-[#f0d27a]", ring: "ring-[#f4e2a2]/40" },
  platinum: { from: "from-[#5b6a78]", to: "to-[#c0d8ee]", ring: "ring-[#cfe7ff]/40" },
};

// Example rewards; you can fetch from API instead
const DEFAULT_CATALOG: Reward[] = [
  {
    id: "coffee-10",
    title: "£10 Coffee Voucher",
    vendor: "Campus Coffee",
    points: 250,
    tier: "bronze",
    description: "Treat yourself or a friend.",
    colorFrom: "#7a4b2b",
    colorTo: "#bf8a5a",
  },
  {
    id: "spotify-1m",
    title: "1 mo Spotify Premium",
    vendor: "Spotify",
    points: 750,
    tier: "silver",
    description: "Music on us for a month.",
    colorFrom: "#585c68",
    colorTo: "#b9c4cf",
  },
  {
    id: "gym-day",
    title: "Premium Gym Day Pass",
    vendor: "Anytime Fitness",
    points: 1600,
    tier: "gold",
    description: "Train, swim, sauna — full package.",
    colorFrom: "#9a7a2f",
    colorTo: "#f0d27a",
  },
  {
    id: "getaway-lite",
    title: "Weekend Getaway Lite",
    vendor: "Student Breaks",
    points: 4800,
    tier: "platinum",
    description: "Two days escape. You earned it.",
    colorFrom: "#5b6a78",
    colorTo: "#c0d8ee",
  },
];

// ---------- Local storage helpers
const LS_KEYS = {
  points: "savr_points",
  redemptions: "savr_redemptions",
};

const loadJSON = <T,>(k: string, fallback: T): T => {
  try {
    const s = localStorage.getItem(k);
    return s ? (JSON.parse(s) as T) : fallback;
  } catch {
    return fallback;
  }
};
const saveJSON = (k: string, v: unknown) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

// ---------- Store
type RewardsState = {
  points: number;
  catalog: Reward[];
  redemptions: RedemptionTicket[];
  setPoints: (p: number) => void;
  addPoints: (delta: number) => void;
  redeem: (reward: Reward) => RedemptionTicket | null;
  consumeTicket: (ticketId: string) => void;
  expireTickets: () => void;
  resetAll: () => void;
};

export const useRewardsStore = create<RewardsState>((set, get) => ({
  points: loadJSON<number>(LS_KEYS.points, 1250), // default demo
  catalog: DEFAULT_CATALOG,
  redemptions: loadJSON<RedemptionTicket[]>(LS_KEYS.redemptions, []),

  setPoints: (p) => { set({ points: p }); saveJSON(LS_KEYS.points, p); },
  addPoints: (delta) => {
    const next = Math.max(0, get().points + delta);
    set({ points: next }); saveJSON(LS_KEYS.points, next);
  },

  // Creates a signed QR payload (offline demo). In prod, request server to mint.
  redeem: (reward) => {
    const current = get().points;
    if (current < reward.points) return null;

    // Deduct immediately (optimistic)
    const nextPoints = current - reward.points;
    const issuedAt = dayjs();
    const expiresAt = issuedAt.add(30, "minute"); // 30-min expiry window

    // Minimal signature demo (do server-side HMAC in prod)
    const ticketId = nanoid(10);
    const payload = {
      v: 1,
      tid: ticketId,
      rid: reward.id,
      pts: reward.points,
      ts: issuedAt.toISOString(),
      exp: expiresAt.toISOString(),
    };
    const qrPayload = btoa(JSON.stringify(payload)); // for demo only

    const ticket: RedemptionTicket = {
      ticketId,
      rewardId: reward.id,
      title: reward.title,
      vendor: reward.vendor,
      points: reward.points,
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: "active",
      qrPayload,
    };

    const updated = [...get().redemptions, ticket];
    set({ points: nextPoints, redemptions: updated });
    saveJSON(LS_KEYS.points, nextPoints);
    saveJSON(LS_KEYS.redemptions, updated);
    return ticket;
  },

  consumeTicket: (ticketId) => {
    const updated = get().redemptions.map(t =>
      t.ticketId === ticketId ? { ...t, status: "consumed" as const } : t
    );
    set({ redemptions: updated }); saveJSON(LS_KEYS.redemptions, updated);
  },

  expireTickets: () => {
    const now = dayjs();
    const updated = get().redemptions.map(t =>
      t.status === "active" && now.isAfter(dayjs(t.expiresAt))
        ? { ...t, status: "expired" as const }
        : t
    );
    set({ redemptions: updated }); saveJSON(LS_KEYS.redemptions, updated);
  },

  resetAll: () => {
    set({ points: 0, redemptions: [] });
    saveJSON(LS_KEYS.points, 0);
    saveJSON(LS_KEYS.redemptions, []);
  },
}));

// ---------- UI Helpers
const glass = "backdrop-blur-lg bg-white/5 border border-white/10 shadow-[0_0_1px_0_rgba(255,255,255,0.15)_inset,0_10px_40px_-10px_rgba(0,0,0,0.5)]";
const metallicRing = (tier: Tier) => `ring-1 ${TIER_COLORS[tier].ring}`;
const metallicGradCls = (tier: Tier) =>
  `bg-gradient-to-br ${TIER_COLORS[tier].from} ${TIER_COLORS[tier].to}`;
const fmtPts = (n: number) => `${n.toLocaleString()} pts`;

// ---------- Swipe to claim (framer)
const SwipeToClaim: React.FC<{ onConfirm: () => void; disabled?: boolean }> = ({ onConfirm, disabled }) => {
  const controls = useAnimation();
  const [progress, setProgress] = useState(0);

  return (
    <div className="relative w-full h-14 rounded-xl overflow-hidden bg-black/30 border border-white/10">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.07),transparent_60%)]" />
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 280 }}
        dragElastic={0.04}
        onDrag={(e, info) => {
          const p = Math.min(1, Math.max(0, info.point.x / 280));
          setProgress(p);
        }}
        onDragEnd={(e, info) => {
          if (progress > 0.85 && !disabled) {
            onConfirm();
            controls.start({ x: 0 });
            setProgress(0);
          } else {
            controls.start({ x: 0 });
            setProgress(0);
          }
        }}
        animate={controls}
        className="h-14 w-36 rounded-xl cursor-pointer select-none grid place-items-center text-sm font-medium text-white shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, rgba(40,255,190,0.8), rgba(0,200,120,0.8))",
        }}
      >
        Swipe to claim →
      </motion.div>
      <div
        className="absolute left-0 top-0 h-full bg-emerald-500/10 transition-[width]"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
};

// ---------- Redeem modal
const RedeemModal: React.FC<{
  open: boolean;
  onClose: () => void;
  selected?: Reward | null;
  onRedeemed?: (t: RedemptionTicket) => void;
}> = ({ open, onClose, selected, onRedeemed }) => {
  const { points, redeem } = useRewardsStore();
  const [ticket, setTicket] = useState<RedemptionTicket | null>(null);

  useEffect(() => { if (!open) setTicket(null); }, [open]);

  const canRedeem = selected && points >= (selected?.points ?? Infinity);

  return (
    <AnimatePresence>
      {open && selected && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/60"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`w-[min(800px,92vw)] ${glass} rounded-2xl p-6`}
          >
            {!ticket ? (
              <>
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl ${metallicGradCls(selected.tier)} shadow-inner`} />
                  <div>
                    <h3 className="text-white text-lg font-semibold">{selected.title}</h3>
                    <p className="text-white/60 text-sm">{selected.vendor}</p>
                  </div>
                  <div className="ml-auto text-emerald-400 font-semibold">{fmtPts(selected.points)}</div>
                </div>

                <div className="my-6 grid gap-2 text-sm text-white/70">
                  <p>Confirm redemption. You'll receive a time-limited QR code to present at the vendor.</p>
                  <p>Available balance will be reduced immediately.</p>
                </div>

                <SwipeToClaim
                  disabled={!canRedeem}
                  onConfirm={() => {
                    const t = redeem(selected);
                    if (t) { setTicket(t); onRedeemed?.(t); }
                  }}
                />

                <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                  <span>Balance: {fmtPts(points)}</span>
                  {!canRedeem && <span className="text-rose-400">Not enough points</span>}
                </div>

                <div className="mt-6 flex justify-end">
                  <button onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white">
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl ${metallicGradCls(selected.tier)}`} />
                  <div>
                    <h3 className="text-white text-lg font-semibold">Show this QR to redeem</h3>
                    <p className="text-white/60 text-sm">{selected.title} — {selected.vendor}</p>
                  </div>
                  <div className="ml-auto text-emerald-400 font-semibold">Expires in 30 min</div>
                </div>

                <div className="grid place-items-center py-6">
                  <div className="rounded-2xl p-4 bg-black/40 border border-white/10">
                    <QRCodeCanvas value={ticket.qrPayload} size={220} level="M" includeMargin />
                  </div>
                  <p className="mt-3 text-white/60 text-xs">
                    Ticket: {ticket.ticketId} — {fmtPts(ticket.points)}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white">
                    Done
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---------- Reward card
const RewardCard: React.FC<{
  reward: Reward;
  onSelect: (r: Reward) => void;
  disabled?: boolean;
}> = ({ reward, onSelect, disabled }) => {
  const tier = reward.tier;
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled}
      onClick={() => onSelect(reward)}
      className={`text-left rounded-2xl p-4 ${glass} ${metallicRing(tier)} transition
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:ring-emerald-400/40"}`}
    >
      <div className={`h-10 w-full rounded-xl ${metallicGradCls(tier)} mb-3`} />
      <div className="flex items-center gap-3">
        <div>
          <div className="text-white font-semibold">{reward.title}</div>
          <div className="text-xs text-white/60">{reward.vendor}</div>
        </div>
        <div className="ml-auto text-emerald-400 font-semibold">{fmtPts(reward.points)}</div>
      </div>
      {reward.description && (
        <div className="mt-2 text-xs text-white/60">{reward.description}</div>
      )}
    </motion.button>
  );
};

// ---------- History row
const HistoryRow: React.FC<{ t: RedemptionTicket }> = ({ t }) => {
  const statusColor =
    t.status === "active" ? "text-amber-300" :
    t.status === "consumed" ? "text-emerald-400" : "text-rose-400";
  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5">
      <div className="text-white/80 text-sm">{t.title}</div>
      <div className="text-xs text-white/50">{t.vendor}</div>
      <div className="ml-auto text-xs text-white/50">{dayjs(t.issuedAt).format("DD MMM, HH:mm")}</div>
      <div className={`ml-4 text-xs ${statusColor}`}>{t.status}</div>
    </div>
  );
};

// ---------- Main Panel (section)
export const RewardsPanel: React.FC = () => {
  const { points, catalog, redemptions, expireTickets, consumeTicket } = useRewardsStore();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Reward | null>(null);

  // Expire tickets on mount + every 30s
  useEffect(() => {
    const run = () => expireTickets();
    run();
    const id = setInterval(run, 30000);
    return () => clearInterval(id);
  }, [expireTickets]);

  const onSelect = (r: Reward) => { setSelected(r); setOpen(true); };

  // Simulated vendor scan: click "Mark used" inside history (demo)
  const [showHistory, setShowHistory] = useState(false);

  // Tier header
  const tierNow: Tier =
    points >= 5000 ? "platinum" :
    points >= 1500 ? "gold" :
    points >= 500 ? "silver" : "bronze";

  const nextTierTarget =
    tierNow === "bronze" ? 500 :
    tierNow === "silver" ? 1500 :
    tierNow === "gold" ? 5000 : 5000;

  const toNext = Math.max(0, nextTierTarget - points);

  return (
    <div className="relative grid gap-6">
      {/* Header */}
      <div className={`rounded-3xl p-6 ${glass}`}>
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-xl ${metallicGradCls(tierNow)}`} />
          <div>
            <div className="text-white/70 text-xs">Current Tier</div>
            <div className="text-white font-semibold capitalize">{tierNow}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-white/70 text-xs">Points</div>
            <div className="text-emerald-400 font-semibold">{points.toLocaleString()}</div>
            <div className="text-white/50 text-xs">To next: {toNext.toLocaleString()} pts</div>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-2 bg-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (points / nextTierTarget) * 100)}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => { setSelected(null); setOpen(true); }}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30"
          >
            Redeem Rewards
          </button>
          <button
            onClick={() => setShowHistory(v => !v)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white"
          >
            {showHistory ? "Hide" : "View"} History
          </button>
        </div>
      </div>

      {/* Catalog */}
      <div className="grid md:grid-cols-2 gap-4">
        {catalog.map((r) => (
          <RewardCard
            key={r.id}
            reward={r}
            onSelect={onSelect}
            disabled={points < r.points}
          />
        ))}
      </div>

      {/* History */}
      {showHistory && (
        <div className={`rounded-3xl p-6 ${glass}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold">Redemption History</h4>
            <div className="text-xs text-white/50">Tap a ticket to mark "used" (demo)</div>
          </div>
          <div className="divide-y divide-white/5">
            {redemptions.length === 0 && (
              <div className="text-white/50 text-sm">No redemptions yet.</div>
            )}
            {redemptions.map((t) => (
              <div key={t.ticketId} className="group">
                <HistoryRow t={t} />
                {t.status === "active" && (
                  <div className="py-2 -mt-2">
                    <button
                      onClick={() => consumeTicket(t.ticketId)}
                      className="px-3 py-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs"
                    >
                      Mark used (vendor scan)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <RedeemModal
        open={open}
        onClose={() => setOpen(false)}
        selected={selected ?? undefined}
      />
    </div>
  );
};
