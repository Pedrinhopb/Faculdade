import React from 'react'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Services from '../components/landing/Services'
import Reviews from '../components/landing/Reviews'
import FAQ from '../components/landing/FAQ'
import Contact from '../components/landing/Contact'
import Footer from '../components/landing/Footer'

export default function LandingPage(){
  return (
    <div>
      <Navbar />
      <Hero />
      <Services />
      <Reviews />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  )
}
