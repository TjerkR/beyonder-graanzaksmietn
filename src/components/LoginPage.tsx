
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome } from 'lucide-react';

const LoginPage = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Beyonder Logo */}
      <div className="absolute top-6 left-6 z-20">
        <img 
          src="https://beyonder.eu/storage/uploads/0184aeeb-1507-4a47-8e6e-c3076839cab0/logo-name.svg" 
          alt="Beyonder" 
          className="h-8 w-auto"
        />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-slate-600/5"></div>
        
        <Card className="w-full max-w-md relative z-10 border border-slate-200/60 bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center space-y-6 pt-12 pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-slate-900">
                Cornhole Arena
              </CardTitle>
              <CardDescription className="text-base text-slate-600 font-medium">
                Professional Remote Competition Platform
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 px-6 pb-8">
            <div className="text-center">
              <p className="text-slate-700 leading-relaxed">
                Experience seamless remote cornhole competitions with real-time scoring, 
                live camera feeds, and professional tournament management.
              </p>
            </div>
            
            <Button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full h-12 text-base font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-blue-400 shadow-md transition-all duration-200"
              variant="outline"
            >
              <Chrome className="mr-3 h-5 w-5 text-blue-600" />
              {loading ? 'Authenticating...' : 'Continue with Google'}
            </Button>
            
            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Secure enterprise-grade authentication
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
