import React from 'react';
import HomeHeader from '../components/HomeHeader';
import { ArrowRight, Zap, Shield, Layers } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

function Home() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Built with modern technologies for optimal performance and speed.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with data encryption and protection.',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'Fully Responsive',
      description: 'Perfect experience across all devices - mobile, tablet, and desktop.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <HomeHeader />

      {/* Hero Section */}
      <main className="pt-32 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Hero Text */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 justify-center lg:justify-start">
              <Zap className="w-4 h-4" />
              <span>Built for Developers</span>
            </div>
            <h1 className="text-gray-900 leading-tight text-4xl lg:text-5xl font-bold">
              Build Better Products <br />
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ship Faster
              </span>
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto lg:mx-0">
              The modern platform for frontend developers. Manage your projects, track tasks,
              and collaborate with your team all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={'/sign-up'}>
                <Button size="lg">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              {/* <Button variant="outline" size="lg">
                View Demo
              </Button> */}
            </div>

            <div className="flex items-center gap-8 pt-4 justify-center lg:justify-start">
              <div>
                <div className="text-gray-900 font-bold text-xl">50K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <div className="text-gray-900 font-bold text-xl">4.9/5</div>
                <div className="text-gray-600">User Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
            <div className="relative bg-linear-to-br from-blue-600 to-purple-600 rounded-3xl p-1">
              <img
                src="https://images.unsplash.com/photo-1705909770198-7e83c24e1616?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBtaW5pbWFsfGVufDF8fHx8MTc2NDAwMzc0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern workspace"
                className="w-full rounded-3xl object-cover aspect-square"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-gray-900 text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your development workflow and boost productivity.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-gray-900 mb-2 font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto relative rounded-3xl bg-linear-to-br from-blue-600 to-purple-600 p-12 overflow-hidden text-center">
            <h2 className="text-white text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-6">
              Join thousands of developers who are already building amazing products with DevPortal.
            </p>
            <Link to={'/sign-up'}>
              <Button variant="secondary" size="lg">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
