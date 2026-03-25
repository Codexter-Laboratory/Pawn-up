import './globals.css';

export const metadata = {
  title: 'Pawn Up',
  description: 'Chess.com stats, ratings, and progress in one dashboard.',
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
            <div className="brand">Pawn Up</div>
          </header>
          <main className="appMain">{children}</main>
        </div>
      </body>
    </html>
  );
}

