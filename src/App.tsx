import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './App.css';

const projects = [
  {
    id: 'compiler-opt',
    title: 'Hierarchical Multi-Agent RL for Compiler Optimization',
    date: 'March 2026',
    summary: 'Autonomous discovery of optimal LLVM compiler pass sequences using a hierarchical multi-agent framework with Foveated GNNs and Two-Hot SymLog Binning.',
    github: 'https://github.com/TarunNagarajan/compiler-opt',
    content: () => (
      <>
        <p>
          The compilation phase-ordering problem—determining the optimal sequence of code-transforming optimization passes—is famously known to be NP-hard. Modern compilers like GCC and LLVM bypass this intractable search space by shipping with fixed, heuristic-driven pipelines (e.g., <code>-O2</code>, <code>-O3</code>). However, because these heuristics are static, they fail to account for the unique data-flow semantics, loop hierarchies, and memory access patterns of specific programs.
        </p>
        <p>
          This research treats compiler optimization as a continuous, non-stationary Markov Decision Process (MDP) and employs <strong>Hierarchical Multi-Agent Reinforcement Learning (HRL)</strong> to autonomously navigate the high-dimensional combinatorial space of LLVM pass interactions.
        </p>
        
        <h2>Graph Topology and the Over-Smoothing Bottleneck</h2>
        <p>
          I model the LLVM Intermediate Representation (IR) as a unified property graph <InlineMath math="\\\\mathcal{G} = (V, E)" /> containing the Control Flow Graph (CFG) and Data Dependence Graph (DDG). To resolve the tension between global context retrieval and local signal preservation, I engineered a <strong>Foveated Perception architecture</strong>.
        </p>
        <p>
          The architecture imposes a dual-resolution topology on the IR graph using an adaptive <code>block\_map</code> that dynamically adjusts the topological density. In the <strong>Fovea</strong>, the mapping is strictly isomorphic (<InlineMath math="1:1" />). In the <strong>Periphery</strong>, instructions undergo <strong>Hierarchical Block Condensation (HBC)</strong> via a deterministic scatter-reduction:
        </p>
        <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', margin: '1.5rem 0' }}>
          <BlockMath math="X'_{{active}} = \\\\text{scatter_mean}(X, B)" />
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: 0.8 }}>
            where <InlineMath math="B \\\\in \\\\mathbb{N}^{|V|}" /> represents the dominance-frontier block assignment vector. This achieves an <strong>86% reduction in graph nodes</strong> while maintaining 100% relational depth in hotspots.
          </p>
        </div>

        <h2>Fail-Safe Distributional Reasoning</h2>
        <p>
          To solve the gradient variance issues inherent in heterogeneous file scales (the "Linear Trap"), I implemented <strong>Categorical Distributional Reasoning</strong> using <strong>Two-Hot SymLog Binning</strong>. The continuous performance target <InlineMath math="y" /> is projected into a symmetric logarithmic space:
        </p>
        <BlockMath math="z = \\\\text{sign}(y) \\\\cdot \\\\ln(1 + |y|)" />
        <p>
          The network predicts a categorical distribution <InlineMath math="\\\\hat{P}" /> over 255 discrete bins spanning <InlineMath math="[-20\\\\%, +20\\\\%]" />. The "Two-Hot" encoding distributes the probability mass <InlineMath math="P" /> to the nearest bins <InlineMath math="b_{i}, b_{{i+1}}" />:
        </p>
        <BlockMath math="P_{{b_{i}}} = 1 - \\\\text{dist}(z, b_{i}), \\\\quad P_{{b_{{i+1}}}} = 1 - P_{{b_{i}}}" />
        <p>
          The system is optimized via Cross-Entropy:
        </p>
        <BlockMath math="\\\\mathcal{L} = -\\\\sum_{{b \\\\in \\\\mathcal{B}}} P_{b} \\\\log(\\\\hat{P}_{b})" />
        <p>
          By strictly bounding the gradients within <InlineMath math="[-1, 1]" />, numerical explosions are rendered mathematically impossible.
        </p>

        <h2>Action-State Attention Mechanics</h2>
        <p>
          I introduced a <strong>Multi-Head Cross-Attention</strong> module where the candidate optimization pass <InlineMath math="a" /> acts as a Query against the state vector <InlineMath math="s" />:
        </p>
        <BlockMath math="\\\\text{Attention}(Q_{a}, K_{s}, V_{s}) = \\\\text{softmax}\\\\left(\\\\frac{Q_{a} K_{s}^{T}}{\\\\sqrt{d_{k}}}\\\\right)V_{s}" />
        <p>
          This allows the model to selectively "attend" to relevant sub-graphs based on the action being queried—focusing on loop nests for unrolling passes or call graphs for inlining.
        </p>
      </>
    )
  },
  {
    id: 'task-quant',
    title: 'TaskQuant: Selective Quantization for LLMs',
    date: 'November 2025',
    summary: 'Task-aware selective quantization strategy for Microsoft Phi-2 and Llama-3 that preserves structural "load-bearing" components using Fisher Information.',
    github: 'https://github.com/TarunNagarajan/TaskQuant',
    content: () => (
      <>
        <p>
          Standard uniform Post-Training Quantization (PTQ) triggers catastrophic failure modes on reasoning-heavy tasks. This research formulates <strong>Task-Aware Selective Quantization</strong>, mathematically isolating the network sub-components indispensable for specific cognitive domains.
        </p>

        <h2>Hessian Approximations via the Fisher Matrix</h2>
        <p>
          To rigorously quantify parameter importance, I leverage the <strong>Fisher Information Matrix (FIM)</strong> as a first-order approximation of the Hessian of the loss landscape. For a parameter <InlineMath math="\\\\theta" /> and task-specific distribution <InlineMath math="\\\\mathcal{D}" />, the empirical Fisher Information <InlineMath math="F(\\\\theta)" /> is:
        </p>
        <BlockMath math="F(\\\\theta) = \\\\mathbb{E}_{{x \\\\sim \\\\mathcal{D}}} \\\\left[ \\\\left( \\\\nabla_{\\\\theta} \\\\ln p(y|x, \\\\\theta) \\\\right)^2 \\\\right]" />
        <p>
          We normalize sensitivity across asymmetric network layers using the <strong>Fisher Information Density</strong> <InlineMath math="\\\\rho_{F}" />:
        </p>
        <BlockMath math="\\\\rho_{F} = \\\\frac{1}{|P|} \\\\sum_{{\\\\theta \\\\in P}} F(\\\\theta)" />
        
        <p>
          In <strong>Phi-2 (2.7B)</strong>, this revealed extreme densities in the final <strong>Coherence Gate (Layer 29)</strong>. Despite being numerically small, these weights possess a Fisher density 14x higher than the model average.
        </p>

        <h2>Phase Shifts and Feature Collapse</h2>
        <p>
          Through qualitative analysis, I identified a failure mode termed <strong>Feature Collapse</strong>. Because Rotary Position Embeddings (RoPE) rely on precise trigonometric rotations:
        </p>
        <BlockMath math="\\\\mathbf{q}'_{m} = \\\\mathbf{R}_{m} \\\\mathbf{q}_{m}, \\\\quad \\\\mathbf{k}'_{n} = \\\\mathbf{R}_{n} \\\\mathbf{k}_{n}" />
        <p>
          Quantizing the corresponding projection matrices <InlineMath math="W_{q}, W_{k}" /> introduces a phase shift <InlineMath math="\\\\delta" />. This causes distinct tokens to algebraically "alias" or collapse into a single manifold point when:
        </p>
        <BlockMath math="\\\\langle \\\\mathbf{q}'_{m}, \\\\mathbf{k}'_{n} \\\\rangle \\\\approx \\\\langle \\\\mathbf{q}_{m}, \\\\mathbf{k}_{n} \\\\rangle + \\\\epsilon(\\\\delta)" />
        <p>
          where <InlineMath math="\\\\epsilon(\\\\delta)" /> exceeds the attention threshold, resulting in variable aliasing (e.g., <InlineMath math="3 \\\\times 60 = 180" /> vs <InlineMath math="3 \\\\times 3 \\\\times 60 = 540" />).
        </p>
      </>
    )
  },
  {
    id: 'early-exit',
    title: 'Hierarchical Adaptive Transformer',
    date: 'December 2025',
    summary: 'Dynamic computation pathways for TinyLlama-1.1B, targeting 1.5x-1.8x inference speedups via vertical early exiting and horizontal FFN skipping.',
    github: 'https://github.com/TarunNagarajan/early-exit',
    content: () => (
      <>
        <p>
          Standard Transformers utilize a fixed compute budget for every token. This project breaks that constraint by implementing a <strong>Hierarchical Adaptive Transformer</strong>, injecting token-level routing pathways directly into a pre-trained TinyLlama-1.1B.
        </p>

        <h2>Two-Dimensional Routing Grid</h2>
        <p>
          The system introduces two auxiliary trainable control mechanisms:
        </p>
        <ul>
          <li><strong>Vertical Early Exiting:</strong> Confidence gates <InlineMath math="g_{d}(h)" /> at strategic layers.</li>
          <li><strong>Horizontal FFN Skipping:</strong> A router <InlineMath math="\\\\sigma(h)" /> targeting a 55% average capacity.</li>
        </ul>

        <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', margin: '1.5rem 0' }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>Reparameterization & Stability</h3>
          <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
            Differentiable routing is enabled via a <strong>Straight-Through Estimator</strong> with <strong>Gumbel-Softmax</strong> noise injection <InlineMath math="u \\\\sim \\\\text{Unif}(0, 1)" />:
          </p>
          <BlockMath math="z = \\\\text{softmax}\\\\left( \\\\frac{\\\\ln(\\\\pi) + g}{\\\\tau} \\\\right), \\\\quad g = -\\\\ln(-\\\\ln u)" />
          <p style={{ fontSize: '0.95rem', marginTop: '1rem', marginBottom: '1rem' }}>
            To prevent router activation explosions (NaNs), I integrated a <strong>Z-Loss</strong> penalty on logit magnitude:
          </p>
          <BlockMath math="\\\\mathcal{L}_{z} = \\\\alpha \\\\cdot \\\\frac{1}{N} \\\\sum_{{i=1}}^{N} \\\\left( \\\\ln \\\\sum_{{j}} e^{{x_{{ij}}}} \\\\right)^2" />
        </div>

        <h2>Weighted Multi-Objective Optimization</h2>
        <p>
          Training is governed by a weighted loss function matching against the original unrouted model's distribution:
        </p>
        <BlockMath math="\\\\mathcal{L}_{{total}} = \\\\mathcal{L}_{{CE}} + \\\\lambda_{1} \\\\mathcal{L}_{{efficiency}} + \\\\lambda_{2} \\\\mathcal{L}_{z} + \\\\lambda_{3} \\\\mathcal{L}_{{entropy}}" />
        <p>
          This achieves an inference speedup of <strong><InlineMath math="1.5\\\\times - 1.8\\\\times" /></strong> by learning to spend compute only where marginal utility is maximized.
        </p>
      </>
    )
  },
  {
    id: 'boolrl',
    title: 'boolrl: DRL for Boolean Simplification',
    date: 'August 2025',
    summary: 'Investigating Deep Reinforcement Learning architectures (MLP, LSTM, GNN) for autonomous simplification of complex boolean expressions.',
    github: 'https://github.com/TarunNagarajan/boolrl',
    content: () => (
      <>
        <p>
          Boolean simplification is a core problem in circuit design. This project applies <strong>Deep Reinforcement Learning (DRL)</strong> to discover greedy simplification strategies by iteratively applying logical rewrite rules.
        </p>

        <h2>Markov Decision Process Formulation</h2>
        <p>
          I framed the simplification process as an MDP where the reward <InlineMath math="R_{t}" /> is proportional to the literal reduction:
        </p>
        <BlockMath math="R_{t} = \\\\text{len}(S_{t}) - \\\\text{len}(S_{{t+1}})" />
        
        <h2>Graph Attention Topology Learning</h2>
        <p>
          While baselines treat formulas as sequences, the <strong>GNN-based agent</strong> represents the state as an <strong>Abstract Syntax Tree (AST)</strong>. Each node <InlineMath math="v" /> has an embedding <InlineMath math="x_{v}" /> updated via neighborhood <InlineMath math="\\\\mathcal{N}(v)" /> attention:
        </p>
        <BlockMath math="\\\\alpha_{{vw}} = \\\\frac{\\\\exp(\\\\text{LeakyReLU}(\\\\vec{a}^{T} [W x_{v} || W x_{w}]))}{\\\\sum_{{k \\\\in \\\\mathcal{N}(v)}} \\\\exp(\\\\text{LeakyReLU}(\\\\vec{a}^{T} [W x_{v} || W x_{k}]))}" />
        <BlockMath math="x'_{v} = \\\\sigma \\\\left( \\\\sum_{{w \\\\in \\\\mathcal{N}(v)}} \\\\alpha_{{vw}} W x_{w} \\\\right)" />
        <p>
          By utilizing 4 attention heads (<code>heads=4</code>), the agent natively learns structural patterns in the AST, achieving perfect structural awareness and significantly out-performing sequential models.
        </p>
      </>
    )
  }
];

