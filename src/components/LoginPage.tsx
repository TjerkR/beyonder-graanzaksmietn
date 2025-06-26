
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Chrome } from 'lucide-react';

const LoginPage = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-amber-800">
            🎯 The Cornhole Arena
          </CardTitle>
          <CardDescription className="text-lg">
            Welcome to the ultimate cornhole competition platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Sign in to start playing, track your scores, and compete with friends!
            </p>
          </div>
          
          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full h-12 text-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            variant="outline"
          >
            <Chrome className="mr-3 h-5 w-5" />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            <p>Secure authentication powered by Supabase</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
