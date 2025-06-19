import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loading } from '@/components/ui/loading';
import { Play, Save, Undo, Redo, Copy } from 'lucide-react';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  onRun: (code: string) => void;
  onSave?: (code: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({
  initialCode,
  language,
  onRun,
  onSave,
  readOnly = false,
  height = '400px',
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleRun = () => {
    onRun(code);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(code);
      toast({
        title: "Saved",
        description: "Your code has been saved",
        duration: 2000,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Code Editor - {language.toUpperCase()}</CardTitle>
        <div className="flex space-x-2">
          {!readOnly && (
            <>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} title="Copy">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRun} title="Run">
                <Play className="h-4 w-4" />
              </Button>
              {onSave && (
                <Button variant="ghost" size="sm" onClick={handleSave} title="Save">
                  <Save className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && (
          <div className="flex items-center justify-center" style={{ height }}>
            <Loading size="md" />
          </div>
        )}
        <Editor
          height={height}
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            readOnly,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          onMount={() => setIsLoading(false)}
        />
      </CardContent>
    </Card>
  );
}