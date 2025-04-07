import { Metadata } from "next";
import "./globals.css";
import "react-resizable/css/styles.css";
import Header from "./components/Header"; // 클라이언트 컴포넌트로 분리
import { AlarmProvider } from "./tools/alarmFunction/AlarmProvider";
import { AlarmManager } from "./tools/alarmFunction/AlarmManager";
import { WaitProvider } from "./tools/waitFunction/WaitProvider";
import Waiting from "./tools/waitFunction/Waiting";

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
    <html lang="en" data-google-analytics-opt-out="">
      <body cz-shortcut-listen="true">
        <Header />
        <WaitProvider>
          <Waiting />
          <AlarmProvider>{children}</AlarmProvider>
        </WaitProvider>
      </body>
    </html>
  );
}
