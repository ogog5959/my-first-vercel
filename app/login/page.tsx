"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Google OAuth login logic would go here
    console.log("Initiating Google login...")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex flex-col justify-center px-6">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-8 text-purple-300 text-2xl animate-pulse">✨</div>
      <div className="absolute top-32 right-12 text-pink-300 text-xl animate-pulse delay-1000">💜</div>
      <div className="absolute bottom-32 left-12 text-orange-300 text-lg animate-pulse delay-500">🌸</div>

      {/* Main Content */}
      <div className="max-w-sm mx-auto w-full">
        {/* App Logo/Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center">
              {/* Cute AI Character Face */}
              <div className="relative">
                {/* Eyes */}
                <div className="flex space-x-3 mb-2">
                  <div className="w-3 h-3 bg-purple-800 rounded-full"></div>
                  <div className="w-3 h-3 bg-purple-800 rounded-full"></div>
                </div>
                {/* Smile */}
                <div className="w-6 h-3 border-b-2 border-purple-800 rounded-full mx-auto"></div>
                {/* Blush */}
                <div className="absolute -left-4 top-1 w-2 h-2 bg-pink-400 rounded-full opacity-60"></div>
                <div className="absolute -right-4 top-1 w-2 h-2 bg-pink-400 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-purple-800 mb-2">Thanks to Me</h1>
        </div>

        {/* Welcome Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-purple-100 mb-8">
          {/* Korean Welcome Message */}
          <div className="text-center mb-8">
            <p className="text-lg font-medium text-purple-800 leading-relaxed mb-3">나를 돌보는 하루의 시작,</p>
            <p className="text-xl font-bold text-purple-900 mb-4">땡스투미</p>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mx-auto mb-4"></div>
            <p className="text-sm text-purple-600 leading-relaxed">
              Start your journey of self-care and emotional wellness with gentle daily reflections
            </p>
          </div>

          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 rounded-2xl py-4 px-6 font-medium shadow-sm transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-3"
          >
            {/* Google Logo */}
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600">G</span>
              </div>
            </div>
            <span className="text-base">Continue with Google</span>
          </Button>

          {/* Alternative Sign In Options */}
          <div className="mt-6 text-center">
            <p className="text-sm text-purple-500 mb-4">Or continue as guest</p>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 rounded-2xl py-3 font-medium bg-transparent"
              >
                Try without account
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-purple-500 leading-relaxed">
            By continuing, you agree to our <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>
          </p>
        </div>
      </div>

      {/* Bottom Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-100/30 to-transparent pointer-events-none"></div>
    </div>
  )
}
