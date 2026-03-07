import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';

const projects = [
  {
    id: 'compiler-opt',
    title: 'Hierarchical Multi-Agent RL for Compiler Optimization',
    date: 'Ongoing / March 2026',
    summary: 'Autonomous discovery of optimal LLVM compiler pass sequences using a hierarchical multi-agent framework.',
    github: 'https://github.com/TarunNagarajan/compiler-opt',
    content: () => (
      <>
        <p>
          Modern compilers like GCC and LLVM ship with hundreds of optimization passes, but selecting the right sequence remains a black art. The standard <code>-O2</code> and <code>-O3</code> flags apply a fixed, one-size-fits-all pipeline that often leaves performance on the table or worse, sometimes increases code size. 
        </p>
        <p>
          This project introduces a <strong>hierarchical multi-agent reinforcement learning</strong> architecture to autonomously discover optimal pass sequences by balancing competing objectives like execution speed, code size, and security.
        </p>
        
        <h2>The Foveated Perception Engine</h2>
        <p>
          To scale to industrial-size programs (e.g., 3.5MB+ LLVM modules) without losing fine-grained precision, I introduced a <strong>"Foveated" Graph Neural Network (GNN) architecture</strong>. Similar to human vision, the model maintains a high-resolution "Fovea" while condensing the "Periphery."
        </p>
        <ul>
          <li><strong>The Fovea (Hotspots):</strong> Functions currently being optimized are extracted with 1:1 precision. Every instruction is a unique node in the GNN, preserving 100% of the relational data-flow.</li>
          <li><strong>The Periphery (Context):</strong> The remainder of the program is condensed using Hierarchical Block Condensation (HBC). Multiple instructions are pooled into a single "Block-Node," providing global context at a fraction of the computational cost.</li>
        </ul>
        <p>
          This dual-fidelity approach achieves a <strong>3.05x speedup</strong> and an <strong>86% reduction in GNN nodes</strong> compared to flat architectures, enabling the model to "see" entire libraries while focusing high-precision resources on specific critical kernels.
        </p>

        <h2>Multi-Objective Negotiation & Reward Hacking</h2>
        <p>
          Instead of treating all 200+ LLVM passes equally, the system classifies them into macro-level strategic decisions and micro-level tactical passes. Four specialist agents (Performance, Size, Security, Speed) operate at the strategic level, negotiating through an attention-based protocol to find Pareto-optimal tradeoffs.
        </p>
        <p>
          A key finding of this research involved <strong>reward hacking</strong>. When agents were given a naive reward function (optimizing only for instruction count), they exploited loopholes, achieving lower actual optimization (17.0%). By implementing a "secure" agent with penalties for size bloat and pass repetition, the system achieved superior real-world optimization (19.7%) despite receiving lower absolute reward scores during training.
        </p>
      </>
    )
  },
  {
    id: 'early-exit',
    title: 'Hierarchical Adaptive Transformer',
    date: 'December 2025',
    summary: 'Dynamic computation pathways for TinyLlama-1.1B, allowing tokens to skip unnecessary layers or FFNs based on complexity.',
    github: 'https://github.com/TarunNagarajan/early-exit',
    content: () => (
      <>
        <p>
          Standard Transformer models utilize a fixed compute budget for every token, regardless of the token's complexity. This project implements a <strong>Hierarchical Adaptive Transformer</strong> framework that introduces dynamic computation pathways into pre-trained Large Language Models (specifically TinyLlama-1.1B).
        </p>

        <h2>Two-Dimensional Adaptive Strategy</h2>
        <p>
          The architecture wraps a frozen base model and introduces trainable control layers to enable a two-dimensional adaptive strategy for reducing inference latency:
        </p>
        <ul>
          <li><strong>Vertical Adaptation (Depth):</strong> "Exit Gates" are inserted at specific depths (Layers 4, 8, 12, 16, 19). These lightweight MLPs act as binary classifiers. Tokens may terminate processing at these strategic intermediate layers if the model is sufficiently confident in its hidden state representation.</li>
          <li><strong>Horizontal Adaptation (Width):</strong> For tokens that do not exit early, a "Router" determines whether the computationally expensive Feed-Forward Network (FFN) sub-layer is necessary. The system targets a specific capacity (e.g., 55%), meaning approximately 45% of FFN computations are dynamically skipped.</li>
        </ul>

        <h2>Training and Results</h2>
        <p>
          Training is conducted in two distinct phases (Router Training, then Exit Gate Training) to ensure stability and prevent collapse scenarios where models either exit immediately or never exit. The implementation is explicitly designed for stability in mixed-precision environments (FP16/FP32).
        </p>
        <p>
          By leveraging the inherent sparsity of language modeling tasks, this approach successfully targets an inference speedup of <strong>1.5x–1.8x</strong> while maintaining minimal degradation in perplexity (under 12%).
        </p>
      </>
    )
  },
  {
    id: 'task-quant',
    title: 'TaskQuant: Selective Quantization for LLMs',
    date: 'November 2025',
    summary: 'Task-aware selective quantization strategy for Microsoft Phi-2 and Llama-3 that preserves structural "load-bearing" components.',
    github: 'https://github.com/TarunNagarajan/TaskQuant',
    content: () => (
      <>
        <p>
          Standard post-training quantization methods often degrade model performance on reasoning-heavy tasks by applying uniform compression policies. This project investigates <strong>Task-Aware Selective Quantization</strong> on Microsoft Phi-2 (2.7B) and Llama-3 (3B), leveraging Fisher Information metrics to identify and preserve the "structural load-bearing" components of the models.
        </p>

        <h2>Model Dynamics & Sensitivity Physics</h2>
        <p>
          The Fisher Information maps generated in this study reveal distinct "physics" for different architectures. These sensitivity scores correlate directly with the functional roles of specific layers and the cognitive demands of the tasks (like GSM8K).
        </p>
        
        <div style={{ margin: '2rem 0' }}>
          <img src="/images/taskquant/phi_quantization.png" alt="Phi-2 Quantization Regions" style={{ maxWidth: '100%', height: 'auto', border: '1px solid var(--border-color)' }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-color)', marginTop: '0.5rem' }}>Figure 1: Fisher Information sensitivity map for Phi-2 on GSM8K, highlighting the "Bottom-Heavy, Top-Heavy" structure.</p>
        </div>

        <p>
          <strong>Phi-2</strong> operates as a "bottom-heavy, top-heavy" system. It starts with unusually high sensitivity in the very first Value Projection (Layer 0), which acts as working memory to bind raw token integers. The most critical phase transition happens at Layer 29 (the "coherence gate"). If we quantize this layer, we sever the link between the prompt's instructions and the generation, leading to hallucinations.
        </p>

        <div style={{ margin: '2rem 0' }}>
          <img src="/images/taskquant/llama_quantization.png" alt="Llama-3 3B Quantization Regions" style={{ maxWidth: '100%', height: 'auto', border: '1px solid var(--border-color)' }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-color)', marginTop: '0.5rem' }}>Figure 2: Fisher Information sensitivity map for Llama-3 3B, revealing the critical Layer 1 "Filter" anomaly.</p>
        </div>

        <p>
          <strong>Llama-3 3B</strong>, on the other hand, is a filter-dependent machine. Its most striking feature is a massive anomaly in Layer 1, which functions as a high-pass filter to clean up noise from the initial expansion. Relying on simple weight magnitude for quantization would destroy this early noise filter, rendering deep knowledge layers inaccessible due to upstream signal corruption.
        </p>

        <h2>Feature Collapse</h2>
        <p>
          An examination of the reasoning traces revealed a specific failure mode: <strong>Feature Collapse</strong>. In both models, Selective Quantization (prioritizing Fisher Information) often failed when handling repetitive variables (e.g., merging two distinct "3"s in a math problem into a single entity). This highlights a subtle limitation of Fisher-based selection: it optimizes for global loss reduction, inadvertently sacrificing the local redundancy needed for precise variable tracking in repetitive contexts.
        </p>
      </>
    )
  },
  {
    id: 'boolrl',
    title: 'boolrl: DRL for Boolean Simplification',
    date: 'August 2025',
    summary: 'Investigating Deep Reinforcement Learning architectures (MLP, LSTM, GNN) for simplifying complex boolean expressions.',
    github: 'https://github.com/TarunNagarajan/boolrl',
    content: () => (
      <>
        <p>
          This project explores the application of Deep Reinforcement Learning (DRL) to the classical computer science problem of simplifying boolean expressions. The goal is to train an agent that can autonomously apply logical simplification rules to reduce the complexity of a given boolean formula.
        </p>

        <h2>Architectural Comparisons</h2>
        <p>
          The core focus of the research is comparing how different state representations affect the agent's ability to learn and apply greedy simplification strategies. Three distinct architectures were implemented and evaluated:
        </p>
        <ul>
          <li><strong>MLP-based Agent:</strong> A standard Deep Q-Network (DQN) using a feature vector (e.g., operator counts, expression depth) to represent the state. While basic, this agent achieved a baseline accuracy of around 63%.</li>
          <li><strong>Sequence-based Agent (LSTM):</strong> This approach models the boolean expression as a sequence of tokens, allowing the Long Short-Term Memory network to capture some of the structural context of the formula.</li>
          <li><strong>GNN-based Agent:</strong> The most advanced implementation uses a Graph Neural Network to represent the boolean expression directly as an Abstract Syntax Tree (AST). </li>
        </ul>

        <h2>Findings</h2>
        <p>
          The findings demonstrate that while flat feature vectors can yield moderate success, the <strong>GNN-based agent is significantly more powerful</strong>. By directly ingesting the graph structure of the AST, the GNN agent can learn the hierarchical and relational dependencies between logical operators, making it the most effective architecture for tackling the structural complexity inherent in boolean simplification.
        </p>
      </>
    )
  }
];

