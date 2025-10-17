import BottomNav from "@/components/BottomNav";
import BackgroundImage from "@/components/BackgroundImage";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Image Component */}
      <BackgroundImage />

      {/* Logo Component */}
      <Logo />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
