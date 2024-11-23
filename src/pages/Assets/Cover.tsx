import React from "react";
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

function CoverContent() {
  return (
    <>
      <div className="p-4">
        <div>
          <Label className="mb-2 block">Preview</Label>
          <Card className="w-full h-[500px] bg-gray-50 border-2 border-dashed flex items-center justify-center">
            {/* If there's a background image */}
            {/* <img 
              src={backgroundUrl} 
              alt="Cover preview" 
              className="max-w-full max-h-full object-contain"
            /> */}
            
            {/* If no background */}
            <div className="text-gray-400 text-3xl">×</div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default CoverContent

