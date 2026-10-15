import React from 'react';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ className = '', iconClassName = 'w-4 h-4' }) => {
  const socials = [
    {
      name: 'GitHub',
      href: 'https://github.com/niteshvishwakarma-dev',
      icon: Github,
      color: 'hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/nitesh-vishwakarma-439277352',
      icon: Linkedin,
      color: 'hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10',
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/er_nitesh_lohar',
      icon: Instagram,
      color: 'hover:text-pink-400 hover:border-pink-500/40 hover:bg-pink-500/10',
    },
    {
      name: 'Email',
      href: 'mailto:niteshvishwakarma7267980881@gmail.com',
      icon: Mail,
      color: 'hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10',
    },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          title={s.name}
          className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 transition-all duration-300 shadow-md ${s.color}`}
        >
          <s.icon className={iconClassName} />
        </a>
      ))}
    </div>
  );
};
