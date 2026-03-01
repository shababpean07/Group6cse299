"use client";

import { Lock, Check, X, Loader2 } from "lucide-react";
import React, { useState } from "react";

// Reusable Modal Shell
function ModalFrame({ children, onClose, title }: { children: React.ReactNode, onClose?: () => void, title: string }) {
  return (
    <div className="w-full md:w-[560px] shrink-0 bg-white rounded-t-[16px] md:rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative animate-scale-in border border-[#efeff5]">
      {/* Top Header */}
      <div className="h-[58px] flex items-center justify-between px-6 border-b border-[#efeff5] shrink-0 bg-white z-10">
        <h2 className="font-[700] text-[17px] text-[#0f1828]">{title}</h2>
        <button 
          onClick={onClose}
          className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] text-[#8896b0] hover:bg-[#f4f4f8] hover:text-[#0f1828] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {children}
    </div>
  );
}

// Progress Strip Component
function ProgressStrip({ step }: { step: number }) {
  const isStep1Done = step > 1;
  const isStep2Done = step > 2;

  const StepCircle = ({ num, isActive, isDone, label }: { num: number, isActive: boolean, isDone: boolean, label: string }) => {
    let circleStyle = "border-2 border-[#efeff5] text-[#c4c7cf] bg-white";
    if (isDone) circleStyle = "bg-[#0f1828] text-white border-transparent";
    else if (isActive) circleStyle = "bg-[#7C5CFC] text-white border-transparent shadow-[0_4px_12px_rgba(124,92,252,0.25)]";

    let textStyle = "text-[#c4c7cf]";
    if (isDone) textStyle = "text-[#0f1828]";
    else if (isActive) textStyle = "text-[#7C5CFC]";

    return (
      <div className="flex flex-col items-center gap-2 z-10 w-[70px]">
        <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[12px] font-[800] transition-colors duration-300 ${circleStyle}`}>
          {isDone ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : num}
        </div>
        <span className={`text-[10px] font-[700] tracking-[0.5px] uppercase whitespace-nowrap transition-colors duration-300 ${textStyle}`}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="px-8 py-6 bg-[#f7f7fc] border-b border-[#efeff5] relative flex justify-between items-start">
      <div className="absolute top-[37px] left-[60px] right-[60px] h-[2px] bg-[#efeff5] z-0 rounded-full">
        <div 
          className="h-full bg-[#7C5CFC] transition-all duration-500 ease-out rounded-full" 
          style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
        />
      </div>

      <StepCircle num={1} isActive={step === 1} isDone={isStep1Done} label="Personal" />
      <StepCircle num={2} isActive={step === 2} isDone={isStep2Done} label="Motivation" />
      <StepCircle num={3} isActive={step === 3} isDone={false} label="Review" />
    </div>
  );
}

function ReadOnlyField({ label, value, note }: { label: string, value: string, note?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-[700] text-[#0f1828]">{label}</label>
        {note && <span className="text-[10px] font-[600] text-[#c4c7cf] uppercase tracking-[0.5px]">{note}</span>}
      </div>
      <div className="h-[42px] bg-[#f0f0f8] border border-[#e8e8f0] rounded-[10px] px-3.5 flex items-center text-[13px] font-[600] text-[#8896b0] cursor-not-allowed">
        <Lock className="w-[14px] h-[14px] mr-2 opacity-50" />
        {value}
      </div>
    </div>
  );
}

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubName: string;
}

export function ApplyModal({ isOpen, onClose, clubName }: ApplyModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [motivation, setMotivation] = useState("");
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setMotivation("");
    setShowError(false);
    onClose();
  };

  const handleNextToStep2 = () => setStep(2);

  const handleNextToStep3 = () => {
    if (motivation.trim().length < 50) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setStep(3);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
      <div className="absolute inset-0 bg-[#0f1828]/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative z-10 w-full flex justify-center">
        {/* STEP 1 */}
        {step === 1 && (
          <ModalFrame onClose={handleClose} title={`Apply: ${clubName}`}>
            <ProgressStrip step={1} />
            <div className="p-6 md:p-8 flex flex-col gap-5">
              <ReadOnlyField label="Full Name" value="Alif Shahriar" note="Auto-filled" />
              <ReadOnlyField label="NSU Email" value="alif.shahriar@northsouth.edu" note="Auto-filled" />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-[700] text-[#0f1828]">Year of Study</label>
                <select defaultValue="Sophomore (2nd Year)" className="h-[42px] bg-white border border-[#efeff5] rounded-[10px] px-3.5 text-[13px] font-[500] text-[#0f1828] outline-none focus:border-[#7C5CFC] transition-colors appearance-none">
                  <option value="Freshman (1st Year)">Freshman (1st Year)</option>
                  <option value="Sophomore (2nd Year)">Sophomore (2nd Year)</option>
                  <option value="Junior (3rd Year)">Junior (3rd Year)</option>
                  <option value="Senior (4th Year)">Senior (4th Year)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 mb-2">
                <label className="text-[12px] font-[700] text-[#0f1828]">Department</label>
                <input 
                  type="text" 
                  defaultValue="Electrical & Computer Engineering"
                  className="h-[42px] bg-white border border-[#efeff5] rounded-[10px] px-3.5 text-[13px] font-[500] text-[#0f1828] outline-none focus:border-[#7C5CFC] transition-colors placeholder:text-[#c4c7cf]"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#efeff5] mt-2">
                <button onClick={handleClose} className="text-[13px] font-[700] text-[#8896b0] hover:text-[#0f1828] px-4 h-10 rounded-[10px] transition-colors">
                  Cancel
                </button>
                <button onClick={handleNextToStep2} className="bg-[#7C5CFC] text-white text-[13px] font-[700] px-6 h-10 rounded-[10px] hover:bg-[#6b4ae8] transition-colors shadow-[0_4px_12px_rgba(124,92,252,0.2)]">
                  Next &rarr;
                </button>
              </div>
            </div>
          </ModalFrame>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <ModalFrame onClose={handleClose} title={`Apply: ${clubName}`}>
            <ProgressStrip step={2} />
            <div className="p-6 md:p-8 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-[700] text-[#0f1828]">Why do you want to join?</label>
                <textarea 
                  rows={4}
                  value={motivation}
                  onChange={(e) => {
                    setMotivation(e.target.value);
                    if (showError && e.target.value.trim().length >= 50) setShowError(false);
                  }}
                  placeholder="Share your interest in this club (minimum 50 characters)..."
                  className={`resize-none rounded-[10px] p-3.5 text-[13px] font-[500] text-[#0f1828] outline-none transition-colors placeholder:text-[#c4c7cf] ${
                    showError 
                      ? "bg-[#fef2f2] border border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20" 
                      : "bg-white border border-[#efeff5] focus:border-[#7C5CFC]"
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  {showError ? (
                    <span className="text-[11px] font-[600] text-[#EF4444]">Minimum 50 characters required</span>
                  ) : (
                    <span /> // Spacer
                  )}
                  <span className={`text-[11px] font-[600] ${showError ? "text-[#EF4444]" : "text-[#8896b0]"}`}>
                    {motivation.trim().length} / min 50
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-2">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-[700] text-[#0f1828]">Relevant experience?</label>
                  <span className="text-[10px] font-[600] text-[#c4c7cf] uppercase tracking-[0.5px]">Optional</span>
                </div>
                <textarea 
                  rows={3}
                  placeholder="Any past projects, clubs, or courses..."
                  className="resize-none bg-white border border-[#efeff5] rounded-[10px] p-3.5 text-[13px] font-[500] text-[#0f1828] outline-none focus:border-[#7C5CFC] transition-colors placeholder:text-[#c4c7cf]"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#efeff5] mt-2">
                <button onClick={() => setStep(1)} className="bg-white border border-[#efeff5] text-[#0f1828] text-[13px] font-[700] px-5 h-10 rounded-[10px] hover:bg-[#f7f7fc] transition-colors">
                  &larr; Back
                </button>
                <button onClick={handleNextToStep3} className="bg-[#7C5CFC] text-white text-[13px] font-[700] px-6 h-10 rounded-[10px] hover:bg-[#6b4ae8] transition-colors shadow-[0_4px_12px_rgba(124,92,252,0.2)]">
                  Next &rarr;
                </button>
              </div>
            </div>
          </ModalFrame>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <ModalFrame onClose={handleClose} title={`Apply: ${clubName}`}>
            <ProgressStrip step={3} />
            <div className="p-6 md:p-8 flex flex-col">
              
              <div className="bg-[#fafafc] border border-[#efeff5] rounded-[12px] p-5 flex flex-col gap-4 mb-6">
                <div>
                  <span className="text-[11px] font-[700] text-[#c4c7cf] uppercase tracking-[1px] block mb-1">Applicant</span>
                  <span className="text-[13px] font-[700] text-[#0f1828]">Alif Shahriar</span>
                  <span className="text-[13px] font-[500] text-[#8896b0] block">alif.shahriar@northsouth.edu</span>
                </div>
                <div className="w-full h-[1px] bg-[#efeff5]" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-[700] text-[#c4c7cf] uppercase tracking-[1px] block mb-1">Year</span>
                    <span className="text-[13px] font-[600] text-[#0f1828]">Sophomore</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-[700] text-[#c4c7cf] uppercase tracking-[1px] block mb-1">Dept</span>
                    <span className="text-[13px] font-[600] text-[#0f1828]">ECE</span>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-[#efeff5]" />
                <div>
                  <span className="text-[11px] font-[700] text-[#c4c7cf] uppercase tracking-[1px] block mb-1.5">Motivation</span>
                  <p className="text-[13px] font-[500] text-[#0f1828] bg-white p-3 rounded-[8px] border border-[#efeff5] leading-relaxed break-words whitespace-pre-wrap">
                    {motivation}
                  </p>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group mb-6">
                <div className="relative flex items-center justify-center w-[18px] h-[18px] shrink-0 mt-0.5">
                  <input type="checkbox" className="peer appearance-none w-full h-full border-[1.5px] border-[#c4c7cf] rounded-[4px] checked:bg-[#7C5CFC] checked:border-[#7C5CFC] transition-colors cursor-pointer" defaultChecked />
                  <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                </div>
                <span className="text-[13px] font-[500] text-[#0f1828] group-hover:text-[#7C5CFC] transition-colors">
                  I confirm this information is accurate and I understand the club commitments.
                </span>
              </label>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setStep(2)} 
                  disabled={isSubmitting}
                  className="bg-white border border-[#efeff5] text-[#0f1828] text-[13px] font-[700] px-5 h-10 rounded-[10px] hover:bg-[#f7f7fc] transition-colors disabled:opacity-50"
                >
                  &larr; Back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#0f1828] text-white text-[13px] font-[700] h-10 rounded-[10px] hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </div>
          </ModalFrame>
        )}

        {/* STEP 4: Confirmation */}
        {step === 4 && (
          <div className="w-full md:w-[560px] shrink-0 bg-white rounded-t-[16px] md:rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col animate-scale-in border border-[#efeff5]">
            <div className="px-6 md:px-8 py-16 flex flex-col items-center justify-center text-center">
              
              <div className="w-[64px] h-[64px] rounded-[16px] bg-[#dcfce7] flex items-center justify-center mb-6">
                <svg className="w-[32px] h-[32px] text-[#22c55e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline className="animate-draw-check" points="20 6 9 17 4 12" />
                </svg>
              </div>
              
              <h3 className="text-[20px] font-[800] text-[#0f1828] tracking-tight mb-2">Application Submitted!</h3>
              <p className="text-[14px] font-[500] text-[#8896b0] mb-8 max-w-[280px]">
                We've received your application to {clubName}. We'll notify you on any updates.
              </p>

              <button onClick={handleClose} className="w-full h-10 bg-white border border-[#7C5CFC] text-[#7C5CFC] text-[13px] font-[700] rounded-[10px] hover:bg-[#7C5CFC] hover:text-white transition-colors">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
