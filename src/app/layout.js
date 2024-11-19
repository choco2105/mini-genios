import { Bubblegum_Sans } from 'next/font/google';
import './globals.css';

const bubblegum = Bubblegum_Sans({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Mini Genios - Juegos Educativos',
  description: 'Juegos educativos para niños',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={bubblegum.className}>
      <body>
        {children}
      </body>
    </html>
  )
}