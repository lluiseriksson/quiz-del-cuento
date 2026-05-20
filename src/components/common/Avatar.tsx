import React from 'react';
import { AvatarConfig } from '@/types';

// Export options for avatar elements to be used in selection panels
export const AVATAR_CHARACTERS = [
  { id: 'cat', name: 'Gato', emoji: '🐱' },
  { id: 'fox', name: 'Zorro', emoji: '🦊' },
  { id: 'panda', name: 'Panda', emoji: '🐼' },
  { id: 'dino', name: 'Dinosaurio', emoji: '🦖' },
  { id: 'robot', name: 'Robot', emoji: '🤖' },
  { id: 'unicorn', name: 'Unicornio', emoji: '🦄' },
  { id: 'penguin', name: 'Pingüino', emoji: '🐧' },
  { id: 'alien', name: 'Alien', emoji: '👽' }
];

export const AVATAR_ACCESSORIES = [
  { id: 'none', name: 'Sin Accesorio', emoji: '❌' },
  { id: 'sunglasses', name: 'Gafas de Sol', emoji: '😎' },
  { id: 'party_hat', name: 'Gorro Fiesta', emoji: '🥳' },
  { id: 'crown', name: 'Corona Real', emoji: '👑' },
  { id: 'headphones', name: 'Auriculares', emoji: '🎧' },
  { id: 'mustache', name: 'Bigote', emoji: '👨' },
  { id: 'wizard_hat', name: 'Sombrero Mago', emoji: '🧙' }
];

export const AVATAR_COLORS = [
  { id: 'purple', value: '#8b5cf6', label: 'Morado', bgClass: 'bg-purple-500' },
  { id: 'pink', value: '#ec4899', label: 'Rosa', bgClass: 'bg-pink-500' },
  { id: 'blue', value: '#3b82f6', label: 'Azul', bgClass: 'bg-blue-500' },
  { id: 'cyan', value: '#06b6d4', label: 'Cian', bgClass: 'bg-cyan-500' },
  { id: 'orange', value: '#f97316', label: 'Naranja', bgClass: 'bg-orange-500' },
  { id: 'lime', value: '#84cc16', label: 'Lima', bgClass: 'bg-lime-500' },
  { id: 'amber', value: '#f59e0b', label: 'Ámbar', bgClass: 'bg-amber-500' }
];

// Helper to get random avatar config
export const getRandomAvatar = (): AvatarConfig => {
  const char = AVATAR_CHARACTERS[Math.floor(Math.random() * AVATAR_CHARACTERS.length)].id;
  const acc = AVATAR_ACCESSORIES[Math.floor(Math.random() * AVATAR_ACCESSORIES.length)].id;
  const col = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)].id;
  return { character: char, accessory: acc, color: col };
};

