import { useState, useEffect, useRef } from 'react';
import useAppStore from '../../store/useAppStore';
import { PRESETS } from '../../data/presets';
import { imageFileToDataUrl } from '../../utils/images';

export default function BannerModal() {
  const closeModal = useAppStore(s => s.closeModal);
  const setBanner = useAppStore(s => s.setBanner);
  const showToast = useAppStore(s => s.showToast);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [urlValue, setUrlValue] = useState('');
  const fileInputRef = useRef(null);

  // Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeModal]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBanner(await imageFileToDataUrl(file, { maxWidth: 1200, maxHeight: 600, quality: 0.76 }));
    showToast('Banner updated', '🖼');
    closeModal();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setBanner(await imageFileToDataUrl(file, { maxWidth: 1200, maxHeight: 600, quality: 0.76 }));
    showToast('Banner updated', '🖼');
    closeModal();
  };

  const handlePresetClick = (index) => {
    setSelectedPreset(index);
    setBanner('__preset__' + index);
  };

  const handleUrlApply = () => {
    const url = urlValue.trim();
    if (!url) return;
    setBanner(url);
    showToast('Banner URL applied', '🖼');
    closeModal();
  };

  const handleRemove = () => {
    setBanner(null);
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 bg-ink/58 backdrop-blur-[5px] z-[400] flex items-center justify-center p-5 modal-overlay"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="banner-modal-title"
    >
      <div
        className="bg-surface dark:bg-dark-surface border-2 border-ink dark:border-dark-border rounded-md w-full max-w-[500px] overflow-hidden modal-content"
        style={{ boxShadow: 'var(--shadow-modal)' }}
      >
        {/* Header */}
        <div className="p-[18px_22px_14px] border-b-[1.5px] border-border dark:border-dark-border">
          <h2 id="banner-modal-title" className="font-serif text-[1.25rem] mb-[2px] text-ink dark:text-dark-text">Change Banner Image</h2>
          <div className="text-[0.7rem] text-muted dark:text-dark-muted">Upload, paste a URL, or pick a preset for your banner.</div>
        </div>

        {/* Body */}
        <div className="p-[18px_22px]">
          {/* Dropzone */}
          <div
            className="border-2 border-dashed border-border dark:border-dark-border rounded-[5px] p-7 px-4 text-center cursor-pointer transition-all duration-150 relative overflow-hidden mb-3.5 bg-beige dark:bg-dark-card hover:border-accent2 hover:bg-accent2/[0.04]"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dropzone-active'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('dropzone-active')}
            onDrop={(e) => { e.currentTarget.classList.remove('dropzone-active'); handleDrop(e); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              aria-label="Upload banner image"
            />
            <div className="text-[1.8rem] opacity-35 mb-1.5">📂</div>
            <div className="text-[0.75rem] text-muted dark:text-dark-muted leading-relaxed">
              <strong className="text-accent2">Click to upload</strong> or drag & drop
            </div>
            <div className="font-mono text-[0.48rem] text-muted dark:text-dark-muted tracking-[0.08em] mt-[3px]">
              JPG · PNG · WEBP · GIF · SVG
            </div>
          </div>

          {/* Presets */}
          <div className="font-mono text-[0.52rem] tracking-[0.18em] uppercase text-muted dark:text-dark-muted mb-[9px]">
            Choose a preset
          </div>
          <div className="grid grid-cols-4 gap-[7px] mb-3.5" role="listbox" aria-label="Banner presets">
            {PRESETS.map((preset, i) => (
              <button
                key={i}
                className={`aspect-[16/7] rounded overflow-hidden cursor-pointer border-2 transition-all duration-150 relative ${
                  selectedPreset === i
                    ? 'border-ink dark:border-dark-text selected'
                    : 'border-transparent hover:border-ink dark:hover:border-dark-text'
                }`}
                onClick={() => handlePresetClick(i)}
                role="option"
                aria-selected={selectedPreset === i}
                aria-label={preset.label}
              >
                <div className="w-full h-full" style={{ background: preset.bg }} />
                {selectedPreset === i && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/48 text-surface text-[0.9rem]">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* URL input */}
          <div className="font-mono text-[0.52rem] tracking-[0.18em] uppercase text-muted dark:text-dark-muted mb-[9px]">
            Paste an image URL
          </div>
          <div className="flex gap-[7px] mb-[18px]">
            <input
              type="text"
              className="flex-1 py-[7px] px-2.5 border-[1.5px] border-border dark:border-dark-border bg-beige-mid dark:bg-dark-card rounded font-mono text-[0.62rem] text-ink dark:text-dark-text outline-none transition-all duration-150 focus:border-ink dark:focus:border-dark-text focus:bg-surface dark:focus:bg-dark-surface placeholder:text-muted dark:placeholder:text-dark-muted"
              placeholder="https://example.com/image.jpg"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlApply()}
              aria-label="Banner image URL"
            />
            <button
              className="py-[7px] px-3 font-mono text-[0.58rem] tracking-[0.08em] uppercase bg-ink dark:bg-dark-text text-surface dark:text-dark-bg border-none rounded cursor-pointer shrink-0 transition-all duration-150 hover:bg-ink-light dark:hover:bg-dark-muted"
              onClick={handleUrlApply}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-[12px_22px_18px] border-t-[1.5px] border-border dark:border-dark-border flex gap-2 justify-end">
          <button
            className="py-[9px] px-[22px] font-mono text-[0.6rem] tracking-[0.1em] uppercase rounded bg-transparent border-[1.5px] border-border dark:border-dark-border text-muted dark:text-dark-muted cursor-pointer transition-all duration-150 hover:border-ink dark:hover:border-dark-text hover:text-ink dark:hover:text-dark-text"
            onClick={handleRemove}
          >
            Remove
          </button>
          <button
            className="py-[9px] px-[22px] font-mono text-[0.6rem] tracking-[0.1em] uppercase rounded bg-ink dark:bg-dark-text border-[1.5px] border-ink dark:border-dark-text text-surface dark:text-dark-bg cursor-pointer transition-all duration-150 hover:bg-ink-light dark:hover:bg-dark-muted"
            onClick={closeModal}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
