import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import Providers from "./providers";
import Footer from "@/components/footer/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
