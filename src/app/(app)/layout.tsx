import { Navbar } from "@/components/shared/navbar";
import { FeedbackProvider } from "@/components/feedback/feedback-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 pb-16 md:pb-0">{children}</main>
      <FeedbackProvider />
    </>
  );
}
