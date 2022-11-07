import React from 'react'
import { MantineProvider, AppShell, Header } from '@mantine/core'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Navbar } from './components'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="md"
        navbar={<Navbar />}
        header={
          <Header height={60} p="xs">
            Header
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        <App />
      </AppShell>
    </MantineProvider>
  </React.StrictMode>
)
