import 'react-toastify/dist/ReactToastify.css'
import { defaultMetadata } from '../metadata'
import '../styles/globals.css'

export const metadata = defaultMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='p-0 m-0 scrollbar-hide'>
      <head>
        <script defer src='https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.4/socket.io.js' />
      </head>
      <body className='overflow-x-hidden p-0 m-0 font-sans text-white cursor-default bg-body scrollbar-hide'>
        {children}
      </body>
    </html>
  )
}
