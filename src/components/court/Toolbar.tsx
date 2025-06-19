import { Button } from "../ui/button"
import { 
  MousePointer, Users, User, Circle, Square, MapPin, 
  PersonStanding, ArrowRight, Trash2, Save
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface ToolbarProps {
  currentTool: string
  onToolChange: (tool: string) => void
  onDelete: () => void
  onSavePlay: () => void
}

export const Toolbar = ({ 
  currentTool, 
  onToolChange,
  onDelete,
  onSavePlay
}: ToolbarProps) => {
  const tools = [
    { id: 'select', icon: <MousePointer className="h-4 w-4" />, label: 'Select' },
    { id: 'home', icon: <User className="h-4 w-4 text-red-500" />, label: 'Home Player' },
    { id: 'away', icon: <User className="h-4 w-4 text-blue-500" />, label: 'Away Player' },
    { id: 'ball', icon: <Circle className="h-4 w-4 text-orange-500" />, label: 'Ball' },
    { id: 'screen', icon: <Square className="h-4 w-4 text-purple-500" />, label: 'Screen' },
    { id: 'marker', icon: <MapPin className="h-4 w-4 text-green-500" />, label: 'Marker' },
    { id: 'coach', icon: <PersonStanding className="h-4 w-4 text-gray-500" />, label: 'Coach' },
    { id: 'movement', icon: <ArrowRight className="h-4 w-4" />, label: 'Movement' },
  ]
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <TooltipProvider>
        {tools.map(tool => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={currentTool === tool.id ? "default" : "outline"}
                size="sm"
                onClick={() => onToolChange(tool.id)}
                className={`h-9 px-2.5 ${currentTool === tool.id ? 'bg-primary text-primary-foreground' : ''}`}
              >
                {tool.icon}
                <span className="ml-1.5">{tool.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        <div className="flex-1"></div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onDelete}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected items</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm"
              onClick={onSavePlay}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Play
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save this play</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}