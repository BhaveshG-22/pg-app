'use client'

import Link from 'next/link'

const footerData = {
  "Shot with PixelGlow™": [
    "AI Photography",
    "AI Selfies", 
    "Instant Camera",
    "Tinder",
    "Instagram",
    "Luxury Lifestyle",
    "Model Headshots",
    "Startup Founder Headshots",
    "Old Money",
    "Keynote Speaker",
    "AI Dating",
    "Badoo",
    "The World's First AI Model A...",
    "Beach Bikini",
    "Summer In Paris",
    "Professional Headshots",
    "Street Style",
    "College Party"
  ],
  "Style Presets": [
    "AI Tarot Card Generator",
    "Dubai Ecom Bro",
    "Silent Film Era",
    "Outdoor adventure",
    "Mobster",
    "Life Coach Headshots",
    "Virtual suits try on",
    "Korean Profile Photo",
    "Pink Birthday Picnic",
    "1950s Film Noir",
    "Flight Attendant",
    "AI Influencer Generator",
    "Hinge",
    "Swimsuit",
    "AI Makeup Try-On",
    "E-Girl",
    "Aesthetic Weekend Vibes",
    "Cheerleader"
  ],
  "Professional": [
    "Real Estate Agent Headshots",
    "Lawyer Headshots",
    "Comedian headshots",
    "Photo to Anime Converter",
    "Halloween",
    "Sexy Easter",
    "AI Yearbook",
    "Born in the U.S.A.",
    "Made in Europe",
    "AI Food Photography",
    "Bumble",
    "Music festival",
    "Holi",
    "Chernobyl tour",
    "AI Protests",
    "Puffer jacket",
    "Teacher Headshots",
    "Diwali"
  ],
  "Pages": [
    "Free AI Photo Generator",
    "Photo Shoot Ideas",
    "Gallery",
    "Sign up or Log in",
    "FAQ",
    "Billing",
    "Legal"
  ],
  "Links": [
    "Interior AI",
    "Nomads.com",
    "Remote OK",
    "eu/acc",
    "Clarity AI",
    "This House Does Not Exist",
    "Headshot Pro"
  ]
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-white font-semibold text-lg">PIXELGLOW™</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              PixelGlow™ is a registered trademark. Transform your photos with AI.
            </p>
            <p className="text-xs text-gray-500">
              ©2025. Terms of Service and Privacy Policy.
            </p>
          </div>

          {/* Footer Links */}
          {Object.entries(footerData).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={`/preset/${link.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              Transform your photos with AI-powered style presets
            </div>
            <div className="flex space-x-6">
              <Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/support" className="text-sm text-gray-400 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}