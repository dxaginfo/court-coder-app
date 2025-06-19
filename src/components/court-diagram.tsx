import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Save, Download, MoveHorizontal, MoveVertical } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Player {
  id: string;
  x: number;
  y: number;
  team: 'home' | 'away';
  number: number;
}

interface CourtDiagramProps {
  initialPlayers?: Player[];
  onSave?: (players: Player[]) => void;
  readOnly?: boolean;
}

export function CourtDiagram({ 
  initialPlayers = [], 
  onSave,
  readOnly = false
}: CourtDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const courtWidth = 470;
  const courtHeight = 500;
  const playerRadius = 15;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw court
    drawCourt(ctx);

    // Draw players
    players.forEach(player => {
      drawPlayer(ctx, player, player.id === selectedPlayer);
    });
  }, [players, selectedPlayer]);

  const drawCourt = (ctx: CanvasRenderingContext2D) => {
    // Court outline
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, courtWidth, courtHeight);

    // Half court line
    ctx.beginPath();
    ctx.moveTo(10, courtHeight / 2 + 10);
    ctx.lineTo(courtWidth + 10, courtHeight / 2 + 10);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(courtWidth / 2 + 10, courtHeight / 2 + 10, 30, 0, Math.PI * 2);
    ctx.stroke();

    // Three-point arc (simplified)
    ctx.beginPath();
    ctx.arc(courtWidth / 2 + 10, courtHeight - 50, 120, Math.PI, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(courtWidth / 2 + 10, 50, 120, 0, Math.PI);
    ctx.stroke();

    // Free throw circles
    ctx.beginPath();
    ctx.arc(courtWidth / 2 + 10, courtHeight - 130, 30, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(courtWidth / 2 + 10, 130, 30, 0, Math.PI * 2);
    ctx.stroke();

    // Paint areas
    ctx.strokeRect(courtWidth / 2 - 40 + 10, 10, 80, 120);
    ctx.strokeRect(courtWidth / 2 - 40 + 10, courtHeight - 120 + 10, 80, 120);

    // Baskets
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.arc(courtWidth / 2 + 10, 10, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(courtWidth / 2 + 10, courtHeight + 10, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, player: Player, isSelected: boolean) => {
    ctx.beginPath();
    ctx.arc(player.x, player.y, playerRadius, 0, Math.PI * 2);
    ctx.fillStyle = player.team === 'home' ? '#3b82f6' : '#ef4444';
    ctx.fill();
    
    if (isSelected) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Player number
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player.number.toString(), player.x, player.y);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if a player was clicked
    const clickedPlayer = players.find(player => {
      const distance = Math.sqrt(Math.pow(player.x - x, 2) + Math.pow(player.y - y, 2));
      return distance <= playerRadius;
    });

    if (clickedPlayer) {
      setSelectedPlayer(clickedPlayer.id);
      setIsDragging(true);
    } else if (!isDragging) {
      // Add new player if no player was clicked and not dragging
      const newPlayer: Player = {
        id: `player-${Date.now()}`,
        x,
        y,
        team: 'home',
        number: players.length + 1
      };
      setPlayers([...players, newPlayer]);
      setSelectedPlayer(newPlayer.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly || !isDragging || !selectedPlayer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update player position
    setPlayers(prev => prev.map(player => 
      player.id === selectedPlayer 
        ? { ...player, x: Math.max(playerRadius, Math.min(courtWidth + 10 - playerRadius, x)), y: Math.max(playerRadius, Math.min(courtHeight + 10 - playerRadius, y)) }
        : player
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDeleteSelected = () => {
    if (!selectedPlayer) return;
    
    setPlayers(prev => prev.filter(player => player.id !== selectedPlayer));
    setSelectedPlayer(null);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(players);
      toast({
        title: "Saved",
        description: "Court diagram has been saved",
        duration: 2000,
      });
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'court-diagram.png';
    a.click();
  };

  const toggleSelectedPlayerTeam = () => {
    if (!selectedPlayer) return;
    
    setPlayers(prev => prev.map(player => 
      player.id === selectedPlayer 
        ? { ...player, team: player.team === 'home' ? 'away' : 'home' }
        : player
    ));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Court Diagram</CardTitle>
        <div className="flex space-x-2">
          {!readOnly && (
            <>
              <Button variant="ghost" size="sm" onClick={toggleSelectedPlayerTeam} disabled={!selectedPlayer} title="Change Team">
                <MoveHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteSelected} disabled={!selectedPlayer} title="Delete Player">
                <Trash2 className="h-4 w-4" />
              </Button>
              {onSave && (
                <Button variant="ghost" size="sm" onClick={handleSave} title="Save">
                  <Save className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
          <Button variant="ghost" size="sm" onClick={handleDownload} title="Download">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full flex justify-center overflow-hidden">
          <canvas 
            ref={canvasRef} 
            width={courtWidth + 20} 
            height={courtHeight + 20}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`border rounded ${!readOnly ? 'cursor-pointer' : ''}`}
          />
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          {!readOnly ? 'Click on the court to add players. Click and drag to move. Use buttons to change team or delete.' : 'View only mode.'}
        </div>
      </CardContent>
    </Card>
  );
}