const Sidebar = ({ toggleTheme, isDark, isCollapsed, toggleCollapse }: { toggleTheme: () => void, isDark: boolean, isCollapsed: boolean, toggleCollapse: () => void }) => (
  <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="logo">
        <Link to="/" style={{ fontWeight: 700, fontSize: '1.2rem', border: 'none' }}>
          tarun.
        </Link>
      </div>
      <button 
        onClick={toggleCollapse}
        aria-label="Collapse Sidebar"
        style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', padding: '4px' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        </svg>
      </button>
    </div>
    <nav className="nav-links">
      <Link className="nav-link" to="/">Research</Link>
      <Link className="nav-link" to="/about">About</Link>
    </nav>
    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
        © 2026
      </div>
      <button 
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isDark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </button>
    </div>
  </aside>
);

const ResearchList = () => (
  <div className="main-content">
    <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent-color)', marginBottom: '2rem' }}>
      Selected Research
    </h2>
    <div className="article-list">
      {projects.map(project => (
        <div key={project.id} className="article-item">
          <span className="article-date">{project.date}</span>
          <Link to={`/research/${project.id}`} className="article-title">
            {project.title}
          </Link>
          <p className="article-preview">
            {project.summary}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const ResearchDetail = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) return <div className="main-content">Project not found.</div>;

  return (
    <div className="main-content">
      <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--accent-color)', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Research
      </Link>
      <span className="article-date" style={{ display: 'block' }}>{project.date}</span>
      <h1 style={{ marginBottom: '0.5rem' }}>{project.title}</h1>
      <div style={{ marginBottom: '2.5rem' }}>
        <a 
          href={project.github} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-color)', textDecoration: 'none', borderBottom: '1px solid var(--accent-color)' }}
        >
          VIEW REPOSITORY ON GITHUB ↗
        </a>
      </div>
      <div className="article-body">
        <project.content />
      </div>
    </div>
  );
};

