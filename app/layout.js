import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: "MDP 音樂論壇",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>
        <Navbar />
        <main style={{ padding: 20 }}>{children}</main>
      </body>
    </html>
  );
}
