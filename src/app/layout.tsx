import './globals.css';

export const metadata = {
  title: 'Fix My Chess',
  description: 'Chess.com puzzle progress dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="appShell">
          <header className="appHeader">
            <div className="brand">Fix My Chess</div>
          </header>
          <main className="appMain">{children}</main>
        </div>
      </body>
    </html>
  );
}

