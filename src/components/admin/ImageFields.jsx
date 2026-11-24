import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";

async function uploadOne(file) {
  const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
  return file_url;
}

export function ImageField({ label, value, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadOne(file));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="font-body text-[10px] uppercase tracking-[0.16em] text-foreground/50">{label}</span>
      <div className="mt-2 flex items-start gap-4">
        <div className="h-24 w-20 shrink-0 overflow-hidden border border-gold/40 bg-[#F2EBDD]">
          {value ? <Image src={value} alt="" className="h-full w-full" /> : null}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFiles} className="hidden" id={`upload-${label.replace(/\s+/g, "-")}`} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 border border-gold/50 px-3 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-primary/80 transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" strokeWidth={1.5} />}
            Upload
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1 font-body text-[10px] uppercase tracking-[0.16em] text-foreground/40 hover:text-destructive">
              <X className="h-3 w-3" /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MultiImageField({ label, values = [], onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setBusy(true);
    try {
      const uploaded = [];
      for (const file of files) uploaded.push(await uploadOne(file));
      onChange([...(values ?? []), ...uploaded]);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="font-body text-[10px] uppercase tracking-[0.16em] text-foreground/50">{label}</span>
      <div className="mt-2 flex flex-wrap gap-3">
        {(values ?? []).map((src, index) => (
          <div key={`${src}-${index}`} className="relative h-20 w-20 overflow-hidden border border-gold/40">
            <Image src={src} alt="" className="h-full w-full" />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center bg-[#4A2029] text-white"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-20 w-20 flex-col items-center justify-center gap-1 border border-dashed border-gold/60 text-primary/60 transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" strokeWidth={1.5} />}
          <span className="font-body text-[9px] uppercase tracking-[0.12em]">Add</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
    </div>
  );
}