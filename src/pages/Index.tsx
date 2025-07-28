
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, MessageSquare, Zap, Shield, Globe, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

const Index = () => {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-bold">ChatBot Pro</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
                    Dashboard
                  </Button>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-slate-900"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setShowAuthModal(true)}
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Build Powerful AI Chatbots
            <span className="text-green-400"> In Minutes</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Create, customize, and deploy intelligent chatbots for your website. 
            No coding required. Get started with our intuitive drag-and-drop builder.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link to="/create">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                <Bot className="w-5 h-5 mr-2" />
                Create Your Bot
              </Button>
            </Link>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="text-green-400 border-green-400 hover:bg-green-400 hover:text-slate-900 px-8 py-4 text-lg">
                  View Dashboard
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                variant="outline" 
                className="text-green-400 border-green-400 hover:bg-green-400 hover:text-slate-900 px-8 py-4 text-lg"
                onClick={() => setShowAuthModal(true)}
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to Build Amazing Chatbots
          </h2>
          <p className="text-slate-300 text-lg">
            Powerful features designed for businesses of all sizes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: MessageSquare,
              title: 'Intelligent Conversations',
              description: 'AI-powered responses that understand context and provide meaningful interactions.'
            },
            {
              icon: Zap,
              title: 'Easy Integration',
              description: 'Simple code snippet integration. Deploy to any website in under 5 minutes.'
            },
            {
              icon: Shield,
              title: 'Enterprise Security',
              description: 'Bank-level security with data encryption and privacy compliance.'
            },
            {
              icon: Globe,
              title: 'Multi-Language Support',
              description: 'Support customers worldwide with automatic language detection.'
            },
            {
              icon: TrendingUp,
              title: 'Advanced Analytics',
              description: 'Deep insights into customer interactions and bot performance.'
            },
            {
              icon: Bot,
              title: 'Custom Branding',
              description: 'Fully customizable design to match your brand identity.'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-green-500 transition-colors duration-200">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-slate-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-green-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using ChatBot Pro to automate customer interactions 
            and boost satisfaction rates.
          </p>
          <Link to="/create">
            <Button size="lg" className="bg-green-100 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold">
              Start Building Now - It's Free
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-slate-800">
        <div className="text-center text-slate-400">
          <p>&copy; 2024 ChatBot Pro. All rights reserved.</p>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
