import React from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

function IconBannerContent() {
  return (
    <>
      <div className="space-y-6 p-4">
        {/* Icon Preview */}
        <div>
          <Label className="mb-2 block">Icon Preview</Label>
          <Card className="w-[100px] h-[100px] bg-gray-50 border-2 border-dashed flex items-center justify-center">
            {/* If there's an icon */}
            {/* <img 
              src={iconUrl} 
              alt="Icon preview" 
              className="max-w-full max-h-full object-contain"
            /> */}
            
            {/* If no icon */}
            <div className="text-gray-400 text-3xl">×</div>
          </Card>
        </div>

        {/* Banner Preview */}
        <div>
          <Label className="mb-2 block">Banner Preview</Label>
          <Card className="w-full h-[150px] bg-gray-50 border-2 border-dashed flex items-center justify-center">
            {/* If there's a banner */}
            {/* <img 
              src={bannerUrl} 
              alt="Banner preview" 
              className="max-w-full max-h-full object-contain"
            /> */}
            
            {/* If no banner */}
            <div className="text-gray-400 text-3xl">×</div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default IconBannerContent

