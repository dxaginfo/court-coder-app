import { useState, useRef, useEffect } from 'react'
import { CourtCanvas } from './CourtCanvas'
import { Toolbar } from './Toolbar'
import { PlaySteps } from './PlaySteps'
import { PlayControls } from './PlayControls'
import { createId } from '@/lib/utils'
import type { Player, CourtElement, Movement, PlayStep } from '@/lib/utils'
import { Card } from '../ui/card'
import { SavePlayDialog } from './SavePlayDialog'
import { useToast } from '../ui/use-toast'

const CourtEditor = () => {
  const { toast } = useToast()
  const [players, setPlayers] = useState<Player[]>([])
  const [elements, setElements] = useState<CourtElement[]>([])
  const [movements, setMovements] = useState<Movement[]>([])
  const [currentTool, setCurrentTool] = useState<string>('select')
  const [isDrawingMovement, setIsDrawingMovement] = useState(false)
  const [movementStart, setMovementStart] = useState<{x: number, y: number, id: string} | null>(null)
  const [steps, setSteps] = useState<PlayStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  
  // Initialize with an empty first step
  useEffect(() => {
    if (steps.length === 0) {
      createNewStep()
    }
  }, [])
  
  // Update the current step with the latest data
  useEffect(() => {
    if (steps.length > 0) {
      const updatedSteps = [...steps]
      updatedSteps[currentStepIndex] = {
        ...updatedSteps[currentStepIndex],
        players,
        elements,
        movements
      }
      setSteps(updatedSteps)
    }
  }, [players, elements, movements])
  
  const createNewStep = () => {
    const newStep: PlayStep = {
      id: createId(),
      players: [],
      elements: [],
      movements: [],
      note: ''
    }
    
    setSteps(prevSteps => [...prevSteps, newStep])
    return newStep
  }
  
  const switchToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      const step = steps[index]
      setPlayers(step.players)
      setElements(step.elements)
      setMovements(step.movements)
      setCurrentStepIndex(index)
    }
  }
  
  const addNewStep = () => {
    // Duplicate the current step as a starting point
    const currentStep = steps[currentStepIndex]
    const newPlayers = currentStep.players.map(p => ({...p}))
    const newElements = currentStep.elements.map(e => ({...e}))
    
    const newStep = createNewStep()
    
    // Update the new step with the duplicated players and elements
    const updatedSteps = [...steps]
    const newIndex = steps.length - 1
    updatedSteps[newIndex] = {
      ...newStep,
      players: newPlayers,
      elements: newElements,
      movements: [] // Start with no movements in the new step
    }
    
    setSteps(updatedSteps)
    switchToStep(newIndex)
    
    toast({
      title: "Step added",
      description: `Added step ${newIndex + 1}`,
    })
  }
  
  const handleAddPlayer = (team: 'home' | 'away', x: number, y: number) => {
    const newPlayer: Player = {
      id: createId(),
      x,
      y,
      team,
      number: team === 'home' ? 'H' : 'A',
      isSelected: false
    }
    
    setPlayers(prevPlayers => [...prevPlayers, newPlayer])
  }
  
  const handleAddElement = (type: 'ball' | 'screen' | 'marker' | 'coach', x: number, y: number) => {
    const newElement: CourtElement = {
      id: createId(),
      x,
      y,
      type,
      isSelected: false
    }
    
    setElements(prevElements => [...prevElements, newElement])
  }
  
  const handleCanvasClick = (x: number, y: number) => {
    if (currentTool === 'select') {
      // Handle selection logic
      return
    }
    
    if (currentTool === 'home') {
      handleAddPlayer('home', x, y)
    } else if (currentTool === 'away') {
      handleAddPlayer('away', x, y)
    } else if (['ball', 'screen', 'marker', 'coach'].includes(currentTool)) {
      handleAddElement(currentTool as 'ball' | 'screen' | 'marker' | 'coach', x, y)
    }
  }
  
  const handleStartMovement = (id: string, x: number, y: number) => {
    if (currentTool === 'movement' && !isDrawingMovement) {
      setIsDrawingMovement(true)
      setMovementStart({ id, x, y })
    }
  }
  
  const handleEndMovement = (x: number, y: number) => {
    if (isDrawingMovement && movementStart) {
      const newMovement: Movement = {
        id: createId(),
        startX: movementStart.x,
        startY: movementStart.y,
        endX: x,
        endY: y,
        type: 'movement'
      }
      
      setMovements(prevMovements => [...prevMovements, newMovement])
      setIsDrawingMovement(false)
      setMovementStart(null)
    }
  }
  
  const handleDeleteSelected = () => {
    setPlayers(prevPlayers => prevPlayers.filter(p => !p.isSelected))
    setElements(prevElements => prevElements.filter(e => !e.isSelected))
    
    // Update the current step
    const updatedSteps = [...steps]
    updatedSteps[currentStepIndex] = {
      ...updatedSteps[currentStepIndex],
      players: players.filter(p => !p.isSelected),
      elements: elements.filter(e => !e.isSelected)
    }
    setSteps(updatedSteps)
  }
  
  const handleSavePlay = () => {
    setShowSaveDialog(true)
  }
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Card className="p-4">
            <Toolbar 
              currentTool={currentTool} 
              onToolChange={setCurrentTool}
              onDelete={handleDeleteSelected}
              onSavePlay={handleSavePlay}
            />
            
            <div className="mt-4 bg-background border rounded-md overflow-hidden">
              <CourtCanvas 
                players={players}
                setPlayers={setPlayers}
                elements={elements}
                setElements={setElements}
                movements={movements}
                onClick={handleCanvasClick}
                onStartMovement={handleStartMovement}
                onEndMovement={handleEndMovement}
                currentTool={currentTool}
                isDrawingMovement={isDrawingMovement}
                movementStart={movementStart}
              />
            </div>
            
            <PlayControls 
              currentStep={currentStepIndex + 1}
              totalSteps={steps.length}
              onPrevious={() => switchToStep(currentStepIndex - 1)}
              onNext={() => switchToStep(currentStepIndex + 1)}
              onAddStep={addNewStep}
              disablePrevious={currentStepIndex === 0}
              disableNext={currentStepIndex === steps.length - 1}
            />
          </Card>
        </div>
        
        <div>
          <Card className="p-4">
            <PlaySteps 
              steps={steps}
              currentStep={currentStepIndex}
              onSelectStep={switchToStep}
              setSteps={setSteps}
            />
          </Card>
        </div>
      </div>
      
      <SavePlayDialog 
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        steps={steps}
      />
    </div>
  )
}

export default CourtEditor