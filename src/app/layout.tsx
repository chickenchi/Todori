import { Metadata } from "next";
import "./globals.css";
import "react-resizable/css/styles.css";
import Header from "./components/Header"; // 클라이언트 컴포넌트로 분리

export const metadata: Metadata = {
  title: "토도리",
  description: "Todo List",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
