import './globals.css'
import '../styles/blog-content.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CSS CDN - 临时恢复以确保样式正常 */}
        <script src="https://cdn.tailwindcss.com"></script>
        
        {/* Tailwind 自定义配置 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      primary: {
                        "50":"#f5f3ff",
                        "100":"#ede9fe",
                        "200":"#ddd6fe",
                        "300":"#c4b5fd",
                        "400":"#a78bfa",
                        "500":"#8b5cf6",
                        "600":"#7c3aed",
                        "700":"#6d28d9",
                        "800":"#5b21b6",
                        "900":"#4c1d95",
                        "950":"#2e1065"
                      }
                    }
                  }
                }
              }
            `
          }}
        />
      </head>
      <body suppressHydrationWarning={true} style={{ overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
