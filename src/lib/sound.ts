export const playClickSound = () => {
  try {
    const audio = new Audio("/sounds/click.mp3"); // الصوت خصو يكون محطوط في public/sounds/click.mp3
    audio.volume = 0.4; // درجة الصوت (مزيانة ماتكونش مجهدة بزاف)
    audio.play().catch((e) => {
      // كاتحمي التطبيق من الأخطاء يلا المتصفح بلوكا الأوتوبلاي قبل ما يتفاعل المستخدم
      console.log("Audio play blocked or failed:", e);
    });
  } catch (error) {
    console.error("Sound error:", error);
  }
};