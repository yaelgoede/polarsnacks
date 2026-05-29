import { BusinessNavbar } from "@/components/business/business-navbar";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BusinessNavbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </>
  );
}
