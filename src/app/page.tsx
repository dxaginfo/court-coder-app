"use client";

import { useState, useEffect } from 'react';
import { CodeEditor } from '@/components/code-editor';
import { CourtDiagram } from '@/components/court-diagram';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/components/ui/use-toast';

const JAVASCRIPT_TEMPLATE = `// Write your basketball play code here
// You can use the 'court' object to access the court diagram
// Example:
// - court.movePlayers() - animate player movement
// - court.addPlayer(x, y, team, number) - add a player
// - court.removePlayer(id) - remove a player

function runPlay() {
  // Your code will be executed here
  console.log("Running basketball play...");
  
  // Example: Create a simple pick and roll
  const ballHandler = court.getPlayerByNumber(1, 'home');
  const bigMan = court.getPlayerByNumber(5, 'home');
  
  // Set up the play
  court.movePlayer(ballHandler.id, 150, 400);
  court.movePlayer(bigMan.id, 190, 350);
  
  // Execute the pick
  setTimeout(() => {
    court.movePlayer(bigMan.id, 150, 350);
    
    // Ball handler uses the screen
    setTimeout(() => {
      court.movePlayer(ballHandler.id, 220, 300);
      
      // Big man rolls to the basket
      setTimeout(() => {
        court.movePlayer(bigMan.id, 245, 250);
      }, 500);
    }, 500);
  }, 500);
}

// Don't modify this line
return runPlay;`;

