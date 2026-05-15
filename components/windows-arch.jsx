// windows-arch.jsx — interactive Windows architecture diagram
// Layered model: hardware → HAL → kernel mode (executive, kernel, drivers) → user mode

const { useState: useWS } = React;

const ARCH_LAYERS = [
  {
    id: "user", name: "User mode", nameEn: "User mode", side: "user",
    color: "var(--c-user)", y: 0,
    components: [
      { id: "apps", name: "Applications", nameUz: "Ilovalar", desc: "Word, Chrome, Steam...", descUz: "Word, Chrome, Steam — barcha foydalanuvchi dasturlari.", icon: "code" },
      { id: "services", name: "Services", nameUz: "Servislar", desc: "Windows Update, Print Spooler, etc.", descUz: "Background servislar — Windows Update, Print Spooler.", icon: "settings" },
      { id: "subsystems", name: "Subsystems (Win32, WSL)", nameUz: "Subsistemalar", desc: "API translation layer — kernel32.dll, user32.dll", descUz: "API qatlamlari — kernel32.dll, user32.dll, ntdll.dll.", icon: "layers" },
    ],
  },
  {
    id: "boundary", name: "User ↔ Kernel boundary", nameEn: "Security boundary (syscall gate)", side: "boundary",
    color: "var(--c-warn)", desc: "syscall instruction → ring 3 to ring 0 transition",
  },
  {
    id: "exec", name: "Executive services", nameEn: "Executive services", side: "kernel",
    color: "var(--c-system)", y: 1,
    components: [
      { id: "objmgr", name: "Object Manager", nameUz: "Object Manager", desc: "Tracks every kernel object (processes, files, mutexes)", descUz: "Har bir kernel obyektini (jarayonlar, fayllar, mutex'lar) ro'yxatga oladi.", icon: "database" },
      { id: "procmgr", name: "Process Manager", nameUz: "Process Manager", desc: "Creates/terminates processes & threads", descUz: "Jarayonlar va thread'larni yaratadi/to'xtatadi.", icon: "cpu" },
      { id: "memmgr", name: "Memory Manager", nameUz: "Memory Manager", desc: "Virtual memory, paging, working sets", descUz: "Virtual memory, paging, working set boshqaruvi.", icon: "layers" },
      { id: "iomgr", name: "I/O Manager", nameUz: "I/O Manager", desc: "Routes I/O between drivers", descUz: "Disk, network, USB — barcha I/O so'rovlari shu yerdan o'tadi.", icon: "network" },
      { id: "srm", name: "Security Reference Monitor", nameUz: "Security RM", desc: "Access check on every object handle", descUz: "Har bir handle uchun ruxsat tekshiruvi — ACL hisoblovchi.", icon: "shield" },
    ],
  },
  {
    id: "kernel", name: "Microkernel (NTOSKRNL)", nameEn: "Microkernel (NTOSKRNL)", side: "kernel",
    color: "var(--c-attack)", y: 2,
    components: [
      { id: "sched", name: "Thread scheduler", nameUz: "Scheduler", desc: "Picks the next thread to run on each CPU", descUz: "Har bir CPU yadrosida keyingi thread'ni tanlaydi (priority + quantum).", icon: "spark" },
      { id: "sync", name: "Synchronization", nameUz: "Sync primitives", desc: "Mutex, semaphore, event objects", descUz: "Mutex, semaphore, event — yadro darajasidagi sinxronlash.", icon: "lock" },
      { id: "interrupts", name: "Interrupt dispatch", nameUz: "Interrupts", desc: "IRQL levels, ISRs, DPCs", descUz: "IRQL darajalar, ISR, DPC — hardware uzulishlarini ishlash.", icon: "zap" },
    ],
  },
  {
    id: "drivers", name: "Device drivers", nameEn: "Device drivers", side: "kernel",
    color: "#b88cff", y: 3,
    components: [
      { id: "fsd", name: "Filesystem drivers (NTFS)", nameUz: "NTFS / ReFS", desc: "On-disk format & access", descUz: "Disk format va kirish — NTFS, ReFS, FAT32 drayverlari.", icon: "database" },
      { id: "net", name: "Network drivers", nameUz: "Network", desc: "NDIS, TCP/IP, miniport", descUz: "Tarmoq drayverlari — NDIS stack, TCP/IP, miniport.", icon: "network" },
      { id: "gpu", name: "GPU / display", nameUz: "GPU", desc: "Direct3D, kernel-mode graphics", descUz: "GPU drayverlari — DirectX kernel-mode qismi.", icon: "cpu" },
    ],
  },
  {
    id: "hal", name: "HAL (Hardware Abstraction Layer)", nameEn: "Hardware Abstraction Layer", side: "kernel",
    color: "#8390a8", y: 4,
    desc: "hal.dll — translates between kernel and the actual CPU / chipset specifics",
    descUz: "hal.dll — yadro va aniq CPU/chipset orasidagi tarjima qatlami.",
  },
  {
    id: "hw", name: "Hardware", nameEn: "Hardware", side: "hardware",
    color: "#5a6478", y: 5,
    components: [
      { id: "cpu", name: "CPU (ring 0 / ring 3)", nameUz: "CPU", desc: "Privilege rings enforced by silicon", descUz: "Privilege ring'lari (0/3) — protsessor darajasida amalga oshiriladi.", icon: "cpu" },
      { id: "ram", name: "RAM", nameUz: "RAM", desc: "Physical memory pages", descUz: "Fizik xotira sahifalari.", icon: "database" },
      { id: "disk", name: "Disk / NVMe", nameUz: "Disk", desc: "Block storage", descUz: "Disk — blok saqlash qurilmalari.", icon: "layers" },
      { id: "nic", name: "NIC / GPU / USB", nameUz: "I/O qurilmalari", desc: "External devices", descUz: "Tashqi qurilmalar — NIC, GPU, USB.", icon: "network" },
    ],
  },
];

