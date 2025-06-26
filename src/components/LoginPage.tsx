
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome } from 'lucide-react';

const LoginPage = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-white/50 to-transparent"></div>
      
      <Card className="w-full max-w-lg relative z-10 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl">🎯</span>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2">
            Cornhole Arena
          </CardTitle>
          <CardDescription className="text-lg text-slate-600 font-medium">
            Professional Remote Competition Platform
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 px-8 pb-12">
          <div className="text-center">
            <p className="text-slate-700 text-base leading-relaxed">
              Experience seamless remote cornhole competitions with real-time scoring, 
              live camera feeds, and professional tournament management.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full h-14 text-lg font-semibold bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-blue-300 shadow-lg transition-all duration-200"
              variant="outline"
            >
              <Chrome className="mr-3 h-6 w-6 text-blue-600" />
              {loading ? 'Authenticating...' : 'Continue with Google'}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-slate-500 font-medium">
                Secure enterprise-grade authentication
              </p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-xs text-slate-600 font-medium">Support</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">HD</div>
                <div className="text-xs text-slate-600 font-medium">Live Feeds</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">Real-time</div>
                <div className="text-xs text-slate-600 font-medium">Scoring</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-slate-400">
        Powered by advanced cloud infrastructure
      </div>
    </div>
  );
};

export default LoginPage;
