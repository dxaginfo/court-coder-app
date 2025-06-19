import { Button } from "../ui/button"
import { 
  ChevronLeft, ChevronRight, Plus
} from "lucide-react"

interface PlayControlsProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onAddStep: () => void
  disablePrevious: boolean
  disableNext: boolean
}

export const PlayControls = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onAddStep,
  disablePrevious,
  disableNext
}: PlayControlsProps) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={disablePrevious}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <div className="text-sm font-medium">
          Step {currentStep} of {totalSteps}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={disableNext}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onAddStep}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Step
      </Button>
    </div>
  )
}