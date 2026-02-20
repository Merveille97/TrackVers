import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const EditableCell = ({ value, onChange, isTextArea = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  // Sync internal state with prop changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setCurrentValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Only trigger onChange if value actually changed
    if (currentValue !== value) {
      onChange(currentValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isTextArea) {
      handleBlur();
    } else if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return isTextArea ? (
      <Textarea
        value={currentValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="min-w-[200px]"
      />
    ) : (
      <Input
        type="text"
        value={currentValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="min-w-[120px]"
      />
    );
  }

  return (
    <div onDoubleClick={handleDoubleClick} className="cursor-pointer p-2 min-h-[40px] w-full break-words hover:bg-gray-50 rounded transition-colors" title="Double-click to edit">
      {value || <span className="text-gray-400 italic">Double-click to edit</span>}
    </div>
  );
};

export default EditableCell;