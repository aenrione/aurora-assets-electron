import React from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

function ScreenshotsContent() {
  return (
    <>
      <div className="space-y-6 p-4">
        {/* Screenshot Selection */}
        <div className="flex items-center gap-2">
          <Label htmlFor="screenshot-select">Select screenshot:</Label>
          <Select defaultValue="screenshot1">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select screenshot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="screenshot1">Screenshot 1</SelectItem>
              <SelectItem value="screenshot2">Screenshot 2</SelectItem>
              <SelectItem value="screenshot3">Screenshot 3</SelectItem>
              {/* Add more screenshots as needed */}
            </SelectContent>
          </Select>
        </div>

        {/* Preview Section */}
        <div>
          <Label className="mb-2 block">Preview</Label>
          <Card className="w-full h-[400px] bg-gray-50 border-2 border-dashed flex items-center justify-center">
            {/* If there's an image */}
            {/* <img 
              src={selectedImage} 
              alt="Screenshot preview" 
              className="max-w-full max-h-full object-contain"
            /> */}
            
            {/* If no image */}
            <div className="text-gray-400">
              No image selected
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default ScreenshotsContent