interface AvatarProps {
  config?: AvatarConfig;
  size?: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ config, size = 48, className = '' }) => {
  // Use a sensible default avatar config if none provided or keys are missing
  const activeConfig = {
    character: config?.character || 'panda',
    accessory: config?.accessory || 'none',
    color: config?.color || 'purple'
  };

  const bgColor = AVATAR_COLORS.find(c => c.id === activeConfig.color)?.value || '#8b5cf6';

  // Render character face/body details
  const renderCharacter = () => {
    switch (activeConfig.character) {
      case 'panda':
        return (
          <g id="panda-character">
            {/* Panda Ears */}
            <circle cx="32" cy="38" r="8" fill="#1e293b" />
            <circle cx="68" cy="38" r="8" fill="#1e293b" />
            <circle cx="32" cy="38" r="4" fill="#0f172a" />
            <circle cx="68" cy="38" r="4" fill="#0f172a" />
            
            {/* Panda Head */}
            <circle cx="50" cy="55" r="22" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
            
            {/* Panda Eye Patches */}
            <ellipse cx="41" cy="53" rx="6" ry="8" transform="rotate(-15 41 53)" fill="#1e293b" />
            <ellipse cx="59" cy="53" rx="6" ry="8" transform="rotate(15 59 53)" fill="#1e293b" />
            
            {/* Eyes */}
            <circle cx="42" cy="51" r="2.5" fill="#ffffff" />
            <circle cx="42.5" cy="50.5" r="0.8" fill="#000000" />
            <circle cx="58" cy="51" r="2.5" fill="#ffffff" />
            <circle cx="57.5" cy="50.5" r="0.8" fill="#000000" />
            
            {/* Blush cheeks */}
            <circle cx="32" cy="60" r="2.5" fill="#fda4af" opacity="0.6" />
            <circle cx="68" cy="60" r="2.5" fill="#fda4af" opacity="0.6" />
            
            {/* Nose */}
            <ellipse cx="50" cy="59" rx="3.2" ry="2" fill="#0f172a" />
            
            {/* Mouth */}
            <path d="M 46.5,63 C 48.5,65 50,64 50,63.2 C 50,64 51.5,65 53.5,63" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'cat':
        return (
          <g id="cat-character">
            {/* Cat Ears */}
            <polygon points="24,43 14,20 37,34" fill="#ff9f43" stroke="#e67e22" strokeWidth="1.5" />
            <polygon points="76,43 86,20 63,34" fill="#ff9f43" stroke="#e67e22" strokeWidth="1.5" />
            <polygon points="26,41 18,24 35,34" fill="#fda4af" />
            <polygon points="74,41 82,24 65,34" fill="#fda4af" />

            {/* Cat Head */}
            <circle cx="50" cy="55" r="22" fill="#ffb8b8" stroke="#ff9f43" strokeWidth="1.5" />

            {/* Eyes */}
            <circle cx="41" cy="52" r="3" fill="#1e293b" />
            <circle cx="42.5" cy="50.5" r="1" fill="#ffffff" />
            <circle cx="59" cy="52" r="3" fill="#1e293b" />
            <circle cx="60.5" cy="50.5" r="1" fill="#ffffff" />

            {/* Whiskers */}
            <path d="M 32,56 L 16,54 M 32,60 L 14,60 M 32,64 L 18,66" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 68,56 L 84,54 M 68,60 L 86,60 M 68,64 L 82,66" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />

            {/* Cute pink nose */}
            <polygon points="48,58 52,58 50,60" fill="#ec4899" />

            {/* Mouth */}
            <path d="M 46.5,61.5 C 48,63 50,62 50,61 C 50,62 52,63 53.5,61.5" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'fox':
        return (
          <g id="fox-character">
            {/* Fox Ears */}
            <polygon points="22,41 12,14 36,32" fill="#e67e22" stroke="#d35400" strokeWidth="1.5" />
            <polygon points="78,41 88,14 64,32" fill="#e67e22" stroke="#d35400" strokeWidth="1.5" />
            <polygon points="24,39 16,19 33,32" fill="#334155" />
            <polygon points="76,39 84,19 67,32" fill="#334155" />

            {/* Fox Head (Base) */}
            <circle cx="50" cy="55" r="22" fill="#e67e22" stroke="#d35400" strokeWidth="1.5" />

            {/* Fox White Muzzle/Cheeks */}
            <path d="M 28.5,58 C 28.5,47.5 35.5,49.5 50,66.5 C 64.5,49.5 71.5,47.5 71.5,58 C 71.5,69 64.5,74.5 50,74.5 C 35.5,74.5 28.5,69 28.5,58 Z" fill="#ffffff" />

            {/* Fox Nose */}
            <circle cx="50" cy="67" r="3" fill="#1e293b" />

            {/* Slanted Eyes */}
            <path d="M 35,51 Q 41,49 44,53" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 65,51 Q 59,49 56,53" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />

            {/* Blush */}
            <circle cx="34" cy="58" r="2" fill="#fda4af" opacity="0.6" />
            <circle cx="66" cy="58" r="2" fill="#fda4af" opacity="0.6" />
          </g>
        );

      case 'dino':
        return (
          <g id="dino-character">
            {/* Dino Spikes */}
            <polygon points="43,34 50,18 57,34" fill="#16a34a" />
            <polygon points="28,40 33,25 41,36" fill="#16a34a" />
            <polygon points="72,40 67,25 59,36" fill="#16a34a" />

            {/* Dino Head */}
            <circle cx="50" cy="56" r="22" fill="#4ade80" stroke="#22c55e" strokeWidth="1.5" />

            {/* Dinosaur Big Eyes */}
            <circle cx="39" cy="50" r="4.5" fill="#ffffff" />
            <circle cx="39" cy="50" r="2" fill="#0f172a" />
            <circle cx="61" cy="50" r="4.5" fill="#ffffff" />
            <circle cx="61" cy="50" r="2" fill="#0f172a" />

            {/* Cute Cheek Blush */}
            <circle cx="33" cy="58" r="2.5" fill="#ec4899" opacity="0.4" />
            <circle cx="67" cy="58" r="2.5" fill="#ec4899" opacity="0.4" />

            {/* Smiling Mouth */}
            <path d="M 42,62 Q 50,71 58,62" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'robot':
        return (
          <g id="robot-character">
            {/* Antenna */}
            <line x1="50" y1="34" x2="50" y2="18" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="50" cy="15" r="4.5" fill="#ef4444" className="animate-pulse" />

            {/* Side bolts / ears */}
            <rect x="21" y="47" width="7" height="14" rx="2.5" fill="#475569" />
            <rect x="72" y="47" width="7" height="14" rx="2.5" fill="#475569" />

            {/* Metal Head */}
            <rect x="27" y="34" width="46" height="38" rx="8" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
            <rect x="31" y="38" width="38" height="30" rx="6" fill="#cbd5e1" />

            {/* Glowing cyan eyes */}
            <circle cx="41" cy="48" r="5" fill="#06b6d4" />
            <circle cx="41" cy="48" r="2.5" fill="#ffffff" />
            <circle cx="59" cy="48" r="5" fill="#06b6d4" />
            <circle cx="59" cy="48" r="2.5" fill="#ffffff" />

            {/* Digital Grid Mouth */}
            <rect x="40" y="58" width="20" height="6" rx="1.5" fill="#334155" />
            <line x1="44" y1="58" x2="44" y2="64" stroke="#06b6d4" strokeWidth="1" />
            <line x1="50" y1="58" x2="50" y2="64" stroke="#06b6d4" strokeWidth="1" />
            <line x1="56" y1="58" x2="56" y2="64" stroke="#06b6d4" strokeWidth="1" />
          </g>
        );

      case 'unicorn':
        return (
          <g id="unicorn-character">
            {/* Mane Background */}
            <path d="M 33,36 C 26,26 40,20 50,26 C 60,20 74,26 67,36 C 75,44 75,56 68,64 C 64,68 50,68 50,68 C 50,68 36,68 32,64 C 25,56 25,44 33,36 Z" fill="#f472b6" opacity="0.8" />

            {/* Unicorn Ears */}
            <polygon points="26,42 16,21 34,34" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <polygon points="74,42 84,21 66,34" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <polygon points="28,40 20,25 33,34" fill="#fda4af" />
            <polygon points="72,40 80,25 67,34" fill="#fda4af" />

            {/* Unicorn Head */}
            <circle cx="50" cy="56" r="21" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Magical Horn */}
            <polygon points="46,36 50,8 54,36" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            <line x1="48" y1="28" x2="52.2" y2="28" stroke="#d97706" strokeWidth="1.5" />
            <line x1="47.2" y1="20" x2="52.8" y2="20" stroke="#d97706" strokeWidth="1.5" />
            <line x1="48.5" y1="12" x2="51.5" y2="12" stroke="#d97706" strokeWidth="1.5" />

            {/* Closed eyelashes */}
            <path d="M 36,54 Q 40.5,58 44,54" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="37" y1="55" x2="35" y2="52" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="43" y1="55" x2="45" y2="52" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            
            <path d="M 64,54 Q 59.5,58 56,54" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="63" y1="55" x2="65" y2="52" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="57" y1="55" x2="55" y2="52" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />

            {/* Pink blush */}
            <circle cx="34" cy="60" r="3" fill="#fda4af" />
            <circle cx="66" cy="60" r="3" fill="#fda4af" />

            {/* Nostrils */}
            <circle cx="48" cy="63" r="0.8" fill="#cbd5e1" />
            <circle cx="52" cy="63" r="0.8" fill="#cbd5e1" />
          </g>
        );

      case 'penguin':
        return (
          <g id="penguin-character">
            {/* Penguin Outer Head */}
            <circle cx="50" cy="55" r="22" fill="#1e293b" />
            
            {/* Flappers (wings on the side) */}
            <path d="M 28,52 C 22,54 20,62 25,66 C 28,64 28,58 28,52 Z" fill="#0f172a" />
            <path d="M 72,52 C 78,54 80,62 75,66 C 72,64 72,58 72,52 Z" fill="#0f172a" />

            {/* Face Mask (white patch) */}
            <path d="M 50,67.5 C 38.5,67.5 32.5,59.5 34.5,49.5 C 36.5,43.5 44,44.5 50,51 C 56,44.5 63.5,43.5 65.5,49.5 C 67.5,59.5 61.5,67.5 50,67.5 Z" fill="#ffffff" />

            {/* Beak */}
            <polygon points="45,54 55,54 50,63" fill="#f59e0b" stroke="#d97706" strokeWidth="1" strokeLinejoin="round" />

            {/* Eyes */}
            <circle cx="42" cy="50.5" r="2.2" fill="#1e293b" />
            <circle cx="43" cy="49.5" r="0.8" fill="#ffffff" />
            <circle cx="58" cy="50.5" r="2.2" fill="#1e293b" />
            <circle cx="57" cy="49.5" r="0.8" fill="#ffffff" />

            {/* Cheek blush */}
            <circle cx="36" cy="56.5" r="2" fill="#fda4af" opacity="0.8" />
            <circle cx="64" cy="56.5" r="2" fill="#fda4af" opacity="0.8" />
          </g>
        );

      case 'alien':
        return (
          <g id="alien-character">
            {/* Antennae */}
            <path d="M 40,36 C 35,28 33,22 37,19" fill="none" stroke="#84cc16" strokeWidth="3" strokeLinecap="round" />
            <circle cx="37" cy="17" r="3.5" fill="#a3e635" />
            
            <path d="M 60,36 C 65,28 67,22 63,19" fill="none" stroke="#84cc16" strokeWidth="3" strokeLinecap="round" />
            <circle cx="63" cy="17" r="3.5" fill="#a3e635" />

            {/* Pear Alien Head */}
            <path d="M 50,33 C 65,33 73,42 71.5,57 C 70,70.5 59,76.5 50,76.5 C 41,76.5 30,70.5 28.5,57 C 27,42 35,33 50,33 Z" fill="#a3e635" stroke="#84cc16" strokeWidth="1.5" />

            {/* Large Alien Glossy Eyes */}
            <path d="M 34,48 C 32,53 37,60 42.5,59 C 46.5,58 45.5,49 41.5,47 C 38.5,45.5 35,46 34,48 Z" fill="#0f172a" />
            <ellipse cx="38" cy="50" rx="1.5" ry="3.5" transform="rotate(-20 38 50)" fill="#ffffff" />
            <circle cx="41.5" cy="53" r="0.8" fill="#ffffff" />

            <path d="M 66,48 C 68,53 63,60 57.5,59 C 53.5,58 54.5,49 58.5,47 C 61.5,45.5 65,46 66,48 Z" fill="#0f172a" />
            <ellipse cx="62" cy="50" rx="1.5" ry="3.5" transform="rotate(20 62 50)" fill="#ffffff" />
            <circle cx="58.5" cy="53" r="0.8" fill="#ffffff" />

            {/* Alien Smile */}
            <path d="M 45,66 Q 50,69 55,66" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        );

      default:
        return null;
    }
  };

  // Render accessories on top
  const renderAccessory = () => {
    switch (activeConfig.accessory) {
      case 'sunglasses':
        return (
          <g id="sunglasses-acc">
            {/* Sunglasses Glasses Bridge & Lens */}
            <path d="M 28,50 L 72,50" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            <path d="M 31,50 L 33,58 C 36,63 43,63 45,58 L 47,50" fill="#0f172a" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 53,50 L 55,58 C 58,63 65,63 67,58 L 69,50" fill="#0f172a" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
            {/* Lens Reflection Glare */}
            <line x1="34" y1="52" x2="41" y2="56" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            <line x1="56" y1="52" x2="63" y2="56" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          </g>
        );

      case 'party_hat':
        return (
          <g id="party-hat-acc">
            {/* Hat Cone */}
            <polygon points="36,36 50,8 64,36" fill="#f43f5e" stroke="#db2777" strokeWidth="1" />
            
            {/* Colorful Stripes */}
            <path d="M 41,27 L 55,27" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 38,33 L 62,33" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Pom Pom top */}
            <circle cx="50" cy="7" r="3.5" fill="#fbbf24" />
          </g>
        );

      case 'crown':
        return (
          <g id="crown-acc" transform="rotate(-6 50 25)">
            {/* Shiny Gold Crown */}
            <polygon points="32,35 28,19 39,26 50,15 61,26 72,19 68,35" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
            
            {/* Jewels */}
            <circle cx="28" cy="18" r="1.8" fill="#ef4444" />
            <circle cx="50" cy="14" r="1.8" fill="#3b82f6" />
            <circle cx="72" cy="18" r="1.8" fill="#ef4444" />
            <circle cx="50" cy="27" r="2.2" fill="#ec4899" />
          </g>
        );

      case 'headphones':
        return (
          <g id="headphones-acc">
            {/* Headphone Band */}
            <path d="M 28,52 C 28,30 72,30 72,52" fill="none" stroke="#2563eb" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 28,52 C 28,33 72,33 72,52" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            
            {/* Outer Ear Cups */}
            <rect x="20" y="45" width="8" height="15" rx="4" fill="#1e3a8a" />
            <rect x="72" y="45" width="8" height="15" rx="4" fill="#1e3a8a" />
            
            {/* Inner Ear Pads */}
            <rect x="25" y="47" width="4" height="11" rx="2" fill="#3b82f6" />
            <rect x="71" y="47" width="4" height="11" rx="2" fill="#3b82f6" />
          </g>
        );

      case 'mustache':
        return (
          <g id="mustache-acc" transform="translate(0, 3)">
            {/* Left Wing */}
            <path d="M 50,60 C 44,60 41,56 36,59 C 33,61 33,63 36,63 C 43,63 47,60 50,60 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="0.5" />
            {/* Right Wing */}
            <path d="M 50,60 C 56,60 59,56 64,59 C 67,61 67,63 64,63 C 57,63 53,60 50,60 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="0.5" />
          </g>
        );

      case 'wizard_hat':
        return (
          <g id="wizard-hat-acc" transform="rotate(3 50 25)">
            {/* Wizard Hat Brim */}
            <ellipse cx="50" cy="35" rx="21" ry="3.5" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="1" />
            
            {/* Wizard Hat Cone (curved slightly left/right) */}
            <path d="M 33,34 Q 45,6 48,4 Q 44,22 62,34 Z" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="1" />
            
            {/* Golden Buckle or Star */}
            <polygon points="46,31 48,27 52,27 54,31 50,34" fill="#fbbf24" />
            <circle cx="43" cy="20" r="1" fill="#fef08a" />
            <circle cx="53" cy="13" r="0.8" fill="#fef08a" />
            <circle cx="47" cy="11" r="1.2" fill="#fef08a" className="animate-pulse" />
          </g>
        );

      case 'none':
      default:
        return null;
    }
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`rounded-full shadow-md select-none flex-shrink-0 ${className}`}
      style={{ minWidth: size, minHeight: size }}
    >
      {/* Background with custom color */}
      <circle cx="50" cy="50" r="45" fill={bgColor} />
      
      {/* Subtly darkened inner circular ring for depth */}
      <circle cx="50" cy="50" r="42" fill="none" stroke="#000000" strokeWidth="2.5" opacity="0.08" />

      {/* Renders the cartoon character face/ears */}
      {renderCharacter()}

      {/* Renders the Kahoot-like custom accessory */}
      {renderAccessory()}
    </svg>
  );
};

export default Avatar;
