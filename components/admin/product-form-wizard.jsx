"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check } from "lucide-react"

export default function ProductFormWizard({ children, steps, currentStep, onStepChange, onSubmit, isSubmitting }) {
    const progress = ((currentStep + 1) / steps.length) * 100

    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {steps[currentStep]?.title}
                    </CardTitle>
                    <CardDescription>
                        Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Progress indicator */}
                        <div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between mt-2">
                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-2 text-sm ${index <= currentStep ? "text-primary font-medium" : "text-muted-foreground"
                                            }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${index < currentStep
                                                    ? "bg-primary border-primary text-primary-foreground"
                                                    : index === currentStep
                                                        ? "border-primary text-primary"
                                                        : "border-muted-foreground text-muted-foreground"
                                                }`}
                                        >
                                            {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                                        </div>
                                        <span className="hidden md:inline">{step.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="mt-8">
                            {children}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onStepChange(currentStep - 1)}
                                disabled={currentStep === 0}
                            >
                                Previous
                            </Button>

                            {currentStep < steps.length - 1 ? (
                                <Button
                                    type="button"
                                    onClick={() => onStepChange(currentStep + 1)}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    onClick={onSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating Product..." : "Create Product"}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
