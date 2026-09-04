import { useState } from 'react';
import type { CategoryType, CategoryGroup } from '../types';
import {
  ALL_LOG_CATEGORIES,
  CATEGORY_GROUPS,
  getGroupMeta
} from '../config/logCategories';

interface LogTypeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  enabledCategories: CategoryType[];
  onSaveCategories: (newEnabled: CategoryType[]) => void;
}

export function LogTypeManagerModal({
  isOpen,
  onClose,
  enabledCategories,
  onSaveCategories
}: LogTypeManagerModalProps) {
  const [selected, setSelected] = useState<Set<CategoryType>>(
    new Set(enabledCategories)
  );
  const [activeGroupFilter, setActiveGroupFilter] = useState<'ALL' | CategoryGroup>('CYBER_OPS');

  if (!isOpen) return null;

  const toggleCategory = (id: CategoryType) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size <= 1) {
          // Do not allow deselecting the last remaining category
          return prev;
        }
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleGroupAll = (group: CategoryGroup, enable: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const groupCategories = ALL_LOG_CATEGORIES.filter((c) => c.group === group);
      groupCategories.forEach((c) => {
        if (enable) {
          next.add(c.id);
        } else {
          if (next.size > 1) {
            next.delete(c.id);
          }
        }
      });
      // Guard: Ensure at least one category is enabled
      if (next.size === 0) {
        next.add(ALL_LOG_CATEGORIES[0].id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(ALL_LOG_CATEGORIES.map((c) => c.id)));
  };

  const resetDefaults = () => {
    setSelected(new Set(ALL_LOG_CATEGORIES.map((c) => c.id)));
  };

  const handleSave = () => {
    const arr = Array.from(selected);
    onSaveCategories(arr.length > 0 ? arr : [ALL_LOG_CATEGORIES[0].id]);
    onClose();
  };

  const filteredCategories = ALL_LOG_CATEGORIES.filter((cat) => {
    return activeGroupFilter === 'ALL' || cat.group === activeGroupFilter;
  });

  const currentGroupMeta = activeGroupFilter === 'ALL' ? null : getGroupMeta(activeGroupFilter);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in font-mono"
      style={{ textShadow: 'none' }}
    >
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Main Modal Window */}
      <div 
        className="relative z-10 w-full max-w-5xl h-[90vh] max-h-[820px] border-2 flex flex-col overflow-hidden shadow-2xl"
        style={{
          textShadow: 'none',
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--color-primary)',
          color: 'var(--text-on-surface)'
        }}
      >
        {/* Modal Top Header Bar */}
        <div 
          className="border-b-2 px-4 py-2.5 flex flex-wrap justify-between items-center text-xs md:text-sm tracking-widest font-black select-none z-30 shrink-0 gap-2"
          style={{
            backgroundColor: 'var(--bg-header)',
            borderColor: 'var(--color-primary)',
            color: 'var(--color-primary)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--color-primary)' }}>
              tune
            </span>
            <span>[ NEURAL_JACK // LOG_MATRIX_CONFIG ]</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span 
              className="text-xs px-2.5 py-0.5 border font-bold tracking-widest"
              style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-container-high)',
                color: 'var(--color-primary)'
              }}
            >
              {selected.size} / {ALL_LOG_CATEGORIES.length} ACTIVE
            </span>

            {/* Quick Batch Action Buttons */}
            <button
              type="button"
              onClick={selectAll}
              className="px-2.5 py-0.5 border text-xs font-bold transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--color-primary)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--color-primary)'
              }}
              title="Enable all log types"
            >
              [ ALL ON ]
            </button>
            <button
              type="button"
              onClick={resetDefaults}
              className="px-2.5 py-0.5 border text-xs transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-on-surface-variant)'
              }}
              title="Reset matrix"
            >
              [ RESET ]
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-0.5 border font-black text-xs cursor-pointer transition-colors ml-1"
              style={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                backgroundColor: 'transparent'
              }}
            >
              [X] ESC
            </button>
          </div>
        </div>

        {/* Two-Pane Body Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden z-30 min-h-0">
          {/* LEFT PANE: Category Domains Navigation (Width ~300px) */}
          <div 
            className="w-full md:w-80 md:min-w-[280px] border-b md:border-b-0 md:border-r flex flex-col p-3 overflow-y-auto shrink-0 gap-2"
            style={{
              backgroundColor: 'var(--bg-container-low)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <div 
              className="text-[10px] font-black uppercase tracking-wider pb-1 mb-1 border-b flex justify-between items-center"
              style={{
                borderColor: 'var(--border-primary)',
                color: 'var(--color-primary)'
              }}
            >
              <span>&gt; DOMAIN_CATEGORIES</span>
              <span className="text-[9px]" style={{ color: 'var(--text-on-surface-variant)' }}>SELECT DOMAIN</span>
            </div>

            {/* ALL Schemas Tab */}
            <button
              type="button"
              onClick={() => setActiveGroupFilter('ALL')}
              className="w-full text-left px-3 py-2.5 border font-mono transition-all cursor-pointer flex items-center justify-between text-xs"
              style={{
                textShadow: 'none',
                backgroundColor: activeGroupFilter === 'ALL' ? 'var(--color-primary)' : 'var(--bg-surface)',
                color: activeGroupFilter === 'ALL' ? 'var(--color-on-primary)' : 'var(--text-on-surface)',
                borderColor: activeGroupFilter === 'ALL' ? 'var(--color-primary)' : 'var(--border-primary)'
              }}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[17px]">
                  apps
                </span>
                <div className="flex flex-col">
                  <span className="font-bold tracking-wider">ALL SCHEMAS</span>
                  <span 
                    className="text-[9px] font-mono"
                    style={{
                      color: activeGroupFilter === 'ALL' ? 'var(--color-on-primary)' : 'var(--text-on-surface-variant)'
                    }}
                  >
                    COMPLETE MATRIX
                  </span>
                </div>
              </div>

              <span
                className="text-[9.5px] px-1.5 py-0.5 border font-bold"
                style={{
                  borderColor: activeGroupFilter === 'ALL' ? 'var(--color-on-primary)' : 'var(--border-primary)',
                  backgroundColor: activeGroupFilter === 'ALL' ? 'color-mix(in srgb, var(--color-on-primary) 20%, transparent)' : 'var(--bg-container-high)',
                  color: activeGroupFilter === 'ALL' ? 'var(--color-on-primary)' : 'var(--color-primary)'
                }}
              >
                {selected.size} / {ALL_LOG_CATEGORIES.length}
              </span>
            </button>

            {/* Category Groups List */}
            {CATEGORY_GROUPS.map((group) => {
              const isSelected = activeGroupFilter === group.id;
              const countInGroup = ALL_LOG_CATEGORIES.filter((c) => c.group === group.id).length;
              const activeInGroup = ALL_LOG_CATEGORIES.filter(
                (c) => c.group === group.id && selected.has(c.id)
              ).length;

              return (
                <div
                  key={group.id}
                  onClick={() => setActiveGroupFilter(group.id)}
                  className="p-2.5 border font-mono transition-all cursor-pointer flex flex-col gap-1.5 select-none"
                  style={{
                    textShadow: 'none',
                    backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--bg-surface)',
                    color: isSelected ? 'var(--color-on-primary)' : 'var(--text-on-surface)',
                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-primary)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-[17px]">
                        {group.icon}
                      </span>
                      <span className="font-bold text-xs tracking-wider truncate">
                        {group.label}
                      </span>
                    </div>

                    <span
                      className="text-[9.5px] px-1.5 py-0.5 border font-bold shrink-0 ml-1.5"
                      style={{
                        borderColor: isSelected ? 'var(--color-on-primary)' : 'var(--border-primary)',
                        backgroundColor: isSelected ? 'color-mix(in srgb, var(--color-on-primary) 20%, transparent)' : 'var(--bg-container-high)',
                        color: isSelected ? 'var(--color-on-primary)' : 'var(--color-primary)'
                      }}
                    >
                      {activeInGroup}/{countInGroup}
                    </span>
                  </div>

                  <div 
                    className="flex items-center justify-between text-[9px] pt-1 border-t"
                    style={{ borderColor: isSelected ? 'color-mix(in srgb, var(--color-on-primary) 25%, transparent)' : 'var(--border-primary)' }}
                  >
                    <span 
                      className="truncate"
                      style={{ color: isSelected ? 'var(--color-on-primary)' : 'var(--text-on-surface-variant)' }}
                    >
                      {group.codename}
                    </span>
                    <div className="flex gap-1 shrink-0 ml-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroupAll(group.id, true);
                        }}
                        className="px-1 py-0.5 border text-[8.5px] font-bold"
                        style={{
                          borderColor: isSelected ? 'var(--color-on-primary)' : 'var(--border-primary)',
                          backgroundColor: isSelected ? 'var(--color-on-primary)' : 'var(--bg-container-high)',
                          color: isSelected ? 'var(--color-primary)' : 'var(--color-primary)'
                        }}
                        title="Enable all schemas in domain"
                      >
                        +ALL
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroupAll(group.id, false);
                        }}
                        className="px-1 py-0.5 border text-[8.5px] font-bold"
                        style={{
                          borderColor: isSelected ? 'var(--color-on-primary)' : 'var(--border-primary)',
                          backgroundColor: isSelected ? 'var(--color-on-primary)' : 'var(--bg-container-high)',
                          color: isSelected ? 'var(--color-primary)' : 'var(--text-on-surface-variant)'
                        }}
                        title="Mute all schemas in domain"
                      >
                        -OFF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT PANE: Selected Domain Schemas & Toggles */}
          <div 
            className="flex-1 flex flex-col p-3 md:p-4 overflow-hidden"
            style={{ backgroundColor: 'var(--bg-panel)' }}
          >
            {/* Domain Context Banner */}
            <div 
              className="border px-3.5 py-2 mb-3 flex flex-wrap justify-between items-center gap-2 text-xs shrink-0"
              style={{
                backgroundColor: 'var(--bg-container-high)',
                borderColor: 'var(--border-primary)'
              }}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-primary)' }}>
                  {currentGroupMeta?.icon || 'view_agenda'}
                </span>
                <div className="flex flex-col truncate">
                  <span className="font-black tracking-wider text-xs" style={{ color: 'var(--color-primary)' }}>
                    {currentGroupMeta?.codename || 'GLOBAL // COMPLETE_SCHEMA_MATRIX'}
                  </span>
                  <span className="text-[10.5px] truncate" style={{ color: 'var(--text-on-surface-variant)' }}>
                    {currentGroupMeta?.description || 'Showing all available protocol log configurations across all domains.'}
                  </span>
                </div>
              </div>

              {activeGroupFilter !== 'ALL' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleGroupAll(activeGroupFilter, true)}
                    className="px-2.5 py-1 border text-[10.5px] font-bold transition-colors cursor-pointer"
                    style={{
                      borderColor: 'var(--color-primary)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--color-primary)'
                    }}
                  >
                    [ ENABLE DOMAIN ]
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleGroupAll(activeGroupFilter, false)}
                    className="px-2.5 py-1 border text-[10.5px] font-bold transition-colors cursor-pointer"
                    style={{
                      borderColor: 'var(--border-primary)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-on-surface-variant)'
                    }}
                  >
                    [ MUTE DOMAIN ]
                  </button>
                </div>
              )}
            </div>

            {/* Schemas List / Grid */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                {filteredCategories.map((cat) => {
                  const isChecked = selected.has(cat.id);

                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className="p-3 border cursor-pointer select-none transition-all flex flex-col justify-between gap-1"
                      style={{
                        textShadow: 'none',
                        backgroundColor: isChecked
                          ? 'color-mix(in srgb, var(--color-primary) 15%, var(--bg-surface) 85%)'
                          : 'var(--bg-surface)',
                        borderColor: isChecked
                          ? 'var(--color-primary)'
                          : 'var(--border-primary)',
                        color: 'var(--text-on-surface)'
                      }}
                    >
                      {/* Line 1: Log Type Name & Toggle */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="material-symbols-outlined text-[18px] shrink-0"
                            style={{ color: isChecked ? 'var(--color-primary)' : 'var(--text-on-surface-variant)' }}
                          >
                            {cat.icon}
                          </span>
                          <span 
                            className="font-bold text-xs md:text-sm tracking-wider truncate"
                            style={{ color: isChecked ? 'var(--color-primary)' : 'var(--text-on-surface)' }}
                          >
                            {cat.label}
                          </span>
                        </div>

                        {/* Retro Sci-Fi [ X ] / [   ] Toggle Box */}
                        <span
                          className="font-mono font-black text-xs tracking-widest px-2 py-0.5 border select-none transition-all shrink-0 ml-2"
                          style={{
                            borderColor: isChecked ? 'var(--color-primary)' : 'var(--border-primary)',
                            backgroundColor: isChecked ? 'color-mix(in srgb, var(--color-primary) 22%, transparent)' : 'var(--bg-container-high)',
                            color: isChecked ? 'var(--color-primary)' : 'var(--text-on-surface-variant)'
                          }}
                        >
                          {isChecked ? '[ X ]' : '[   ]'}
                        </span>
                      </div>

                      {/* Line 2: Badge & Codename Options */}
                      <div className="flex items-center gap-2 flex-wrap my-1">
                        <span
                          className="text-[9px] px-1.5 py-0.5 border font-mono font-black shrink-0"
                          style={{
                            borderColor: isChecked ? 'var(--color-primary)' : 'var(--border-primary)',
                            backgroundColor: isChecked ? 'color-mix(in srgb, var(--color-primary) 20%, transparent)' : 'var(--bg-container-high)',
                            color: isChecked ? 'var(--color-primary)' : 'var(--text-on-surface-variant)'
                          }}
                        >
                          {cat.badge}
                        </span>
                        <span className="text-[9.5px] font-mono truncate" style={{ color: 'var(--text-on-surface-variant)' }}>
                          {cat.codename}
                        </span>
                      </div>

                      {/* Line 3: Description */}
                      <p 
                        className="text-[11px] leading-relaxed mb-1 line-clamp-2"
                        style={{ color: 'var(--text-on-surface)' }}
                      >
                        {cat.description}
                      </p>

                      {/* Line 4: Status Footer */}
                      <div 
                        className="pt-1.5 border-t flex justify-between items-center text-[9.5px] font-mono mt-1"
                        style={{ borderColor: 'var(--border-primary)' }}
                      >
                        <span style={{ color: 'var(--text-on-surface-variant)' }}>
                          GROUP: {cat.group}
                        </span>
                        <span 
                          className="font-bold"
                          style={{ color: isChecked ? 'var(--color-primary)' : 'var(--text-on-surface-variant)' }}
                        >
                          {isChecked ? '[ STATUS: ENABLED ]' : '[ STATUS: MUTED ]'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div 
          className="border-t-2 px-4 py-3 flex flex-wrap justify-between items-center gap-2 text-xs z-30 select-none shrink-0"
          style={{
            backgroundColor: 'var(--bg-header)',
            borderColor: 'var(--color-primary)'
          }}
        >
          <span className="text-[10.5px] font-mono tracking-wider" style={{ color: 'var(--text-on-surface-variant)' }}>
            &gt; NVRAM_WRITE_READY // PERSISTING SCHEMA VECTORS TO MAGNETIC TAPE MATRIX &amp; ORBITAL RELAY
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border font-bold transition-all cursor-pointer text-xs"
              style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-on-surface)'
              }}
            >
              [ CANCEL ]
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-1.5 font-black border transition-all cursor-pointer tracking-widest text-xs"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                borderColor: 'var(--color-primary)'
              }}
            >
              [ SAVE & COMMIT LOG MATRIX ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
