import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function CallbackPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate('/dashboard/login');
  }, [navigate]);

  return null;
}