const About = () => (
  <div className="main-content">
    <h1>About</h1>
    <div style={{ marginBottom: '3rem' }}>
      <p style={{ lineHeight: '1.7', opacity: 0.9 }}>
        I'm Tarun Nagarajan, an Undergraduate Student in Computer Science at NITW, Class of '28.
      </p>
      <p style={{ marginTop: '1.2rem', opacity: 0.9, lineHeight: '1.7' }}>
        My interests lie at the intersection of systems programming and machine learning. I want to work in AI Inference Research down the line, and I am currently working in efficient inference algorithms, selective precision in large language models, and the application of reinforcement learning architectures to autonomous systems optimization.
      </p>
    </div>

    <h2 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>
      Contact & Links
    </h2>
    <div style={{ marginTop: '2rem' }}>
      {[
        { label: 'Personal', value: 'tarun.greenville@gmail.com', href: 'mailto:tarun.greenville@gmail.com' },
        { label: 'College', value: 'tn24csb0a79@student.nitw.ac.in', href: 'mailto:tn24csb0a79@student.nitw.ac.in' },
        { label: 'LinkedIn', value: 'linkedin.com/in/nagarajan-tarun', href: 'https://www.linkedin.com/in/nagarajan-tarun' },
        { label: 'GitHub', value: 'github.com/TarunNagarajan', href: 'https://github.com/TarunNagarajan' }
      ].map((item, i) => (
        <div key={i} style={{ 
          display: 'flex', 
          alignItems: 'baseline', 
          padding: '0.75rem 0', 
          borderBottom: '1px solid var(--border-color)',
          fontSize: '0.95rem'
        }}>
          <span style={{ 
            width: '100px', 
            fontSize: '0.7rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            opacity: 0.5 
          }}>
            {item.label}
          </span>
          <a 
            href={item.href} 
            target={item.href.startsWith('http') ? "_blank" : undefined}
            rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
            style={{ fontWeight: 500, border: 'none' }}
          >
            {item.value}
          </a>
        </div>
      ))}
    </div>
  </div>
);

function App() {
  const [isDark, setIsDark] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Router>
      {isCollapsed && (
        <button 
          className="sidebar-toggle"
          onClick={toggleCollapse}
          aria-label="Toggle Sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}
      <Sidebar toggleTheme={toggleTheme} isDark={isDark} isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <Routes>
        <Route path="/" element={<ResearchList />} />
        <Route path="/about" element={<About />} />
        <Route path="/research/:id" element={<ResearchDetail />} />
      </Routes>
      
      {showTopBtn && (
        <button
          onClick={goToTop}
          aria-label="Back to Top"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            color: 'var(--text-color)',
            cursor: 'pointer',
            padding: '0.5rem 0.8rem',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            opacity: 0.8,
            transition: 'all 0.2s ease',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.borderColor = 'var(--accent-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.8';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          ↑ Top
        </button>
      )}
    </Router>
  );
}

export default App;
