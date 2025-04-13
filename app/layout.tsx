import './styles/globals.css'
import './styles/markdown.scss'
import { ThemeProvider } from 'next-themes'
import I18nServer from './components/i18n-server'
import { getLocaleOnServer } from '@/i18n/server'

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} data-theme="light" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="h-full">
        <div className="overflow-x-auto">
          <div className="w-screen h-screen min-w-[300px]">
            <ThemeProvider
              attribute='data-theme'
              forcedTheme='light'
              defaultTheme='light' // TODO: change to 'system' when dark mode ready
              enableSystem
              disableTransitionOnChange
            >
              <I18nServer>
                {children}
              </I18nServer>
            </ThemeProvider>
          </div>
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout
