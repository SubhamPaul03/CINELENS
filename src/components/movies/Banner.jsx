import useAppStore from '../../store/useAppStore';
import { PRESETS } from '../../data/presets';
import { ImagePlus } from 'lucide-react';

export default function Banner() {
  const currentUser = useAppStore(s => s.getCurrentUser());
  const algorithm = useAppStore(s => s.algorithm);
  const openModal = useAppStore(s => s.openModal);

  if (!currentUser) return null;

  const ratingCount = Object.keys(currentUser.ratings).length;
  const algoLabel = algorithm === 'collab' ? 'Collaborative filtering'
    : algorithm === 'content' ? 'Content-based filtering'
    : 'Hybrid blend';

  const bannerImg = currentUser.bannerImg;
  const isPreset = bannerImg?.startsWith('__preset__');
  const presetIndex = isPreset ? parseInt(bannerImg.replace('__preset__', '')) : -1;

  const bgStyle = isPreset && PRESETS[presetIndex]
    ? { background: PRESETS[presetIndex].bg, opacity: 1 }
    : bannerImg
      ? { backgroundImage: `url(${bannerImg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 }
      : { opacity: 0 };

  return (
    <div
      className="relative h-[148px] rounded-lg border-[1.5px] border-border dark:border-dark-border overflow-hidden mb-5 flex items-end bg-beige-deep dark:bg-dark-card"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={bgStyle}
        aria-hidden="true"
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: bannerImg
            ? 'linear-gradient(to right, rgba(28,24,20,0.82) 0%, rgba(28,24,20,0.35) 55%, transparent 100%)'
            : 'linear-gradient(135deg, rgba(28,24,20,0.6) 0%, rgba(28,24,20,0.2) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-[2] p-4 px-5 flex-1">
        <div className="font-mono text-[0.48rem] tracking-[0.22em] uppercase text-surface/55 mb-[5px]">
          Personalised for you
        </div>
        <h1 className="font-serif text-[clamp(1.3rem,3vw,2rem)] italic text-surface leading-tight">
          Picks for {currentUser.name}
        </h1>
        <div className="text-[0.7rem] text-surface/60 mt-1">
          {algoLabel} · {ratingCount} film{ratingCount !== 1 ? 's' : ''} rated
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-[2] p-4 px-[18px] flex items-end gap-[7px] shrink-0">
        <button
          className="py-[7px] px-3 font-mono text-[0.52rem] tracking-[0.1em] uppercase border-[1.5px] border-surface/35 text-surface/80 bg-ink/38 backdrop-blur-sm rounded cursor-pointer transition-all duration-150 flex items-center gap-[5px] hover:border-surface hover:text-surface hover:bg-ink/60"
          onClick={() => openModal('banner')}
          aria-label="Change banner image"
        >
          <ImagePlus className="w-3 h-3" />
          Change Banner
        </button>
      </div>
    </div>
  );
}
