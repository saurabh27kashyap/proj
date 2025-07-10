
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function SafetyIncidentForm() {
  const [selectedValue, setSelectedValue] = useState("")//3 radio button to store 
  const [showEquipmentQuestion, setShowEquipmentQuestion] = useState(false)//wo dialog wla button
  const [selectedOption, setSelectedOption] = useState<"no" | "yes" | "">("")//yes or no

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Were there any safety incidents today?
        </h1>

        <RadioGroup
          value={selectedValue}
          onValueChange={(value) => {
            setSelectedValue(value)
            setShowEquipmentQuestion(value === "yes-incidents")
          }}
          className="space-y-4"
        >
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <RadioGroupItem value="yes-incidents" id="yes-incidents" className="w-6 h-6" />
                <Label htmlFor="yes-incidents" className="text-xl text-gray-800 cursor-pointer flex-1">
                  Yes there were incidents
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <RadioGroupItem value="no-safe" id="no-safe" className="w-6 h-6" />
                <Label htmlFor="no-safe" className="text-xl text-gray-800 cursor-pointer flex-1">
                  No, everything was safe
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <RadioGroupItem value="near-miss" id="near-miss" className="w-6 h-6" />
                <Label htmlFor="near-miss" className="text-xl text-gray-800 cursor-pointer flex-1">
                  I need to report a near-miss example for very long text in option
                </Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        {/* Dialog-style YES/NO shows only when "yes-incidents" selected */}
        {showEquipmentQuestion && (
          <div className="flex items-center justify-between p-6 bg-white rounded-2xl mt-6 shadow-sm">
            <div className="flex-1 pr-6">
              <h2 className="text-2xl font-semibold text-gray-800 leading-tight">
                Do you have all your safety equipment?
              </h2>
            </div>

            <div className="flex bg-gray-200 rounded-full p-1">
              <button
                onClick={() => setSelectedOption("no")}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedOption === "no"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                No
              </button>
              <button
                onClick={() => setSelectedOption("yes")}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedOption === "yes"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Yes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