function WindowsArchDiagram() {
  const [hovered, setHovered] = useWS(null);
  const [selected, setSelected] = useWS(null);
  const lang = useLang();

  const active = (() => {
    if (!hovered && !selected) return null;
    const id = selected || hovered;
    for (const l of ARCH_LAYERS) {
      for (const c of (l.components || [])) {
        if (c.id === id) return { ...c, layerColor: l.color, layerName: lang === "en" ? l.name : (l.nameUz || l.name) };
      }
    }
    return null;
  })();

  return (
    <div style={{
      position: "relative",
      background: "radial-gradient(ellipse at center, rgba(13,19,36,0.85), rgba(4,6,13,0.95))",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      overflow: "hidden",
      padding: "24px 28px",
    }}>
      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span className="chip" style={{ background: "rgba(255,145,69,0.1)", color: "var(--c-user)", borderColor: "rgba(255,145,69,0.3)" }}>
            <span style={{ display: "inline-block", width: 8, height: 8, background: "var(--c-user)", borderRadius: 2 }} />
            {lang === "en" ? "User mode (ring 3)" : "User mode (ring 3)"}
          </span>
          <span className="chip" style={{ background: "rgba(77,139,255,0.1)", color: "var(--c-system)", borderColor: "rgba(77,139,255,0.3)" }}>
            <span style={{ display: "inline-block", width: 8, height: 8, background: "var(--c-system)", borderRadius: 2 }} />
            {lang === "en" ? "Kernel mode (ring 0)" : "Kernel mode (ring 0)"}
          </span>
          <span className="chip chip-gray">
            <span style={{ display: "inline-block", width: 8, height: 8, background: "#5a6478", borderRadius: 2 }} />
            Hardware
          </span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-2)", fontFamily: "var(--font-mono)" }}>
          <LiveDot /> &nbsp;<span style={{ marginLeft: 2 }}>{lang === "en" ? "Hover / click any block" : "Bloklarni bossang"}</span>
        </div>
      </div>

      {/* Layered architecture */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ARCH_LAYERS.map((layer) => (
          <ArchLayer key={layer.id} layer={layer}
            hovered={hovered} selected={selected}
            setHovered={setHovered} setSelected={setSelected}
            lang={lang} />
        ))}
      </div>

      {/* Detail panel */}
      {active && (
        <div style={{
          marginTop: 16,
          background: "rgba(4, 6, 13, 0.92)",
          border: `1px solid ${active.layerColor}`,
          borderRadius: 10,
          padding: "14px 18px",
          display: "flex", gap: 16, alignItems: "flex-start",
          boxShadow: `0 0 24px ${active.layerColor}33`,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: active.layerColor + "20", border: `1px solid ${active.layerColor}`, display: "grid", placeItems: "center", color: active.layerColor, flexShrink: 0 }}>
            <Icon name={active.icon || "info"} size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: active.layerColor }}>
              {lang === "en" ? active.name : (active.nameUz || active.name)}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-2)", marginTop: 2 }}>{active.layerName}</div>
            <div style={{ marginTop: 6, fontSize: 13, color: "var(--text-0)", lineHeight: 1.5 }}>
              {lang === "en" ? active.desc : (active.descUz || active.desc)}
            </div>
          </div>
          <button onClick={() => setSelected(null)} className="btn-ghost btn" style={{ padding: 6, minWidth: 0 }}>
            <Icon name="x" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function ArchLayer({ layer, hovered, selected, setHovered, setSelected, lang }) {
  if (layer.id === "boundary") {
    return (
      <div style={{
        position: "relative",
        textAlign: "center",
        margin: "6px 0",
        padding: "8px 16px",
        background: "rgba(255, 204, 68, 0.06)",
        border: "1px dashed rgba(255, 204, 68, 0.4)",
        borderRadius: 6,
        color: "var(--c-warn)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: 0.18,
        textTransform: "uppercase",
      }}>
        ⇕ {lang === "en" ? layer.nameEn : "User ↔ Kernel chegarasi (syscall)"} ⇕
        <div style={{ fontSize: 9.5, color: "var(--text-3)", letterSpacing: 0.1, textTransform: "none", marginTop: 2, fontStyle: "italic" }}>
          syscall instruction · ring 3 → ring 0
        </div>
      </div>
    );
  }

  const isCompound = layer.components && layer.components.length > 0;

  return (
    <div style={{
      position: "relative",
      background: `linear-gradient(180deg, ${layer.color}0a, transparent)`,
      border: `1px solid ${layer.color}33`,
      borderLeft: `3px solid ${layer.color}`,
      borderRadius: 8,
      padding: "10px 14px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isCompound ? 10 : 0 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: layer.color, letterSpacing: 0.1, fontWeight: 600 }}>
            {lang === "en" ? layer.nameEn || layer.name : (layer.name === "User mode" ? "User mode" : layer.name)}
          </div>
          {!isCompound && layer.desc && (
            <div style={{ fontSize: 12, color: "var(--text-1)", marginTop: 4 }}>
              {lang === "en" ? layer.desc : (layer.descUz || layer.desc)}
            </div>
          )}
        </div>
        {layer.side && (
          <span className="mono" style={{ fontSize: 9.5, color: "var(--text-3)", letterSpacing: 0.12, textTransform: "uppercase" }}>
            {layer.side === "user" ? "ring 3" : layer.side === "kernel" ? "ring 0" : "hardware"}
          </span>
        )}
      </div>

      {isCompound && (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(layer.components.length, 5)}, 1fr)`,
          gap: 6,
        }}>
          {layer.components.map((c) => {
            const isActive = hovered === c.id || selected === c.id;
            return (
              <div key={c.id}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(selected === c.id ? null : c.id)}
                style={{
                  padding: "10px 12px",
                  background: isActive ? layer.color + "20" : "var(--bg-2)",
                  border: `1px solid ${isActive ? layer.color : "var(--border)"}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "all 200ms",
                  boxShadow: isActive ? `0 0 16px ${layer.color}55` : "none",
                  transform: isActive ? "translateY(-1px)" : "none",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: layer.color }}>
                  <Icon name={c.icon || "code"} size={14} />
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: isActive ? "var(--text-0)" : "var(--text-1)" }}>
                    {lang === "en" ? c.name : (c.nameUz || c.name)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

window.WindowsArchDiagram = WindowsArchDiagram;
// Keep ADTopology export for reuse later (it's used in the AD lesson)
