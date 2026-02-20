import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const EOLBadge = ({ date, type = 'eol' }) => {
  useEffect(() => {
    // Console log to verify prop reception
    console.log(`EOLBadge mounted. Type: ${type}, Date: ${date}`);
  }, [date, type]);

  const getLabel = () => {
    switch(type) {
      case 'eol': return 'EOL';
      case 'support': return 'End of Support';
      case 'maintenance': return 'End of Maint.';
      default: return 'Date';
    }
  };

  const getVariant = () => {
    if (!date) return 'outline';
    // Simple logic: if date passed, destructive, else secondary/default
    const now = new Date();
    const target = new Date(date);
    if (isNaN(target.getTime())) return 'outline';
    return target < now ? 'destructive' : 'secondary';
  };

  const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date set';

  return (
    <Badge 
      variant={getVariant()} 
      className={cn(
        "text-xs px-2 py-0.5 whitespace-nowrap", 
        !date && "border-dashed text-gray-500 border-gray-400"
      )}
    >
      {getLabel()}: {formattedDate}
    </Badge>
  );
};

export default EOLBadge;