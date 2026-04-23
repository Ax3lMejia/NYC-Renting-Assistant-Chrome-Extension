import React from 'react';
import { cn } from '../../utils/cn';

interface TextProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement> {
  children: React.ReactNode;
}

export const Heading: React.FC<TextProps & { level?: 1 | 2 | 3 | 4 }> = ({ 
  children, 
  level = 1, 
  className, 
  ...props 
}) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  const styles = {
    1: "text-2xl font-serif font-bold tracking-tight text-primary-950",
    2: "text-xl font-serif font-semibold tracking-tight text-primary-900",
    3: "text-lg font-serif font-medium text-primary-900",
    4: "text-base font-serif font-medium text-primary-800",
  };

  return (
    <Tag className={cn(styles[level], className)} {...props}>
      {children}
    </Tag>
  );
};

export const Text: React.FC<TextProps & { size?: 'sm' | 'md' | 'lg' | 'xs'; weight?: 'normal' | 'medium' | 'semibold' }> = ({ 
  children, 
  size = 'md', 
  weight = 'normal',
  className, 
  ...props 
}) => {
  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
  };

  return (
    <p 
      className={cn(
        "font-sans leading-relaxed text-primary-700", 
        sizes[size], 
        weights[weight],
        className
      )} 
      {...props}
    >
      {children}
    </p>
  );
};
