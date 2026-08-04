interface AnnouncementBarProps {
  text?: string;
}

export default function AnnouncementBar({ text }: AnnouncementBarProps) {
  return (
    <div className="bg-[#FF9F1C] text-white py-2 px-4 text-center text-xs font-bold tracking-wide shadow-inner flex items-center justify-center gap-2">
      <span>{text || "🔥 التوصيل مجاني للطلبات فوق 150 درهم!"}</span>
    </div>
  );
}