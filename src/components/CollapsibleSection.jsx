import { useState, useEffect } from 'react'

/**
 * Collapsible panel section.
 * - globalExpand: true = force open, false = force close, null = use own state
 * - onUserToggle: called when user manually toggles (lets parent reset globalExpand)
 */
export default function CollapsibleSection({ title, children, defaultOpen = false, badge, globalExpand, onUserToggle }) {
  const [ownOpen, setOwnOpen] = useState(defaultOpen)

  // Sync own state when parent forces expand/collapse
  useEffect(() => {
    if (globalExpand !== null && globalExpand !== undefined) setOwnOpen(globalExpand)
  }, [globalExpand])

  const open = (globalExpand !== null && globalExpand !== undefined) ? globalExpand : ownOpen

  function toggle() {
    const next = !open
    setOwnOpen(next)
    onUserToggle?.()
  }

  return (
    <div className="bg-white/10 backdrop-blur rounded-xl overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{title}</span>
          {badge != null && (
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5 leading-none">{badge}</span>
          )}
        </div>
        <span className={`text-white/50 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}
