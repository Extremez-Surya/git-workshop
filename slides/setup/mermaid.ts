import { defineMermaidSetup } from '@slidev/types'

// Diagram look: light boxes, green accent. Edit colours here, not in each diagram.
export default defineMermaidSetup(() => ({
  theme: 'base',
  themeVariables: {
    fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
    fontSize: '16px',
    primaryColor: '#eef5ef',
    primaryBorderColor: '#2f6f3e',
    primaryTextColor: '#111',
    lineColor: '#555',
    clusterBkg: '#fafafa',
    clusterBorder: '#bbb',
    edgeLabelBackground: '#fff',
    git0: '#2f6f3e',
    git1: '#d9822b',
    gitBranchLabel0: '#fff',
    gitBranchLabel1: '#fff',
    commitLabelFontSize: '14px',
  },
  gitGraph: { rotateCommitLabel: true },
}))
