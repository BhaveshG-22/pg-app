"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CheckIcon, MinusIcon } from "lucide-react";
import React, { useState } from "react";
import { Header } from "@/components/Header";

export default function PricingSectionCards() {
  const [isAnnual, setIsAnnual] = useState(false);
  
  // Pricing data
  const pricing = {
    pro: {
      monthly: 4.99,
      annual: 4.49, // 10% discount
    },
    creator: {
      monthly: 9.99,
      annual: 8.99, // 10% discount
    }
  };
  return (
    <>
      <Header />
      {/* Pricing */}
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-24 lg:py-32 mt-16">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Pricing
          </h2>
          <p className="mt-1 text-muted-foreground">
            Choose the perfect plan for your AI image generation needs.
          </p>
        </div>
        {/* End Title */}
        {/* Switch */}
        <div className="flex justify-center items-center">
          <Label htmlFor="payment-schedule" className={`me-3 ${!isAnnual ? 'font-semibold' : ''}`}>
            Monthly
          </Label>
          <Switch 
            id="payment-schedule" 
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <Label htmlFor="payment-schedule" className={`relative ms-3 ${isAnnual ? 'font-semibold' : ''}`}>
            Annual
            <span className="absolute -top-10 start-auto -end-28">
              <span className="flex items-center">
                <svg
                  className="w-14 h-8 -me-6"
                  width={45}
                  height={25}
                  viewBox="0 0 45 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                    fill="currentColor"
                    className="text-muted-foreground"
                  />
                </svg>
                <Badge className="mt-3 uppercase">Save up to 10%</Badge>
              </span>
            </span>
          </Label>
        </div>
        {/* End Switch */}
        
        {/* Modern Pricing Cards */}
        <div className="mt-12 grid sm:grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Free Tier Card */}
          <Card className="bg-gray-900 border-gray-700 text-white relative flex flex-col">
            <CardHeader className="pb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle className="text-2xl font-bold mb-2 text-white">Free</CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Perfect for getting started</p>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800">
                Get Started →
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">No credit card required</p>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <div className="space-y-4">
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="font-semibold text-white mb-3">✨ Core Features:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      5 AI photo generations per day
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Basic quality AI model
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Limited preset library access
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      1 concurrent job
                    </li>
                    <li className="flex items-center text-gray-500">
                      <MinusIcon className="h-4 w-4 mr-2" />
                      No commercial usage rights
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tier Card */}
          <Card className="bg-gray-900 border-purple-500 text-white relative flex flex-col ring-2 ring-purple-500/50 shadow-xl transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </Badge>
            </div>
            <CardHeader className="pb-6 pt-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle className="text-2xl font-bold mb-2 text-white">Pro</CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      ${isAnnual ? pricing.pro.annual.toFixed(2) : pricing.pro.monthly.toFixed(2)}
                    </span>
                    <span className="text-gray-400 ml-1">/month</span>
                    {isAnnual && <span className="text-gray-400 ml-2 text-sm">billed annually</span>}
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-green-400 mt-1">Save $6.00/year with annual billing</p>
                  )}
                  <p className="text-sm text-gray-400 mt-2">For creators & influencers</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold">
                Upgrade to Pro →
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">Cancel anytime</p>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <div className="space-y-4">
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="font-semibold text-white mb-3">🚀 Everything in Free, plus:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      20-25 high-quality generations/day
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Premium AI model quality
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Full preset library access
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Up to 3 concurrent jobs
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Medium priority processing
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Commercial usage rights
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/30">
                  <p className="text-xs text-purple-200">💡 Save 2 hours/week on photo editing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creator Tier Card */}
          <Card className="bg-gray-900 border-gray-700 text-white relative flex flex-col">
            <CardHeader className="pb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle className="text-2xl font-bold mb-2 text-white">Creator</CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      ${isAnnual ? pricing.creator.annual.toFixed(2) : pricing.creator.monthly.toFixed(2)}
                    </span>
                    <span className="text-gray-400 ml-1">/month</span>
                    {isAnnual && <span className="text-gray-400 ml-2 text-sm">billed annually</span>}
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-green-400 mt-1">Save $12.00/year with annual billing</p>
                  )}
                  <p className="text-sm text-gray-400 mt-2">For professional creators</p>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800">
                Upgrade to Creator →
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">14-day money back guarantee</p>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <div className="space-y-4">
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="font-semibold text-white mb-3">⚡ Everything in Pro, plus:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      50-60 high-quality generations/day
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Premium+ AI model quality
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Early access to new presets
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Up to 5 concurrent jobs
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Highest priority processing
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Advanced commercial rights
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-400" />
                      Priority customer support
                    </li>
                  </ul>
                </div>
                <div className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-500/30">
                  <p className="text-xs text-yellow-200">🏆 Best value for content creators</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* End Modern Pricing Cards */}
        
        {/* FAQ or Additional Info Section */}
        <div className="mt-20 lg:mt-32 text-center">
          <p className="text-gray-400 text-sm">
            Questions? <a href="mailto:support@pixelglow.com" className="text-purple-400 hover:text-purple-300">Contact our support team</a> for help choosing the right plan.
          </p>
        </div>
      </div>
      {/* End Pricing */}
    </>
  );
}