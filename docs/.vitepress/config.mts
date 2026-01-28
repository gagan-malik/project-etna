import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Project Etna',
  description: 'AI-Powered Silicon Debug Assistant - Documentation',
  base: '/project-etna/',
  srcExclude: ['**/product/**', '**/404.md'],
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', href: '/project-etna/assets/images/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap', rel: 'stylesheet' }],
  ],
  appearance: 'dark',
  themeConfig: {
    logo: '/assets/images/logo.svg',
    hero: {
      name: 'Project Etna',
      text: 'AI-Powered Silicon Debug Assistant',
      tagline: 'Debug RTL designs faster with AI. Verilog, SystemVerilog, VHDL & waveforms.',
      image: { src: '/assets/images/logo.svg', alt: 'Project Etna' },
      actions: [
        { text: 'Get Started', link: '/getting-started', type: 'primary' },
        { text: 'View on GitHub', link: 'https://github.com/gaganmalik/project-etna', type: 'secondary' },
      ],
    },
    features: [
      { title: 'Multi-Model AI', details: 'OpenAI GPT-4, Google Gemini, DeepSeek, and Llama.' },
      { title: 'RTL Analysis', details: 'Parse and analyze Verilog, SystemVerilog, and VHDL files.' },
      { title: 'Waveform Viewer', details: 'Integrated Surfer viewer for VCD, FST, and GHW files.' },
      { title: 'Debug Sessions', details: 'Organize and track your debugging workflows.' },
    ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Features', link: '/features' },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'Architecture', link: '/architecture' },
      { text: 'Waveform Viewer', link: '/waveforms' },
      { text: 'Contributing', link: '/contributing' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Getting Started', link: '/getting-started' },
        ],
      },
      {
        text: 'API Reference',
        link: '/api/',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/api/' },
          { text: 'Conversations', link: '/api/conversations' },
          { text: 'Messages', link: '/api/messages' },
          { text: 'Spaces', link: '/api/spaces' },
          { text: 'Documents', link: '/api/documents' },
          { text: 'Waveforms', link: '/api/waveforms' },
          { text: 'Authentication', link: '/api/authentication' },
        ],
      },
      {
        text: 'Guides',
        items: [
          { text: 'Features', link: '/features' },
          { text: 'Roadmap', link: '/roadmap' },
          { text: 'Architecture', link: '/architecture' },
          { text: 'Waveform Viewer', link: '/waveforms' },
          { text: 'Contributing', link: '/contributing' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/gaganmalik/project-etna' },
    ],
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
      label: 'On this page',
    },
    footer: {
      message: 'Copyright © 2026 Project Etna. Distributed under the MIT License.',
      copyright: '',
    },
    editLink: {
      pattern: 'https://github.com/gaganmalik/project-etna/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
})
