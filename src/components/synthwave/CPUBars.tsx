interface CPUBarsProps {
  cores: number[]  // 0–100 per core
}

export function CPUBars({ cores }: CPUBarsProps) {
  const avg = Math.round(cores.reduce((s, v) => s + v, 0) / cores.length)

  return (
    <div className="sw-panel">
      <div className="sw-panel-header">
        <span className="sw-panel-title">CPU CORES</span>
        <span className="sw-panel-title" style={{ color: avg > 80 ? '#FF0055' : avg > 50 ? '#FF6C11' : '#00F0FF' }}>
          {avg}% AVG
        </span>
      </div>
      <div className="sw-cpu-inner">
        <div className="sw-cpu-bars" role="img" aria-label={`CPU usage: ${avg}% average`}>
          {cores.map((val, i) => {
            const color = val > 80 ? '#FF0055' : val > 50 ? '#FF6C11' : val > 30 ? '#B967FF' : '#00F0FF'
            return (
              <div key={i} className="sw-cpu-bar-col">
                <div className="sw-cpu-bar-track">
                  <div
                    className="sw-cpu-bar-fill"
                    style={{
                      height: `${val}%`,
                      background: `linear-gradient(to top, ${color}, rgba(255,255,255,0.3))`,
                      boxShadow: `0 0 6px ${color}, 0 0 12px ${color}40`,
                    }}
                  />
                </div>
                <span className="sw-cpu-bar-label">{i + 1}</span>
              </div>
            )
          })}
        </div>
        <div className="sw-cpu-avg">PROXMOX NODE-1 · 32 CORES</div>
      </div>
    </div>
  )
}
