import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

function OnlineAssetsTab() {
  return (
      <>
          {/* Source Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="w-24">Select source:</label>
              <Select defaultValue="xboxunity">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xboxunity">Xboxunity.net</SelectItem>
                  {/* Add more sources as needed */}
                </SelectContent>
              </Select>
            </div>

            {/* Search Fields */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="w-16">TitleID:</label>
                <Input className="w-[150px]" />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-20">Keywords:</label>
                <Input className="w-[300px]" />
              </div>
            </div>

            {/* Search Buttons */}
            <div className="flex gap-2">
              <Button variant="secondary">Search by TitleID</Button>
              <Button variant="secondary">Search by Keywords</Button>
            </div>

            {/* Preview and Results Section */}
            <div className="flex gap-4">
              {/* Preview Box */}
              <Card className="flex-1 p-4">
                <h3 className="text-sm font-semibold mb-2">Preview</h3>
                <div className="border rounded-md h-[300px] bg-gray-50"></div>
              </Card>

              {/* Search Results Box */}
              <Card className="flex-1 p-4">
                <h3 className="text-sm font-semibold mb-2">Search Result:</h3>
                <div className="border rounded-md h-[300px] bg-gray-50"></div>
              </Card>
            </div>
          </div>
      </>
  )
}

export default OnlineAssetsTab

