import { useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/LanguageContext";

export function Lightbox({ photos, index, onClose, onNavigate }) {
  const { t, pick } = useLanguage();
  const photo = photos[index];

  const step = useCallback(
    (direction) => {
      if (photos.length === 0) return;
      onNavigate((index + direction + photos.length) % photos.length);
    },
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", handleKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, step]);

  if (!photo) return null;
  const caption = pick(photo, "caption");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caption || t("gallery.eyebrow")}
      className="fixed inset-0 z-[80] flex flex-col bg-[#1C0D11]/97"
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="eyebrow text-[#F8F4EC]/55">
          {index + 1} / {photos.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="flex h-11 w-11 items-center justify-center text-[#F8F4EC]/70 transition-colors hover:text-[#F8F4EC]"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-3 sm:px-16">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={t("common.previous")}
          className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center border border-[#F8F4EC]/25 text-[#F8F4EC]/80 transition-colors hover:border-[#B99A65] hover:text-[#F8F4EC] sm:left-6"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <Image
          key={photo.id}
          src={photo.image}
          alt={photo.alt_text || caption || "Ganpati celebration photograph"}
          className="h-[64vh] w-full max-w-5xl"
          fittingType="fit"
        />

        <button
          type="button"
          onClick={() => step(1)}
          aria-label={t("common.next")}
          className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center border border-[#F8F4EC]/25 text-[#F8F4EC]/80 transition-colors hover:border-[#B99A65] hover:text-[#F8F4EC] sm:right-6"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="px-5 pb-8 pt-4 text-center sm:px-8">
        {caption && <p className="mx-auto max-w-2xl font-body text-sm leading-relaxed text-[#F1E7DA]/80">{caption}</p>}
      </div>
    </div>
  );
}