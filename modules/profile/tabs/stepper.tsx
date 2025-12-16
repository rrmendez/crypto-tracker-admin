import {
  Stepper as UIStepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
} from "@/components/ui/stepper";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  label: string;
  description?: string;
};

interface StepperProps {
  steps: Step[];
  currentStep: string;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="sticky top-0 z-50 px-4 py-3 mb-6 bg-background">
      <UIStepper value={currentStepIndex + 1}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isActive = currentStepIndex === index;
          const isCompleted = index < currentStepIndex;

          return (
            <StepperItem
              key={step.id}
              step={index + 1}
              className="not-last:flex-1 max-md:items-start"
            >
              <StepperTrigger
                className={cn(
                  "rounded max-md:flex-col",
                  isCompleted && "text-primary",
                  isActive && "font-semibold"
                )}
              >
                <StepperIndicator />
                <div className="text-center md:text-left">
                  <StepperTitle>{step.label}</StepperTitle>
                  {step.description && (
                    <StepperDescription className="max-sm:hidden">
                      {step.description}
                    </StepperDescription>
                  )}
                </div>
              </StepperTrigger>

              {!isLast && <StepperSeparator className="max-md:mt-3.5 md:mx-4" />}
            </StepperItem>
          );
        })}
      </UIStepper>
    </div>
  );
}
