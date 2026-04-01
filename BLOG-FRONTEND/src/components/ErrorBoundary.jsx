import React from 'react'
import { useRouteError, useNavigate } from 'react-router'
import { pageWrapper, headingClass, primaryBtn } from '../styles/common'

function ErrorBoundary() {
    const error = useRouteError()
    const navigate = useNavigate()
    
    // Safely extract properties if they exist
    const status = error?.status || 500
    const statusText = error?.statusText || "Internal Error"
    const data = error?.data || "Something unexpected went wrong!"
    const message = error?.message || ""

  return (
    <div className={pageWrapper + " min-h-screen flex flex-col items-center justify-center text-center py-20"}>
        <img 
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWU3cDFzeDlubDY5amZtOG9pd3J6M3RhZDBkbjcyMnFubHZhYnR6NCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2RiU1RUjyh4C4/200.webp" 
            alt="Lost" 
            className="w-64 md:w-80 rounded-2xl shadow-sm border border-[#e8e8ed] mb-8 pointer-events-none"
        />
        
        <h1 className="text-5xl font-bold tracking-tight text-[#1d1d1f] mb-3">Oops!</h1>
        <h2 className={headingClass + " !text-xl !text-[#0066cc] mb-6 block"}>{status} - {statusText}</h2>
        
        <div className="bg-[#fef2f2] border border-[#fca5a5] text-[#b91c1c] px-6 py-4 rounded-xl max-w-md w-full mb-8 text-left">
            <p className="text-xs font-mono font-semibold uppercase tracking-wider mb-2 opacity-70">Error Details</p>
            <p className="text-sm font-mono break-words leading-relaxed whitespace-pre-wrap">
                {data} {message && `\n${message}`}
            </p>
        </div>

        <button 
            className={primaryBtn + " !w-auto !px-10"} 
            onClick={() => navigate("/")}
        >
            Take Me Home
        </button>
    </div>
  )
}

export default ErrorBoundary