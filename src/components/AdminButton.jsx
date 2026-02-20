import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      onClick={() => navigate('/admin')}
      className="text-white hover:bg-white/10 gap-2 px-3"
      aria-label="Go to Admin Panel"
    >
      <Shield className="w-4 h-4" />
      <span className="font-medium">Admin</span>
    </Button>
  );
};

export default AdminButton;