const Sidebar = ({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) => (
  <aside className="sidebar">
    <div className="logo">
      <Link to="/" style={{ fontWeight: 700, fontSize: '1.2rem', border: 'none' }}>
        tarun.
      </Link>
    </div>
    <nav className="nav-links">
      <Link className="nav-link" to="/">Home</Link>
      <Link className="nav-link" to="/research">Research</Link>
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

const Home = () => (
  <div className="main-content">
    <h1>Exploring efficient machine learning and systems optimization.</h1>
    <p>
      I am a researcher focused on Large Language Model optimization, reinforcement learning, 
      and compiler design. This space documents my work in making models faster, 
      smaller, and more intelligent through selective computation and architectural efficiency.
    </p>
    
    <h2 style={{ marginTop: '4rem' }}>Featured Research</h2>
    <div className="article-list">
      {projects.slice(0, 2).map(project => (
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

const ResearchList = () => (
  <div className="main-content">
    <h1>Selected Research</h1>
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
      <Link to="/research" style={{ fontSize: '0.8rem', color: 'var(--accent-color)', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Research
      </Link>
      <span className="article-date" style={{ display: 'block' }}>{project.date}</span>
      <h1>{project.title}</h1>
      <div style={{ marginBottom: '2rem' }}>
        <a 
          href={project.github} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--accent-color)' }}
        >
          [ GITHUB ]
        </a>
      </div>
      <div className="article-body">
        <project.content />
        
        <div style={{ marginTop: '3rem' }}>
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ fontSize: '0.9rem', fontWeight: 700 }}
          >
            [ VIEW ON GITHUB ]
          </a>
        </div>
      </div>
    </div>
  );
};

const About = () => (
  <div className="main-content">
    <h1>About</h1>
    <p>
      I am an undergraduate researcher and a Computer Science student at NIT Warangal (Class of '28).
    </p>
    <p>
      Currently, I am studying and investigating the intersections of systems programming and machine learning. 
      My research focus includes developing adaptive computation pathways, exploring selective precision through 
      quantization, and utilizing reinforcement learning for autonomous compiler optimization.
    </p>
    <h2 style={{ marginTop: '2rem' }}>Contact</h2>
    <p>Email: <a href="mailto:tarun.greenville@gmail.com">tarun.greenville@gmail.com</a></p>
    <p>GitHub: <a href="https://github.com/TarunNagarajan" target="_blank" rel="noopener noreferrer">@TarunNagarajan</a></p>
  </div>
);

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <Router>
      <Sidebar toggleTheme={toggleTheme} isDark={isDark} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/research" element={<ResearchList />} />
        <Route path="/research/:id" element={<ResearchDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
