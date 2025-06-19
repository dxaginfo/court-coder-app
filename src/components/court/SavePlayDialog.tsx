import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { createId, downloadJSON, Play, PlayStep } from '@/lib/utils'
import { useToast } from '../ui/use-toast'

interface SavePlayDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  steps: PlayStep[]
}

export const SavePlayDialog = ({
  open,
  onOpenChange,
  steps
}: SavePlayDialogProps) => {
  const { toast } = useToast()
  const [playName, setPlayName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  
  const handleSave = () => {
    if (!playName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your play",
        variant: "destructive"
      })
      return
    }
    
    const newPlay: Play = {
      id: createId(),
      name: playName,
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      steps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // For now, we're just saving it locally as a JSON file
    // In a real app, we'd save it to a database
    downloadJSON(newPlay, `${playName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`)
    
    toast({
      title: "Play saved",
      description: "Your play has been exported as a JSON file"
    })
    
    // Reset the form
    setPlayName('')
    setDescription('')
    setTags('')
    onOpenChange(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Play</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Play Name</Label>
            <Input
              id="name"
              value={playName}
              onChange={(e) => setPlayName(e.target.value)}
              placeholder="e.g., Pick and Roll"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the play..."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., offense, pick, roll"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Play</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}