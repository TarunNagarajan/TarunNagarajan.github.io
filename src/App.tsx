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
          The compilation phase-ordering problem—determining the optimal sequence of code-transforming optimization passes—is a combinatorial explosion in a non-Euclidean space. Modern compilers like GCC and LLVM bypass this NP-hard search space by employing static, heuristic-driven pipelines (e.g., <code>-O2</code>, <code>-O3</code>). These heuristics, while effective on average, fail to capture the unique <strong>topological invariants</strong> and <strong>data-flow semantics</strong> of specific high-performance kernels.
        </p>
        <p>
          This research treats compiler optimization as a continuous, non-stationary <strong>Markov Decision Process (MDP)</strong> and employs <strong>Hierarchical Multi-Agent Reinforcement Learning (HRL)</strong> to navigate the high-dimensional manifold of LLVM pass interactions. We frame the problem through the lens of <strong>Information Bottleneck Theory</strong>, seeking to compress the program representation while maximizing the mutual information with respect to the execution speedup.
        </p>
        
        <h2>Graph Topology and the Over-Smoothing Bottleneck</h2>
        <p>
          We model the LLVM Intermediate Representation (IR) as a unified property graph <InlineMath math="\\mathcal{G} = (V, E)" />. This graph is a heterogeneous construct containing the Control Flow Graph (CFG) and Data Dependence Graph (DDG). To resolve the tension between global context retrieval and local signal preservation, we engineered a <strong>Foveated Perception architecture</strong>. 
        </p>
        <p>
          In traditional GNNs, the <strong>over-smoothing phenomenon</strong> causes node features to converge to a stationary distribution as the number of layers <InlineMath math="L \\to \\infty" />, effectively losing the <strong>Jacobian sensitivity</strong> of individual instructions. Our foveated approach imposes a dual-resolution topology using an adaptive <code>block_map</code> that dynamically adjusts the <strong>spectral gap</strong> of the graph Laplacian <InlineMath math="\\Delta = D - A" />.
        </p>
        <p>
          In the <strong>Fovea</strong>, the mapping is strictly isomorphic (<InlineMath math="1:1" />). In the <strong>Periphery</strong>, instructions undergo <strong>Hierarchical Block Condensation (HBC)</strong> via a deterministic scatter-reduction. This can be viewed as an approximation of the <strong>Schur Complement</strong> of the graph Laplacian, reducing the dimensionality while preserving the <strong>effective resistance</strong> between key IR blocks:
        </p>
        <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', margin: '1.5rem 0' }}>
          <BlockMath math="X'_{active} = \\text{scatter\\_mean}(X, B)" />
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: 0.8 }}>
            where <InlineMath math="B \\in \\mathbb{N}^{|V|}" /> represents the dominance-frontier block assignment vector. This achieves an <strong>86% reduction in graph nodes</strong> while maintaining the <strong>homology</strong> of the original data-flow.
          </p>
        </div>

        <h2>Non-Commutative Algebra and Lie Brackets</h2>
        <p>
          A critical insight of this work is that compiler passes <InlineMath math="p_i, p_j" /> do not commute. That is, the <strong>Lie Bracket</strong> <InlineMath math="[p_i, p_j] = p_i p_j - p_j p_i \\neq 0" />. This non-commutativity defines the curvature of the optimization landscape. We employ a <strong>Recurrent Meta-Controller</strong> that learns to approximate the <strong>Baker-Campbell-Hausdorff formula</strong> for pass sequences, predicting the resultant transformation <InlineMath math="Z" /> such that:
        </p>
        <BlockMath math="e^{p_i} e^{p_j} = e^{p_i + p_j + \\frac{1}{2}[p_i, p_j] + \\dots}" />

        <h2>Fail-Safe Distributional Reasoning</h2>
        <p>
          To solve the gradient variance issues inherent in heterogeneous file scales (the "Linear Trap"), we implemented <strong>Categorical Distributional Reasoning</strong> using <strong>Two-Hot SymLog Binning</strong>. The continuous performance target <InlineMath math="y" /> is projected into a symmetric logarithmic space to compress the dynamic range of execution times:
        </p>
        <BlockMath math="z = \\text{sign}(y) \\cdot \\ln(1 + |y|)" />
        <p>
          The network predicts a categorical distribution <InlineMath math="\\hat{P}" /> over 255 discrete bins spanning <InlineMath math="[-20\\%, +20\\%]" />. The "Two-Hot" encoding distributes the probability mass <InlineMath math="P" /> to the nearest bins <InlineMath math="b_i, b_{i+1}" />. This ensures that the <strong>Kullback-Leibler (KL) Divergence</strong> between the predicted and target distributions is well-behaved even for extreme outliers:
        </p>
        <BlockMath math="P_{b_i} = 1 - \\text{dist}(z, b_i), \\quad P_{b_{i+1}} = 1 - P_{b_i}" />
        <p>
          The system is optimized via Cross-Entropy, which in this context acts as a <strong>Maximum Likelihood Estimator</strong> for the non-stationary reward distribution:
        </p>
        <BlockMath math="\\mathcal{L} = -\\sum_{b \\in \\mathcal{B}} P_b \\log(\\hat{P}_b)" />
        <p>
          By strictly bounding the gradients within <InlineMath math="[-1, 1]" />, we enforce <strong>Lipschitz continuity</strong> on the policy network, rendering numerical explosions mathematically impossible.
        </p>

        <h2>Action-State Attention Mechanics</h2>
        <p>
          We introduced a <strong>Multi-Head Cross-Attention</strong> module where the candidate optimization pass <InlineMath math="a" /> acts as a Query against the state vector <InlineMath math="s" />. This computes the <strong>relevance manifold</strong> of the IR:
        </p>
        <BlockMath math="\\text{Attention}(Q_a, K_s, V_s) = \\text{softmax}\\left(\\frac{Q_a K_s^T}{\\sqrt{d_k}}\\right)V_s" />
        <p>
          This allows the model to selectively "attend" to relevant sub-graphs based on the action being queried—focusing on <strong>loop-nest manifolds</strong> for unrolling passes or <strong>call-graph hierarchies</strong> for inlining.
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
          Standard uniform Post-Training Quantization (PTQ) triggers catastrophic <strong>feature collapse</strong> on reasoning-heavy tasks. This research formulates <strong>Task-Aware Selective Quantization</strong>, mathematically isolating the network sub-components that constitute the <strong>inductive biases</strong> necessary for specific cognitive domains.
        </p>

        <h2>Hessian Approximations and the Riemann Metric</h2>
        <p>
          To rigorously quantify parameter importance, we treat the neural network as a point on a <strong>Riemannian manifold</strong>. The <strong>Fisher Information Matrix (FIM)</strong> serves as the natural metric tensor for this space, providing a first-order approximation of the <strong>Hessian of the loss landscape</strong>. For a parameter <InlineMath math="\\theta" /> and task-specific distribution <InlineMath math="\\mathcal{D}" />, the empirical Fisher Information <InlineMath math="F(\\theta)" /> is:
        </p>
        <BlockMath math="F(\\theta) = \\mathbb{E}_{x \\sim \\mathcal{D}} \\left[ \\left( \\nabla_\\theta \\ln p(y|x, \\theta) \\right)^2 \\right]" />
        <p>
          We normalize sensitivity across asymmetric network layers using the <strong>Fisher Information Density</strong> <InlineMath math="\\rho_{F}" />. This allows us to identify <strong>critical points</strong> where the <strong>Shannon entropy</strong> of the weight distribution is most sensitive to precision reduction:
        </p>
        <BlockMath math="\\rho_{F} = \\frac{1}{|P|} \\sum_{\\theta \\in P} F(\\theta)" />
        
        <p>
          In <strong>Phi-2 (2.7B)</strong>, this revealed extreme densities in the final <strong>Coherence Gate (Layer 29)</strong>. Despite being numerically small, these weights possess a Fisher density 14x higher than the model average, indicating they are <strong>"load-bearing" parameters</strong> in the model's logical manifold.
        </p>

        <h2>Phase Shifts in Rotary Manifolds</h2>
        <p>
          Through qualitative analysis, we identified a failure mode termed <strong>Rotational Aliasing</strong>. Because Rotary Position Embeddings (RoPE) rely on precise <strong>unitary transformations</strong> in a complex space:
        </p>
        <BlockMath math="\\mathbf{q}'_m = \\mathbf{R}_m \\mathbf{q}_m, \\quad \\mathbf{k}'_n = \\mathbf{R}_n \\mathbf{k}_n" />
        <p>
          Quantizing the corresponding projection matrices <InlineMath math="W_q, W_k" /> introduces a <strong>phase shift</strong> <InlineMath math="\\delta" />. This causes distinct tokens to algebraically "alias" or collapse into a single manifold point when the <strong>inner product</strong> deviates significantly:
        </p>
        <BlockMath math="\\langle \\mathbf{q}'_m, \\mathbf{k}'_n \\rangle \\approx \\langle \\mathbf{q}_m, \\mathbf{k}_n \\rangle + \\epsilon(\\delta)" />
        <p>
          where <InlineMath math="\\epsilon(\\delta)" /> exceeds the <strong>softmax temperature</strong>, resulting in variable aliasing (e.g., the model losing the ability to distinguish between <InlineMath math="x_{i}" /> and <InlineMath math="x_{j}" /> in high-dimensional space).
        </p>

        <h2>Energy-Based Pruning and Singular Values</h2>
        <p>
          We further refine the quantization mask by performing <strong>Singular Value Decomposition (SVD)</strong> on the weight matrices <InlineMath math="W = U \\Sigma V^T" />. We preserve the <strong>topological energy</strong> of the matrix by keeping the top-k singular values in full precision:
        </p>
        <BlockMath math="E = \\frac{\\sum_{i=1}^k \\sigma_i^2}{\\sum_{j=1}^n \\sigma_j^2}" />
        <p>
          By maintaining <InlineMath math="E > 0.999" />, we ensure that the <strong>low-rank structure</strong> of the transformer's attention mechanism remains intact even at 4-bit quantization.
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
          Standard Transformers utilize a static computational graph for every token, regardless of its <strong>Kolmogorov complexity</strong>. This project breaks that constraint by implementing a <strong>Hierarchical Adaptive Transformer (HAT)</strong>, injecting token-level routing pathways that treat inference as a <strong>dynamic stopping problem</strong>.
        </p>

        <h2>Two-Dimensional RoutingGrid and Markov Chains</h2>
        <p>
          The system introduces two auxiliary trainable control mechanisms that define a <strong>stochastic computation pathway</strong>:
        </p>
        <ul>
          <li><strong>Vertical Early Exiting:</strong> Confidence gates <InlineMath math="g_d(h)" /> at strategic layers that estimate the <strong>posterior entropy</strong> of the token distribution.</li>
          <li><strong>Horizontal FFN Skipping:</strong> A router <InlineMath math="\\sigma(h)" /> that acts as a <strong>Bernoulli gate</strong>, bypassing the Feed-Forward Network when the hidden state <InlineMath math="h" /> has already converged to its local <strong>attractor basin</strong>.</li>
        </ul>

        <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', margin: '1.5rem 0' }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>Reparameterization & Gumbel-Softmax</h3>
          <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
            To maintain end-to-end differentiability, we employ the <strong>Gumbel-Softmax trick</strong>. This allows us to sample from a discrete routing distribution while propagating gradients via the <strong>reparameterization lemma</strong>:
          </p>
          <BlockMath math="z = \\text{softmax}\\left( \\frac{\\ln(\\pi) + g}{\\tau} \\right), \\quad g = -\\ln(-\\ln u)" />
          <p style={{ fontSize: '0.95rem', marginTop: '1rem', marginBottom: '1rem' }}>
            As the temperature <InlineMath math="\\tau \\to 0" />, the sample <InlineMath math="z" /> approaches a <strong>one-hot vector</strong>, effectively "freezing" the routing decision. To ensure the <strong>Lyapunov stability</strong> of the training process, we integrated a <strong>Z-Loss penalty</strong>:
          </p>
          <BlockMath math="\\mathcal{L}_z = \\alpha \\cdot \\frac{1}{N} \\sum_{i=1}^N \\left( \\ln \\sum_{j} e^{x_{ij}} \\right)^2" />
        </div>

        <h2>Pareto-Optimal Inference</h2>
        <p>
          Training is governed by a <strong>multi-objective optimization</strong> framework. We minimize the divergence from the original teacher model while simultaneously penalizing the <strong>FLOPs-cost</strong>. This defines a <strong>Pareto frontier</strong> between latency and perplexity:
        </p>
        <BlockMath math="\\mathcal{L}_{total} = \\mathcal{L}_{CE} + \\lambda_1 \\mathcal{L}_{efficiency} + \\lambda_2 \\mathcal{L}_{z} + \\lambda_3 \\mathcal{L}_{entropy}" />
        <p>
          This achieves an inference speedup of <strong><InlineMath math="1.5\\times - 1.8\\times" /></strong> by learning to allocate compute only to tokens with high <strong>information novelty</strong>.
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
          Boolean simplification is a fundamental problem in <strong>computational logic</strong> and circuit design. This project applies <strong>Deep Reinforcement Learning (DRL)</strong> to discover optimal simplification trajectories by treating the set of logical rewrite rules (e.g., De Morgan's laws, Absorption) as an <strong>action space</strong> in a <strong>Boolean Ring</strong> <InlineMath math="\\mathbb{F}_2[x_1, \\dots, x_n]" />.
        </p>

        <h2>Markov Decision Process on AST Manifolds</h2>
        <p>
          We frame the simplification process as an MDP where the reward <InlineMath math="R_t" /> is proportional to the <strong>literal reduction</strong>. The state space is the set of all possible <strong>Abstract Syntax Trees (ASTs)</strong> that are logically equivalent to the input. We seek a policy <InlineMath math="\\pi" /> that minimizes the <strong>circuit depth</strong> and <strong>gate count</strong>:
        </p>
        <BlockMath math="R_t = \\text{len}(S_t) - \\text{len}(S_{t+1})" />
        
        <h2>Graph Attention and Permutation Invariance</h2>
        <p>
          The core innovation is the use of a <strong>Graph Attention Network (GAT)</strong> to represent the formula. Unlike sequential models, GNNs are <strong>permutation-invariant</strong>, which matches the <strong>commutative and associative properties</strong> of boolean operators. Each node <InlineMath math="v" /> in the AST has an embedding <InlineMath math="x_v" /> updated via multi-head attention over its neighborhood <InlineMath math="\\mathcal{N}(v)" />:
        </p>
        <BlockMath math="\\alpha_{vw} = \\frac{\\exp(\\text{LeakyReLU}(\\vec{a}^T [W x_v || W x_w]))}{\\sum_{k \\in \\mathcal{N}(v)} \\exp(\\text{LeakyReLU}(\\vec{a}^T [W x_v || W x_k]))}" />
        <BlockMath math="x'_v = \\sigma \\left( \\sum_{w \\in \\mathcal{N}(v)} \\alpha_{vw} W x_w \\right)" />
        <p>
          By utilizing 4 attention heads (<code>heads=4</code>), the agent natively learns the <strong>structural symmetries</strong> of the AST. This allows it to identify <strong>sub-graph isomorphisms</strong> that correspond to redundant logical structures, achieving performance comparable to <strong>Quine-McCluskey algorithms</strong> but with <strong>sub-exponential time complexity</strong> in the average case.
        </p>

        <h2>Algebraic Generalization</h2>
        <p>
          We observed that the agent develops <strong>emergent heuristics</strong> that mirror <strong>Groebner Basis</strong> methods for polynomial simplification, indicating that the DRL agent is learning to navigate the <strong>algebraic variety</strong> defined by the boolean constraints.
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