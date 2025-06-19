import { useRef, useState, useEffect } from 'react'
import type { Player, CourtElement, Movement } from '@/lib/utils'
import { clamp } from '@/lib/utils'
import basketballCourt from '@/assets/basketball-court.svg'

interface CourtCanvasProps {
  players: Player[]
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>
  elements: CourtElement[]
  setElements: React.Dispatch<React.SetStateAction<CourtElement[]>>
  movements: Movement[]
  onClick: (x: number, y: number) => void
  onStartMovement: (id: string, x: number, y: number) => void
  onEndMovement: (x: number, y: number) => void
  currentTool: string
  isDrawingMovement: boolean
  movementStart: {x: number, y: number, id: string} | null
}

export const CourtCanvas = ({
  players,
  setPlayers,
  elements,
  setElements,
  movements,
  onClick,
  onStartMovement,
  onEndMovement,
  currentTool,
  isDrawingMovement,
  movementStart
}: CourtCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [tempLine, setTempLine] = useState<{x: number, y: number} | null>(null)
  const [dragging, setDragging] = useState(false)
  const [dragTarget, setDragTarget] = useState<{id: string, type: 'player' | 'element'} | null>(null)
  const [courtImage, setCourtImage] = useState<HTMLImageElement | null>(null)
  
  const COURT_ASPECT_RATIO = 1.87 // Aspect ratio of the basketball court
  const PLAYER_RADIUS = 20
  const ELEMENT_RADIUS = 15
  
  // Load court image
  useEffect(() => {
    const img = new Image()
    img.src = basketballCourt
    img.onload = () => setCourtImage(img)
  }, [])
  
  const getCanvasPosition = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    return { x, y }
  }
  
  const handleClick = (e: React.MouseEvent) => {
    if (dragging) return
    
    const { x, y } = getCanvasPosition(e.clientX, e.clientY)
    onClick(x, y)
  }
  
  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getCanvasPosition(e.clientX, e.clientY)
    
    // Check if clicking on an existing player
    const clickedPlayer = players.find(p => {
      const dx = p.x - x
      const dy = p.y - y
      return Math.sqrt(dx * dx + dy * dy) <= PLAYER_RADIUS
    })
    
    if (clickedPlayer) {
      if (currentTool === 'select') {
        // Handle selection
        setPlayers(players.map(p => ({
          ...p,
          isSelected: p.id === clickedPlayer.id ? !p.isSelected : p.isSelected
        })))
        return
      }
      
      if (currentTool === 'movement') {
        onStartMovement(clickedPlayer.id, clickedPlayer.x, clickedPlayer.y)
        return
      }
      
      // Start dragging this player
      setDragging(true)
      setDragTarget({ id: clickedPlayer.id, type: 'player' })
      return
    }
    
    // Check if clicking on an existing element
    const clickedElement = elements.find(e => {
      const dx = e.x - x
      const dy = e.y - y
      return Math.sqrt(dx * dx + dy * dy) <= ELEMENT_RADIUS
    })
    
    if (clickedElement) {
      if (currentTool === 'select') {
        // Handle selection
        setElements(elements.map(e => ({
          ...e,
          isSelected: e.id === clickedElement.id ? !e.isSelected : e.isSelected
        })))
        return
      }
      
      if (currentTool === 'movement') {
        onStartMovement(clickedElement.id, clickedElement.x, clickedElement.y)
        return
      }
      
      // Start dragging this element
      setDragging(true)
      setDragTarget({ id: clickedElement.id, type: 'element' })
      return
    }
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return
    
    const { x, y } = getCanvasPosition(e.clientX, e.clientY)
    
    // Handle drawing temp movement line
    if (isDrawingMovement && movementStart) {
      setTempLine({ x, y })
    }
    
    // Handle dragging
    if (dragging && dragTarget) {
      const bounds = canvasRef.current.getBoundingClientRect()
      const clampedX = clamp(x, 0, bounds.width)
      const clampedY = clamp(y, 0, bounds.height)
      
      if (dragTarget.type === 'player') {
        setPlayers(players.map(p => 
          p.id === dragTarget.id 
            ? { ...p, x: clampedX, y: clampedY } 
            : p
        ))
      } else if (dragTarget.type === 'element') {
        setElements(elements.map(e => 
          e.id === dragTarget.id 
            ? { ...e, x: clampedX, y: clampedY } 
            : e
        ))
      }
    }
  }
  
  const handleMouseUp = (e: React.MouseEvent) => {
    const { x, y } = getCanvasPosition(e.clientX, e.clientY)
    
    // Handle finishing a movement line
    if (isDrawingMovement) {
      onEndMovement(x, y)
      setTempLine(null)
    }
    
    // Reset dragging state
    setDragging(false)
    setDragTarget(null)
  }
  
  // Draw the court and all elements
  const drawCanvas = () => {
    if (!canvasRef.current) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const bounds = canvasRef.current.getBoundingClientRect()
    canvas.width = bounds.width
    canvas.height = bounds.height
    
    // Draw court background
    if (courtImage) {
      ctx.drawImage(courtImage, 0, 0, canvas.width, canvas.height)
    } else {
      ctx.fillStyle = '#f8f8f8'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw court outline
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)
    }
    
    // Draw movements
    ctx.lineWidth = 3
    movements.forEach(movement => {
      ctx.beginPath()
      ctx.moveTo(movement.startX, movement.startY)
      ctx.lineTo(movement.endX, movement.endY)
      ctx.strokeStyle = '#333'
      ctx.stroke()
      
      // Draw arrow head
      const angle = Math.atan2(movement.endY - movement.startY, movement.endX - movement.startX)
      const arrowSize = 10
      ctx.beginPath()
      ctx.moveTo(movement.endX, movement.endY)
      ctx.lineTo(
        movement.endX - arrowSize * Math.cos(angle - Math.PI / 6),
        movement.endY - arrowSize * Math.sin(angle - Math.PI / 6)
      )
      ctx.lineTo(
        movement.endX - arrowSize * Math.cos(angle + Math.PI / 6),
        movement.endY - arrowSize * Math.sin(angle + Math.PI / 6)
      )
      ctx.closePath()
      ctx.fillStyle = '#333'
      ctx.fill()
    })
    
    // Draw temporary movement line
    if (isDrawingMovement && movementStart && tempLine) {
      ctx.beginPath()
      ctx.moveTo(movementStart.x, movementStart.y)
      ctx.lineTo(tempLine.x, tempLine.y)
      ctx.strokeStyle = '#999'
      ctx.stroke()
    }
    
    // Draw elements
    elements.forEach(element => {
      ctx.beginPath()
      ctx.arc(element.x, element.y, ELEMENT_RADIUS, 0, 2 * Math.PI)
      
      if (element.isSelected) {
        ctx.fillStyle = 'rgba(66, 153, 225, 0.6)'
      } else {
        switch (element.type) {
          case 'ball':
            ctx.fillStyle = '#ff9900'
            break
          case 'screen':
            ctx.fillStyle = '#6b46c1'
            break
          case 'marker':
            ctx.fillStyle = '#22c55e'
            break
          case 'coach':
            ctx.fillStyle = '#9ca3af'
            break
        }
      }
      
      ctx.fill()
      
      if (element.isSelected) {
        ctx.strokeStyle = '#3182ce'
        ctx.lineWidth = 3
        ctx.stroke()
      }
      
      // Draw icon/text for element type
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '12px sans-serif'
      
      let symbol = ''
      switch (element.type) {
        case 'ball':
          symbol = '🏀'
          break
        case 'screen':
          symbol = 'S'
          break
        case 'marker':
          symbol = 'X'
          break
        case 'coach':
          symbol = 'C'
          break
      }
      
      ctx.fillText(symbol, element.x, element.y)
    })
    
    // Draw players
    players.forEach(player => {
      ctx.beginPath()
      ctx.arc(player.x, player.y, PLAYER_RADIUS, 0, 2 * Math.PI)
      
      if (player.isSelected) {
        ctx.fillStyle = 'rgba(66, 153, 225, 0.6)'
      } else {
        ctx.fillStyle = player.team === 'home' ? '#ef4444' : '#3b82f6'
      }
      
      ctx.fill()
      
      if (player.isSelected) {
        ctx.strokeStyle = '#3182ce'
        ctx.lineWidth = 3
        ctx.stroke()
      }
      
      // Draw player number
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = 'bold 14px sans-serif'
      ctx.fillText(player.number || '', player.x, player.y)
    })
    
    // Replace the current canvas content
    const existingCanvas = canvasRef.current.querySelector('canvas')
    if (existingCanvas) {
      canvasRef.current.removeChild(existingCanvas)
    }
    canvasRef.current.appendChild(canvas)
  }
  
  // Draw canvas whenever data changes
  useEffect(() => {
    drawCanvas()
  }, [players, elements, movements, tempLine, courtImage])
  
  return (
    <div 
      ref={canvasRef}
      className="court-canvas w-full aspect-[1.87] relative cursor-crosshair"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  )
}