const PYTHON_TEMPLATE = `# Write your basketball analysis code here
# You can use the following libraries:
# - numpy, pandas, matplotlib, seaborn
# - scikit-learn for simple machine learning

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Example: Create a simple player stats analysis
def analyze_player_performance():
    # Sample data (in a real app, this would come from API or database)
    data = {
        'Player': ['LeBron', 'Curry', 'Durant', 'Giannis', 'Jokic'],
        'Points': [27.4, 29.8, 26.0, 29.9, 26.3],
        'Rebounds': [8.3, 5.2, 6.4, 11.6, 13.5],
        'Assists': [8.5, 6.3, 5.5, 5.8, 10.8],
        'Steals': [1.1, 1.3, 0.7, 1.1, 1.3],
        'Blocks': [0.6, 0.2, 1.3, 1.4, 0.9]
    }
    
    # Create DataFrame
    df = pd.DataFrame(data)
    print("Player Stats Analysis:")
    print(df)
    
    # Calculate efficiency (simple example)
    df['Efficiency'] = df['Points'] + df['Rebounds'] + df['Assists'] + df['Steals'] + df['Blocks']
    
    # Sort by efficiency
    df_sorted = df.sort_values('Efficiency', ascending=False)
    print("\nPlayers sorted by efficiency:")
    print(df_sorted)
    
    return "Analysis complete"

# Run the analysis
analyze_player_performance()`;

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('js');
  const [jsCode, setJsCode] = useState(JAVASCRIPT_TEMPLATE);
  const [pyCode, setPyCode] = useState(PYTHON_TEMPLATE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const { toast } = useToast();

  const runCode = (code: string) => {
    setIsRunning(true);
    setOutput('');
    
    // Simulate running code
    setTimeout(() => {
      try {
        let result;
        
        if (activeTab === 'js') {
          // Simulate JavaScript execution in a safe way
          result = `Console Output:
> Running basketball play...
> Moving player #1 to position (150, 400)
> Moving player #5 to position (190, 350)
> Pick action executed
> Ball handler using screen
> Big man rolling to basket
> Play execution complete!`;
        } else {
          // Simulate Python execution
          result = `Python Output:
Player Stats Analysis:
    Player  Points  Rebounds  Assists  Steals  Blocks
0  LeBron    27.4       8.3      8.5     1.1     0.6
1   Curry    29.8       5.2      6.3     1.3     0.2
2  Durant    26.0       6.4      5.5     0.7     1.3
3  Giannis   29.9      11.6      5.8     1.1     1.4
4   Jokic    26.3      13.5     10.8     1.3     0.9

Players sorted by efficiency:
    Player  Points  Rebounds  Assists  Steals  Blocks  Efficiency
4   Jokic    26.3      13.5     10.8     1.3     0.9        52.8
3  Giannis   29.9      11.6      5.8     1.1     1.4        49.8
0  LeBron    27.4       8.3      8.5     1.1     0.6        45.9
1   Curry    29.8       5.2      6.3     1.3     0.2        42.8
2  Durant    26.0       6.4      5.5     0.7     1.3        39.9

Analysis complete`;
        }
        
        setOutput(result);
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsRunning(false);
      }
    }, 2000);
  };

  const handleAiAssist = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for AI assistance",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    setIsRunning(true);
    setOutput('Processing your AI request...');

    // Simulate AI response
    setTimeout(() => {
      const template = activeTab === 'js' 
        ? `// Generated based on prompt: "${aiPrompt}"
function runPlay() {
  console.log("Running AI-generated basketball play...");
  
  // Initialize players
  const pointGuard = court.getPlayerByNumber(1, 'home');
  const shootingGuard = court.getPlayerByNumber(2, 'home');
  const smallForward = court.getPlayerByNumber(3, 'home');
  const powerForward = court.getPlayerByNumber(4, 'home');
  const center = court.getPlayerByNumber(5, 'home');
  
  // Set up initial positions
  court.movePlayer(pointGuard.id, 240, 400);
  court.movePlayer(shootingGuard.id, 380, 350);
  court.movePlayer(smallForward.id, 100, 350);
  court.movePlayer(powerForward.id, 150, 200);
  court.movePlayer(center.id, 350, 200);
  
  // Execute the play
  setTimeout(() => {
    // Point guard starts the play
    court.movePlayer(pointGuard.id, 240, 350);
    
    setTimeout(() => {
      // Small forward comes around for a screen
      court.movePlayer(smallForward.id, 220, 330);
      
      setTimeout(() => {
        // Point guard uses the screen
        court.movePlayer(pointGuard.id, 180, 300);
        
        // Center moves to high post
        court.movePlayer(center.id, 240, 250);
        
        setTimeout(() => {
          // Point guard passes to center
          console.log("Point guard passes to center");
          
          // Shooting guard cuts to basket
          court.movePlayer(shootingGuard.id, 280, 180);
          
          setTimeout(() => {
            // Center passes to shooting guard for layup
            console.log("Center passes to shooting guard for layup");
          }, 600);
        }, 600);
      }, 500);
    }, 500);
  }, 500);
}

// Don't modify this line
return runPlay;`
        : `# Generated based on prompt: "${aiPrompt}"
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import MinMaxScaler

def advanced_player_analysis():
    # Sample player data
    data = {
        'Player': ['LeBron', 'Curry', 'Durant', 'Giannis', 'Jokic', 'Embiid', 'Doncic', 'Tatum', 'Morant', 'Young'],
        'Points': [27.4, 29.8, 26.0, 29.9, 26.3, 30.6, 28.4, 26.9, 27.4, 28.4],
        'Rebounds': [8.3, 5.2, 6.4, 11.6, 13.5, 11.7, 9.1, 8.0, 5.7, 3.7],
        'Assists': [8.5, 6.3, 5.5, 5.8, 10.8, 4.2, 8.7, 4.4, 7.3, 9.7],
        'Steals': [1.1, 1.3, 0.7, 1.1, 1.3, 1.1, 1.2, 1.0, 1.2, 0.9],
        'Blocks': [0.6, 0.2, 1.3, 1.4, 0.9, 1.7, 0.6, 0.6, 0.4, 0.1],
        'Turnovers': [3.5, 3.2, 3.1, 3.3, 3.8, 3.9, 4.5, 2.9, 3.4, 4.0],
        'FG%': [52.4, 43.7, 52.0, 55.3, 58.3, 49.9, 45.7, 45.3, 49.3, 46.0],
        '3P%': [35.9, 38.0, 38.3, 29.3, 33.7, 37.1, 35.3, 35.6, 34.4, 38.2]
    }
    
    df = pd.DataFrame(data)
    
    # Calculate advanced metrics
    df['EfficiencyRatio'] = (df['Points'] + df['Rebounds'] + df['Assists'] + 
                             df['Steals'] + df['Blocks']) / df['Turnovers']
    
    # Normalize data for radar charts
    metrics = ['Points', 'Rebounds', 'Assists', 'Steals', 'Blocks', 'FG%', '3P%']
    scaler = MinMaxScaler()
    df_scaled = pd.DataFrame(scaler.fit_transform(df[metrics]), 
                             columns=metrics, 
                             index=df['Player'])
    
    # Print analysis results
    print("Player Advanced Analysis:")
    print(df[['Player', 'Points', 'Rebounds', 'Assists', 'EfficiencyRatio']])
    
    # Sort by efficiency ratio
    df_sorted = df.sort_values('EfficiencyRatio', ascending=False)
    print("\\nTop 5 Players by Efficiency Ratio:")
    print(df_sorted[['Player', 'EfficiencyRatio']].head(5))
    
    # Compare shooting percentages
    print("\\nShooting Percentages Comparison:")
    print(df[['Player', 'FG%', '3P%']].sort_values('FG%', ascending=False))
    
    return "Advanced analysis complete"

# Run the analysis
advanced_player_analysis()`;
      
      if (activeTab === 'js') {
        setJsCode(template);
      } else {
        setPyCode(template);
      }
      
      setOutput(`AI has generated code based on your prompt: "${aiPrompt}". The code has been updated in the editor.`);
      setIsRunning(false);
      
      toast({
        title: "Code Generated",
        description: "AI has created code based on your prompt",
        duration: 3000,
      });
    }, 3000);
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('courtCoder_jsCode', jsCode);
      localStorage.setItem('courtCoder_pyCode', pyCode);
      
      toast({
        title: "Saved",
        description: "Your code has been saved to the browser",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving to localStorage', error);
      toast({
        title: "Error",
        description: "Failed to save your code",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    // Load saved code from localStorage if available
    const savedJsCode = localStorage.getItem('courtCoder_jsCode');
    const savedPyCode = localStorage.getItem('courtCoder_pyCode');
    
    if (savedJsCode) setJsCode(savedJsCode);
    if (savedPyCode) setPyCode(savedPyCode);
  }, []);

  return (
    <main className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Court Coder</h1>
        <div className="flex space-x-2">
          <Button onClick={saveToLocalStorage}>Save All Code</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">AI Assistant</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Code Assistant</DialogTitle>
                <DialogDescription>
                  Describe what you want to create, and the AI will help write the code for you.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="prompt">Your Request</Label>
                  <Textarea
                    id="prompt"
                    placeholder="e.g., Create a pick and roll play with the point guard and center"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <Button onClick={handleAiAssist}>Generate Code</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Tabs defaultValue="js" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-2">
              <TabsTrigger value="js">JavaScript (Plays)</TabsTrigger>
              <TabsTrigger value="py">Python (Analysis)</TabsTrigger>
            </TabsList>
            <TabsContent value="js">
              <CodeEditor
                initialCode={jsCode}
                language="javascript"
                onRun={runCode}
                onSave={(code) => setJsCode(code)}
              />
            </TabsContent>
            <TabsContent value="py">
              <CodeEditor
                initialCode={pyCode}
                language="python"
                onRun={runCode}
                onSave={(code) => setPyCode(code)}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col space-y-6">
          <CourtDiagram />
          
          <div className="border rounded-md">
            <div className="p-3 border-b bg-muted/50 font-medium">Output</div>
            <div className="p-4 h-[250px] overflow-auto font-mono text-sm whitespace-pre-wrap">
              {isRunning ? (
                <div className="flex items-center justify-center h-full">
                  <Loading size="md" />
                </div>
              ) : output ? output : 'Run your code to see output here...'}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}