import type { Meta } from '@storybook/react-vite'

export default {
  title: 'Design system/Visual spec',
  parameters: { layout: 'padded' },
} satisfies Meta

export const ColorTokens = () => (
  <div className="grid grid-cols-5 gap-3">
    {['50','100','200','300','400','500','600','700','800','900'].map(n => (
      <div key={n}>
        <div className={`h-10 rounded-md bg-neutral-${n} border border-border`}/>
        <p className="text-xs text-text-muted mt-1">neutral-{n}</p>
      </div>
    ))}
  </div>
)

export const BrandColors = () => (
  <div className="flex gap-3">
    {['500','600','700'].map(n => (
      <div key={n}>
        <div className={`h-10 w-20 rounded-md bg-brand-${n}`}/>
        <p className="text-xs text-text-muted mt-1">brand-{n}</p>
      </div>
    ))}
  </div>
)

export const AccentColors = () => (
  <div className="flex gap-3">
    <div>
      <div className="h-10 w-20 rounded-md bg-accent-500"/>
      <p className="text-xs text-text-muted mt-1">accent-500</p>
    </div>
  </div>
)

export const TypeScale = () => (
  <div className="space-y-4">
    {(['3xl','2xl','xl','lg','base','sm','xs'] as const).map(size => (
      <div key={size} className="flex items-baseline gap-4">
        <span className="text-xs text-text-muted w-12">text-{size}</span>
        <span className={`text-${size}`}>The quick brown fox</span>
      </div>
    ))}
  </div>
)

export const SpacingScale = () => (
  <div className="space-y-2">
    {[1,2,3,4,6,8,12,16].map(n => (
      <div key={n} className="flex items-center gap-3">
        <span className="text-xs text-text-muted w-16">spacing-{n}</span>
        <div className={`h-4 bg-brand-500 rounded-sm`} style={{width: `${n * 4}px`}}/>
        <span className="text-xs text-text-muted">{n * 4}px</span>
      </div>
    ))}
  </div>
)

export const ElevationLevels = () => (
  <div className="flex gap-6 p-8 bg-surface">
    {[
      { label: 'Flat (default)', cls: 'bg-surface-raised border border-border' },
      { label: 'Hover', cls: 'bg-surface-raised border border-border shadow-sm' },
      { label: 'Active / focus', cls: 'bg-surface-raised border border-border shadow-md' },
    ].map(({ label, cls }) => (
      <div key={label} className={`${cls} rounded-lg p-4 w-36`}>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    ))}
  </div>
)

export const RadiusLevels = () => (
  <div className="flex gap-6 p-8">
    {[
      { label: 'sm (4px)', radius: 'rounded-sm' },
      { label: 'md (8px)', radius: 'rounded-md' },
      { label: 'lg (12px)', radius: 'rounded-lg' },
    ].map(({ label, radius }) => (
      <div key={label} className={`bg-brand-500 w-16 h-16 ${radius}`}>
        <p className="text-xs text-text-muted pt-2 text-center">{label}</p>
      </div>
    ))}
  </div>
)
