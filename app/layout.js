import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Daybeau QR Manager',
  description: 'QR 코드 및 링크 관리',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
