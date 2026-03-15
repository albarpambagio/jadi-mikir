import type { Meta } from '@storybook/react-vite'

export default {
  title: 'Design system/Anti-patterns',
  tags: ['anti-pattern'],
  parameters: { 
    layout: 'padded',
    backgrounds: { default: 'dark' }
  },
} satisfies Meta

export const GradientButton = () => (
  <div className="p-4">
    <button 
      style={{background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 16, padding: '8px 16px', color: 'white'}}
    >
      Click me {/* DON'T DO THIS */}
    </button>
    <p className="text-red-400 mt-2">Gradient buttons are decorative slop</p>
  </div>
)

export const TooManyShadows = () => (
  <div className="p-4">
    <div style={{
      boxShadow: '0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1), 0 16px 32px rgba(0,0,0,0.08)',
      padding: '16px',
      background: 'white',
      borderRadius: '8px'
    }}>
      Card {/* DON'T DO THIS */}
    </div>
    <p className="text-red-400 mt-2">Stacked shadows create visual noise</p>
  </div>
)

export const TooManyColors = () => (
  <div className="p-4 flex gap-2">
    <div className="w-8 h-8 rounded-full bg-red-500" />
    <div className="w-8 h-8 rounded-full bg-yellow-500" />
    <div className="w-8 h-8 rounded-full bg-green-500" />
    <div className="w-8 h-8 rounded-full bg-blue-500" />
    <div className="w-8 h-8 rounded-full bg-purple-500" />
    <p className="text-red-400 mt-2">Max 2 accent colors per screen</p>
  </div>
)

export const LargeBorderRadius = () => (
  <div className="p-4">
    <div className="w-24 h-24 bg-brand-600 rounded-2xl" />
    <p className="text-red-400 mt-2">Large border-radius (16px+) is slop on non-pill elements</p>
  </div>
)

export const ArbitraryValues = () => (
  <div className="p-4">
    <div className="w-[127px] h-[43px] bg-neutral-800 text-[#fafafa] p-[11px]" />
    <p className="text-red-400 mt-2">Arbitrary values like w-[127px] break the token system</p>
  </div>
)
