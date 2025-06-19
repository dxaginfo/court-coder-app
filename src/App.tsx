import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import CourtEditor from './components/court/CourtEditor'
import PlayLibrary from './components/library/PlayLibrary'
import Header from './components/layout/Header'

function App() {
  const [activeTab, setActiveTab] = useState('editor')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-4">
        <Tabs defaultValue="editor" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="editor">Court Editor</TabsTrigger>
            <TabsTrigger value="library">Play Library</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="mt-6">
            <CourtEditor />
          </TabsContent>
          
          <TabsContent value="library" className="mt-6">
            <PlayLibrary />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Court Coder Basketball Playbook Animator - © 2025</p>
        </div>
      </footer>
    </div>
  )
}

export default App