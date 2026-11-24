export const telHref = (phone) => {
  const cleaned = String(phone ?? "").replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : null;
};

export const waHref = (number) => {
  const digits = String(number ?? "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
};

export const webHref = (url) => {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

export const mailHref = (email) => (email ? `mailto:${email}` : null);