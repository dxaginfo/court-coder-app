import { useState } from 'react'
import { PlayStep } from '@/lib/utils'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { 
  ChevronDown, ChevronUp, Edit, Check, X
} from 'lucide-react'

interface PlayStepsProps {
  steps: PlayStep[]
  currentStep: number
  onSelectStep: (index: number) => void
  setSteps: React.Dispatch<React.SetStateAction<PlayStep[]>>
}

export const PlaySteps = ({
  steps,
  currentStep,
  onSelectStep,
  setSteps
}: PlayStepsProps) => {
  const [editingNote, setEditingNote] = useState<number | null>(null)
  const [noteText, setNoteText] = useState<string>('')
  
  const handleStartEditingNote = (index: number) => {
    setEditingNote(index)
    setNoteText(steps[index].note)
  }
  
  const handleSaveNote = () => {
    if (editingNote !== null) {
      const updatedSteps = [...steps]
      updatedSteps[editingNote] = {
        ...updatedSteps[editingNote],
        note: noteText
      }
      setSteps(updatedSteps)
      setEditingNote(null)
    }
  }
  
  const handleCancelEditingNote = () => {
    setEditingNote(null)
  }
  
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-semibold">Play Steps</h3>
      
      <div className="flex flex-col space-y-2">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`border rounded-md ${index === currentStep ? 'border-primary' : 'border-border'}`}
          >
            <div 
              className={`p-3 flex items-center justify-between cursor-pointer ${index === currentStep ? 'bg-primary/5' : ''}`}
              onClick={() => onSelectStep(index)}
            >
              <div className="font-medium">
                Step {index + 1}
              </div>
              
              <div className="flex items-center space-x-2">
                {index !== currentStep ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </div>
            </div>
            
            {index === currentStep && (
              <div className="p-3 border-t">
                {editingNote === index ? (
                  <div className="space-y-2">
                    <Textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add notes for this step..."
                      className="min-h-[80px]"
                    />
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSaveNote}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleCancelEditingNote}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {step.note ? (
                      <div className="space-y-2">
                        <p className="text-sm">{step.note}</p>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStartEditingNote(index)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Note
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStartEditingNote(index)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Add Note
                      </Button>
                    )}
                  </div>
                )}
                
                <div className="mt-2 text-xs text-muted-foreground">
                  <div className="flex space-x-4">
                    <div>Players: {step.players.length}</div>
                    <div>Elements: {step.elements.length}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}